# Yoon Lab 홈페이지

AI와 함께 만든 앱, 영상, 채널, 글을 모아둔 개인 포트폴리오 사이트입니다.

## 구성

- 첫 화면: 빛 입자가 Y 로고 → AI 코어 → 앱 → 영상 → 책으로 모양을 바꾸는 3D 장면 (`src/components/ParticleScene.tsx`, three.js / react-three-fiber)
- 작업물: 분야별(앱 · AI 영상 · 유튜브 · 인스타그램 · 글쓰기) 작업 목록. 항목은 `src/lib/projects.ts`에서 관리합니다.
- 소개 · 경력 · AI 영상 · 테스트 요청 · 맛집 페이지, 관리자 페이지(Firebase)
- 4개 언어(ko, en, ja, zh): `src/i18n/locales/*.json`

## 작업물 추가하기

1. 대표 이미지를 `src/assets/project-web/`에 webp로 넣습니다.
2. `src/lib/projects.ts`의 `projects` 배열에 항목을 추가합니다.
3. 각 언어 파일의 `project_list`(이름·설명)와 `project_meta`(분류·상태)에 같은 key로 문구를 넣습니다.

## 명령어

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 배포용 빌드 (dist)
npm run lint
```

환경 변수는 `.env.example`을 참고합니다. Vercel이 `main` 브랜치를 빌드해 배포합니다.

### 미리보기(목업) 빌드

Firebase 없이 둘러볼 수 있는 정적 미리보기를 만들 때만 사용합니다. 페이지 이동은 주소의 `#about` 같은 해시로 동작하고, 맛집·경력은 예시 데이터로 보입니다.

```bash
VITE_MOCK=1 npx vite build --base ./
```
