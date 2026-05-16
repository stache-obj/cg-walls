/* ================================================================
   CGWALLS — Modal JS
   ================================================================ */

let _modalList  = [];
let _modalIndex = 0;

function initModal() {
  const overlay  = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const prevBtn  = document.getElementById('modalPrev');
  const nextBtn  = document.getElementById('modalNext');
  const dlBtn    = document.getElementById('modalDownload');
  const copyBtn  = document.getElementById('modalCopyLink');
  if (!overlay) return;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click',  () => navModal(-1));
  nextBtn.addEventListener('click',  () => navModal(+1));
  dlBtn.addEventListener('click',    handleDownload);
  copyBtn.addEventListener('click',  handleCopyLink);

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  navModal(-1);
    if (e.key === 'ArrowRight') navModal(+1);
  });
}

function openModal(wall, list, index) {
  _modalList  = (list && list.length) ? list : [wall];
  _modalIndex = index !== undefined ? index : 0;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  populateModal(_modalList[_modalIndex]);

  const hasNav = _modalList.length > 1;
  document.getElementById('modalPrev').style.display = hasNav ? '' : 'none';
  document.getElementById('modalNext').style.display = hasNav ? '' : 'none';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function navModal(dir) {
  _modalIndex = (_modalIndex + dir + _modalList.length) % _modalList.length;
  populateModal(_modalList[_modalIndex]);
}

function populateModal(wall) {
  const img = document.getElementById('modalImg');
  img.src = wall.thumbnail;
  img.alt = wall.name;

  document.getElementById('modalName').textContent   = wall.name;
  document.getElementById('modalArtist').textContent = 'by ' + wall.artist;

  const catBadge = document.getElementById('modalCategory');
  const catMap   = { phone: '📱 Mobile', desktop: '🖥️ Desktop', both: '📱🖥️ Both' };
  const catValue = wall.category || 'both';
  catBadge.textContent = catMap[catValue] || catValue;
  catBadge.className   = 'modal-cat-badge cat-' + catValue;

  const modalBox = document.querySelector('.modal-box');
  if (modalBox) {
    modalBox.className = 'modal-box modal-box--' + catValue;
  }

  const resEl = document.getElementById('modalResolution');
  if (resEl) resEl.textContent = wall.resolution || 'Original Quality';

  const tagsEl = document.getElementById('modalTags');
  if (tagsEl) {
    tagsEl.innerHTML = (wall.tags || [])
      .map(t => `<span class="modal-tag">${t}</span>`)
      .join('');
  }

  const dlBtn = document.getElementById('modalDownload');
  if (dlBtn) {
    dlBtn.dataset.url  = wall.download_url || wall.thumbnail;
    dlBtn.dataset.id   = wall.id;
    dlBtn.dataset.name = wall.name;
  }
}

async function handleDownload() {
  const btn  = document.getElementById('modalDownload');
  const url  = btn.dataset.url;
  const name = (btn.dataset.name || 'wallpaper').replace(/\s+/g, '-').toLowerCase();
  if (btn.dataset.id) await trackDownload(btn.dataset.id);

  try {
    const a  = document.createElement('a');
    a.href   = url;
    a.download = `cgwalls-${name}.jpg`;
    a.target   = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Download started! ⬇', 'success');
  } catch {
    window.open(url, '_blank');
  }
}

function handleCopyLink() {
  const wall = _modalList[_modalIndex];
  const url  = `${location.origin}${location.pathname}?wall=${wall.id || ''}`;
  navigator.clipboard.writeText(url)
    .then(() => showToast('Link copied! 🔗', 'success'))
    .catch(() => showToast('Could not copy link', ''));
}
