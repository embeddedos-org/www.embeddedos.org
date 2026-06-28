/**
 * EmbeddedOS — Forms & Payment Integration
 *
 * Contact Form: Web3Forms (free, no backend needed)
 *   - Set key: window.__WEB3FORMS_KEY__ or GitHub variable WEB3FORMS_KEY
 *   - Get key: https://web3forms.com (enter email → copy access key)
 *
 * Donate Page: Stripe Payment Links (no backend needed)
 *   - Set link: window.__STRIPE_DONATE_URL__ or GitHub variable STRIPE_DONATE_URL
 *   - Create link: Stripe Dashboard → Payment Links → New
 *
 * Both are injected at deploy time via GitHub Actions workflow.
 */
(function () {
  'use strict';

  // === DONATE PAGE: Stripe Payment Link ===
  var donateBtn = document.querySelector('.btn-donate-submit');
  if (donateBtn) {
    var stripeUrl = window.__STRIPE_DONATE_URL__ || '';
    var selectedAmount = 250;

    // Donation card selection
    document.querySelectorAll('.donation-card').forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.donation-card').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        var amountText = card.querySelector('.donation-amount');
        if (amountText) {
          selectedAmount = parseInt(amountText.textContent.replace(/\D/g, ''), 10);
          var customInput = document.getElementById('customAmount');
          if (customInput) customInput.value = '';
        }
      });
    });

    // Custom amount input
    var customInput = document.getElementById('customAmount');
    if (customInput) {
      customInput.addEventListener('input', function () {
        if (this.value) {
          selectedAmount = parseInt(this.value, 10);
          document.querySelectorAll('.donation-card').forEach(function (c) { c.classList.remove('selected'); });
        }
      });
    }

    // Donate button click
    donateBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var amount = customInput && customInput.value ? parseInt(customInput.value, 10) : selectedAmount;

      if (!amount || amount < 1) {
        alert('Please select or enter a donation amount.');
        return;
      }

      if (stripeUrl) {
        // Redirect to Stripe Payment Link with prefilled amount
        var separator = stripeUrl.includes('?') ? '&' : '?';
        window.location.href = stripeUrl + separator + 'prefilled_amount=' + (amount * 100);
      } else {
        // Stripe not configured — show mailto fallback
        var frequency = 'one-time';
        var freqRadio = document.querySelector('input[name="frequency"]:checked');
        if (freqRadio) frequency = freqRadio.value;

        var subject = encodeURIComponent('Donation Inquiry — $' + amount + ' (' + frequency + ')');
        var body = encodeURIComponent(
          'Hello EmbeddedOS Foundation,\n\n' +
          'I would like to make a ' + frequency + ' donation of $' + amount + '.\n\n' +
          'Please let me know how to proceed.\n\nThank you.'
        );
        window.location.href = 'mailto:donate@embeddedos.org?subject=' + subject + '&body=' + body;
      }
    });
  }

  // === CONTACT FORM: Web3Forms ===
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var key = window.__WEB3FORMS_KEY__ || '';
    var keyField = document.getElementById('web3forms-key');
    if (key && keyField) keyField.value = key;

    // Prevent double-submit
    var isSubmitting = false;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      // Validate key
      if (!keyField || !keyField.value) {
        showFormMessage('error',
          'Contact form is not yet configured. Please email us directly at ' +
          '<a href="mailto:contact@embeddedos.org">contact@embeddedos.org</a>');
        return;
      }

      // Validate required fields
      var errors = [];
      var requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        clearFieldError(field);
        if (!field.value.trim()) {
          errors.push(field);
          showFieldError(field, 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          errors.push(field);
          showFieldError(field, 'Please enter a valid email');
        }
      });

      if (errors.length > 0) {
        errors[0].focus();
        return;
      }

      // Submit via AJAX
      isSubmitting = true;
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.setAttribute('data-loading', 'true'); submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      var formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            contactForm.style.display = 'none';
            showFormMessage('success',
              '<h3>Message Sent Successfully!</h3>' +
              '<p>Thank you for reaching out. We\'ll respond within 1-2 business days.</p>' +
              '<button type="button" class="btn btn-outline mt-4" onclick="resetContactForm()">Send Another Message</button>'
            );
            contactForm.reset();
          } else {
            showFormMessage('error',
              '<p><strong>Something went wrong.</strong> ' + (data.message || 'Please try again.') + '</p>' +
              '<p>Or email us at <a href="mailto:contact@embeddedos.org">contact@embeddedos.org</a></p>'
            );
          }
        })
        .catch(function () {
          showFormMessage('error',
            '<p><strong>Network error.</strong> Please check your connection and try again.</p>' +
            '<p>Or email us at <a href="mailto:contact@embeddedos.org">contact@embeddedos.org</a></p>'
          );
        })
        .finally(function () {
          isSubmitting = false;
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  // --- Form Helpers ---
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(field, message) {
    field.classList.add('field-error');
    field.style.borderColor = '#ef4444';
    var msg = document.createElement('span');
    msg.className = 'field-error-msg';
    msg.style.cssText = 'color:#ef4444;font-size:0.8rem;display:block;margin-top:4px';
    msg.textContent = message;
    field.parentNode.appendChild(msg);
  }

  function clearFieldError(field) {
    field.classList.remove('field-error');
    field.style.borderColor = '';
    var existing = field.parentNode.querySelector('.field-error-msg');
    if (existing) existing.remove();
  }

  function showFormMessage(type, html) {
    var successEl = document.getElementById('formSuccess');
    var errorEl = document.getElementById('formError');
    if (type === 'success' && successEl) {
      // Use createRange to safely set HTML content
      successEl.textContent = '';
      var frag = document.createRange().createContextualFragment(html);
      successEl.appendChild(frag);
      successEl.style.display = 'block';
      successEl.removeAttribute('hidden');
    } else if (type === 'error' && errorEl) {
      errorEl.textContent = '';
      var frag2 = document.createRange().createContextualFragment(html);
      errorEl.appendChild(frag2);
      errorEl.style.display = 'block';
      errorEl.removeAttribute('hidden');
    }
  }

  // Global reset function for the "Send Another" button
  window.resetContactForm = function () {
    var form = document.getElementById('contactForm');
    var successEl = document.getElementById('formSuccess');
    var errorEl = document.getElementById('formError');
    if (form) {
      form.style.display = 'block';
      form.querySelectorAll('.field-error-msg').forEach(function (el) { el.remove(); });
      form.querySelectorAll('.field-error').forEach(function (el) {
        el.classList.remove('field-error');
        el.style.borderColor = '';
      });
    }
    if (successEl) { successEl.style.display = 'none'; successEl.setAttribute('hidden', ''); }
    if (errorEl) { errorEl.style.display = 'none'; errorEl.setAttribute('hidden', ''); }
  };

  // === NEWSLETTER FORM ===
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector('input[type="email"]');
      var msgEl = document.getElementById('newsletterMsg');
      if (!emailInput || !emailInput.value.trim()) return;
      if (msgEl) {
        msgEl.style.display = 'block';
        emailInput.value = '';
        setTimeout(function () { msgEl.style.display = 'none'; }, 4000);
      }
    });
  }
})();

// ── Donation amount selection (replaces inline onclick) ──
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-amount]');
  if (btn) {
    var amount = btn.getAttribute('data-amount');
    var customInput = document.getElementById('customAmount');
    if (customInput) customInput.value = amount;
    document.querySelectorAll('[data-amount]').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
  }
  // Reset contact form
  if (e.target.closest('[data-action="reset-contact"]')) {
    var form = document.getElementById('contactForm');
    if (form) form.reset();
  }
});
