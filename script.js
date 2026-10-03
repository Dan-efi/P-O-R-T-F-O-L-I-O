(() => {
  const root = document.documentElement;
  const langButtons = document.querySelectorAll('[data-lang-btn]');
  const localized = document.querySelectorAll('[data-en][data-ru]');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  const copyButton = document.querySelector('.copy-email');
  const toast = document.querySelector('.toast');
  const year = document.querySelector('#year');

  const setLanguage = (lang) => {
    const safeLang = lang === 'ru' ? 'ru' : 'en';
    root.lang = safeLang;
    root.dataset.lang = safeLang;
    localized.forEach((node) => {
      const nextText = node.dataset[safeLang];
      if (typeof nextText === 'string') node.textContent = nextText;
    });
    langButtons.forEach((button) => {
      const active = button.dataset.langBtn === safeLang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('portfolio-language', safeLang); } catch (_) {}
  };

  let initialLanguage = 'en';
  try {
    const saved = localStorage.getItem('portfolio-language');
    if (saved === 'ru' || saved === 'en') initialLanguage = saved;
  } catch (_) {}
  setLanguage(initialLanguage);
  langButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.langBtn)));

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const nextState = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', nextState);
      menuToggle.setAttribute('aria-expanded', String(nextState));
    });
    navLinks.forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
  };

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const email = copyButton.dataset.email || '';
      const lang = root.dataset.lang || 'en';
      if (!email) return;
      try {
        await navigator.clipboard.writeText(email);
        showToast(lang === 'ru' ? 'Почта скопирована' : 'Email copied');
      } catch (_) {
        showToast(lang === 'ru' ? 'Скопируй почту вручную' : 'Copy the email manually');
      }
    });
  }

  if (year) year.textContent = String(new Date().getFullYear());
})();
