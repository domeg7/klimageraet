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
  // reCaptcha v3 Site-Key (oeffentlich). Im Google reCaptcha Admin als
  // "reCAPTCHA v3" erstellen; den zugehoerigen Secret-Key ins Web3Forms-
  // Dashboard eintragen.
  const RECAPTCHA_SITE_KEY = '6LeTYiYtAAAAAEUQlHfkINCwU-3PA1-sYmG11BGG';

  const form = document.getElementById('contact-form');
  if (form) {
    // reCaptcha v3 Script dynamisch laden, sobald ein Site-Key gesetzt ist.
    if (RECAPTCHA_SITE_KEY && !RECAPTCHA_SITE_KEY.startsWith('YOUR_')) {
      const rc = document.createElement('script');
      rc.src = 'https://www.google.com/recaptcha/api.js?render=' + RECAPTCHA_SITE_KEY;
      rc.async = true;
      rc.defer = true;
      document.head.appendChild(rc);
    }

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

      const submitBtn = form.querySelector('[data-submit]');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      try {
        // reCaptcha v3 — frisches Token direkt vor dem Senden erzeugen
        // (Token sind nur ~2 Min. gueltig) und ins Hidden-Feld schreiben.
        if (typeof grecaptcha !== 'undefined') {
          await new Promise((resolve) => grecaptcha.ready(resolve));
          const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact' });
          form.querySelector('#recaptchaResponse').value = token;
        }

        const formData = new FormData(form);

        // FormData (multipart) statt JSON. Content-Type NICHT setzen, der
        // Browser ergänzt die multipart-boundary automatisch.
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await res.json();

        if (res.ok && data.success) {
          renderFormSuccess(form);
          showToast('Vielen Dank — wir melden uns baldmöglichst.');
        } else {
          throw new Error(data.message || 'Senden fehlgeschlagen');
        }
      } catch (err) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
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
      <p>Ihre Anfrage ist bei uns eingegangen. Wir melden uns baldmöglichst bei Ihnen.</p>
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

  // ---------- Hitze-Overlay (Wetter via Open-Meteo) ----------
  // Zeigt bei aktueller Temperatur über 25 °C ein rotes Overlay mit der
  // Wettervorschau und dem CTA zum Beratungsgespräch. Open-Meteo ist
  // kostenlos und benötigt keinen API-Key. Standort: Luzern.
  (function initHitzeOverlay() {
    const overlay = document.getElementById('hitze-overlay');
    if (!overlay) return;

    const HITZE_SCHWELLE = 30;          // °C — ab hier "es wird heiss"
    const LAT = 47.0502;                 // Luzern
    const LON = 8.3093;
    const STORAGE_KEY = 'hitze-overlay-dismissed';

    // In dieser Sitzung schon weggeklickt? Dann nicht erneut zeigen.
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    } catch (e) { /* sessionStorage evtl. blockiert — ignorieren */ }

    const nowEl = overlay.querySelector('[data-hitze-now]');
    const metaEl = overlay.querySelector('[data-hitze-meta]');
    const forecastEl = overlay.querySelector('[data-hitze-forecast]');

    const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    // Open-Meteo WMO-Wettercode → Emoji (vereinfacht).
    function wetterIcon(code) {
      if (code === 0) return '☀️';
      if (code <= 2) return '🌤️';
      if (code === 3) return '☁️';
      if (code <= 48) return '🌫️';
      if (code <= 67) return '🌧️';
      if (code <= 77) return '🌨️';
      if (code <= 82) return '🌦️';
      if (code <= 86) return '🌨️';
      return '⛈️';
    }

    function dayName(isoDate) {
      const d = new Date(isoDate + 'T00:00');
      return WOCHENTAGE[d.getDay()];
    }

    function openOverlay() {
      overlay.hidden = false;
      // Reflow erzwingen, damit der Transition-Effekt greift
      void overlay.offsetWidth;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore */ }
      setTimeout(() => { overlay.hidden = true; }, 450);
    }

    overlay.querySelectorAll('[data-hitze-close]').forEach(el => {
      el.addEventListener('click', closeOverlay);
    });

    // Klick auf den abgedunkelten Hintergrund schliesst ebenfalls
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay();
    });

    // ESC schliesst
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeOverlay();
    });

    function renderForecast(daily) {
      if (!forecastEl || !daily || !daily.time) return;
      forecastEl.innerHTML = daily.time.slice(0, 3).map((date, i) => {
        const max = Math.round(daily.temperature_2m_max[i]);
        const icon = wetterIcon(daily.weather_code[i]);
        const label = i === 0 ? 'Heute' : dayName(date);
        return `
          <div class="hitze__day">
            <span class="hitze__day-name">${label}</span>
            <span class="hitze__day-icon" aria-hidden="true">${icon}</span>
            <span class="hitze__day-temp">${max}°</span>
          </div>`;
      }).join('');
    }

    const url = 'https://api.open-meteo.com/v1/forecast'
      + `?latitude=${LAT}&longitude=${LON}`
      + '&current=temperature_2m,weather_code'
      + '&daily=temperature_2m_max,weather_code'
      + '&forecast_days=3&timezone=auto';

    fetch(url)
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Wetter-API nicht erreichbar')))
      .then(data => {
        const tempNow = data && data.current && data.current.temperature_2m;
        if (typeof tempNow !== 'number') return;

        // Nur bei Hitze einblenden.
        if (tempNow <= HITZE_SCHWELLE) return;

        if (nowEl) nowEl.textContent = `${Math.round(tempNow)}°C`;
        if (metaEl) metaEl.textContent = 'Aktuelle Temperatur in Luzern';
        renderForecast(data.daily);

        openOverlay();
      })
      .catch(() => { /* still: ohne Wetterdaten kein Overlay */ });
  }());
})();
