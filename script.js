/* ============================================================
   main.js — shared site behaviour (nav, motion, diagnostics)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const caseTabs = document.querySelector('.case-tabs');
  if (navToggle && caseTabs) {
    navToggle.addEventListener('click', () => {
      caseTabs.classList.toggle('open');
      const expanded = caseTabs.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
  }

  /* ---- Live status clock ---- */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const tick = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Terminal boot / typing effect (homepage hero) ---- */
  const bootLines = document.querySelectorAll('[data-type-line]');
  if (bootLines.length) {
    let delay = 200;
    bootLines.forEach((el, i) => {
      const full = el.getAttribute('data-type-line');
      el.textContent = '';
      setTimeout(() => {
        let idx = 0;
        const speed = 16;
        const type = setInterval(() => {
          el.textContent = full.slice(0, idx + 1);
          idx++;
          if (idx >= full.length) clearInterval(type);
        }, speed);
      }, delay);
      delay += full.length * 16 + 260;
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- Diagnostic skill meters: animate width when visible ---- */
  const meters = document.querySelectorAll('.meter-fill[data-level]');
  if ('IntersectionObserver' in window && meters.length) {
    const mio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-level') + '%';
          mio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    meters.forEach(el => mio.observe(el));
  } else {
    meters.forEach(el => el.style.width = el.getAttribute('data-level') + '%');
  }

});