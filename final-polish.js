(()=>{
  const BRAND={
    circle:'assets/logo-circle.jpg',
    rectangle:'assets/logo-rectangle.jpg'
  };

  function fixBrand(){
    document.querySelectorAll('img').forEach(img=>{
      const src=(img.getAttribute('src')||'').toLowerCase();
      const alt=(img.getAttribute('alt')||'').toLowerCase();
      const cls=(img.className||'').toString().toLowerCase();
      const parent=(img.parentElement?.className||'').toString().toLowerCase();
      const isCircle=/logo-circle|profile|avatar|account/.test(src+' '+alt+' '+cls+' '+parent);
      const isRectangle=/logo-rectangle|hero-brand|footer/.test(src+' '+alt+' '+cls+' '+parent);

      if(isRectangle) img.src=BRAND.rectangle;
      else if(isCircle) img.src=BRAND.circle;

      img.setAttribute('decoding','async');
      img.setAttribute('draggable','false');
      img.style.objectFit='contain';
      img.style.objectPosition='center center';
      img.style.display='block';

      if(img.closest('.hero-brand')){
        img.loading='eager';
        img.style.width='100%';
        img.style.height='100%';
      }
    });

    const icon=document.querySelector('link[rel="icon"]');
    if(icon) icon.href=BRAND.circle;
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

  function boot(){
    fixBrand();
    installPeriodGuard();
    setTimeout(fixBrand,250);
    setTimeout(fixBrand,1000);
    setTimeout(fixBrand,2500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();