/* ================================================================
   CGWALLS — Grid JS (render, filter, sort)
   ================================================================ */

const CAT_ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`,
  desktop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  both: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="14" height="10" rx="1.5"/><rect x="14" y="6" width="8" height="13" rx="1.5"/><circle cx="18" cy="17.5" r=".8" fill="currentColor" stroke="none"/></svg>`
};
const CAT_LABELS = { phone: 'Mobile', desktop: 'Desktop', both: 'Phone & Desktop' };

let _allWalls   = [];
let _filter     = 'all';
let _sort       = 'newest';
let _query      = '';

function buildGrid(wallpapers) {
  _allWalls = wallpapers;
  initFilters();
  initSort();
  renderGrid();
}

function initFilters() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      _filter = pill.dataset.filter;
      renderGrid();
    });
  });
}

function initSort() {
  const sel = document.getElementById('sortSelect');
  if (sel) sel.addEventListener('change', () => { _sort = sel.value; renderGrid(); });
}

function setSearch(query) {
  _query = query;
  renderGrid();
}

function getVisible() {
  let walls = [..._allWalls];

  if (_filter !== 'all')
    walls = walls.filter(w => w.category === _filter || w.category === 'both');

  if (_query) {
    const terms = _query.toLowerCase().split(/\s+/).filter(Boolean);
    walls = walls.filter(w => {
      // Combine all searchable fields into one big string
      const searchableText = [
        w.name,
        w.artist,
        w.category || w.type,
        ...(w.tags || []),
        ...(w.software || [])
      ].filter(Boolean).join(' ').toLowerCase();

      // Check if every search term is found somewhere in the combined text
      return terms.every(term => searchableText.includes(term));
    });
  }

  switch (_sort) {
    case 'oldest':  walls.sort((a,b) => (a.id||0) - (b.id||0));  break;
    case 'popular': walls.sort((a,b) => ((b.views||0) - (a.views||0))); break;
    default:        walls.sort((a,b) => (b.id||0) - (a.id||0));  break;
  }
  return walls;
}

function renderGrid() {
  const grid    = document.getElementById('wallGrid');
  const label   = document.getElementById('searchResultsLabel');
  const curated = document.getElementById('curatedSection');
  const divider = document.getElementById('mainDivider');

  const walls      = getVisible();
  const isSearching = !!_query;

  if (curated) curated.style.display = isSearching ? 'none' : '';
  if (divider) divider.style.display = isSearching ? 'none' : '';

  if (label) {
    label.style.display = isSearching ? 'block' : 'none';
    if (isSearching) {
      label.innerHTML = walls.length > 0
        ? `Showing <span>${walls.length}</span> result${walls.length !== 1 ? 's' : ''} for "<span>${_query}</span>"`
        : `No wallpapers found for "<span>${_query}</span>"`;
    }
  }

  grid.innerHTML = '';

  if (walls.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p>Nothing found</p><span>Try tags like: nature · city · space · abstract</span>
    </div>`;
    return;
  }

  walls.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'wall-card';
    card.style.animationDelay = `${Math.min(i * 35, 350)}ms`;
    const cat = w.category || 'both';

    card.innerHTML = `
      <div class="wall-thumb-wrap">
        <img class="wall-thumb" src="${w.thumbnail}" alt="${w.name}" loading="lazy">
        <div class="wall-hover-overlay">
          <button class="quick-view-btn" aria-label="View ${w.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span class="pill-label">View</span>
          </button>
        </div>
      </div>
      <div class="wall-info">
        <div class="wall-meta">
          <div class="wall-name">${w.name}</div>
          <div class="wall-artist">by ${w.artist}</div>
        </div>
        <div class="cat-icon cat-${cat}" title="${CAT_LABELS[cat] || cat}">
          ${CAT_ICONS[cat] || CAT_ICONS.both}
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(w, walls, i));
    grid.appendChild(card);
  });
}
