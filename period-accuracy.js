(()=>{
'use strict';
/* Executive Revenue Scorecard - lightweight period + navigation controller.
   Performance rule: no continuous timers, no MutationObserver loops, no Web Animations API. */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const DATA={
 q1:{label:'Q1 2026',score:76,rev:'$2.8M',delta:'+11.4%',forecast:'86%',coverage:'2.8×',risk:'$390K',target:'$2.5M',forecastValue:'$3.0M',pipeline:'$7.8M',win:'21%',cycle:'78 days',margin:'69%',grr:'93%',nrr:'104%',insight:'Revenue is above the quarterly plan, but pipeline coverage needs monitoring as the quarter progresses.',risks:[['Late-stage conversion','$245K','High'],['Discount pressure','$88K','Medium'],['Expansion timing','$57K','Medium']]},
 q2:{label:'Q2 2026',score:80,rev:'$5.9M',delta:'+15.1%',forecast:'89%',coverage:'3.1×',risk:'$470K',target:'$5.1M',forecastValue:'$6.4M',pipeline:'$18.3M',win:'23%',cycle:'75 days',margin:'71%',grr:'94%',nrr:'106%',insight:'Momentum improved; the main swing factor is late-stage conversion quality.',risks:[['Late-stage conversion','$305K','High'],['Discount pressure','$101K','Medium'],['Expansion timing','$64K','Medium']]},
 q3:{label:'Q3 2026',score:84,rev:'$9.2M',delta:'+17.8%',forecast:'92%',coverage:'3.3×',risk:'$540K',target:'$7.8M',forecastValue:'$10.0M',pipeline:'$30.4M',win:'24%',cycle:'73 days',margin:'72%',grr:'94%',nrr:'107%',insight:'Revenue is tracking strongly. Protect forecast quality as deal timing compresses.',risks:[['Late-stage conversion','$355K','High'],['Discount pressure','$112K','Medium'],['Expansion timing','$73K','Medium']]},
 fy:{label:'FY 2026',score:82,rev:'$12.4M',delta:'+18.6%',forecast:'91%',coverage:'3.4×',risk:'$620K',target:'$10.5M',forecastValue:'$13.1M',pipeline:'$42M',win:'24%',cycle:'72 days',margin:'72%',grr:'94%',nrr:'108%',insight:'Revenue is tracking above plan; forecast risk is concentrated in late-stage conversion.',risks:[['Late-stage conversion','$410K','High'],['Discount pressure','$128K','Medium'],['Expansion timing','$82K','Medium']]}
};
const setText=(el,v)=>{if(el&&el.textContent!==String(v))el.textContent=v};
const keyFromLabel=t=>{t=(t||'').toLowerCase();if(/q1/.test(t))return'q1';if(/q2/.test(t))return'q2';if(/q3/.test(t))return'q3';return'fy'};
function updateStaticPeriodLabels(d){$$('[data-period-label]').forEach(el=>setText(el,d.label));$$('[data-period-value]').forEach(el=>{const k=el.getAttribute('data-period-value');if(k&&d[k]!=null)setText(el,d[k])})}
function updateVisuals(d){
 const meter=$('#scoreMeter'),bar=$('#coverageBar');
 if(meter)meter.style.width=`${d.score}%`;
 if(bar)bar.style.width=`${Math.min(100,Math.max(0,parseFloat(d.coverage)*25))}%`;
 /* Keep visuals responsive without expensive per-element animations. */
 $$('.spark').forEach(s=>$$('i',s).forEach((b,i)=>{const ratio=Math.max(.25,Math.min(1,(d.score-55+i*4)/45));b.style.height=`${Math.round(ratio*100)}%`}));
}
function setPeriod(k,announce){
 k=DATA[k]?k:'fy';const d=DATA[k];
 try{localStorage.setItem('kc-selected-period',k)}catch{}
 const select=$('#period');if(select&&select.value!==k)select.value=k;
 setText($('#heroKicker'),`EXECUTIVE VIEW · ${d.label}`);const score=$('#score');if(score)score.innerHTML=`${d.score}<span>/100</span>`;
 setText($('#scorePeriod'),d.label);setText($('#revMetric'),d.rev);setText($('#revDelta'),d.delta);setText($('#forecastMetric'),d.forecast);setText($('#coverageMetric'),d.coverage);setText($('#attentionRisk'),`${d.risk} requires an owner and recovery date.`);setText($('#trajectoryInsight'),d.insight);
 const revenue=$('#revenue');if(revenue){const stats=$$('.stats>div',revenue);[d.target,d.forecastValue,d.risk,d.margin].forEach((v,i)=>{if(stats[i])setText(stats[i].querySelector('b'),v)});setText($('#revenueBig'),`${d.rev} ${d.delta} vs target`);const p=revenue.querySelector('.callout');if(p)p.textContent=`${d.label}: revenue is ${d.delta} vs target. Forecast is ${d.forecastValue}, with ${d.risk} currently exposed. Protect late-stage conversion and verify forecast timing.`}
 const pipeline=$('#pipeline');if(pipeline){const stats=$$('.stats>div',pipeline);setText(pipeline.querySelector('.big'),`${d.coverage} qualified coverage`);[d.pipeline,d.win,d.cycle,'3.0×'].forEach((v,i)=>{if(stats[i])setText(stats[i].querySelector('b'),v)});const p=pipeline.querySelector('.callout');if(p)p.textContent=`${d.label}: pipeline coverage is ${d.coverage}, compared with the 3.0× operating threshold. Watch conversion quality and timing.`}
 const retention=$('#retention');if(retention){const stats=$$('.stats>div',retention);setText(retention.querySelector('.big'),`${d.nrr} net revenue retention`);[d.grr,d.nrr,d.risk,d.nrr>='105%'?'Positive':'Watch'].forEach((v,i)=>{if(stats[i])setText(stats[i].querySelector('b'),v)});const p=retention.querySelector('.callout');if(p)p.textContent=`${d.label}: retention is ${d.nrr} NRR and ${d.grr} GRR. Keep attention on the ${d.risk} at-risk revenue pool.`}
 const risks=$('#risks');if(risks){const cards=$$('.riskcard',risks);d.risks.forEach((r,i)=>{const c=cards[i];if(!c)return;setText(c.querySelector('span'),r[2].toUpperCase());setText(c.querySelector('h3'),r[0]);setText(c.querySelector('strong'),r[1]);setText(c.querySelector('p'),r[0]==='Late-stage conversion'?'Timing exposure in late-stage opportunities.':r[0]==='Discount pressure'?'Potential margin erosion.':'Expansion opportunity not yet secured.');c.classList.toggle('high',r[2]==='High')})}
 updateStaticPeriodLabels(d);updateVisuals(d);document.documentElement.dataset.selectedPeriod=k;document.body.dataset.selectedPeriod=k;document.dispatchEvent(new CustomEvent('kc:period-change',{detail:{key:k,data:d}}));
 if(announce&&typeof window.__kcPeriodToast==='function')window.__kcPeriodToast(`Dashboard changed to ${d.label}`);
}
function showView(viewId,button){
 const target=document.getElementById(viewId);if(!target)return false;
 $$('.view').forEach(v=>v.classList.toggle('active',v===target));
 $$('.nav button,[data-view-target]').forEach(b=>b.classList.toggle('active',b===button));
 target.scrollIntoView({block:'start',behavior:'auto'});
 const k=document.documentElement.dataset.selectedPeriod||'fy';setPeriod(k,false);
 return true;
}
function wireNavigation(){
 const buttons=$$('.nav button,[data-view-target]');
 buttons.forEach(btn=>{
  if(btn.dataset.kcNavBound==='1')return;btn.dataset.kcNavBound='1';
  btn.addEventListener('click',e=>{
   const explicit=btn.dataset.viewTarget||btn.getAttribute('data-view')||btn.getAttribute('aria-controls');
   let id=explicit;
   if(!id){const text=(btn.textContent||'').trim().toLowerCase();id=text.includes('pipeline')?'pipeline':text.includes('retention')?'retention':text.includes('risk')?'risks':text.includes('revenue')?'revenue':text.includes('overview')?'overview':null}
   if(id){e.preventDefault();showView(id,btn)}
  },{passive:false});
 });
}
function boot(){
 const select=$('#period');
 if(select){const saved=(()=>{try{return localStorage.getItem('kc-selected-period')}catch{return null}})();const initial=DATA[select.value]?select.value:(DATA[saved]?saved:'fy');select.value=initial;select.addEventListener('change',e=>setPeriod(e.target.value,true));window.__kcSetPeriod=setPeriod;window.__kcPeriodData=DATA;setPeriod(initial,false)}
 wireNavigation();
 /* Rebind safely after any late UI injection, but only a few times and only when idle. */
 if('requestIdleCallback'in window)requestIdleCallback(wireNavigation,{timeout:1200});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();