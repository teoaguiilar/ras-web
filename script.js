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
