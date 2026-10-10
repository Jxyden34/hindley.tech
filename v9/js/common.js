document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const menu = document.querySelector('.nav-menu-button');
  const links = document.querySelector('.nav-links');
  const setMenu = open => {
    links?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-expanded', String(open));
    if (menu) menu.textContent = open ? 'Close' : 'Menu';
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-wrapper')) setMenu(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

  // Reveal effects must never be required to read the content.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = [...document.querySelectorAll('[data-reveal]')];
  if (reduced.matches || !('IntersectionObserver' in window)) {
    reveal.forEach(el => el.classList.add('reveal-visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    }), {threshold: 0.05});
    reveal.forEach(el => observer.observe(el));
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const project = new URLSearchParams(window.location.search).get('project');
    const subject = form.querySelector('[name="subject"]');
    if (project && subject) subject.value = `About ${project.slice(0, 160)}`;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const body = `Hi Jayden,\n\n${data.get('message')}\n\n${data.get('name')}\nReply to: ${data.get('email')}`;
      const url = `mailto:jayden@hindley.tech?subject=${encodeURIComponent(data.get('subject') || 'Portfolio enquiry')}&body=${encodeURIComponent(body)}`;
      const status = document.getElementById('contact-status');
      status.replaceChildren(document.createTextNode('Your draft is ready. '));
      const link = document.createElement('a');
      link.href = url;
      link.className = 'text-link';
      link.textContent = 'Open it in your email app';
      status.appendChild(link);
      window.location.href = url;
    });
  }
});
