(()=>{
  const SVG={circle:'assets/logo-circle.svg',rectangle:'assets/logo-rectangle.svg'};
  function fixBrand(){
    document.querySelectorAll('img').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(/logo-circle\.(jpg|jpeg|png)$/i.test(src)) img.src=SVG.circle;
      if(/logo-rectangle\.(jpg|jpeg|png)$/i.test(src)) img.src=SVG.rectangle;
      if(/logo-(circle|rectangle)\.svg$/i.test(img.src)){
        img.setAttribute('decoding','async');
        img.setAttribute('draggable','false');
        img.style.objectFit='contain';
        img.style.objectPosition='center center';
      }
    });
    const icon=document.querySelector('link[rel="icon"]');
    if(icon) icon.href=SVG.circle;
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
  function boot(){fixBrand();installPeriodGuard();setTimeout(fixBrand,250);setTimeout(fixBrand,1000);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();