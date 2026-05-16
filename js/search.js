/* ================================================================
   CGWALLS — Search JS
   ================================================================ */

function initSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim();
      setSearch(q);
      if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
    }, 200);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('visible');
      setSearch('');
      input.focus();
    });
  }

  // '/' shortcut to focus search, Escape to blur
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === 'Escape' && document.activeElement === input) input.blur();
  });
}
