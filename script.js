const header = document.querySelector('.header');
const heroImg = document.querySelector('.hero__img');
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function onScroll(){
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 24);
  if(heroImg && !reduce && y < innerHeight * 1.1){
    heroImg.style.transform = `scale(1.03) translate3d(0,${y * .04}px,0)`;
  }
}
addEventListener('scroll', onScroll, {passive:true});
onScroll();

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

menu?.addEventListener('click',()=>{
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('is-open');
  menu?.setAttribute('aria-expanded','false');
}));

document.querySelectorAll('.offer-list details').forEach(item=>{
  item.addEventListener('toggle',()=>{
    if(!item.open)return;
    document.querySelectorAll('.offer-list details[open]').forEach(other=>{if(other!==item)other.open=false});
  });
});
