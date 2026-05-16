/* ================================================================
   CGWALLS — Carousel JS
   ================================================================ */

function buildCarousel(wallpapers) {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !dotsContainer) return;

  let featured = wallpapers.filter(w => w.editors_choice === 'y');
  if (featured.length === 0) featured = wallpapers.slice(0, 8);
  if (featured.length === 0) return;

  // Update section pill count
  const pill = document.querySelector('.curated-count');
  if (pill) pill.textContent = featured.length;

  featured.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `
      <img src="${w.thumbnail}" alt="${w.name}" loading="${i < 3 ? 'eager' : 'lazy'}">
      <div class="card-overlay">
        <span class="ec-badge">★ Curated</span>
        <div>
          <div class="card-name">${w.name}</div>
          <div class="card-artist">by ${w.artist}</div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openModal(w, featured, i));
    track.appendChild(card);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      track.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });

  // Sync dots on scroll
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(syncDots, 80);
  }, { passive: true });

  function syncDots() {
    const cards = track.querySelectorAll('.carousel-card');
    const dots  = dotsContainer.querySelectorAll('.dot');
    const tLeft = track.getBoundingClientRect().left;
    let minDist = Infinity, closest = 0;
    cards.forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - tLeft);
      if (d < minDist) { minDist = d; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  }

  const STEP = 290 + 16;
  document.getElementById('carouselPrev').addEventListener('click', () =>
    track.scrollBy({ left: -STEP, behavior: 'smooth' }));
  document.getElementById('carouselNext').addEventListener('click', () =>
    track.scrollBy({ left:  STEP, behavior: 'smooth' }));
}
