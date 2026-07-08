document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqs();
  initGalleryTabs();
  initFormValidation();
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
          answer.style.maxHeight = answer.scrollHeight + 'px';
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
