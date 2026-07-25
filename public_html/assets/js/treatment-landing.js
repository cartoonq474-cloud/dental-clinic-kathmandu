/**
 * Treatment Landing Page Interactive Features
 * BrightSmile Dental Clinic - Kathmandu
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initBookingForm();
  initSmoothScroll();
});

/* --- Before / After Drag Slider --- */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  const beforeImg = document.getElementById('baImgBefore');
  const handle = document.getElementById('baHandle');

  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  const move = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    beforeImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Mouse Events
  handle.addEventListener('mousedown', () => { isDragging = true; });
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    move(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    move(e.clientX);
  });

  // Touch Events for Mobile
  handle.addEventListener('touchstart', () => { isDragging = true; });
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches.length > 0) move(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) move(e.touches[0].clientX);
  });
}

/* --- Hero Lead Capture Form Handler --- */
function initBookingForm() {
  const form = document.getElementById('landingLeadForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('leadName')?.value.trim();
    const phone = document.getElementById('leadPhone')?.value.trim();
    const preferredDate = document.getElementById('leadDate')?.value;

    if (!name || !phone) {
      alert('Please provide your name and phone number so our Kathmandu team can reach you.');
      return;
    }

    const submitBtn = form.querySelector('.booking-form-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Booking Your Slot...';
    }

    setTimeout(() => {
      form.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="width: 56px; height: 56px; background: #DCFCE7; color: #166534; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: bold;">✓</div>
          <h4 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-dark);">Appointment Request Received!</h4>
          <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">Thank you, <strong>${name}</strong>. Our front desk at Putalisadak clinic will call you shortly at <strong>${phone}</strong> to confirm your slot.</p>
          <p style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">For urgent inquiries, call us directly at +977-9800000000</p>
        </div>
      `;
    }, 800);
  });
}

/* --- Smooth Scrolling for CTA Buttons --- */
function initSmoothScroll() {
  const scrollBtns = document.querySelectorAll('[data-scroll-to]');
  scrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-scroll-to');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
