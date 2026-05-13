(function () {
'use strict';
function loadPartials() {
var slots = document.querySelectorAll('[data-include]');
if (!slots.length) {
initInteractivity();
return;
}
var pending = slots.length;
slots.forEach(function (slot) {
var url = slot.getAttribute('data-include');
fetch(url, { credentials: 'same-origin' })
.then(function (r) { return r.ok ? r.text() : ''; })
.then(function (html) {
var tmp = document.createElement('div');
tmp.innerHTML = html;
var frag = document.createDocumentFragment();
while (tmp.firstChild) frag.appendChild(tmp.firstChild);
slot.parentNode.replaceChild(frag, slot);
})
.catch(function () {  })
.finally(function () {
if (--pending === 0) {
document.dispatchEvent(new CustomEvent('partials:loaded'));
initInteractivity();
}
});
});
}
function initInteractivity() {
var menuBtn = document.querySelector('.mobile-menu-btn');
var navLinks = document.getElementById('nav-links');
if (menuBtn && navLinks && !menuBtn._eosBound) {
menuBtn._eosBound = true;
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
var scrollBtn = document.querySelector('.scroll-to-top');
if (scrollBtn && !scrollBtn._eosBound) {
scrollBtn._eosBound = true;
window.addEventListener('scroll', function () {
scrollBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
scrollBtn.addEventListener('click', function () {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}
var revealEls = document.querySelectorAll('.reveal:not(.revealed)');
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
var statNumbers = document.querySelectorAll('.stat-item-large .number');
if (statNumbers.length && 'IntersectionObserver' in window) {
var counted = false;
var statsObs = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting && !counted) {
counted = true;
animateCounters(statNumbers);
statsObs.disconnect();
}
});
}, { threshold: 0.3 });
var statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObs.observe(statsBar);
}
var dropdownParents = document.querySelectorAll('.nav-links > li');
dropdownParents.forEach(function (li) {
if (li._eosDropdownBound) return;
li._eosDropdownBound = true;
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
var currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(function (link) {
if (link.getAttribute('href') === currentPage) link.classList.add('is-active-page');
});
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
if (anchor._eosAnchorBound) return;
anchor._eosAnchorBound = true;
anchor.addEventListener('click', function (e) {
var href = this.getAttribute('href');
if (href === '#' || href === '#main-content') return;
var target = document.querySelector(href);
if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});
});
}
function animateCounters(statNumbers) {
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
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', loadPartials);
} else {
loadPartials();
}
})();
