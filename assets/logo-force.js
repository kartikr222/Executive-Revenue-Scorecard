/* FINAL KARTIK CLARITY BRAND LOCK - direct local artwork, browser-safe and mutation-loop-free. */
(()=>{
  'use strict';
  const base='assets/';
  const mark=base+'kartik-clarity-mark.jpg';
  const wordmark=base+'kartik-clarity-logo.jpg';
  function force(img,src,alt){
    if(!img)return;
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    if(img.getAttribute('src')!==src) img.setAttribute('src',src);
    if(img.getAttribute('alt')!==alt) img.setAttribute('alt',alt);
    img.loading='eager';
    img.decoding='sync';
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
  }
  function apply(){
    document.querySelectorAll('.brand img,.hero-brand img,.footer img').forEach(img=>force(img,wordmark,'Kartik Clarity'));
    document.querySelectorAll('.profile img,.user img').forEach(img=>force(img,mark,'Kartik Clarity'));
    const icon=document.querySelector('link[rel="icon"]');
    if(icon){
      const href=icon.getAttribute('href');
      if(href!==mark) icon.setAttribute('href',mark);
      icon.type='image/jpeg';
    }
  }
  const boot=()=>apply();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
  new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'||(m.type==='attributes'&&(m.attributeName==='src'||m.attributeName==='srcset')))) apply();
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset']});
})();
