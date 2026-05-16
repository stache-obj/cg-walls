/**
 * CGWALLS — Data Layer
 * Wallpapers are fetched from GitHub. Swap WALLPAPERS_URL when you move to a real backend.
 */

const WALLPAPERS_URL =
  'https://raw.githubusercontent.com/milanmishrarighter/ht/refs/heads/main/wallpapers.json';

let _cache = null;

async function fetchWallpapers() {
  if (_cache) return _cache;
  const res = await fetch(WALLPAPERS_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: failed to fetch wallpapers`);

  const data = await res.json();

  // Replace example.com placeholder links from the JSON with real placeholder images
  _cache = data.map(w => {
    if (w.thumbnail && w.thumbnail.includes('example.com')) {
      w.thumbnail = `https://picsum.photos/seed/${w.id}/800/800`;
    }
    if (w.link && w.link.includes('example.com')) {
      w.link = `https://picsum.photos/seed/${w.id}/1920/1080`;
      w.download_url = w.link;
    }
    return w;
  });

  return _cache;
}

/** Stub — replace with real analytics POST when backend is ready */
async function trackDownload(wallId) {
  console.log('[CGWALLS] download tracked:', wallId);
  // TODO: await fetch('/api/track', { method:'POST', body: JSON.stringify({ id: wallId, event:'download' }) });
}

/** Stub — replace with Mailchimp / ConvertKit POST when ready */
async function subscribeEmail(email) {
  console.log('[CGWALLS] newsletter subscription:', email);
  // TODO: POST to your mailing-list endpoint
  return { success: true };
}
