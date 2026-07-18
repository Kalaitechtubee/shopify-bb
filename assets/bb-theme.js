/* =====================================================
   BerrybeansTech Brand Theme JS
   Shopify OS2.0 — bb-theme.js
   Vanilla JS only — no jQuery
   ===================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------
     Accordion
     -------------------------------------------------- */
  function initAccordions(scope) {
    var scope = scope || document;
    scope.querySelectorAll('.bb-accordion__trigger, .bb-accordion-v2__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = this.closest('.bb-accordion__item, .bb-accordion-v2__item');
        var isV2 = item.classList.contains('bb-accordion-v2__item');
        var openClass = isV2 ? 'bb-accordion-v2__item--open' : 'bb-accordion__item--open';
        var isOpen = item.classList.contains(openClass);

        // Optionally close siblings
        var parent = item.closest('.bb-accordion, .bb-accordion-v2');
        if (parent) {
          parent.querySelectorAll('.bb-accordion__item--open, .bb-accordion-v2__item--open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('bb-accordion__item--open');
              openItem.classList.remove('bb-accordion-v2__item--open');
            }
          });
        }

        item.classList.toggle(openClass, !isOpen);
        this.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  /* --------------------------------------------------
     Testimonial Slider
     -------------------------------------------------- */
  function initSliders(scope) {
    var scope = scope || document;
    scope.querySelectorAll('.bb-slider').forEach(function (slider) {
      var track = slider.querySelector('.bb-slider__track');
      var slides = slider.querySelectorAll('.bb-slider__slide');
      var dots = slider.querySelectorAll('.bb-slider__dot');
      var btnPrev = slider.querySelector('.bb-slider__btn--prev');
      var btnNext = slider.querySelector('.bb-slider__btn--next');

      if (!track || slides.length === 0) return;

      var current = 0;
      var total = slides.length;
      var slideWidth = 0;
      var visibleCount = 1;

      function getVisibleCount() {
        var w = slider.offsetWidth;
        if (w >= 1024) return 3;
        if (w >= 640) return 2;
        return 1;
      }

      function getSlideWidth() {
        return slides[0] ? slides[0].offsetWidth + 20 : 0;
      }

      function goTo(index) {
        visibleCount = getVisibleCount();
        slideWidth = getSlideWidth();
        var max = Math.max(0, total - visibleCount);
        current = Math.max(0, Math.min(index, max));
        track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';
        dots.forEach(function (d, i) {
          d.classList.toggle('bb-slider__dot--active', i === current);
        });
      }

      if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); });
      if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); });
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); });
      });

      // Touch/swipe support
      var startX = 0;
      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });

      // Init
      goTo(0);

      // Re-calc on resize
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { goTo(current); }, 150);
      });
    });
  }

  /* --------------------------------------------------
     Product Gallery Thumbnails
     -------------------------------------------------- */
  function initProductGallery(scope) {
    var scope = scope || document;
    scope.querySelectorAll('.bb-product-gallery').forEach(function (gallery) {
      var mainImg = gallery.querySelector('.bb-product-gallery__main img');
      var thumbs = gallery.querySelectorAll('.bb-product-gallery__thumb');
      var prevBtn = gallery.querySelector('.bb-product-gallery__arrow--prev');
      var nextBtn = gallery.querySelector('.bb-product-gallery__arrow--next');
      var activeIndex = 0;

      function updateActiveThumb(index) {
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        if (thumbs[index]) {
          thumbs[index].classList.add('is-active');
          if (mainImg) {
            var src = thumbs[index].dataset.src || thumbs[index].querySelector('img').src;
            mainImg.src = src;
            if (thumbs[index].dataset.srcset) mainImg.srcset = thumbs[index].dataset.srcset;
          }
        }
      }

      thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function () {
          activeIndex = index;
          updateActiveThumb(index);
        });
      });

      if (prevBtn && thumbs.length > 0) {
        prevBtn.addEventListener('click', function () {
          activeIndex = (activeIndex - 1 + thumbs.length) % thumbs.length;
          updateActiveThumb(activeIndex);
        });
      }
      if (nextBtn && thumbs.length > 0) {
        nextBtn.addEventListener('click', function () {
          activeIndex = (activeIndex + 1) % thumbs.length;
          updateActiveThumb(activeIndex);
        });
      }

      // Set first thumb as active
      if (thumbs[0]) thumbs[0].classList.add('is-active');
    });
  }

  /* --------------------------------------------------
     Quantity Buttons
     -------------------------------------------------- */
  function initQuantityButtons(scope) {
    var scope = scope || document;
    scope.querySelectorAll('.bb-quantity').forEach(function (wrap) {
      var input = wrap.querySelector('.bb-quantity__input');
      var btnMinus = wrap.querySelector('.bb-quantity__btn--minus');
      var btnPlus = wrap.querySelector('.bb-quantity__btn--plus');

      if (!input) return;

      if (btnMinus) {
        btnMinus.addEventListener('click', function () {
          var v = parseInt(input.value, 10) || 1;
          if (v > 1) input.value = v - 1;
        });
      }
      if (btnPlus) {
        btnPlus.addEventListener('click', function () {
          var v = parseInt(input.value, 10) || 1;
          input.value = v + 1;
        });
      }
    });
  }

  /* --------------------------------------------------
     Scroll Fade-in Animations
     -------------------------------------------------- */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.bb-fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --------------------------------------------------
     Sticky Product Bar
     -------------------------------------------------- */
  function initStickyBar() {
    var bar = document.querySelector('.bb-sticky-bar');
    if (!bar) return;
    var hero = document.querySelector('.bb-product-hero');
    if (!hero) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        bar.classList.toggle('bb-sticky-bar--visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    observer.observe(hero);
  }

  /* --------------------------------------------------
     Variant Selection (Custom)
     -------------------------------------------------- */
  function initVariantPicker(scope) {
    var scope = scope || document;
    scope.querySelectorAll('.bb-variant-options').forEach(function (wrap) {
      wrap.querySelectorAll('.bb-variant-option').forEach(function (option) {
        option.addEventListener('click', function () {
          wrap.querySelectorAll('.bb-variant-option').forEach(function (o) {
            o.classList.remove('is-selected');
          });
          this.classList.add('is-selected');
        });
      });
    });
  }

  /* --------------------------------------------------
     Init All
     -------------------------------------------------- */
  function init() {
    initAccordions();
    initSliders();
    initProductGallery();
    initQuantityButtons();
    initFadeIn();
    initStickyBar();
    initVariantPicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Theme Editor re-init support
  document.addEventListener('shopify:section:load', function (e) {
    var section = e.target;
    initAccordions(section);
    initSliders(section);
    initProductGallery(section);
    initQuantityButtons(section);
    initVariantPicker(section);
  });

})();
