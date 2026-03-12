/* ============================================================
   ASCOTT BLAKE — Demo Website JavaScript
   Features: Scroll reveal, sticky header, mobile nav,
             parallax, counter animations, reduced motion
   ============================================================ */

(function () {
  'use strict';

  // --- Respect Reduced Motion Preferences ---
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Sticky Header ---
  var header = document.getElementById('site-header');
  var lastScroll = 0;

  function handleScroll() {
    var scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Mobile Navigation ---
  var mobileToggle = document.getElementById('mobile-toggle');
  var mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('open');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close nav with Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mobileToggle.classList.remove('open');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
        mobileToggle.focus();
      }
    });
  }

  // --- Scroll Reveal (skip if reduced motion) ---
  function initReveal() {
    if (prefersReducedMotion) {
      // Make everything visible immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var revealSelectors = [
      '.section-problem h2',
      '.section-problem p',
      '.highlight-text',
      '.guide-empathy',
      '.trust-card',
      '.testimonial-card',
      '.step',
      '.service-card',
      '.stake-item',
      '.success-content',
      '.cta-content',
      '.section-label',
      '.section-heading-center'
    ];

    revealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el, index) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          var delayClass = 'reveal-delay-' + Math.min(index + 1, 4);
          el.classList.add(delayClass);
        }
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        if (prefersReducedMotion) {
          window.scrollTo(0, targetPosition);
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- Animated Counter for Trust Signals ---
  function animateCounters() {
    if (prefersReducedMotion) return;

    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // --- Subtle Header Shadow Intensification on Scroll ---
  function handleHeaderShadow() {
    var scrollY = window.scrollY;
    if (header.classList.contains('scrolled')) {
      var intensity = Math.min(scrollY / 400, 1);
      var shadowOpacity = 0.04 + (intensity * 0.08);
      header.style.boxShadow = '0 2px 20px rgba(38, 45, 98, ' + shadowOpacity + ')';
    }
  }

  window.addEventListener('scroll', handleHeaderShadow, { passive: true });

  // --- Init ---
  function init() {
    initReveal();
    animateCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---- Demo Modal ----
  var modal = document.getElementById('demo-modal');
  var modalClose = document.getElementById('demo-modal-close');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // Intercept all CTA buttons (but not modal-internal links)
  document.querySelectorAll('.btn, .cta-primary, .cta-secondary').forEach(function (btn) {
    if (btn.closest('.demo-modal')) return;
    btn.addEventListener('click', openModal);
  });

})();
