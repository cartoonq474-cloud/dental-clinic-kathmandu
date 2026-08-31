/**
 * Treatment Landing Page Interactive Features
 * BrightSmile Dental Clinic - Kathmandu
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initBookingForm();
  initSmoothScroll();
  initTreatmentFaqs();
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('leadName')?.value.trim();
    const phone = document.getElementById('leadPhone')?.value.trim();
    const option = document.getElementById('leadOption')?.value;
    const preferredDate = document.getElementById('leadDate')?.value;

    if (!name || !phone) {
      alert('Please provide your name and phone number so our Kathmandu team can reach you.');
      return;
    }

    const submitBtn = form.querySelector('.booking-form-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Dispatching Request...';
    }

    const pageTitle = document.title.split('-')[0].trim();
    const leadPayload = {
      _subject: `New Lead: ${pageTitle} - ${name} (BrightSmile Kathmandu)`,
      _captcha: "false",
      _template: "table",
      "Patient Name": name,
      "Phone / WhatsApp": phone,
      "Selected Option / Symptoms": option || "Standard Inquiry",
      "Preferred Date": preferredDate || "Earliest Available",
      "Treatment Landing Page": window.location.pathname,
      "Full URL": window.location.href,
      "Submission Time": new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })
    };

    try {
      await fetch('https://formsubmit.co/ajax/dentalinkathmandu@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(leadPayload)
      });
    } catch (err) {
      console.warn('Lead dispatch note:', err);
    }

    form.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <div style="width: 56px; height: 56px; background: #DCFCE7; color: #166534; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; font-weight: bold;">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h4 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-dark);">Appointment Request Received!</h4>
        <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">Thank you, <strong>${name}</strong>. Our front desk at Putalisadak clinic has received your details and will call you shortly at <strong>${phone}</strong> to confirm your appointment.</p>
        <p style="font-size: 0.8rem; color: var(--primary-color); font-weight: 600;">For urgent inquiries, call us directly at +977-9748343015</p>
      </div>
    `;
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

/* --- Categorized Treatment FAQs Handler --- */
function initTreatmentFaqs() {
  const faqTriggers = document.querySelectorAll('.treatment-faq-trigger');
  const catButtons = document.querySelectorAll('.treatment-faq-cat-btn');
  const searchInput = document.getElementById('treatmentFaqSearchInput');
  const faqItems = document.querySelectorAll('.treatment-faq-item');
  const emptyState = document.getElementById('treatmentFaqEmptyState');

  if (faqTriggers.length === 0) return;

  // Accordion Toggle
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.closest('.treatment-faq-item');
      if (!parent) return;
      const isCurrentlyActive = parent.classList.contains('active');

      // Close all other FAQs in the list
      faqItems.forEach(item => {
        item.classList.remove('active');
        const answer = item.querySelector('.treatment-faq-answer');
        if (answer) answer.style.maxHeight = null;
      });

      // Toggle clicked FAQ
      if (!isCurrentlyActive) {
        parent.classList.add('active');
        const answer = parent.querySelector('.treatment-faq-answer');
        if (answer) {
          answer.style.maxHeight = (answer.scrollHeight + 36) + 'px';
        }
      }
    });
  });

  // Filter Logic
  let activeCategory = 'all';
  let searchQuery = '';

  function filterTreatmentFaqs() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    faqItems.forEach(item => {
      const category = item.getAttribute('data-faq-category') || 'procedure';
      const text = item.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all') || (category === activeCategory);
      const matchesSearch = (query === '') || text.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
        const ans = item.querySelector('.treatment-faq-answer');
        if (ans) ans.style.maxHeight = null;
      }
    });

    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  // Category Tab Click
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterTreatmentFaqs();
    });
  });

  // Search Input Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterTreatmentFaqs();
    });
  }
}

