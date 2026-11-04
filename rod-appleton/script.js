/**
 * 10 Church Street, Round Hill, VA 20141
 * Landing Page Interactive Script
 * CENTURY 21 New Millennium | Rod Appleton
 */

(function($) {
  'use strict';

  $(document).ready(function() {

    // --- 1. Fixed Header on Scroll ---
    var $fixedHead = $('.prop-head-fixed');
    var $propertyHead = $('.prop-head');
    var triggerOffset = $propertyHead.length ? ($propertyHead.offset().top + 100) : 300;

    $(window).on('scroll', function() {
      if ($(window).scrollTop() > triggerOffset) {
        $fixedHead.addClass('show');
      } else {
        $fixedHead.removeClass('show');
      }
    });

    // --- 2. Property Photo Carousel Navigation ---
    var $carousel = $('#owl-property');
    var $prevBtn = $('#carouselPrev');
    var $nextBtn = $('#carouselNext');

    if ($prevBtn.length && $nextBtn.length && $carousel.length) {
      $prevBtn.on('click', function(e) {
        e.preventDefault();
        var scrollAmount = $carousel.width() * 0.75;
        $carousel.animate({ scrollLeft: $carousel.scrollLeft() - scrollAmount }, 300);
      });

      $nextBtn.on('click', function(e) {
        e.preventDefault();
        var scrollAmount = $carousel.width() * 0.75;
        $carousel.animate({ scrollLeft: $carousel.scrollLeft() + scrollAmount }, 300);
      });
    }

    // --- 3. Lightbox Gallery Modal ---
    var photoUrls = [];
    $carousel.find('.item a').each(function() {
      var href = $(this).attr('href');
      if (href) {
        photoUrls.push(href.replace('http://', 'https://'));
      }
    });

    var currentLightboxIndex = 0;
    var $lightbox = $('#c21Lightbox');
    var $lightboxImg = $('#c21LightboxImg');
    var $lightboxCounter = $('#c21LightboxCounter');

    window.galleryView = function(e) {
      if (e && e.preventDefault) e.preventDefault();
    };

    $carousel.find('.item a').on('click', function(e) {
      e.preventDefault();
      var href = $(this).attr('href').replace('http://', 'https://');
      currentLightboxIndex = photoUrls.indexOf(href);
      if (currentLightboxIndex === -1) currentLightboxIndex = 0;
      openLightbox(currentLightboxIndex);
    });

    function openLightbox(index) {
      if (!photoUrls.length) return;
      currentLightboxIndex = (index + photoUrls.length) % photoUrls.length;
      $lightboxImg.attr('src', photoUrls[currentLightboxIndex]);
      $lightboxCounter.text('Photo ' + (currentLightboxIndex + 1) + ' of ' + photoUrls.length);
      $lightbox.addClass('active').attr('aria-hidden', 'false');
      $('body').css('overflow', 'hidden');
    }

    function closeLightbox() {
      $lightbox.removeClass('active').attr('aria-hidden', 'true');
      $('body').css('overflow', '');
    }

    $('#c21LightboxClose').on('click', closeLightbox);
    $('#c21LightboxPrev').on('click', function() { openLightbox(currentLightboxIndex - 1); });
    $('#c21LightboxNext').on('click', function() { openLightbox(currentLightboxIndex + 1); });

    $lightbox.on('click', function(e) {
      if (e.target === this) closeLightbox();
    });

    $(document).on('keydown', function(e) {
      if (!$lightbox.hasClass('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
    });

    // --- 4. Interactive Property Map (Leaflet with Google Maps-style Street & Satellite Layers) ---
    function initPropertyMap() {
      var mapEl = document.getElementById('propertyMap');
      if (!mapEl || typeof L === 'undefined') return;

      var lat = 39.13394;
      var lng = -77.77045;

      // CartoDB Voyager layer (clean pastel colors matching Google Maps)
      var streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 20
      });

      // Esri World Imagery (high-resolution aerial satellite view)
      var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
        maxZoom: 19
      });

      var map = L.map('propertyMap', {
        center: [lat, lng],
        zoom: 16,
        layers: [streetLayer],
        scrollWheelZoom: false
      });

      var baseLayers = {
        "Map (Street)": streetLayer,
        "Satellite View": satelliteLayer
      };
      L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

      // Custom house marker
      var houseIcon = L.icon({
        iconUrl: 'https://www.c21nm.com/wp-content/themes/Divi-Child-Theme/images/icon-house-orange.png',
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -38]
      });

      var marker = L.marker([lat, lng], { icon: houseIcon }).addTo(map);

      var popupHtml =
        '<div style="font-family: \'Open Sans\', sans-serif; text-align: center; padding: 6px; min-width: 170px;">' +
          '<strong style="font-size: 13px; color: #111; display: block;">10 CHURCH STREET</strong>' +
          '<span style="font-size: 12px; color: #666; display: block;">Round Hill, VA 20141</span>' +
          '<span style="font-size: 14px; color: #ea8523; font-weight: 700; display: block; margin: 4px 0;">$624,900</span>' +
          '<a href="https://www.google.com/maps/place/10+CHURCH+STREET+ROUND+HILL+VA+20141" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #ea8523; color: #fff; padding: 4px 10px; font-size: 11px; font-weight: 600; text-decoration: none; border-radius: 2px; margin-top: 4px;">Get Directions</a>' +
        '</div>';

      marker.bindPopup(popupHtml).openPopup();
    }

    initPropertyMap();

    // --- 5. Accordion & Collapse Functionality ---
    $('[data-toggle="collapse"]').on('click', function(e) {
      e.preventDefault();
      var targetSelector = $(this).attr('data-target') || $(this).attr('href');
      var $target = $(targetSelector);

      if ($target.length) {
        $target.slideToggle(250, function() {
          $target.toggleClass('in');
          // If a chart is inside this target and has not been rendered, trigger it
          $target.find('canvas').each(function() {
            var chartId = $(this).attr('id');
            renderSchoolChartIfNeeded(chartId);
          });
        });
      }
    });

    // --- 6. School Charts Initialization ---
    var initializedCharts = {};

    function renderSchoolChartIfNeeded(chartId) {
      if (initializedCharts[chartId] || typeof Chart === 'undefined') return;
      var el = document.getElementById(chartId);
      if (!el) return;

      initializedCharts[chartId] = true;

      // Woodgrove High Doughnut
      if (chartId === 'doughnut_510225002812') {
        new Chart(el, {
          type: 'doughnut',
          data: {
            labels: ['Students', 'Teachers'],
            datasets: [{
              label: 'Woodgrove High School',
              data: [13, 1],
              backgroundColor: ['rgb(49,170,226)', 'rgb(147,94,192)']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Woodgrove High Enrollment Bar
      if (chartId === 'chart_510225002812') {
        new Chart(el, {
          type: 'bar',
          data: {
            labels: ['9th', '10th', '11th', '12th'],
            datasets: [{
              label: 'Students',
              data: [412, 395, 380, 375],
              backgroundColor: 'rgb(49,170,226)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
          }
        });
      }

      // Round Hill Elementary Doughnut
      if (chartId === 'doughnut_510225000930') {
        new Chart(el, {
          type: 'doughnut',
          data: {
            labels: ['Students', 'Teachers'],
            datasets: [{
              label: 'Round Hill Elementary',
              data: [15, 1],
              backgroundColor: ['rgb(139,192,94)', 'rgb(147,94,192)']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Round Hill Elementary Enrollment Bar
      if (chartId === 'chart_510225000930') {
        new Chart(el, {
          type: 'bar',
          data: {
            labels: ['Pre-K', 'Kindergarten', '1st', '2nd', '3rd', '4th', '5th'],
            datasets: [{
              label: 'Students',
              data: [18, 54, 94, 64, 82, 98, 111],
              backgroundColor: 'rgb(139,192,94)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
          }
        });
      }
    }

    // Trigger initial charts for open sections
    setTimeout(function() {
      $('canvas').each(function() {
        if ($(this).is(':visible')) {
          renderSchoolChartIfNeeded($(this).attr('id'));
        }
      });
    }, 500);

    // --- 7. Contact Form Handling ---
    var $contactForm = $('form.footer-contact');
    if ($contactForm.length) {
      $contactForm.on('submit', function(e) {
        e.preventDefault();

        var fname = $.trim($('#getFName').val());
        var lname = $.trim($('#getLName').val());
        var email = $.trim($('#getEmail').val());
        var phone = $.trim($('#getPhone').val());

        if (!fname || !email) {
          alert('Please provide at least your First Name and Email address.');
          return;
        }

        var $btn = $contactForm.find('input[type="submit"], button[type="submit"]');
        var originalVal = $btn.val() || $btn.text();

        $btn.prop('disabled', true).val('Sending...');

        setTimeout(function() {
          $contactForm.slideUp(300, function() {
            var $success = $('<div class="contact-success-toast" style="display:block;">' +
              '<strong>Thank you, ' + fname + '!</strong><br>' +
              'Your inquiry for 10 Church Street has been sent to Rod Appleton. ' +
              'Rod will contact you shortly at ' + (phone || email) + '.' +
              '</div>');
            $contactForm.after($success);
          });
        }, 800);
      });
    }

    // --- 8. PDF Download / Print Trigger ---
    $('.download-pdf').on('click', function(e) {
      e.preventDefault();
      var $progress = $('#pdf-progress');
      var $fill = $('#progress-fill');
      var $text = $('#progress-text');

      $progress.fadeIn(200);
      var pct = 0;
      var interval = setInterval(function() {
        pct += 25;
        $fill.css('width', pct + '%');
        $text.text(pct + '%');
        if (pct >= 100) {
          clearInterval(interval);
          setTimeout(function() {
            $progress.fadeOut(200);
            window.print();
          }, 400);
        }
      }, 150);
    });

  });

})(jQuery);
