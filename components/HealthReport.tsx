import React, { useRef, forwardRef, useImperativeHandle } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
}

// 색상 정의
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// PDF 생성 함수를 외부에서 호출할 수 있도록 ref 설정
export interface HealthReportRef {
  generatePDF: () => Promise<void>;
}

const HealthReport = forwardRef<HealthReportRef, HealthReportProps>(
  ({ glucoseData, foodData, nutrientData, userInfo, analysisResults }, ref) => {
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

    // 음식 영향 데이터
    const foodImpactData = foodData.map((food) => ({
      name: food.name,
      glucoseImpact: food.glucoseAfter || 0,
      carbs: food.carbs,
      glycemicIndex: food.glycemicIndex || 0,
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
      <div className="p-6 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700">
            개인 건강 분석 보고서
          </h1>
          {/* 보고서 생성 날짜와 분석 날짜 표시 */}
          <div className="text-right">
            <p className="text-sm text-gray-600">보고서 생성일: {today}</p>
            <p className="text-sm text-gray-600">
              분석 기간: {analysisStartDate} ~ {analysisEndDate}
            </p>
          </div>
        </div>

        {/* PDF 생성용 콘텐츠 */}
        <div ref={reportRef} className="space-y-10">
          {/* 사용자 정보 섹션 */}
          <div className="report-section p-5 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              개인 정보
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-gray-500 text-sm">나이</p>
                <p className="text-lg font-medium">{userInfo.age}세</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-gray-500 text-sm">성별</p>
                <p className="text-lg font-medium">{userInfo.gender}</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-gray-500 text-sm">신장</p>
                <p className="text-lg font-medium">{userInfo.height}cm</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-gray-500 text-sm">체중</p>
                <p className="text-lg font-medium">{userInfo.weight}kg</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-gray-500 text-sm">BMI</p>
                <p className="text-lg font-medium">{userInfo.bmi.toFixed(1)}</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <p className="text-gray-500 text-sm">목표 혈당</p>
                <p className="text-lg font-medium">
                  {userInfo.targetGlucose} mg/dL
                </p>
              </div>
            </div>
          </div>

          {/* 혈당 차트 섹션 */}
          <div className="report-section p-5 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              주간 혈당 변화
            </h2>
            <div className="bg-white p-4 rounded shadow-sm h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyGlucoseData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    domain={[60, 180]}
                    label={{
                      value: "혈당 (mg/dL)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    name="혈당"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  {/* 목표 혈당 기준선 추가 */}
                  <Line
                    type="monotone"
                    dataKey={() => userInfo.targetGlucose}
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    name="목표 혈당"
                    strokeWidth={1}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 음식과 혈당 영향 섹션 */}
          <div className="report-section p-5 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              음식이 혈당에 미치는 영향
            </h2>
            <div className="bg-white p-4 rounded shadow-sm h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={foodImpactData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "혈당 상승 (mg/dL)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "탄수화물 (g)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    yAxisId="left"
                    dataKey="glucoseImpact"
                    name="혈당 상승"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="carbs"
                    name="탄수화물"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 영양소 섭취 차트 */}
          <div className="report-section p-5 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              일일 영양소 섭취량
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow-sm h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedNutrientData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "영양소 (g)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                      dataKey="carbs"
                      name="탄수화물"
                      stackId="a"
                      fill="#8884d8"
                    />
                    <Bar
                      dataKey="protein"
                      name="단백질"
                      stackId="a"
                      fill="#82ca9d"
                    />
                    <Bar dataKey="fat" name="지방" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-4 rounded shadow-sm h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutrientDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {nutrientDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 분석 결과 섹션 */}
          <div className="report-section p-5 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              AI 분석 결과
            </h2>

            <div className="mb-6 bg-white p-5 rounded shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-blue-700">
                혈당 분석
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {analysisResults.glucoseAnalysis}
              </p>
            </div>

            <div className="mb-6 bg-white p-5 rounded shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-blue-700">
                식단 분석
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {analysisResults.dietAnalysis}
              </p>
            </div>

            <div className="bg-white p-5 rounded shadow-sm">
              <h3 className="text-lg font-medium mb-3 text-blue-700">
                권장 행동 계획
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {analysisResults.recommendedActions.map((action, index) => (
                  <li key={index} className="text-gray-700">
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="report-section p-5 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p>
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
