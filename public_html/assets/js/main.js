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
 * FAQ Accordion Panels
 */
function initFaqs() {
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const isCurrentlyActive = parent.classList.contains('active');
      
      // Close all other FAQs first
      const allItems = document.querySelectorAll('.faq-item');
      allItems.forEach(item => {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = null;
      });
      
      // Toggle current FAQ
      if (!isCurrentlyActive) {
        parent.classList.add('active');
        const answer = parent.querySelector('.faq-answer');
        if (answer) {
          // Add 24px (padding top + bottom = 0.75rem * 2 at 16px) to ensure padding is not clipped
          answer.style.maxHeight = (answer.scrollHeight + 24) + 'px';
        }
      }
    });
  });
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
    contactForm.addEventListener('submit', (e) => {
      if (!validateForm(contactForm)) {
        e.preventDefault();
      } else {
        alert('Thank you for your message! Our team will get back to you soon.');
      }
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
 * Dynamic Booking Modal Popup Handler
 */
function initBookingModal() {
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
    <div class="booking-modal-content">
      <div class="booking-modal-header">
        <h3>Book an Appointment</h3>
        <button class="booking-modal-close" id="closeBookingModalBtn" aria-label="Close modal">&times;</button>
      </div>
      <div class="booking-modal-body">
        <form id="modalBookingForm" novalidate>
          <div class="form-group">
            <label for="mbName" class="form-label">Full Name</label>
            <input type="text" id="mbName" class="form-control" placeholder="Enter your full name" required>
          </div>
          <div class="form-group">
            <label for="mbPhone" class="form-label">Phone Number</label>
            <input type="tel" id="mbPhone" class="form-control" placeholder="Enter your phone number" required>
          </div>
          <div class="form-group">
            <label for="mbEmail" class="form-label">Email Address</label>
            <input type="email" id="mbEmail" class="form-control" placeholder="Enter your email address" required>
          </div>
          <div class="form-group">
            <label for="mbTreatment" class="form-label">Preferred Treatment</label>
            <select id="mbTreatment" class="form-control" required>
              <option value="">Select Treatment Category</option>
              <option value="checkup">Dental Checkup (Diagnostic)</option>
              <option value="cleaning">Professional Teeth Cleaning</option>
              <option value="fillings">Tooth Composite Filling</option>
              <option value="whitening">Teeth Whitening</option>
              <option value="veneers">Dental Veneers</option>
              <option value="makeover">Smile Makeover</option>
              <option value="crowns">Dental Crowns / Bridges</option>
            </select>
          </div>
          <div class="form-group">
            <label for="mbDoctor" class="form-label">Preferred Doctor (Optional)</label>
            <select id="mbDoctor" class="form-control">
              <option value="">No Preference / First Available</option>
              <option value="sharma">Dr. Manish Sharma (Orthodontist)</option>
              <option value="shakya">Dr. Anjana Shakya (Root Canal Specialist)</option>
              <option value="shrestha">Dr. Rajesh Shrestha (Oral Surgeon)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="mbDate" class="form-label">Preferred Date</label>
            <input type="date" id="mbDate" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="mbTime" class="form-label">Preferred Time Slot</label>
            <select id="mbTime" class="form-control" required>
              <option value="">Select Preferred Time</option>
              <option value="morning">Morning (10:00 AM - 12:30 PM)</option>
              <option value="afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
              <option value="evening">Evening (4:00 PM - 6:30 PM)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="mbMsg" class="form-label">Message / Details (Optional)</label>
            <textarea id="mbMsg" class="form-control" placeholder="Describe any dental problems or symptoms you are experiencing"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;" id="modalBookingSubmitBtn">Book Appointment</button>
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
        alert('Thank you for booking! We will contact you shortly to confirm your appointment.');
        closeBookingModal();
      }
    });
  }
}
