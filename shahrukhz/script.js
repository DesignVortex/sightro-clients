/**
 * Shahrukhz Residences by Danube — Interactive Functionality
 * Pure Vanilla JavaScript (No libraries or frameworks required)
 */

(function () {
  'use strict';

  var doc = document;
  var body = doc.body;

  // Add JS class to html root
  doc.documentElement.classList.add('js');

  /* ==========================================================================
     Session & Local Storage Helpers
     ========================================================================== */
  function getStorage(kind) {
    try {
      var s = window[kind];
      s.setItem('sr_test', '1');
      s.removeItem('sr_test');
      return s;
    } catch (e) {
      return null;
    }
  }

  var LS = getStorage('localStorage');
  var SS = getStorage('sessionStorage');

  function readJSON(store, key) {
    try {
      return store ? JSON.parse(store.getItem(key) || 'null') : null;
    } catch (e) {
      return null;
    }
  }

  function writeJSON(store, key, val) {
    try {
      if (store) store.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  /* ==========================================================================
     Top Scroll Progress Bar & Sticky Header
     ========================================================================== */
  var bar = doc.querySelector('.bar');
  var prog = doc.querySelector('.progress i');

  function handleScroll() {
    var scrollY = window.scrollY || doc.documentElement.scrollTop || 0;
    
    // Sticky navigation bar blur
    if (bar) {
      bar.classList.toggle('is-stuck', scrollY > 20);
    }

    // Top progress bar calculation
    var vh = window.innerHeight;
    var totalHeight = doc.documentElement.scrollHeight - vh;
    if (prog) {
      var progressRatio = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      prog.style.setProperty('--sp', progressRatio.toFixed(4));
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  handleScroll();

  /* ==========================================================================
     Intersection Observer: Scroll Reveals & Hero Form Tracking
     ========================================================================== */
  var heroForm = doc.getElementById('register');
  var isHeroVisible = true;

  function syncFloatingCTAs() {
    var scrollY = window.scrollY || doc.documentElement.scrollTop || 0;
    var pastThreshold = scrollY > window.innerHeight * 0.55;
    body.classList.toggle('past-hero', !isHeroVisible && pastThreshold);
  }

  window.addEventListener('scroll', syncFloatingCTAs, { passive: true });

  if ('IntersectionObserver' in window) {
    if (heroForm) {
      var heroObserver = new IntersectionObserver(function (entries) {
        isHeroVisible = entries[0].isIntersecting;
        syncFloatingCTAs();
      }, { threshold: 0.1 });
      heroObserver.observe(heroForm);
    }

    // Reveal animations for .rv elements
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var group = target.closest('[data-rvg]');
          if (group) {
            group.querySelectorAll('.rv').forEach(function (child) {
              child.classList.add('is-in');
              revealObserver.unobserve(child);
            });
          } else {
            target.classList.add('is-in');
            revealObserver.unobserve(target);
          }
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    doc.querySelectorAll('.rv').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    body.classList.add('past-hero');
    doc.querySelectorAll('.rv').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  // Head reveal failsafe cleanup
  if (window.__srRv) {
    clearTimeout(window.__srRv);
  }

  /* ==========================================================================
     Pointer Glow Effect on Cards (Desktop Fine Pointers)
     ========================================================================== */
  if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    doc.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.glow');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }, { passive: true });
  }

  /* ==========================================================================
     Launch Reel & Video Controls
     ========================================================================== */
  var films = doc.querySelectorAll('.film');
  films.forEach(function (film) {
    var video = film.querySelector('video');
    var playBtn = film.querySelector('[data-film-play]');
    var soundBtn = film.querySelector('[data-film-sound]');
    if (!video) return;

    function playVideo() {
      if (!video.src && video.getAttribute('data-src')) {
        video.src = video.getAttribute('data-src');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    video.addEventListener('playing', function () {
      film.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      film.classList.remove('is-playing');
    });

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        playVideo();
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        video.muted = !video.muted;
        soundBtn.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
        var label = soundBtn.querySelector('span');
        if (label) {
          label.textContent = video.muted ? 'Sound on' : 'Sound off';
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        var isVisible = entries[0].isIntersecting;
        if (isVisible) {
          playVideo();
        } else if (!video.paused) {
          video.pause();
        }
      }, { threshold: 0.35 });
      videoObserver.observe(film);
    }
  });

  /* ==========================================================================
     Interactive 30/70 Payment Plan Calculator
     ========================================================================== */
  var calcSelect = doc.querySelector('[data-calc]');
  if (calcSelect) {
    function formatAED(num) {
      return 'AED ' + Math.round(num).toLocaleString('en-US');
    }

    function updatePaymentPlan() {
      var basePrice = parseFloat(calcSelect.value) || 1700000;
      doc.querySelectorAll('[data-amt]').forEach(function (item) {
        var percentage = parseFloat(item.getAttribute('data-amt')) || 0;
        var amount = (basePrice * percentage) / 100;
        item.textContent = formatAED(amount);
      });
    }

    calcSelect.addEventListener('change', updatePaymentPlan);
    updatePaymentPlan();
  }

  /* ==========================================================================
     Modal Dialog Manager (Unit-Specific Lead & Brochure Inquiries)
     ========================================================================== */
  var modal = doc.getElementById('sr-modal');
  var modalTitle = doc.querySelector('[data-modal-title]');
  var modalSub = doc.querySelector('[data-modal-sub]');
  var modalForm = doc.getElementById('modal-lead-form');
  var lastActiveElement = null;
  var cachedScrollY = 0;

  var defaultModalTitle = modalTitle ? modalTitle.textContent : 'Get the price list & brochure';
  var defaultModalSub = modalSub ? modalSub.textContent : 'Unit-wise prices, the payment plan and current availability, sent to you by an adviser.';

  function openModal(source, unitName) {
    if (!modal) return;
    lastActiveElement = doc.activeElement;
    cachedScrollY = window.scrollY || doc.documentElement.scrollTop || 0;

    body.style.top = (-cachedScrollY) + 'px';
    body.classList.add('is-locked');
    modal.classList.add('is-open');

    if (modalTitle) {
      modalTitle.textContent = unitName ? unitName : defaultModalTitle;
    }
    if (modalSub) {
      modalSub.textContent = unitName
        ? 'Leave your details and an adviser sends the price, availability and payment schedule for ' + unitName + '.'
        : defaultModalSub;
    }

    // Set hidden inputs
    if (modalForm) {
      var sourceField = modalForm.querySelector('[name="sr_source"]');
      if (sourceField) sourceField.value = source || 'direct';
      var unitField = modalForm.querySelector('[name="sr_unit"]');
      if (unitField) unitField.value = unitName || '';
    }

    // Focus first empty input
    var firstInput = modal.querySelector('input[type="text"], input[type="tel"], input[type="email"]');
    if (firstInput) {
      setTimeout(function () {
        try { firstInput.focus({ preventScroll: true }); } catch (e) { firstInput.focus(); }
      }, 50);
    }
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    body.classList.remove('is-locked');
    body.style.top = '';

    window.scrollTo(0, cachedScrollY);
    if (lastActiveElement && lastActiveElement.focus) {
      lastActiveElement.focus();
    }
  }

  // Click handler for all open/close triggers
  doc.addEventListener('click', function (e) {
    var trigger = e.target.closest('.sr-open');
    if (!trigger) {
      var tableRow = e.target.closest('.ptable tbody tr:not(.ptable__g)');
      if (tableRow) trigger = tableRow.querySelector('.sr-open');
    }

    if (trigger) {
      e.preventDefault();
      var src = trigger.getAttribute('data-src') || 'button';
      var unit = trigger.getAttribute('data-unit') || '';
      openModal(src, unit);
      return;
    }

    if (modal && modal.classList.contains('is-open') && e.target.closest('[data-close]')) {
      e.preventDefault();
      closeModal();
    }
  });

  // Keyboard accessibility: Escape to dismiss & focus trap
  doc.addEventListener('keydown', function (e) {
    if (!modal || !modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      var focusables = modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ==========================================================================
     Form Validation & Submission Handling
     ========================================================================== */
  var DRAFT_KEY = 'sr_draft_lead';
  var savedDraft = readJSON(SS, DRAFT_KEY) || {};

  function restoreDraft(form) {
    if (!form || !savedDraft) return;
    ['name', 'email', 'phone'].forEach(function (field) {
      var input = form.querySelector('[name="' + field + '"]');
      if (input && !input.value && savedDraft[field]) {
        input.value = savedDraft[field];
      }
    });
  }

  doc.querySelectorAll('.sr-form').forEach(restoreDraft);

  // Autosave input changes
  doc.addEventListener('input', function (e) {
    var form = e.target.closest('.sr-form');
    if (!form) return;
    var name = (form.querySelector('[name="name"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var phone = (form.querySelector('[name="phone"]') || {}).value || '';
    writeJSON(SS, DRAFT_KEY, { name: name, email: email, phone: phone });
  });

  function validateForm(form) {
    var nameField = form.querySelector('[name="name"]');
    var emailField = form.querySelector('[name="email"]');
    var phoneField = form.querySelector('[name="phone"]');

    var errBox = form.querySelector('.form__msg--err');
    var okBox = form.querySelector('.form__msg--ok');
    if (errBox) errBox.classList.remove('is-on');
    if (okBox) okBox.classList.remove('is-on');

    function showError(msg, el) {
      if (errBox) {
        errBox.textContent = msg;
        errBox.classList.add('is-on');
      }
      if (el) {
        el.setAttribute('aria-invalid', 'true');
        el.focus();
      }
      return false;
    }

    if (!nameField || !nameField.value.trim()) {
      return showError('Please enter your full name.', nameField);
    }
    nameField.setAttribute('aria-invalid', 'false');

    if (!phoneField || !phoneField.value.trim() || phoneField.value.replace(/[^0-9]/g, '').length < 7) {
      return showError('Please enter a valid phone number with country code.', phoneField);
    }
    phoneField.setAttribute('aria-invalid', 'false');

    if (emailField && emailField.value.trim()) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(emailField.value.trim())) {
        return showError('Please enter a valid email address.', emailField);
      }
      emailField.setAttribute('aria-invalid', 'false');
    }

    return true;
  }

  doc.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.classList.contains('sr-form')) return;
    e.preventDefault();

    if (!validateForm(form)) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending details...';
    }

    // Simulate reliable dispatch
    setTimeout(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      var okBox = form.querySelector('.form__msg--ok');
      var errBox = form.querySelector('.form__msg--err');
      if (errBox) errBox.classList.remove('is-on');

      if (okBox) {
        okBox.textContent = 'Thank you! Your inquiry has been registered. An adviser will call you shortly with the brochure & price list.';
        okBox.classList.add('is-on');
      }

      form.reset();
      try { if (SS) SS.removeItem(DRAFT_KEY); } catch (x) {}

      // If submitted in modal, close modal automatically after brief success notice
      if (form.closest('.modal')) {
        setTimeout(function () {
          closeModal();
          if (okBox) okBox.classList.remove('is-on');
        }, 3200);
      }
    }, 800);
  });

})();
