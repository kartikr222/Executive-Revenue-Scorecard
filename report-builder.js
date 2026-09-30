(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const money = (v, currency) => { const n = Number(v); if (!Number.isFinite(n)) return 'Not provided'; return new Intl.NumberFormat(undefined,{style:'currency',currency:currency||'USD',maximumFractionDigits:0}).format(n); };
  const pct = (v) => Number.isFinite(Number(v)) ? `${Number(v).toFixed(1)}%` : 'Not provided';
  const num = (v) => Number(v) || 0;
  const clamp = (n,a=0,b=100) => Math.max(a,Math.min(b,n));

  const saved = (() => { try { return JSON.parse(localStorage.getItem('kc-executive-scorecard-profile') || 'null'); } catch { return null; } })();
  const defaults = Object.assign({
    company:'', role:'CEO / Founder', industry:'', year:new Date().getFullYear(), currency:'USD', period:'FY',
    revenue:'', target:'', forecast:'', pipeline:'', winRate:'', grossRetention:'', netRetention:'', atRisk:'', margin:'', salesCycle:'', notes:''
  }, saved || {});

  const trigger = document.createElement('button');
  trigger.className = 'report-builder-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label','Build a custom executive revenue report');
  trigger.innerHTML = '＋ Build Executive Report';
  const tools = $('.tools');
  if (tools) tools.insertBefore(trigger, tools.firstChild);

  const overlay = document.createElement('div');
  overlay.className = 'rb-overlay';
  overlay.innerHTML = `
    <div class="rb-modal" role="dialog" aria-modal="true" aria-labelledby="rbTitle">
      <div class="rb-head"><div><div class="rb-section-title" style="margin:0">KARTIK CLARITY™ · UNIVERSAL SCORECARD</div><h2 id="rbTitle">Build an executive revenue report</h2><p>Use it for any company, any year, and any executive role. Enter what you know; optional fields can remain blank.</p></div><button class="rb-close" type="button" aria-label="Close">×</button></div>
      <form id="rbForm" class="rb-body" novalidate>
        <div class="rb-section"><div class="rb-section-title">Company context</div><div class="rb-grid">
          <div class="rb-field"><label for="rbCompany">Company</label><input id="rbCompany" name="company" required placeholder="Company name"></div>
          <div class="rb-field"><label for="rbIndustry">Industry</label><input id="rbIndustry" name="industry" placeholder="SaaS, services, manufacturing..." ></div>
          <div class="rb-field"><label for="rbYear">Reporting year</label><input id="rbYear" name="year" type="number" min="1900" max="2200" step="1" required></div>
          <div class="rb-field"><label for="rbCurrency">Currency</label><select id="rbCurrency" name="currency"><option>USD</option><option>CAD</option><option>GBP</option><option>EUR</option><option>AED</option><option>INR</option><option>AUD</option><option>SGD</option></select></div>
          <div class="rb-field"><label for="rbPeriod">Reporting scope</label><select id="rbPeriod" name="period"><option value="FY">Full year</option><option value="YTD">Year to date</option><option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option><option value="Q4">Q4</option><option value="Custom">Custom period</option></select></div>
          <div class="rb-field"><label for="rbRole">Executive role</label><select id="rbRole" name="role"><option>CEO / Founder</option><option>CRO</option><option>VP Sales</option><option>VP Revenue</option><option>Chief Revenue Officer</option><option>RevOps Leader</option><option>CFO</option><option>COO</option><option>Board / Investor</option><option>Other Executive</option></select></div>
        </div></div>
        <div class="rb-section"><div class="rb-section-title">Revenue inputs</div><div class="rb-grid">
          <div class="rb-field"><label for="rbRevenue">Revenue achieved</label><input id="rbRevenue" name="revenue" type="number" min="0" step="0.01" placeholder="e.g. 12400000"><span class="rb-help">Use the same currency selected above.</span></div>
          <div class="rb-field"><label for="rbTarget">Revenue target</label><input id="rbTarget" name="target" type="number" min="0" step="0.01" placeholder="e.g. 10500000"></div>
          <div class="rb-field"><label for="rbForecast">Current forecast</label><input id="rbForecast" name="forecast" type="number" min="0" step="0.01" placeholder="e.g. 13100000"></div>
          <div class="rb-field"><label for="rbPipeline">Qualified pipeline</label><input id="rbPipeline" name="pipeline" type="number" min="0" step="0.01" placeholder="e.g. 42000000"></div>
          <div class="rb-field"><label for="rbWinRate">Win rate</label><input id="rbWinRate" name="winRate" type="number" min="0" max="100" step="0.1" placeholder="e.g. 24"></div>
          <div class="rb-field"><label for="rbMargin">Gross margin</label><input id="rbMargin" name="margin" type="number" min="0" max="100" step="0.1" placeholder="e.g. 72"></div>
        </div></div>
        <div class="rb-section"><div class="rb-section-title">Customer & risk inputs</div><div class="rb-grid">
          <div class="rb-field"><label for="rbGRR">Gross revenue retention</label><input id="rbGRR" name="grossRetention" type="number" min="0" max="150" step="0.1" placeholder="e.g. 94"></div>
          <div class="rb-field"><label for="rbNRR">Net revenue retention</label><input id="rbNRR" name="netRetention" type="number" min="0" max="200" step="0.1" placeholder="e.g. 108"></div>
          <div class="rb-field"><label for="rbRisk">At-risk revenue</label><input id="rbRisk" name="atRisk" type="number" min="0" step="0.01" placeholder="e.g. 620000"></div>
          <div class="rb-field"><label for="rbCycle">Sales cycle (days)</label><input id="rbCycle" name="salesCycle" type="number" min="0" step="1" placeholder="e.g. 72"></div>
          <div class="rb-field full"><label for="rbNotes">Known context / management notes</label><input id="rbNotes" name="notes" maxlength="500" placeholder="Optional: major risks, market conditions, concentration, strategic context..."></div>
        </div></div>
        <div class="rb-error" id="rbError"></div>
      </form>
      <div class="rb-actions"><button class="rb-btn" type="button" id="rbCancel">Cancel</button><button class="rb-btn primary" type="button" id="rbGenerate">Generate executive report →</button></div>
    </div>`;
  document.body.appendChild(overlay);

  const report = document.createElement('div');
  report.className = 'rb-report';
  report.id = 'rbReport';
  document.body.appendChild(report);

  const open = () => {
    Object.entries(defaults).forEach(([k,v]) => { const e = $(`[name="${k}"]`, overlay); if (e) e.value = v; });
    overlay.classList.add('open'); setTimeout(() => $('#rbCompany',overlay)?.focus(), 20);
  };
  const close = () => overlay.classList.remove('open');
  trigger.addEventListener('click', open);
  $('.rb-close',overlay).addEventListener('click',close);
  $('#rbCancel',overlay).addEventListener('click',close);
  overlay.addEventListener('click',e=>{ if(e.target===overlay) close(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(overlay.classList.contains('open')) close(); else if(report.classList.contains('open')) report.classList.remove('open'); } });

  const collect = () => {
    const f = new FormData($('#rbForm',overlay));
    return Object.fromEntries(f.entries());
  };
  const calculate = d => {
    const revenue=num(d.revenue), target=num(d.target), forecast=num(d.forecast), pipeline=num(d.pipeline), risk=num(d.atRisk);
    const growthScore = target>0 && revenue>0 ? clamp(50 + ((revenue/target)-1)*250) : null;
    const forecastScore = forecast>0 && revenue>0 ? clamp(100 - Math.abs((forecast-revenue)/revenue)*250) : null;
    const coverage = revenue>0 ? pipeline/revenue : null;
    const coverageScore = coverage!=null ? clamp((coverage/3)*100) : null;
    const retentionScore = d.netRetention ? clamp(Number(d.netRetention)-5) : (d.grossRetention ? clamp(Number(d.grossRetention)+5) : null);
    const riskRatio = revenue>0 && risk>=0 ? risk/revenue : null;
    const riskScore = riskRatio!=null ? clamp(100-riskRatio*250) : null;
    const winScore = d.winRate ? clamp(Number(d.winRate)*3) : null;
    const parts = [growthScore,forecastScore,coverageScore,retentionScore,riskScore,winScore].filter(v=>v!=null && Number.isFinite(v));
    const score = parts.length ? Math.round(parts.reduce((a,b)=>a+b,0)/parts.length) : null;
    return {revenue,target,forecast,pipeline,risk,growthScore,forecastScore,coverage,coverageScore,retentionScore,riskRatio,riskScore,winScore,score,parts:parts.length};
  };
  const verdict = (score) => score==null ? ['Insufficient evidence','Add more operating inputs to produce a stronger decision signal.'] : score>=80 ? ['Strong revenue position','Performance is broadly healthy. Focus management attention on the highest-value exposure rather than broad intervention.'] : score>=70 ? ['Healthy with focused exposure','The revenue system is working, but one or more measurable constraints deserve executive attention.'] : score>=55 ? ['Material exposure detected','The business has identifiable revenue risk. Prioritize the largest financial exposure and verify its root cause.'] : ['High revenue leakage risk','Multiple indicators suggest material revenue exposure. Validate the data and create an immediate recovery plan.'];
  const build = d => {
    const c=calculate(d), [title,summary]=verdict(c.score), company=esc(d.company), year=esc(d.year), scope=esc(d.period), role=esc(d.role), currency=esc(d.currency), coverage=c.coverage!=null?c.coverage.toFixed(1)+'×':'Not provided';
    const achievement=c.target>0&&c.revenue>0?((c.revenue/c.target-1)*100):null;
    const forecastGap=c.revenue>0&&c.forecast>0?((c.forecast/c.revenue-1)*100):null;
    const exposure=c.risk>0?money(c.risk,d.currency):'Not provided';
    const dataQuality=Math.round((c.parts/6)*100);
    const actions=[];
    if(c.risk>0) actions.push(['Protect the largest exposed revenue pool',`${exposure} is identified as at-risk revenue. Assign an owner, evidence source and dated recovery action.`]);
    if(c.coverage!=null && c.coverage<3) actions.push(['Rebuild pipeline coverage',`Qualified pipeline is ${coverage}. Validate whether coverage is sufficient for the required revenue outcome.`]);
    if(d.winRate && Number(d.winRate)<20) actions.push(['Improve conversion quality',`Win rate is ${pct(d.winRate)}. Inspect qualification, stage conversion and deal velocity before adding more volume.`]);
    if(d.netRetention && Number(d.netRetention)<100) actions.push(['Stop customer revenue leakage',`Net revenue retention is ${pct(d.netRetention)}. Identify churn and contraction drivers by account segment.`]);
    if(d.margin && Number(d.margin)<60) actions.push(['Protect revenue quality',`Gross margin is ${pct(d.margin)}. Review discounting, delivery economics and low-margin revenue sources.`]);
    if(!actions.length) actions.push(['Establish the next management review',`Use the evidence in this scorecard to assign owners, dates and measurable outcomes to the highest-value opportunities.`]);
    const notes=d.notes?`<div class="rb-report-box"><strong>Management context</strong><span>${esc(d.notes)}</span></div>`:'';
    report.innerHTML=`<div class="rb-report-head"><div class="rb-report-brand"><img src="assets/logo-rectangle.svg" alt="Kartik Clarity logo"><div><div class="rb-report-kicker">KARTIK CLARITY™ · EXECUTIVE REVENUE INTELLIGENCE</div><strong>Custom decision report</strong></div></div><div class="rb-report-actions"><button class="rb-btn" id="rbBack">← Edit inputs</button><button class="rb-btn primary" id="rbPrint">Print / Save PDF</button></div></div><main class="rb-report-sheet"><div class="rb-report-kicker">${company} · ${scope} ${year}</div><h1>${title}</h1><p class="rb-report-sub">Prepared for ${role}. ${summary}</p><div class="rb-report-meta"><span class="rb-meta-chip">${company}</span><span class="rb-meta-chip">${esc(d.industry||'Industry not specified')}</span><span class="rb-meta-chip">${role}</span><span class="rb-meta-chip">${scope} ${year}</span><span class="rb-meta-chip">Data coverage ${dataQuality}%</span></div><div class="rb-score-grid"><div class="rb-score-card primary"><div class="rb-score-label">Executive Revenue Score</div><div class="rb-score-value">${c.score==null?'—':c.score}<span style="font-size:16px;color:#9eb0cc"> / 100</span></div></div><div class="rb-score-card"><div class="rb-score-label">Revenue achieved</div><div class="rb-score-value" style="font-size:25px">${c.revenue?money(c.revenue,d.currency):'—'}</div></div><div class="rb-score-card"><div class="rb-score-label">Forecast</div><div class="rb-score-value" style="font-size:25px">${c.forecast?money(c.forecast,d.currency):'—'}</div></div><div class="rb-score-card"><div class="rb-score-label">Pipeline coverage</div><div class="rb-score-value" style="font-size:25px">${coverage}</div></div></div><section class="rb-report-section"><h2>Executive interpretation</h2><p>${summary}${achievement!=null?` Revenue is ${achievement>=0?'':' '}<strong>${Math.abs(achievement).toFixed(1)}% ${achievement>=0?'above':'below'} target</strong>.`:''}${forecastGap!=null?` Forecast is <strong>${Math.abs(forecastGap).toFixed(1)}% ${forecastGap>=0?'above':'below'} achieved revenue</strong>.`:''}</p></section><section class="rb-report-section"><h2>What the evidence says</h2><div class="rb-report-columns"><div class="rb-report-box"><strong>Growth / target attainment</strong><span>${achievement==null?'Target or achieved revenue not provided.':`${achievement.toFixed(1)}% vs target`}</span></div><div class="rb-report-box"><strong>Forecast confidence signal</strong><span>${forecastGap==null?'Forecast or achieved revenue not provided.':`Forecast is ${forecastGap.toFixed(1)}% relative to achieved revenue.`}</span></div><div class="rb-report-box"><strong>Pipeline capacity</strong><span>${c.coverage==null?'Pipeline or revenue not provided.':`${coverage} qualified pipeline / achieved revenue`}</span></div><div class="rb-report-box"><strong>Retention signal</strong><span>${d.netRetention?`NRR ${pct(d.netRetention)}`:d.grossRetention?`GRR ${pct(d.grossRetention)}`:'Retention data not provided.'}</span></div>${notes}</div></section><section class="rb-report-section"><h2>Priority action plan</h2><table class="rb-report-table"><thead><tr><th>Priority</th><th>Management action</th><th>Why now</th></tr></thead><tbody>${actions.slice(0,4).map((a,i)=>`<tr><td><strong>${i+1}</strong></td><td>${esc(a[0])}</td><td>${esc(a[1])}</td></tr>`).join('')}</tbody></table></section><section class="rb-report-section"><h2>Input scorecard</h2><table class="rb-report-table"><tbody><tr><td>Revenue achieved</td><td>${c.revenue?money(c.revenue,d.currency):'Not provided'}</td></tr><tr><td>Revenue target</td><td>${c.target?money(c.target,d.currency):'Not provided'}</td></tr><tr><td>Forecast</td><td>${c.forecast?money(c.forecast,d.currency):'Not provided'}</td></tr><tr><td>Qualified pipeline</td><td>${c.pipeline?money(c.pipeline,d.currency):'Not provided'}</td></tr><tr><td>Win rate</td><td>${d.winRate?pct(d.winRate):'Not provided'}</td></tr><tr><td>Gross / Net retention</td><td>${d.grossRetention?pct(d.grossRetention):'—'} / ${d.netRetention?pct(d.netRetention):'—'}</td></tr><tr><td>At-risk revenue</td><td>${exposure}</td></tr><tr><td>Gross margin</td><td>${d.margin?pct(d.margin):'Not provided'}</td></tr></tbody></table></section><div class="rb-report-foot">Kartik Clarity™ · Executive Revenue Scorecard™ · Decision support based only on the inputs provided. Missing data lowers evidence coverage; this report is not an audit, valuation, accounting opinion, or guarantee.</div></main>`;
    report.classList.add('open');
    $('#rbBack',report).addEventListener('click',()=>{report.classList.remove('open');overlay.classList.add('open');});
    $('#rbPrint',report).addEventListener('click',async()=>{
      const printButton=$('#rbPrint',report);
      if(!printButton) return;
      printButton.disabled=true;
      const previousTitle=document.title;
      const safeCompany=String(d.company||'Executive-Revenue-Scorecard').trim().replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,80)||'Executive-Revenue-Scorecard';
      const safePeriod=String(d.period||'FY').trim().replace(/[^a-z0-9]+/gi,'-');
      const safeYear=String(d.year||new Date().getFullYear()).trim();
      const filename=`Kartik-Clarity-Executive-Revenue-Scorecard-${safeCompany}-${safePeriod}-${safeYear}`;
      document.title=filename;
      const images=[...report.querySelectorAll('img')];
      try {
        if(document.fonts?.ready) await document.fonts.ready;
        await Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.addEventListener('load',resolve,{once:true}); img.addEventListener('error',resolve,{once:true}); })));
      } catch {}
      requestAnimationFrame(() => requestAnimationFrame(() => {
        let restored=false;
        const restore=()=>{ if(restored) return; restored=true; document.title=previousTitle; printButton.disabled=false; window.removeEventListener('afterprint',restore); };
        window.addEventListener('afterprint',restore,{once:true});
        window.print();
        setTimeout(restore,15000);
      }));
    });
    try { localStorage.setItem('kc-executive-scorecard-profile',JSON.stringify(d)); } catch {}
  };

  $('#rbGenerate',overlay).addEventListener('click',()=>{
    const d=collect(), err=$('#rbError',overlay);
    if(!d.company.trim()){err.textContent='Enter the company name to generate the report.';err.classList.add('show');$('#rbCompany',overlay).focus();return;}
    const y=Number(d.year); if(!Number.isInteger(y)||y<1900||y>2200){err.textContent='Enter a valid reporting year between 1900 and 2200.';err.classList.add('show');$('#rbYear',overlay).focus();return;}
    err.classList.remove('show'); close(); build(d);
  });
})();
