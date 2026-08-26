const topbar = document.querySelector('.topbar');
const hero = document.querySelector('.hero-media');
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function onScroll(){
  const y = scrollY;
  topbar?.classList.toggle('is-scrolled', y > 24);
  if(hero && !reduce && y < innerHeight*1.2){
    hero.style.transform = `scale(1.025) translate3d(0,${y*.035}px,0)`;
  }
  if(!reduce){
    document.querySelectorAll('.garden-break img').forEach(img=>{
      const r = img.parentElement.getBoundingClientRect();
      const d = (innerHeight - r.top) * .035;
      if(r.bottom>0 && r.top<innerHeight) img.style.transform=`scale(1.035) translate3d(0,${d-18}px,0)`;
    });
  }
}
addEventListener('scroll',onScroll,{passive:true});
onScroll();

const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}
  })
},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

menu?.addEventListener('click',()=>{
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');
}));

document.querySelectorAll('.offer-list details').forEach(item=>{
  item.addEventListener('toggle',()=>{
    if(!item.open)return;
    document.querySelectorAll('.offer-list details[open]').forEach(other=>{if(other!==item)other.open=false});
  });
});
