const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuToggle && nav) menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

const photoModal = document.getElementById('photoModal');
const modalImg = photoModal?.querySelector('img');
document.querySelectorAll('[data-open-photo]').forEach(btn => {
  btn.addEventListener('click', () => {
    modalImg.src = btn.dataset.openPhoto;
    photoModal.classList.add('open');
    photoModal.setAttribute('aria-hidden', 'false');
  });
});
document.querySelector('#photoModal .modal-close')?.addEventListener('click', closePhotoModal);
photoModal?.addEventListener('click', e => { if (e.target === photoModal) closePhotoModal(); });
function closePhotoModal(){ photoModal.classList.remove('open'); photoModal.setAttribute('aria-hidden','true'); modalImg.src=''; }

// ===== FASE 2: portfólio dinâmico por cases =====
let projects = [];
let activeFilter = 'Todos';
let activeProject = null;
let activeImageIndex = 0;

const grid = document.getElementById('caseGrid');
const filters = document.getElementById('caseFilters');
const caseModal = document.getElementById('caseModal');
const caseModalImage = document.getElementById('caseModalImage');
const caseCounter = document.getElementById('caseCounter');
const caseCategory = document.getElementById('caseCategory');
const caseTitle = document.getElementById('caseTitle');
const caseSummary = document.getElementById('caseSummary');
const caseObjective = document.getElementById('caseObjective');
const caseSolution = document.getElementById('caseSolution');
const caseResults = document.getElementById('caseResults');
const caseTools = document.getElementById('caseTools');

async function initPortfolio(){
  if (!grid || !filters) return;
  grid.innerHTML = '<div class="case-loading">Carregando cases do portfólio...</div>';
  try {
    const response = await fetch('data/projetos.json');
    if (!response.ok) throw new Error('Não foi possível carregar data/projetos.json');
    projects = await response.json();
    renderFilters();
    renderProjects();
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<div class="case-error">Não consegui carregar os cases agora. Confira se o arquivo data/projetos.json foi enviado junto com o projeto.</div>';
  }
}

function renderFilters(){
  const categories = ['Todos', ...new Set(projects.map(project => project.category))];
  filters.innerHTML = categories.map(category => `<button class="filter-btn ${category === activeFilter ? 'active' : ''}" data-filter="${category}">${category}</button>`).join('');
  filters.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      renderFilters();
      renderProjects();
    });
  });
}

function renderProjects(){
  const visibleProjects = activeFilter === 'Todos' ? projects : projects.filter(project => project.category === activeFilter);
  grid.innerHTML = visibleProjects.map(project => `
    <article class="case-card has-image">
      <div class="case-cover"><img src="${project.cover}" alt="${project.title}" loading="lazy"></div>
      <div class="case-card-body">
        <div class="case-meta">
          <span class="case-pill">${project.category}</span>
          <span class="case-pill">${project.images.length} prévias</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <button data-open-case="${project.id}">Ver case</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-open-case]').forEach(button => {
    button.addEventListener('click', () => openCase(button.dataset.openCase));
  });
}

function openCase(id){
  activeProject = projects.find(project => project.id === id);
  if (!activeProject) return;
  activeImageIndex = 0;
  caseCategory.textContent = `${activeProject.category} • ${activeProject.client} • ${activeProject.year}`;
  caseTitle.textContent = activeProject.title;
  caseSummary.textContent = activeProject.summary;
  caseObjective.textContent = activeProject.objective;
  caseSolution.textContent = activeProject.solution;
  caseResults.textContent = activeProject.results;
  caseTools.innerHTML = activeProject.tools.map(tool => `<span>${tool}</span>`).join('');
  updateCaseImage();
  caseModal.classList.add('open');
  caseModal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function updateCaseImage(){
  if (!activeProject || !activeProject.images.length) return;
  caseModalImage.src = activeProject.images[activeImageIndex];
  caseModalImage.alt = `${activeProject.title} - prévia ${activeImageIndex + 1}`;
  caseCounter.textContent = `${activeImageIndex + 1}/${activeProject.images.length}`;
}

function changeCaseImage(direction){
  if (!activeProject) return;
  const total = activeProject.images.length;
  activeImageIndex = (activeImageIndex + direction + total) % total;
  updateCaseImage();
}

function closeCase(){
  caseModal.classList.remove('open');
  caseModal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  activeProject = null;
}

document.querySelector('.case-modal-close')?.addEventListener('click', closeCase);
document.querySelector('.gallery-nav.prev')?.addEventListener('click', () => changeCaseImage(-1));
document.querySelector('.gallery-nav.next')?.addEventListener('click', () => changeCaseImage(1));
caseModal?.addEventListener('click', event => { if (event.target === caseModal) closeCase(); });

document.addEventListener('keydown', event => {
  if (caseModal?.classList.contains('open')) {
    if (event.key === 'Escape') closeCase();
    if (event.key === 'ArrowLeft') changeCaseImage(-1);
    if (event.key === 'ArrowRight') changeCaseImage(1);
  }
});

initPortfolio();


// ===== FASE 3: animações, navegação ativa e melhoria de conversão =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-on-scroll, .service-card, .case-card, .process-grid div, .testimonial-card').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(el);
});

const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });
sections.forEach(section => navObserver.observe(section));
