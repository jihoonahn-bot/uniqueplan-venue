/* ═══════════════════════════════════════════════════
   UNIQUEPLAN — main.js (데모 버전)
   어떤 값이든 Step1 → Step2 → Step4 끊김 없이 진행
═══════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────
   내장 목업 장소 데이터 5개
───────────────────────────────────────── */
const MOCK_DB = [
  {
    rank:1, name:'그랜드 하얏트 서울 — 그랜드볼룸',
    type:'특급호텔 연회장', match_percent:96,
    location:'서울 용산구 소월로 322', price_range:'1,800~2,500만원',
    summary:'VIP 행사에 최적화된 프리미엄 연회 공간입니다. 한강 조망과 4K 레이저 AV 시스템, 상주 케이터링팀이 완벽한 행사를 지원합니다. 전용 VIP 엔트런스와 350대 주차 공간을 갖추고 있습니다.',
    pros:[{icon:'✦',title:'VIP 전용 동선',desc:'전용 엔트런스와 대기실로 임원급 의전에 최적입니다.'},{icon:'✦',title:'프리미엄 AV',desc:'4K 레이저 프로젝터 3대 + 상주 AV 엔지니어가 제공됩니다.'},{icon:'✦',title:'대형 전용 주차',desc:'지하 자주식 350대, 발렛 서비스 옵션 가능합니다.'}],
    cautions:[{icon:'△',title:'성수기 예약 경쟁',desc:'3~5월·10~11월은 최소 3개월 전 예약이 필요합니다.'}],
    specs:{capacity:'최대 500명',area:'약 1,200㎡',ceiling:'천고 6.5m',parking:'자주식 350대',av:'상주 AV팀 + 4K',catering:'내부 전담팀'}
  },
  {
    rank:2, name:'코엑스 — 그랜드볼룸',
    type:'전문 컨벤션센터', match_percent:91,
    location:'서울 강남구 영동대로 513', price_range:'1,200~1,800만원',
    summary:'국내 최대 도심형 컨벤션 시설로 삼성역 직결 접근성이 뛰어납니다. 홀을 2~4구역으로 분할해 유연한 운영이 가능하며 다양한 케이터링 파트너를 보유하고 있습니다.',
    pros:[{icon:'✦',title:'삼성역 직결',desc:'지하철 2·9호선 도보 0분, 전국 최고 접근성입니다.'},{icon:'✦',title:'모듈형 홀 구성',desc:'행사 규모에 따라 2~4개 구역 분할 운영이 가능합니다.'}],
    cautions:[{icon:'△',title:'외부 케이터링 필요',desc:'별도 업체 선정과 사전 협의 시간이 소요됩니다.'}],
    specs:{capacity:'최대 800명',area:'약 2,000㎡',ceiling:'천고 8m',parking:'공영 2,000대',av:'자체 AV팀',catering:'제휴 업체 다수'}
  },
  {
    rank:3, name:'롯데호텔 서울 — 크리스탈볼룸',
    type:'특급호텔 연회장', match_percent:88,
    location:'서울 중구 을지로 30', price_range:'1,400~2,000만원',
    summary:'명동·시청 도심 중심으로 어디서든 접근이 용이합니다. 클래식한 호텔 분위기와 최신 시설을 갖추고 있으며, 해외 VIP 초청 행사에도 적합합니다.',
    pros:[{icon:'✦',title:'도심 최중심 입지',desc:'을지로입구역 바로 인접, 사방에서 접근이 편리합니다.'},{icon:'✦',title:'자체 조명 시스템',desc:'핀조명·무드·LED 무빙 전 카테고리 자체 보유합니다.'}],
    cautions:[{icon:'△',title:'주차 대수 제한',desc:'도심 특성상 주차가 150대로 제한적입니다.'}],
    specs:{capacity:'최대 350명',area:'약 750㎡',ceiling:'천고 5m',parking:'자주식 150대',av:'상주 AV팀',catering:'호텔 자체'}
  },
  {
    rank:4, name:'파르나스 타워 — 더그랜드볼룸',
    type:'프리미엄 오피스 연회장', match_percent:84,
    location:'서울 강남구 테헤란로 521', price_range:'900~1,400만원',
    summary:'테헤란로 랜드마크 38층 전망 연회장으로 강남 파노라마 뷰가 탁월합니다. 대기업 사옥 밀집 지역 특성상 B2B 기업 행사에 최적화되어 있습니다.',
    pros:[{icon:'✦',title:'강남 파노라마 뷰',desc:'38층에서 강남 도심 전경을 배경으로 프리미엄 분위기를 연출합니다.'}],
    cautions:[{icon:'△',title:'인원 제한',desc:'최대 180명으로 대규모 행사에는 적합하지 않습니다.'}],
    specs:{capacity:'최대 180명',area:'약 400㎡',ceiling:'천고 3.8m',parking:'건물 내 200대',av:'기본 시스템 구비',catering:'제휴 케이터링'}
  },
  {
    rank:5, name:'세빛섬 — 가빛홀',
    type:'특수 이벤트홀', match_percent:79,
    location:'서울 서초구 올림픽대로 683-1', price_range:'1,000~1,600만원',
    summary:'한강 수상 위에 위치한 국내 유일의 독창적 공간입니다. 강렬한 차별화가 필요한 론칭 행사, 시상식 등에 특히 강한 인상을 남길 수 있습니다.',
    pros:[{icon:'✦',title:'한강 수상 유일',desc:'국내 유일 수상 이벤트홀로 참석자들에게 강렬한 인상을 남깁니다.'}],
    cautions:[{icon:'△',title:'접근성 제한',desc:'대중교통이 불편하며 주차 공간이 제한적입니다.'}],
    specs:{capacity:'최대 250명',area:'약 500㎡',ceiling:'천고 4m',parking:'인근 공영주차장',av:'기본 음향·조명',catering:'자체 레스토랑 연계'}
  }
];

/* ─────────────────────────────────────────
   앱 전역 상태
───────────────────────────────────────── */
const APP = {
  step: 1,
  formData: null,
  selectedVenue: null,
};

/* ─────────────────────────────────────────
   localStorage 헬퍼
───────────────────────────────────────── */
function getCustomVenues() {
  try { return JSON.parse(localStorage.getItem('uq_venues') || '[]'); } catch { return []; }
}
function saveCustomVenues(arr) {
  localStorage.setItem('uq_venues', JSON.stringify(arr));
}

/* ═══════════════════════════════════════
   라우터
═══════════════════════════════════════ */
function goTo(step) {
  APP.step = step;

  /* 뷰 전환 */
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view' + step);
  if (view) view.classList.add('active');

  /* 헤더·스텝바 테마 */
  const dark = (step === 4);
  document.getElementById('appHeader').classList.toggle('dark', dark);
  document.getElementById('stepBar').classList.toggle('dark', dark);
  document.getElementById('hdrInfo').classList.toggle('hidden', dark);
  document.getElementById('simToolbar').classList.toggle('hidden', !dark);
  document.getElementById('simStatus').classList.toggle('hidden', !dark);

  /* 스텝 인디케이터 */
  [1,2,3,4,5].forEach(n => {
    const el = document.getElementById('s' + n + 'tab');
    if (!el) return;
    el.className = 'step' + (n < step ? ' done' : n === step ? ' active' : '');
    el.querySelector('.snum').textContent = n < step ? '✓' : String(n);
  });
  if (!dark) document.getElementById('hdrInfo').textContent = `v1.0 · STEP ${step}/5`;

  if (step === 4) initSim();
}

/* ═══════════════════════════════════════
   STEP 1 — 입력 폼
═══════════════════════════════════════ */
let vipOn = false;

/* VIP 토글 */
document.getElementById('vipTog').addEventListener('click', () => {
  vipOn = !vipOn;
  document.getElementById('vipTog').classList.toggle('on', vipOn);
  document.getElementById('vipStatus').textContent = vipOn ? 'YES' : 'NO';
  updateReqCount();
});

/* 예산 슬라이더 */
document.getElementById('budgetSlider').addEventListener('input', updateBudgetLabel);
function updateBudgetLabel() {
  const v = +document.getElementById('budgetSlider').value;
  let lbl = v <= 100 ? (v * 100).toLocaleString() + '만원'
           : v <= 150 ? ((v - 100) / 10).toFixed(1) + '억원'
           : '2억원+';
  document.getElementById('budgetDisplay').textContent = lbl;
}
updateBudgetLabel();

function getBudgetNum() {
  const v = +document.getElementById('budgetSlider').value;
  return v <= 100 ? v * 1e6 : v <= 150 ? ((v - 100) / 10) * 1e8 : 2e8;
}

/* 행사 유형 버튼 */
document.getElementById('eventTypes').addEventListener('click', e => {
  if (e.target.classList.contains('tbtn2')) e.target.classList.toggle('sel');
});

/* 퀄리티 라디오 */
document.querySelectorAll('.q-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const name = opt.querySelector('input').name;
    document.querySelectorAll(`input[name="${name}"]`).forEach(r => r.closest('.q-opt').classList.remove('sel'));
    opt.classList.add('sel');
  });
});

/* 체크박스 */
document.querySelectorAll('.cbi').forEach(cb => cb.addEventListener('click', () => cb.classList.toggle('chk')));

/* 식사 토글 */
document.getElementById('mealTog').addEventListener('click', e => {
  if (e.target.classList.contains('meal-btn')) {
    document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('sel'));
    e.target.classList.add('sel');
  }
});

/* 필수 항목 카운터 — 표시만, 통과는 막지 않음 */
function updateReqCount() {
  const ok = [
    !!document.getElementById('region').value,
    !!document.getElementById('attendees').value,
    !!document.getElementById('eventDate').value,
    true, true
  ];
  document.getElementById('reqCount').textContent = ok.filter(Boolean).length + ' / 5';
}
document.getElementById('region').addEventListener('change', updateReqCount);
document.getElementById('attendees').addEventListener('input', updateReqCount);
document.getElementById('eventDate').addEventListener('change', updateReqCount);

/* 폼 데이터 수집 */
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
      event_theme:    document.getElementById('eventTheme').value || null,
      screen_quality: document.querySelector('input[name="screen"]:checked')?.value || null,
      audio_quality:  document.querySelector('input[name="audio"]:checked')?.value || null,
      accommodation:  +document.getElementById('accommodation').value || 0,
      parking_spots:  +document.getElementById('parking').value || 0,
      meal_included:  document.querySelector('.meal-btn.sel')?.dataset.v || '미포함',
      lighting:       [...document.querySelectorAll('#lighting .cbi.chk')].map(c => c.dataset.v),
    },
    meta: { submitted_at: new Date().toISOString() }
  };
}

/* ★ 다음 버튼 — 유효성 검사 없이 항상 통과 */
document.getElementById('btnStep1Next').addEventListener('click', () => {
  /* 에러 스타일 초기화 */
  document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));

  APP.formData = collectForm();
  goTo(2);
  buildCondPills();
  runMock();
});

/* ═══════════════════════════════════════
   STEP 2 — 장소 추천 (항상 목업)
═══════════════════════════════════════ */
document.getElementById('btnBack').addEventListener('click', () => goTo(1));
document.getElementById('btnRetry').addEventListener('click', runMock);

/* 조건 필 */
function buildCondPills() {
  const r = APP.formData.required;
  const o = APP.formData.optional;
  const pills = [
    ['지역', r.region],
    ['인원', r.attendees + '명'],
  ];
  if (r.event_date && r.event_date !== '미정') pills.push(['일시', r.event_date]);
  if (r.vip_attendance) pills.push(['VIP', '참석']);
  const b = r.budget_krw;
  pills.push(['예산', b >= 1e8 ? (b/1e8).toFixed(1)+'억원' : (b/1e4).toLocaleString()+'만원']);
  if (o.event_types?.length) pills.push(['유형', o.event_types[0]]);
  if (o.meal_included && o.meal_included !== '미포함') pills.push(['식사', o.meal_included]);

  document.getElementById('condBar').innerHTML =
    pills.map(([k,v]) => `<div class="pill"><span class="pill-k">${k}</span>${v}</div>`).join('') +
    `<span style="margin-left:auto;padding:3px 10px;background:#FEF3C7;color:#92400E;border-radius:4px;font-size:10px;font-family:var(--mono);border:1px solid #FDE68A">◈ 목업 모드</span>`;
}

/* 목업 실행 — 항상 성공 */
function runMock() {
  /* UI 초기화 */
  document.getElementById('ldState').style.display = 'flex';
  document.getElementById('errState').classList.remove('vis');
  document.getElementById('results').classList.remove('vis');

  /* 로딩 스텝 애니메이션 */
  ['ls1','ls2','ls3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('vis','done');
    setTimeout(() => { el.classList.add('vis'); setTimeout(() => el.classList.add('done'), 400); }, 300 + i * 550);
  });

  /* 2초 후 결과 표시 */
  setTimeout(() => {
    const venues = buildVenueList();
    document.getElementById('ldState').style.display = 'none';
    renderVenues(venues);
  }, 2000);
}

/* 목업 장소 리스트 만들기 (기본 5개 + 직접 등록분) */
function buildVenueList() {
  const custom = getCustomVenues();
  const all = [
    ...MOCK_DB,
    ...custom.map((v, i) => ({ ...v, rank: MOCK_DB.length + i + 1 }))
  ];

  /* 간단한 조건 반영 (VIP, 인원) */
  const r = APP.formData.required;
  return all.map(v => {
    let score = v.match_percent;
    if (r.vip_attendance && v.type.includes('특급')) score = Math.min(98, score + 3);
    if (r.attendees) {
      const cap = parseInt((v.specs?.capacity || '9999').replace(/[^0-9]/g,''));
      if (r.attendees > cap) score = Math.max(55, score - 18);
    }
    return { ...v, match_percent: Math.round(score) };
  })
  .sort((a, b) => b.match_percent - a.match_percent)
  .slice(0, 5)
  .map((v, i) => ({ ...v, rank: i + 1 }));
}

/* 카드 렌더링 */
function renderVenues(venues) {
  document.getElementById('resultCount').textContent = venues.length;
  const list = document.getElementById('venueList');
  list.innerHTML = '';

  venues.forEach(v => {
    const rk = Math.min(v.rank, 5);
    const card = document.createElement('div');
    card.className = `vc rk${rk}`;

    const prosH = (v.pros || []).map(p =>
      `<div class="ri"><div class="ri-icon pro">${p.icon}</div><div class="ri-text"><strong>${p.title}</strong><br>${p.desc}</div></div>`
    ).join('');
    const cauH = (v.cautions || []).map(c =>
      `<div class="ri"><div class="ri-icon warn">${c.icon}</div><div class="ri-text"><strong>${c.title}</strong><br>${c.desc}</div></div>`
    ).join('');
    const SL = {capacity:'수용인원',area:'면적',ceiling:'천고',parking:'주차',av:'AV',catering:'케이터링'};
    const specH = Object.entries(v.specs || {}).map(([k, val]) =>
      `<div class="spec"><div class="spec-k">${SL[k]||k}</div><div class="spec-v">${val}</div></div>`
    ).join('');

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
      <div class="dp">
        <div class="dp-inner">
          <div class="dp-grid">
            <div>
              <div class="dp-sec-ttl">추천 이유</div>
              <div class="reasons">${prosH}</div>
              ${cauH ? `<div style="margin-top:14px"><div class="dp-sec-ttl">주의사항</div><div class="reasons">${cauH}</div></div>` : ''}
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

  document.getElementById('results').classList.add('vis');

  /* 매칭률 바 애니메이션 */
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
   어드민 패널 (Ctrl+Shift+A 또는 로고 5번)
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
    #admPanel{position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}
    .am{background:#fff;border-radius:12px;width:800px;max-width:95vw;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.2);overflow:hidden}
    .am-hdr{padding:18px 24px;border-bottom:1px solid #E5E3DC;display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0}
    .am-hdr h2{font-size:15px;font-weight:700}.am-hdr p{font-size:11px;color:#9A9690;margin-top:2px}
    .am-close{border:1.5px solid #E5E3DC;background:none;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:13px;color:#9A9690}
    .am-close:hover{background:#F4F3EF}
    .am-tabs{display:flex;padding:0 24px;border-bottom:1px solid #E5E3DC;flex-shrink:0}
    .am-tab{padding:10px 14px;font-size:12px;font-weight:600;color:#ABA99F;border:none;border-bottom:2px solid transparent;background:none;cursor:pointer;font-family:'Pretendard',sans-serif;transition:all .15s}
    .am-tab.on{color:#1A1A1A;border-bottom-color:#1A1A1A}
    .am-body{flex:1;overflow-y:auto;padding:22px 24px}
    .tp{display:none}.tp.on{display:block}
    .fg label{font-size:11px;font-weight:600;color:#6B6860;display:block;margin-bottom:5px}
    .fg input,.fg select,.fg textarea{width:100%;padding:8px 11px;font-size:13px;font-family:'Pretendard',sans-serif;border:1.5px solid #E5E3DC;border-radius:6px;outline:none;background:#F9F8F5}
    .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:#1A1A1A;background:#fff}
    .fg textarea{resize:vertical;min-height:68px}
    .gr2{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:11px}
    .gr3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;margin-bottom:11px}
    .gr1{margin-bottom:11px}
    .sec{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#ABA99F;font-family:'DM Mono',monospace;margin:18px 0 10px;padding-bottom:7px;border-bottom:1px solid #E5E3DC}
    .pi{display:grid;grid-template-columns:36px 1fr 1fr 26px;gap:7px;align-items:center;padding:9px 11px;background:#F9F8F5;border:1px solid #E5E3DC;border-radius:7px;margin-bottom:7px}
    .pi input{padding:5px 9px;font-size:12px;border:1.5px solid #E5E3DC;border-radius:5px;background:#fff;font-family:'Pretendard',sans-serif;outline:none}
    .pi input:focus{border-color:#1A1A1A}
    .pic{text-align:center}
    .rm{width:24px;height:24px;border:1.5px solid #E5E3DC;background:none;border-radius:4px;cursor:pointer;font-size:11px;color:#ABA99F}
    .rm:hover{border-color:#C84B31;color:#C84B31}
    .addbtn{width:100%;padding:8px;font-size:11px;font-weight:600;border:1.5px dashed #E5E3DC;background:none;color:#ABA99F;border-radius:6px;cursor:pointer;font-family:'Pretendard',sans-serif;margin-bottom:4px}
    .addbtn:hover{border-color:#1A1A1A;color:#1A1A1A}
    .savebtn{margin-top:20px;padding:11px 22px;background:#1A1A1A;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Pretendard',sans-serif}
    .savebtn:hover{opacity:.85}
    .vc-li{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#F9F8F5;border:1px solid #E5E3DC;border-radius:8px;margin-bottom:7px}
    .vc-li-name{font-size:13px;font-weight:700;margin-bottom:2px}
    .vc-li-meta{font-size:10px;color:#9A9690;font-family:'DM Mono',monospace}
    .delbtn{padding:5px 11px;border:1.5px solid #E5E3DC;background:none;border-radius:5px;font-size:11px;cursor:pointer;font-family:'Pretendard',sans-serif;color:#ABA99F}
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

      <!-- 장소 추가 탭 -->
      <div class="tp on" id="tp-add">
        <div class="sec">기본 정보</div>
        <div class="gr2">
          <div class="fg"><label>장소명 *</label><input id="an" type="text" placeholder="예: 그랜드 인터컨티넨탈 파르나스 — 그랜드볼룸"></div>
          <div class="fg"><label>장소 유형 *</label>
            <select id="at">
              <option value="">선택</option>
              <option>특급호텔 연회장</option><option>비즈니스호텔 연회장</option>
              <option>전문 컨벤션센터</option><option>프리미엄 오피스빌딩 연회장</option>
              <option>특수 이벤트홀</option><option>리조트 연회장</option><option>기타</option>
            </select>
          </div>
        </div>
        <div class="gr2">
          <div class="fg"><label>주소</label><input id="aloc" type="text" placeholder="서울 강남구 테헤란로 521"></div>
          <div class="fg"><label>예상 대관료</label><input id="apr" type="text" placeholder="1,200~1,800만원"></div>
        </div>
        <div class="gr1">
          <div class="fg"><label>한줄 요약 (추천 이유)</label><textarea id="asum" placeholder="이 장소를 추천하는 핵심 이유를 2~3문장으로 작성해 주세요."></textarea></div>
        </div>

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

        <div class="sec">강점</div>
        <div id="proList">
          <div class="pi"><input class="pic" type="text" value="✦"><input type="text" placeholder="강점 제목"><input type="text" placeholder="설명 (1~2문장)"><button class="rm" onclick="this.closest('.pi').remove()">✕</button></div>
        </div>
        <button class="addbtn" id="addPro">+ 강점 추가</button>

        <div class="sec">주의사항</div>
        <div id="cautList">
          <div class="pi"><input class="pic" type="text" value="△"><input type="text" placeholder="주의사항 제목"><input type="text" placeholder="설명"><button class="rm" onclick="this.closest('.pi').remove()">✕</button></div>
        </div>
        <button class="addbtn" id="addCaut">+ 주의사항 추가</button>

        <button class="savebtn" id="amSave">💾 장소 저장하기</button>
      </div>

      <!-- 등록 장소 탭 -->
      <div class="tp" id="tp-list">
        <div id="amList"></div>
      </div>
    </div>
  </div>`;

  document.body.appendChild(panel);

  /* 닫기 */
  document.getElementById('amClose').addEventListener('click', closeAdmin);
  panel.addEventListener('click', e => { if (e.target === panel) closeAdmin(); });

  /* 탭 전환 */
  panel.querySelectorAll('.am-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.am-tab').forEach(t => t.classList.remove('on'));
      panel.querySelectorAll('.tp').forEach(p => p.classList.remove('on'));
      tab.classList.add('on');
      document.getElementById('tp-' + tab.dataset.t).classList.add('on');
      if (tab.dataset.t === 'list') renderAdmList();
    });
  });

  /* 행 추가 */
  function addRow(listId, icon, ph1, ph2) {
    const r = document.createElement('div'); r.className = 'pi';
    r.innerHTML = `<input class="pic" type="text" value="${icon}"><input type="text" placeholder="${ph1}"><input type="text" placeholder="${ph2}"><button class="rm" onclick="this.closest('.pi').remove()">✕</button>`;
    document.getElementById(listId).appendChild(r);
  }
  document.getElementById('addPro').addEventListener('click', () => addRow('proList','✦','강점 제목','설명'));
  document.getElementById('addCaut').addEventListener('click', () => addRow('cautList','△','주의사항 제목','설명'));

  /* 저장 */
  document.getElementById('amSave').addEventListener('click', () => {
    const name = document.getElementById('an').value.trim();
    const type = document.getElementById('at').value;
    if (!name || !type) { alert('장소명과 장소 유형은 필수입니다.'); return; }

    const pros = [...document.querySelectorAll('#proList .pi')].map(r => {
      const inp = r.querySelectorAll('input');
      return { icon: inp[0].value || '✦', title: inp[1].value, desc: inp[2].value };
    }).filter(p => p.title);

    const cautions = [...document.querySelectorAll('#cautList .pi')].map(r => {
      const inp = r.querySelectorAll('input');
      return { icon: inp[0].value || '△', title: inp[1].value, desc: inp[2].value };
    }).filter(c => c.title);

    const newV = {
      id: 'c-' + Date.now(), rank: 99, name, type,
      match_percent: 85,
      location: document.getElementById('aloc').value,
      price_range: document.getElementById('apr').value,
      summary: document.getElementById('asum').value || '직접 등록한 장소입니다.',
      pros, cautions,
      specs: {
        capacity: document.getElementById('sc').value,
        area:     document.getElementById('sa').value,
        ceiling:  document.getElementById('sh').value,
        parking:  document.getElementById('sp').value,
        av:       document.getElementById('sv').value,
        catering: document.getElementById('sk').value,
      },
      custom: true,
    };
    saveCustomVenues([...getCustomVenues(), newV]);
    closeAdmin();
    showToast(`✅ "${name}" 장소 등록 완료`);
  });

  /* 등록 장소 목록 */
  function renderAdmList() {
    const box = document.getElementById('amList');
    const all = [...MOCK_DB.map(v=>({...v,_builtin:true})), ...getCustomVenues()];
    if (!all.length) { box.innerHTML = '<p style="text-align:center;color:#ABA99F;padding:30px">등록된 장소가 없습니다.</p>'; return; }
    box.innerHTML = all.map(v => `
      <div class="vc-li">
        <div>
          <div class="vc-li-name">${v.name}</div>
          <div class="vc-li-meta">${v.type} · ${v.location||'주소 미입력'} · ${v.price_range||'금액 미입력'} · ${v._builtin?'<span style="color:#B8860B">기본 내장</span>':'<span style="color:#10B981">직접 등록</span>'}</div>
        </div>
        ${!v._builtin ? `<button class="delbtn" data-id="${v.id}">삭제</button>` : '<span style="font-size:10px;color:#ABA99F">내장</span>'}
      </div>`).join('');
    box.querySelectorAll('.delbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        saveCustomVenues(getCustomVenues().filter(v => v.id !== btn.dataset.id));
        renderAdmList();
        showToast('장소 삭제됨');
      });
    });
  }
}

function closeAdmin() { const p = document.getElementById('admPanel'); if (p) p.remove(); }

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

let simOk=false, hallW=30, hallH=20, sc=20;
let items=[], selId=null, hist=[], idc=0;
let drag=false, dItem=null, dox=0, doy=0, dType=null;
const CV = document.getElementById('simCanvas');
const CX = CV.getContext('2d');

function initSim() {
  if (simOk) { calcSc(); resCv(); redraw(); return; }
  simOk = true;
  drawPalIco();

  /* 팔레트 드래그 */
  document.querySelectorAll('.piece').forEach(p => {
    p.setAttribute('draggable','true');
    p.addEventListener('dragstart', e => { dType = p.dataset.type; e.dataTransfer.effectAllowed='copy'; });
  });
  CV.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect='copy'; });
  CV.addEventListener('drop', e => {
    e.preventDefault(); if (!dType) return;
    savH(); const R=CV.getBoundingClientRect(), P=PIECES[dType];
    items.push({id:++idc,type:dType,x:sn(Math.max(0,Math.min(hallW-P.w,(e.clientX-R.left)/sc-P.w/2))),y:sn(Math.max(0,Math.min(hallH-P.h,(e.clientY-R.top)/sc-P.h/2))),rot:0});
    selId=idc; dType=null; upd();
  });

  /* 마우스 */
  CV.addEventListener('mousedown', e => {
    if(e.button!==0) return;
    const pos=cp(e), hit=ht(pos);
    if(hit){savH();selId=hit.id;dItem=hit;dox=pos.x-hit.x;doy=pos.y-hit.y;drag=true;upd();e.preventDefault();}
    else{selId=null;upd();}
  });
  CV.addEventListener('mousemove', e => {
    if(!drag||!dItem) return;
    const pos=cp(e),P=PIECES[dItem.type];
    dItem.x=sn(Math.max(0,Math.min(hallW-P.w,pos.x-dox)));
    dItem.y=sn(Math.max(0,Math.min(hallH-P.h,pos.y-doy))); upd();
  });
  CV.addEventListener('mouseup',()=>{drag=false;dItem=null;});
  CV.addEventListener('mouseleave',()=>{drag=false;dItem=null;});
  CV.addEventListener('dblclick',e=>{const h=ht(cp(e));if(h){savH();h.rot=(h.rot+90)%360;upd();}});
  CV.addEventListener('contextmenu',e=>{
    e.preventDefault(); const h=ht(cp(e));
    if(h){savH();items=items.filter(i=>i.id!==h.id);if(selId===h.id)selId=null;upd();showToast('삭제됨');}
  });

  /* 툴바 */
  document.getElementById('btnApplyHall').addEventListener('click',()=>{
    hallW=Math.max(5,Math.min(200,+document.getElementById('hallW').value||30));
    hallH=Math.max(5,Math.min(200,+document.getElementById('hallH').value||20));
    document.getElementById('hallW').value=hallW; document.getElementById('hallH').value=hallH;
    calcSc();resCv();updSI();redraw();showToast(`홀 크기: ${hallW}×${hallH}m`);
  });
  document.getElementById('btnUndo').addEventListener('click',()=>{if(!hist.length){showToast('취소 불가');return;}const s=JSON.parse(hist.pop());items=s.i;selId=s.s;upd();showToast('실행 취소');});
  document.getElementById('btnClearAll').addEventListener('click',()=>{if(!items.length)return;savH();items=[];selId=null;upd();showToast('전체 삭제');});
  document.getElementById('btnDownloadPNG').addEventListener('click',dlPNG);
  document.getElementById('btnRot90').addEventListener('click',()=>rotS(90));
  document.getElementById('btnRot45').addEventListener('click',()=>rotS(45));
  document.getElementById('btnDelSel').addEventListener('click',()=>{if(!selId)return;savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('삭제됨');});

  /* 키보드 */
  document.addEventListener('keydown',e=>{
    if(APP.step!==4) return;
    const tag=document.activeElement.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
    if((e.key==='Delete'||e.key==='Backspace')&&selId){savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('삭제됨');}
    if((e.key==='r'||e.key==='R')&&selId)rotS(90);
    if(e.key==='Escape'){selId=null;upd();}
  });

  /* 기본 배치 */
  [{type:'screen',x:11,y:.5},{type:'stage',x:10,y:1.2},{type:'roundtable',x:3,y:6},{type:'roundtable',x:8,y:6},{type:'roundtable',x:13,y:6},{type:'roundtable',x:18,y:6},{type:'roundtable',x:3,y:11},{type:'roundtable',x:8,y:11},{type:'roundtable',x:13,y:11},{type:'reception',x:12,y:17.5},{type:'photozone',x:.5,y:.5}]
    .forEach(d=>items.push({id:++idc,type:d.type,x:d.x,y:d.y,rot:0}));

  if (APP.selectedVenue) document.getElementById('simVenueName').textContent = APP.selectedVenue.name;

  calcSc(); resCv(); updSI(); upd();
  window.addEventListener('resize',()=>{if(APP.step===4){calcSc();resCv();redraw();}});
}

function cp(e){const R=CV.getBoundingClientRect();return{x:(e.clientX-R.left)/sc,y:(e.clientY-R.top)/sc};}
function sn(v){return Math.round(v*4)/4;}
function ht(pos){
  for(let i=items.length-1;i>=0;i--){
    const it=items[i],P=PIECES[it.type],cx=it.x+P.w/2,cy=it.y+P.h/2;
    const r=-it.rot*Math.PI/180,dx=pos.x-cx,dy=pos.y-cy;
    const lx=dx*Math.cos(r)-dy*Math.sin(r),ly=dx*Math.sin(r)+dy*Math.cos(r);
    if(Math.abs(lx)<=P.w/2+.1&&Math.abs(ly)<=P.h/2+.1)return it;
  }
  return null;
}
function calcSc(){const w=document.getElementById('canvasWrap');sc=Math.min((w.clientWidth-80)/hallW,(w.clientHeight-60)/hallH,42);sc=Math.max(sc,8);document.getElementById('scaleDisplay').textContent=(1/sc).toFixed(2);}
function resCv(){CV.width=Math.round(hallW*sc);CV.height=Math.round(hallH*sc);document.getElementById('canvasLbl').textContent=`${hallW}m × ${hallH}m`;}
function updSI(){document.getElementById('btmSize').textContent=`${hallW} × ${hallH} m`;document.getElementById('btmArea').textContent=(hallW*hallH).toLocaleString()+' ㎡';}
function upd(){updCnt();updPP();redraw();}
function updCnt(){
  const cnt={};let s=0,a=0;
  items.forEach(it=>{cnt[it.type]=(cnt[it.type]||0)+1;const P=PIECES[it.type];s+=P.seats;a+=P.w*P.h;});
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
  if(it){const P=PIECES[it.type];document.getElementById('ppName').textContent=P.name;document.getElementById('ppType').textContent=it.type;document.getElementById('ppX').textContent=it.x.toFixed(1)+'m';document.getElementById('ppY').textContent=it.y.toFixed(1)+'m';document.getElementById('ppRot').textContent=it.rot+'°';document.getElementById('ppSize').textContent=`${P.w}×${P.h}m`;document.getElementById('btmSelName').textContent=P.name;}
}
function rotS(d){const it=items.find(i=>i.id===selId);if(it){savH();it.rot=(it.rot+d)%360;upd();}}
function savH(){hist.push(JSON.stringify({i:items,s:selId}));if(hist.length>30)hist.shift();}

function redraw(){
  const W=CV.width,H=CV.height;
  CX.clearRect(0,0,W,H);CX.fillStyle='#F7F5F0';CX.fillRect(0,0,W,H);
  CX.strokeStyle='#E8E4DC';CX.lineWidth=.5;
  for(let x=0;x<=hallW;x+=.5){CX.beginPath();CX.moveTo(x*sc,0);CX.lineTo(x*sc,H);CX.stroke();}
  for(let y=0;y<=hallH;y+=.5){CX.beginPath();CX.moveTo(0,y*sc);CX.lineTo(W,y*sc);CX.stroke();}
  CX.strokeStyle='#D8D4CC';CX.lineWidth=1;CX.fillStyle='#C0BCBA';
  CX.font=`${Math.max(7,sc*.35)}px DM Mono,monospace`;
  const st=Math.max(1,Math.floor(5/sc*10));
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
    const r=pw/2;CX.beginPath();CX.arc(0,0,r,0,Math.PI*2);CX.fillStyle=P.color;CX.fill();
    CX.shadowColor='transparent';CX.strokeStyle=sel?'#D4A843':P.stroke;CX.lineWidth=sel?2.5:1.5;CX.stroke();
    for(let i=0;i<P.seats;i++){const a=(i/P.seats)*Math.PI*2-Math.PI/2;CX.save();CX.translate(Math.cos(a)*(r+8),Math.sin(a)*(r+8));CX.rotate(a+Math.PI/2);CX.beginPath();CX.roundRect(-5,-4,10,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();CX.restore();}
    CX.fillStyle='#706050';CX.font=`bold ${Math.max(8,pw*.18)}px DM Mono,monospace`;CX.textAlign='center';CX.textBaseline='middle';CX.fillText('T·'+P.seats,0,0);
  } else {
    CX.beginPath();CX.roundRect(-pw/2,-ph/2,pw,ph,3);CX.fillStyle=P.color;CX.fill();
    CX.shadowColor='transparent';CX.strokeStyle=sel?'#D4A843':P.stroke;CX.lineWidth=sel?2.5:1.5;CX.stroke();
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
  ex.drawImage(CV,pad,tH+pad);
  ex.strokeStyle='#E0DDD8';ex.lineWidth=1;ex.strokeRect(pad-8,tH+pad-8,CV.width+16,CV.height+16);
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
  Object.entries(IC).forEach(([t,s])=>{ const el=document.getElementById('icon-'+t); if(el)el.innerHTML=s; });
}

/* ═══════════════════════════════════════
   토스트 & 앱 시작
═══════════════════════════════════════ */
let _tt;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(_tt); _tt = setTimeout(() => t.classList.remove('show'), 2400);
}

updateReqCount(); /* 초기 카운터 */
