/* ═══════════════════════════════════════════════════════════
   UNIQUEPLAN AI VENUE — main.js
   ✅ 목업 모드: API 없이 더미 데이터로 즉시 확인
   ✅ 어드민 패널: 실제 장소 데이터 직접 입력·관리
═══════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════════
   0. 내장 목업 장소 데이터 (5개)
════════════════════════════════════════════════════════ */
const MOCK_VENUES_DEFAULT = [
  {
    id:'mock-1', rank:1,
    name:'그랜드 하얏트 서울 — 그랜드볼룸',
    type:'특급호텔 연회장', match_percent:96,
    location:'서울 용산구 소월로 322',
    price_range:'1,800~2,500만원',
    summary:'VIP 행사에 최적화된 프리미엄 연회 공간으로, 한강 조망과 최첨단 AV 시스템을 갖추고 있습니다. 상주 케이터링팀과 전문 이벤트 코디네이터가 기업 행사를 완벽하게 지원하며, 접근성과 주차 편의성이 뛰어납니다.',
    pros:[
      {icon:'✦',title:'VIP 의전 동선',desc:'전용 VIP 엔트런스와 별도 대기실로 임원급 의전에 최적입니다.'},
      {icon:'✦',title:'프리미엄 AV',desc:'4K 레이저 프로젝터 3대와 상주 AV 엔지니어 팀이 제공됩니다.'},
      {icon:'✦',title:'전용 주차',desc:'지하 자주식 350대, 발렛 서비스 옵션 가능합니다.'},
    ],
    cautions:[{icon:'△',title:'성수기 예약',desc:'3~5월·10~11월은 최소 3개월 전 예약이 필요합니다.'}],
    specs:{capacity:'최대 500명',area:'약 1,200㎡',ceiling:'천고 6.5m',parking:'자주식 350대',av:'상주 AV팀 + 4K',catering:'내부 전담'},
    tags:['강남','호텔','VIP'],
  },
  {
    id:'mock-2', rank:2,
    name:'코엑스 — 그랜드볼룸',
    type:'전문 컨벤션센터', match_percent:91,
    location:'서울 강남구 영동대로 513',
    price_range:'1,200~1,800만원',
    summary:'국내 최대 도심형 컨벤션 시설로 유연한 분할 구성과 대형 전시 연계가 가능합니다. 삼성역 직결 접근성이 뛰어나며 다양한 케이터링 옵션을 제공합니다.',
    pros:[
      {icon:'✦',title:'삼성역 직결',desc:'지하철 2·9호선 삼성역 도보 0분, 참석자 접근성 최고입니다.'},
      {icon:'✦',title:'모듈형 구성',desc:'홀을 2~4개 구역으로 분할 가능해 유연한 운영이 됩니다.'},
    ],
    cautions:[{icon:'△',title:'케이터링 조율',desc:'외부 업체 선정이 필요하며 사전 협의 시간이 소요됩니다.'}],
    specs:{capacity:'최대 800명',area:'약 2,000㎡',ceiling:'천고 8m',parking:'공영 2,000대',av:'자체 AV팀',catering:'제휴 업체 다수'},
    tags:['강남','컨벤션','대형'],
  },
  {
    id:'mock-3', rank:3,
    name:'롯데호텔 서울 — 크리스탈볼룸',
    type:'특급호텔 연회장', match_percent:88,
    location:'서울 중구 을지로 30',
    price_range:'1,400~2,000만원',
    summary:'명동·시청 도심 중심부로 어디서든 접근이 용이하며 클래식한 분위기와 최신 시설을 함께 갖추고 있습니다. 해외 참석자 초청 행사에도 적합합니다.',
    pros:[
      {icon:'✦',title:'도심 최중심',desc:'을지로입구역 바로 인접, 사방에서 접근이 용이합니다.'},
      {icon:'✦',title:'자체 조명',desc:'무빙 LED·핀조명·무드 조명 전 카테고리 보유합니다.'},
    ],
    cautions:[{icon:'△',title:'주차 제한',desc:'도심 특성상 주차 대수가 150대로 제한적입니다.'}],
    specs:{capacity:'최대 350명',area:'약 750㎡',ceiling:'천고 5m',parking:'자주식 150대',av:'상주 AV팀',catering:'호텔 자체'},
    tags:['중구','호텔','도심'],
  },
  {
    id:'mock-4', rank:4,
    name:'파르나스 타워 — 더그랜드볼룸',
    type:'프리미엄 오피스 연회장', match_percent:84,
    location:'서울 강남구 테헤란로 521',
    price_range:'900~1,400만원',
    summary:'테헤란로 랜드마크 최상층 연회장으로 강남 도심 전망이 탁월합니다. B2B 기업 행사에 최적화된 입지입니다.',
    pros:[
      {icon:'✦',title:'강남 파노라마',desc:'38층 전망 연회장으로 강남 야경 배경 연출이 가능합니다.'},
    ],
    cautions:[
      {icon:'△',title:'인원 제한',desc:'최대 180명으로 대규모 행사에는 적합하지 않습니다.'},
    ],
    specs:{capacity:'최대 180명',area:'약 400㎡',ceiling:'천고 3.8m',parking:'건물 200대',av:'기본 구비',catering:'제휴 케이터링'},
    tags:['강남','전망','소규모'],
  },
  {
    id:'mock-5', rank:5,
    name:'세빛섬 — 가빛홀',
    type:'특수 이벤트홀', match_percent:79,
    location:'서울 서초구 올림픽대로 683-1',
    price_range:'1,000~1,600만원',
    summary:'한강 수상 위의 독창적 공간으로 차별화된 행사 경험을 제공합니다. 유니크한 공간감과 한강 수변 경관이 특별한 인상을 남깁니다.',
    pros:[
      {icon:'✦',title:'한강 수상 유일',desc:'한국에서 유일한 수상 이벤트홀로 강렬한 인상을 남깁니다.'},
    ],
    cautions:[
      {icon:'△',title:'접근성 제한',desc:'대중교통이 불편하고 주차 공간이 제한적입니다.'},
    ],
    specs:{capacity:'최대 250명',area:'약 500㎡',ceiling:'천고 4m',parking:'인근 공영',av:'기본 음향·조명',catering:'자체 레스토랑'},
    tags:['서초','한강','특수'],
  },
];

/* ════════════════════════════════════════════════════════
   1. 앱 상태
════════════════════════════════════════════════════════ */
const state = {
  currentStep:   1,
  formData:      null,
  venueList:     [],
  selectedVenue: null,
  useMockMode:   true,
};

function getCustomVenues() {
  try { return JSON.parse(localStorage.getItem('uq_venues') || '[]'); }
  catch { return []; }
}
function saveCustomVenues(v) { localStorage.setItem('uq_venues', JSON.stringify(v)); }
function getAllMockVenues()  { return [...MOCK_VENUES_DEFAULT, ...getCustomVenues()]; }

/* ════════════════════════════════════════════════════════
   2. 라우터
════════════════════════════════════════════════════════ */
function goTo(step) {
  state.currentStep = step;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const tv = document.getElementById('view' + step);
  if (tv) tv.classList.add('active');
  const dark = (step === 4);
  document.getElementById('appHeader').classList.toggle('dark', dark);
  document.getElementById('stepBar').classList.toggle('dark', dark);
  document.getElementById('hdrInfo').classList.toggle('hidden', dark);
  document.getElementById('simToolbar').classList.toggle('hidden', !dark);
  document.getElementById('simStatus').classList.toggle('hidden', !dark);
  [1,2,3,4,5].forEach(n => {
    const el = document.getElementById('s'+n+'tab');
    if (!el) return;
    el.className = 'step' + (n < step ? ' done' : n === step ? ' active' : '');
    el.querySelector('.snum').textContent = n < step ? '✓' : String(n);
  });
  if (!dark) document.getElementById('hdrInfo').textContent = `v1.0 · STEP ${step}/5`;
  if (step === 4) initSim();
}

/* ════════════════════════════════════════════════════════
   3. STEP 1 — 폼
════════════════════════════════════════════════════════ */
let vipOn = false;
document.getElementById('vipTog').addEventListener('click', () => {
  vipOn = !vipOn;
  document.getElementById('vipTog').classList.toggle('on', vipOn);
  document.getElementById('vipStatus').textContent = vipOn ? 'YES' : 'NO';
  checkReq();
});
document.getElementById('budgetSlider').addEventListener('input', updateBudget);
function updateBudget() {
  const v = +document.getElementById('budgetSlider').value;
  let lbl;
  if (v <= 100) lbl = (v*100).toLocaleString()+'만원';
  else if (v <= 150) lbl = ((v-100)/10).toFixed(1)+'억원';
  else lbl = '2억원+';
  document.getElementById('budgetDisplay').textContent = lbl;
}
function getBudgetNum() {
  const v = +document.getElementById('budgetSlider').value;
  if (v <= 100) return v*1e6;
  if (v <= 150) return ((v-100)/10)*1e8;
  return 2e8;
}
updateBudget();
document.getElementById('eventTypes').addEventListener('click', e => { if (e.target.classList.contains('tbtn2')) e.target.classList.toggle('sel'); });
document.querySelectorAll('.q-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll(`input[name="${opt.querySelector('input').name}"]`).forEach(r => r.closest('.q-opt').classList.remove('sel'));
    opt.classList.add('sel');
  });
});
document.querySelectorAll('.cbi').forEach(cb => cb.addEventListener('click', () => cb.classList.toggle('chk')));
document.getElementById('mealTog').addEventListener('click', e => {
  if (e.target.classList.contains('meal-btn')) { document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('sel')); e.target.classList.add('sel'); }
});
function checkReq() {
  const ok = [!!document.getElementById('region').value, !!document.getElementById('attendees').value, !!document.getElementById('eventDate').value, true, true];
  document.getElementById('reqCount').textContent = ok.filter(Boolean).length + ' / 5';
  return ok.every(Boolean);
}
document.getElementById('region').addEventListener('change', checkReq);
document.getElementById('attendees').addEventListener('input', checkReq);
document.getElementById('eventDate').addEventListener('change', checkReq);
function collectForm() {
  return {
    required: { region: document.getElementById('region').value, attendees: +document.getElementById('attendees').value||null, event_date: document.getElementById('eventDate').value, event_time: document.getElementById('eventTime').value, vip_attendance: vipOn, budget_krw: getBudgetNum() },
    optional: { event_types: [...document.querySelectorAll('#eventTypes .tbtn2.sel')].map(b=>b.dataset.v), event_theme: document.getElementById('eventTheme').value||null, screen_quality: document.querySelector('input[name="screen"]:checked')?.value||null, audio_quality: document.querySelector('input[name="audio"]:checked')?.value||null, accommodation: +document.getElementById('accommodation').value||0, parking_spots: +document.getElementById('parking').value||0, meal_included: document.querySelector('.meal-btn.sel')?.dataset.v||'미포함', lighting: [...document.querySelectorAll('#lighting .cbi.chk')].map(c=>c.dataset.v) },
    meta: { submitted_at: new Date().toISOString() },
  };
}
document.getElementById('btnStep1Next').addEventListener('click', () => {
  document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));
  let err = false;
  if (!document.getElementById('region').value) { document.getElementById('f-region').classList.add('invalid'); err=true; }
  if (!document.getElementById('attendees').value) { document.getElementById('f-attendees').classList.add('invalid'); err=true; }
  if (!document.getElementById('eventDate').value) { document.getElementById('f-date').classList.add('invalid'); err=true; }
  if (err) { document.getElementById('f-region').scrollIntoView({behavior:'smooth',block:'center'}); return; }
  state.formData = collectForm();
  goTo(2);
  renderCondPills();
  startRecommendation();
});

/* ════════════════════════════════════════════════════════
   4. STEP 2 — 추천 (목업 / AI 분기)
════════════════════════════════════════════════════════ */
function renderCondPills() {
  const r=state.formData.required, o=state.formData.optional;
  const pills=[];
  if(r.region) pills.push(['지역',r.region]);
  if(r.attendees) pills.push(['인원',r.attendees+'명']);
  if(r.event_date) pills.push(['일시',r.event_date]);
  if(r.vip_attendance) pills.push(['VIP','참석']);
  const b=r.budget_krw;
  pills.push(['예산', b>=1e8?(b/1e8).toFixed(1)+'억원':(b/1e4).toLocaleString()+'만원']);
  if(o.event_types?.length) pills.push(['유형',o.event_types[0]+(o.event_types.length>1?` 외 ${o.event_types.length-1}`:'')]);
  const modeTag = state.useMockMode
    ? `<span style="padding:3px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;font-size:10px;font-family:var(--mono);border:1px solid #FDE68A">◈ 목업 모드</span>`
    : `<span style="padding:3px 8px;background:#EBF5EE;color:#1a6b35;border-radius:4px;font-size:10px;font-family:var(--mono);border:1px solid #C6E8D0">◈ AI 모드</span>`;
  document.getElementById('condBar').innerHTML = pills.map(([k,v])=>`<div class="pill"><span class="pill-k">${k}</span>${v}</div>`).join('')+`<div style="margin-left:auto">${modeTag}</div>`;
}
document.getElementById('btnBack').addEventListener('click', () => goTo(1));
document.getElementById('btnRetry').addEventListener('click', startRecommendation);

function startRecommendation() { state.useMockMode ? startMock() : startAI(); }

/* 목업 */
function startMock() {
  document.getElementById('ldState').style.display='flex';
  document.getElementById('errState').classList.remove('vis');
  document.getElementById('results').classList.remove('vis');
  ['ls1','ls2','ls3'].forEach((id,i)=>{
    const el=document.getElementById(id); el.classList.remove('vis','done');
    setTimeout(()=>{el.classList.add('vis'); setTimeout(()=>el.classList.add('done'),400);}, 300+i*600);
  });
  const venues = filterMockVenues(state.formData);
  setTimeout(()=>{ document.getElementById('ldState').style.display='none'; state.venueList=venues; renderVenues(venues); }, 2200);
}
function filterMockVenues(fd) {
  const r=fd.required, o=fd.optional;
  return getAllMockVenues().map(v=>{
    let score=v.match_percent;
    if(r.vip_attendance && v.type.includes('특급')) score+=4;
    if(r.region && v.location && v.location.includes(r.region.replace('서울 ',''))) score+=3;
    if(r.attendees){ const cap=parseInt((v.specs?.capacity||'999').replace(/[^0-9]/g,'')); if(r.attendees>cap) score-=20; }
    return {...v, match_percent:Math.min(98,Math.max(55,score))};
  }).sort((a,b)=>b.match_percent-a.match_percent).slice(0,5).map((v,i)=>({...v,rank:i+1}));
}

/* AI 모드 */
async function startAI() {
  document.getElementById('ldState').style.display='flex';
  document.getElementById('errState').classList.remove('vis');
  document.getElementById('results').classList.remove('vis');
  ['ls1','ls2','ls3'].forEach((id,i)=>{ const el=document.getElementById(id); el.classList.remove('vis','done'); setTimeout(()=>{el.classList.add('vis');setTimeout(()=>el.classList.add('done'),600);},400+i*1100); });
  const SYS=`당신은 MICE/BTL 행사 기획 전문가입니다. 조건을 분석해 최적 장소 3~5곳을 추천하세요. 순수 JSON만 출력하세요.
{"venues":[{"rank":1,"name":"장소명","type":"호텔 연회장","match_percent":95,"location":"서울 강남구","price_range":"1,500~2,000만원","summary":"추천이유","pros":[{"icon":"✦","title":"강점","desc":"설명"}],"cautions":[{"icon":"△","title":"주의","desc":"설명"}],"specs":{"capacity":"최대 200명","area":"약 450㎡","ceiling":"천고 4.2m","parking":"자주식 200대","av":"상주 AV팀","catering":"내부 케이터링"}}]}`;
  try {
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:SYS,messages:[{role:'user',content:`행사 조건:\n${JSON.stringify(state.formData,null,2)}`}]})});
    if(!res.ok) throw new Error(`API 오류 (${res.status})`);
    const json=await res.json();
    const data=JSON.parse(json.content[0].text.trim().replace(/^```json|^```|```$/gm,'').trim());
    state.venueList=data.venues;
    setTimeout(()=>{ document.getElementById('ldState').style.display='none'; renderVenues(data.venues); },3400);
  } catch(err) {
    setTimeout(()=>{ document.getElementById('ldState').style.display='none'; document.getElementById('errMsg').textContent=err.message; document.getElementById('errState').classList.add('vis'); },2000);
  }
}

/* 카드 렌더 */
function renderVenues(venues) {
  document.getElementById('resultCount').textContent=venues.length;
  const list=document.getElementById('venueList');
  list.innerHTML='';
  venues.forEach(venue=>{
    const rk=Math.min(venue.rank,5), card=document.createElement('div');
    card.className=`vc rk${rk}`;
    const prosH=(venue.pros||[]).map(p=>`<div class="ri"><div class="ri-icon pro">${p.icon}</div><div class="ri-text"><strong>${p.title}</strong><br>${p.desc}</div></div>`).join('');
    const cauH=(venue.cautions||[]).map(c=>`<div class="ri"><div class="ri-icon warn">${c.icon}</div><div class="ri-text"><strong>${c.title}</strong><br>${c.desc}</div></div>`).join('');
    const SL={capacity:'수용인원',area:'면적',ceiling:'천고',parking:'주차',av:'AV',catering:'케이터링'};
    const sH=Object.entries(venue.specs||{}).map(([k,v])=>`<div class="spec"><div class="spec-k">${SL[k]||k}</div><div class="spec-v">${v}</div></div>`).join('');
    card.innerHTML=`<div class="vc-main"><div class="rnk">${venue.rank}</div><div><div class="vc-top"><div class="vname">${venue.name}</div><div class="vtags"><span class="vtag vtag-type">${venue.type||''}</span>${rk===1?'<span class="vtag vtag-top">★ BEST</span>':''}</div></div><div class="vsum">${venue.summary}</div><div class="match-row"><span class="match-lbl">매칭률</span><div class="match-bar"><div class="match-fill" data-pct="${venue.match_percent}"></div></div><span class="match-pct">${venue.match_percent}%</span></div></div><div class="vc-right"><div><div class="vprice-lbl">예상 대관료</div><div class="vprice-val">${venue.price_range||'문의'}</div></div><button class="btn-sel">선택하기</button></div></div><div class="dp"><div class="dp-inner"><div class="dp-grid"><div><div class="dp-sec-ttl">추천 이유</div><div class="reasons">${prosH}</div>${cauH?`<div style="margin-top:14px"><div class="dp-sec-ttl">주의사항</div><div class="reasons">${cauH}</div></div>`:''}</div><div><div class="dp-sec-ttl">장소 스펙</div><div class="specs-g">${sH}</div><div class="spec-loc">📍 ${venue.location||''}</div></div></div><div class="dp-footer"><div class="dp-note">이 장소로 배치 시뮬레이션을 시작합니다</div><button class="btn-proceed">이 장소로 배치 시뮬레이션 →</button></div></div></div>`;
    card.querySelector('.vc-main').addEventListener('click',()=>toggleDetail(card));
    card.querySelector('.btn-sel').addEventListener('click',e=>{e.stopPropagation();selectVenue(card,venue);});
    card.querySelector('.btn-proceed').addEventListener('click',()=>{selectVenue(card,venue);goToSim(venue);});
    list.appendChild(card);
  });
  document.getElementById('results').classList.add('vis');
  requestAnimationFrame(()=>setTimeout(()=>{ document.querySelectorAll('.match-fill').forEach(b=>{b.style.width=b.dataset.pct+'%';}); },200));
}
function toggleDetail(card) { const dp=card.querySelector('.dp'),was=dp.classList.contains('open'); document.querySelectorAll('.dp.open').forEach(d=>d.classList.remove('open')); if(!was)dp.classList.add('open'); }
function selectVenue(card,venue) { document.querySelectorAll('.vc').forEach(c=>c.classList.remove('sel')); card.classList.add('sel'); state.selectedVenue=venue; document.querySelectorAll('.dp.open').forEach(d=>d.classList.remove('open')); card.querySelector('.dp').classList.add('open'); }
function goToSim(venue) { state.selectedVenue=venue; goTo(4); }

/* ════════════════════════════════════════════════════════
   5. 어드민 패널
════════════════════════════════════════════════════════ */
function createAdminPanel() {
  const panel=document.createElement('div');
  panel.id='adminPanel';
  panel.innerHTML=`<style>
#adminPanel{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:admFade .2s ease}
@keyframes admFade{from{opacity:0}to{opacity:1}}
.adm-modal{background:#fff;border-radius:14px;width:860px;max-width:96vw;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(0,0,0,.22);overflow:hidden}
.adm-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 28px 16px;border-bottom:1px solid #E5E3DC;flex-shrink:0}
.adm-hdr h2{font-size:16px;font-weight:700}
.adm-hdr p{font-size:12px;color:#9A9690;margin-top:3px}
.adm-close{width:30px;height:30px;border-radius:7px;border:1.5px solid #E5E3DC;background:none;cursor:pointer;font-size:14px;color:#9A9690;transition:all .15s}
.adm-close:hover{background:#F4F3EF;color:#1A1A1A}
.adm-tabs{display:flex;border-bottom:1px solid #E5E3DC;padding:0 28px;flex-shrink:0}
.adm-tab{padding:10px 16px;font-size:12px;font-weight:600;color:#ABA99F;border-bottom:2px solid transparent;cursor:pointer;transition:color .15s,border-color .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:'Pretendard',sans-serif}
.adm-tab.active{color:#1A1A1A;border-bottom-color:#1A1A1A}
.adm-body{flex:1;overflow-y:auto;padding:24px 28px}
.tab-pane{display:none}.tab-pane.active{display:block}
.mode-card{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:#F9F8F5;border:1.5px solid #E5E3DC;border-radius:10px;margin-bottom:14px}
.mode-card.on-mock{border-color:#F59E0B;background:#FFFBEB}
.mode-card.on-ai{border-color:#10B981;background:#ECFDF5}
.mode-title{font-size:14px;font-weight:600;margin-bottom:3px}
.mode-desc{font-size:12px;color:#6B6860;line-height:1.5}
.mode-badge{padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700;font-family:'DM Mono',monospace}
.badge-mock{background:#FEF3C7;color:#92400E}.badge-ai{background:#D1FAE5;color:#065F46}
.mode-switch-btn{padding:8px 18px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid #E5E3DC;background:#fff;font-family:'Pretendard',sans-serif;transition:all .15s;white-space:nowrap}
.mode-switch-btn:hover{border-color:#1A1A1A;background:#1A1A1A;color:#fff}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.form-row.full{grid-template-columns:1fr}.form-row.three{grid-template-columns:1fr 1fr 1fr}
.fgroup label{font-size:11px;font-weight:600;color:#6B6860;display:block;margin-bottom:6px}
.fgroup input,.fgroup select,.fgroup textarea{width:100%;padding:9px 12px;font-size:13px;font-family:'Pretendard',sans-serif;border:1.5px solid #E5E3DC;border-radius:6px;outline:none;background:#F9F8F5;transition:border-color .15s}
.fgroup input:focus,.fgroup select:focus,.fgroup textarea:focus{border-color:#1A1A1A;background:#fff}
.fgroup textarea{resize:vertical;min-height:72px}
.adm-sec-ttl{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#ABA99F;font-family:'DM Mono',monospace;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid #E5E3DC}
.pros-list{display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
.pro-item{display:grid;grid-template-columns:40px 1fr 1fr 28px;gap:8px;align-items:center;padding:10px 12px;background:#F9F8F5;border-radius:7px;border:1px solid #E5E3DC}
.pro-item input{padding:6px 10px;font-size:12px}
.pro-icon-inp{text-align:center}
.btn-rm{width:26px;height:26px;border-radius:5px;border:1.5px solid #E5E3DC;background:none;color:#ABA99F;cursor:pointer;font-size:12px;transition:all .15s}
.btn-rm:hover{border-color:#C84B31;color:#C84B31}
.btn-add-row{padding:8px;font-size:11px;font-weight:600;border:1.5px dashed #E5E3DC;background:none;color:#ABA99F;border-radius:6px;cursor:pointer;font-family:'Pretendard',sans-serif;transition:all .15s;width:100%}
.btn-add-row:hover{border-color:#1A1A1A;color:#1A1A1A}
.adm-save{display:flex;align-items:center;gap:8px;margin-top:24px;padding:12px 24px;background:#1A1A1A;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Pretendard',sans-serif;transition:opacity .15s}
.adm-save:hover{opacity:.85}
.vc-adm{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#F9F8F5;border:1px solid #E5E3DC;border-radius:8px;margin-bottom:8px}
.vc-adm-name{font-size:14px;font-weight:700;margin-bottom:3px}
.vc-adm-meta{font-size:11px;color:#9A9690;font-family:'DM Mono',monospace}
.btn-del-v{padding:6px 12px;border-radius:5px;border:1.5px solid #E5E3DC;background:none;color:#ABA99F;font-size:11px;cursor:pointer;font-family:'Pretendard',sans-serif;transition:all .15s}
.btn-del-v:hover{border-color:#C84B31;color:#C84B31;background:#FEF2F2}
.adm-empty{text-align:center;padding:40px;color:#ABA99F;font-size:13px;line-height:1.7}
</style>
<div class="adm-modal">
  <div class="adm-hdr">
    <div><h2>⚙ 관리자 패널</h2><p>목업 모드 전환 · 실제 장소 데이터 입력 · 관리</p></div>
    <button class="adm-close" id="admClose">✕</button>
  </div>
  <div class="adm-tabs">
    <button class="adm-tab active" data-tab="mode">추천 모드</button>
    <button class="adm-tab" data-tab="add">장소 추가</button>
    <button class="adm-tab" data-tab="list">등록 장소</button>
  </div>
  <div class="adm-body">

    <div class="tab-pane active" id="tab-mode">
      <div class="mode-card ${state.useMockMode?'on-mock':''}">
        <div><div class="mode-title">🧪 목업 모드</div><div class="mode-desc">API 없이 내장 더미 데이터로 즉시 프로토타입 확인.<br>빠른 테스트·시연 시 사용합니다.</div></div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
          ${state.useMockMode?'<span class="mode-badge badge-mock">현재 사용 중</span>':''}
          <button class="mode-switch-btn" id="btnSwitchMock">${state.useMockMode?'✓ 사용 중':'목업으로 전환'}</button>
        </div>
      </div>
      <div class="mode-card ${!state.useMockMode?'on-ai':''}">
        <div><div class="mode-title">🤖 AI 실시간 모드</div><div class="mode-desc">Anthropic Claude API를 호출해 조건에 맞는 장소를 실시간 분석.<br>실제 서비스 운영 시 사용합니다.</div></div>
        <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
          ${!state.useMockMode?'<span class="mode-badge badge-ai">현재 사용 중</span>':''}
          <button class="mode-switch-btn" id="btnSwitchAI">${!state.useMockMode?'✓ 사용 중':'AI로 전환'}</button>
        </div>
      </div>
      <div style="padding:14px 18px;background:#F9F8F5;border-radius:8px;border:1px solid #E5E3DC;font-size:12px;color:#6B6860;line-height:1.7">
        <strong style="color:#1A1A1A">💡 목업 데이터 현황</strong><br>
        기본 내장 ${MOCK_VENUES_DEFAULT.length}개 + 직접 등록 <strong id="customCnt">${getCustomVenues().length}</strong>개가 조건에 따라 필터링됩니다.
      </div>
    </div>

    <div class="tab-pane" id="tab-add">
      <div class="adm-sec-ttl">기본 정보</div>
      <div class="form-row">
        <div class="fgroup"><label>장소명 *</label><input id="adm-name" type="text" placeholder="예: 그랜드 인터컨티넨탈 파르나스 — 그랜드볼룸"></div>
        <div class="fgroup"><label>장소 유형 *</label>
          <select id="adm-type">
            <option value="">선택하세요</option>
            <option>특급호텔 연회장</option><option>비즈니스호텔 연회장</option>
            <option>전문 컨벤션센터</option><option>프리미엄 오피스빌딩 연회장</option>
            <option>특수 이벤트홀</option><option>리조트 연회장</option><option>기타</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="fgroup"><label>주소</label><input id="adm-loc" type="text" placeholder="예: 서울 강남구 테헤란로 521"></div>
        <div class="fgroup"><label>예상 대관료</label><input id="adm-price" type="text" placeholder="예: 1,200~1,800만원"></div>
      </div>
      <div class="form-row full">
        <div class="fgroup"><label>한줄 요약 (추천 이유)</label><textarea id="adm-summary" placeholder="이 장소를 추천하는 핵심 이유를 2~3문장으로 작성해 주세요."></textarea></div>
      </div>

      <div class="adm-sec-ttl">장소 스펙</div>
      <div class="form-row three">
        <div class="fgroup"><label>수용 인원</label><input id="spec-cap" type="text" placeholder="최대 300명"></div>
        <div class="fgroup"><label>면적</label><input id="spec-area" type="text" placeholder="약 600㎡"></div>
        <div class="fgroup"><label>천고</label><input id="spec-ceil" type="text" placeholder="천고 5m"></div>
      </div>
      <div class="form-row three">
        <div class="fgroup"><label>주차</label><input id="spec-park" type="text" placeholder="자주식 200대"></div>
        <div class="fgroup"><label>AV 시스템</label><input id="spec-av" type="text" placeholder="상주 AV팀 보유"></div>
        <div class="fgroup"><label>케이터링</label><input id="spec-cat" type="text" placeholder="내부 케이터링 가능"></div>
      </div>

      <div class="adm-sec-ttl">강점 (추천 이유)</div>
      <div class="pros-list" id="adm-pros">
        <div class="pro-item">
          <input class="pro-icon-inp" type="text" value="✦" placeholder="✦">
          <input type="text" placeholder="강점 제목" class="pro-ttl">
          <input type="text" placeholder="설명 (1~2문장)" class="pro-dsc">
          <button class="btn-rm" onclick="this.closest('.pro-item').remove()">✕</button>
        </div>
      </div>
      <button class="btn-add-row" id="btnAddPro">+ 강점 추가</button>

      <div class="adm-sec-ttl">주의사항</div>
      <div class="pros-list" id="adm-caut">
        <div class="pro-item">
          <input class="pro-icon-inp" type="text" value="△" placeholder="△">
          <input type="text" placeholder="주의사항 제목" class="pro-ttl">
          <input type="text" placeholder="설명" class="pro-dsc">
          <button class="btn-rm" onclick="this.closest('.pro-item').remove()">✕</button>
        </div>
      </div>
      <button class="btn-add-row" id="btnAddCaut">+ 주의사항 추가</button>

      <button class="adm-save" id="admSave">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        장소 저장하기
      </button>
    </div>

    <div class="tab-pane" id="tab-list">
      <div id="admList"></div>
    </div>
  </div>
</div>`;

  document.body.appendChild(panel);
  document.getElementById('admClose').addEventListener('click', closeAdmin);
  panel.addEventListener('click', e=>{ if(e.target===panel) closeAdmin(); });

  panel.querySelectorAll('.adm-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      panel.querySelectorAll('.adm-tab').forEach(t=>t.classList.remove('active'));
      panel.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
      if(tab.dataset.tab==='list') renderAdmList();
    });
  });

  document.getElementById('btnSwitchMock').addEventListener('click',()=>{ state.useMockMode=true; closeAdmin(); showToast('✅ 목업 모드로 전환됐습니다'); });
  document.getElementById('btnSwitchAI').addEventListener('click',()=>{ state.useMockMode=false; closeAdmin(); showToast('✅ AI 실시간 모드로 전환됐습니다'); });

  function addRow(listId, icon, tp, dp) {
    const row=document.createElement('div'); row.className='pro-item';
    row.innerHTML=`<input class="pro-icon-inp" type="text" value="${icon}" placeholder="${icon}"><input type="text" placeholder="${tp}" class="pro-ttl"><input type="text" placeholder="${dp}" class="pro-dsc"><button class="btn-rm" onclick="this.closest('.pro-item').remove()">✕</button>`;
    document.getElementById(listId).appendChild(row);
  }
  document.getElementById('btnAddPro').addEventListener('click',()=>addRow('adm-pros','✦','강점 제목','설명'));
  document.getElementById('btnAddCaut').addEventListener('click',()=>addRow('adm-caut','△','주의사항 제목','설명'));

  document.getElementById('admSave').addEventListener('click',()=>{
    const name=document.getElementById('adm-name').value.trim();
    const type=document.getElementById('adm-type').value;
    if(!name||!type){ alert('장소명과 장소 유형은 필수입니다.'); return; }
    const pros=[...document.querySelectorAll('#adm-pros .pro-item')].map(r=>({icon:r.querySelector('.pro-icon-inp').value||'✦',title:r.querySelector('.pro-ttl').value,desc:r.querySelector('.pro-dsc').value})).filter(p=>p.title);
    const caut=[...document.querySelectorAll('#adm-caut .pro-item')].map(r=>({icon:r.querySelector('.pro-icon-inp').value||'△',title:r.querySelector('.pro-ttl').value,desc:r.querySelector('.pro-dsc').value})).filter(c=>c.title);
    const v={id:'custom-'+Date.now(),rank:99,name,type,match_percent:85,location:document.getElementById('adm-loc').value,price_range:document.getElementById('adm-price').value,summary:document.getElementById('adm-summary').value,pros,cautions:caut,specs:{capacity:document.getElementById('spec-cap').value,area:document.getElementById('spec-area').value,ceiling:document.getElementById('spec-ceil').value,parking:document.getElementById('spec-park').value,av:document.getElementById('spec-av').value,catering:document.getElementById('spec-cat').value},tags:['직접등록'],custom:true};
    saveCustomVenues([...getCustomVenues(),v]);
    const cc=document.getElementById('customCnt'); if(cc) cc.textContent=getCustomVenues().length;
    closeAdmin();
    showToast(`✅ "${name}" 장소가 등록됐습니다`);
  });

  function renderAdmList() {
    const c=document.getElementById('admList');
    const all=[...MOCK_VENUES_DEFAULT.map(v=>({...v,builtIn:true})),...getCustomVenues()];
    if(!all.length){ c.innerHTML='<div class="adm-empty">등록된 장소가 없습니다.</div>'; return; }
    c.innerHTML=all.map(v=>`<div class="vc-adm"><div><div class="vc-adm-name">${v.name}</div><div class="vc-adm-meta">${v.type} · ${v.location||'주소 미입력'} · ${v.price_range||'금액 미입력'} · ${v.builtIn?'<span style="color:#B8860B">내장</span>':'<span style="color:#10B981">직접 등록</span>'}</div></div><div>${!v.builtIn?`<button class="btn-del-v" data-id="${v.id}">삭제</button>`:'<span style="font-size:11px;color:#ABA99F">내장 데이터</span>'}</div></div>`).join('');
    c.querySelectorAll('.btn-del-v').forEach(btn=>{
      btn.addEventListener('click',()=>{ saveCustomVenues(getCustomVenues().filter(v=>v.id!==btn.dataset.id)); renderAdmList(); showToast('장소가 삭제됐습니다'); });
    });
  }
}

function closeAdmin() { const p=document.getElementById('adminPanel'); if(p) p.remove(); }

/* 어드민 진입: 로고 5번 탭 or Ctrl+Shift+A */
let tapN=0, tapT=null;
document.querySelector('.logo').addEventListener('click',()=>{
  tapN++; clearTimeout(tapT);
  tapT=setTimeout(()=>tapN=0, 2000);
  if(tapN>=5){ tapN=0; openAdmin(); }
});
document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.key==='A'){ e.preventDefault(); openAdmin(); } });
function openAdmin(){ if(document.getElementById('adminPanel')) return; createAdminPanel(); showToast('관리자 패널 열림 (Ctrl+Shift+A)'); }

/* ════════════════════════════════════════════════════════
   6. STEP 4 — 배치 시뮬레이션
════════════════════════════════════════════════════════ */
const PIECES={
  stage:     {name:'무대',        w:6,  h:4,  seats:0, color:'#C8C0A8',stroke:'#7A7260',shape:'rect'},
  screen:    {name:'스크린',      w:4,  h:.3, seats:0, color:'#4A6FA5',stroke:'#2D4F85',shape:'rect'},
  podium:    {name:'포디엄',      w:.6, h:.6, seats:0, color:'#8B7355',stroke:'#6B5335',shape:'rect'},
  roundtable:{name:'원형테이블',  w:1.8,h:1.8,seats:10,color:'#E8DFD0',stroke:'#B0A090',shape:'circle'},
  longtable: {name:'긴 테이블',   w:2.4,h:.9, seats:8, color:'#E8DFD0',stroke:'#B0A090',shape:'rect'},
  chairrow:  {name:'의자 열',     w:4,  h:.5, seats:8, color:'#D4C9B8',stroke:'#A09080',shape:'rect'},
  reception: {name:'리셉션데스크',w:2,  h:.6, seats:0, color:'#B8C4D0',stroke:'#7090B0',shape:'rect'},
  photozone: {name:'포토존',      w:3,  h:2.5,seats:0, color:'#D8C8E8',stroke:'#9880C0',shape:'rect'},
};
let simInited=false,hallW=30,hallH=20,scale=20;
let items=[],selId=null,history=[],idCtr=0;
let isDrag=false,dragItem=null,dox=0,doy=0,dragType=null;
const canvas=document.getElementById('simCanvas');
const ctx=canvas.getContext('2d');

function initSim(){
  if(simInited){calcScale();resizeCanvas();redraw();return;}
  simInited=true;
  drawPalIcons();
  document.querySelectorAll('.piece').forEach(p=>{
    p.setAttribute('draggable','true');
    p.addEventListener('dragstart',e=>{dragType=p.dataset.type;e.dataTransfer.effectAllowed='copy';});
  });
  canvas.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
  canvas.addEventListener('drop',e=>{
    e.preventDefault(); if(!dragType)return;
    savH(); const rect=canvas.getBoundingClientRect(),p=PIECES[dragType];
    const x=sn(Math.max(0,Math.min(hallW-p.w,(e.clientX-rect.left)/scale-p.w/2)));
    const y=sn(Math.max(0,Math.min(hallH-p.h,(e.clientY-rect.top)/scale-p.h/2)));
    items.push({id:++idCtr,type:dragType,x,y,rot:0}); selId=idCtr; dragType=null; upd();
  });
  canvas.addEventListener('mousedown',e=>{
    if(e.button!==0)return; const pos=cpos(e),hit=hitT(pos);
    if(hit){savH();selId=hit.id;dragItem=hit;dox=pos.x-hit.x;doy=pos.y-hit.y;isDrag=true;upd();e.preventDefault();}
    else{selId=null;upd();}
  });
  canvas.addEventListener('mousemove',e=>{
    if(!isDrag||!dragItem)return; const pos=cpos(e),p=PIECES[dragItem.type];
    dragItem.x=sn(Math.max(0,Math.min(hallW-p.w,pos.x-dox)));
    dragItem.y=sn(Math.max(0,Math.min(hallH-p.h,pos.y-doy))); upd();
  });
  canvas.addEventListener('mouseup',()=>{isDrag=false;dragItem=null;});
  canvas.addEventListener('mouseleave',()=>{isDrag=false;dragItem=null;});
  canvas.addEventListener('dblclick',e=>{const hit=hitT(cpos(e));if(hit){savH();hit.rot=(hit.rot+90)%360;upd();}});
  canvas.addEventListener('contextmenu',e=>{
    e.preventDefault(); const hit=hitT(cpos(e));
    if(hit){savH();items=items.filter(i=>i.id!==hit.id);if(selId===hit.id)selId=null;upd();showToast('집기 삭제됨');}
  });
  document.getElementById('btnApplyHall').addEventListener('click',()=>{
    hallW=Math.max(5,Math.min(200,+document.getElementById('hallW').value||30));
    hallH=Math.max(5,Math.min(200,+document.getElementById('hallH').value||20));
    document.getElementById('hallW').value=hallW; document.getElementById('hallH').value=hallH;
    calcScale();resizeCanvas();updateSI();redraw();showToast(`홀 크기: ${hallW}×${hallH}m`);
  });
  document.getElementById('btnUndo').addEventListener('click',undo);
  document.getElementById('btnClearAll').addEventListener('click',()=>{if(!items.length)return;savH();items=[];selId=null;upd();showToast('전체 삭제됨');});
  document.getElementById('btnDownloadPNG').addEventListener('click',dlPNG);
  document.getElementById('btnRot90').addEventListener('click',()=>rotS(90));
  document.getElementById('btnRot45').addEventListener('click',()=>rotS(45));
  document.getElementById('btnDelSel').addEventListener('click',delS);
  document.addEventListener('keydown',e=>{
    if(state.currentStep!==4)return;
    if(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA')return;
    if((e.key==='Delete'||e.key==='Backspace')&&selId)delS();
    if((e.key==='r'||e.key==='R')&&selId)rotS(90);
    if(e.key==='Escape'){selId=null;upd();}
  });
  [{type:'screen',x:11,y:.5},{type:'stage',x:10,y:1.2},{type:'roundtable',x:3,y:6},{type:'roundtable',x:8,y:6},{type:'roundtable',x:13,y:6},{type:'roundtable',x:18,y:6},{type:'roundtable',x:3,y:11},{type:'roundtable',x:8,y:11},{type:'roundtable',x:13,y:11},{type:'reception',x:12,y:17.5},{type:'photozone',x:.5,y:.5}]
    .forEach(d=>items.push({id:++idCtr,type:d.type,x:d.x,y:d.y,rot:0}));
  if(state.selectedVenue) document.getElementById('simVenueName').textContent=state.selectedVenue.name;
  calcScale();resizeCanvas();updateSI();upd();
  window.addEventListener('resize',()=>{if(state.currentStep===4){calcScale();resizeCanvas();redraw();}});
}
function cpos(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/scale,y:(e.clientY-r.top)/scale};}
function sn(v){return Math.round(v*4)/4;}
function hitT(pos){
  for(let i=items.length-1;i>=0;i--){
    const it=items[i],p=PIECES[it.type],cx=it.x+p.w/2,cy=it.y+p.h/2;
    const rad=-it.rot*Math.PI/180,dx=pos.x-cx,dy=pos.y-cy;
    const lx=dx*Math.cos(rad)-dy*Math.sin(rad),ly=dx*Math.sin(rad)+dy*Math.cos(rad);
    if(Math.abs(lx)<=p.w/2+.1&&Math.abs(ly)<=p.h/2+.1)return it;
  }
  return null;
}
function calcScale(){const w=document.getElementById('canvasWrap');scale=Math.min((w.clientWidth-80)/hallW,(w.clientHeight-60)/hallH,42);scale=Math.max(scale,8);document.getElementById('scaleDisplay').textContent=(1/scale).toFixed(2);}
function resizeCanvas(){canvas.width=Math.round(hallW*scale);canvas.height=Math.round(hallH*scale);document.getElementById('canvasLbl').textContent=`${hallW}m × ${hallH}m`;}
function updateSI(){document.getElementById('btmSize').textContent=`${hallW} × ${hallH} m`;document.getElementById('btmArea').textContent=(hallW*hallH).toLocaleString()+' ㎡';}
function upd(){updCnt();updPP();redraw();}
function updCnt(){
  const cnt={};let s=0,a=0;
  items.forEach(it=>{cnt[it.type]=(cnt[it.type]||0)+1;const p=PIECES[it.type];s+=p.seats;a+=p.w*p.h;});
  Object.keys(PIECES).forEach(t=>{const el=document.getElementById('cnt-'+t);if(el)el.textContent=cnt[t]||0;});
  document.getElementById('statTotal').textContent=items.length;
  document.getElementById('statSeats').textContent=s+'석';
  document.getElementById('statOcc').textContent=Math.round(a/(hallW*hallH)*100)+'%';
}
function updPP(){
  const it=items.find(i=>i.id===selId);
  document.getElementById('ppEmpty').classList.toggle('hidden',!!it);
  document.getElementById('ppDetail').classList.toggle('hidden',!it);
  document.getElementById('ppActions').classList.toggle('hidden',!it);
  document.getElementById('btmSel').classList.toggle('hidden',!it);
  if(it){const p=PIECES[it.type];document.getElementById('ppName').textContent=p.name;document.getElementById('ppType').textContent=it.type;document.getElementById('ppX').textContent=it.x.toFixed(1)+'m';document.getElementById('ppY').textContent=it.y.toFixed(1)+'m';document.getElementById('ppRot').textContent=it.rot+'°';document.getElementById('ppSize').textContent=`${p.w}×${p.h}m`;document.getElementById('btmSelName').textContent=p.name;}
}
function rotS(d){const it=items.find(i=>i.id===selId);if(it){savH();it.rot=(it.rot+d)%360;upd();}}
function delS(){if(!selId)return;savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('집기 삭제됨');}
function savH(){history.push(JSON.stringify({items,selId}));if(history.length>30)history.shift();}
function undo(){if(!history.length){showToast('더 이상 되돌릴 수 없습니다');return;}const s=JSON.parse(history.pop());items=s.items;selId=s.selId;upd();showToast('실행 취소');}
function redraw(){
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#F7F5F0';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#E8E4DC';ctx.lineWidth=.5;
  for(let x=0;x<=hallW;x+=.5){ctx.beginPath();ctx.moveTo(x*scale,0);ctx.lineTo(x*scale,H);ctx.stroke();}
  for(let y=0;y<=hallH;y+=.5){ctx.beginPath();ctx.moveTo(0,y*scale);ctx.lineTo(W,y*scale);ctx.stroke();}
  ctx.strokeStyle='#D8D4CC';ctx.lineWidth=1;ctx.fillStyle='#C0BCBA';
  ctx.font=`${Math.max(7,scale*.35)}px DM Mono,monospace`;
  const st=Math.max(1,Math.floor(5/scale*10));
  for(let x=0;x<=hallW;x++){ctx.beginPath();ctx.moveTo(x*scale,0);ctx.lineTo(x*scale,H);ctx.stroke();if(x>0&&x<hallW&&x%st===0){ctx.textAlign='center';ctx.fillText(x+'m',x*scale,H-4);}}
  for(let y=0;y<=hallH;y++){ctx.beginPath();ctx.moveTo(0,y*scale);ctx.lineTo(W,y*scale);ctx.stroke();if(y>0&&y<hallH&&y%st===0){ctx.save();ctx.translate(6,y*scale);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText(y+'m',0,0);ctx.restore();}}
  ctx.strokeStyle='#4A4642';ctx.lineWidth=3;ctx.strokeRect(1.5,1.5,W-3,H-3);
  ctx.fillStyle='#C0BCBA';ctx.beginPath();ctx.moveTo(W/2,H-2);ctx.lineTo(W/2-5,H-8);ctx.lineTo(W/2+5,H-8);ctx.closePath();ctx.fill();
  ctx.font=`${Math.max(8,scale*.4)}px DM Mono,monospace`;ctx.textAlign='center';ctx.fillText('ENTRY',W/2,H-12);
  items.forEach(it=>drawIt(it));
}
function drawIt(it){
  const p=PIECES[it.type],pw=p.w*scale,ph=p.h*scale,cx=it.x*scale+pw/2,cy=it.y*scale+ph/2,sel=it.id===selId;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(it.rot*Math.PI/180);
  ctx.shadowColor='rgba(0,0,0,.12)';ctx.shadowBlur=5;ctx.shadowOffsetY=2;
  if(p.shape==='circle'){
    const r=pw/2;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();
    ctx.shadowColor='transparent';ctx.strokeStyle=sel?'#D4A843':p.stroke;ctx.lineWidth=sel?2.5:1.5;ctx.stroke();
    for(let i=0;i<p.seats;i++){const a=(i/p.seats)*Math.PI*2-Math.PI/2;ctx.save();ctx.translate(Math.cos(a)*(r+8),Math.sin(a)*(r+8));ctx.rotate(a+Math.PI/2);ctx.beginPath();ctx.roundRect(-5,-4,10,8,2);ctx.fillStyle='#C8BCA8';ctx.fill();ctx.strokeStyle='#A09080';ctx.lineWidth=.8;ctx.stroke();ctx.restore();}
    ctx.fillStyle='#706050';ctx.font=`bold ${Math.max(8,pw*.18)}px DM Mono,monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('T·'+p.seats,0,0);
  } else {
    ctx.beginPath();ctx.roundRect(-pw/2,-ph/2,pw,ph,3);ctx.fillStyle=p.color;ctx.fill();
    ctx.shadowColor='transparent';ctx.strokeStyle=sel?'#D4A843':p.stroke;ctx.lineWidth=sel?2.5:1.5;ctx.stroke();
    if(it.type==='stage'){ctx.strokeStyle=p.stroke+'88';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.strokeRect(-pw/2+7,-ph/2+7,pw-14,ph-14);ctx.setLineDash([]);}
    if(it.type==='screen'){ctx.fillStyle='#2A3F6F';ctx.beginPath();ctx.roundRect(-pw/2+3,-ph/2+2,pw-6,ph-4,2);ctx.fill();}
    if(it.type==='chairrow'){const cw=pw/p.seats;for(let i=0;i<p.seats;i++){ctx.beginPath();ctx.roundRect(-pw/2+cw*i+1,-ph/2+1,cw-2,ph-2,2);ctx.fillStyle='#C0B4A0';ctx.fill();}}
    if(it.type==='longtable'){const sp=pw/4;for(let i=0;i<4;i++){const lx=-pw/2+sp*i+sp/2;ctx.beginPath();ctx.roundRect(lx-7,-ph/2-9,14,8,2);ctx.fillStyle='#C8BCA8';ctx.fill();ctx.strokeStyle='#A09080';ctx.lineWidth=.8;ctx.stroke();ctx.beginPath();ctx.roundRect(lx-7,ph/2+1,14,8,2);ctx.fillStyle='#C8BCA8';ctx.fill();ctx.strokeStyle='#A09080';ctx.lineWidth=.8;ctx.stroke();}}
    if(it.type==='photozone'){ctx.strokeStyle=p.stroke+'60';ctx.lineWidth=.8;ctx.setLineDash([3,3]);for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(-pw/2+pw/3*i,-ph/2);ctx.lineTo(-pw/2+pw/3*i,ph/2);ctx.stroke();}ctx.setLineDash([]);}
    const LBL={stage:'무대',screen:'SCREEN',podium:'POD',longtable:'T·8',chairrow:'×'+p.seats,reception:'RECEPTION',photozone:'PHOTO'};
    ctx.fillStyle='#504840';ctx.font=`600 ${Math.max(8,Math.min(pw,ph)*.2)}px Pretendard,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(LBL[it.type]||'',0,0);
  }
  if(sel){ctx.strokeStyle='#D4A843';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,pw/2+5,0,Math.PI*2);ctx.stroke();}else{ctx.strokeRect(-pw/2-4,-ph/2-4,pw+8,ph+8);}ctx.setLineDash([]);}
  ctx.restore();
}
function dlPNG(){
  const pad=60,tH=44,ec=document.createElement('canvas'),dpr=2;
  ec.width=(canvas.width+pad*2)*dpr;ec.height=(canvas.height+pad*2+tH)*dpr;
  const ex=ec.getContext('2d');ex.scale(dpr,dpr);
  ex.fillStyle='#fff';ex.fillRect(0,0,ec.width,ec.height);
  ex.fillStyle='#1A1C1E';ex.fillRect(0,0,canvas.width+pad*2,tH);
  ex.fillStyle='#fff';ex.font='bold 13px Pretendard,sans-serif';ex.textAlign='left';ex.fillText('UNIQUEPLAN — 행사장 배치도',pad,20);
  if(state.selectedVenue){ex.fillStyle='#9A9690';ex.font='10px DM Mono,monospace';ex.fillText(state.selectedVenue.name,pad,35);}
  ex.fillStyle='#9A9690';ex.font='10px DM Mono,monospace';ex.textAlign='right';ex.fillText(`${hallW}m×${hallH}m · ${new Date().toLocaleDateString('ko-KR')}`,canvas.width+pad,20);
  ex.drawImage(canvas,pad,tH+pad);
  ex.strokeStyle='#E0DDD8';ex.lineWidth=1;ex.strokeRect(pad-8,tH+pad-8,canvas.width+16,canvas.height+16);
  const cnt={};items.forEach(i=>{cnt[i.type]=(cnt[i.type]||0)+1;});
  let lx=pad;const ly=tH+pad+canvas.height+20;
  Object.entries(cnt).forEach(([t,n])=>{ex.fillStyle=PIECES[t].color;ex.fillRect(lx,ly,13,9);ex.strokeStyle=PIECES[t].stroke;ex.lineWidth=1;ex.strokeRect(lx,ly,13,9);ex.fillStyle='#5C5A57';ex.font='9px DM Mono,monospace';ex.textAlign='left';ex.fillText(`${PIECES[t].name}×${n}`,lx+17,ly+8);lx+=100;});
  const a=document.createElement('a');a.download=`uniqueplan_배치도_${Date.now()}.png`;a.href=ec.toDataURL('image/png');a.click();
  showToast('배치도 PNG 다운로드 완료');
}
function drawPalIcons(){
  const IC={
    stage:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="9" width="28" height="16" rx="2" fill="#C8C0A8" stroke="#7A7260" stroke-width="1.5"/><rect x="6" y="12" width="22" height="10" rx="1" fill="none" stroke="#7A7260" stroke-dasharray="3 2" stroke-width="1"/><text x="17" y="20" text-anchor="middle" font-size="6" fill="#7A7260" font-family="monospace">STAGE</text></svg>`,
    screen:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="13" width="28" height="8" rx="2" fill="#4A6FA5" stroke="#2D4F85" stroke-width="1.5"/><rect x="5" y="15" width="24" height="4" rx="1" fill="#2A3F6F"/></svg>`,
    podium:`<svg viewBox="0 0 34 34" fill="none"><rect x="12" y="9" width="10" height="16" rx="2" fill="#8B7355" stroke="#6B5335" stroke-width="1.5"/></svg>`,
    roundtable:`<svg viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="9" fill="#E8DFD0" stroke="#B0A090" stroke-width="1.5"/><circle cx="17" cy="6" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="17" cy="28" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="6" cy="17" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="28" cy="17" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/></svg>`,
    longtable:`<svg viewBox="0 0 34 34" fill="none"><rect x="5" y="12" width="24" height="10" rx="2" fill="#E8DFD0" stroke="#B0A090" stroke-width="1.5"/><rect x="7" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="14.5" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="22" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="7" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="14.5" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="22" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/></svg>`,
    chairrow:`<svg viewBox="0 0 34 34" fill="none"><rect x="2" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="10" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="18" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="26" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/></svg>`,
    reception:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="13" width="28" height="10" rx="2" fill="#B8C4D0" stroke="#7090B0" stroke-width="1.5"/><text x="17" y="20" text-anchor="middle" font-size="5" fill="#507090" font-family="monospace">RECEPTION</text></svg>`,
    photozone:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="5" width="28" height="24" rx="2" fill="#D8C8E8" stroke="#9880C0" stroke-width="1.5"/><line x1="14" y1="5" x2="14" y2="29" stroke="#9880C0" stroke-width=".8" stroke-dasharray="2 2"/><line x1="20" y1="5" x2="20" y2="29" stroke="#9880C0" stroke-width=".8" stroke-dasharray="2 2"/><circle cx="17" cy="17" r="4" fill="none" stroke="#9880C0" stroke-width="1.2"/></svg>`,
  };
  Object.entries(IC).forEach(([t,s])=>{ const el=document.getElementById('icon-'+t); if(el)el.innerHTML=s; });
}

/* ════════════════════════════════════════════════════════
   7. 토스트 & 앱 시작
════════════════════════════════════════════════════════ */
let _tt;
function showToast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(_tt); _tt=setTimeout(()=>t.classList.remove('show'),2400); }

checkReq();
