(()=>{
  const BRAND={
    circle:'assets/logo-circle.jpg',
    rectangle:'assets/logo-rectangle.jpg'
  };
  function applyLogo(img,url){
    if(!img)return;
    img.setAttribute('decoding','sync');
    img.setAttribute('draggable','false');
    img.style.objectFit='contain';
    img.style.objectPosition='center center';
    img.style.display='block';
    img.style.visibility='visible';
    img.style.opacity='1';
    img.onerror=null;
    if(img.getAttribute('src')!==url)img.src=url;
  }
  function fixBrand(){
    document.querySelectorAll('img').forEach(img=>{
      const src=(img.getAttribute('src')||'').toLowerCase();
      const alt=(img.getAttribute('alt')||'').toLowerCase();
      const cls=(img.className||'').toString().toLowerCase();
      const parent=(img.parentElement?.className||'').toString().toLowerCase();
      const signal=src+' '+alt+' '+cls+' '+parent;
      const isCircle=/logo-circle|profile|avatar|account|brand-mark/.test(signal);
      const isRectangle=/logo-rectangle|hero-brand|footer|kartik clarity/.test(signal);
      if(isRectangle)applyLogo(img,BRAND.rectangle);
      else if(isCircle)applyLogo(img,BRAND.circle);
      if(img.closest('.hero-brand')){img.loading='eager';img.style.width='100%';img.style.height='100%';}
    });
    document.querySelectorAll('link[rel~="icon"]').forEach(icon=>{icon.href=BRAND.circle;});
  }
  function installPeriodGuard(){
    const period=document.getElementById('period');
    if(!period||period.dataset.kcGuard)return;
    period.dataset.kcGuard='1';
    period.addEventListener('change',()=>{
      const label=period.options[period.selectedIndex]?.text||period.value;
      document.querySelectorAll('[data-period-label]').forEach(el=>el.textContent=label);
      window.dispatchEvent(new CustomEvent('kc:period-change',{detail:{value:period.value,label}}));
    });
  }
  function boot(){fixBrand();installPeriodGuard();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();