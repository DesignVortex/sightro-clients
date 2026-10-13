/**
 * SAMANA Ocean Crest — Landing Page Logic
 * Pure Vanilla JavaScript (No Frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypewriter();
  initUnitLayouts();
  initLightbox();
  initMortgageCalculator();
  initFaqAccordion();
  initLeadForms();
});

/* ==========================================================================
   1. Navigation & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('main-nav-core');
  const toggler = document.getElementById('navbar-toggler');
  const navLinks = document.getElementById('nav-links');

  // Sticky scroll class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggler && navLinks) {
    toggler.addEventListener('click', () => {
      toggler.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        toggler.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    // Mobile dropdown toggle
    const dropdownItems = navLinks.querySelectorAll('.nav-item-dropdown');
    dropdownItems.forEach((item) => {
      const link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 992) {
            e.preventDefault();
            item.classList.toggle('dropdown-open');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. Subtitle Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const phrase = 'A Symphony by the Sea';
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    if (!isDeleting) {
      textElement.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        isDeleting = true;
        delay = 2500; // Pause at full phrase
      } else {
        delay = 100;
      }
    } else {
      textElement.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        delay = 500; // Pause before restarting
      } else {
        delay = 60;
      }
    }
    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   3. Unit Layouts Filter & Tabs
   ========================================================================== */
function initUnitLayouts() {
  const tabButtons = document.querySelectorAll('.unit-tab-btn');
  const unitCards = document.querySelectorAll('.unit-card');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-unit');
      unitCards.forEach((card) => {
        if (filterType === 'all' || card.getAttribute('data-unit') === filterType) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Lightbox Modal (Floorplans & Gallery)
   ========================================================================== */
let lightboxImages = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-main-img');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  if (!lightboxModal) return;

  // Collect all gallery items and floorplan previews
  const triggers = document.querySelectorAll('[data-lightbox-src]');
  triggers.forEach((trigger, idx) => {
    const src = trigger.getAttribute('data-lightbox-src');
    lightboxImages.push(src);

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      currentLightboxIndex = idx;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = lightboxImages[currentLightboxIndex];
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentLightboxIndex];
  }

  function showPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[currentLightboxIndex];
  }

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-box')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   5. Interactive Mortgage Calculator
   ========================================================================== */
function initMortgageCalculator() {
  const priceInput = document.getElementById('propertyPrice');
  const priceIncBtn = document.getElementById('priceIncreaseBtn');
  const priceDecBtn = document.getElementById('priceDecreaseBtn');

  const downPaymentSlider = document.getElementById('downPaymentPercent');
  const downPaymentPercentVal = document.getElementById('downPaymentPercentVal');
  const downPaymentDisplay = document.getElementById('downPaymentDisplay');

  const loanAmountDisplay = document.getElementById('loanAmountDisplay');

  const interestRateInput = document.getElementById('interestRate');
  const rateIncBtn = document.getElementById('rateIncreaseBtn');
  const rateDecBtn = document.getElementById('rateDecreaseBtn');

  const loanTermSlider = document.getElementById('loanTerm');
  const loanTermVal = document.getElementById('loanTermVal');

  const monthlyPaymentDisplay = document.getElementById('monthlyPaymentDisplay');
  const annualPaymentDisplay = document.getElementById('annualPaymentDisplay');
  const totalInterestDisplay = document.getElementById('totalInterestDisplay');
  const totalPaymentDisplay = document.getElementById('totalPaymentDisplay');

  const canvas = document.getElementById('mortgageDonutChart');

  if (!priceInput || !downPaymentSlider || !interestRateInput || !loanTermSlider) return;

  function formatAED(num) {
    return 'AED ' + Math.round(num).toLocaleString('en-US');
  }

  function calculate() {
    const price = parseFloat(priceInput.value) || 2149000;
    const downPercent = parseFloat(downPaymentSlider.value) || 20;
    const rate = parseFloat(interestRateInput.value) || 3.5;
    const termYears = parseInt(loanTermSlider.value) || 25;

    // Calculations
    const downPayment = price * (downPercent / 100);
    const loanAmount = price - downPayment;
    const monthlyRate = (rate / 100) / 12;
    const totalMonths = termYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                       (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPayment = loanAmount / totalMonths;
    }

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    const annualPayment = monthlyPayment * 12;

    // Update Text Elements
    downPaymentPercentVal.textContent = downPercent;
    downPaymentDisplay.textContent = formatAED(downPayment);
    loanAmountDisplay.textContent = formatAED(loanAmount);
    loanTermVal.textContent = termYears;

    monthlyPaymentDisplay.textContent = formatAED(monthlyPayment);
    annualPaymentDisplay.textContent = formatAED(annualPayment);
    totalInterestDisplay.textContent = formatAED(totalInterest);
    totalPaymentDisplay.textContent = formatAED(totalPayment);

    // Draw Live Donut Chart
    drawChart(loanAmount, totalInterest);
  }

  function drawChart(principal, interest) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 12;
    const lineWidth = 24;

    ctx.clearRect(0, 0, width, height);

    const total = principal + interest;
    const principalAngle = (principal / total) * 2 * Math.PI;

    // Background circle
    ctx.lineWidth = lineWidth;

    // Draw Principal Arc (Navy)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, principalAngle);
    ctx.strokeStyle = '#13294B';
    ctx.stroke();

    // Draw Interest Arc (Gold)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, principalAngle, 2 * Math.PI);
    ctx.strokeStyle = '#CFBA82';
    ctx.stroke();

    // Draw Center Text
    ctx.fillStyle = '#13294B';
    ctx.font = '600 16px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const percentPrincipal = Math.round((principal / total) * 100);
    ctx.fillText(`${percentPrincipal}% Loan`, centerX, centerY - 8);

    ctx.font = '400 12px Poppins, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`${100 - percentPrincipal}% Interest`, centerX, centerY + 12);
  }

  // Steppers
  priceIncBtn.addEventListener('click', () => {
    priceInput.value = (parseFloat(priceInput.value) || 0) + 50000;
    calculate();
  });
  priceDecBtn.addEventListener('click', () => {
    const val = (parseFloat(priceInput.value) || 0) - 50000;
    if (val >= 100000) priceInput.value = val;
    calculate();
  });

  rateIncBtn.addEventListener('click', () => {
    const current = parseFloat(interestRateInput.value) || 0;
    interestRateInput.value = (current + 0.1).toFixed(2);
    calculate();
  });
  rateDecBtn.addEventListener('click', () => {
    const current = parseFloat(interestRateInput.value) || 0;
    if (current > 0.1) {
      interestRateInput.value = (current - 0.1).toFixed(2);
      calculate();
    }
  });

  // Inputs
  priceInput.addEventListener('input', calculate);
  downPaymentSlider.addEventListener('input', calculate);
  interestRateInput.addEventListener('input', calculate);
  loanTermSlider.addEventListener('input', calculate);

  // Initial run
  calculate();
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-header-btn');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isCurrentlyActive = btn.classList.contains('active');
      const targetBody = btn.nextElementSibling;

      // Close all others
      faqButtons.forEach((otherBtn) => {
        otherBtn.classList.remove('active');
        otherBtn.nextElementSibling.classList.remove('open');
      });

      // Toggle clicked
      if (!isCurrentlyActive) {
        btn.classList.add('active');
        targetBody.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   7. Universal Lead & Enquiry Modal
   ========================================================================== */
function initLeadForms() {
  const leadModal = document.getElementById('lead-modal');
  const btnCloseModal = document.getElementById('modal-close-btn');
  const modalInterestInput = document.getElementById('modal-source-interest');
  const modalTitle = document.getElementById('modal-title-heading');

  // Trigger buttons with [data-enquire-source]
  const enquireTriggers = document.querySelectorAll('[data-enquire-source]');
  enquireTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const source = btn.getAttribute('data-enquire-source') || 'SAMANA Ocean Crest';
      if (modalInterestInput) modalInterestInput.value = source;
      if (modalTitle) modalTitle.textContent = `Enquire: ${source}`;
      openLeadModal();
    });
  });

  function openLeadModal() {
    if (leadModal) {
      leadModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLeadModal() {
    if (leadModal) {
      leadModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeLeadModal);

  if (leadModal) {
    leadModal.addEventListener('click', (e) => {
      if (e.target === leadModal) closeLeadModal();
    });
  }

  // Handle Modal Form Submission
  const modalForm = document.getElementById('universal-modal-form');
  const modalFeedback = document.getElementById('modal-form-feedback');

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fname = document.getElementById('modal-fname').value.trim();
      const lname = document.getElementById('modal-lname').value.trim();
      const phone = document.getElementById('modal-phone').value.trim();
      const email = document.getElementById('modal-email').value.trim();
      const terms = document.getElementById('modal-terms').checked;

      if (!fname || !lname || !phone || !email) {
        showFeedback(modalFeedback, 'Please fill in all required fields.', 'error');
        return;
      }

      if (!terms) {
        showFeedback(modalFeedback, 'Please agree to the privacy policy.', 'error');
        return;
      }

      // Simulate success
      showFeedback(modalFeedback, 'Thank you! Your enquiry has been received. Downloading brochure...', 'success');
      simulateBrochureDownload();

      setTimeout(() => {
        modalForm.reset();
        closeLeadModal();
        modalFeedback.style.display = 'none';
      }, 4000);
    });
  }

  // Handle Pre-footer Inline Form
  const inlineForm = document.getElementById('prefooter-lead-form');
  const inlineFeedback = document.getElementById('inline-form-feedback');

  if (inlineForm) {
    inlineForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fname = document.getElementById('inline-fname').value.trim();
      const lname = document.getElementById('inline-lname').value.trim();
      const phone = document.getElementById('inline-phone').value.trim();
      const email = document.getElementById('inline-email').value.trim();

      if (!fname || !lname || !phone || !email) {
        showFeedback(inlineFeedback, 'Please fill in all required fields.', 'error');
        return;
      }

      showFeedback(inlineFeedback, 'Thank you for registering! A property specialist will contact you shortly.', 'success');
      simulateBrochureDownload();

      setTimeout(() => {
        inlineForm.reset();
        inlineFeedback.style.display = 'none';
      }, 5000);
    });
  }

  function showFeedback(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = `form-feedback-alert ${type}`;
    el.style.display = 'block';
  }

  function simulateBrochureDownload() {
    // Official SAMANA Ocean Crest brochure download link
    const link = document.createElement('a');
    link.href = 'https://www.samanadevelopers.com/storage/projects-files/2026/06/10/02/35/e85245643da7702ed26ad4031d98e733.pdf';
    link.target = '_blank';
    link.download = 'SAMANA_Ocean_Crest_Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
