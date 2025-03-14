# Heady - 혈당 관리 서비스

Heady는 사용자의 혈당을 효과적으로 관리할 수 있도록 도와주는 웹 애플리케이션입니다.

## 주요 기능

- 아침, 점심, 저녁 혈당 기록 및 관리
- 목표 혈당 설정 및 현재 혈당 모니터링
- 영양소 섭취 현황 추적 (탄수화물, 단백질, 지방)
- 혈당 기록 통계 및 분석

## 기술 스택

- Next.js
- React
- TypeScript
- Tailwind CSS

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 프로젝트 구조

```
heady-front/
├── app/                # Next.js 앱 디렉토리
│   ├── layout.tsx      # 레이아웃 컴포넌트
│   ├── page.tsx        # 메인 페이지
│   └── globals.css     # 전역 스타일
├── components/         # 재사용 가능한 컴포넌트
│   ├── Header.tsx
│   ├── BloodSugarSummary.tsx
│   ├── BloodSugarHistory.tsx
│   ├── NutritionSummary.tsx
│   └── BottomNavigation.tsx
└── public/             # 정적 파일
```
