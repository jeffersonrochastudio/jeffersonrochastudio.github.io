
const projects = window.PORTFOLIO_PROJECTS || [];
const categories = window.PORTFOLIO_CATEGORIES || [];
const rowsWrap = document.querySelector('#portfolioRows');
const filtersWrap = document.querySelector('#filters');
let currentProjectIndex = 0;
let currentGalleryIndex = 0;
let currentCategoryIndexes = [];

function el(tag, cls, html='') { const e=document.createElement(tag); if(cls) e.className=cls; e.innerHTML=html; return e; }
function renderFilters(){
  filtersWrap.innerHTML = '<button class="active" data-filter="Todos">Todos</button>' + categories.map(c=>`<button data-filter="${c}">${c}</button>`).join('');
  filtersWrap.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>filterCategory(btn.dataset.filter, btn)));
}
function renderRows(){
  rowsWrap.innerHTML='';
  categories.forEach(cat=>{
    const group=projects.map((p,i)=>({...p,index:i})).filter(p=>p.category===cat);
    if(!group.length) return;
    const row=el('section','portfolio-row'); row.dataset.category=cat;
    row.innerHTML=`<div class="row-heading"><div><p>Categoria</p><h3>${cat}</h3></div><div class="row-buttons"><button class="prev">‹</button><button class="next">›</button></div></div><div class="project-slider"></div>`;
    const slider=row.querySelector('.project-slider');
    group.forEach(p=>{
      const card=el('article','case-card'); card.dataset.index=p.index;
      card.innerHTML=`<button class="case-open"><img class="case-cover" src="${p.thumb}" alt="${p.title}" loading="lazy"><div class="case-body"><div class="case-meta"><span>${p.category}</span><span>${p.kind}</span></div><h3>${p.title}</h3><p>${p.description}</p><div class="case-action">Abrir case →</div></div></button>`;
      card.querySelector('button').addEventListener('click',()=>openCase(p.index));
      slider.appendChild(card);
    });
    row.querySelector('.prev').addEventListener('click',()=>slider.scrollBy({left:-340,behavior:'smooth'}));
    row.querySelector('.next').addEventListener('click',()=>slider.scrollBy({left:340,behavior:'smooth'}));
    rowsWrap.appendChild(row);
  });
}
function filterCategory(cat, btn){
  document.querySelectorAll('#filters button').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.portfolio-row').forEach(row=>{ row.classList.toggle('hidden', cat!=='Todos' && row.dataset.category!==cat); });
}
const modal=document.querySelector('#caseModal'), modalTitle=document.querySelector('#modalTitle'), modalCat=document.querySelector('#modalCat'), modalImg=document.querySelector('#modalImg'), modalCounter=document.querySelector('#modalCounter'), detail=document.querySelector('#caseDetail');
function openCase(index){
  currentProjectIndex=index; currentGalleryIndex=0;
  const p=projects[index]; currentCategoryIndexes=projects.map((x,i)=>x.category===p.category?i:null).filter(x=>x!==null);
  renderCase(); modal.classList.add('active'); document.body.style.overflow='hidden';
}
function renderCase(){
  const p=projects[currentProjectIndex]; const gallery=p.gallery && p.gallery.length ? p.gallery : [p.thumb];
  currentGalleryIndex=(currentGalleryIndex+gallery.length)%gallery.length;
  modalTitle.textContent=p.title; modalCat.textContent=`${p.category} • ${p.kind}`;
  modalImg.src=gallery[currentGalleryIndex]; modalImg.alt=p.title; modalCounter.textContent=`${currentGalleryIndex+1} de ${gallery.length}`;
  detail.innerHTML=`<p>${p.description}</p><h3>Ferramentas e foco</h3><div class="tool-list">${(p.tools||[]).map(t=>`<span>${t}</span>`).join('')}</div><h3>Desafio → Solução → Resultado</h3><div class="detail-block"><strong>Desafio</strong><p>${p.challenge}</p></div><div class="detail-block"><strong>Solução</strong><p>${p.solution}</p></div><div class="detail-block"><strong>Resultado</strong><p>${p.result}</p></div><h3>Mais desta categoria</h3><p>Use as setas laterais para navegar entre outros trabalhos de ${p.category}.</p>`;
}
function closeCase(){ modal.classList.remove('active'); document.body.style.overflow=''; }
function galleryMove(step){ currentGalleryIndex+=step; renderCase(); }
function projectMove(step){
  const pos=currentCategoryIndexes.indexOf(currentProjectIndex); const next=(pos+step+currentCategoryIndexes.length)%currentCategoryIndexes.length;
  currentProjectIndex=currentCategoryIndexes[next]; currentGalleryIndex=0; renderCase();
}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeCase));
document.querySelector('#galleryPrev').addEventListener('click',()=>galleryMove(-1));
document.querySelector('#galleryNext').addEventListener('click',()=>galleryMove(1));
document.querySelector('#projectPrev').addEventListener('click',()=>projectMove(-1));
document.querySelector('#projectNext').addEventListener('click',()=>projectMove(1));
modal.addEventListener('click',e=>{ if(e.target===modal) closeCase(); });
document.addEventListener('keydown',e=>{ if(!modal.classList.contains('active')) return; if(e.key==='Escape') closeCase(); if(e.key==='ArrowLeft') galleryMove(-1); if(e.key==='ArrowRight') galleryMove(1); });
const photoModal=document.querySelector('#photoModal');
document.querySelector('#aboutPhotoBtn').addEventListener('click',()=>{photoModal.classList.add('active');document.body.style.overflow='hidden';});
document.querySelector('#photoModal').addEventListener('click',e=>{ if(e.target===photoModal || e.target.matches('[data-photo-close]')){photoModal.classList.remove('active');document.body.style.overflow='';} });
renderFilters(); renderRows();
