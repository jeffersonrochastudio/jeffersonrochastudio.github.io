const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuToggle && nav) menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

const modal = document.getElementById('photoModal');
const modalImg = modal?.querySelector('img');
document.querySelectorAll('[data-open-photo]').forEach(btn => {
  btn.addEventListener('click', () => {
    modalImg.src = btn.dataset.openPhoto;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); modalImg.src=''; }

document.querySelectorAll('[data-case]').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Fase 2: aqui entra o case completo com carrossel, galeria e descrição do projeto.');
  });
});
