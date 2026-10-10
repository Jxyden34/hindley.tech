document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('skill-modal');
  const title = document.getElementById('modal-title');
  const description = document.getElementById('modal-desc');
  const related = document.getElementById('skill-related');
  let opener;
  document.querySelectorAll('.skill-button').forEach(button => button.addEventListener('click', () => {
    opener = button;
    title.textContent = button.dataset.name;
    description.textContent = button.dataset.description;
    related.href = button.dataset.related;
    dialog.showModal();
  }));
  document.getElementById('close-modal').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
});
