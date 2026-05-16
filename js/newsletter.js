/* ================================================================
   CGWALLS — Newsletter JS (Mailchimp-ready placeholder)
   Replace subscribeEmail() in data.js with your real endpoint.
   ================================================================ */

function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const emailInput = form.querySelector('#nlEmail');
    const submitBtn  = form.querySelector('.nl-submit-btn');
    const email      = emailInput.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', '');
      emailInput.focus();
      return;
    }

    const origText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing…';
    submitBtn.disabled = true;

    try {
      await subscribeEmail(email);
      form.innerHTML = `
        <div class="newsletter-success">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>You're in! Updates will land at <strong>${email}</strong></span>
        </div>`;
      showToast('Subscribed! 🎉', 'success');
    } catch {
      submitBtn.textContent = origText;
      submitBtn.disabled = false;
      showToast('Subscription failed — please try again.', '');
    }
  });
}
