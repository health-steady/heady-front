/**
 * API에서 받은 데이터를 HealthReport 컴포넌트에서 사용할 수 있는 형식으로 변환하는 유틸리티 함수
 */

/**
 * API 응답 데이터를 HealthReport 컴포넌트에서 사용할 수 있는 형식으로 변환
 *
 * @param {Object} apiData - API에서 받은 응답 데이터
 * @returns {Object} HealthReport 컴포넌트에서 사용할 데이터
 */
export const transformApiDataForReport = (apiData) => {
  if (!apiData) {
    console.error("API 데이터가 없습니다.");
    return null;
  }

  // 사용자 정보 변환
  const userInfo = transformUserInfo(apiData.memberResponse);

  // 혈당 데이터 변환
  const glucoseData = transformGlucoseData(apiData.bloodSugarWithMealResponse);

  // 영양소 데이터 변환
  const nutrientData =
    apiData.dailyNutrients && apiData.dailyNutrients.length > 0
      ? transformNutrientData(apiData.dailyNutrients)
      : generateNutrientData(apiData.bloodSugarWithMealResponse);

  // 음식 데이터 변환
  const foodData = transformFoodData(apiData.bloodSugarWithMealResponse);

  // 음식이 혈당에 미치는 영향 데이터 생성
  const foodImpactData = calculateFoodImpactData(
    apiData.bloodSugarWithMealResponse
  );

  // 분석 결과 변환
  const analysisResults = {
    glucoseAnalysis: apiData.bloodSugarAnalysis || "",
    dietAnalysis: apiData.dietAnalysis || "",
    recommendedActions: apiData.recommendedActionPlan || [],
  };

  return {
    userInfo,
    glucoseData,
    foodData,
    nutrientData,
    analysisResults,
    foodImpactData,
  };
};

/**
 * 사용자 정보 변환
 */
const transformUserInfo = (memberResponse) => {
  if (!memberResponse) return null;

  // 생년월일로 나이 계산
  const birthdate = new Date(memberResponse.birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  // BMI 계산 (체중(kg) / 키(m)^2)
  const heightInMeters = memberResponse.height / 100;
  const bmi = memberResponse.weight / (heightInMeters * heightInMeters);

  // 성별 (임의 설정 - API에서 제공하지 않음)
  const gender = "남성"; // 기본값 설정

  // 목표 혈당 (target 정보에서 가져옴)
  const targetGlucose = memberResponse.target?.postprandialBloodSugar || 140;

  return {
    age: age,
    gender: gender,
    height: memberResponse.height,
    weight: memberResponse.weight,
    bmi: bmi,
    targetGlucose: targetGlucose,
  };
};

/**
 * 혈당 데이터 변환 - 일주일치 데이터가 모두 반영되도록 개선
 */
const transformGlucoseData = (bloodSugarData) => {
  if (!bloodSugarData || !Array.isArray(bloodSugarData)) return [];

  // 날짜별로 정렬
  const sortedData = [...bloodSugarData].sort((a, b) => {
    return new Date(a.measuredAt) - new Date(b.measuredAt);
  });

  return sortedData.map((item) => {
    const measuredDate = new Date(item.measuredAt);

    return {
      date: measuredDate.toISOString().split("T")[0], // YYYY-MM-DD 형식
      time: measuredDate.toTimeString().substring(0, 5), // HH:MM 형식
      value: item.level,
      mealType: item.mealType || "UNKNOWN",
    };
  });
};

/**
 * 음식 데이터 변환
 */
const transformFoodData = (bloodSugarData) => {
  if (!bloodSugarData || !Array.isArray(bloodSugarData)) return [];

  const foodData = [];

  // 식사 정보가 있는 항목만 처리
  bloodSugarData.forEach((item) => {
    if (item.meal && item.meal.foods && item.meal.foods.length > 0) {
      // 각 음식마다 데이터 생성
      item.meal.foods.forEach((food) => {
        // 임의의 영양소 데이터 생성 (실제로는 API에서 제공되어야 함)
        const carbsPerFood = Math.floor(Math.random() * 50) + 30; // 30-80g
        const proteinPerFood = Math.floor(Math.random() * 15) + 5; // 5-20g
        const fatPerFood = Math.floor(Math.random() * 10) + 5; // 5-15g
        const caloriesPerFood =
          carbsPerFood * 4 + proteinPerFood * 4 + fatPerFood * 9;
        const glycemicIndex = Math.floor(Math.random() * 40) + 60; // 60-100

        // 식후 혈당 가져오기
        const glucoseAfter =
          item.measureType === "AFTER_MEAL" ? item.level : null;

        const measuredDate = new Date(item.measuredAt);

        foodData.push({
          name: food.name,
          carbs: carbsPerFood,
          protein: proteinPerFood,
          fat: fatPerFood,
          calories: caloriesPerFood,
          glycemicIndex: glycemicIndex,
          date: measuredDate.toISOString().split("T")[0],
          time: measuredDate.toTimeString().substring(0, 5),
          glucoseAfter: glucoseAfter,
        });
      });
    }
  });

  return foodData;
};

/**
 * API에서 제공하는 영양소 데이터 변환
 */
const transformNutrientData = (dailyNutrients) => {
  if (!dailyNutrients || !Array.isArray(dailyNutrients)) return [];

  return dailyNutrients.map((item) => {
    return {
      date: item.date,
      carbs: item.nutrient.carbohydrate,
      protein: item.nutrient.protein,
      fat: item.nutrient.fat,
      calories:
        item.nutrient.carbohydrate * 4 +
        item.nutrient.protein * 4 +
        item.nutrient.fat * 9,
    };
  });
};

/**
 * 영양소 데이터 생성 (일별 합계) - dailyNutrients가 없을 경우 사용하는 백업 함수
 */
const generateNutrientData = (bloodSugarData) => {
  if (!bloodSugarData || !Array.isArray(bloodSugarData)) return [];

  // 일자별 데이터를 저장할 객체
  const dailyNutrients = {};

  // 모든 혈당 데이터를 순회하면서 날짜별로 그룹화
  bloodSugarData.forEach((item) => {
    if (item.meal && item.meal.foods && item.meal.foods.length > 0) {
      const measuredDate = new Date(item.measuredAt);
      const dateKey = measuredDate.toISOString().split("T")[0]; // YYYY-MM-DD

      // 해당 날짜 항목이 없으면 초기화
      if (!dailyNutrients[dateKey]) {
        dailyNutrients[dateKey] = {
          date: dateKey,
          carbs: 0,
          protein: 0,
          fat: 0,
          calories: 0,
        };
      }

      // 각 음식의 영양소를 합산 (임의 데이터)
      item.meal.foods.forEach(() => {
        const carbsPerFood = Math.floor(Math.random() * 50) + 30;
        const proteinPerFood = Math.floor(Math.random() * 15) + 5;
        const fatPerFood = Math.floor(Math.random() * 10) + 5;
        const caloriesPerFood =
          carbsPerFood * 4 + proteinPerFood * 4 + fatPerFood * 9;

        dailyNutrients[dateKey].carbs += carbsPerFood;
        dailyNutrients[dateKey].protein += proteinPerFood;
        dailyNutrients[dateKey].fat += fatPerFood;
        dailyNutrients[dateKey].calories += caloriesPerFood;
      });
    }
  });

  // 객체를 배열로 변환하여 반환
  return Object.values(dailyNutrients);
};

/**
 * 음식이 혈당에 미치는 영향 데이터 계산 - 중복 음식 통합 및 평균 혈당 상승 효과 계산
 */
const calculateFoodImpactData = (bloodSugarData) => {
  if (!bloodSugarData || !Array.isArray(bloodSugarData)) return [];

  // 식사 정보와 혈당 정보를 연결하기 위한 맵
  const mealGlucoseMap = new Map();

  // 식사 전후 혈당 데이터 매핑
  bloodSugarData.forEach((item) => {
    if (item.meal) {
      const mealId = item.meal.id;
      if (!mealGlucoseMap.has(mealId)) {
        mealGlucoseMap.set(mealId, {
          mealInfo: item.meal,
          before: null,
          after: null,
        });
      }

      const mealData = mealGlucoseMap.get(mealId);
      if (
        item.measureType === "BEFORE_MEAL" ||
        item.measureType === "FASTING"
      ) {
        mealData.before = item.level;
      } else if (item.measureType === "AFTER_MEAL") {
        mealData.after = item.level;
      }
    }
  });

  // 중복 없는 음식 목록 생성 및 각 음식별 혈당 영향 계산
  const uniqueFoodImpactMap = new Map();

  mealGlucoseMap.forEach((mealData) => {
    const { mealInfo, before, after } = mealData;
    if (
      mealInfo.foods &&
      mealInfo.foods.length > 0 &&
      before !== null &&
      after !== null
    ) {
      const glucoseChange = after - before;
      const foodCount = mealInfo.foods.length;

      // 각 음식에 혈당 변화를 균등하게 분배
      const changePerFood = glucoseChange / foodCount;

      mealInfo.foods.forEach((food) => {
        const foodName = food.name;

        if (!uniqueFoodImpactMap.has(foodName)) {
          uniqueFoodImpactMap.set(foodName, {
            name: foodName,
            occurrences: 0,
            totalGlucoseImpact: 0,
            totalCarbs: 0,
            glycemicIndex: 0,
          });
        }

        const foodData = uniqueFoodImpactMap.get(foodName);
        foodData.occurrences += 1;
        foodData.totalGlucoseImpact += changePerFood;

        // 임의의 탄수화물 데이터 (실제로는 API에서 제공되어야 함)
        const carbsPerFood = Math.floor(Math.random() * 50) + 30;
        foodData.totalCarbs += carbsPerFood;

        // 임의의 혈당지수 (실제로는 API에서 제공되어야 함)
        const glycemicIndex = Math.floor(Math.random() * 40) + 60;
        foodData.glycemicIndex += glycemicIndex;
      });
    }
  });

  // 최종 음식 영향 데이터 형식으로 변환
  return Array.from(uniqueFoodImpactMap.values()).map((foodData) => ({
    name: foodData.name,
    glucoseImpact: Math.round(
      foodData.totalGlucoseImpact / foodData.occurrences
    ),
    carbs: Math.round(foodData.totalCarbs / foodData.occurrences),
    glycemicIndex: Math.round(foodData.glycemicIndex / foodData.occurrences),
    occurrences: foodData.occurrences,
  }));
};
