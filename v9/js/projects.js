document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.project-card')];
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const count = document.getElementById('project-count');
  const categories = new Set(buttons.map(b => b.dataset.filter));
  function select(filter) {
    if (!categories.has(filter)) filter = 'all';
    buttons.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !match;
      if (match) visible++;
    });
    count.textContent = filter === 'all' ? `Showing all ${visible} projects` : `Showing ${visible} ${filter === 'ai' ? 'AI' : filter} projects`;
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.filter)));
  select(new URLSearchParams(location.search).get('category') || 'all');
});
