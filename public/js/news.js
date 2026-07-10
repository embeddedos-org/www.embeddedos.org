(function () {
'use strict';
function initFilter() {
var grid = document.querySelector('[data-news-grid]');
var chips = document.querySelectorAll('[data-topic-chip]');
if (!grid || !chips.length) return;
function applyTopic(topic) {
chips.forEach(function (c) {
var on = (c.getAttribute('data-topic-chip') === topic);
c.setAttribute('aria-pressed', on ? 'true' : 'false');
c.classList.toggle('topic-chip--active', on);
});
var cards = grid.querySelectorAll('[data-topic]');
cards.forEach(function (card) {
var t = card.getAttribute('data-topic');
var show = (topic === 'all' || t === topic);
card.style.display = show ? '' : 'none';
});
if (topic === 'all') {
if (history.replaceState) history.replaceState(null, '', window.location.pathname);
} else {
if (history.replaceState) history.replaceState(null, '', '#topic-' + topic);
}
}
chips.forEach(function (chip) {
chip.addEventListener('click', function (e) {
e.preventDefault();
applyTopic(chip.getAttribute('data-topic-chip'));
});
chip.addEventListener('keydown', function (e) {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
applyTopic(chip.getAttribute('data-topic-chip'));
}
});
});
var initial = 'all';
if (window.location.hash && window.location.hash.indexOf('#topic-') === 0) {
initial = window.location.hash.replace('#topic-', '');
}
applyTopic(initial);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initFilter);
} else {
initFilter();
}
})();
