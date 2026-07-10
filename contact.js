/* ============================================================
   contact.js — secure intake form validation
   Demonstrates: form validation, event handling, DOM updates
   ============================================================ */

(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const fields = {
    name:    { el: document.querySelector('#field-name'),    input: document.querySelector('#input-name') },
    email:   { el: document.querySelector('#field-email'),   input: document.querySelector('#input-email') },
    phone:   { el: document.querySelector('#field-phone'),   input: document.querySelector('#input-phone') },
    message: { el: document.querySelector('#field-message'), input: document.querySelector('#input-message') },
  };
  const status = document.querySelector('#form-status');

  function setError(field, hasError) {
    field.el.classList.toggle('invalid', hasError);
  }

  function validateName() {
    const ok = fields.name.input.value.trim().length > 0;
    setError(fields.name, !ok);
    return ok;
  }

  function validateEmail() {
    const val = fields.email.input.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const ok = val.length > 0 && pattern.test(val);
    setError(fields.email, !ok);
    return ok;
  }

  function validatePhone() {
    const val = fields.phone.input.value.trim();
    const digitsOnly = /^[0-9]+$/;
    const ok = val.length > 0 && digitsOnly.test(val);
    setError(fields.phone, !ok);
    return ok;
  }

  function validateMessage() {
    const ok = fields.message.input.value.trim().length > 0;
    setError(fields.message, !ok);
    return ok;
  }

  // Live validation as the user leaves each field
  fields.name.input.addEventListener('blur', validateName);
  fields.email.input.addEventListener('blur', validateEmail);
  fields.phone.input.addEventListener('blur', validatePhone);
  fields.message.input.addEventListener('blur', validateMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const validName    = validateName();
    const validEmail   = validateEmail();
    const validPhone   = validatePhone();
    const validMessage = validateMessage();

    if (validName && validEmail && validPhone && validMessage) {
      status.textContent = '✓ Transmission received — log entry TX-' + Date.now().toString().slice(-6) + ' created. I will respond within 48 hours.';
      status.classList.add('show');
      form.reset();
      Object.values(fields).forEach(f => setError(f, false));
    } else {
      status.textContent = '✕ Submission blocked — resolve the flagged fields before re-transmitting.';
      status.classList.add('show');
      status.style.color = 'var(--red)';
      status.style.borderColor = 'var(--red-dim)';
      status.style.background = 'rgba(225,84,74,0.06)';
      return;
    }
    status.style.color = '';
    status.style.borderColor = '';
    status.style.background = '';
  });
})();
