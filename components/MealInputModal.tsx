import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { mealService, FoodInfo } from "../services/meal";
import { foodService, FoodDto } from "../services/food";
import Pagination from "./Pagination";
import Swal from "sweetalert2";

export interface MealInputData {
  mealTime: string;
  food: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  time: {
    hour: string;
    minute: string;
    period: string;
  };
  memo: string;
}

interface MealInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedDate: Date;
}

export default function MealInputModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}: MealInputModalProps) {
  // 현재 시간을 기본값으로 설정
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-based이므로 +1
  const currentDay = now.getDate();
  const currentHour = now.getHours() % 12 || 12; // 12시간제로 변환
  const currentMinute = Math.floor(now.getMinutes() / 5) * 5; // 5분 단위로 내림
  const currentPeriod = now.getHours() >= 12 ? "오후" : "오전";

  const [mealData, setMealData] = useState<MealInputData>({
    mealTime: "",
    food: "",
    date: {
      year: `${currentYear}년`,
      month: `${currentMonth}월`,
      day: `${currentDay}일`,
    },
    time: {
      hour: `${currentHour}시`,
      minute: `${currentMinute.toString().padStart(2, "0")}분`,
      period: currentPeriod,
    },
    memo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [foodList, setFoodList] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodInfo[]>([]);
  const [memo, setMemo] = useState("");
  const [searchResults, setSearchResults] = useState<FoodDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // 모달이 열릴 때마다 초기화
    if (isOpen) {
      // 콘솔 로그 추가
      console.log("모달이 열렸습니다. 상태 초기화");

      setFoodList([]);
      setSelectedFoods([]);
      setMemo("");
      setSearchTerm("");
      setSearchResults([]);

      // 모달이 열릴 때마다 현재 시간으로 초기화
      const refreshNow = new Date();
      const refreshHour = refreshNow.getHours() % 12 || 12;
      const refreshMinute = Math.floor(refreshNow.getMinutes() / 5) * 5;
      const refreshPeriod = refreshNow.getHours() >= 12 ? "오후" : "오전";

      setMealData({
        ...mealData,
        food: "",
        mealTime: "",
        date: {
          year: `${refreshNow.getFullYear()}년`,
          month: `${refreshNow.getMonth() + 1}월`,
          day: `${refreshNow.getDate()}일`,
        },
        time: {
          hour: `${refreshHour}시`,
          minute: `${refreshMinute.toString().padStart(2, "0")}분`,
          period: refreshPeriod,
        },
        memo: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (foodList.length === 0 && selectedFoods.length === 0) {
      console.error("최소 하나의 음식을 입력해주세요.");
      return;
    }

    console.log("===== 제출 전 데이터 확인 =====");
    console.log("선택된 음식 상태(selectedFoods):", selectedFoods);
    console.log("음식 리스트 상태(foodList):", foodList);

    try {
      // 시간 데이터 포맷팅
      const hour = parseInt(mealData.time.hour.replace("시", ""));
      const minute = parseInt(mealData.time.minute.replace("분", ""));
      const isPM = mealData.time.period === "오후";
      const formattedHour = isPM
        ? hour === 12
          ? 12
          : hour + 12
        : hour === 12
        ? 0
        : hour;
      const timeString = `${formattedHour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      // 날짜 데이터 포맷팅
      const year = parseInt(mealData.date.year);
      const month = parseInt(mealData.date.month);
      const day = parseInt(mealData.date.day);
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      // 식사 시간 매핑
      const mealTypeMap: { [key: string]: string } = {
        아침: "BREAKFAST",
        점심: "LUNCH",
        저녁: "DINNER",
      };

      // 선택된 음식(검색으로 추가한 음식) 목록 복사
      console.log("API 요청 전 selectedFoods:", selectedFoods);
      const allFoods = [...selectedFoods];

      // foodList에 있지만 selectedFoods에 없는 항목들은 직접 입력한
      // 음식들이므로 null 코드와 함께 추가
      const directInputFoods: FoodInfo[] = [];

      foodList.forEach((foodName) => {
        // selectedFoods에 없는 음식만 직접 입력으로 간주
        if (!selectedFoods.some((food) => food.name === foodName)) {
          const directInputFood = { code: null, name: foodName };
          directInputFoods.push(directInputFood);
          allFoods.push(directInputFood);
        }
      });

      console.log("직접 입력한 음식:", directInputFoods);
      console.log("최종 API 전송 데이터(foods):", allFoods);

      // API 요청 데이터 준비
      const requestData = {
        mealType: mealTypeMap[mealData.mealTime] as
          | "BREAKFAST"
          | "LUNCH"
          | "DINNER",
        mealDateTime: `${formattedDate} ${timeString}`,
        foods: allFoods,
        memo: memo,
      };

      console.log("최종 API 요청 데이터:", requestData);

      const response = await mealService.createMeal(requestData);
      console.log("API 응답:", response);

      onClose();
      onSubmit(response);
    } catch (error: any) {
      console.error("식사 기록 저장 실패:", error);

      // 400 에러 응답 처리
      if (error.response && error.response.status === 400) {
        // 응답 메시지 또는 상세 에러 정보를 Sweet Alert으로 표시
        let errorMessage =
          "요청 처리 중 오류가 발생했습니다. (400 Bad Request)";

        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          errorMessage = error.response.data;
        }

        Swal.fire({
          title: "오류",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#000000",
          customClass: {
            container: "swal-overlay-z-index",
          },
        });

        // 스타일 추가 - SweetAlert2의 z-index 증가
        const style = document.createElement("style");
        style.innerHTML = `
          .swal-overlay-z-index {
            z-index: 10000 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMealData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (
    section: "date" | "time",
    field: string,
    value: string
  ) => {
    setMealData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFoodSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setIsSearching(true);
      // 검색 시 페이지 번호를 1로 리셋
      setSearchPage(1);
      const result = await foodService.searchFoods({
        keyword: searchTerm,
        pageNo: 1, // 항상 첫 페이지부터 검색
        pageSize: 10,
      });

      console.log("Search results:", result);

      if (result) {
        // content 배열 처리
        if (result.content && Array.isArray(result.content)) {
          setSearchResults(result.content);
        } else {
          setSearchResults([]);
        }

        // page 객체에서 totalPages 가져오기
        if (result.page) {
          setTotalPages(result.page.totalPages || 1);
          // API는 0-indexed 페이지 번호를 사용하므로 1을 더해줍니다
          setSearchPage((result.page.number || 0) + 1);
        } else if (typeof result.totalPages === "number") {
          // 기존 구조도 지원
          setTotalPages(result.totalPages);
        } else {
          setTotalPages(1);
        }
      } else {
        setSearchResults([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("음식 검색 실패:", error);
      setSearchResults([]);
      setTotalPages(1);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFood = (food: FoodDto) => {
    console.log("음식 선택됨:", food);

    // 이미 선택된 음식인지 확인
    const isDuplicate = foodList.includes(food.name);
    if (isDuplicate) {
      console.log("이미 선택된 음식입니다:", food.name);
      return;
    }

    // foodList에 음식 이름 추가
    const newFoodList = [...foodList, food.name];
    setFoodList(newFoodList);

    // selectedFoods 배열에 코드와 이름을 함께 추가
    const foodInfo: FoodInfo = { code: food.code, name: food.name };
    const newSelectedFoods = [...selectedFoods, foodInfo];

    console.log("선택된 음식 추가:", foodInfo);
    console.log("기존 selectedFoods:", selectedFoods);
    console.log("새로운 selectedFoods:", newSelectedFoods);

    setSelectedFoods(newSelectedFoods);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchPage(newPage);

    // 페이지가 변경되면 해당 페이지의 결과를 가져옴
    setIsSearching(true);
    foodService
      .searchFoods({
        keyword: searchTerm,
        pageNo: newPage, // 페이지 번호는 API에서 1부터 시작하므로 그대로 사용
        pageSize: 10,
      })
      .then((result) => {
        console.log("Page change results:", result);

        if (result) {
          // content 배열 처리
          if (result.content && Array.isArray(result.content)) {
            setSearchResults(result.content);
          } else {
            setSearchResults([]);
          }

          // page 객체에서 totalPages 가져오기
          if (result.page) {
            setTotalPages(result.page.totalPages || 1);
            // API는 0-indexed 페이지 번호를 사용하므로 1을 더해줍니다
            setSearchPage((result.page.number || 0) + 1);
          } else if (typeof result.totalPages === "number") {
            // 기존 구조도 지원
            setTotalPages(result.totalPages);
          } else {
            setTotalPages(1);
          }
        } else {
          setSearchResults([]);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        console.error("페이지 변경 중 오류:", error);
        setSearchResults([]);
        setTotalPages(1);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const handleAddFood = () => {
    if (mealData.food.trim()) {
      const foodName = mealData.food.trim();
      setFoodList([...foodList, foodName]);
      // 직접 입력한 음식은 selectedFoods에 추가하지 않고
      // 나중에 handleSubmit에서 null 코드와 함께 추가됨
      setMealData((prev) => ({ ...prev, food: "" }));
    }
  };

  const handleRemoveFood = (index: number) => {
    // 제거할 음식 이름 가져오기
    const foodNameToRemove = foodList[index];

    // 음식 리스트에서 제거
    const newFoodList = foodList.filter((_, i) => i !== index);
    setFoodList(newFoodList);

    // 선택된 음식 목록에서 해당 이름의 음식 제거
    const newSelectedFoods = selectedFoods.filter(
      (food) => food.name !== foodNameToRemove
    );
    setSelectedFoods(newSelectedFoods);
  };

  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFoodSearch(e as any);
    }
  };

  const renderPageNumbers = () => {
    console.log(
      "Rendering page numbers. Current page:",
      searchPage,
      "Total pages:",
      totalPages
    );

    const pageNumbers: JSX.Element[] = [];
    const maxPageButtons = 5; // 한 번에 표시할 최대 페이지 버튼 수

    if (totalPages <= 1) return pageNumbers;

    let startPage = Math.max(1, searchPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // 시작 페이지가 조정된 경우, 종료 페이지도 다시 계산
    if (endPage - startPage + 1 < maxPageButtons && endPage < totalPages) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    console.log("Rendering pages from", startPage, "to", endPage);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          type="button"
          onClick={() => handleChangePage(i)}
          className={`w-7 h-7 flex items-center justify-center text-xs rounded mx-0.5 font-medium ${
            searchPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-xl">식사 기록하기</h2>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          <form id="mealForm" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                식사 시간
              </label>
              <select
                name="mealTime"
                value={mealData.mealTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                {" "}
                <option value="">선택해주세요</option>{" "}
                <option value="아침">아침</option>{" "}
                <option value="점심">점심</option>{" "}
                <option value="저녁">저녁</option>{" "}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.date.year}
                  onChange={(e) =>
                    handleDateTimeChange("date", "year", e.target.value)
                  }
                >
                  <option value={`${currentYear}년`}>{currentYear}년</option>
                  <option value={`${currentYear - 1}년`}>
                    {currentYear - 1}년
                  </option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.date.month}
                  onChange={(e) =>
                    handleDateTimeChange("date", "month", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={`${month}월`}>
                      {month}월
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.date.day}
                  onChange={(e) =>
                    handleDateTimeChange("date", "day", e.target.value)
                  }
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={`${day}일`}>
                      {day}일
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시간
              </label>
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.time.period}
                  onChange={(e) =>
                    handleDateTimeChange("time", "period", e.target.value)
                  }
                >
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.time.hour}
                  onChange={(e) =>
                    handleDateTimeChange("time", "hour", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={`${hour}시`}>
                      {hour}시
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.time.minute}
                  onChange={(e) =>
                    handleDateTimeChange("time", "minute", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <option
                      key={minute}
                      value={`${minute.toString().padStart(2, "0")}분`}
                    >
                      {minute.toString().padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  음식 {isSearchMode ? "검색" : "직접 입력"}
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-500"
                  onClick={() => setIsSearchMode(!isSearchMode)}
                >
                  {isSearchMode ? "직접 입력" : "검색으로 돌아가기"}
                </button>
              </div>

              {isSearchMode ? (
                <div className="space-y-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearchInputKeyDown}
                      placeholder="음식명을 입력하세요"
                      className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleFoodSearch}
                      className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {isSearching ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      <p className="mt-2 text-sm text-gray-600">검색 중...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-48 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-xs text-gray-500">
                                식품명
                              </th>
                              <th className="px-3 py-2 text-xs text-gray-500">
                                제조사
                              </th>
                              <th className="px-3 py-2 text-xs text-gray-500"></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {searchResults.map((food) => (
                              <tr
                                key={food.code}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  handleSelectFood(food);
                                  setSearchResults([]); // 검색 결과 초기화
                                  setSearchTerm(""); // 검색어 초기화
                                }}
                              >
                                <td className="px-3 py-2 text-sm">
                                  {food.name}
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-500">
                                  {food.manufacturerName}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <span className="text-xs text-blue-500">
                                    선택
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalPages > 1 && (
                        <Pagination
                          currentPage={searchPage}
                          totalPages={totalPages}
                          onPageChange={handleChangePage}
                        />
                      )}
                    </div>
                  ) : searchTerm && !isSearching ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      검색 결과가 없습니다
                    </div>
                  ) : null}

                  {foodList.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        추가된 음식
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {foodList.map((food, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                          >
                            <span>{food}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFood(index)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="food"
                      value={mealData.food}
                      onChange={handleChange}
                      placeholder="드신 음식을 직접 입력해주세요"
                      className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required={foodList.length === 0}
                    />
                    <button
                      type="button"
                      onClick={handleAddFood}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      추가
                    </button>
                  </div>

                  {foodList.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        추가된 음식
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {foodList.map((food, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                          >
                            <span>{food}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFood(index)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요 (선택사항)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              기록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
