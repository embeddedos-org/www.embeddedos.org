/**
 * EmbeddedOS — Main JavaScript Module
 * Foundation-grade interactivity: nav, scroll, animations, counters
 */
(function () {
  'use strict';

  // --- Mobile Menu ---
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.classList.toggle('is-active', isOpen);
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.matches('a') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('is-active');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('is-active');
        menuBtn.focus();
      }
    });
  }

  // --- Scroll-to-Top ---
  var scrollBtn = document.querySelector('.scroll-to-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal (Intersection Observer) ---
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  // --- Animated Stat Counters ---
  var statNumbers = document.querySelectorAll('.stat-item-large .number');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    var counted = false;
    var statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          animateCounters();
          statsObs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    var statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObs.observe(statsBar);
  }

  function animateCounters() {
    statNumbers.forEach(function (el) {
      var text = el.textContent.trim();
      var suffix = text.replace(/[\d.]/g, '');
      var target = parseFloat(text);
      if (isNaN(target)) return;

      var duration = 1500;
      var start = performance.now();
      var isFloat = text.includes('.');

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      el.textContent = '0' + suffix;
      requestAnimationFrame(tick);
    });
  }

  // --- Dropdown Keyboard Accessibility ---
  var dropdownParents = document.querySelectorAll('.nav-links > li');
  dropdownParents.forEach(function (li) {
    var trigger = li.querySelector('a[aria-haspopup]');
    var menu = li.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        trigger.setAttribute('aria-expanded', 'true');
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    });

    menu.addEventListener('keydown', function (e) {
      var items = Array.from(menu.querySelectorAll('a'));
      var idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); }
      else if (e.key === 'Escape') { trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); }
    });

    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Active Nav Highlight ---
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === currentPage) link.classList.add('is-active-page');
  });

  // --- Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();
