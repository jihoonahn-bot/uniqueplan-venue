/* ═══════════════════════════════════════════════════════
   UNIQUEPLAN — main.js
   index.html (새 버전) 에 맞춘 완전한 버전
   · view1 : 일반 페이지 스크롤, btm-bar fixed
   · view2 : 장소 추천 (목업 + AI 분석)
   · view4 : 배치 시뮬레이션
═══════════════════════════════════════════════════════ */
'use strict';

/* ─────────────── 목업 DB ─────────────── */
const MOCK_DB = [
  {
    id:'m1', name:'그랜드 하얏트 서울 — 그랜드볼룸',
    type:'특급호텔 연회장', base_score:96,
    location:'서울 용산구 소월로 322', price_range:'1,800~2,500만원',
    summary:'VIP 행사에 최적화된 프리미엄 연회 공간입니다. 한강 조망과 4K 레이저 AV, 상주 케이터링팀이 완벽한 행사를 지원하며 전용 주차 350대를 보유합니다.',
    tags:['vip','주차여유','품격','특급'],
    pros:[
      {icon:'✦',title:'VIP 전용 동선',desc:'전용 엔트런스와 대기실로 임원급 의전에 최적입니다.'},
      {icon:'✦',title:'프리미엄 AV',desc:'4K 레이저 프로젝터 3대 + 상주 AV 엔지니어가 제공됩니다.'},
      {icon:'✦',title:'대형 전용 주차',desc:'지하 자주식 350대, 발렛 서비스 옵션 가능합니다.'},
    ],
    cautions:[{icon:'△',title:'성수기 예약',desc:'3~5월·10~11월은 최소 3개월 전 예약이 필요합니다.'}],
    specs:{capacity:'최대 500명',area:'약 1,200㎡',ceiling:'천고 6.5m',parking:'자주식 350대',av:'상주 AV팀+4K',catering:'내부 전담팀'},
  },
  {
    id:'m2', name:'코엑스 — 그랜드볼룸',
    type:'전문 컨벤션센터', base_score:91,
    location:'서울 강남구 영동대로 513', price_range:'1,200~1,800만원',
    summary:'삼성역 직결 접근성과 최대 800명을 수용하는 넓은 공간이 강점입니다. 홀 분할 구성으로 행사 규모에 유연하게 대응할 수 있습니다.',
    tags:['접근성','대형','컨벤션','강남'],
    pros:[
      {icon:'✦',title:'삼성역 직결',desc:'지하철 2·9호선 도보 0분, 전국 최고 접근성입니다.'},
      {icon:'✦',title:'모듈형 홀',desc:'2~4개 구역 분할로 유연한 운영이 가능합니다.'},
    ],
    cautions:[{icon:'△',title:'별도 케이터링',desc:'외부 업체 선정 및 사전 협의 시간이 필요합니다.'}],
    specs:{capacity:'최대 800명',area:'약 2,000㎡',ceiling:'천고 8m',parking:'공영 2,000대',av:'자체 AV팀',catering:'제휴 업체 다수'},
  },
  {
    id:'m3', name:'롯데호텔 서울 — 크리스탈볼룸',
    type:'특급호텔 연회장', base_score:88,
    location:'서울 중구 을지로 30', price_range:'1,400~2,000만원',
    summary:'명동·시청 도심 중심부로 어디서든 접근이 용이합니다. 클래식한 호텔 분위기와 자체 조명 시스템으로 격식 있는 행사에 적합합니다.',
    tags:['도심','품격','특급','뒷풀이'],
    pros:[
      {icon:'✦',title:'도심 최중심',desc:'을지로입구역 바로 인접, 전국 어디서든 접근 용이합니다.'},
      {icon:'✦',title:'자체 조명',desc:'핀조명·무드·LED 무빙 전 카테고리 자체 보유합니다.'},
    ],
    cautions:[{icon:'△',title:'주차 제한',desc:'도심 특성상 주차 150대로 제한적입니다.'}],
    specs:{capacity:'최대 350명',area:'약 750㎡',ceiling:'천고 5m',parking:'자주식 150대',av:'상주 AV팀',catering:'호텔 자체'},
  },
  {
    id:'m4', name:'파르나스 타워 — 더그랜드볼룸',
    type:'프리미엄 오피스 연회장', base_score:84,
    location:'서울 강남구 테헤란로 521', price_range:'900~1,400만원',
    summary:'테헤란로 38층 전망 연회장으로 강남 파노라마 뷰가 탁월합니다. B2B 기업 행사에 최적화된 입지입니다.',
    tags:['강남','전망','b2b'],
    pros:[{icon:'✦',title:'강남 파노라마',desc:'38층에서 강남 도심 전경 배경 연출 가능합니다.'}],
    cautions:[{icon:'△',title:'인원 제한',desc:'최대 180명으로 대규모 행사에는 부적합합니다.'}],
    specs:{capacity:'최대 180명',area:'약 400㎡',ceiling:'천고 3.8m',parking:'건물 내 200대',av:'기본 구비',catering:'제휴 케이터링'},
  },
  {
    id:'m5', name:'세빛섬 — 가빛홀',
    type:'특수 이벤트홀', base_score:79,
    location:'서울 서초구 올림픽대로 683-1', price_range:'1,000~1,600만원',
    summary:'한강 수상 위의 독창적 공간으로 강렬한 차별화가 필요한 론칭·시상식에 특히 강한 인상을 남깁니다.',
    tags:['차별화','한강','특수'],
    pros:[{icon:'✦',title:'한국 유일 수상홀',desc:'강렬한 차별화로 참석자들에게 오래 기억됩니다.'}],
    cautions:[{icon:'△',title:'접근성 제한',desc:'대중교통이 불편하며 주차 공간이 제한적입니다.'}],
    specs:{capacity:'최대 250명',area:'약 500㎡',ceiling:'천고 4m',parking:'인근 공영',av:'기본 음향·조명',catering:'자체 레스토랑'},
  },
];

/* ─────────────── 앱 상태 ─────────────── */
const APP = {
  step: 1,
  formData: null,
  requestText: '',
  parsedRequest: null,
  selectedVenue: null,
};

function getCustomVenues() {
  try { return JSON.parse(localStorage.getItem('uq_venues') || '[]'); } catch { return []; }
}
function saveCustomVenues(arr) { localStorage.setItem('uq_venues', JSON.stringify(arr)); }

/* ═══════════════════════════════════════
   라우터
═══════════════════════════════════════ */
function goTo(step) {
  APP.step = step;

  // 모든 view 숨기기
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view' + step);
  if (view) view.classList.add('active');

  // 헤더/스텝바 테마
  const dark = (step === 4);
  document.getElementById('appHeader').classList.toggle('dark', dark);
  document.getElementById('stepBar').classList.toggle('dark', dark);
  document.getElementById('hdrInfo').classList.toggle('hidden', dark);
  document.getElementById('simToolbar').classList.toggle('hidden', !dark);
  document.getElementById('simStatus').classList.toggle('hidden', !dark);

  // btm-bar: step1에서만 표시
  const btm = document.querySelector('.btm-bar');
  if (btm) btm.style.display = (step === 1) ? 'flex' : 'none';

  // 스텝 인디케이터
  [1,2,3,4,5].forEach(n => {
    const el = document.getElementById('s' + n + 'tab');
    if (!el) return;
    el.className = 'step' + (n < step ? ' done' : n === step ? ' active' : '');
    el.querySelector('.snum').textContent = n < step ? '✓' : String(n);
  });

  if (!dark) document.getElementById('hdrInfo').textContent = `v1.0 · STEP ${step}/5`;
  if (step === 4) initSim();

  // 페이지 상단으로 스크롤
  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════
   STEP 1 — 폼
═══════════════════════════════════════ */
let vipOn = false;

document.getElementById('vipTog').addEventListener('click', () => {
  vipOn = !vipOn;
  document.getElementById('vipTog').classList.toggle('on', vipOn);
  document.getElementById('vipStatus').textContent = vipOn ? 'YES' : 'NO';
  updateReqCount();
});

document.getElementById('budgetSlider').addEventListener('input', updateBudgetLabel);
function updateBudgetLabel() {
  const v = +document.getElementById('budgetSlider').value;
  document.getElementById('budgetDisplay').textContent =
    v <= 100 ? (v * 100).toLocaleString() + '만원' :
    v <= 150 ? ((v - 100) / 10).toFixed(1) + '억원' : '2억원+';
}
updateBudgetLabel();

function getBudgetNum() {
  const v = +document.getElementById('budgetSlider').value;
  return v <= 100 ? v * 1e6 : v <= 150 ? ((v - 100) / 10) * 1e8 : 2e8;
}

document.getElementById('eventTypes').addEventListener('click', e => {
  if (e.target.classList.contains('tbtn2')) e.target.classList.toggle('sel');
});

document.querySelectorAll('.q-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll(`input[name="${opt.querySelector('input').name}"]`)
      .forEach(r => r.closest('.q-opt').classList.remove('sel'));
    opt.classList.add('sel');
  });
});

document.querySelectorAll('.cbi').forEach(cb =>
  cb.addEventListener('click', () => cb.classList.toggle('chk'))
);

document.getElementById('mealTog').addEventListener('click', e => {
  if (e.target.classList.contains('meal-btn')) {
    document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('sel'));
    e.target.classList.add('sel');
  }
});

// 글자 수 카운터
const reqTA = document.getElementById('clientRequest');
const charEl = document.getElementById('charCount');
if (reqTA && charEl) {
  reqTA.addEventListener('input', () => { charEl.textContent = reqTA.value.length; });
}

function updateReqCount() {
  const ok = [
    !!document.getElementById('region').value,
    !!document.getElementById('attendees').value,
    !!document.getElementById('eventDate').value,
  ];
  document.getElementById('reqCount').textContent = ok.filter(Boolean).length + ' / 3';
}
['region','attendees','eventDate'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', updateReqCount), el.addEventListener('input', updateReqCount);
});

function collectForm() {
  return {
    required: {
      region:         document.getElementById('region').value || '(지역 미입력)',
      attendees:      +document.getElementById('attendees').value || 100,
      event_date:     document.getElementById('eventDate').value || '미정',
      event_time:     document.getElementById('eventTime').value || '10:00',
      vip_attendance: vipOn,
      budget_krw:     getBudgetNum(),
    },
    optional: {
      event_types:    [...document.querySelectorAll('#eventTypes .tbtn2.sel')].map(b => b.dataset.v),
      event_theme:    document.getElementById('eventTheme')?.value || null,
      screen_quality: document.querySelector('input[name="screen"]:checked')?.value || null,
      audio_quality:  document.querySelector('input[name="audio"]:checked')?.value || null,
      accommodation:  +document.getElementById('accommodation').value || 0,
      parking_spots:  +document.getElementById('parking').value || 0,
      meal_included:  document.querySelector('.meal-btn.sel')?.dataset.v || '미포함',
      lighting:       [...document.querySelectorAll('#lighting .cbi.chk')].map(c => c.dataset.v),
    },
    client_request: document.getElementById('clientRequest')?.value?.trim() || '',
    meta: { submitted_at: new Date().toISOString() },
  };
}

// ★ 다음 단계 버튼 — 항상 통과
document.getElementById('btnStep1Next').addEventListener('click', () => {
  APP.formData    = collectForm();
  APP.requestText = APP.formData.client_request;
  APP.parsedRequest = null;
  goTo(2);
  buildCondPills();
  runRecommendation();
});

/* ═══════════════════════════════════════
   STEP 2 — 조건 필
═══════════════════════════════════════ */
document.getElementById('btnBack').addEventListener('click', () => goTo(1));
document.getElementById('btnRetry').addEventListener('click', runRecommendation);

function buildCondPills() {
  const r = APP.formData.required;
  const o = APP.formData.optional;
  const pills = [
    ['지역', r.region],
    ['인원', r.attendees + '명'],
  ];
  if (r.event_date !== '미정') pills.push(['일시', r.event_date]);
  if (r.vip_attendance) pills.push(['VIP', '참석']);
  const b = r.budget_krw;
  pills.push(['예산', b >= 1e8 ? (b/1e8).toFixed(1)+'억원' : (b/1e4).toLocaleString()+'만원']);
  if (o.event_types?.length) pills.push(['유형', o.event_types[0]]);
  if (o.meal_included !== '미포함') pills.push(['식사', o.meal_included]);

  const reqTag = APP.requestText
    ? `<span style="margin-left:auto;padding:3px 10px;background:#EEF2FF;color:#4338CA;border-radius:4px;font-size:10px;font-family:var(--mono);border:1px solid #C7D2FE">✦ 요청사항 분석 중</span>`
    : `<span style="margin-left:auto;padding:3px 10px;background:#F0EFE9;color:#ABA99F;border-radius:4px;font-size:10px;font-family:var(--mono)">◈ 목업 모드</span>`;

  document.getElementById('condBar').innerHTML =
    pills.map(([k,v]) => `<div class="pill"><span class="pill-k">${k}</span>${v}</div>`).join('') + reqTag;
}

/* ═══════════════════════════════════════
   STEP 2 — 추천 실행 (AI 분석 + 목업)
═══════════════════════════════════════ */
async function runRecommendation() {
  document.getElementById('ldState').style.display = 'flex';
  document.getElementById('errState').classList.remove('vis');
  document.getElementById('results').classList.remove('vis');

  // 로딩 스텝 애니메이션
  ['ls1','ls2','ls3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('vis','done');
    setTimeout(() => { el.classList.add('vis'); setTimeout(() => el.classList.add('done'), 400); }, 300 + i * 600);
  });

  // 요청사항 텍스트가 있으면 AI 분석 시도
  if (APP.requestText && APP.requestText.length > 10) {
    APP.parsedRequest = await analyzeRequest(APP.requestText);
  } else {
    APP.parsedRequest = null;
  }

  setTimeout(() => {
    document.getElementById('ldState').style.display = 'none';
    const venues = scoreAndRank();
    renderVenues(venues);
  }, 2200);
}

/* ── 요청사항 AI 분석 ── */
async function analyzeRequest(text) {
  const SYS = `클라이언트의 자유 서술 요청을 분석하여 아래 JSON만 출력하세요. 마크다운 없이 순수 JSON만.
{"keywords":["핵심 키워드 3~6개"],"requirements":["명확한 요구사항 2~4개"],"concerns":["우려사항 1~3개"],"summary":"한 문장 요약"}`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 400,
        system: SYS,
        messages: [{ role: 'user', content: `요청사항:\n"${text}"` }],
      }),
    });
    if (!res.ok) throw new Error('API 오류');
    const json = await res.json();
    const raw = json.content[0].text.trim().replace(/^```json|^```|```$/gm,'').trim();
    return JSON.parse(raw);
  } catch {
    return fallbackParse(text);
  }
}

function fallbackParse(text) {
  const t = text.toLowerCase();
  const keywords = [], requirements = [], concerns = [];
  if (t.includes('주차')) {
    keywords.push('주차');
    const m = text.match(/주차\s*(\d+)대/);
    requirements.push(m ? `주차 ${m[1]}대 이상` : '충분한 주차 공간 필요');
    if (t.includes('불편')) concerns.push('이전 행사 주차 불편 경험');
  }
  if (t.includes('대표') || t.includes('vip') || t.includes('품격')) {
    keywords.push('VIP품격'); requirements.push('품격 있는 VIP 공간 필요');
  }
  if (t.includes('뒷풀이') || t.includes('식사') || t.includes('f&b')) {
    keywords.push('뒷풀이'); requirements.push('동일 건물 내 식음 공간 연계');
  }
  if (t.includes('강남')) keywords.push('강남권');
  if (t.includes('접근') || t.includes('교통')) { keywords.push('접근성'); requirements.push('대중교통 접근성 우수'); }
  if (!keywords.length) keywords.push('행사 품질');
  if (!requirements.length) requirements.push('요청사항 반영');
  return { keywords, requirements, concerns, summary: text.slice(0, 60) + (text.length > 60 ? '...' : '') };
}

/* ── 점수 계산 ── */
function scoreAndRank() {
  const r = APP.formData.required;
  const p = APP.parsedRequest;
  const all = [
    ...MOCK_DB,
    ...getCustomVenues().map((v,i) => ({ ...v, id:'c'+i, base_score:82, tags:[] }))
  ];
  const scored = all.map(venue => {
    let score = venue.base_score;
    const notes = [];
    if (r.vip_attendance && (venue.tags?.includes('vip') || venue.type?.includes('특급'))) { score += 3; }
    if (r.attendees) {
      const cap = parseInt((venue.specs?.capacity||'9999').replace(/[^0-9]/g,''));
      if (r.attendees > cap) score -= 18;
    }
    if (p) {
      const kws = (p.keywords||[]).map(k => k.toLowerCase());
      if (kws.some(k=>k.includes('주차')) && venue.tags?.includes('주차여유')) { score += 6; notes.push('✅ 넉넉한 주차 보유 (요청 반영)'); }
      if (kws.some(k=>k.includes('vip')||k.includes('품격')) && (venue.tags?.includes('vip')||venue.tags?.includes('품격'))) { score += 5; notes.push('✅ VIP 행사에 최적화된 시설'); }
      if (kws.some(k=>k.includes('뒷풀이')) && venue.tags?.includes('뒷풀이')) { score += 4; notes.push('✅ 동일 건물 내 식음 공간 연계 가능'); }
      if (kws.some(k=>k.includes('강남')) && venue.tags?.includes('강남')) { score += 3; notes.push('✅ 강남권 위치'); }
      if (kws.some(k=>k.includes('접근')) && venue.tags?.includes('접근성')) { score += 4; notes.push('✅ 대중교통 접근성 우수'); }
    }
    return { ...venue, match_percent: Math.min(98, Math.max(58, Math.round(score))), matchNotes: notes };
  });
  return scored.sort((a,b) => b.match_percent - a.match_percent)
    .slice(0, 5).map((v,i) => ({ ...v, rank: i+1 }));
}

/* ── 요청사항 분석 박스 ── */
function renderRequestAnalysis() {
  const old = document.getElementById('reqAnalysisBox');
  if (old) old.remove();
  if (!APP.requestText || APP.requestText.length < 10) return;

  const p = APP.parsedRequest;
  const box = document.createElement('div');
  box.id = 'reqAnalysisBox';
  box.className = 'request-analysis-box';

  const tagsHTML = (p?.keywords||[]).map(k => `<span class="ra-tag">${k}</span>`).join('');
  const reqsHTML = (p?.requirements||[]).map(r => `<li style="margin-bottom:4px;font-size:12px;color:#4338CA">${r}</li>`).join('');

  box.innerHTML = `
    <div class="ra-header">
      <div class="ra-icon">✦</div>
      <div>
        <div class="ra-title">AI 요청사항 분석 완료</div>
        <div class="ra-subtitle">${p?.summary || '핵심 요구사항이 추천에 반영되었습니다'}</div>
      </div>
    </div>
    <div class="ra-original">"${APP.requestText}"</div>
    ${tagsHTML ? `<div style="font-size:10px;font-weight:600;color:#6366F1;font-family:var(--mono);margin-bottom:8px;letter-spacing:.06em;text-transform:uppercase">추출된 키워드</div><div class="ra-tags">${tagsHTML}</div>` : ''}
    ${reqsHTML ? `<ul style="margin-top:10px;padding-left:16px">${reqsHTML}</ul>` : ''}`;

  const results = document.getElementById('results');
  results.parentNode.insertBefore(box, results);
}

/* ── 장소 카드 렌더링 ── */
function renderVenues(venues) {
  document.getElementById('resultCount').textContent = venues.length;
  const list = document.getElementById('venueList');
  list.innerHTML = '';

  venues.forEach(v => {
    const rk = Math.min(v.rank, 5);
    const card = document.createElement('div');
    card.className = `vc rk${rk}`;

    const prosH = (v.pros||[]).map(p =>
      `<div class="ri"><div class="ri-icon pro">${p.icon}</div><div class="ri-text"><strong>${p.title}</strong><br>${p.desc}</div></div>`
    ).join('');
    const cauH = (v.cautions||[]).map(c =>
      `<div class="ri"><div class="ri-icon warn">${c.icon}</div><div class="ri-text"><strong>${c.title}</strong><br>${c.desc}</div></div>`
    ).join('');
    const SL = {capacity:'수용인원',area:'면적',ceiling:'천고',parking:'주차',av:'AV',catering:'케이터링'};
    const specH = Object.entries(v.specs||{}).map(([k,val]) =>
      `<div class="spec"><div class="spec-k">${SL[k]||k}</div><div class="spec-v">${val}</div></div>`
    ).join('');

    const matchBanner = v.matchNotes?.length ? `
      <div class="req-match-banner">
        <span>🎯</span>
        <div><strong>요청사항 반영</strong><br>${v.matchNotes.join(' · ')}</div>
      </div>` : '';

    card.innerHTML = `
      <div class="vc-main">
        <div class="rnk">${v.rank}</div>
        <div>
          <div class="vc-top">
            <div class="vname">${v.name}</div>
            <div class="vtags">
              <span class="vtag vtag-type">${v.type||''}</span>
              ${rk===1?'<span class="vtag vtag-top">★ BEST</span>':''}
            </div>
          </div>
          <div class="vsum">${v.summary}</div>
          <div class="match-row">
            <span class="match-lbl">매칭률</span>
            <div class="match-bar"><div class="match-fill" data-pct="${v.match_percent}"></div></div>
            <span class="match-pct">${v.match_percent}%</span>
          </div>
        </div>
        <div class="vc-right">
          <div><div class="vprice-lbl">예상 대관료</div><div class="vprice-val">${v.price_range||'문의'}</div></div>
          <button class="btn-sel">선택하기</button>
        </div>
      </div>
      ${matchBanner}
      <div class="dp">
        <div class="dp-inner">
          <div class="dp-grid">
            <div>
              <div class="dp-sec-ttl">추천 이유</div>
              <div class="reasons">${prosH}</div>
              ${cauH?`<div style="margin-top:14px"><div class="dp-sec-ttl">주의사항</div><div class="reasons">${cauH}</div></div>`:''}
            </div>
            <div>
              <div class="dp-sec-ttl">장소 스펙</div>
              <div class="specs-g">${specH}</div>
              <div class="spec-loc">📍 ${v.location||''}</div>
            </div>
          </div>
          <div class="dp-footer">
            <div class="dp-note">이 장소로 배치 시뮬레이션을 시작합니다</div>
            <button class="btn-proceed">이 장소로 배치 시뮬레이션 →</button>
          </div>
        </div>
      </div>`;

    card.querySelector('.vc-main').addEventListener('click', () => toggleDp(card));
    card.querySelector('.btn-sel').addEventListener('click', e => { e.stopPropagation(); pickVenue(card, v); });
    card.querySelector('.btn-proceed').addEventListener('click', () => { pickVenue(card, v); goToSim(v); });
    list.appendChild(card);
  });

  renderRequestAnalysis();
  document.getElementById('results').classList.add('vis');

  requestAnimationFrame(() => setTimeout(() => {
    document.querySelectorAll('.match-fill').forEach(b => { b.style.width = b.dataset.pct + '%'; });
  }, 100));
}

function toggleDp(card) {
  const dp = card.querySelector('.dp'), was = dp.classList.contains('open');
  document.querySelectorAll('.dp.open').forEach(d => d.classList.remove('open'));
  if (!was) dp.classList.add('open');
}
function pickVenue(card, v) {
  document.querySelectorAll('.vc').forEach(c => c.classList.remove('sel'));
  card.classList.add('sel');
  APP.selectedVenue = v;
  document.querySelectorAll('.dp.open').forEach(d => d.classList.remove('open'));
  card.querySelector('.dp').classList.add('open');
}
function goToSim(v) { APP.selectedVenue = v; goTo(4); }

/* ═══════════════════════════════════════
   어드민 (Ctrl+Shift+A / 로고 5번 클릭)
═══════════════════════════════════════ */
let tapN = 0, tapT = null;
document.querySelector('.logo').addEventListener('click', () => {
  tapN++; clearTimeout(tapT); tapT = setTimeout(() => tapN = 0, 2000);
  if (tapN >= 5) { tapN = 0; openAdmin(); }
});
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); openAdmin(); }
});

function openAdmin() {
  if (document.getElementById('admPanel')) return;
  const panel = document.createElement('div');
  panel.id = 'admPanel';
  panel.innerHTML = `<style>
    #admPanel{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}
    .am{background:#fff;border-radius:12px;width:780px;max-width:95vw;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.2);overflow:hidden}
    .am-hdr{padding:18px 24px;border-bottom:1px solid #E5E3DC;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
    .am-hdr h2{font-size:15px;font-weight:700}.am-hdr p{font-size:11px;color:#9A9690;margin-top:2px}
    .am-close{border:1.5px solid #E5E3DC;background:none;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:13px;color:#9A9690}
    .am-tabs{display:flex;padding:0 24px;border-bottom:1px solid #E5E3DC;flex-shrink:0}
    .am-tab{padding:10px 14px;font-size:12px;font-weight:600;color:#ABA99F;border:none;border-bottom:2px solid transparent;background:none;cursor:pointer;font-family:'Pretendard',sans-serif}
    .am-tab.on{color:#1A1A1A;border-bottom-color:#1A1A1A}
    .am-body{flex:1;overflow-y:auto;padding:22px 24px}
    .tp{display:none}.tp.on{display:block}
    .fg label{font-size:11px;font-weight:600;color:#6B6860;display:block;margin-bottom:5px}
    .fg input,.fg select,.fg textarea{width:100%;padding:8px 11px;font-size:13px;font-family:'Pretendard',sans-serif;border:1.5px solid #E5E3DC;border-radius:6px;outline:none;background:#F9F8F5;margin-bottom:10px}
    .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:#1A1A1A;background:#fff}
    .fg textarea{resize:vertical;min-height:68px}
    .gr2{display:grid;grid-template-columns:1fr 1fr;gap:11px}
    .gr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px}
    .sec{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#ABA99F;font-family:'DM Mono',monospace;margin:18px 0 10px;padding-bottom:7px;border-bottom:1px solid #E5E3DC}
    .savebtn{margin-top:16px;padding:11px 22px;background:#1A1A1A;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Pretendard',sans-serif}
    .vc-li{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#F9F8F5;border:1px solid #E5E3DC;border-radius:8px;margin-bottom:7px}
    .vc-li-name{font-size:13px;font-weight:700;margin-bottom:2px}
    .vc-li-meta{font-size:10px;color:#9A9690;font-family:'DM Mono',monospace}
    .delbtn{padding:5px 11px;border:1.5px solid #E5E3DC;background:none;border-radius:5px;font-size:11px;cursor:pointer;color:#ABA99F}
    .delbtn:hover{border-color:#C84B31;color:#C84B31}
  </style>
  <div class="am">
    <div class="am-hdr">
      <div><h2>⚙ 관리자 패널</h2><p>실제 장소 데이터 입력 · 등록 장소 관리 (Ctrl+Shift+A)</p></div>
      <button class="am-close" id="amClose">✕</button>
    </div>
    <div class="am-tabs">
      <button class="am-tab on" data-t="add">장소 추가</button>
      <button class="am-tab" data-t="list">등록된 장소</button>
    </div>
    <div class="am-body">
      <div class="tp on" id="tp-add">
        <div class="sec">기본 정보</div>
        <div class="gr2">
          <div class="fg"><label>장소명 *</label><input id="an" type="text" placeholder="예: 그랜드 인터컨티넨탈 파르나스"></div>
          <div class="fg"><label>장소 유형 *</label>
            <select id="at"><option value="">선택</option>
              <option>특급호텔 연회장</option><option>비즈니스호텔 연회장</option>
              <option>전문 컨벤션센터</option><option>프리미엄 오피스빌딩 연회장</option>
              <option>특수 이벤트홀</option><option>기타</option>
            </select>
          </div>
        </div>
        <div class="gr2">
          <div class="fg"><label>주소</label><input id="aloc" type="text" placeholder="서울 강남구 테헤란로 521"></div>
          <div class="fg"><label>예상 대관료</label><input id="apr" type="text" placeholder="1,200~1,800만원"></div>
        </div>
        <div class="fg"><label>한줄 요약</label><textarea id="asum" placeholder="추천 이유 2~3문장"></textarea></div>
        <div class="sec">장소 스펙</div>
        <div class="gr3">
          <div class="fg"><label>수용 인원</label><input id="sc" type="text" placeholder="최대 300명"></div>
          <div class="fg"><label>면적</label><input id="sa" type="text" placeholder="약 600㎡"></div>
          <div class="fg"><label>천고</label><input id="sh" type="text" placeholder="천고 5m"></div>
        </div>
        <div class="gr3">
          <div class="fg"><label>주차</label><input id="sp" type="text" placeholder="자주식 200대"></div>
          <div class="fg"><label>AV</label><input id="sv" type="text" placeholder="상주 AV팀 보유"></div>
          <div class="fg"><label>케이터링</label><input id="sk" type="text" placeholder="내부 케이터링 가능"></div>
        </div>
        <button class="savebtn" id="amSave">💾 장소 저장하기</button>
      </div>
      <div class="tp" id="tp-list"><div id="amList"></div></div>
    </div>
  </div>`;

  document.body.appendChild(panel);
  document.getElementById('amClose').addEventListener('click', closeAdmin);
  panel.addEventListener('click', e => { if (e.target === panel) closeAdmin(); });

  panel.querySelectorAll('.am-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.am-tab').forEach(t => t.classList.remove('on'));
      panel.querySelectorAll('.tp').forEach(p => p.classList.remove('on'));
      tab.classList.add('on');
      document.getElementById('tp-' + tab.dataset.t).classList.add('on');
      if (tab.dataset.t === 'list') renderAdmList();
    });
  });

  document.getElementById('amSave').addEventListener('click', () => {
    const name = document.getElementById('an').value.trim();
    const type = document.getElementById('at').value;
    if (!name || !type) { alert('장소명과 유형은 필수입니다.'); return; }
    saveCustomVenues([...getCustomVenues(), {
      id:'c-'+Date.now(), name, type, base_score:82, match_percent:82,
      location: document.getElementById('aloc').value,
      price_range: document.getElementById('apr').value,
      summary: document.getElementById('asum').value || '직접 등록한 장소입니다.',
      pros:[], cautions:[], tags:[],
      specs:{ capacity:document.getElementById('sc').value, area:document.getElementById('sa').value,
              ceiling:document.getElementById('sh').value, parking:document.getElementById('sp').value,
              av:document.getElementById('sv').value, catering:document.getElementById('sk').value },
    }]);
    closeAdmin();
    showToast(`✅ "${name}" 장소 등록 완료`);
  });

  function renderAdmList() {
    const box = document.getElementById('amList');
    const all = [...MOCK_DB.map(v=>({...v,_b:true})), ...getCustomVenues()];
    if (!all.length) { box.innerHTML='<p style="text-align:center;color:#ABA99F;padding:30px">등록된 장소가 없습니다.</p>'; return; }
    box.innerHTML = all.map(v=>`
      <div class="vc-li">
        <div>
          <div class="vc-li-name">${v.name}</div>
          <div class="vc-li-meta">${v.type} · ${v.location||'주소미입력'} · ${v._b?'<span style="color:#B8860B">내장</span>':'<span style="color:#10B981">직접등록</span>'}</div>
        </div>
        ${!v._b?`<button class="delbtn" data-id="${v.id}">삭제</button>`:'<span style="font-size:10px;color:#ABA99F">내장</span>'}
      </div>`).join('');
    box.querySelectorAll('.delbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCustomVenues(getCustomVenues().filter(v=>v.id!==btn.dataset.id));
        renderAdmList(); showToast('삭제됨');
      });
    });
  }
}
function closeAdmin() { const p = document.getElementById('admPanel'); if(p) p.remove(); }

/* ═══════════════════════════════════════
   STEP 4 — 배치 시뮬레이션
═══════════════════════════════════════ */
const PIECES = {
  stage:      {name:'무대',        w:6,  h:4,  seats:0, color:'#C8C0A8',stroke:'#7A7260',shape:'rect'},
  screen:     {name:'스크린',      w:4,  h:.3, seats:0, color:'#4A6FA5',stroke:'#2D4F85',shape:'rect'},
  podium:     {name:'포디엄',      w:.6, h:.6, seats:0, color:'#8B7355',stroke:'#6B5335',shape:'rect'},
  roundtable: {name:'원형테이블',  w:1.8,h:1.8,seats:10,color:'#E8DFD0',stroke:'#B0A090',shape:'circle'},
  longtable:  {name:'긴 테이블',   w:2.4,h:.9, seats:8, color:'#E8DFD0',stroke:'#B0A090',shape:'rect'},
  chairrow:   {name:'의자 열',     w:4,  h:.5, seats:8, color:'#D4C9B8',stroke:'#A09080',shape:'rect'},
  reception:  {name:'리셉션데스크',w:2,  h:.6, seats:0, color:'#B8C4D0',stroke:'#7090B0',shape:'rect'},
  photozone:  {name:'포토존',      w:3,  h:2.5,seats:0, color:'#D8C8E8',stroke:'#9880C0',shape:'rect'},
};
let simOk=false,hallW=30,hallH=20,sc=20;
let items=[],selId=null,hist=[],idc=0;
let isDrag=false,dItem=null,dox=0,doy=0,dType=null;
const CV=document.getElementById('simCanvas');
const CX=CV.getContext('2d');

function initSim(){
  if(simOk){calcSc();resCv();redraw();return;}
  simOk=true; drawPalIco();
  document.querySelectorAll('.piece').forEach(p=>{
    p.setAttribute('draggable','true');
    p.addEventListener('dragstart',e=>{dType=p.dataset.type;e.dataTransfer.effectAllowed='copy';});
  });
  CV.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
  CV.addEventListener('drop',e=>{
    e.preventDefault();if(!dType)return; savH();
    const R=CV.getBoundingClientRect(),P=PIECES[dType];
    items.push({id:++idc,type:dType,x:sn(Math.max(0,Math.min(hallW-P.w,(e.clientX-R.left)/sc-P.w/2))),y:sn(Math.max(0,Math.min(hallH-P.h,(e.clientY-R.top)/sc-P.h/2))),rot:0});
    selId=idc;dType=null;upd();
  });
  CV.addEventListener('mousedown',e=>{
    if(e.button!==0)return;const pos=cp(e),hit=ht(pos);
    if(hit){savH();selId=hit.id;dItem=hit;dox=pos.x-hit.x;doy=pos.y-hit.y;isDrag=true;upd();e.preventDefault();}
    else{selId=null;upd();}
  });
  CV.addEventListener('mousemove',e=>{
    if(!isDrag||!dItem)return;const pos=cp(e),P=PIECES[dItem.type];
    dItem.x=sn(Math.max(0,Math.min(hallW-P.w,pos.x-dox)));
    dItem.y=sn(Math.max(0,Math.min(hallH-P.h,pos.y-doy)));upd();
  });
  CV.addEventListener('mouseup',()=>{isDrag=false;dItem=null;});
  CV.addEventListener('mouseleave',()=>{isDrag=false;dItem=null;});
  CV.addEventListener('dblclick',e=>{const h=ht(cp(e));if(h){savH();h.rot=(h.rot+90)%360;upd();}});
  CV.addEventListener('contextmenu',e=>{e.preventDefault();const h=ht(cp(e));if(h){savH();items=items.filter(i=>i.id!==h.id);if(selId===h.id)selId=null;upd();showToast('삭제됨');}});
  document.getElementById('btnApplyHall').addEventListener('click',()=>{
    hallW=Math.max(5,Math.min(200,+document.getElementById('hallW').value||30));
    hallH=Math.max(5,Math.min(200,+document.getElementById('hallH').value||20));
    document.getElementById('hallW').value=hallW;document.getElementById('hallH').value=hallH;
    calcSc();resCv();updSI();redraw();showToast(`홀: ${hallW}×${hallH}m`);
  });
  document.getElementById('btnUndo').addEventListener('click',()=>{if(!hist.length){showToast('취소 불가');return;}const s=JSON.parse(hist.pop());items=s.i;selId=s.s;upd();showToast('실행 취소');});
  document.getElementById('btnClearAll').addEventListener('click',()=>{if(!items.length)return;savH();items=[];selId=null;upd();showToast('전체 삭제');});
  document.getElementById('btnDownloadPNG').addEventListener('click',dlPNG);
  document.getElementById('btnRot90').addEventListener('click',()=>rotS(90));
  document.getElementById('btnRot45').addEventListener('click',()=>rotS(45));
  document.getElementById('btnDelSel').addEventListener('click',()=>{if(!selId)return;savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('삭제됨');});
  document.addEventListener('keydown',e=>{
    if(APP.step!==4)return;
    if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
    if((e.key==='Delete'||e.key==='Backspace')&&selId){savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('삭제됨');}
    if((e.key==='r'||e.key==='R')&&selId)rotS(90);
    if(e.key==='Escape'){selId=null;upd();}
  });
  [{type:'screen',x:11,y:.5},{type:'stage',x:10,y:1.2},{type:'roundtable',x:3,y:6},{type:'roundtable',x:8,y:6},{type:'roundtable',x:13,y:6},{type:'roundtable',x:18,y:6},{type:'roundtable',x:3,y:11},{type:'roundtable',x:8,y:11},{type:'roundtable',x:13,y:11},{type:'reception',x:12,y:17.5},{type:'photozone',x:.5,y:.5}]
    .forEach(d=>items.push({id:++idc,type:d.type,x:d.x,y:d.y,rot:0}));
  if(APP.selectedVenue)document.getElementById('simVenueName').textContent=APP.selectedVenue.name;
  calcSc();resCv();updSI();upd();
  window.addEventListener('resize',()=>{if(APP.step===4){calcSc();resCv();redraw();}});
}
function cp(e){const R=CV.getBoundingClientRect();return{x:(e.clientX-R.left)/sc,y:(e.clientY-R.top)/sc};}
function sn(v){return Math.round(v*4)/4;}
function ht(pos){for(let i=items.length-1;i>=0;i--){const it=items[i],P=PIECES[it.type],cx=it.x+P.w/2,cy=it.y+P.h/2,r=-it.rot*Math.PI/180,dx=pos.x-cx,dy=pos.y-cy,lx=dx*Math.cos(r)-dy*Math.sin(r),ly=dx*Math.sin(r)+dy*Math.cos(r);if(Math.abs(lx)<=P.w/2+.1&&Math.abs(ly)<=P.h/2+.1)return it;}return null;}
function calcSc(){const w=document.getElementById('canvasWrap');sc=Math.min((w.clientWidth-80)/hallW,(w.clientHeight-60)/hallH,42);sc=Math.max(sc,8);document.getElementById('scaleDisplay').textContent=(1/sc).toFixed(2);}
function resCv(){CV.width=Math.round(hallW*sc);CV.height=Math.round(hallH*sc);document.getElementById('canvasLbl').textContent=`${hallW}m × ${hallH}m`;}
function updSI(){document.getElementById('btmSize').textContent=`${hallW} × ${hallH} m`;document.getElementById('btmArea').textContent=(hallW*hallH).toLocaleString()+' ㎡';}
function upd(){updCnt();updPP();redraw();}
function updCnt(){const cnt={};let s=0,a=0;items.forEach(it=>{cnt[it.type]=(cnt[it.type]||0)+1;const P=PIECES[it.type];s+=P.seats;a+=P.w*P.h;});Object.keys(PIECES).forEach(t=>{const el=document.getElementById('cnt-'+t);if(el)el.textContent=cnt[t]||0;});document.getElementById('statTotal').textContent=items.length;document.getElementById('statSeats').textContent=s+'석';document.getElementById('statOcc').textContent=Math.round(a/(hallW*hallH)*100)+'%';}
function updPP(){const it=items.find(i=>i.id===selId);document.getElementById('ppEmpty').classList.toggle('hidden',!!it);document.getElementById('ppDetail').classList.toggle('hidden',!it);document.getElementById('ppActions').classList.toggle('hidden',!it);document.getElementById('btmSel').classList.toggle('hidden',!it);if(it){const P=PIECES[it.type];document.getElementById('ppName').textContent=P.name;document.getElementById('ppType').textContent=it.type;document.getElementById('ppX').textContent=it.x.toFixed(1)+'m';document.getElementById('ppY').textContent=it.y.toFixed(1)+'m';document.getElementById('ppRot').textContent=it.rot+'°';document.getElementById('ppSize').textContent=`${P.w}×${P.h}m`;document.getElementById('btmSelName').textContent=P.name;}}
function rotS(d){const it=items.find(i=>i.id===selId);if(it){savH();it.rot=(it.rot+d)%360;upd();}}
function savH(){hist.push(JSON.stringify({i:items,s:selId}));if(hist.length>30)hist.shift();}
function redraw(){
  const W=CV.width,H=CV.height;CX.clearRect(0,0,W,H);CX.fillStyle='#F7F5F0';CX.fillRect(0,0,W,H);
  CX.strokeStyle='#E8E4DC';CX.lineWidth=.5;for(let x=0;x<=hallW;x+=.5){CX.beginPath();CX.moveTo(x*sc,0);CX.lineTo(x*sc,H);CX.stroke();}for(let y=0;y<=hallH;y+=.5){CX.beginPath();CX.moveTo(0,y*sc);CX.lineTo(W,y*sc);CX.stroke();}
  CX.strokeStyle='#D8D4CC';CX.lineWidth=1;CX.fillStyle='#C0BCBA';CX.font=`${Math.max(7,sc*.35)}px DM Mono,monospace`;const st=Math.max(1,Math.floor(5/sc*10));
  for(let x=0;x<=hallW;x++){CX.beginPath();CX.moveTo(x*sc,0);CX.lineTo(x*sc,H);CX.stroke();if(x>0&&x<hallW&&x%st===0){CX.textAlign='center';CX.fillText(x+'m',x*sc,H-4);}}
  for(let y=0;y<=hallH;y++){CX.beginPath();CX.moveTo(0,y*sc);CX.lineTo(W,y*sc);CX.stroke();if(y>0&&y<hallH&&y%st===0){CX.save();CX.translate(6,y*sc);CX.rotate(-Math.PI/2);CX.textAlign='center';CX.fillText(y+'m',0,0);CX.restore();}}
  CX.strokeStyle='#4A4642';CX.lineWidth=3;CX.strokeRect(1.5,1.5,W-3,H-3);
  CX.fillStyle='#C0BCBA';CX.beginPath();CX.moveTo(W/2,H-2);CX.lineTo(W/2-5,H-8);CX.lineTo(W/2+5,H-8);CX.closePath();CX.fill();
  CX.font=`${Math.max(8,sc*.4)}px DM Mono,monospace`;CX.textAlign='center';CX.fillText('ENTRY',W/2,H-12);
  items.forEach(it=>drawIt(it));
}
function drawIt(it){
  const P=PIECES[it.type],pw=P.w*sc,ph=P.h*sc,cx=it.x*sc+pw/2,cy=it.y*sc+ph/2,sel=it.id===selId;
  CX.save();CX.translate(cx,cy);CX.rotate(it.rot*Math.PI/180);
  CX.shadowColor='rgba(0,0,0,.12)';CX.shadowBlur=5;CX.shadowOffsetY=2;
  if(P.shape==='circle'){
    const r=pw/2;CX.beginPath();CX.arc(0,0,r,0,Math.PI*2);CX.fillStyle=P.color;CX.fill();CX.shadowColor='transparent';CX.strokeStyle=sel?'#D4A843':P.stroke;CX.lineWidth=sel?2.5:1.5;CX.stroke();
    for(let i=0;i<P.seats;i++){const a=(i/P.seats)*Math.PI*2-Math.PI/2;CX.save();CX.translate(Math.cos(a)*(r+8),Math.sin(a)*(r+8));CX.rotate(a+Math.PI/2);CX.beginPath();CX.roundRect(-5,-4,10,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();CX.restore();}
    CX.fillStyle='#706050';CX.font=`bold ${Math.max(8,pw*.18)}px DM Mono,monospace`;CX.textAlign='center';CX.textBaseline='middle';CX.fillText('T·'+P.seats,0,0);
  }else{
    CX.beginPath();CX.roundRect(-pw/2,-ph/2,pw,ph,3);CX.fillStyle=P.color;CX.fill();CX.shadowColor='transparent';CX.strokeStyle=sel?'#D4A843':P.stroke;CX.lineWidth=sel?2.5:1.5;CX.stroke();
    if(it.type==='stage'){CX.strokeStyle=P.stroke+'88';CX.lineWidth=1;CX.setLineDash([4,4]);CX.strokeRect(-pw/2+7,-ph/2+7,pw-14,ph-14);CX.setLineDash([]);}
    if(it.type==='screen'){CX.fillStyle='#2A3F6F';CX.beginPath();CX.roundRect(-pw/2+3,-ph/2+2,pw-6,ph-4,2);CX.fill();}
    if(it.type==='chairrow'){const cw=pw/P.seats;for(let i=0;i<P.seats;i++){CX.beginPath();CX.roundRect(-pw/2+cw*i+1,-ph/2+1,cw-2,ph-2,2);CX.fillStyle='#C0B4A0';CX.fill();}}
    if(it.type==='longtable'){const sp=pw/4;for(let i=0;i<4;i++){const lx=-pw/2+sp*i+sp/2;CX.beginPath();CX.roundRect(lx-7,-ph/2-9,14,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();CX.beginPath();CX.roundRect(lx-7,ph/2+1,14,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();}}
    if(it.type==='photozone'){CX.strokeStyle=P.stroke+'60';CX.lineWidth=.8;CX.setLineDash([3,3]);for(let i=1;i<3;i++){CX.beginPath();CX.moveTo(-pw/2+pw/3*i,-ph/2);CX.lineTo(-pw/2+pw/3*i,ph/2);CX.stroke();}CX.setLineDash([]);}
    const LBL={stage:'무대',screen:'SCREEN',podium:'POD',longtable:'T·8',chairrow:'×'+P.seats,reception:'RECEPTION',photozone:'PHOTO'};
    CX.fillStyle='#504840';CX.font=`600 ${Math.max(8,Math.min(pw,ph)*.2)}px Pretendard,sans-serif`;CX.textAlign='center';CX.textBaseline='middle';CX.fillText(LBL[it.type]||'',0,0);
  }
  if(sel){CX.strokeStyle='#D4A843';CX.lineWidth=1.5;CX.setLineDash([5,3]);if(P.shape==='circle'){CX.beginPath();CX.arc(0,0,pw/2+5,0,Math.PI*2);CX.stroke();}else{CX.strokeRect(-pw/2-4,-ph/2-4,pw+8,ph+8);}CX.setLineDash([]);}
  CX.restore();
}
function dlPNG(){
  const pad=60,tH=44,ec=document.createElement('canvas'),dpr=2;
  ec.width=(CV.width+pad*2)*dpr;ec.height=(CV.height+pad*2+tH)*dpr;
  const ex=ec.getContext('2d');ex.scale(dpr,dpr);
  ex.fillStyle='#fff';ex.fillRect(0,0,ec.width,ec.height);
  ex.fillStyle='#1A1C1E';ex.fillRect(0,0,CV.width+pad*2,tH);
  ex.fillStyle='#fff';ex.font='bold 13px Pretendard,sans-serif';ex.textAlign='left';ex.fillText('UNIQUEPLAN — 행사장 배치도',pad,20);
  if(APP.selectedVenue){ex.fillStyle='#9A9690';ex.font='10px DM Mono,monospace';ex.fillText(APP.selectedVenue.name,pad,35);}
  ex.fillStyle='#9A9690';ex.font='10px DM Mono,monospace';ex.textAlign='right';ex.fillText(`${hallW}m×${hallH}m · ${new Date().toLocaleDateString('ko-KR')}`,CV.width+pad,20);
  ex.drawImage(CV,pad,tH+pad);ex.strokeStyle='#E0DDD8';ex.lineWidth=1;ex.strokeRect(pad-8,tH+pad-8,CV.width+16,CV.height+16);
  const cnt={};items.forEach(i=>{cnt[i.type]=(cnt[i.type]||0)+1;});
  let lx=pad;const ly=tH+pad+CV.height+20;
  Object.entries(cnt).forEach(([t,n])=>{ex.fillStyle=PIECES[t].color;ex.fillRect(lx,ly,13,9);ex.strokeStyle=PIECES[t].stroke;ex.lineWidth=1;ex.strokeRect(lx,ly,13,9);ex.fillStyle='#5C5A57';ex.font='9px DM Mono,monospace';ex.textAlign='left';ex.fillText(`${PIECES[t].name}×${n}`,lx+17,ly+8);lx+=100;});
  const a=document.createElement('a');a.download=`배치도_${Date.now()}.png`;a.href=ec.toDataURL('image/png');a.click();
  showToast('배치도 PNG 다운로드 완료');
}
function drawPalIco(){
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
  Object.entries(IC).forEach(([t,s])=>{const el=document.getElementById('icon-'+t);if(el)el.innerHTML=s;});
}

/* ── 토스트 ── */
let _tt;
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),2400);}

/* ── 초기화 ── */
updateReqCount();
