(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const tools=[
    {group:'Executive Intelligence',name:'Executive Revenue Scorecard™',desc:'Company-wide revenue health, risk, forecast and action report',href:'#',current:true,icon:'◆'},
    {group:'Sales & Pipeline',name:'Sales Call Analyzer™',desc:'Conversation quality, buying signals and revenue risk',href:'https://kartikr222.github.io/Sales-Call-Analyzer/',icon:'◉'},
    {group:'Sales & Pipeline',name:'Pipeline Leak Detector™',desc:'Find where qualified pipeline is leaking before revenue is lost',href:'#',icon:'⌁'},
    {group:'Pricing & Forecast',name:'Pricing Analyzer™',desc:'Pricing leakage, discount pressure and monetization risk',href:'https://kartikr222.github.io/Pricing-Analyzer/',icon:'$'},
    {group:'Pricing & Forecast',name:'Forecast Analyzer™',desc:'Forecast evidence, confidence and predictability audit',href:'#',icon:'◒'},
    {group:'Customer & Retention',name:'Churn / Retention Analyzer™',desc:'Retention exposure, churn risk and revenue at risk',href:'https://kartikr222.github.io/Churn-Analyzer/',icon:'↻'},
    {group:'Offer & Sales Effectiveness',name:'Offer Clarity Scorer™',desc:'Offer strength, sales clarity and conversion friction',href:'#',icon:'◇'}
  ];
  const workspace=$('.workspace');
  if(workspace){
    workspace.classList.add('kc-workspace');
    workspace.innerHTML='<span class="dot"></span><div><strong id="kcWorkspaceName">Executive Workspace</strong><small id="kcWorkspaceSub">Illustrative intelligence</small></div><span class="kc-chevron">⌄</span><div class="kc-workspace-menu" id="kcWorkspaceMenu"><button type="button" data-workspace="Executive Workspace">Executive Workspace</button><button type="button" data-workspace="Custom Company Report">Custom Company Report</button></div>';
    workspace.addEventListener('click',e=>{if(!e.target.closest('.kc-workspace-menu')) workspace.classList.toggle('open'),$('#kcWorkspaceMenu')?.classList.toggle('open');});
    $$('.kc-workspace-menu button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();$('#kcWorkspaceName').textContent=b.dataset.workspace;$('#kcWorkspaceSub').textContent=b.dataset.workspace==='Custom Company Report'?'Live report context':'Illustrative intelligence';workspace.classList.remove('open');$('#kcWorkspaceMenu').classList.remove('open');}));
  }
  const toolsHost=$('.tools');
  const openFinder=()=>{const f=$('#kcFinder');if(!f)return;f.classList.add('open');$('#kcFinderInput').focus();render('');};
  const closeFinder=()=>$('#kcFinder')?.classList.remove('open');
  if(toolsHost){
    const b=document.createElement('button');b.type='button';b.className='kc-finder-trigger';b.innerHTML='<span>Find a tool</span><kbd>⌘K</kbd>';b.setAttribute('aria-label','Find a Kartik Clarity diagnostic tool');b.addEventListener('click',openFinder);toolsHost.insertBefore(b,toolsHost.firstChild);
  }
  const overlay=document.createElement('div');overlay.id='kcFinder';overlay.className='kc-finder';overlay.innerHTML='<div class="kc-finder-dialog" role="dialog" aria-modal="true" aria-labelledby="kcFinderTitle"><div class="kc-finder-head"><input id="kcFinderInput" class="kc-finder-input" autocomplete="off" placeholder="Find a diagnostic, revenue problem, or tool…" aria-label="Find a diagnostic tool"></div><div class="kc-finder-meta"><strong id="kcFinderTitle">Kartik Clarity™ Tool Finder</strong><span>Esc to close · ↑↓ navigate · Enter open</span></div><div class="kc-finder-list" id="kcFinderList"></div></div>';
  document.body.appendChild(overlay);
  function render(q){const query=q.trim().toLowerCase();const list=$('#kcFinderList');list.innerHTML='';let n=0;let group='';tools.filter(t=>!query||[t.name,t.desc,t.group].join(' ').toLowerCase().includes(query)).forEach(t=>{if(t.group!==group){group=t.group;const g=document.createElement('div');g.className='kc-group';g.textContent=group;list.appendChild(g);}const a=document.createElement(t.href==='#'?'button':'a');if(a.tagName==='A')a.href=t.href;else{a.type='button';a.dataset.disabled='true';}a.className='kc-tool';a.setAttribute('aria-current',String(!!t.current));a.innerHTML='<span class="kc-tool-icon">'+t.icon+'</span><span><strong>'+t.name+(t.current?' · Current':'')+'</strong><span>'+t.desc+'</span></span><em>'+ (t.href==='#'?'In suite':'Open ↗')+'</em>';if(t.href==='#'&&!t.current)a.addEventListener('click',()=>{const toast=$('#toast');if(toast){toast.textContent='This diagnostic is part of the Kartik Clarity suite and can be connected here.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400);}});list.appendChild(a);n++;});if(!n){list.innerHTML='<div style="padding:30px;text-align:center;color:#71809a;font:600 12px system-ui">No matching diagnostic. Try “pipeline”, “pricing”, “forecast”, “retention” or “sales”.</div>';}}
  render('');
  $('#kcFinderInput').addEventListener('input',e=>render(e.target.value));
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeFinder();});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openFinder();}if(e.key==='Escape')closeFinder();});
  // Brand integrity: never allow CSS to crop a supplied logo. Prefer the complete SVG assets.
  const logoMap=[['assets/logo-rectangle.jpg','assets/logo-rectangle.svg'],['assets/logo-circle.jpg','assets/logo-circle.svg']];
  $$('img').forEach(img=>{const src=img.getAttribute('src')||'';const match=logoMap.find(([jpg])=>src.endsWith(jpg));if(match){img.src=match[1];img.classList.add('kc-brand-safe');img.removeAttribute('width');img.removeAttribute('height');}});
  // Make report-builder company context immediately visible in the shell after a report is generated/saved.
  window.addEventListener('storage',()=>syncWorkspace());
  function syncWorkspace(){try{const p=JSON.parse(localStorage.getItem('kc-executive-scorecard-profile')||'null');if(!p)return;const name=p.company?.trim();const year=p.year;if(name&&$('#kcWorkspaceName')){$('#kcWorkspaceName').textContent=name;$('#kcWorkspaceSub').textContent=`${p.period||'FY'} ${year||''} · ${p.role||'Executive'}`.trim();}}catch{}}
  syncWorkspace();
})();
