/* ================================================================
   CGWALLS — Main Entry Point
   ================================================================ */

// ── Funding config (replace links when ready) ──────────────────
const FUNDING = {
  kofi:    { link: 'https://ko-fi.com/YOUR_USERNAME',    raised: '$120', target: '$500'  },
  patreon: { link: 'https://patreon.com/YOUR_USERNAME',  raised: '$340', target: '$1000' }
};

document.getElementById('kofiBtn').href    = FUNDING.kofi.link;
document.getElementById('patreonBtn').href = FUNDING.patreon.link;
document.getElementById('kofiRaised').textContent    = `${FUNDING.kofi.raised} / ${FUNDING.kofi.target}`;
document.getElementById('patreonRaised').textContent = `${FUNDING.patreon.raised} / ${FUNDING.patreon.target}`;

// ── Toast ──────────────────────────────────────────────────────
function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.innerHTML = type === 'success'
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>${message}`
    : message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .25s cubic-bezier(.4,0,.2,1) forwards';
    setTimeout(() => toast.remove(), 260);
  }, 2800);
}

// ── Back to top ────────────────────────────────────────────────
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => btt.classList.toggle('visible', scrollY > 400), { passive: true });
btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// ── Animated counter ───────────────────────────────────────────
function animateCount(el, target) {
  const start = performance.now();
  const dur   = 1100;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// ── Init ───────────────────────────────────────────────────────
async function init() {
  // Skeleton placeholders
  const grid = document.getElementById('wallGrid');
  grid.innerHTML = Array(12).fill(0).map(() => `
    <div class="wall-card skeleton">
      <div class="wall-thumb-wrap">
        <div class="shimmer" style="width:100%;aspect-ratio:1/1;"></div>
      </div>
      <div class="wall-info">
        <div class="wall-meta">
          <div class="shimmer" style="height:13px;width:60%;border-radius:4px;margin-bottom:7px;"></div>
          <div class="shimmer" style="height:10px;width:38%;border-radius:4px;"></div>
        </div>
      </div>
    </div>`).join('');

  try {
    const walls = await fetchWallpapers();

    // Stats
    const artists = new Set(walls.map(w => w.artist)).size;
    const tags    = new Set(walls.flatMap(w => w.tags || [])).size;

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const sW = document.getElementById('statWalls');
        const sA = document.getElementById('statArtists');
        const sT = document.getElementById('statTags');
        if (sW) animateCount(sW, walls.length);
        if (sA) animateCount(sA, artists);
        if (sT) animateCount(sT, tags);
        io.disconnect();
      }
    }, { threshold: .5 });
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) io.observe(statsBar);

    buildCarousel(walls);
    buildGrid(walls);
    initSearch();
    initModal();
    initNewsletter();

  } catch (err) {
    console.error('[CGWALLS]', err);
    grid.innerHTML = `<div class="empty-state">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p>Failed to load wallpapers</p>
      <span>Check your connection and refresh the page.</span>
    </div>`;
  }
}

init();
