/* ============================================
   SCRIPT — 6015 Turner Shadow Ln Listing
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Gallery images array ---
  const galleryImages = [
    { src: 'images/hero_home.jpg',         alt: '6015 Turner Shadow Ln — Exterior' },
    { src: 'images/interior_living.jpg',   alt: 'Living Room' },
    { src: 'images/interior_kitchen.jpg',  alt: 'Kitchen' },
    { src: 'images/interior_bedroom.jpg',  alt: 'Primary Bedroom' },
    { src: 'images/interior_bathroom.jpg', alt: 'Bathroom' },
  ];

  let currentImageIndex = 0;

  // --- Elements ---
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  // --- Lightbox ---
  function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const img = galleryImages[currentImageIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  // Gallery image clicks
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      const index = parseInt(img.dataset.index, 10);
      openLightbox(index);
    });
  });

  // Show all photos button
  const showAllBtn = document.getElementById('showAllPhotos');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => openLightbox(0));
  }

  // Lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext)  lightboxNext.addEventListener('click', nextImage);

  // Click overlay to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft')  prevImage();
  });


  // --- Read More / Less ---
  const readMoreBtn = document.getElementById('readMoreBtn');
  const descText    = document.getElementById('descriptionText');

  if (readMoreBtn && descText) {
    readMoreBtn.addEventListener('click', () => {
      const isCollapsed = descText.classList.contains('collapsed');
      descText.classList.toggle('collapsed');
      readMoreBtn.innerHTML = isCollapsed
        ? 'Read less <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>'
        : 'Read more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
    });
  }


  // --- Mobile Menu ---
  const mobileMenuBtn  = document.getElementById('mobileMenuBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileOverlay  = document.getElementById('mobileOverlay');
  const mobileDrawer   = document.getElementById('mobileDrawer');

  function openMobileMenu() {
    mobileOverlay.classList.add('active');
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn)  mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay)  mobileOverlay.addEventListener('click', closeMobileMenu);


  // --- In-Page Nav Active State ---
  const inpageLinks = document.querySelectorAll('.inpage-nav a');
  const sections    = [];

  inpageLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;
    let activeLink = null;

    sections.forEach(({ link, section }) => {
      if (section.offsetTop <= scrollPos) {
        activeLink = link;
      }
    });

    inpageLinks.forEach(l => l.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  // --- Smooth scroll for in-page nav ---
  inpageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 130;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // --- Scroll-triggered animations ---
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section, .info-card, .room-card').forEach(el => {
    observer.observe(el);
  });


  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sent!';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    });
  }


  // --- Share button ---
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: '6015 Turner Shadow Ln, Sugar Land, TX 77479',
        text: 'Check out this home: 4 beds, 3.5 baths, 3,980 sqft — $850,000',
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (_) {
          /* user cancelled */
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        const originalHTML = shareBtn.innerHTML;
        shareBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        setTimeout(() => { shareBtn.innerHTML = originalHTML; }, 2000);
      }
    });
  }


  // --- Save / Favorite button ---
  const saveBtn = document.getElementById('saveBtn');
  const favBtn  = document.getElementById('favBtn');
  let isSaved = false;

  function toggleSave() {
    isSaved = !isSaved;
    if (saveBtn) {
      saveBtn.innerHTML = isSaved
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#E8364A" stroke="#E8364A" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Saved'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Save';
    }
  }

  if (saveBtn) saveBtn.addEventListener('click', toggleSave);
  if (favBtn)  favBtn.addEventListener('click', toggleSave);


  // --- Header shadow on scroll ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 12px rgba(0,0,0,.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

});
