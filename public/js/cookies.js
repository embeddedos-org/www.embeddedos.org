/**
 * EmbeddedOS — Cookie Consent Banner
 * GDPR-compliant consent with localStorage persistence
 */
(function () {
  'use strict';

  var CONSENT_KEY = 'eos_cookie_consent';

  if (localStorage.getItem(CONSENT_KEY)) return;

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.insertAdjacentHTML('afterbegin', '<div class="cookie-banner__inner">' +
      '<div class="cookie-banner__text">' +
        '🍪 We use cookies to improve your experience and analyze site traffic. ' +
        'By continuing to use this site, you agree to our ' +
        '<a href="privacy.html#cookies">Cookie Policy</a>.' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn-decline" id="cookie-decline">Decline</button>' +
        '<button class="btn btn-accept" id="cookie-accept">Accept All</button>' +
      '</div>' +
    '</div>');

  document.body.appendChild(banner);

  setTimeout(function () {
    banner.classList.add('visible');
  }, 1000);

  document.getElementById('cookie-accept').addEventListener('click', function () {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.classList.remove('visible');
    setTimeout(function () { banner.remove(); }, 400);
  });

  document.getElementById('cookie-decline').addEventListener('click', function () {
    localStorage.setItem(CONSENT_KEY, 'declined');
    banner.classList.remove('visible');
    setTimeout(function () { banner.remove(); }, 400);
  });
})();
