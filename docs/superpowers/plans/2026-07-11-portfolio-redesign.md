# 포트폴리오 흑백 테마 리뉴얼 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `modified/` 포트폴리오를 흑백 모노크롬(에디토리얼 원컬럼) 테마로 재디자인하고, 농심 카프리썬 공모전 기획서를 작업물에 추가한다.

**Architecture:** 정적 사이트(바닐라 HTML/CSS/JS) 유지. `index.html` 섹션 재배치 + `style.css` 전면 재작성 + `main.js`에 다크모드 토글·카드 요약 추가 + `works.json` 항목 추가. 스펙: `docs/superpowers/specs/2026-07-11-portfolio-redesign-design.md`.

**Tech Stack:** 바닐라 HTML/CSS/JS, Geist·Geist Mono·Pretendard(CDN), pdftoppm(에셋 변환).

## Global Constraints

- `modified/` 디렉토리만 변경. 루트 `index.html`은 불변.
- 콘텐츠 텍스트(경력·활동·연락처)는 유지. 예외: "대한상공회의소장상" → **"우수사례 공모전 청년영상부문 장려상"** 으로 교체.
- 빌드 도구·프레임워크·npm 의존성 추가 금지.
- 컬러 악센트 금지 — 위계는 크기·굵기·여백·보더로만. 테마 토큰은 Task 4의 `:root`/`.dark` 블록을 그대로 사용.
- 농심 항목은 수상 결과 미정이므로 "출품작"으로 표기.
- 각 커밋 메시지 끝: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

---

### Task 1: 농심 기획서 에셋 생성

**Files:**
- Create: `modified/assets/images/nongshim-caprisun/nongshim-caprisun-1.png` … `-6.png`

**Interfaces:**
- Produces: Task 2의 works.json이 참조하는 이미지 경로 6개 (`assets/images/nongshim-caprisun/nongshim-caprisun-1.png` ~ `-6.png`, 썸네일은 `-1.png` 재사용)

- [ ] **Step 1: PDF → PNG 변환**

```bash
cd ~/Portfolio/modified
mkdir -p assets/images/nongshim-caprisun
pdftoppm -png -r 110 "$HOME/Documents/카프리썬 타겟 확장 마케팅_탈탈 탈곡기.pdf" assets/images/nongshim-caprisun/nongshim-caprisun
ls -la assets/images/nongshim-caprisun/
```
Expected: `nongshim-caprisun-1.png` ~ `nongshim-caprisun-6.png` 6개 파일, 각 100KB~1MB 수준.

- [ ] **Step 2: 이미지 육안 확인**

Read 도구로 `nongshim-caprisun-1.png`을 열어 표지가 정상 렌더링되었는지(글자 깨짐·여백 잘림 없음) 확인.

- [ ] **Step 3: Commit**

```bash
cd ~/Portfolio && git add modified/assets/images/nongshim-caprisun && git commit -m "feat: 농심 카프리썬 기획서 페이지 이미지 6장 추가"
```

---

### Task 2: works.json 농심 항목 추가 + 정렬·카드 템플릿

**Files:**
- Modify: `modified/data/works.json` (배열 맨 앞에 항목 삽입)
- Modify: `modified/js/main.js:4` (featuredOrder), `modified/js/main.js:53-56` (카드 body 템플릿)

**Interfaces:**
- Consumes: Task 1의 이미지 경로.
- Produces: works 항목 optional 필드 `summary: [{label, text}]` — 카드에 "문제→기획→결과" 3줄 요약 렌더링. CSS 클래스 `work-card-summary`(Task 4에서 스타일링).

- [ ] **Step 1: works.json 배열 맨 앞에 아래 항목 삽입**

```json
{
  "id": "nongshim-caprisun",
  "title": "농심 카프리썬 '다컸썬' 캠페인 기획",
  "subtitle": "카프리썬 성인 타깃 확장 마케팅 · 농심 공모전 출품작",
  "category": "branding",
  "categoryLabel": "브랜드 기획",
  "period": "팀 공모전 · 탈탈 탈곡기(2인) · 2026",
  "role": "설문 설계·데이터 분석 · 캠페인 동선 설계 · 기획서 제작",
  "tags": ["#타깃확장", "#데이터기반기획", "#밈마케팅", "#공모전출품"],
  "contribution": "설문 설계·분석부터 캠페인 구조 설계, 6페이지 기획서 구성·제작까지 주도 (2인 팀)",
  "context": "카프리썬은 '어린이 음료'라는 인식에 갇혀 있지만, 그 파우치를 쥐고 자란 세대는 이미 성인이 되었습니다. '다 컸는데 왜 못 마셔?'라는 질문에서 출발해 20~30대로 타깃을 확장하는 캠페인을 설계한 공모전 출품작입니다.",
  "summary": [
    { "label": "문제", "text": "인지 93.8%인데 성인이 집어들 '명분'이 없는 브랜드" },
    { "label": "기획", "text": "자체 설문(n=64) 기반 '다컸썬' 3단 캠페인 동선 설계" },
    { "label": "결과", "text": "6페이지 기획서 완성 · 농심 공모전 출품" }
  ],
  "insights": [
    "자체 설문(n=64): 브랜드 인지 93.8%, '추억의 음료' 87.5% — 문제는 인지가 아니라 구매 명분",
    "성인 대상 마케팅에 긍정·흥미 89.1%, 밈·병맛 콘텐츠 선호 1위 54.7%",
    "주 구매 채널 편의점 67.2%, 추억 자극 시 실구매 의향 60.9%, 무료 시음 참여 의향 68.8%"
  ],
  "approach": [
    {
      "decision": "'다컸썬' — 다 큰 어른을 위한 카프리썬이라는 밈형 캠페인 네이밍",
      "why": "인지도가 이미 93.8%라 '알리는 광고'가 아니라 성인이 집어들 명분을 만드는 것이 과제라고 판단"
    },
    {
      "decision": "밈 콘텐츠(온라인) → 급수대 팝업 시음(경험) → 편의점 프로모션(구매)의 3단 동선",
      "why": "밈이 명분을 만들고, 급수대가 첫 모금의 추억을 되살리고, 편의점이 구매로 닫는 구조 — 설문의 채널(67.2%)·시음(68.8%) 데이터를 동선에 그대로 반영"
    },
    {
      "decision": "모든 기획 판단을 자체 설문 수치로 뒷받침하는 데이터 우선 구성",
      "why": "신입 팀의 기획서일수록 감이 아닌 근거로 설득해야 한다고 판단, 설문 설계부터 직접 수행"
    }
  ],
  "workflow": [
    "카프리썬 브랜드·시장 리서치 → 타깃 확장 과제 정의",
    "20~30대 대상 자체 설문 설계·수집 (n=64) 및 교차 분석",
    "'다컸썬' 캠페인 콘셉트·네이밍·3단 실행 동선 설계",
    "키비주얼 시안 제작(AI 활용) 및 6페이지 기획서 구성·디자인",
    "제출 규격(PDF 6p)에 맞춰 최종본 완성·출품"
  ],
  "impact": [
    "설문 설계→분석→캠페인 설계→기획서 제작 전 과정을 팀 자체 수행한 데이터 기반 기획 완결",
    "농심 공모전 정식 출품 완료 (결과 발표 대기)"
  ],
  "result": "자체 설문(n=64) 기반 타깃 확장 캠페인 '다컸썬' 기획·출품",
  "tools": ["Google Forms", "Claude Code", "Higgsfield", "PowerPoint"],
  "gallery": [
    "assets/images/nongshim-caprisun/nongshim-caprisun-1.png",
    "assets/images/nongshim-caprisun/nongshim-caprisun-2.png",
    "assets/images/nongshim-caprisun/nongshim-caprisun-3.png",
    "assets/images/nongshim-caprisun/nongshim-caprisun-4.png",
    "assets/images/nongshim-caprisun/nongshim-caprisun-5.png",
    "assets/images/nongshim-caprisun/nongshim-caprisun-6.png"
  ],
  "galleryLabel": "기획서 전체 보기 (6p)",
  "link": "",
  "thumb": "assets/images/nongshim-caprisun/nongshim-caprisun-1.png"
}
```

- [ ] **Step 2: JSON 유효성 검증**

```bash
python3 -m json.tool ~/Portfolio/modified/data/works.json > /dev/null && echo OK
```
Expected: `OK`

- [ ] **Step 3: main.js 정렬·카드 템플릿 수정**

`main.js:4`:
```js
const featuredOrder = ['nongshim-caprisun', 'dalidam'];
```

`main.js:53-56`의 `.work-card-body` 내부를 summary 지원으로 교체:
```js
      <div class="work-card-body">
        ${w.summary && w.summary.length ? `<ul class="work-card-summary">${w.summary.map((s) => `<li><span>${s.label}</span>${s.text}</li>`).join('')}</ul>`
        : `<p class="work-card-sub">${w.subtitle}</p>
        <p class="work-card-result">${w.result}</p>`}
      </div>
```

- [ ] **Step 4: 렌더링 확인**

```bash
cd ~/Portfolio/modified && python3 -m http.server 8765 &
sleep 1 && curl -s http://localhost:8765/data/works.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(d[0]['id'], len(d))"
```
Expected: `nongshim-caprisun` + 기존 항목 수 +1. (서버는 이후 태스크 검증에도 사용)

- [ ] **Step 5: Commit**

```bash
cd ~/Portfolio && git add modified/data/works.json modified/js/main.js && git commit -m "feat: 농심 다컸썬 기획 작업물 추가 및 카드 3줄 요약 템플릿"
```

---

### Task 3: index.html 재구성

**Files:**
- Modify: `modified/index.html` (전체 재구성)

**Interfaces:**
- Produces: 다크모드 토글 버튼 `#themeToggle`(Task 5가 바인딩), 새 섹션 순서·클래스(Task 4가 스타일링). 기존 id(`hero/work/process/career/activities/skills/contact`)와 works 렌더링 훅(`#filters`, `#workGrid`, `#modal`, `#modalContent`)은 유지.

- [ ] **Step 1: head 폰트·FOUC 스크립트 교체**

기존 Noto Sans KR `<link>` 3줄을 아래로 교체:
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/geist@1/dist/fonts/geist-sans/style.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/geist@1/dist/fonts/geist-mono/style.min.css" rel="stylesheet">
<script>
  (function () {
    var p = new URLSearchParams(location.search).get('theme');
    var saved = p || localStorage.getItem('theme');
    var dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  })();
</script>
```
(`?theme=dark|light` 파라미터는 헤드리스 검증·공유용.)

- [ ] **Step 2: 네비에 다크모드 토글 추가**

`nav.nav-links` 닫는 태그 뒤(nav-inner 안)에:
```html
<button id="themeToggle" class="theme-toggle" type="button" aria-label="다크모드 전환">◐</button>
```

- [ ] **Step 3: 히어로에 About 흡수**

기존 `#hero` 섹션과 `#about` 섹션 전체를 아래 하나로 교체 (About 섹션 삭제):
```html
<!-- Hero (About 흡수) -->
<section id="hero" class="hero">
  <div class="container hero-inner">
    <p class="hero-eyebrow">Content Marketer · 김태경</p>
    <h1 class="hero-title">기획하고, 분석해서<br>사람을 움직이는 콘텐츠</h1>
    <div class="hero-badge">🏆 우수사례 공모전 청년영상부문 장려상</div>
    <div class="hero-about">
      <img class="hero-photo" src="assets/images/profile.jpg" alt="김태경 프로필 사진">
      <div class="hero-about-text">
        <p class="hero-quote">"보는 콘텐츠에서 끝내지 않고, 행동으로 잇습니다."</p>
        <p class="hero-sub">문제를 정의하고 <strong>데이터로 타깃과 콘셉트를 설계하는 기획</strong>에 강합니다. 세운 전략을 카드뉴스·배너·영상 등 <strong>실제 디자인 산출물로 직접 구현</strong>하고, 결과를 다시 다음 기획에 반영합니다.</p>
        <p class="hero-edu">부경대학교 식품영양학과 졸업 · 영양사 면허</p>
      </div>
    </div>
    <ul class="hero-strengths">
      <li><strong>전략적 기획력</strong><span>문제 정의부터 타깃·콘셉트 설계까지, 설문·반응 분석으로 방향을 검증</span></li>
      <li><strong>기획-디자인 풀사이클</strong><span>전략을 촬영·편집·배너·캐러셀 디자인까지 직접 실행해 완결</span></li>
      <li><strong>F&amp;B 전문성</strong><span>식품영양학 전공·영양사 면허로 라벨·성분을 읽는 차별화된 시각</span></li>
    </ul>
    <a href="#work" class="hero-cta">작업물 보기 ↓</a>
  </div>
</section>
```
네비의 `소개` 링크는 `#hero`로 변경.

- [ ] **Step 4: 섹션 재배치·번호 라벨**

순서를 `hero → work → process → career → activities(+skills) → contact`로 이동하고 라벨 교체:
- Work: `<p class="section-label">01 — WORK</p>`, 타이틀 "대표 작업물" 유지
- Process: `02 — HOW I WORK`
- Career: `03 — CAREER`. 타임라인 항목을 시간 역순으로 재정렬: 병원(2025) → 필라테스(2022) → YC(2020).
- Activities: `04 — ACTIVITIES & SKILLS`. 기존 `#skills` 섹션의 `.skills-block`을 통째로 activities 섹션 컨테이너 맨 아래로 이동하고(`#skills` 섹션 래퍼는 삭제, 블록에 `id="skills"` 부여), 네비 앵커 호환 유지.
- Contact: `05 — CONTACT`. `section-dark` 클래스와 `light` 클래스 제거(모노크롬 보더 구분, Task 4에서 스타일).
- 모든 `section-alt` 클래스 제거(교차 배경 폐지).

- [ ] **Step 5: 브라우저 확인**

`open http://localhost:8765` (또는 스크린샷) — 스타일 깨짐은 무시하고 섹션 순서·콘텐츠 누락만 확인. 특히: About 내용이 히어로에 있는지, 수상 명칭이 "우수사례 공모전 청년영상부문 장려상"인지, Career가 2025→2022→2020 순인지.

- [ ] **Step 6: Commit**

```bash
cd ~/Portfolio && git add modified/index.html && git commit -m "feat: 에디토리얼 원컬럼 구조로 섹션 재배치 (About 히어로 흡수, 번호 라벨)"
```

---

### Task 4: style.css 전면 재작성

**Files:**
- Modify: `modified/css/style.css` (전체 교체)

**Interfaces:**
- Consumes: Task 3의 마크업 클래스, Task 2의 `.work-card-summary`, Task 3의 `.theme-toggle`.

- [ ] **Step 1: 토큰 블록 작성 (파일 최상단, 그대로 사용)**

```css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0 0 0);
  --primary: oklch(0 0 0);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.94 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.44 0 0);
  --accent: oklch(0.94 0 0);
  --border: oklch(0.92 0 0);
  --input: oklch(0.94 0 0);
  --ring: oklch(0 0 0);
  --radius: 0.5rem;
  --font-sans: Geist, "Pretendard Variable", Pretendard, sans-serif;
  --font-mono: "Geist Mono", monospace;
  --shadow: 0px 1px 2px 0px hsl(0 0% 0% / 0.18);
}
.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(1 0 0);
  --card: oklch(0.14 0 0);
  --card-foreground: oklch(1 0 0);
  --primary: oklch(1 0 0);
  --primary-foreground: oklch(0 0 0);
  --secondary: oklch(0.25 0 0);
  --muted: oklch(0.23 0 0);
  --muted-foreground: oklch(0.72 0 0);
  --accent: oklch(0.32 0 0);
  --border: oklch(0.26 0 0);
  --input: oklch(0.32 0 0);
  --ring: oklch(0.72 0 0);
}
```

- [ ] **Step 2: 컴포넌트 스타일 작성 — 아래 스펙을 정확히 따를 것**

전역/레이아웃:
- `body`: `background var(--background)`, `color var(--foreground)`, `font-family var(--font-sans)`, `line-height 1.6`, `transition: background .2s, color .2s`
- `.container`: `max-width 1080px`, 좌우 패딩 `24px`(모바일 `20px`)
- `.section`: 상하 패딩 `96px`(모바일 `64px`), `border-top: 1px solid var(--border)`
- 링크·버튼 포커스: `outline: 2px solid var(--ring); outline-offset: 2px`

네비:
- `.nav`: `position sticky; top 0`, `background color-mix(in oklab, var(--background) 85%, transparent)`, `backdrop-filter: blur(8px)`, `border-bottom 1px solid var(--border)`, 높이 `56px`
- `.nav-logo`: `font-family var(--font-mono)`, 소문자, `.nav-logo-sub`는 `var(--muted-foreground)` 12px
- `.nav-links a`: 14px, `color var(--muted-foreground)`, hover 시 `var(--foreground)`
- `.theme-toggle`: `width/height 32px`, `border 1px solid var(--border)`, `border-radius var(--radius)`, `background transparent`, `cursor pointer`, 16px

히어로:
- `.hero`: 상단 패딩 `140px`, 하단 `96px`, border-top 없음
- `.hero-eyebrow`: `var(--font-mono)` 13px, `letter-spacing .12em`, uppercase, `var(--muted-foreground)`
- `.hero-title`: `clamp(2.6rem, 7vw, 4.8rem)`, `font-weight 800`, `letter-spacing -0.03em`, `line-height 1.08`
- `.hero-badge`: 인라인 블록, `border 1px solid var(--foreground)`, `border-radius 999px`, 패딩 `8px 18px`, 14px, `font-weight 600`, 마진 상 `28px`
- `.hero-about`: `display flex; gap 32px; align-items center`, 마진 상 `40px`. `.hero-photo`: `120px` 정방형, `border-radius var(--radius)`, `object-fit cover`, `border 1px solid var(--border)`. 모바일: 세로 스택
- `.hero-quote`: 18px `font-weight 700`; `.hero-sub`: 16px `var(--muted-foreground)` (strong은 `var(--foreground)`); `.hero-edu`: 13px `var(--font-mono)` `var(--muted-foreground)`
- `.hero-strengths`: 3열 그리드(모바일 1열), `gap 1px`, `background var(--border)`, `border 1px solid var(--border)` — 셀은 `background var(--background)`, 패딩 `20px`, strong 15px 블록 + span 13px `var(--muted-foreground)`
- `.hero-cta`: `display inline-block`, 마진 상 `40px`, `background var(--primary)`, `color var(--primary-foreground)`, 패딩 `14px 28px`, `border-radius var(--radius)`, `font-weight 600`, hover `opacity .85`

섹션 라벨/타이틀:
- `.section-label`: `var(--font-mono)` 13px, `letter-spacing .12em`, `var(--muted-foreground)`
- `.section-title`: `clamp(1.6rem, 3.5vw, 2.4rem)`, `font-weight 800`, `letter-spacing -0.02em`, 마진 하 `40px`

Work:
- `.filters`: 플렉스 `gap 8px`; `.filter`: `border 1px solid var(--border)`, `border-radius 999px`, 패딩 `6px 16px`, 14px, `background transparent`; `.filter.active`: `background var(--primary)`, `color var(--primary-foreground)`, `border-color var(--primary)`
- `.work-grid`: 2열 그리드(모바일 1열), `gap 24px`
- `.work-card`: `border 1px solid var(--border)`, `border-radius var(--radius)`, `background var(--card)`, `overflow hidden`, `cursor pointer`, hover 시 `border-color var(--foreground)` + `transform translateY(-2px)`, `transition .15s`
- `.work-card-thumb`: `aspect-ratio 16/9`, img `object-fit cover` 100%; `.work-card-badge`: 좌상단 오버레이, `background var(--background)`, `border 1px solid var(--border)`, `var(--font-mono)` 11px, 패딩 `4px 10px`, `border-radius 999px`
- `.work-card-title`: 19px `font-weight 700`; 카드 내부 패딩 `20px`
- `.work-card-summary`: 리스트 스타일 없음, 각 `li`는 13px, `padding 6px 0`, `border-top 1px solid var(--border)`(첫 항목 제외); `li span`(라벨): `var(--font-mono)` 11px, `var(--muted-foreground)`, `margin-right 10px`, uppercase
- `.work-card-sub` 14px / `.work-card-result` 14px `font-weight 600`

Process:
- `.process`: 5열 그리드(태블릿 2~3열, 모바일 1열), `gap 1px`, `background var(--border)`, `border 1px solid var(--border)`; 각 `.process-step`: `background var(--background)`, 패딩 `24px`
- `.process-num`: `var(--font-mono)` 13px `var(--muted-foreground)`; h3 16px; p 13.5px `var(--muted-foreground)`

Career:
- `.timeline`: 좌측 보더 라인(`border-left 1px solid var(--border)`), 항목 `padding-left 32px`, 마커는 `::before`로 8px 사각(`background var(--foreground)`)
- `.timeline-period`: `var(--font-mono)` 13px `var(--muted-foreground)`; h3 18px; `.role-tag`: `border 1px solid var(--border)` 999px 배지 12px
- `.activity-tags span` / `.tag`: `border 1px solid var(--border)`, `border-radius 999px`, 패딩 `4px 12px`, 13px, `background var(--muted)` 없이 투명; `.tag.tool`은 `background var(--muted)`

Activities/Skills/Contact:
- `.activity-card`: work-card와 동일 보더 카드, 가로 스크롤 스트립(기존 구조 유지), 최소폭 `340px`
- `.activity-stari li strong`: `var(--font-mono)` 11px uppercase `var(--muted-foreground)` 블록
- `.proposal-summary`·`.activity-proposal-strip`: 기존 레이아웃 유지하되 보더·라운드 토큰만 교체
- `.skills-block`: 3열 그리드(모바일 1열), 그룹 h3는 15px + 하단 보더
- `#contact.section`: 배경 `var(--background)` 유지, `.section-title` 크게(`clamp(1.8rem,4vw,2.8rem)`); `.contact-links a`: `border 1px solid var(--foreground)`, 패딩 `12px 24px`, `border-radius var(--radius)`, hover 시 `background var(--primary)` `color var(--primary-foreground)`
- `.footer`: 13px `var(--muted-foreground)`, `border-top 1px solid var(--border)`, 패딩 `32px 0`

모달/갤러리 (기존 클래스명 유지, 토큰만 교체):
- `.modal-backdrop`: `background rgb(0 0 0 / .6)`; `.modal-dialog`: `background var(--card)`, `border 1px solid var(--border)`, `border-radius var(--radius)`, `max-width 880px`, `max-height 88vh`, `overflow-y auto`, 패딩 `40px`(모바일 `20px`)
- `.modal-block h4`: `var(--font-mono)` 12px uppercase `letter-spacing .1em` `var(--muted-foreground)`, 하단 보더
- `.gallery`: 3열 그리드(`gallery-2`는 2열, 모바일 1열), img `border 1px solid var(--border)` `border-radius var(--radius)`
- `.swatch`, `.insight-list`, `.decision-list`, `.impact-list`, `.modal-links` 등 기존 모달 내 요소 전부 새 토큰으로 재스타일 (누락 시 브라우저 기본값 노출됨 — style.css 재작성 전 기존 파일의 셀렉터 목록과 대조할 것)

반응형 브레이크포인트: `900px`(그리드 축소), `640px`(1열·모바일 패딩).

- [ ] **Step 3: 시각 확인**

라이트/다크 × 데스크톱(1440)/모바일(390) 4장 스크린샷:
```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for t in light dark; do
  "$CHROME" --headless=new --screenshot=/tmp/pf-$t-desktop.png --window-size=1440,2400 "http://localhost:8765/?theme=$t"
  "$CHROME" --headless=new --screenshot=/tmp/pf-$t-mobile.png --window-size=390,2400 "http://localhost:8765/?theme=$t"
done
```
Read 도구로 4장을 열어 확인: 대비 정상(다크에서 검정 글자 잔존 없음), 히어로 타이포 크기, 카드 보더, 타임라인 마커.

- [ ] **Step 4: Commit**

```bash
cd ~/Portfolio && git add modified/css/style.css && git commit -m "feat: 흑백 모노크롬 테마 CSS 전면 재작성 (라이트/다크 토큰)"
```

---

### Task 5: 다크모드 토글 JS

**Files:**
- Modify: `modified/js/main.js` (파일 끝에 추가)

**Interfaces:**
- Consumes: Task 3의 `#themeToggle` 버튼, head FOUC 스크립트와 동일한 `localStorage.theme` 키.

- [ ] **Step 1: 토글 로직 추가 (main.js 끝)**

```js
// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
}
```

- [ ] **Step 2: 동작 확인**

브라우저에서 토글 클릭 → 즉시 전환 + 새로고침 후 유지 확인. (헤드리스로는 확인 불가 — 로컬 브라우저나 개발자에게 확인 요청)

- [ ] **Step 3: Commit**

```bash
cd ~/Portfolio && git add modified/js/main.js && git commit -m "feat: 다크모드 토글 (localStorage + prefers-color-scheme)"
```

---

### Task 6: 통합 검증

**Files:** 없음 (검증만)

- [ ] **Step 1: 기능 체크리스트**

로컬 서버(`http://localhost:8765`)에서:
1. Work 필터 4종 클릭 → 카드 필터링 정상
2. 농심 카드가 맨 앞 + 3줄 요약 표시 → 클릭 시 모달에 insights/approach/6p 갤러리 표시
3. 더세포·기존 카드 모달 회귀 확인 (summary 없는 카드는 subtitle/result 폴백)
4. 네비 앵커 5개 + `#skills` 앵커 이동 정상
5. Career 순서 2025 → 2022 → 2020
6. 다크모드: 토글·새로고침 유지·시스템 설정 반영

- [ ] **Step 2: 최종 스크린샷 4장 (Task 4 Step 3 명령 재실행) 확인 후 서버 종료**

- [ ] **Step 3: 결과 보고**

스크린샷과 함께 사용자에게 보고. 배포(git push)는 사용자 확인 후에만.
