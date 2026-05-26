// ============================================================
// RAS — Reactor de Acción Social
// ============================================================

// ----------------------------------------------------------
// Mobile menu (hamburger)
// ----------------------------------------------------------
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  const toggleMenu = () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
  };
  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) toggleMenu();
    })
  );
}

// ----------------------------------------------------------
// Program search (filtrado de compromisos)
// ----------------------------------------------------------
const searchInput = document.querySelector('[data-program-search]');
const programList = document.querySelector('[data-program-list]');
const programEmpty = document.querySelector('[data-program-empty]');

if (searchInput && programList) {
  const items = Array.from(programList.querySelectorAll('[data-program-item]'));

  const filter = () => {
    const q = searchInput.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(it => {
      const text = it.textContent.toLowerCase();
      const match = q === '' || text.includes(q);
      it.hidden = !match;
      if (match) visible++;
    });
    if (programEmpty) programEmpty.hidden = visible !== 0;
  };

  searchInput.addEventListener('input', filter);
}

// ----------------------------------------------------------
// Checkbox visual state
// ----------------------------------------------------------
document.querySelectorAll('.checkbox-item input').forEach(input => {
  input.addEventListener('change', e => {
    e.target.closest('.checkbox-item').classList.toggle('checked', e.target.checked);
  });
});

// ----------------------------------------------------------
// Contact form (success visual, sin backend)
// ----------------------------------------------------------
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

if (form && success) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#f-name').value.trim();
    const email = form.querySelector('#f-email').value.trim();
    if (!name || !email) {
      form.querySelector(!name ? '#f-name' : '#f-email').focus();
      return;
    }
    success.classList.add('show');
    form.reset();
    document.querySelectorAll('.checkbox-item.checked').forEach(c => c.classList.remove('checked'));
    setTimeout(() => success.classList.remove('show'), 6000);
  });
}

// ============================================================
// AÑADIDOS (no modifican lo anterior)
// ============================================================

// ----------------------------------------------------------
// Banner de cookies (localStorage: ras-cookies-accepted)
// ----------------------------------------------------------
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const KEY = 'ras-cookies-accepted';

  // Si ya hay decisión guardada, no mostrar el banner
  if (localStorage.getItem(KEY) === null) {
    banner.classList.remove('hidden');
  }

  const decide = (value) => {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    banner.classList.add('hidden');
  };

  const accept = document.getElementById('cookieAccept');
  const reject = document.getElementById('cookieReject');
  if (accept) accept.addEventListener('click', () => decide('true'));
  if (reject) reject.addEventListener('click', () => decide('false'));
})();

// ----------------------------------------------------------
// Formularios de contacto / afiliación (envío por mailto, sin backend)
// Cada <form data-contact-form data-mailto-to="..." data-mailto-subject="...">
// ----------------------------------------------------------
document.querySelectorAll('form[data-contact-form]').forEach(f => {
  const ok = f.querySelector('[data-form-success]');
  f.addEventListener('submit', e => {
    e.preventDefault();

    // Validación de campos requeridos
    const required = Array.from(f.querySelectorAll('[required]'));
    const missing = required.find(el => !el.value.trim());
    if (missing) { missing.focus(); return; }

    // Construir el cuerpo del correo con los campos rellenos
    const to = f.getAttribute('data-mailto-to') || 'contacto@ras-partido-politico.es';
    const subject = f.getAttribute('data-mailto-subject') || 'Mensaje desde la web de RAS';
    const lines = [];
    f.querySelectorAll('input, textarea, select').forEach(el => {
      if (!el.name || el.type === 'checkbox' && !el.checked) return;
      const label = (el.getAttribute('data-label') || el.name);
      if (el.value.trim()) lines.push(label + ': ' + el.value.trim());
    });
    const body = encodeURIComponent(lines.join('\n'));
    const mailto = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + body;

    // Abrir el cliente de correo del visitante
    window.location.href = mailto;

    // Feedback visual
    if (ok) {
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 8000);
    }
    f.reset();
  });
});

// ----------------------------------------------------------
// Ofuscación de correos (anti-scraping)
// ----------------------------------------------------------
document.querySelectorAll('.email-link').forEach(el => {
  const addr = el.dataset.u + '@' + el.dataset.d;
  el.addEventListener('click', () => {
    window.location = 'mailto:' + addr;
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location = 'mailto:' + addr; }
  });
  el.textContent = el.dataset.u + '@' + el.dataset.d;
});

// ----------------------------------------------------------
// Envío de formularios a Formspree vía fetch (sin redirigir)
// Muestra el modal #modal-ok al terminar.
// ----------------------------------------------------------
document.querySelectorAll('#form-contacto, #form-unete').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    await fetch('https://formspree.io/f/mnjropvv', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    form.reset();
    document.getElementById('modal-ok').style.display = 'flex';
  });
});
