(function () {
  'use strict';

  // ---------- Year in footer ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile nav ----------
  const burger = document.querySelector('.nav__burger');
  const navLinks = document.querySelector('.nav__links');

  if (burger && navLinks) {
    const mqMobile = window.matchMedia('(max-width: 960px)');

    function closeMenu() {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navLinks.querySelectorAll('.nav__item.open').forEach(i => i.classList.remove('open'));
    }

    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) navLinks.querySelectorAll('.nav__item.open').forEach(i => i.classList.remove('open'));
    });

    // Akkordeon: Top-Eintrag mit Untermenü klappt auf Mobile auf statt zu navigieren
    navLinks.querySelectorAll('.nav__item').forEach(item => {
      const top = item.querySelector('.nav__top');
      const drop = item.querySelector('.nav__drop');
      if (!top || !drop) return;
      top.addEventListener('click', (e) => {
        if (mqMobile.matches) {
          e.preventDefault();
          const isOpen = item.classList.toggle('open');
          top.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    });

    // Menü schließen, wenn ein echter Ziel-Link angetippt wird
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mqMobile.matches && link.classList.contains('nav__top')) return; // nur Akkordeon-Toggle
        closeMenu();
      });
    });
  }

  // ---------- Not-implemented toast ----------
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(msg) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  }

  document.querySelectorAll('[data-not-implemented]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const section = el.dataset.notImplemented;
      showToast(`Die Seite "${section}" wird im Redesign separat aufgebaut.`);
    });
  });

  // ---------- YouTube facade (click to load iframe) ----------
  document.querySelectorAll('.video__facade').forEach(facade => {
    facade.addEventListener('click', () => {
      const id = facade.dataset.videoId;
      if (!id) return;

      // file:// origins cannot embed YouTube reliably (Error 153).
      // In that case, open the video on YouTube directly.
      if (location.protocol === 'file:') {
        window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener');
        return;
      }

      const iframe = document.createElement('iframe');
      iframe.className = 'video__iframe';
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = 'X-One Klimagerät — Video';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      facade.replaceWith(iframe);
    });
  });

  // ---------- Contact form (Web3Forms) ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot — if filled, silently drop
      if (form.querySelector('[name="botcheck"]')?.checked) {
        showToast('Anfrage gesendet.');
        return;
      }

      // hCaptcha — require a solved challenge
      const captchaToken = form.querySelector('[name="h-captcha-response"]')?.value;
      if (!captchaToken) {
        showToast('Bitte bestätigen Sie das Captcha, bevor Sie die Anfrage senden.');
        return;
      }

      const submitBtn = form.querySelector('[data-submit]');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          renderFormSuccess(form);
          showToast('Vielen Dank — wir melden uns innert eines Werktages.');
        } else {
          throw new Error(data.message || 'Senden fehlgeschlagen');
        }
      } catch (err) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        if (window.hcaptcha) window.hcaptcha.reset();
        showToast('Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: 041 210 15 00.');
      }
    });
  }

  function renderFormSuccess(formEl) {
    formEl.classList.add('is-sent');
    const success = document.createElement('div');
    success.className = 'form__success';
    success.innerHTML = `
      <div class="form__success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3>Vielen Dank!</h3>
      <p>Ihre Anfrage ist bei uns eingegangen. Wir melden uns innert eines Werktages bei Ihnen.</p>
    `;
    formEl.appendChild(success);
  }

  // ---------- Reveal on scroll ----------
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-title, .ref, .einsatz__item, .steps li, .spec__row, .quote, .preis__amount');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));
  }

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const scrollLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  function setActiveLink() {
    let current = '';
    const scrollY = window.pageYOffset + 100;
    sections.forEach(s => {
      if (scrollY >= s.offsetTop) current = s.id;
    });
    scrollLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }

  let scrollTimer;
  window.addEventListener('scroll', () => {
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      setActiveLink();
      scrollTimer = null;
    }, 100);
  }, { passive: true });
})();
