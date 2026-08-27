// GlobalExplorer — Custom Trip Inquiry form + confirmation modal

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inquiry-form');
  const overlay = document.getElementById('inquiry-modal-overlay');
  const closeBtn = document.getElementById('inquiry-modal-close');
  const summaryEl = document.getElementById('inquiry-summary');
  if (!form || !overlay) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || 'Traveler';
    const region = form.querySelector('#region').selectedOptions[0]?.text || 'a destination';
    const dates = data.get('dates') || 'flexible dates';
    const travelers = data.get('travelers') || '1';
    const notes = data.get('notes') || '—';

    summaryEl.innerHTML = `
      <dl class="facts" style="grid-template-columns:auto 1fr;">
        <dt>Traveler</dt><dd>${escapeHTML(name)}</dd>
        <dt>Region</dt><dd>${escapeHTML(region)}</dd>
        <dt>Dates</dt><dd>${escapeHTML(dates)}</dd>
        <dt>Party size</dt><dd>${escapeHTML(travelers)}</dd>
        <dt>Notes</dt><dd>${escapeHTML(notes)}</dd>
      </dl>
    `;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    form.reset();
  });

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
});
