/*! Kartik Clarity™ - permanent logo guard. Official local artwork only. */
(function(){
  'use strict';
  var BASE='/Executive-Revenue-Scorecard/assets/';
  var LOGOS={circle:BASE+'logo-circle.jpg',rectangle:BASE+'logo-rectangle.jpg'};
  function force(img,url){
    if(!img)return;
    img.removeAttribute('data-fallback');
    img.onerror=null;
    img.style.visibility='visible';
    img.style.opacity='1';
    img.style.display='block';
    img.style.background='transparent';
    img.src=url;
  }
  function apply(){
    document.querySelectorAll('.brand img,.profile img,.user img').forEach(function(img){force(img,LOGOS.circle);});
    document.querySelectorAll('.hero-brand img,.footer img,.report-toolbar img').forEach(function(img){force(img,LOGOS.rectangle);});
    document.querySelectorAll('link[rel~="icon"]').forEach(function(link){link.href=LOGOS.circle;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  window.addEventListener('load',apply);
})();