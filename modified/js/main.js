// ===== State =====
let works = [];
let activeFilter = 'all';

const grid = document.getElementById('workGrid');
const filtersEl = document.getElementById('filters');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

// ===== Load data =====
fetch('data/works.json')
  .then((r) => r.json())
  .then((data) => {
    works = data;
    renderGrid();
  })
  .catch((err) => {
    grid.innerHTML = '<p style="color:#999">작업물을 불러오지 못했습니다.</p>';
    console.error(err);
  });

// ===== Render grid =====
function renderGrid() {
  const list = activeFilter === 'all'
    ? works
    : works.filter((w) => w.category === activeFilter);

  grid.innerHTML = list.map((w) => `
    <article class="work-card" data-id="${w.id}">
      ${w.thumb ? `<div class="work-card-thumb">
        <img src="${w.thumb}" alt="${w.title} 썸네일" loading="lazy">
        ${w.video ? '<span class="work-card-play">▶</span>' : ''}
        <span class="work-card-badge">${w.categoryLabel}</span>
        ${w.inProgress ? '<span class="work-card-progress">진행 중</span>' : ''}
      </div>` : ''}
      <div class="work-card-top">
        ${w.thumb ? '' : `<span class="work-card-cat">${w.categoryLabel}</span>`}
        <h3 class="work-card-title">${w.title}</h3>
      </div>
      <div class="work-card-body">
        <p class="work-card-sub">${w.subtitle}</p>
        <p class="work-card-result">${w.result}</p>
      </div>
    </article>
  `).join('');
}

// ===== Filter clicks =====
filtersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  filtersEl.querySelectorAll('.filter').forEach((b) => b.classList.toggle('active', b === btn));
  renderGrid();
});

// ===== Open modal (event delegation on grid) =====
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.work-card');
  if (!card) return;
  const work = works.find((w) => w.id === card.dataset.id);
  if (work) openModal(work);
});

function ytEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function openModal(w) {
  const embed = ytEmbed(w.link);
  modalContent.innerHTML = `
    ${w.video
      ? `<video class="modal-video" src="${w.video}" controls playsinline preload="metadata"${w.poster ? ` poster="${w.poster}"` : ''}></video>`
      : embed
        ? `<iframe class="modal-video" src="${embed}" title="${w.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
        : ''}
    <p class="modal-cat">${w.categoryLabel}${w.inProgress ? ' <span class="modal-progress">진행 중</span>' : ''}</p>
    <h3 class="modal-title">${w.title}</h3>
    <p class="modal-subtitle">${w.subtitle}</p>
    <p class="modal-meta">${w.role} · ${w.period}</p>
    <div class="modal-tags">${w.tags.map((t) => `<span>${t}</span>`).join('')}</div>

    ${w.concept ? `
    <div class="modal-block">
      <h4>브랜드 콘셉트</h4>
      <p>${w.concept}</p>
      ${w.palette ? `<div class="palette">${w.palette.map((c) => `
        <div class="swatch"><span style="background:${c.hex}"></span><em>${c.name}</em><small>${c.hex}</small></div>`).join('')}</div>` : ''}
      ${w.sourceUrl ? `<a class="source-link" href="${w.sourceUrl}" target="_blank" rel="noopener">${w.sourceLabel || '원본 보기'} ↗</a>` : ''}
    </div>` : ''}

    ${w.contribution ? `
    <div class="modal-block">
      <h4>My Role · 기여도</h4>
      <p class="modal-contribution">${w.contribution}</p>
    </div>` : ''}
    ${w.context ? `
    <div class="modal-block">
      <h4>Context · 배경</h4>
      <p>${w.context}</p>
    </div>` : ''}
    ${w.insights && w.insights.length ? `
    <div class="modal-block">
      <h4>Key Insights · 설문 분석</h4>
      <ul class="insight-list">${w.insights.map((p) => `<li>${p}</li>`).join('')}</ul>
    </div>` : ''}
    ${w.approach && w.approach.length ? `
    <div class="modal-block">
      <h4>Approach &amp; Decisions · 접근과 판단</h4>
      <ul class="decision-list">${w.approach.map((a) => `
        <li><strong>${a.decision}</strong><span>${a.why}</span></li>`).join('')}</ul>
    </div>` : ''}
    ${w.workflow && w.workflow.length ? `
    <div class="modal-block">
      <h4>Workflow · 진행 과정</h4>
      <ul>${w.workflow.map((p) => `<li>${p}</li>`).join('')}</ul>
    </div>` : ''}
    ${w.impact && w.impact.length ? `
    <div class="modal-block">
      <h4>Impact · 성과</h4>
      <ul class="impact-list">${w.impact.map((p) => `<li>${p}</li>`).join('')}</ul>
    </div>` : ''}
    ${w.tools && w.tools.length ? `
    <div class="modal-block">
      <h4>사용 도구</h4>
      <div class="tags">${w.tools.map((t) => `<span class="tag tool">${t}</span>`).join('')}</div>
    </div>` : ''}
    ${w.gallery && w.gallery.length ? `
    <div class="modal-block">
      <h4>${w.galleryLabel || '브랜드 비주얼'}</h4>
      <div class="gallery${w.galleryCols === 2 ? ' gallery-2' : ''}">${w.gallery.map((item) => {
        const src = typeof item === 'string' ? item : item.src;
        const caption = typeof item === 'string' ? '' : item.caption;
        return `<figure class="gallery-item"><img src="${src}" alt="${caption || w.title}" loading="lazy">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
      }).join('')}</div>
    </div>` : ''}
    ${w.link || w.altLink ? `<div class="modal-links">
      ${w.link ? `<a class="modal-link" href="${w.link}" target="_blank" rel="noopener">${w.linkLabel ? `${w.linkLabel} ↗` : (embed ? '유튜브에서 보기 ↗' : '▶ 영상 보기')}</a>` : ''}
      ${w.altLink ? `<a class="modal-link" href="${w.altLink}" target="_blank" rel="noopener">${w.altLabel || '바로가기'} ↗</a>` : ''}
    </div>` : ''}
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const vid = modalContent.querySelector('video');
  if (vid) vid.pause();
  const frame = modalContent.querySelector('iframe');
  if (frame) frame.src = frame.src; // reload to stop YouTube playback
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ===== Close handlers =====
modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
