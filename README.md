# 🩺 Heady - 개인 혈당 관리 플랫폼

> **당뇨 환자와 건강 관리에 관심 있는 사용자들을 위한 종합 혈당 관리 웹 애플리케이션**

![Next.js](https://img.shields.io/badge/Next.js-13.4.19-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?style=flat-square&logo=tailwindcss)

## 🌐 라이브 데모

**🚀 [https://healthsteady.site/](https://healthsteady.site/)**

> 실제 배포된 서비스에서 Heady의 모든 기능을 체험해보세요!

## 📋 프로젝트 개요

**Heady**는 사용자의 혈당을 체계적으로 관리하고 분석할 수 있는 현대적인 웹 애플리케이션입니다. 직관적인 UI/UX를 통해 혈당 기록, 영양소 추적, 통계 분석 등의 기능을 제공하여 사용자의 건강한 생활 습관 형성을 돕습니다.

## ✨ 주요 기능

### 🩸 혈당 관리

- **실시간 혈당 기록**: 아침, 점심, 저녁 혈당 수치 입력 및 추적
- **목표 설정**: 개인별 공복/식후 혈당 목표값 설정
- **트렌드 분석**: 혈당 변화 패턴 시각화 및 분석

### 🍽️ 식사 및 영양 관리

- **식사 기록**: 상세한 식사 내용 입력 및 관리
- **영양소 추적**: 탄수화물, 단백질, 지방 섭취량 모니터링
- **칼로리 계산**: 일일 칼로리 섭취량 자동 계산

### 📊 분석 및 리포팅

- **건강 리포트**: AI 기반 개인화된 건강 분석 리포트 생성
- **통계 대시보드**: 혈당 패턴 및 영양소 섭취 현황 시각화
- **PDF 내보내기**: 건강 데이터를 PDF로 내보내기 가능

### 👤 사용자 관리

- **카카오 소셜 로그인**: 간편한 회원가입 및 로그인
- **개인 프로필**: 사용자 정보 및 건강 목표 관리
- **데이터 백업**: 클라우드 기반 데이터 동기화

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Tremor React, SweetAlert2
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas

### Backend Integration

- **HTTP Client**: Axios
- **Authentication**: JWT Token 기반 인증
- **API**: RESTful API 연동

### Development Tools

- **Code Quality**: ESLint, TypeScript
- **Build Tool**: Next.js built-in bundler
- **Deployment**: Netlify

## 🚀 프로젝트 특징

### 🎨 Modern UI/UX

- **반응형 디자인**: 모바일 우선 설계로 모든 기기에서 최적화된 경험
- **다크 모드 지원**: 사용자 선호에 따른 테마 변경
- **직관적인 내비게이션**: 하단 탭 네비게이션으로 쉬운 접근성

### 📱 PWA 지원

- **오프라인 사용**: 네트워크 연결 없이도 기본 기능 사용 가능
- **앱 설치**: 모바일 기기에 앱으로 설치 가능

### 🔒 보안

- **데이터 암호화**: 민감한 건강 정보 보호
- **안전한 인증**: OAuth 2.0 기반 카카오 로그인

### ⚡ 성능 최적화

- **코드 스플리팅**: 페이지별 번들 최적화
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **캐싱 전략**: 효율적인 데이터 캐싱

## 📁 프로젝트 구조

```
heady-front/
├── 📂 app/                     # Next.js App Router
│   ├── 📂 auth/               # 인증 관련 페이지
│   ├── 📂 calendar/           # 캘린더 페이지
│   ├── 📂 health-analysis/    # 건강 분석 페이지
│   ├── 📂 stats/              # 통계 페이지
│   ├── 📂 profile/            # 프로필 페이지
│   ├── 📄 layout.tsx          # 루트 레이아웃
│   ├── 📄 page.tsx            # 메인 대시보드
│   └── 📄 globals.css         # 전역 스타일
├── 📂 components/             # 재사용 컴포넌트
│   ├── 📄 BloodSugarSummary.tsx      # 혈당 요약
│   ├── 📄 BloodSugarHistory.tsx      # 혈당 기록
│   ├── 📄 BloodSugarInputModal.tsx   # 혈당 입력 모달
│   ├── 📄 MealInputModal.tsx         # 식사 입력 모달
│   ├── 📄 HealthReport.tsx           # 건강 리포트
│   ├── 📄 NutritionSummary.tsx       # 영양소 요약
│   ├── 📄 LoginModal.tsx             # 로그인 모달
│   ├── 📄 SignupModal.tsx            # 회원가입 모달
│   ├── 📄 BottomNavigation.tsx       # 하단 네비게이션
│   └── 📄 Header.tsx                 # 헤더
├── 📂 services/               # API 서비스
│   ├── 📄 auth.ts            # 인증 서비스
│   ├── 📄 bloodSugar.ts      # 혈당 API
│   ├── 📄 meal.ts            # 식사 API
│   ├── 📄 healthService.ts   # 건강 분석 서비스
│   └── 📄 food.ts            # 음식 정보 API
├── 📂 config/                # 설정 파일
├── 📂 utils/                 # 유틸리티 함수
├── 📂 public/                # 정적 파일
└── 📂 styles/                # 스타일 파일
```

## 🎯 주요 구현 사항

### 1. 상태 관리 패턴

```typescript
// React Hooks를 활용한 효율적인 상태 관리
const [bloodSugarData, setBloodSugarData] = useState<BloodSugarData>({
  breakfast: null,
  lunch: null,
  dinner: null,
  highestFasting: null,
  highestPostprandial: null,
});
```

### 2. 타입 안정성

```typescript
// 엄격한 TypeScript 타입 정의로 런타임 에러 방지
interface BloodSugarData {
  breakfast: number | null;
  lunch: number | null;
  dinner: number | null;
  highestFasting: number | null;
  highestPostprandial: number | null;
  target?: number;
  current?: number;
}
```

### 3. API 서비스 추상화

```typescript
// 재사용 가능한 API 서비스 구조
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // 로그인 로직
  },
  logout: async (): Promise<void> => {
    // 로그아웃 로직
  },
};
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/your-username/heady-front.git
cd heady-front

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 환경 변수 설정

```bash
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_app_key
```

## 📱 주요 화면

### 🏠 메인 대시보드

- 오늘의 혈당 현황 한눈에 보기
- 혈당 목표 달성률 표시
- 최근 식사 및 영양소 섭취 현황

### 📊 통계 페이지

- 주간/월간 혈당 트렌드 차트
- 영양소 섭취 패턴 분석
- 혈당 변화 패턴 시각화

### 📝 건강 분석 리포트

- AI 기반 개인화된 건강 조언
- 혈당 패턴 분석 결과
- 개선 방안 제시

## 🌟 프로젝트 성과

### 개발 성과

- **코드 품질**: TypeScript 도입으로 **90% 이상** 타입 커버리지 달성
- **성능 최적화**: Next.js 최적화 기능으로 **First Load Time 2초 이내** 달성
- **반응형 지원**: **모든 디바이스**에서 일관된 사용자 경험 제공

### 기술적 도전

- **복잡한 상태 관리**: 다양한 데이터 타입과 상태를 효율적으로 관리
- **실시간 데이터 시각화**: Recharts를 활용한 동적 차트 구현
- **PDF 생성**: 브라우저에서 고품질 PDF 리포트 생성

## 🔮 향후 개선 계획

### 기능 확장

- [ ] 웨어러블 기기 연동 (Apple Watch, Galaxy Watch)
- [ ] 혈당 알림 및 리마인더 기능
- [ ] 의료진과의 데이터 공유 기능
- [ ] 커뮤니티 기능 (경험 공유, Q&A)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **프로젝트**: [Heady - 혈당 관리 플랫폼](https://healthsteady.site/)
- **이메일**: healthsteady.contact@gmail.com

---

<p align="center">
  <b>🩺 Heady와 함께 건강한 혈당 관리를 시작하세요! 🩺</b>
</p>
