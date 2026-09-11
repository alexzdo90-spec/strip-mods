// LEGAL METHODS — script
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  // Mobile nav
  const toggle = $('.menu-toggle');
  const nav = $('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });
  }

  // Current year
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Accordion (FAQ) - keyboard accessible
  $$('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      // Close others if needed? keep multiple open allowed
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      const panel = item.querySelector('.acc-panel');
      if (panel) panel.hidden = isOpen;
    });
  });

  // Sticky dismiss — stored in localStorage, reappears after 24h
  const sticky = $('#sticky-cta');
  const dismiss = $('#sticky-dismiss');
  const STORAGE_KEY = 'stickyDismissedAt';
  if (sticky && dismiss) {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt,10) < 24*60*60*1000) {
      sticky.hidden = true;
      sticky.style.display = 'none';
    }
    // Ensure bottom padding to avoid content being hidden behind sticky
    const setPadding = () => {
      if (sticky.hidden) document.body.style.paddingBottom = '0';
      else document.body.style.paddingBottom = sticky.offsetHeight + 'px';
    };
    setPadding();
    window.addEventListener('resize', setPadding);
    dismiss.addEventListener('click', () => {
      sticky.hidden = true;
      sticky.style.display = 'none';
      document.body.style.paddingBottom = '0';
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    });
    // Add escape key to dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !sticky.hidden) dismiss.click();
    });
  }

  // Smooth scroll for TOC
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          history.pushState(null,'',id);
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
        }
      }
    });
  });

  // Lazy loading fallback - already native, just ensure images have loading attr
})();
