document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqs();
  initGalleryTabs();
  initFormValidation();
  initTestimonialTabs();
  initBookingModal();
});

/**
 * Mobile Navigation Menu Toggler
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      
      // Change icon or display state
      const isExpanded = navMenu.classList.contains('active');
      toggleBtn.setAttribute('aria-expanded', isExpanded);
      toggleBtn.innerHTML = isExpanded ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        toggleBtn.innerHTML = '☰';
      }
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/**
 * FAQ Accordion Panels with Live Category Filtering & Search
 */
function initFaqs() {
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  const catButtons = document.querySelectorAll('.faq-cat-btn');
  const searchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');
  const emptyState = document.getElementById('faqEmptyState');
  
  // Accordion Toggle
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.closest('.faq-item');
      if (!parent) return;
      const isCurrentlyActive = parent.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(item => {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
      });
      
      // Toggle clicked FAQ
      if (!isCurrentlyActive) {
        parent.classList.add('active');
        const answer = parent.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = (answer.scrollHeight + 32) + 'px';
        }
      }
    });
  });

  // Filter Logic
  let activeCategory = 'all';
  let searchQuery = '';

  function filterFaqItems() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    faqItems.forEach(item => {
      const category = item.getAttribute('data-faq-category') || 'general';
      const text = item.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all') || (category === activeCategory);
      const matchesSearch = (query === '') || text.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
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
      filterFaqItems();
    });
  });

  // Search Input Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterFaqItems();
    });
  }
}

/**
 * Smile Gallery Tab Filtering
 */
function initGalleryTabs() {
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (tabBtns.length > 0 && galleryItems.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = 'block';
          } else {
            if (item.classList.contains(filterValue)) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          }
        });
      });
    });
  }
}

/**
 * Appointment and Contact Form Validation
 */
function initFormValidation() {
  const bookingForm = document.getElementById('bookingForm');
  const contactForm = document.getElementById('contactForm');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      if (!validateForm(bookingForm)) {
        e.preventDefault();
      } else {
        alert('Thank you for booking! We will contact you shortly to confirm your appointment.');
      }
    });
  }
  
  if (contactForm) {
    // Topic Pills Toggler
    const inquiryPills = contactForm.querySelectorAll('.inquiry-type-pill');
    inquiryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        inquiryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const radio = pill.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) {
        return;
      }
      
      const submitBtn = contactForm.querySelector('#contactSubmitBtn');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending Message...';
      }

      setTimeout(() => {
        const nameVal = document.getElementById('cName') ? document.getElementById('cName').value : 'Patient';
        alert(`Thank you, ${nameVal}! Your message has been received. Our Putalisadak front desk will get back to you shortly.`);
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 500);
    });
  }
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('[required]');
  
  inputs.forEach(input => {
    // Clear previous errors
    clearError(input);
    
    if (!input.value.trim()) {
      showError(input, 'This field is required.');
      isValid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      showError(input, 'Please enter a valid email address.');
      isValid = false;
    } else if (input.type === 'tel' && !validatePhone(input.value)) {
      showError(input, 'Please enter a valid phone number.');
      isValid = false;
    }
  });
  
  return isValid;
}

function showError(input, message) {
  input.classList.add('input-error');
  const errorMsg = document.createElement('span');
  errorMsg.className = 'error-text-span';
  errorMsg.style.color = 'var(--danger)';
  errorMsg.style.fontSize = '0.8rem';
  errorMsg.style.display = 'block';
  errorMsg.style.marginTop = '0.25rem';
  errorMsg.innerText = message;
  
  input.parentNode.appendChild(errorMsg);
}

function clearError(input) {
  input.classList.remove('input-error');
  const errorText = input.parentNode.querySelector('.error-text-span');
  if (errorText) {
    errorText.remove();
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function validatePhone(phone) {
  // Matches simple phone numbers (977... or standard 10 digit)
  const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

/**
 * Switcher for Testimonial Platforms (Google Reviews vs Trustpilot)
 */
function initTestimonialTabs() {
  const tabGoogle = document.getElementById('tabBtnGoogle');
  const tabTP = document.getElementById('tabBtnTrustpilot');
  const googleGrid = document.getElementById('googleReviews');
  const tpGrid = document.getElementById('trustpilotReviews');

  if (tabGoogle && tabTP) {
    tabGoogle.addEventListener('click', () => {
      if (googleGrid) googleGrid.style.display = 'grid';
      if (tpGrid) tpGrid.style.display = 'none';
      tabGoogle.classList.add('active');
      tabTP.classList.remove('active');
    });

    tabTP.addEventListener('click', () => {
      if (googleGrid) googleGrid.style.display = 'none';
      if (tpGrid) tpGrid.style.display = 'grid';
      tabGoogle.classList.remove('active');
      tabTP.classList.add('active');
    });
  }
}

/**
 * Enhanced Book Appointment Page Logic
 */
function initBookingPage() {
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('bDate');
  const timeHiddenInput = document.getElementById('bTime');
  const timeButtons = document.querySelectorAll('.time-slot-btn');
  const typeCards = document.querySelectorAll('.patient-type-card');
  const confirmModal = document.getElementById('bookingConfirmationModal');
  const closeConfirmBtn = document.getElementById('closeConfirmModalBtn');
  const doneConfirmBtn = document.getElementById('doneBookingModalBtn');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }

  // Patient Type Cards Click Handler
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Time Slot Buttons Click Handler
  timeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      timeButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const timeVal = btn.getAttribute('data-time') || btn.innerText;
      if (timeHiddenInput) {
        timeHiddenInput.value = timeVal;
      }
    });
  });

  // Booking Form Submission & Confirmation Modal
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(bookingForm)) {
        return;
      }

      const submitBtn = document.getElementById('bookingSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting Booking...';
      }

      setTimeout(() => {
        // Collect form data
        const nameVal = document.getElementById('bName') ? document.getElementById('bName').value : 'Patient';
        const treatmentSelect = document.getElementById('bTreatment');
        const treatmentText = (treatmentSelect && treatmentSelect.selectedIndex >= 0) 
          ? treatmentSelect.options[treatmentSelect.selectedIndex].text.split('(')[0].trim() 
          : 'Dental Consultation';
        const dateVal = dateInput ? dateInput.value : 'Upcoming';
        const timeVal = timeHiddenInput ? timeHiddenInput.value : '10:00 AM';
        
        // Generate a random Reference ID
        const refId = 'BS-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);

        // Populate confirmation modal
        const nameSpan = document.getElementById('confirmPatientName');
        const refSpan = document.getElementById('confirmBookingRef');
        const treatTd = document.getElementById('confirmTreatment');
        const dateTd = document.getElementById('confirmDateTime');

        if (nameSpan) nameSpan.innerText = nameVal;
        if (refSpan) refSpan.innerText = 'Ref: ' + refId;
        if (treatTd) treatTd.innerText = treatmentText;
        if (dateTd) dateTd.innerText = dateVal + ' at ' + timeVal;

        // Reset submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Confirm Appointment Request (100% Free)
          `;
        }

        // Show confirmation modal
        if (confirmModal) {
          confirmModal.classList.add('active');
          document.body.classList.add('modal-open');
        }

        // Reset form
        bookingForm.reset();
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      }, 600);
    });
  }

  // Close Confirmation Modal Handlers
  if (closeConfirmBtn) {
    closeConfirmBtn.addEventListener('click', () => {
      if (confirmModal) confirmModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }

  if (doneConfirmBtn) {
    doneConfirmBtn.addEventListener('click', () => {
      if (confirmModal) confirmModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      window.location.href = '/';
    });
  }
}

/**
 * Dynamic Booking Modal Popup Handler
 */
function initBookingModal() {
  initBookingPage();

  // If the user is on the /book/ page, don't show the modal popup, just use the inline form
  if (window.location.pathname.includes('/book/') || window.location.pathname.includes('book/index.html')) {
    return;
  }

  const bookBtns = document.querySelectorAll('a[href*="/book/"], a[href="book/"], a[href="../book/"]');
  if (bookBtns.length === 0) return;

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });
}

function openBookingModal() {
  let modal = document.getElementById('bookingModal');
  if (!modal) {
    modal = createBookingModalDOM();
    document.body.appendChild(modal);
    setupModalEvents(modal);
  }

  // Set min date
  const mDate = modal.querySelector('#mbDate');
  if (mDate) {
    const today = new Date().toISOString().split('T')[0];
    mDate.min = today;
    if (!mDate.value) mDate.value = today;
  }

  document.body.classList.add('modal-open');
  modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    
    // Clear form inputs and error messages when closing
    const form = modal.querySelector('#modalBookingForm');
    if (form) {
      form.reset();
      const errorTexts = form.querySelectorAll('.error-text-span');
      errorTexts.forEach(el => el.remove());
      const errorInputs = form.querySelectorAll('.input-error');
      errorInputs.forEach(el => el.classList.remove('input-error'));
    }
  }
}

function createBookingModalDOM() {
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.id = 'bookingModal';
  
  modal.innerHTML = `
    <div class="booking-modal-content" style="max-width: 580px;">
      <div class="booking-modal-header">
        <h3>Book Dental Appointment</h3>
        <button class="booking-modal-close" id="closeBookingModalBtn" aria-label="Close modal">&times;</button>
      </div>
      <div class="booking-modal-body">
        <form id="modalBookingForm" novalidate>
          <div class="grid-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label for="mbName" class="form-label">Full Name *</label>
              <input type="text" id="mbName" class="form-control" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
              <label for="mbPhone" class="form-label">Phone Number *</label>
              <input type="tel" id="mbPhone" class="form-control" placeholder="98XXXXXXXX / +977" required>
            </div>
          </div>

          <div class="form-group">
            <label for="mbEmail" class="form-label">Email Address *</label>
            <input type="email" id="mbEmail" class="form-control" placeholder="name@example.com" required>
          </div>

          <div class="form-group">
            <label for="mbTreatment" class="form-label">Select Treatment (22 Procedures) *</label>
            <select id="mbTreatment" class="form-control" required>
              <option value="">-- Choose Dental Treatment --</option>
              <optgroup label="🦷 General &amp; Endodontics">
                <option value="teeth-cleaning">Teeth Cleaning (Ultrasonic Scaling)</option>
                <option value="scaling-and-polishing">Scaling &amp; Polishing (Deep Care)</option>
                <option value="dental-checkup">Dental Checkup &amp; X-Rays</option>
                <option value="dental-fillings">Composite Tooth Filling</option>
                <option value="gic-filling">GIC Fluoride Filling</option>
                <option value="root-canal-treatment">Root Canal (RCT)</option>
                <option value="molar-single-sitting-rct">Single-Sitting Molar RCT</option>
              </optgroup>
              <optgroup label="💎 Cosmetic &amp; Orthodontics">
                <option value="teeth-whitening">Laser Teeth Whitening</option>
                <option value="dental-veneers">Porcelain E.max Veneers</option>
                <option value="smile-makeover">Complete 3D Smile Makeover</option>
                <option value="cosmetic-dentistry">Cosmetic Dentistry</option>
                <option value="clear-aligners">Clear Aligners (Invisible)</option>
                <option value="braces">Orthodontic Braces</option>
                <option value="gap-closure">Teeth Gap Closure</option>
              </optgroup>
              <optgroup label="👑 Restorative &amp; Implants">
                <option value="dental-crowns">Zirconia Crowns</option>
                <option value="pfm-metal-crowns">PFM &amp; Metal Crowns</option>
                <option value="dental-bridges">Fixed Dental Bridges</option>
                <option value="dentures">Complete &amp; Partial Dentures</option>
                <option value="dental-implants">Dental Implants (Titanium)</option>
                <option value="bone-grafting-sinus-lift">Bone Graft &amp; Sinus Lift</option>
                <option value="wisdom-tooth-extraction">Wisdom Tooth Surgery</option>
                <option value="tooth-extraction">Simple Tooth Extraction</option>
              </optgroup>
            </select>
          </div>

          <div class="grid-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label for="mbDate" class="form-label">Preferred Date *</label>
              <input type="date" id="mbDate" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="mbTime" class="form-label">Time Slot *</label>
              <select id="mbTime" class="form-control" required>
                <option value="10:00 AM">Morning (10:00 AM - 12:30 PM)</option>
                <option value="02:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                <option value="05:00 PM">Evening (04:30 PM - 06:30 PM)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="mbMsg" class="form-label">Symptoms / Notes (Optional)</label>
            <textarea id="mbMsg" class="form-control" placeholder="Describe symptoms or treatment goals" style="min-height: 80px;"></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" id="modalBookingSubmitBtn">Confirm Appointment Request</button>
        </form>
      </div>
    </div>
  `;
  return modal;
}

function setupModalEvents(modal) {
  // Close button
  const closeBtn = modal.querySelector('#closeBookingModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBookingModal);
  }

  // Backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  // Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeBookingModal();
    }
  });

  // Form Submit & Validation
  const form = modal.querySelector('#modalBookingForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        const nameVal = modal.querySelector('#mbName') ? modal.querySelector('#mbName').value : 'Patient';
        alert(`Thank you, ${nameVal}! Your appointment request has been logged. Our Putalisadak front desk will call you within 15 minutes to confirm.`);
        closeBookingModal();
      }
    });
  }
}
