/* ═══════════════════════════════════════════════════════════
   UNIQUEPLAN AI VENUE — main.js
   전체 앱 로직: 라우터 → Step1 폼 → Step2 AI 추천 → Step4 시뮬레이션
═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   1. 앱 상태 (모든 단계가 공유하는 데이터)
──────────────────────────────────────── */
const state = {
  currentStep:   1,
  formData:      null,   // Step1에서 수집한 폼 데이터
  venueList:     [],     // Step2 AI가 반환한 장소 목록
  selectedVenue: null,   // Step2에서 사용자가 선택한 장소
};

/* ────────────────────────────────────────
   2. 라우터 — 뷰 전환 함수
──────────────────────────────────────── */
function goTo(step) {
  state.currentStep = step;

  // 모든 뷰 숨기고 해당 뷰만 표시
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view' + step).classList.add('active');

  // Step 4는 다크 테마
  const isDark = (step === 4);
  document.getElementById('appHeader').classList.toggle('dark', isDark);
  document.getElementById('stepBar').classList.toggle('dark', isDark);
  document.getElementById('hdrInfo').classList.toggle('hidden', isDark);
  document.getElementById('simToolbar').classList.toggle('hidden', !isDark);
  document.getElementById('simStatus').classList.toggle('hidden', !isDark);

  // 스텝 인디케이터 업데이트
  [1, 2, 3, 4, 5].forEach(n => {
    const el = document.getElementById('s' + n + 'tab');
    el.className = 'step' + (n < step ? ' done' : n === step ? ' active' : '');
    el.querySelector('.snum').textContent = n < step ? '✓' : String(n);
  });

  // 헤더 스텝 정보
  if (!isDark) {
    document.getElementById('hdrInfo').textContent = `v1.0 · STEP ${step}/5`;
  }

  // Step 4 초기화
  if (step === 4) initSim();
}

/* ════════════════════════════════════════════
   STEP 1 — 기본 정보 입력 폼
════════════════════════════════════════════ */

/* ── VIP 토글 ── */
let vipOn = false;

document.getElementById('vipTog').addEventListener('click', () => {
  vipOn = !vipOn;
  document.getElementById('vipTog').classList.toggle('on', vipOn);
  document.getElementById('vipStatus').textContent = vipOn ? 'YES' : 'NO';
  checkReq();
});

/* ── 예산 슬라이더 ── */
document.getElementById('budgetSlider').addEventListener('input', updateBudget);

function updateBudget() {
  const v = Number(document.getElementById('budgetSlider').value);
  let label;
  if (v <= 100)      label = (v * 100).toLocaleString() + '만원';
  else if (v <= 150) label = ((v - 100) / 10).toFixed(1) + '억원';
  else               label = '2억원+';
  document.getElementById('budgetDisplay').textContent = label;
  checkReq();
}

function getBudgetNum() {
  const v = Number(document.getElementById('budgetSlider').value);
  if (v <= 100) return v * 1_000_000;
  if (v <= 150) return ((v - 100) / 10) * 100_000_000;
  return 200_000_000;
}

updateBudget(); // 초기값 표시

/* ── 행사 유형 멀티 선택 ── */
document.getElementById('eventTypes').addEventListener('click', e => {
  if (e.target.classList.contains('tbtn2')) {
    e.target.classList.toggle('sel');
  }
});

/* ── 퀄리티 라디오 ── */
document.querySelectorAll('.q-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const name = opt.querySelector('input').name;
    document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
      r.closest('.q-opt').classList.remove('sel');
    });
    opt.classList.add('sel');
  });
});

/* ── 조명 체크박스 ── */
document.querySelectorAll('.cbi').forEach(cb => {
  cb.addEventListener('click', () => cb.classList.toggle('chk'));
});

/* ── 식사 토글 ── */
document.getElementById('mealTog').addEventListener('click', e => {
  if (e.target.classList.contains('meal-btn')) {
    document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('sel'));
    e.target.classList.add('sel');
  }
});

/* ── 필수 항목 검사 ── */
function checkReq() {
  const filled = [
    Boolean(document.getElementById('region').value),
    Boolean(document.getElementById('attendees').value),
    Boolean(document.getElementById('eventDate').value),
    true, // VIP는 항상 값 있음 (기본 NO)
    true, // 예산은 항상 값 있음
  ];
  const count = filled.filter(Boolean).length;
  document.getElementById('reqCount').textContent = `${count} / 5`;
  return filled.every(Boolean);
}

document.getElementById('region').addEventListener('change', checkReq);
document.getElementById('attendees').addEventListener('input', checkReq);
document.getElementById('eventDate').addEventListener('change', checkReq);

/* ── 폼 데이터 수집 ── */
function collectForm() {
  return {
    required: {
      region:          document.getElementById('region').value,
      attendees:       Number(document.getElementById('attendees').value) || null,
      event_date:      document.getElementById('eventDate').value,
      event_time:      document.getElementById('eventTime').value,
      vip_attendance:  vipOn,
      budget_krw:      getBudgetNum(),
    },
    optional: {
      event_types:     [...document.querySelectorAll('#eventTypes .tbtn2.sel')].map(b => b.dataset.v),
      event_theme:     document.getElementById('eventTheme').value || null,
      screen_quality:  document.querySelector('input[name="screen"]:checked')?.value || null,
      audio_quality:   document.querySelector('input[name="audio"]:checked')?.value || null,
      accommodation:   Number(document.getElementById('accommodation').value) || 0,
      parking_spots:   Number(document.getElementById('parking').value) || 0,
      meal_included:   document.querySelector('.meal-btn.sel')?.dataset.v || '미포함',
      lighting:        [...document.querySelectorAll('#lighting .cbi.chk')].map(c => c.dataset.v),
    },
    meta: { submitted_at: new Date().toISOString() },
  };
}

/* ── Step 1 → Step 2 이동 ── */
document.getElementById('btnStep1Next').addEventListener('click', () => {
  // 이전 에러 초기화
  document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));

  // 유효성 검사
  let hasError = false;
  if (!document.getElementById('region').value) {
    document.getElementById('f-region').classList.add('invalid');
    hasError = true;
  }
  if (!document.getElementById('attendees').value) {
    document.getElementById('f-attendees').classList.add('invalid');
    hasError = true;
  }
  if (!document.getElementById('eventDate').value) {
    document.getElementById('f-date').classList.add('invalid');
    hasError = true;
  }
  if (hasError) {
    document.getElementById('f-region').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  state.formData = collectForm();
  goTo(2);
  renderCondPills();
  startAI();
});

/* ════════════════════════════════════════════
   STEP 2 — AI 장소 추천
════════════════════════════════════════════ */

/* ── 조건 필 표시 ── */
function renderCondPills() {
  const r = state.formData.required;
  const o = state.formData.optional;

  const pills = [];
  if (r.region)          pills.push(['지역', r.region]);
  if (r.attendees)       pills.push(['인원', r.attendees + '명']);
  if (r.event_date)      pills.push(['일시', r.event_date]);
  if (r.vip_attendance)  pills.push(['VIP', '참석']);

  const b = r.budget_krw;
  const budgetLabel = b >= 100_000_000
    ? (b / 100_000_000).toFixed(1) + '억원'
    : (b / 10_000).toLocaleString() + '만원';
  pills.push(['예산', budgetLabel]);

  if (o.event_types?.length) {
    const extra = o.event_types.length > 1 ? ` 외 ${o.event_types.length - 1}` : '';
    pills.push(['유형', o.event_types[0] + extra]);
  }
  if (o.screen_quality) pills.push(['스크린', o.screen_quality]);
  if (o.audio_quality)  pills.push(['음향', o.audio_quality]);
  if (o.meal_included && o.meal_included !== '미포함') pills.push(['식사', o.meal_included]);

  document.getElementById('condBar').innerHTML = pills
    .map(([k, v]) => `<div class="pill"><span class="pill-k">${k}</span>${v}</div>`)
    .join('');
}

/* ── 뒤로 가기 / 재시도 ── */
document.getElementById('btnBack').addEventListener('click', () => goTo(1));
document.getElementById('btnRetry').addEventListener('click', startAI);

/* ── Anthropic API 호출 ── */
async function startAI() {
  // UI 초기화
  document.getElementById('ldState').style.display = 'flex';
  document.getElementById('errState').classList.remove('vis');
  document.getElementById('results').classList.remove('vis');

  // 로딩 스텝 애니메이션
  ['ls1', 'ls2', 'ls3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('vis', 'done');
    setTimeout(() => {
      el.classList.add('vis');
      setTimeout(() => el.classList.add('done'), 600);
    }, 400 + i * 1100);
  });

  const SYSTEM_PROMPT = `당신은 대한민국 MICE/BTL 행사 기획 전문가입니다. 클라이언트의 행사 조건을 분석하여 최적의 장소 3~5곳을 추천합니다.
반드시 아래 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요.

{"venues":[{"rank":1,"name":"장소명","type":"호텔 연회장","match_percent":95,"location":"서울 강남구","price_range":"1,500~2,000만원","summary":"핵심 추천 이유 2~3문장. 구체적이고 설득력 있게.","pros":[{"icon":"✦","title":"강점 제목","desc":"설명 1~2문장"}],"cautions":[{"icon":"△","title":"주의사항","desc":"설명"}],"specs":{"capacity":"최대 200명","area":"약 450㎡","ceiling":"천고 4.2m","parking":"자주식 200대","av":"상주 AV팀","catering":"내부 케이터링"}}]}

실존하는 서울/전국 주요 호텔·컨벤션 장소를 기반으로 현실적으로 추천하세요.
match_percent는 85~98 범위에서 조건 일치도를 반영해 차별화하세요.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `다음 행사 조건으로 최적의 장소를 추천해주세요:\n\n${JSON.stringify(state.formData, null, 2)}`,
        }],
      }),
    });

    if (!res.ok) throw new Error(`API 오류 (${res.status})`);

    const json = await res.json();
    const rawText = json.content[0].text.trim().replace(/^```json|^```|```$/gm, '').trim();
    const data = JSON.parse(rawText);
    state.venueList = data.venues;

    setTimeout(() => {
      document.getElementById('ldState').style.display = 'none';
      renderVenues(data.venues);
    }, 3600);

  } catch (err) {
    setTimeout(() => {
      document.getElementById('ldState').style.display = 'none';
      document.getElementById('errMsg').textContent = err.message;
      document.getElementById('errState').classList.add('vis');
    }, 2000);
  }
}

/* ── 장소 카드 렌더링 ── */
function renderVenues(venues) {
  document.getElementById('resultCount').textContent = venues.length;
  const list = document.getElementById('venueList');
  list.innerHTML = '';

  venues.forEach((venue, i) => {
    const rk = Math.min(venue.rank, 5);
    const card = document.createElement('div');
    card.className = `vc rk${rk}`;
    card.dataset.idx = i;

    // 추천 이유 HTML
    const prosHTML = (venue.pros || []).map(p =>
      `<div class="ri">
        <div class="ri-icon pro">${p.icon}</div>
        <div class="ri-text"><strong>${p.title}</strong><br>${p.desc}</div>
      </div>`
    ).join('');

    const cautionsHTML = (venue.cautions || []).map(c =>
      `<div class="ri">
        <div class="ri-icon warn">${c.icon}</div>
        <div class="ri-text"><strong>${c.title}</strong><br>${c.desc}</div>
      </div>`
    ).join('');

    // 스펙 그리드 HTML
    const specLabels = { capacity:'수용인원', area:'면적', ceiling:'천고', parking:'주차', av:'AV', catering:'케이터링' };
    const specsHTML = Object.entries(venue.specs || {}).map(([k, v]) =>
      `<div class="spec"><div class="spec-k">${specLabels[k] || k}</div><div class="spec-v">${v}</div></div>`
    ).join('');

    card.innerHTML = `
      <div class="vc-main">
        <div class="rnk">${venue.rank}</div>
        <div>
          <div class="vc-top">
            <div class="vname">${venue.name}</div>
            <div class="vtags">
              <span class="vtag vtag-type">${venue.type || ''}</span>
              ${rk === 1 ? '<span class="vtag vtag-top">★ BEST</span>' : ''}
            </div>
          </div>
          <div class="vsum">${venue.summary}</div>
          <div class="match-row">
            <span class="match-lbl">매칭률</span>
            <div class="match-bar"><div class="match-fill" data-pct="${venue.match_percent}"></div></div>
            <span class="match-pct">${venue.match_percent}%</span>
          </div>
        </div>
        <div class="vc-right">
          <div>
            <div class="vprice-lbl">예상 대관료</div>
            <div class="vprice-val">${venue.price_range || '문의'}</div>
          </div>
          <button class="btn-sel">선택하기</button>
        </div>
      </div>
      <div class="dp">
        <div class="dp-inner">
          <div class="dp-grid">
            <div>
              <div class="dp-sec-ttl">추천 이유</div>
              <div class="reasons">${prosHTML}</div>
              ${cautionsHTML ? `
                <div style="margin-top:14px">
                  <div class="dp-sec-ttl">주의사항</div>
                  <div class="reasons">${cautionsHTML}</div>
                </div>` : ''}
            </div>
            <div>
              <div class="dp-sec-ttl">장소 스펙</div>
              <div class="specs-g">${specsHTML}</div>
              <div class="spec-loc">📍 ${venue.location || ''}</div>
            </div>
          </div>
          <div class="dp-footer">
            <div class="dp-note">이 장소로 배치 시뮬레이션을 시작할 수 있습니다</div>
            <button class="btn-proceed">이 장소로 배치 시뮬레이션 →</button>
          </div>
        </div>
      </div>`;

    // 이벤트 연결
    card.querySelector('.vc-main').addEventListener('click', () => toggleDetail(card));
    card.querySelector('.btn-sel').addEventListener('click', e => { e.stopPropagation(); selectVenue(card, venue); });
    card.querySelector('.btn-proceed').addEventListener('click', () => { selectVenue(card, venue); goToSim(venue); });

    list.appendChild(card);
  });

  document.getElementById('results').classList.add('vis');

  // 매칭률 바 애니메이션
  requestAnimationFrame(() => setTimeout(() => {
    document.querySelectorAll('.match-fill').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 200));
}

function toggleDetail(card) {
  const dp = card.querySelector('.dp');
  const wasOpen = dp.classList.contains('open');
  document.querySelectorAll('.dp.open').forEach(d => d.classList.remove('open'));
  if (!wasOpen) dp.classList.add('open');
}

function selectVenue(card, venue) {
  document.querySelectorAll('.vc').forEach(c => c.classList.remove('sel'));
  card.classList.add('sel');
  state.selectedVenue = venue;
  document.querySelectorAll('.dp.open').forEach(d => d.classList.remove('open'));
  card.querySelector('.dp').classList.add('open');
}

function goToSim(venue) {
  state.selectedVenue = venue;
  goTo(4);
}

/* ════════════════════════════════════════════
   STEP 4 — 배치 시뮬레이션
════════════════════════════════════════════ */

/* ── 집기 정의 ── */
const PIECES = {
  stage:       { name:'무대',         w:6,   h:4,   seats:0,  color:'#C8C0A8', stroke:'#7A7260', shape:'rect'   },
  screen:      { name:'스크린',       w:4,   h:0.3, seats:0,  color:'#4A6FA5', stroke:'#2D4F85', shape:'rect'   },
  podium:      { name:'포디엄',       w:0.6, h:0.6, seats:0,  color:'#8B7355', stroke:'#6B5335', shape:'rect'   },
  roundtable:  { name:'원형테이블',   w:1.8, h:1.8, seats:10, color:'#E8DFD0', stroke:'#B0A090', shape:'circle' },
  longtable:   { name:'긴 테이블',    w:2.4, h:0.9, seats:8,  color:'#E8DFD0', stroke:'#B0A090', shape:'rect'   },
  chairrow:    { name:'의자 열',      w:4,   h:0.5, seats:8,  color:'#D4C9B8', stroke:'#A09080', shape:'rect'   },
  reception:   { name:'리셉션데스크', w:2,   h:0.6, seats:0,  color:'#B8C4D0', stroke:'#7090B0', shape:'rect'   },
  photozone:   { name:'포토존',       w:3,   h:2.5, seats:0,  color:'#D8C8E8', stroke:'#9880C0', shape:'rect'   },
};

/* ── 시뮬레이션 상태 ── */
let simInited  = false;
let hallW      = 30, hallH = 20, scale = 20;
let items      = [];   // 배치된 집기 목록
let selId      = null; // 선택된 집기 ID
let history    = [];   // 실행 취소 히스토리
let idCounter  = 0;    // 집기 고유 ID
let isDragging = false, dragItem = null, dragOffX = 0, dragOffY = 0;
let dragType   = null; // 팔레트에서 드래그 중인 타입

const canvas = document.getElementById('simCanvas');
const ctx    = canvas.getContext('2d');

/* ── 시뮬레이션 초기화 (최초 1회만) ── */
function initSim() {
  if (simInited) {
    // 재진입 시 크기만 재계산
    calcScale();
    resizeCanvas();
    redraw();
    return;
  }
  simInited = true;

  drawPaletteIcons();
  setupCanvasEvents();
  setupToolbarEvents();
  setupKeyboard();
  loadDefaultLayout();

  // 선택된 장소명 표시
  if (state.selectedVenue) {
    document.getElementById('simVenueName').textContent = state.selectedVenue.name;
  }

  calcScale();
  resizeCanvas();
  updateSimInfo();
  refresh();

  window.addEventListener('resize', () => {
    if (state.currentStep === 4) { calcScale(); resizeCanvas(); redraw(); }
  });
}

/* ── 이벤트: 팔레트 드래그 ── */
function setupCanvasEvents() {
  // 팔레트 → 캔버스 드래그
  document.querySelectorAll('.piece').forEach(p => {
    p.setAttribute('draggable', 'true');
    p.addEventListener('dragstart', e => {
      dragType = p.dataset.type;
      e.dataTransfer.effectAllowed = 'copy';
    });
  });

  canvas.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  canvas.addEventListener('drop', e => {
    e.preventDefault();
    if (!dragType) return;
    saveHistory();
    const rect = canvas.getBoundingClientRect();
    const p = PIECES[dragType];
    const rawX = (e.clientX - rect.left) / scale - p.w / 2;
    const rawY = (e.clientY - rect.top)  / scale - p.h / 2;
    const x = snap(Math.max(0, Math.min(hallW - p.w, rawX)));
    const y = snap(Math.max(0, Math.min(hallH - p.h, rawY)));
    items.push({ id: ++idCounter, type: dragType, x, y, rot: 0 });
    selId = idCounter;
    dragType = null;
    refresh();
  });

  // 캔버스 클릭 / 드래그
  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    const pos  = canvasPos(e);
    const hit  = hitTest(pos);
    if (hit) {
      saveHistory();
      selId = hit.id;
      dragItem = hit;
      dragOffX = pos.x - hit.x;
      dragOffY = pos.y - hit.y;
      isDragging = true;
      refresh();
      e.preventDefault();
    } else {
      selId = null;
      refresh();
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (!isDragging || !dragItem) return;
    const pos = canvasPos(e);
    const p   = PIECES[dragItem.type];
    dragItem.x = snap(Math.max(0, Math.min(hallW - p.w, pos.x - dragOffX)));
    dragItem.y = snap(Math.max(0, Math.min(hallH - p.h, pos.y - dragOffY)));
    refresh();
  });

  canvas.addEventListener('mouseup',    () => { isDragging = false; dragItem = null; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; dragItem = null; });

  // 더블클릭 → 90° 회전
  canvas.addEventListener('dblclick', e => {
    const hit = hitTest(canvasPos(e));
    if (hit) { saveHistory(); hit.rot = (hit.rot + 90) % 360; refresh(); }
  });

  // 우클릭 → 삭제
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    const hit = hitTest(canvasPos(e));
    if (hit) {
      saveHistory();
      items = items.filter(i => i.id !== hit.id);
      if (selId === hit.id) selId = null;
      refresh();
      showToast('집기 삭제됨');
    }
  });
}

/* ── 이벤트: 툴바 버튼 ── */
function setupToolbarEvents() {
  document.getElementById('btnApplyHall').addEventListener('click', () => {
    hallW = Math.max(5, Math.min(200, Number(document.getElementById('hallW').value) || 30));
    hallH = Math.max(5, Math.min(200, Number(document.getElementById('hallH').value) || 20));
    document.getElementById('hallW').value = hallW;
    document.getElementById('hallH').value = hallH;
    calcScale();
    resizeCanvas();
    updateSimInfo();
    redraw();
    showToast(`홀 크기 변경: ${hallW}m × ${hallH}m`);
  });

  document.getElementById('btnUndo').addEventListener('click', undo);
  document.getElementById('btnClearAll').addEventListener('click', () => {
    if (!items.length) return;
    saveHistory();
    items = [];
    selId = null;
    refresh();
    showToast('전체 삭제됨');
  });
  document.getElementById('btnDownloadPNG').addEventListener('click', downloadPNG);
  document.getElementById('btnRot90').addEventListener('click', () => rotateSel(90));
  document.getElementById('btnRot45').addEventListener('click', () => rotateSel(45));
  document.getElementById('btnDelSel').addEventListener('click', deleteSel);
}

/* ── 이벤트: 키보드 단축키 ── */
function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (state.currentStep !== 4) return;
    if (document.activeElement.tagName === 'INPUT') return;
    if ((e.key === 'Delete' || e.key === 'Backspace') && selId) deleteSel();
    if ((e.key === 'r' || e.key === 'R') && selId) rotateSel(90);
    if (e.key === 'Escape') { selId = null; refresh(); }
  });
}

/* ── 기본 배치 로드 ── */
function loadDefaultLayout() {
  const defaults = [
    { type:'screen',     x:11,  y:0.5  },
    { type:'stage',      x:10,  y:1.2  },
    { type:'roundtable', x:3,   y:6    },
    { type:'roundtable', x:8,   y:6    },
    { type:'roundtable', x:13,  y:6    },
    { type:'roundtable', x:18,  y:6    },
    { type:'roundtable', x:3,   y:11   },
    { type:'roundtable', x:8,   y:11   },
    { type:'roundtable', x:13,  y:11   },
    { type:'reception',  x:12,  y:17.5 },
    { type:'photozone',  x:0.5, y:0.5  },
  ];
  defaults.forEach(d => items.push({ id: ++idCounter, type: d.type, x: d.x, y: d.y, rot: 0 }));
}

/* ── 캔버스 좌표 변환 ── */
function canvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) / scale,
    y: (e.clientY - rect.top)  / scale,
  };
}

/* ── 스냅 (0.25m 단위) ── */
function snap(v) { return Math.round(v * 4) / 4; }

/* ── 히트 테스트 (마우스 위치에 집기가 있는지) ── */
function hitTest(pos) {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    const p  = PIECES[it.type];
    const cx = it.x + p.w / 2;
    const cy = it.y + p.h / 2;
    const rad = -it.rot * Math.PI / 180;
    const dx  = pos.x - cx;
    const dy  = pos.y - cy;
    const lx  = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ly  = dx * Math.sin(rad) + dy * Math.cos(rad);
    if (Math.abs(lx) <= p.w / 2 + 0.1 && Math.abs(ly) <= p.h / 2 + 0.1) return it;
  }
  return null;
}

/* ── 스케일 계산 ── */
function calcScale() {
  const wrap = document.getElementById('canvasWrap');
  const maxW = wrap.clientWidth  - 80;
  const maxH = wrap.clientHeight - 60;
  scale = Math.min(maxW / hallW, maxH / hallH, 42);
  scale = Math.max(scale, 8);
  document.getElementById('scaleDisplay').textContent = (1 / scale).toFixed(2);
}

/* ── 캔버스 리사이즈 ── */
function resizeCanvas() {
  canvas.width  = Math.round(hallW * scale);
  canvas.height = Math.round(hallH * scale);
  document.getElementById('canvasLbl').textContent = `${hallW}m × ${hallH}m`;
}

/* ── 하단 통계 업데이트 ── */
function updateSimInfo() {
  document.getElementById('btmSize').textContent = `${hallW} × ${hallH} m`;
  document.getElementById('btmArea').textContent = (hallW * hallH).toLocaleString() + ' ㎡';
}

/* ── 전체 상태 업데이트 ── */
function refresh() {
  updateCounts();
  updatePropPanel();
  redraw();
}

/* ── 팔레트 카운터 & 통계 업데이트 ── */
function updateCounts() {
  const cnt   = {};
  let seats   = 0;
  let area    = 0;

  items.forEach(it => {
    cnt[it.type] = (cnt[it.type] || 0) + 1;
    const p = PIECES[it.type];
    seats += p.seats;
    area  += p.w * p.h;
  });

  Object.keys(PIECES).forEach(t => {
    const el = document.getElementById('cnt-' + t);
    if (el) el.textContent = cnt[t] || 0;
  });

  document.getElementById('statTotal').textContent = items.length;
  document.getElementById('statSeats').textContent = seats + '석';
  document.getElementById('statOcc').textContent   = Math.round(area / (hallW * hallH) * 100) + '%';
}

/* ── 속성 패널 업데이트 ── */
function updatePropPanel() {
  const it = items.find(i => i.id === selId);
  document.getElementById('ppEmpty').classList.toggle('hidden', !!it);
  document.getElementById('ppDetail').classList.toggle('hidden', !it);
  document.getElementById('ppActions').classList.toggle('hidden', !it);
  document.getElementById('btmSel').classList.toggle('hidden', !it);

  if (it) {
    const p = PIECES[it.type];
    document.getElementById('ppName').textContent = p.name;
    document.getElementById('ppType').textContent = it.type;
    document.getElementById('ppX').textContent    = it.x.toFixed(1) + 'm';
    document.getElementById('ppY').textContent    = it.y.toFixed(1) + 'm';
    document.getElementById('ppRot').textContent  = it.rot + '°';
    document.getElementById('ppSize').textContent = `${p.w}×${p.h}m`;
    document.getElementById('btmSelName').textContent = p.name;
  }
}

/* ── 집기 액션 ── */
function rotateSel(deg) {
  const it = items.find(i => i.id === selId);
  if (it) { saveHistory(); it.rot = (it.rot + deg) % 360; refresh(); }
}

function deleteSel() {
  if (!selId) return;
  saveHistory();
  items = items.filter(i => i.id !== selId);
  selId = null;
  refresh();
  showToast('집기 삭제됨');
}

/* ── 히스토리 ── */
function saveHistory() {
  history.push(JSON.stringify({ items, selId }));
  if (history.length > 30) history.shift();
}

function undo() {
  if (!history.length) { showToast('더 이상 되돌릴 수 없습니다'); return; }
  const s = JSON.parse(history.pop());
  items = s.items;
  selId = s.selId;
  refresh();
  showToast('실행 취소');
}

/* ────────────────────────────────────────
   캔버스 렌더링
──────────────────────────────────────── */
function redraw() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // 배경
  ctx.fillStyle = '#F7F5F0';
  ctx.fillRect(0, 0, W, H);

  // 0.5m 보조선
  ctx.strokeStyle = '#E8E4DC';
  ctx.lineWidth   = 0.5;
  for (let x = 0; x <= hallW; x += 0.5) {
    ctx.beginPath(); ctx.moveTo(x * scale, 0); ctx.lineTo(x * scale, H); ctx.stroke();
  }
  for (let y = 0; y <= hallH; y += 0.5) {
    ctx.beginPath(); ctx.moveTo(0, y * scale); ctx.lineTo(W, y * scale); ctx.stroke();
  }

  // 1m 주선 + 눈금
  ctx.strokeStyle = '#D8D4CC';
  ctx.lineWidth   = 1;
  ctx.fillStyle   = '#C0BCBA';
  ctx.font        = `${Math.max(7, scale * 0.35)}px DM Mono, monospace`;
  ctx.textAlign   = 'center';
  const step = Math.max(1, Math.floor(5 / scale * 10));

  for (let x = 0; x <= hallW; x++) {
    ctx.beginPath(); ctx.moveTo(x * scale, 0); ctx.lineTo(x * scale, H); ctx.stroke();
    if (x > 0 && x < hallW && x % step === 0) ctx.fillText(x + 'm', x * scale, H - 4);
  }
  for (let y = 0; y <= hallH; y++) {
    ctx.beginPath(); ctx.moveTo(0, y * scale); ctx.lineTo(W, y * scale); ctx.stroke();
    if (y > 0 && y < hallH && y % step === 0) {
      ctx.save();
      ctx.translate(6, y * scale);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(y + 'm', 0, 0);
      ctx.restore();
    }
  }

  // 벽 테두리
  ctx.strokeStyle = '#4A4642';
  ctx.lineWidth   = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

  // 입구 표시
  const ex = W / 2, ey = H - 2;
  ctx.fillStyle = '#C0BCBA';
  ctx.beginPath();
  ctx.moveTo(ex, ey - 8); ctx.lineTo(ex - 5, ey - 2); ctx.lineTo(ex + 5, ey - 2);
  ctx.closePath(); ctx.fill();
  ctx.font      = `${Math.max(8, scale * 0.4)}px DM Mono, monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('ENTRY', ex, ey + 10);

  // 집기 그리기
  items.forEach(it => drawItem(it));
}

function drawItem(it) {
  const p   = PIECES[it.type];
  const pw  = p.w * scale;
  const ph  = p.h * scale;
  const cx  = it.x * scale + pw / 2;
  const cy  = it.y * scale + ph / 2;
  const sel = it.id === selId;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(it.rot * Math.PI / 180);
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur  = 5;
  ctx.shadowOffsetY = 2;

  if (p.shape === 'circle') {
    const r = pw / 2;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = sel ? '#D4A843' : p.stroke;
    ctx.lineWidth   = sel ? 2.5 : 1.5;
    ctx.stroke();

    // 의자 렌더링
    const chairR = r + 8;
    for (let i = 0; i < p.seats; i++) {
      const angle = (i / p.seats) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.translate(Math.cos(angle) * chairR, Math.sin(angle) * chairR);
      ctx.rotate(angle + Math.PI / 2);
      ctx.beginPath(); ctx.roundRect(-5, -4, 10, 8, 2);
      ctx.fillStyle   = '#C8BCA8'; ctx.fill();
      ctx.strokeStyle = '#A09080'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle    = '#706050';
    ctx.font         = `bold ${Math.max(8, pw * 0.18)}px DM Mono, monospace`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T·' + p.seats, 0, 0);

  } else {
    ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 3);
    ctx.fillStyle = p.color; ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = sel ? '#D4A843' : p.stroke;
    ctx.lineWidth   = sel ? 2.5 : 1.5;
    ctx.stroke();

    // 집기별 디테일
    if (it.type === 'stage') {
      ctx.strokeStyle = p.stroke + '88'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.strokeRect(-pw / 2 + 7, -ph / 2 + 7, pw - 14, ph - 14);
      ctx.setLineDash([]);
    }
    if (it.type === 'screen') {
      ctx.fillStyle = '#2A3F6F';
      ctx.beginPath(); ctx.roundRect(-pw / 2 + 3, -ph / 2 + 2, pw - 6, ph - 4, 2); ctx.fill();
    }
    if (it.type === 'chairrow') {
      const cw = pw / p.seats;
      for (let i = 0; i < p.seats; i++) {
        ctx.beginPath(); ctx.roundRect(-pw / 2 + cw * i + 1, -ph / 2 + 1, cw - 2, ph - 2, 2);
        ctx.fillStyle = '#C0B4A0'; ctx.fill();
      }
    }
    if (it.type === 'longtable') {
      const sp = pw / 4;
      for (let i = 0; i < 4; i++) {
        const lx = -pw / 2 + sp * i + sp / 2;
        // 위 의자
        ctx.beginPath(); ctx.roundRect(lx - 7, -ph / 2 - 9, 14, 8, 2);
        ctx.fillStyle = '#C8BCA8'; ctx.fill(); ctx.strokeStyle = '#A09080'; ctx.lineWidth = 0.8; ctx.stroke();
        // 아래 의자
        ctx.beginPath(); ctx.roundRect(lx - 7, ph / 2 + 1, 14, 8, 2);
        ctx.fillStyle = '#C8BCA8'; ctx.fill(); ctx.strokeStyle = '#A09080'; ctx.lineWidth = 0.8; ctx.stroke();
      }
    }
    if (it.type === 'photozone') {
      ctx.strokeStyle = p.stroke + '60'; ctx.lineWidth = 0.8; ctx.setLineDash([3, 3]);
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-pw / 2 + pw / 3 * i, -ph / 2);
        ctx.lineTo(-pw / 2 + pw / 3 * i,  ph / 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // 텍스트 레이블
    const labels = { stage:'무대', screen:'SCREEN', podium:'POD', longtable:'T·8', chairrow:'×' + p.seats, reception:'RECEPTION', photozone:'PHOTO' };
    ctx.fillStyle    = '#504840';
    ctx.font         = `600 ${Math.max(8, Math.min(pw, ph) * 0.2)}px Pretendard, sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[it.type] || '', 0, 0);
  }

  // 선택 표시 (점선 테두리)
  if (sel) {
    ctx.strokeStyle = '#D4A843'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
    if (p.shape === 'circle') {
      ctx.beginPath(); ctx.arc(0, 0, pw / 2 + 5, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.strokeRect(-pw / 2 - 4, -ph / 2 - 4, pw + 8, ph + 8);
    }
    ctx.setLineDash([]);
  }

  ctx.restore();
}

/* ── 배치도 PNG 다운로드 ── */
function downloadPNG() {
  const pad = 60, titleH = 44;
  const ec  = document.createElement('canvas');
  const dpr = 2;
  ec.width  = (canvas.width  + pad * 2) * dpr;
  ec.height = (canvas.height + pad * 2 + titleH) * dpr;
  const ex  = ec.getContext('2d');
  ex.scale(dpr, dpr);

  // 배경
  ex.fillStyle = '#fff';
  ex.fillRect(0, 0, ec.width, ec.height);

  // 타이틀 바
  ex.fillStyle = '#1A1C1E';
  ex.fillRect(0, 0, canvas.width + pad * 2, titleH);
  ex.fillStyle = '#fff';
  ex.font = 'bold 13px Pretendard, sans-serif';
  ex.textAlign = 'left';
  ex.fillText('UNIQUEPLAN — 행사장 배치도', pad, 20);

  if (state.selectedVenue) {
    ex.fillStyle = '#9A9690';
    ex.font = '10px DM Mono, monospace';
    ex.fillText(state.selectedVenue.name, pad, 35);
  }
  ex.fillStyle = '#9A9690';
  ex.font = '10px DM Mono, monospace';
  ex.textAlign = 'right';
  ex.fillText(`${hallW}m × ${hallH}m · ${new Date().toLocaleDateString('ko-KR')}`, canvas.width + pad, 20);

  // 평면도
  ex.drawImage(canvas, pad, titleH + pad);

  // 테두리
  ex.strokeStyle = '#E0DDD8'; ex.lineWidth = 1;
  ex.strokeRect(pad - 8, titleH + pad - 8, canvas.width + 16, canvas.height + 16);

  // 범례
  const cnt = {};
  items.forEach(i => { cnt[i.type] = (cnt[i.type] || 0) + 1; });
  let lx = pad;
  const ly = titleH + pad + canvas.height + 20;

  Object.entries(cnt).forEach(([t, n]) => {
    ex.fillStyle   = PIECES[t].color;
    ex.fillRect(lx, ly, 13, 9);
    ex.strokeStyle = PIECES[t].stroke; ex.lineWidth = 1;
    ex.strokeRect(lx, ly, 13, 9);
    ex.fillStyle = '#5C5A57';
    ex.font = '9px DM Mono, monospace';
    ex.textAlign = 'left';
    ex.fillText(`${PIECES[t].name} ×${n}`, lx + 17, ly + 8);
    lx += 110;
  });

  const a  = document.createElement('a');
  a.download = `uniqueplan_배치도_${Date.now()}.png`;
  a.href     = ec.toDataURL('image/png');
  a.click();
  showToast('배치도 PNG 다운로드 완료');
}

/* ── 팔레트 아이콘 SVG ── */
function drawPaletteIcons() {
  const icons = {
    stage:       `<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="9" width="28" height="16" rx="2" fill="#C8C0A8" stroke="#7A7260" stroke-width="1.5"/><rect x="6" y="12" width="22" height="10" rx="1" fill="none" stroke="#7A7260" stroke-dasharray="3 2" stroke-width="1"/><text x="17" y="20" text-anchor="middle" font-size="6" fill="#7A7260" font-family="monospace">STAGE</text></svg>`,
    screen:      `<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="13" width="28" height="8" rx="2" fill="#4A6FA5" stroke="#2D4F85" stroke-width="1.5"/><rect x="5" y="15" width="24" height="4" rx="1" fill="#2A3F6F"/></svg>`,
    podium:      `<svg viewBox="0 0 34 34" fill="none"><rect x="12" y="9" width="10" height="16" rx="2" fill="#8B7355" stroke="#6B5335" stroke-width="1.5"/></svg>`,
    roundtable:  `<svg viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="9" fill="#E8DFD0" stroke="#B0A090" stroke-width="1.5"/><circle cx="17" cy="6" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="17" cy="28" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="6" cy="17" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="28" cy="17" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/></svg>`,
    longtable:   `<svg viewBox="0 0 34 34" fill="none"><rect x="5" y="12" width="24" height="10" rx="2" fill="#E8DFD0" stroke="#B0A090" stroke-width="1.5"/><rect x="7" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="14.5" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="22" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="7" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="14.5" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="22" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/></svg>`,
    chairrow:    `<svg viewBox="0 0 34 34" fill="none"><rect x="2" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="10" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="18" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="26" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/></svg>`,
    reception:   `<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="13" width="28" height="10" rx="2" fill="#B8C4D0" stroke="#7090B0" stroke-width="1.5"/><text x="17" y="20" text-anchor="middle" font-size="5" fill="#507090" font-family="monospace">RECEPTION</text></svg>`,
    photozone:   `<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="5" width="28" height="24" rx="2" fill="#D8C8E8" stroke="#9880C0" stroke-width="1.5"/><line x1="14" y1="5" x2="14" y2="29" stroke="#9880C0" stroke-width=".8" stroke-dasharray="2 2"/><line x1="20" y1="5" x2="20" y2="29" stroke="#9880C0" stroke-width=".8" stroke-dasharray="2 2"/><circle cx="17" cy="17" r="4" fill="none" stroke="#9880C0" stroke-width="1.2"/></svg>`,
  };
  Object.entries(icons).forEach(([type, svg]) => {
    const el = document.getElementById('icon-' + type);
    if (el) el.innerHTML = svg;
  });
}

/* ────────────────────────────────────────
   토스트 알림
──────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ────────────────────────────────────────
   앱 시작
──────────────────────────────────────── */
checkReq(); // 필수 항목 카운터 초기화
