// 혈당 측정 유형을 한글로 변환하는 함수
export const getMeasureTypeLabel = (measureType: string): string => {
  switch (measureType) {
    case "BEFORE_MEAL":
      return "식전";
    case "AFTER_MEAL":
      return "식후";
    case "BEDTIME":
      return "취침 전";
    case "RANDOM":
      return "임의";
    case "FASTING":
      return "공복";
    default:
      return "";
  }
};

// 식사 타입을 한글로 변환하는 함수
export const getMealTypeLabel = (mealType: string): string => {
  switch (mealType) {
    case "BREAKFAST":
      return "아침";
    case "LUNCH":
      return "점심";
    case "DINNER":
      return "저녁";
    case "SNACK":
      return "간식";
    case "NONE":
      return "";
    default:
      return "";
  }
};

// 혈당 측정 유형과 식사 타입을 조합해서 한글로 반환하는 함수
export const getBloodSugarTypeLabel = (
  measureType: string,
  mealType: string
): string => {
  const measureTypeLabel = getMeasureTypeLabel(measureType);
  const mealTypeLabel = getMealTypeLabel(mealType);

  // NONE인 경우나 측정 유형이 BEDTIME, RANDOM, FASTING인 경우에는 식사 타입을 표시하지 않음
  if (
    mealType === "NONE" ||
    measureType === "BEDTIME" ||
    measureType === "RANDOM" ||
    measureType === "FASTING"
  ) {
    return measureTypeLabel;
  }

  return `${mealTypeLabel} ${measureTypeLabel}`;
};
