/**
 * DAMAC COUTURE BY CAVALLI - INTERACTIVE PRODUCTION CONTROLLER
 * Vanilla JavaScript powering all slider carousels, tabs, accordions, and modals
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. STICKY HEADER SCROLL & DROPDOWNS
     ========================================================================== */
  const headerDesktop = document.getElementById('header-desktop');
  const logoWhite = document.querySelector('#header-desktop .logo-white');
  const logoBlack = document.querySelector('#header-desktop .logo-black');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerDesktop?.classList.add('scrolled');
      headerDesktop?.classList.remove('bg-transparent', 'shadow-none');
    } else {
      headerDesktop?.classList.remove('scrolled');
      headerDesktop?.classList.add('bg-transparent', 'shadow-none');
    }
  });

  // Nav dropdown panels
  const navButtons = document.querySelectorAll('#header-desktop nav button');
  const modalPanels = [
    document.getElementById('modal-panel-desktop-7pNdAvAeiybr77IrUU3pd-0'),
    document.getElementById('modal-panel-desktop-azzKxt2pjdYjusMtON1Qs-1'),
    document.getElementById('modal-panel-desktop-1w3jnSUScCSnQ70uavGKB3-2'),
    document.getElementById('modal-panel-desktop-3KKfiNy1AIfBjFcLjfiTVN-3')
  ];

  function closeAllDropdowns() {
    modalPanels.forEach(p => {
      if (p) {
        p.style.display = 'none';
        p.style.opacity = '0';
      }
    });
  }

  navButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetPanel = modalPanels[index];
      if (targetPanel) {
        const isOpen = targetPanel.style.display === 'block';
        closeAllDropdowns();
        if (!isOpen) {
          targetPanel.style.display = 'block';
          targetPanel.style.opacity = '1';
        }
      }
    });
  });

  document.querySelectorAll('[id^="modal-panel-desktop"] button').forEach(btn => {
    btn.addEventListener('click', closeAllDropdowns);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#header-desktop')) {
      closeAllDropdowns();
    }
  });

  /* ==========================================================================
     2. ENQUIRY MODAL & TOAST
     ========================================================================== */
  const modalEnquiry = document.getElementById('modal-enquiry');

  function openEnquiry() {
    if (modalEnquiry) {
      modalEnquiry.style.display = 'block';
      modalEnquiry.style.opacity = '1';
    }
  }

  function closeEnquiry() {
    if (modalEnquiry) {
      modalEnquiry.style.display = 'none';
      modalEnquiry.style.opacity = '0';
    }
  }

  document.querySelectorAll('.open-enquiry-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openEnquiry();
    });
  });

  document.querySelectorAll('.modal__close, .btn-close-modal').forEach(btn => {
    btn.addEventListener('click', closeEnquiry);
  });

  document.querySelectorAll('.modal-backdrop').forEach(b => {
    b.addEventListener('click', closeEnquiry);
  });

  const enquiryForm = document.querySelector('#modal-enquiry form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeEnquiry();
      showToast('Thank you! Our luxury sales advisor will contact you shortly.');
      enquiryForm.reset();
    });
  }

  /* ==========================================================================
     3. CARD GALLERY SWIPER
     ========================================================================== */
  const cardGallerySwiper = document.querySelector('.cardgallery-swiper .swiper-wrapper');
  const cardGallerySlides = document.querySelectorAll('.cardgallery-swiper .swiper-slide');
  const prevBtn = document.querySelector('.gallery-prev-btn');
  const nextBtn = document.querySelector('.gallery-next-btn');
  let currentGalleryIndex = 0;

  function updateGalleryPosition() {
    if (!cardGallerySwiper || cardGallerySlides.length === 0) return;
    const slideWidth = cardGallerySlides[1] ? cardGallerySlides[1].offsetWidth + 16 : 420;
    const maxIndex = Math.max(0, cardGallerySlides.length - 2);
    currentGalleryIndex = Math.max(0, Math.min(currentGalleryIndex, maxIndex));
    cardGallerySwiper.style.transform = `translateX(-${currentGalleryIndex * slideWidth}px)`;
    
    if (prevBtn) prevBtn.style.opacity = currentGalleryIndex === 0 ? '0.4' : '1';
    if (nextBtn) nextBtn.style.opacity = currentGalleryIndex >= maxIndex ? '0.4' : '1';
  }

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    currentGalleryIndex++;
    updateGalleryPosition();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    currentGalleryIndex = Math.max(0, currentGalleryIndex - 1);
    updateGalleryPosition();
  });

  /* ==========================================================================
     4. A WORLD OF AMENITIES (TAB SWITCHER)
     ========================================================================== */
  const amenityTabButtons = document.querySelectorAll('.amenity-tab-btn');
  const amenityImageSwiper = document.querySelector('.image-gallery-swiper .swiper-wrapper');
  const amenitySlides = document.querySelectorAll('.image-gallery-swiper .swiper-slide');

  amenityTabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      amenityTabButtons.forEach(b => {
        b.classList.remove('active', 'border-black', 'text-black');
        b.classList.add('border-transparent', 'text-gray-40');
        const icon = b.querySelector('.svg-icon');
        if (icon) icon.classList.add('stroke-gray-40');
      });
      btn.classList.add('active', 'border-black', 'text-black');
      btn.classList.remove('border-transparent', 'text-gray-40');
      const activeIcon = btn.querySelector('.svg-icon');
      if (activeIcon) activeIcon.classList.remove('stroke-gray-40');

      if (amenityImageSwiper && amenitySlides.length > index) {
        const slideWidth = amenitySlides[0].offsetWidth;
        amenityImageSwiper.style.transform = `translateX(-${index * slideWidth}px)`;
        amenityImageSwiper.style.transition = 'transform 0.4s ease';
      }
    });
  });

  /* ==========================================================================
     5. CONNECTED TO DUBAI TIMELINE & CAR
     ========================================================================== */
  const timelineStops = document.querySelectorAll('.timeline-stop');
  const timelineCar = document.querySelector('.timeline-car');
  const timelineProgress = document.querySelector('.timeline-progress');

  function updateTimelineStop(pct) {
    if (timelineCar) {
      timelineCar.style.left = `${5 + pct * 0.9}%`;
    }
    if (timelineProgress) {
      timelineProgress.style.width = `${pct * 0.9}%`;
    }
  }

  timelineStops.forEach((stop) => {
    stop.addEventListener('click', () => {
      const pct = parseFloat(stop.getAttribute('data-pct') || '0');
      updateTimelineStop(pct);
      const stopName = stop.querySelector('.font-primary')?.textContent.replace(/\s+/g, ' ') || '';
      showToast(`Selected destination: ${stopName}`);
    });
  });

  // Scroll tracking for car
  const secConnected = document.getElementById('sec-connected');
  if (secConnected) {
    window.addEventListener('scroll', () => {
      const rect = secConnected.getBoundingClientRect();
      const winHeight = window.innerHeight;
      if (rect.top <= winHeight && rect.bottom >= 0) {
        const total = rect.height + winHeight;
        const progress = Math.min(1, Math.max(0, (winHeight - rect.top) / total));
        updateTimelineStop(progress * 100);
      }
    });
  }

  /* ==========================================================================
     6. FAQ ACCORDION
     ========================================================================== */
  const faqButtons = document.querySelectorAll('.faq-accordion-btn');
  faqButtons.forEach((btn) => {
    const answerContainer = btn.parentElement?.querySelector('.faq-answer-container');
    const iconWrapper = btn.querySelector('.faq-icon-wrapper');

    btn.addEventListener('click', () => {
      const isOpen = answerContainer && !answerContainer.classList.contains('hidden');

      // Close all
      document.querySelectorAll('.faq-answer-container').forEach(a => a.classList.add('hidden'));
      document.querySelectorAll('.faq-icon-wrapper').forEach(w => w.classList.remove('rotate-180'));

      if (!isOpen && answerContainer) {
        answerContainer.classList.remove('hidden');
        iconWrapper?.classList.add('rotate-180');
      }
    });
  });

  /* ==========================================================================
     7. FLOATING BOTTOM BAR
     ========================================================================== */
  const floatingBar = document.getElementById('floating-bottom-bar');
  if (floatingBar) {
    floatingBar.classList.add('visible');
  }

  /* ==========================================================================
     8. VIDEO CONTROLS (Hero, Discover, and World Videos)
     ========================================================================== */
  // Hero Video Autoplay Assurance
  const heroVideo = document.querySelector('#sec-hero video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(err => {
      console.log('Hero autoplay prevented, waiting for user interaction:', err);
    });
  }

  // Discover Video Controls
  const playDiscoverBtn = document.querySelector('.btn-play-discover');
  const pauseDiscoverBtn = document.querySelector('.btn-pause-discover');
  const discoverVideo = document.querySelector('#sec-discover video');
  const discoverPoster = document.querySelector('#sec-discover .video-poster');

  if (playDiscoverBtn && discoverVideo) {
    playDiscoverBtn.addEventListener('click', () => {
      discoverPoster?.classList.add('opacity-0', 'pointer-events-none');
      discoverVideo.classList.remove('hidden');
      discoverVideo.play();
      playDiscoverBtn.classList.add('hidden');
      pauseDiscoverBtn?.classList.remove('hidden');
    });
  }
  if (pauseDiscoverBtn && discoverVideo) {
    pauseDiscoverBtn.addEventListener('click', () => {
      if (discoverVideo.paused) {
        discoverVideo.play();
      } else {
        discoverVideo.pause();
      }
    });
  }

  // World Video Controls
  const playWorldBtn = document.querySelector('.btn-play-world');
  const worldVideo = document.querySelector('#sec-world-video video');
  const pauseWorldBtn = document.querySelector('#sec-world-video button:not(.btn-play-world)');

  if (playWorldBtn && worldVideo) {
    playWorldBtn.addEventListener('click', () => {
      worldVideo.play();
      playWorldBtn.classList.add('hidden');
    });
  }
  if (pauseWorldBtn && worldVideo) {
    pauseWorldBtn.addEventListener('click', () => {
      if (worldVideo.paused) {
        worldVideo.play();
        playWorldBtn?.classList.add('hidden');
      } else {
        worldVideo.pause();
        playWorldBtn?.classList.remove('hidden');
      }
    });
  }
  if (worldVideo) {
    worldVideo.addEventListener('play', () => {
      playWorldBtn?.classList.add('hidden');
    });
    worldVideo.addEventListener('pause', () => {
      playWorldBtn?.classList.remove('hidden');
    });
  }

  /* ==========================================================================
     9. SHORTLIST COUNTER
     ========================================================================== */
  let shortlistCount = 0;
  document.querySelectorAll('button[aria-label="Add to favorites"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      shortlistCount++;
      const counterSpan = document.querySelector('#header-desktop [title="Shortlist"] span.font-medium');
      if (counterSpan) {
        counterSpan.textContent = `(${shortlistCount})`;
      }
      btn.classList.add('bg-black', 'text-white');
      btn.querySelector('.svg-icon')?.classList.replace('stroke-black', 'stroke-white');
      showToast('Added to Shortlist');
    });
  });

  /* ==========================================================================
     10. TOAST UTILITY
     ========================================================================== */
  function showToast(msg) {
    let toast = document.getElementById('damacToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'damacToast';
      toast.className = 'damac-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});
