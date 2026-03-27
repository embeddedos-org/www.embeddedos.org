/**
 * EmbeddedOS — Main JavaScript Module
 * Handles: navigation, scroll-to-top, scroll animations, dropdown accessibility
 */

(function () {
  'use strict';

  // --- Mobile Menu Toggle ---
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.classList.toggle('is-active', isOpen);
    });

    // Close menu when clicking a link (mobile)
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('a') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('is-active');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('is-active');
        menuBtn.focus();
      }
    });
  }

  // --- Scroll-to-Top Button ---
  const scrollBtn = document.querySelector('.scroll-to-top');

  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --- Dropdown Keyboard Accessibility ---
  const dropdownParents = document.querySelectorAll('.nav-links > li');

  dropdownParents.forEach((li) => {
    const trigger = li.querySelector('a[aria-haspopup]');
    const menu = li.querySelector('.dropdown-menu');

    if (!trigger || !menu) return;

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        trigger.setAttribute('aria-expanded', 'true');
        const firstItem = menu.querySelector('a');
        if (firstItem) firstItem.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      const items = [...menu.querySelectorAll('a')];
      const idx = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = items[idx + 1] || items[0];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = items[idx - 1] || items[items.length - 1];
        prev.focus();
      } else if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    // Close dropdown when focus leaves
    li.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget)) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // --- Active Navigation Highlighting ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-links a');

  navItems.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('is-active-page');
    }
  });
})();
