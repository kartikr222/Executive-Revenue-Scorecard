/* FINAL KARTIK CLARITY BRAND LOCK - direct local artwork, independent of SVG/CSS/JS logo systems. */
(()=>{
  'use strict';
  const base='assets/';
  const mark=base+'kartik-clarity-mark.jpg';
  const wordmark=base+'kartik-clarity-logo.jpg';
  function apply(){
    document.querySelectorAll('.brand img,.hero-brand img,.footer img').forEach(img=>{
      img.removeAttribute('srcset');
      img.removeAttribute('src');
      img.src=wordmark;
      img.alt='Kartik Clarity';
    });
    document.querySelectorAll('.profile img,.user img').forEach(img=>{
      img.removeAttribute('srcset');
      img.removeAttribute('src');
      img.src=mark;
      img.alt='Kartik Clarity';
    });
    const icon=document.querySelector('link[rel="icon"]');
    if(icon){icon.href=mark;icon.type='image/jpeg';}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset']});
})();
