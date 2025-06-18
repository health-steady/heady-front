import React, { useRef, forwardRef, useImperativeHandle } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// 타입 정의
interface GlucoseData {
  date: string;
  time: string;
  value: number;
  mealType?: string;
}

interface FoodData {
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  glycemicIndex?: number;
  date: string;
  time: string;
  glucoseAfter?: number;
}

interface NutrientIntake {
  date: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
}

interface UserInfo {
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  targetGlucose: number;
}

interface HealthReportProps {
  glucoseData: GlucoseData[];
  foodData: FoodData[];
  nutrientData: NutrientIntake[];
  userInfo: UserInfo;
  analysisResults: {
    glucoseAnalysis: string;
    dietAnalysis: string;
    recommendedActions: string[];
  };
  foodImpactData?: Array<{
    name: string;
    glucoseImpact: number;
    carbs: number;
    occurrences: number;
    glycemicIndex: number;
  }>;
}

// 색상 정의
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// PDF 생성 함수를 외부에서 호출할 수 있도록 ref 설정
export interface HealthReportRef {
  generatePDF: () => Promise<void>;
}

const HealthReport = forwardRef<HealthReportRef, HealthReportProps>(
  (
    {
      glucoseData,
      foodData,
      nutrientData,
      userInfo,
      analysisResults,
      foodImpactData = [],
    },
    ref
  ) => {
    const reportRef = useRef<HTMLDivElement>(null);

    // 일주일간 혈당 데이터 처리
    const weeklyGlucoseData = glucoseData.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
    }));

    // 영양소 섭취 데이터 처리
    const processedNutrientData = nutrientData.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      }),
    }));

    // 영양소 분포 데이터 계산
    const totalNutrients = nutrientData.reduce(
      (acc, curr) => {
        return {
          carbs: acc.carbs + curr.carbs,
          protein: acc.protein + curr.protein,
          fat: acc.fat + curr.fat,
          calories: acc.calories + curr.calories,
        };
      },
      { carbs: 0, protein: 0, fat: 0, calories: 0 }
    );

    const nutrientDistribution = [
      { name: "탄수화물", value: totalNutrients.carbs },
      { name: "단백질", value: totalNutrients.protein },
      { name: "지방", value: totalNutrients.fat },
    ];

    // 음식 영향 데이터 - 새로운 foodImpactData를 사용하거나 기존 방식으로 생성
    const processedFoodImpactData =
      foodImpactData.length > 0
        ? foodImpactData.map((food) => ({
            ...food,
            // 식전/식후 혈당 추정 - 실제로는 API에서 제공되어야 함
            beforeGlucose: Math.max(90, 110 - food.carbs / 10), // 식전 혈당 (더 낮은 값)
            afterGlucose: Math.min(180, food.glucoseImpact + 100), // 식후 혈당 (더 높은 값)
            // 음식 이름이 15자를 초과할 경우 ...으로 표시
            displayName:
              food.name.length > 15
                ? `${food.name.substring(0, 12)}...`
                : food.name,
          }))
        : foodData.map((food) => ({
            // 기존 방식으로 생성
            name: food.name,
            displayName:
              food.name.length > 15
                ? `${food.name.substring(0, 12)}...`
                : food.name,
            beforeGlucose: 95, // 임의의 식전 혈당
            afterGlucose: food.glucoseAfter || 140, // 식후 혈당
            carbs: food.carbs,
            occurrences: 1,
          }));

    // PDF 생성 함수
    const generatePDF = async () => {
      if (!reportRef.current) return;

      const report = reportRef.current;
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        compress: true,
      });

      // PDF 메타데이터 설정 - 깨진 텍스트가 나타나지 않도록 메타데이터 제거
      pdf.setProperties({
        title: "",
        subject: "",
        author: "",
        keywords: "",
        creator: "",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      try {
        // 로딩 표시
        const loadingDiv = document.createElement("div");
        loadingDiv.className =
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white text-xl";
        loadingDiv.innerHTML = "PDF를 생성 중입니다...";
        document.body.appendChild(loadingDiv);

        // 상단 제목과 날짜 정보를 포함한 별도의 div 생성
        const headerDiv = document.createElement("div");
        headerDiv.className = "p-5 bg-white";

        // 현재 문서의 스타일을 상속하기 위해 body에 임시로 추가
        document.body.appendChild(headerDiv);

        // 현재 날짜와 분석 기간 계산
        const currentDate = new Date();
        const pdfToday = currentDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const pdfOneWeekAgo = new Date();
        pdfOneWeekAgo.setDate(pdfOneWeekAgo.getDate() - 7);
        const pdfAnalysisStartDate = pdfOneWeekAgo.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const pdfAnalysisEndDate = pdfToday;

        // 제목 및 날짜 정보 설정 - 클래스를 직접 인라인 스타일로 변경
        headerDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-family: 'Malgun Gothic', sans-serif;">
            <h1 style="font-size: 1.5rem; font-weight: bold; color: #1d4ed8;">개인 건강 분석 보고서</h1>
            <div style="text-align: right;">
              <p style="font-size: 0.875rem; color: #4b5563;">보고서 생성일: ${pdfToday}</p>
              <p style="font-size: 0.875rem; color: #4b5563;">분석 기간: ${pdfAnalysisStartDate} ~ ${pdfAnalysisEndDate}</p>
            </div>
          </div>
        `;

        // 헤더 이미지로 변환
        const headerCanvas = await html2canvas(headerDiv, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          foreignObjectRendering: false,
        });

        // 임시로 추가한 div 제거
        document.body.removeChild(headerDiv);

        // 전체 보고서를 한 번에 이미지로 변환
        const reportCanvas = await html2canvas(report, {
          scale: 2, // 고해상도 렌더링
          useCORS: true, // CORS 허용 (외부 이미지 사용시)
          logging: false, // 로그 비활성화
          allowTaint: true, // 외부 이미지 허용
          foreignObjectRendering: false, // foreignObject 렌더링 사용하지 않음 (한글 깨짐 방지)
        });

        // 헤더 이미지 추가
        const headerImgData = headerCanvas.toDataURL("image/png");
        const headerImgWidth = pageWidth - 20; // 여백 10mm
        const headerImgHeight =
          (headerCanvas.height * headerImgWidth) / headerCanvas.width;

        // 첫 페이지에 헤더 추가
        pdf.addImage(
          headerImgData,
          "PNG",
          10,
          10,
          headerImgWidth,
          headerImgHeight,
          undefined,
          "FAST"
        );

        // 보고서 이미지 데이터
        const reportImgData = reportCanvas.toDataURL("image/png");

        // 이미지 크기 계산
        const reportImgWidth = pageWidth - 20; // 여백 10mm
        const reportImgHeight =
          (reportCanvas.height * reportImgWidth) / reportCanvas.width;

        // 시작 위치를 헤더 아래로 조정
        const startY = headerImgHeight + 15; // 헤더 높이 + 여백

        // 페이지 수 계산 (헤더 공간을 고려)
        const availableHeight = pageHeight - startY - 10; // 시작 위치와 하단 여백 고려
        const firstPageContentHeight = availableHeight;
        const pagesNeeded =
          1 +
          Math.ceil(
            Math.max(0, reportImgHeight - firstPageContentHeight) /
              (pageHeight - 20)
          );

        // 첫 페이지에 보고서의 첫 부분 추가
        const firstPageRatio = Math.min(
          firstPageContentHeight / reportImgHeight,
          1
        );
        const firstPageCanvasHeight = reportCanvas.height * firstPageRatio;

        // 첫 페이지에 들어갈 부분
        const firstPageCanvas = document.createElement("canvas");
        firstPageCanvas.width = reportCanvas.width;
        firstPageCanvas.height = firstPageCanvasHeight;

        const firstPageCtx = firstPageCanvas.getContext("2d");
        if (firstPageCtx) {
          firstPageCtx.drawImage(
            reportCanvas,
            0,
            0,
            reportCanvas.width,
            firstPageCanvasHeight,
            0,
            0,
            reportCanvas.width,
            firstPageCanvasHeight
          );

          const firstPageImgData = firstPageCanvas.toDataURL("image/png");

          // 첫 페이지 이미지 추가
          pdf.addImage(
            firstPageImgData,
            "PNG",
            10,
            startY,
            reportImgWidth,
            firstPageContentHeight,
            undefined,
            "FAST"
          );
        }

        // 나머지 페이지 처리
        if (pagesNeeded > 1) {
          const remainingCanvasHeight =
            reportCanvas.height - firstPageCanvasHeight;
          const heightPerPage = Math.ceil(
            remainingCanvasHeight / (pagesNeeded - 1)
          );

          for (let i = 1; i < pagesNeeded; i++) {
            pdf.addPage();

            // 현재 페이지에 들어갈 높이 계산
            const currentHeight = Math.min(
              heightPerPage,
              remainingCanvasHeight - (i - 1) * heightPerPage
            );

            // 보고서 캔버스에서의 시작 위치
            const startYOnCanvas =
              firstPageCanvasHeight + (i - 1) * heightPerPage;

            // 페이지 캔버스 생성
            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = reportCanvas.width;
            pageCanvas.height = currentHeight;

            const pageCtx = pageCanvas.getContext("2d");
            if (pageCtx) {
              pageCtx.drawImage(
                reportCanvas,
                0,
                startYOnCanvas,
                reportCanvas.width,
                currentHeight,
                0,
                0,
                reportCanvas.width,
                currentHeight
              );

              const pageImgData = pageCanvas.toDataURL("image/png");

              // 이미지 추가
              pdf.addImage(
                pageImgData,
                "PNG",
                10,
                10, // 두 번째 페이지부터는 상단에서 시작
                reportImgWidth,
                (currentHeight * reportImgWidth) / reportCanvas.width,
                undefined,
                "FAST"
              );
            }
          }
        }

        // 로딩 제거
        document.body.removeChild(loadingDiv);

        // PDF 저장 (파일명에 날짜 추가)
        const dateStr = new Date()
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\./g, "")
          .replace(/\s/g, "");

        pdf.save(`건강분석보고서_${dateStr}.pdf`);
      } catch (error) {
        console.error("PDF 생성 중 오류 발생:", error);
        alert("PDF 생성 중 오류가 발생했습니다.");
      }
    };

    // 외부에서 ref를 통해 함수 호출 가능하도록 설정
    useImperativeHandle(ref, () => ({
      generatePDF,
    }));

    // 현재 날짜 및 분석 날짜 포맷팅
    const today = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // 분석 날짜는 일주일 전 날짜부터 현재까지로 설정
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const analysisStartDate = oneWeekAgo.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const analysisEndDate = today;

    return (
      <div className="p-3 sm:p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700 text-center sm:text-left">
            개인 건강 분석 보고서
          </h1>
          {/* 보고서 생성 날짜와 분석 날짜 표시 */}
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-600">
              보고서 생성일: {today}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              분석 기간: {analysisStartDate} ~ {analysisEndDate}
            </p>
          </div>
        </div>

        {/* PDF 생성용 콘텐츠 */}
        <div ref={reportRef} className="space-y-6 sm:space-y-10">
          {/* 사용자 정보 섹션 */}
          <div className="report-section p-3 sm:p-5 bg-gray-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800">
              개인 정보
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
                <p className="text-gray-500 text-xs sm:text-sm">나이</p>
                <p className="text-base sm:text-lg font-medium">
                  {userInfo.age}세
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
                <p className="text-gray-500 text-xs sm:text-sm">성별</p>
                <p className="text-base sm:text-lg font-medium">
                  {userInfo.gender}
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
                <p className="text-gray-500 text-xs sm:text-sm">신장</p>
                <p className="text-base sm:text-lg font-medium">
                  {userInfo.height}cm
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
                <p className="text-gray-500 text-xs sm:text-sm">체중</p>
                <p className="text-base sm:text-lg font-medium">
                  {userInfo.weight}kg
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
                <p className="text-gray-500 text-xs sm:text-sm">BMI</p>
                <p className="text-base sm:text-lg font-medium">
                  {userInfo.bmi.toFixed(1)}
                </p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded shadow-sm">
                <p className="text-gray-500 text-xs sm:text-sm">목표 혈당</p>
                <p className="text-base sm:text-lg font-medium">
                  {userInfo.targetGlucose} mg/dL
                </p>
              </div>
            </div>
          </div>

          {/* 혈당 차트 섹션 */}
          <div className="report-section p-3 sm:p-5 bg-gray-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800">
              주간 혈당 변화
            </h2>
            <div className="bg-white p-2 sm:p-4 rounded shadow-sm">
              <div className="w-full h-64 sm:h-80">
                <Line
                  data={{
                    labels: weeklyGlucoseData.map((item) => item.date),
                    datasets: [
                      {
                        label: "혈당",
                        data: weeklyGlucoseData.map((item) => item.value),
                        borderColor: "#8884d8",
                        backgroundColor: "rgba(136, 132, 216, 0.1)",
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.1,
                      },
                      {
                        label: "목표 혈당",
                        data: weeklyGlucoseData.map(
                          () => userInfo.targetGlucose
                        ),
                        borderColor: "#82ca9d",
                        backgroundColor: "transparent",
                        borderWidth: 1,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        pointHoverRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: {
                            size: window.innerWidth < 640 ? 11 : 12,
                          },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#374151",
                        bodyColor: "#374151",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        cornerRadius: 6,
                        padding: 8,
                        callbacks: {
                          label: function (context: any) {
                            return `${context.dataset.label}: ${context.parsed.y} mg/dL`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                          font: {
                            size: window.innerWidth < 640 ? 10 : 11,
                          },
                        },
                      },
                      y: {
                        min: 60,
                        max: 180,
                        grid: {
                          color: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                          font: {
                            size: window.innerWidth < 640 ? 10 : 11,
                          },
                        },
                        title: {
                          display: true,
                          text: "혈당 (mg/dL)",
                          font: {
                            size: window.innerWidth < 640 ? 11 : 12,
                          },
                        },
                      },
                    },
                    interaction: {
                      intersect: false,
                      mode: "index" as const,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* 음식과 혈당 영향 섹션 */}
          <div className="report-section p-3 sm:p-5 bg-gray-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800">
              음식별 혈당 수치 및 탄수화물
            </h2>
            <div className="bg-white p-2 sm:p-4 rounded shadow-sm">
              <div className="w-full h-64 sm:h-80">
                <Bar
                  data={{
                    labels: processedFoodImpactData.map(
                      (item) => item.displayName
                    ),
                    datasets: [
                      {
                        label: "식전 혈당",
                        data: processedFoodImpactData.map(
                          (item) => item.beforeGlucose
                        ),
                        backgroundColor: "#4CAF50",
                        borderColor: "#4CAF50",
                        borderWidth: 1,
                        yAxisID: "y",
                      },
                      {
                        label: "식후 혈당",
                        data: processedFoodImpactData.map(
                          (item) => item.afterGlucose
                        ),
                        backgroundColor: "#FF8C00",
                        borderColor: "#FF8C00",
                        borderWidth: 1,
                        yAxisID: "y",
                      },
                      {
                        label: "탄수화물",
                        data: processedFoodImpactData.map((item) => item.carbs),
                        backgroundColor: "#2196F3",
                        borderColor: "#2196F3",
                        borderWidth: 1,
                        yAxisID: "y1",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                        labels: {
                          usePointStyle: true,
                          padding: window.innerWidth < 640 ? 10 : 15,
                          font: {
                            size: window.innerWidth < 640 ? 10 : 12,
                          },
                        },
                      },
                      tooltip: {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        titleColor: "#374151",
                        bodyColor: "#374151",
                        borderColor: "#e5e7eb",
                        borderWidth: 1,
                        cornerRadius: 6,
                        padding: 8,
                        callbacks: {
                          title: function (context: any) {
                            const index = context[0].dataIndex;
                            return `음식: ${processedFoodImpactData[index].name}`;
                          },
                          label: function (context: any) {
                            const label = context.dataset.label;
                            const value = context.parsed.y;
                            if (label === "탄수화물") {
                              return `${label}: ${value}g`;
                            }
                            return `${label}: ${value} mg/dL`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                          maxRotation: window.innerWidth < 640 ? 45 : 45,
                          minRotation: window.innerWidth < 640 ? 45 : 0,
                          font: {
                            size: window.innerWidth < 640 ? 9 : 11,
                          },
                        },
                      },
                      y: {
                        type: "linear" as const,
                        display: true,
                        position: "left" as const,
                        grid: {
                          color: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                          font: {
                            size: window.innerWidth < 640 ? 10 : 11,
                          },
                        },
                        title: {
                          display: true,
                          text: "혈당 (mg/dL)",
                          font: {
                            size: window.innerWidth < 640 ? 10 : 12,
                          },
                        },
                      },
                      y1: {
                        type: "linear" as const,
                        display: true,
                        position: "right" as const,
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          font: {
                            size: window.innerWidth < 640 ? 10 : 11,
                          },
                        },
                        title: {
                          display: true,
                          text: "탄수화물 (g)",
                          font: {
                            size: window.innerWidth < 640 ? 10 : 12,
                          },
                        },
                      },
                    },
                    interaction: {
                      intersect: false,
                      mode: "index" as const,
                    },
                  }}
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 italic">
              <p>
                * 각 음식별 평균 식전/식후 혈당 수치와 평균 탄수화물 함량을
                보여줍니다.
              </p>
            </div>
          </div>

          {/* 영양소 섭취 차트 */}
          <div className="report-section p-3 sm:p-5 bg-gray-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800">
              일일 영양소 섭취량
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-2 sm:p-4 rounded shadow-sm">
                <div className="w-full h-64 sm:h-80">
                  <Bar
                    data={{
                      labels: processedNutrientData.map((item) => item.date),
                      datasets: [
                        {
                          label: "탄수화물",
                          data: processedNutrientData.map((item) => item.carbs),
                          backgroundColor: "#8884d8",
                          borderColor: "#8884d8",
                          borderWidth: 1,
                        },
                        {
                          label: "단백질",
                          data: processedNutrientData.map(
                            (item) => item.protein
                          ),
                          backgroundColor: "#82ca9d",
                          borderColor: "#82ca9d",
                          borderWidth: 1,
                        },
                        {
                          label: "지방",
                          data: processedNutrientData.map((item) => item.fat),
                          backgroundColor: "#ffc658",
                          borderColor: "#ffc658",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                          labels: {
                            usePointStyle: true,
                            padding: window.innerWidth < 640 ? 8 : 15,
                            font: {
                              size: window.innerWidth < 640 ? 10 : 12,
                            },
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          titleColor: "#374151",
                          bodyColor: "#374151",
                          borderColor: "#e5e7eb",
                          borderWidth: 1,
                          cornerRadius: 6,
                          padding: 8,
                          callbacks: {
                            label: function (context: any) {
                              const value = Number(context.parsed.y);
                              return `${context.dataset.label}: ${value.toFixed(
                                2
                              )}g`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          stacked: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.1)",
                          },
                          ticks: {
                            font: {
                              size: window.innerWidth < 640 ? 10 : 11,
                            },
                          },
                        },
                        y: {
                          stacked: true,
                          grid: {
                            color: "rgba(0, 0, 0, 0.1)",
                          },
                          ticks: {
                            font: {
                              size: window.innerWidth < 640 ? 10 : 11,
                            },
                          },
                          title: {
                            display: true,
                            text: "영양소 (g)",
                            font: {
                              size: window.innerWidth < 640 ? 10 : 12,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="bg-white p-2 sm:p-4 rounded shadow-sm flex items-center justify-center">
                <div className="w-full h-64 sm:h-80">
                  <Pie
                    data={{
                      labels: nutrientDistribution.map((item) => item.name),
                      datasets: [
                        {
                          data: nutrientDistribution.map((item) => item.value),
                          backgroundColor: ["#0088FE", "#00C49F", "#FFBB28"],
                          borderColor: ["#0088FE", "#00C49F", "#FFBB28"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom" as const,
                          labels: {
                            usePointStyle: true,
                            padding: window.innerWidth < 640 ? 8 : 15,
                            font: {
                              size: window.innerWidth < 640 ? 10 : 12,
                            },
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          titleColor: "#374151",
                          bodyColor: "#374151",
                          borderColor: "#e5e7eb",
                          borderWidth: 1,
                          cornerRadius: 6,
                          padding: 8,
                          callbacks: {
                            label: function (context: any) {
                              const label = context.label;
                              const value = Number(context.parsed);
                              const total = context.dataset.data.reduce(
                                (a: number, b: number) => a + b,
                                0
                              );
                              const percent = ((value / total) * 100).toFixed(
                                0
                              );
                              return `${label}: ${percent}% (${value.toFixed(
                                2
                              )}g)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 분석 결과 섹션 */}
          <div className="report-section p-3 sm:p-5 bg-gray-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800">
              AI 분석 결과
            </h2>

            <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-5 rounded shadow-sm">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-blue-700">
                혈당 분석
              </h3>
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                {analysisResults.glucoseAnalysis}
              </p>
            </div>

            <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-5 rounded shadow-sm">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-blue-700">
                식단 분석
              </h3>
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                {analysisResults.dietAnalysis}
              </p>
            </div>

            <div className="bg-white p-3 sm:p-5 rounded shadow-sm">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-blue-700">
                권장 행동 계획
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2">
                {analysisResults.recommendedActions.map((action, index) => (
                  <li
                    key={index}
                    className="text-sm sm:text-base text-gray-700 leading-relaxed"
                  >
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="report-section p-3 sm:p-5 bg-gray-50 rounded-lg text-xs sm:text-xs text-gray-500">
            <p className="leading-relaxed">
              ※ 본 보고서는 참고용으로만 사용되어야 하며, 의학적 조언을 대체할
              수 없습니다. 건강 관련 결정을 내리기 전에 항상 의료 전문가와
              상담하십시오.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default HealthReport;
