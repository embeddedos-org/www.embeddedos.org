/* EmbeddedOS Foundation — forms.js v3.0
   Safe form handling: no innerHTML, proper validation, accessible error messages */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initAllForms();
  initDonationAmountSelector();
});

function initAllForms() {
  // Newsletter forms
  document.querySelectorAll('form').forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput) return;
    if (form.dataset.formInit) return;
    form.dataset.formInit = '1';
    
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError(emailInput, 'Please enter a valid email address');
        return;
      }
      clearFieldError(emailInput);
      
      const btn = form.querySelector('button[type="submit"], button');
      const originalText = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }
      
      await new Promise(r => setTimeout(r, 800));
      
      setFormMessage(form, 'Thank you for subscribing! Check your inbox.', 'success');
      emailInput.value = '';
      if (btn) { btn.disabled = false; btn.textContent = originalText || 'Subscribe'; }
    });
  });
}

function initDonationAmountSelector() {
  const amountBtns = document.querySelectorAll('[data-amount]');
  const customInput = document.getElementById('customAmount');
  
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput) customInput.value = '';
    });
  });
  
  if (customInput) {
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
    });
  }
}

function setFieldError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  input.classList.add('is-error');
  
  const id = input.id + '-error';
  let errEl = document.getElementById(id);
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.id = id;
    errEl.setAttribute('role', 'alert');
    errEl.style.cssText = 'color:#ef4444;font-size:.8rem;display:block;margin-top:.25rem';
    input.insertAdjacentElement('afterend', errEl);
  }
  errEl.textContent = message;
  input.setAttribute('aria-describedby', id);
  input.focus();
  
  input.addEventListener('input', () => clearFieldError(input), { once: true });
}

function clearFieldError(input) {
  input.removeAttribute('aria-invalid');
  input.classList.remove('is-error');
  const errEl = document.getElementById(input.id + '-error');
  if (errEl) errEl.textContent = '';
}

function setFormMessage(form, message, type) {
  const id = (form.id || 'form') + '-message';
  let msgEl = document.getElementById(id);
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.id = id;
    msgEl.setAttribute('role', 'status');
    msgEl.setAttribute('aria-live', 'polite');
    form.appendChild(msgEl);
  }
  
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  msgEl.style.cssText = `background:${colors[type] || '#3b82f6'}22;border:1px solid ${colors[type] || '#3b82f6'};border-radius:8px;padding:.75rem 1rem;margin-top:1rem;color:${colors[type] || '#3b82f6'};font-weight:600`;
  msgEl.textContent = message;
}
