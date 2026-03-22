/* ═══════════════════════════════════════════════════════
   UNIQUEPLAN — main.js
   ✅ 엑셀(.xlsx) 업로드 → 자동 파싱 → AI 추천 즉시 반영
   ✅ SheetJS 라이브러리로 브라우저에서 직접 엑셀 읽기
═══════════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────
   내장 목업 DB (엑셀 업로드 시 자동 추가됨)
───────────────────────────────────────── */
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
    summary:'삼성역 직결 접근성과 최대 800명 수용 공간이 강점입니다. 홀 분할 구성으로 규모에 유연하게 대응할 수 있습니다.',
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
    summary:'명동·시청 도심 중심부로 접근이 용이합니다. 클래식한 호텔 분위기와 자체 조명 시스템으로 격식 있는 행사에 적합합니다.',
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

/* ─────────────────────────────────────
   localStorage에서 업로드된 장소 불러오기
───────────────────────────────────────── */
function getUploadedVenues() {
  try { return JSON.parse(localStorage.getItem('uq_uploaded_venues') || '[]'); } catch { return []; }
}
function saveUploadedVenues(arr) {
  localStorage.setItem('uq_uploaded_venues', JSON.stringify(arr));
}
function getAllVenues() {
  return [...MOCK_DB, ...getUploadedVenues()];
}

/* ═══════════════════════════════════════════════════════
   엑셀 파싱 엔진
   유니크플랜 행사 장소 데이터 템플릿 (.xlsx) 전용
   행 번호 기반으로 모든 데이터 추출 (요약 없이 전체 보존)
═══════════════════════════════════════════════════════ */

// 행 번호 → 필드 매핑 (기존 엑셀 양식 구조 그대로)
const XLSX_ROW_MAP = {
  7:  'event_name',
  8:  'venue_name',
  9:  'address',
  10: 'event_date',
  11: 'space_name',
  12: 'contact_manager',
  13: 'booking_method',
  14: 'attendees',
  19: 'area',
  20: 'capacity',
  21: 'entrance',
  22: 'cargo_access',
  23: 'ceiling_height',
  24: 'table_size',
  25: 'tablecloth_color',
  26: 'stage',
  27: 'access_time',
  28: 'columns',
  32: 'screen_position',
  33: 'batten',
  34: 'led',
  35: 'sound_system',
  36: 'av_connector',
  37: 'lighting',
  38: 'sub_screen',
  39: 'pdp',
  40: 'screen_resolution',
  41: 'microphone',
  42: 'wifi',
  43: 'power_outlet',
  48: 'lobby_area',
  49: 'vip_room',
  50: 'registration_desk',
  51: 'photo_zone',
  52: 'storage',
  53: 'other_equipment',
  60: 'main_route',
  61: 'signage',
  62: 'staff_route',
  63: 'elevator',
  64: 'slide_ramp',
  65: 'vip_route',
  66: 'loading_route',
  67: 'emergency_exit',
  75: 'floor_material',
  76: 'rigging',
  77: 'noise_restriction',
  78: 'waste_disposal',
  79: 'internet_speed',
  80: 'equipment_inventory',
  81: 'wall_attachment',
  82: 'fire_safety',
  83: 'hvac',
  84: 'windows',
  85: 'elevator_count',
  86: 'dedicated_elevator',
  87: 'amenities',
  93: 'catering',
  94: 'menu_options',
  95: 'restaurant_room',
  96: 'restroom',
  97: 'parking',
  98: 'external_catering',
  99: 'cafe',
  100: 'smoking_area',
  101: 'parking_fee',
  102: 'parking_registration',
  109: 'rental_fee',
  110: 'av_fee',
  111: 'special_notes',
  112: 'additional_costs',
  113: 'cancellation_policy',
  114: 'tax_info',
  123: 'eval_av',
  124: 'eval_accessibility',
  125: 'eval_reuse',
  126: 'eval_lobby',
  127: 'eval_food',
  128: 'eval_manager',
  129: 'eval_overall',
  136: 'accommodation_rooms',
  137: 'rental_items',
  138: 'guest_floors',
  142: 'nearby_medical',
  143: 'nearby_dining',
};

function parseXLSX(arrayBuffer) {
  if (typeof XLSX === 'undefined') throw new Error('SheetJS 라이브러리가 로드되지 않았습니다.');

  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // 전체 시트를 2차원 배열로 변환
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // 행 번호 기반으로 데이터 추출
  const extracted = {};
  for (const [rowIdx, fieldKey] of Object.entries(XLSX_ROW_MAP)) {
    const row = rawData[parseInt(rowIdx)];
    if (row) {
      const value = String(row[1] || '').trim();
      const remark = String(row[2] || '').trim();
      extracted[fieldKey] = value;
      if (remark) extracted[fieldKey + '_remark'] = remark;
    }
  }

  return extracted;
}

function xlsxDataToVenue(data) {
  // 장소명 구성
  const venueName = [data.venue_name, data.space_name].filter(Boolean).join(' — ') || '(장소명 미입력)';
  const venueId   = 'xlsx_' + venueName.replace(/[^가-힣a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now();

  // 점수 추론 (평가 코멘트 텍스트 기반)
  function inferScore(text) {
    if (!text) return 3;
    if (/매우\s*좋|훌륭|최고|완벽|강추|매우\s*만족/.test(text)) return 5;
    if (/좋|만족|우수|충분|괜찮|재사용/.test(text)) return 4;
    if (/보통|평범|무난/.test(text)) return 3;
    if (/불편|아쉽|부족|단점|미흡|안좋|매우\s*안/.test(text)) return 2;
    if (/최악|비추|심각|매우\s*나쁨/.test(text)) return 1;
    return 3;
  }

  const accScore  = inferScore(data.eval_accessibility);
  const avScore   = inferScore(data.eval_av);
  const foodScore = inferScore(data.eval_food);
  const baseScore = Math.max(50, Math.min(98, Math.round((accScore + avScore + foodScore) / 3 * 20)));

  // 태그 자동 생성 (전체 데이터 텍스트 분석)
  const fullText = Object.values(data).join(' ');
  const tags = [];
  if (/주차.*무료|무료.*주차|주차요금.*없|항시.*개방/.test(fullText)) tags.push('주차여유');
  if (/LED/.test(data.led || '') && !/없음|없다/.test(data.led || '')) tags.push('LED보유');
  if (/숙박|객실|1인실|2인실/.test(fullText)) tags.push('숙박가능');
  if (/재사용.*있|재사용.*의사/.test(data.eval_reuse || '')) tags.push('재사용추천');
  if (/뒷풀이|PDR|별도\s*룸|식당.*룸/.test(fullText)) tags.push('뒷풀이가능');
  if (/리조트|연수원/.test(venueName + (data.venue_name || ''))) tags.push('리조트');
  if (/대중교통.*안좋|접근성.*나쁨|교통.*불편/.test(fullText)) tags.push('대중교통불편');
  if (/VIP|임원|대표/.test(fullText)) tags.push('vip적합');
  if (data.address && /서울/.test(data.address)) tags.push('서울');
  if (data.address && /경기|인천/.test(data.address)) tags.push('경기인천');

  // 강점 생성 (평가 + 장점 텍스트에서)
  const pros = [];

  if (data.eval_reuse && /재사용.*있|시설.*좋|만족도.*높/.test(data.eval_reuse)) {
    pros.push({ icon:'✦', title:'검증된 재사용 장소', desc: data.eval_reuse });
  }
  if (data.amenities && data.amenities.length > 5) {
    pros.push({ icon:'✦', title:'풍부한 부대시설', desc: data.amenities + (data.amenities_remark ? ' / ' + data.amenities_remark : '') });
  }
  if (data.catering && !/없음|불가/.test(data.catering)) {
    pros.push({ icon:'✦', title:'자체 케이터링', desc: data.catering + (data.catering_remark ? ' / ' + data.catering_remark : '') });
  }
  if (data.parking && !/주차.*없/.test(data.parking)) {
    pros.push({ icon:'✦', title:'주차', desc: data.parking + (data.parking_fee ? ' / ' + data.parking_fee : '') });
  }
  if (data.restaurant_room && !/없음/.test(data.restaurant_room)) {
    pros.push({ icon:'✦', title:'식당 별도룸', desc: data.restaurant_room });
  }
  if (!pros.length) {
    pros.push({ icon:'✦', title:'현장 검증 장소', desc: '유니크플랜 담당자가 직접 답사·운영한 장소입니다.' });
  }

  // 주의사항 생성
  const cautions = [];
  if (data.eval_accessibility && /안좋|불편|나쁨/.test(data.eval_accessibility)) {
    cautions.push({ icon:'△', title:'접근성 주의', desc: data.eval_accessibility });
  }
  if (data.led && /없음|없다/.test(data.led)) {
    cautions.push({ icon:'△', title:'LED 없음', desc: '고품질 영상 연출 시 외부 렌탈이 필요합니다.' });
  }
  if (data.eval_food && /단촐|부족|아쉽/.test(data.eval_food)) {
    cautions.push({ icon:'△', title:'식음 구성 주의', desc: data.eval_food });
  }

  // 대관료 포맷
  let priceRange = '문의';
  if (data.rental_fee) {
    priceRange = data.rental_fee;
    // 숫자 추출해서 정리
    const match = data.rental_fee.match(/(\d[\d,]+)/g);
    if (match && match.length >= 2) {
      priceRange = `${match[0].replace(/,/g,'')}만원/일 (셋업 ${match[1].replace(/,/g,'')}만원)`;
    }
  }

  // 요약문 (평가 코멘트 + 재사용 의사 조합)
  const summaryParts = [];
  if (data.eval_reuse) summaryParts.push(data.eval_reuse);
  if (data.eval_overall) summaryParts.push(data.eval_overall);
  if (data.special_notes) summaryParts.push(data.special_notes);
  const summary = summaryParts.filter(Boolean).join(' / ').slice(0, 250)
    || `${venueName} — 유니크플랜 담당자가 직접 운영한 장소입니다.`;

  return {
    id: venueId,
    name: venueName,
    type: (() => {
      const n = venueName + (data.venue_name || '');
      if (/호텔/.test(n)) return '호텔 연회장';
      if (/리조트/.test(n)) return '리조트';
      if (/연수원/.test(n)) return '연수원';
      if (/컨벤션|COEX|KINTEX/.test(n)) return '컨벤션센터';
      return '이벤트홀';
    })(),
    base_score: baseScore,
    location: data.address || '',
    price_range: priceRange,
    summary,
    tags,
    pros: pros.slice(0, 3),
    cautions: cautions.slice(0, 2),
    specs: {
      capacity: data.capacity || '문의',
      area:     data.area     || '문의',
      ceiling:  data.ceiling_height ? `천고 ${data.ceiling_height}m` : '문의',
      parking:  data.parking  || '문의',
      av:       data.sound_system || '문의',
      catering: data.catering || '문의',
    },
    _raw: data,  // 원본 전체 데이터 보존
    _source: 'xlsx',
    _uploaded_at: new Date().toISOString(),
  };
}

/* ═══════════════════════════════════════
   앱 상태
═══════════════════════════════════════ */
const APP = {
  step: 1,
  formData: null,
  requestText: '',
  parsedRequest: null,
  selectedVenue: null,
};

/* ═══════════════════════════════════════
   라우터
═══════════════════════════════════════ */
function goTo(step) {
  APP.step = step;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view' + step);
  if (view) view.classList.add('active');
  const dark = step === 4;
  document.getElementById('appHeader').classList.toggle('dark', dark);
  document.getElementById('stepBar').classList.toggle('dark', dark);
  document.getElementById('hdrInfo').classList.toggle('hidden', dark);
  document.getElementById('simToolbar').classList.toggle('hidden', !dark);
  document.getElementById('simStatus').classList.toggle('hidden', !dark);
  const btm = document.querySelector('.btm-bar');
  if (btm) btm.style.display = step === 1 ? 'flex' : 'none';
  [1,2,3,4,5].forEach(n => {
    const el = document.getElementById('s' + n + 'tab');
    if (!el) return;
    el.className = 'step' + (n < step ? ' done' : n === step ? ' active' : '');
    el.querySelector('.snum').textContent = n < step ? '✓' : String(n);
  });
  if (!dark) document.getElementById('hdrInfo').textContent = `v1.0 · STEP ${step}/5`;
  if (step === 4) initSim();
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
document.querySelectorAll('.cbi').forEach(cb => cb.addEventListener('click', () => cb.classList.toggle('chk')));
document.getElementById('mealTog').addEventListener('click', e => {
  if (e.target.classList.contains('meal-btn')) {
    document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('sel'));
    e.target.classList.add('sel');
  }
});
const reqTA = document.getElementById('clientRequest');
const charEl = document.getElementById('charCount');
if (reqTA && charEl) reqTA.addEventListener('input', () => { charEl.textContent = reqTA.value.length; });

function updateReqCount() {
  const ok = [!!document.getElementById('region').value, !!document.getElementById('attendees').value, !!document.getElementById('eventDate').value];
  document.getElementById('reqCount').textContent = ok.filter(Boolean).length + ' / 3';
}
['region','attendees','eventDate'].forEach(id => {
  const el = document.getElementById(id);
  if (el) { el.addEventListener('change', updateReqCount); el.addEventListener('input', updateReqCount); }
});

function collectForm() {
  return {
    required: {
      region: document.getElementById('region').value || '(지역 미입력)',
      attendees: +document.getElementById('attendees').value || 100,
      event_date: document.getElementById('eventDate').value || '미정',
      event_time: document.getElementById('eventTime').value || '10:00',
      vip_attendance: vipOn,
      budget_krw: getBudgetNum(),
    },
    optional: {
      event_types: [...document.querySelectorAll('#eventTypes .tbtn2.sel')].map(b => b.dataset.v),
      event_theme: document.getElementById('eventTheme')?.value || null,
      screen_quality: document.querySelector('input[name="screen"]:checked')?.value || null,
      audio_quality: document.querySelector('input[name="audio"]:checked')?.value || null,
      accommodation: +document.getElementById('accommodation').value || 0,
      parking_spots: +document.getElementById('parking').value || 0,
      meal_included: document.querySelector('.meal-btn.sel')?.dataset.v || '미포함',
      lighting: [...document.querySelectorAll('#lighting .cbi.chk')].map(c => c.dataset.v),
    },
    client_request: document.getElementById('clientRequest')?.value?.trim() || '',
    meta: { submitted_at: new Date().toISOString() },
  };
}

document.getElementById('btnStep1Next').addEventListener('click', () => {
  APP.formData = collectForm();
  APP.requestText = APP.formData.client_request;
  APP.parsedRequest = null;
  goTo(2);
  buildCondPills();
  runRecommendation();
});

/* ═══════════════════════════════════════
   STEP 2 — 추천
═══════════════════════════════════════ */
document.getElementById('btnBack').addEventListener('click', () => goTo(1));
document.getElementById('btnRetry').addEventListener('click', runRecommendation);

function buildCondPills() {
  const r = APP.formData.required, o = APP.formData.optional;
  const pills = [['지역',r.region],['인원',r.attendees+'명']];
  if (r.event_date !== '미정') pills.push(['일시',r.event_date]);
  if (r.vip_attendance) pills.push(['VIP','참석']);
  const b = r.budget_krw;
  pills.push(['예산', b>=1e8?(b/1e8).toFixed(1)+'억원':(b/1e4).toLocaleString()+'만원']);
  if (o.event_types?.length) pills.push(['유형',o.event_types[0]]);
  if (o.meal_included !== '미포함') pills.push(['식사',o.meal_included]);
  const uploaded = getUploadedVenues();
  const uploadedTag = uploaded.length > 0
    ? `<span style="margin-left:8px;padding:3px 9px;background:#F0FDF4;color:#166534;border-radius:4px;font-size:10px;font-family:var(--mono);border:1px solid #BBF7D0">📂 업로드 ${uploaded.length}개 반영</span>`
    : '';
  const reqTag = APP.requestText
    ? `<span style="padding:3px 10px;background:#EEF2FF;color:#4338CA;border-radius:4px;font-size:10px;font-family:var(--mono);border:1px solid #C7D2FE">✦ 요청사항 AI 분석</span>`
    : '';
  document.getElementById('condBar').innerHTML =
    pills.map(([k,v])=>`<div class="pill"><span class="pill-k">${k}</span>${v}</div>`).join('') +
    `<span style="margin-left:auto;display:flex;gap:6px;align-items:center">${reqTag}${uploadedTag}</span>`;
}

async function runRecommendation() {
  document.getElementById('ldState').style.display = 'flex';
  document.getElementById('errState').classList.remove('vis');
  document.getElementById('results').classList.remove('vis');
  ['ls1','ls2','ls3'].forEach((id,i) => {
    const el = document.getElementById(id); el.classList.remove('vis','done');
    setTimeout(()=>{ el.classList.add('vis'); setTimeout(()=>el.classList.add('done'),400); }, 300+i*600);
  });
  if (APP.requestText && APP.requestText.length > 10) APP.parsedRequest = await analyzeRequest(APP.requestText);
  else APP.parsedRequest = null;
  setTimeout(() => {
    document.getElementById('ldState').style.display = 'none';
    renderVenues(scoreAndRank());
  }, 2200);
}

async function analyzeRequest(text) {
  const SYS = `클라이언트 요청을 분석하여 JSON만 출력하세요:
{"keywords":["키워드3~6개"],"requirements":["요구사항2~4개"],"concerns":["우려사항"],"summary":"한문장요약"}`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:400, system:SYS,
        messages:[{role:'user',content:`요청사항:\n"${text}"`}] }),
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return JSON.parse(json.content[0].text.trim().replace(/^```json|^```|```$/gm,'').trim());
  } catch { return fallbackParse(text); }
}

function fallbackParse(text) {
  const t = text.toLowerCase();
  const keywords = [], requirements = [], concerns = [];
  if (/주차/.test(t)) { keywords.push('주차'); const m=text.match(/주차\s*(\d+)대/); requirements.push(m?`주차 ${m[1]}대 이상`:'충분한 주차'); if (/불편/.test(t)) concerns.push('이전 주차 불편 경험'); }
  if (/대표|vip|품격/.test(t)) { keywords.push('VIP품격'); requirements.push('품격 있는 VIP 공간'); }
  if (/뒷풀이|식사/.test(t)) { keywords.push('뒷풀이'); requirements.push('뒷풀이 공간 연계'); }
  if (/강남/.test(t)) keywords.push('강남권');
  if (!keywords.length) keywords.push('행사 품질');
  return { keywords, requirements, concerns, summary: text.slice(0,60)+(text.length>60?'...':'') };
}

function scoreAndRank() {
  const r = APP.formData.required, p = APP.parsedRequest;
  const all = getAllVenues();
  return all.map(venue => {
    let score = venue.base_score, notes = [];
    if (r.vip_attendance && (venue.tags?.includes('vip')||venue.tags?.includes('vip적합')||venue.type?.includes('특급'))) score += 3;
    if (r.attendees) { const cap=parseInt((venue.specs?.capacity||'9999').replace(/[^0-9]/g,'')); if(r.attendees>cap) score -= 18; }
    if (p) {
      const kws = (p.keywords||[]).map(k=>k.toLowerCase());
      if (kws.some(k=>k.includes('주차')) && venue.tags?.includes('주차여유')) { score+=6; notes.push('✅ 넉넉한 주차 (요청 반영)'); }
      if (kws.some(k=>k.includes('vip')||k.includes('품격')) && venue.tags?.some(t=>/vip|품격/.test(t))) { score+=5; notes.push('✅ VIP 행사 최적화'); }
      if (kws.some(k=>k.includes('뒷풀이')) && venue.tags?.includes('뒷풀이가능')) { score+=4; notes.push('✅ 뒷풀이 공간 연계 가능'); }
      if (kws.some(k=>k.includes('숙박')) && venue.tags?.includes('숙박가능')) { score+=4; notes.push('✅ 숙박 가능'); }
    }
    // 업로드된 장소에 재사용 추천 태그 있으면 가점
    if (venue.tags?.includes('재사용추천')) { score+=3; }
    return { ...venue, match_percent: Math.min(98, Math.max(58, Math.round(score))), matchNotes: notes };
  }).sort((a,b)=>b.match_percent-a.match_percent).slice(0,5).map((v,i)=>({...v,rank:i+1}));
}

function renderVenues(venues) {
  document.getElementById('resultCount').textContent = venues.length;
  const list = document.getElementById('venueList');
  list.innerHTML = '';
  venues.forEach(v => {
    const rk = Math.min(v.rank,5), card = document.createElement('div');
    card.className = `vc rk${rk}`;
    const prosH=(v.pros||[]).map(p=>`<div class="ri"><div class="ri-icon pro">${p.icon}</div><div class="ri-text"><strong>${p.title}</strong><br>${p.desc}</div></div>`).join('');
    const cauH=(v.cautions||[]).map(c=>`<div class="ri"><div class="ri-icon warn">${c.icon}</div><div class="ri-text"><strong>${c.title}</strong><br>${c.desc}</div></div>`).join('');
    const SL={capacity:'수용인원',area:'면적',ceiling:'천고',parking:'주차',av:'AV',catering:'케이터링'};
    const specH=Object.entries(v.specs||{}).map(([k,val])=>`<div class="spec"><div class="spec-k">${SL[k]||k}</div><div class="spec-v">${val}</div></div>`).join('');
    const matchBanner=v.matchNotes?.length?`<div class="req-match-banner"><span>🎯</span><div><strong>요청사항 반영</strong><br>${v.matchNotes.join(' · ')}</div></div>`:'';
    const uploadedBadge=v._uploaded_at?`<span style="font-size:9px;background:#F0FDF4;color:#166534;border:1px solid #BBF7D0;border-radius:3px;padding:1px 6px;font-family:var(--mono);margin-left:6px">📂 업로드 장소</span>`:'';
    card.innerHTML=`
      <div class="vc-main">
        <div class="rnk">${v.rank}</div>
        <div>
          <div class="vc-top">
            <div class="vname">${v.name}${uploadedBadge}</div>
            <div class="vtags"><span class="vtag vtag-type">${v.type||''}</span>${rk===1?'<span class="vtag vtag-top">★ BEST</span>':''}</div>
          </div>
          <div class="vsum">${v.summary}</div>
          <div class="match-row"><span class="match-lbl">매칭률</span><div class="match-bar"><div class="match-fill" data-pct="${v.match_percent}"></div></div><span class="match-pct">${v.match_percent}%</span></div>
        </div>
        <div class="vc-right">
          <div><div class="vprice-lbl">예상 대관료</div><div class="vprice-val">${v.price_range||'문의'}</div></div>
          <button class="btn-sel">선택하기</button>
        </div>
      </div>
      ${matchBanner}
      <div class="dp"><div class="dp-inner">
        <div class="dp-grid">
          <div><div class="dp-sec-ttl">추천 이유</div><div class="reasons">${prosH}</div>${cauH?`<div style="margin-top:14px"><div class="dp-sec-ttl">주의사항</div><div class="reasons">${cauH}</div></div>`:''}</div>
          <div><div class="dp-sec-ttl">장소 스펙</div><div class="specs-g">${specH}</div><div class="spec-loc">📍 ${v.location||''}</div></div>
        </div>
        <div class="dp-footer"><div class="dp-note">이 장소로 배치 시뮬레이션을 시작합니다</div><button class="btn-proceed">이 장소로 배치 시뮬레이션 →</button></div>
      </div></div>`;
    card.querySelector('.vc-main').addEventListener('click',()=>toggleDp(card));
    card.querySelector('.btn-sel').addEventListener('click',e=>{e.stopPropagation();pickVenue(card,v);});
    card.querySelector('.btn-proceed').addEventListener('click',()=>{pickVenue(card,v);goToSim(v);});
    list.appendChild(card);
  });
  document.getElementById('results').classList.add('vis');
  requestAnimationFrame(()=>setTimeout(()=>{document.querySelectorAll('.match-fill').forEach(b=>{b.style.width=b.dataset.pct+'%';});},100));
}

function toggleDp(card) { const dp=card.querySelector('.dp'),was=dp.classList.contains('open'); document.querySelectorAll('.dp.open').forEach(d=>d.classList.remove('open')); if(!was)dp.classList.add('open'); }
function pickVenue(card,v) { document.querySelectorAll('.vc').forEach(c=>c.classList.remove('sel')); card.classList.add('sel'); APP.selectedVenue=v; document.querySelectorAll('.dp.open').forEach(d=>d.classList.remove('open')); card.querySelector('.dp').classList.add('open'); }
function goToSim(v) { APP.selectedVenue=v; goTo(4); }

/* ═══════════════════════════════════════
   어드민 패널 (Ctrl+Shift+A / 로고 5번)
═══════════════════════════════════════ */
let tapN=0,tapT=null;
document.querySelector('.logo').addEventListener('click',()=>{ tapN++; clearTimeout(tapT); tapT=setTimeout(()=>tapN=0,2000); if(tapN>=5){tapN=0;openAdmin();} });
document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.key==='A'){e.preventDefault();openAdmin();} });

function openAdmin() {
  if (document.getElementById('admPanel')) return;

  const panel = document.createElement('div');
  panel.id = 'admPanel';
  panel.innerHTML = `<style>
    #admPanel{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.52);display:flex;align-items:center;justify-content:center}
    .am{background:#fff;border-radius:13px;width:860px;max-width:96vw;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 24px 70px rgba(0,0,0,.22);overflow:hidden}
    .am-hdr{padding:18px 26px;border-bottom:1px solid #E5E3DC;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
    .am-hdr h2{font-size:15px;font-weight:700;color:#1A1A1A}
    .am-hdr p{font-size:11px;color:#9A9690;margin-top:2px}
    .am-close{border:1.5px solid #E5E3DC;background:none;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:13px;color:#9A9690;transition:all .15s}
    .am-close:hover{background:#F4F3EF;color:#1A1A1A}
    .am-tabs{display:flex;padding:0 26px;border-bottom:1px solid #E5E3DC;flex-shrink:0;gap:2px}
    .am-tab{padding:10px 16px;font-size:12px;font-weight:600;color:#ABA99F;border:none;border-bottom:2.5px solid transparent;background:none;cursor:pointer;font-family:'Pretendard',sans-serif;transition:all .15s}
    .am-tab.on{color:#1A1A1A;border-bottom-color:#1A1A1A}
    .am-body{flex:1;overflow-y:auto;padding:24px 26px}
    .tp{display:none}.tp.on{display:block}

    /* 직접 입력 폼 */
    .form-section{margin-bottom:22px}
    .form-sec-title{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#ABA99F;font-family:'DM Mono',monospace;padding-bottom:8px;border-bottom:1px solid #E5E3DC;margin-bottom:12px}
    .form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
    .form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
    .form-grid-1{margin-bottom:10px}
    .fg label{font-size:11px;font-weight:600;color:#6B6860;display:block;margin-bottom:5px}
    .fg input,.fg select,.fg textarea{width:100%;padding:8px 11px;font-size:13px;font-family:'Pretendard',sans-serif;border:1.5px solid #E5E3DC;border-radius:6px;outline:none;background:#F9F8F5;transition:border-color .15s}
    .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:#1A1A1A;background:#fff}
    .fg textarea{resize:vertical;min-height:64px;line-height:1.6}
    .fg-note{font-size:10px;color:#ABA99F;margin-top:4px}
    .form-save-btn{display:flex;align-items:center;gap:8px;margin-top:20px;padding:11px 24px;background:#1A1A1A;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Pretendard',sans-serif;transition:opacity .15s}
    .form-save-btn:hover{opacity:.85}

    /* 업로드 탭 */
    .upload-zone{border:2.5px dashed #C7D2FE;border-radius:10px;padding:36px;text-align:center;cursor:pointer;background:#F8F8FF;transition:all .2s;margin-bottom:14px}
    .upload-zone:hover,.upload-zone.drag{background:#EEF2FF;border-color:#6366F1}
    .upload-result{padding:11px 14px;border-radius:7px;font-size:12px;display:flex;align-items:flex-start;gap:9px;margin-bottom:7px;line-height:1.6}
    .upload-result.ok{background:#F0FDF4;border:1px solid #BBF7D0;color:#166534}
    .upload-result.err{background:#FEF2F2;border:1px solid #FECACA;color:#C84B31}
    .upload-result.loading{background:#F0F0FF;border:1px solid #C7D2FE;color:#4338CA}

    /* 등록 장소 */
    .venue-chip{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:#F9F8F5;border:1px solid #E5E3DC;border-radius:8px;margin-bottom:6px}
    .venue-chip-name{font-size:13px;font-weight:600;margin-bottom:3px}
    .venue-chip-meta{font-size:10px;color:#9A9690;font-family:'DM Mono',monospace;line-height:1.6}
    .chip-del{padding:5px 11px;border:1.5px solid #E5E3DC;background:none;border-radius:5px;font-size:11px;cursor:pointer;color:#ABA99F;transition:all .15s}
    .chip-del:hover{border-color:#C84B31;color:#C84B31;background:#FEF2F2}

    /* 중복 확인 다이얼로그 */
    .dup-dialog{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center}
    .dup-box{background:#fff;border-radius:12px;padding:28px 32px;width:420px;box-shadow:0 16px 48px rgba(0,0,0,.18)}
    .dup-title{font-size:15px;font-weight:700;margin-bottom:8px}
    .dup-msg{font-size:13px;color:#6B6860;line-height:1.6;margin-bottom:20px}
    .dup-btns{display:flex;gap:8px;justify-content:flex-end}
    .dup-btn-cancel{padding:9px 18px;border:1.5px solid #E5E3DC;background:#fff;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Pretendard',sans-serif}
    .dup-btn-ok{padding:9px 18px;border:none;background:#1A1A1A;color:#fff;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Pretendard',sans-serif}
  </style>
  <div class="am">
    <div class="am-hdr">
      <div><h2>⚙ 관리자 패널</h2><p>장소 데이터 입력 · 업로드 · 관리 (Ctrl+Shift+A)</p></div>
      <button class="am-close" id="amClose">✕</button>
    </div>
    <div class="am-tabs">
      <button class="am-tab on" data-t="form">✏️ 직접 입력</button>
      <button class="am-tab" data-t="upload">📂 파일 업로드</button>
      <button class="am-tab" data-t="list">📋 등록 장소</button>
    </div>
    <div class="am-body">

      <!-- ══════════ 탭 1: 직접 입력 폼 ══════════ -->
      <div class="tp on" id="tp-form">

        <div class="form-section">
          <div class="form-sec-title">① 기본 정보 ★ 필수</div>
          <div class="form-grid-2">
            <div class="fg"><label>장소명 ★</label><input id="f-name" type="text" placeholder="예: 롤링힐스 호텔 포럼홀"></div>
            <div class="fg"><label>사용 공간 / 층수</label><input id="f-space" type="text" placeholder="예: 포럼홀, 지하1층"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>장소 유형 ★</label>
              <select id="f-type">
                <option value="">선택하세요</option>
                <option>호텔 연회장</option><option>특급호텔 연회장</option><option>리조트</option>
                <option>연수원</option><option>전문 컨벤션센터</option><option>특수 이벤트홀</option><option>기타</option>
              </select>
            </div>
            <div class="fg"><label>지역</label><input id="f-region" type="text" placeholder="예: 경기/화성"></div>
          </div>
          <div class="form-grid-1">
            <div class="fg"><label>주소</label><input id="f-addr" type="text" placeholder="예: 경기도 화성시 남양읍 시청로 290"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>대관 담당자 연락처</label><input id="f-contact" type="text" placeholder="이름 / 이메일 / 전화번호"></div>
            <div class="fg"><label>예약 방법</label><input id="f-booking" type="text" placeholder="예: 담당자 직통 연락"></div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">② 공간 스펙</div>
          <div class="form-grid-3">
            <div class="fg"><label>면적</label><input id="f-area" type="text" placeholder="예: 약 240㎡ (20×12m)"></div>
            <div class="fg"><label>수용 인원 (강의식)</label><input id="f-cap-lec" type="text" placeholder="예: 50명"></div>
            <div class="fg"><label>수용 인원 (연회식)</label><input id="f-cap-ban" type="text" placeholder="예: 30명"></div>
          </div>
          <div class="form-grid-3">
            <div class="fg"><label>층고</label><input id="f-ceiling" type="text" placeholder="예: 3.5m"></div>
            <div class="fg"><label>바닥 재질</label><input id="f-floor" type="text" placeholder="예: 카펫"></div>
            <div class="fg"><label>무대 / 연단</label><input id="f-stage" type="text" placeholder="예: 연단 1개, 무대 없음"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>짐 반입 동선 / 화물 엘리베이터</label><input id="f-cargo" type="text" placeholder="예: 지하 주차장 경유, 화물EV 없음"></div>
            <div class="fg"><label>반입 가능 시간</label><input id="f-time" type="text" placeholder="예: 제한 없음 (24시까지 진행 가능)"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>기둥 (시야 방해 여부)</label><input id="f-col" type="text" placeholder="예: 기둥 없음"></div>
            <div class="fg"><label>출입문 개수 / 위치</label><input id="f-door" type="text" placeholder="예: 1개, 복도 측"></div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">③ AV / 스크린 / 조명</div>
          <div class="form-grid-2">
            <div class="fg"><label>LED 유무</label><input id="f-led" type="text" placeholder="예: 없음 / 있음(자체) / 렌탈 가능"></div>
            <div class="fg"><label>스크린 위치 / 수량</label><input id="f-screen" type="text" placeholder="예: 정면 1개, 보조 1개"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>음향 시스템</label><input id="f-sound" type="text" placeholder="예: 조정실 자체 음향 보유"></div>
            <div class="fg"><label>AV 연결 단자</label><input id="f-av" type="text" placeholder="예: HDMI (스크린 왼쪽)"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>조도 조절</label><input id="f-light" type="text" placeholder="예: 온/오프만 가능, 디머 불가"></div>
            <div class="fg"><label>Wi-Fi / 인터넷</label><input id="f-wifi" type="text" placeholder="예: 자체 무선 100MB"></div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">④ 로비 / 동선 / 시설</div>
          <div class="form-grid-2">
            <div class="fg"><label>로비 / 복도 공간</label><input id="f-lobby" type="text" placeholder="예: 홀 앞 복도 폭 약 3m"></div>
            <div class="fg"><label>VIP룸 / 대기실</label><input id="f-vip" type="text" placeholder="예: 없음 / 있음(별도 과금)"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>홀까지 주요 동선</label><input id="f-route" type="text" placeholder="예: 1층 에스컬레이터 → B1 포럼홀"></div>
            <div class="fg"><label>엘리베이터</label><input id="f-elev" type="text" placeholder="예: 2개, 전용 없음"></div>
          </div>
          <div class="form-grid-2">
            <div class="fg"><label>부대시설</label><input id="f-amenity" type="text" placeholder="예: 수영장, 사우나, 헬스장, 탁구장"></div>
            <div class="fg"><label>벽/천장 부착</label><input id="f-attach" type="text" placeholder="예: 테이프 부착 허용, 원상복구 필요"></div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">⑤ 식음 / 주차 / 편의</div>
          <div class="form-grid-2">
            <div class="fg"><label>케이터링</label><input id="f-catering" type="text" placeholder="예: 자체 가능 (커피/차/과일/베이커리)"></div>
            <div class="fg"><label>식당 별도룸</label><input id="f-rest" type="text" placeholder="예: PDR룸 2개 (더키친)"></div>
          </div>
          <div class="form-grid-3">
            <div class="fg"><label>주차 대수</label><input id="f-park" type="text" placeholder="예: 약 80대 이상"></div>
            <div class="fg"><label>주차 요금</label><input id="f-parkfee" type="text" placeholder="예: 무료 (항시 개방)"></div>
            <div class="fg"><label>자체 카페</label><input id="f-cafe" type="text" placeholder="예: 있음 (후불 가능)"></div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">⑥ 비용</div>
          <div class="form-grid-3">
            <div class="fg"><label>대관료 — 행사일</label><input id="f-fee1" type="text" placeholder="예: 121만원/일"></div>
            <div class="fg"><label>대관료 — 셋업일</label><input id="f-fee2" type="text" placeholder="예: 99만원/일"></div>
            <div class="fg"><label>AV 별도 비용</label><input id="f-avfee" type="text" placeholder="예: 없음 / 있음"></div>
          </div>
          <div class="form-grid-1">
            <div class="fg"><label>취소/변경 규정 / 기타 비용</label><input id="f-cancel" type="text" placeholder="예: 별도 규정 확인 필요"></div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">⑦ 행사 후 평가 ★ AI 추천 점수에 직접 반영</div>
          <div class="form-grid-2">
            <div class="fg">
              <label>AV · 시설 만족도</label>
              <select id="f-eval-av">
                <option value="">선택</option>
                <option value="5">5점 — 매우 우수</option><option value="4">4점 — 좋음</option>
                <option value="3">3점 — 보통</option><option value="2">2점 — 아쉬움</option><option value="1">1점 — 불만족</option>
              </select>
              <div class="fg-note">예: 일반 세미나에는 충분한 수준</div>
            </div>
            <div class="fg">
              <label>접근성 · 주차 만족도</label>
              <select id="f-eval-acc">
                <option value="">선택</option>
                <option value="5">5점 — 매우 우수</option><option value="4">4점 — 좋음</option>
                <option value="3">3점 — 보통</option><option value="2">2점 — 아쉬움</option><option value="1">1점 — 불만족</option>
              </select>
              <div class="fg-note">예: 대중교통 매우 불편, 주차는 무료</div>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="fg">
              <label>식음 만족도</label>
              <select id="f-eval-food">
                <option value="">선택</option>
                <option value="5">5점 — 매우 우수</option><option value="4">4점 — 좋음</option>
                <option value="3">3점 — 보통</option><option value="2">2점 — 아쉬움</option><option value="1">1점 — 불만족</option>
              </select>
            </div>
            <div class="fg">
              <label>재사용 의사</label>
              <select id="f-reuse">
                <option value="">선택</option>
                <option value="Y">Y — 재사용 의사 있음</option>
                <option value="N">N — 재사용 의사 없음</option>
              </select>
            </div>
          </div>
          <div class="form-grid-1">
            <div class="fg">
              <label>종합 의견 (자유 서술)</label>
              <textarea id="f-comment" placeholder="예) 기본 시설 퀄리티가 좋아 재사용 의사 있음. 클라이언트의 숙식 만족도 높은 편. 단, 식음 반찬 구성이 단촐하고 대중교통 접근성 매우 불편."></textarea>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-sec-title">⑧ 숙박 / 기타</div>
          <div class="form-grid-3">
            <div class="fg"><label>객실 수 (1인실 / 2인실)</label><input id="f-rooms" type="text" placeholder="예: 1인실 50, 2인실 30"></div>
            <div class="fg"><label>인근 의료기관</label><input id="f-med" type="text" placeholder="예: 화성시 제일병원 (차량 10분)"></div>
            <div class="fg"><label>주변 카페 / 식당</label><input id="f-nearby" type="text" placeholder="예: 편의점 외 없음, 도보 이동 어려움"></div>
          </div>
        </div>

        <button class="form-save-btn" id="formSaveBtn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          장소 저장하기
        </button>
      </div>

      <!-- ══════════ 탭 2: 파일 업로드 ══════════ -->
      <div class="tp" id="tp-upload">
        <div style="background:#EEF2FF;border:1.5px solid #C7D2FE;border-radius:8px;padding:14px 18px;margin-bottom:16px;font-size:12px;line-height:1.75;color:#3730A3">
          <b style="font-size:13px;display:block;margin-bottom:4px">📂 기존 엑셀 양식을 그대로 업로드하세요</b>
          <span style="color:#6366F1"><b>유니크플랜 행사 장소 데이터 템플릿 (.xlsx)</b></span> 파일을 업로드하면<br>
          모든 내용을 자동으로 읽어 AI 추천에 즉시 반영합니다.<br>
          <span style="color:#9A9690;font-size:11px">여러 파일을 동시에 선택 가능 · 장소가 쌓일수록 추천 정확도가 높아집니다</span>
        </div>
        <div class="upload-zone" id="uploadZone">
          <div style="font-size:32px;margin-bottom:10px">📊</div>
          <div style="font-size:14px;font-weight:700;color:#4338CA;margin-bottom:4px">여기에 .xlsx 파일을 드래그하거나 클릭하여 선택</div>
          <div style="font-size:11px;color:#9A9690">유니크플랜 행사 장소 데이터 템플릿 형식 지원</div>
          <input type="file" id="xlsxInput" accept=".xlsx,.xls" multiple style="display:none">
        </div>
        <div id="uploadResults"></div>
      </div>

      <!-- ══════════ 탭 3: 등록 장소 ══════════ -->
      <div class="tp" id="tp-list">
        <div id="amList"></div>
      </div>
    </div>
  </div>`;

  document.body.appendChild(panel);
  document.getElementById('amClose').addEventListener('click', closeAdmin);
  panel.addEventListener('click', e => { if (e.target === panel) closeAdmin(); });

  /* ── 탭 전환 ── */
  panel.querySelectorAll('.am-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.am-tab').forEach(t => t.classList.remove('on'));
      panel.querySelectorAll('.tp').forEach(p => p.classList.remove('on'));
      tab.classList.add('on');
      document.getElementById('tp-' + tab.dataset.t).classList.add('on');
      if (tab.dataset.t === 'list') renderAdmList();
    });
  });

  /* ════════════════════════════════════
     중복 체크 유틸 (이름 기반)
  ════════════════════════════════════ */
  function checkDuplicate(name) {
    const all = getUploadedVenues();
    return all.find(v => v.name.trim() === name.trim()) || null;
  }

  function confirmOverwrite(name) {
    return new Promise(resolve => {
      const dlg = document.createElement('div');
      dlg.className = 'dup-dialog';
      dlg.innerHTML = `
        <div class="dup-box">
          <div class="dup-title">⚠️ 이미 등록된 장소입니다</div>
          <div class="dup-msg"><b>"${name}"</b>이(가) 이미 등록되어 있습니다.<br>기존 데이터를 새 데이터로 덮어쓰시겠습니까?</div>
          <div class="dup-btns">
            <button class="dup-btn-cancel" id="dupCancel">취소 (유지)</button>
            <button class="dup-btn-ok" id="dupOk">덮어쓰기</button>
          </div>
        </div>`;
      document.body.appendChild(dlg);
      document.getElementById('dupOk').addEventListener('click', () => { dlg.remove(); resolve(true); });
      document.getElementById('dupCancel').addEventListener('click', () => { dlg.remove(); resolve(false); });
    });
  }

  function upsertVenue(venue) {
    const all = getUploadedVenues();
    const idx = all.findIndex(v => v.name.trim() === venue.name.trim());
    if (idx >= 0) { all[idx] = venue; } else { all.push(venue); }
    saveUploadedVenues(all);
  }

  /* ════════════════════════════════════
     탭 1: 직접 입력 폼 저장
  ════════════════════════════════════ */
  document.getElementById('formSaveBtn').addEventListener('click', async () => {
    const name = document.getElementById('f-name').value.trim();
    const type = document.getElementById('f-type').value;
    if (!name) { alert('장소명은 필수입니다.'); return; }
    if (!type) { alert('장소 유형을 선택해주세요.'); return; }

    // 중복 체크
    const dup = checkDuplicate(name);
    if (dup) {
      const ok = await confirmOverwrite(name);
      if (!ok) return;
    }

    const avScore   = +document.getElementById('f-eval-av').value   || 3;
    const accScore  = +document.getElementById('f-eval-acc').value  || 3;
    const foodScore = +document.getElementById('f-eval-food').value || 3;
    const baseScore = Math.max(50, Math.min(98, Math.round((avScore + accScore + foodScore) / 3 * 20)));

    const reuse   = document.getElementById('f-reuse').value;
    const comment = document.getElementById('f-comment').value.trim();
    const cap     = document.getElementById('f-cap-lec').value.trim();
    const parking = document.getElementById('f-park').value.trim();

    // 태그 자동 생성
    const tags = [];
    const parkFee = document.getElementById('f-parkfee').value;
    if (/무료|없음|개방/.test(parkFee)) tags.push('주차여유');
    if (/숙박|객실|리조트|연수원/.test(name + document.getElementById('f-rooms').value)) tags.push('숙박가능');
    if (/PDR|별도\s*룸|뒷풀이/.test(document.getElementById('f-rest').value)) tags.push('뒷풀이가능');
    if (/서울/.test(document.getElementById('f-addr').value)) tags.push('서울');
    if (/경기|인천/.test(document.getElementById('f-addr').value)) tags.push('경기인천');
    if (reuse === 'Y') tags.push('재사용추천');
    if (/VIP|임원|대표/.test(comment)) tags.push('vip적합');

    // 강점 자동 생성
    const pros = [];
    const catering = document.getElementById('f-catering').value.trim();
    if (catering && !/없음|불가/.test(catering)) pros.push({ icon:'✦', title:'자체 케이터링', desc: catering });
    const restRoom = document.getElementById('f-rest').value.trim();
    if (restRoom && !/없음/.test(restRoom)) pros.push({ icon:'✦', title:'식당 별도룸', desc: restRoom });
    if (/무료|없음|개방/.test(parkFee)) pros.push({ icon:'✦', title:'무료 주차', desc: parking + (parkFee ? ' — ' + parkFee : '') });
    if (reuse === 'Y') pros.push({ icon:'✦', title:'재사용 의사 있음', desc: comment || '유니크플랜 담당자가 재사용을 추천하는 장소입니다.' });
    if (!pros.length) pros.push({ icon:'✦', title:'직접 입력 검증 장소', desc: comment || '유니크플랜 담당자가 직접 입력한 장소입니다.' });

    // 주의사항
    const cautions = [];
    if (accScore <= 2) cautions.push({ icon:'△', title:'접근성 주의', desc:'대중교통 접근이 불편합니다. 자가용 이동을 권장합니다.' });
    const led = document.getElementById('f-led').value;
    if (/없음|없다/.test(led)) cautions.push({ icon:'△', title:'LED 없음', desc:'고품질 영상 연출 시 외부 렌탈이 필요합니다.' });

    const fee1 = document.getElementById('f-fee1').value.trim();
    const fee2 = document.getElementById('f-fee2').value.trim();
    const priceRange = fee1 ? (fee2 ? `${fee1} (셋업 ${fee2})` : fee1) : '문의';

    const summary = comment || `${name} — 유니크플랜 담당자가 직접 입력한 장소입니다.`;

    const venue = {
      id: 'form_' + Date.now(),
      name,
      type,
      base_score: baseScore,
      location: document.getElementById('f-addr').value.trim() || document.getElementById('f-region').value.trim(),
      price_range: priceRange,
      summary: summary.slice(0, 200),
      tags,
      pros: pros.slice(0, 3),
      cautions: cautions.slice(0, 2),
      specs: {
        capacity: cap || document.getElementById('f-cap-ban').value.trim() || '문의',
        area:     document.getElementById('f-area').value.trim() || '문의',
        ceiling:  document.getElementById('f-ceiling').value.trim() || '문의',
        parking:  parking || '문의',
        av:       document.getElementById('f-sound').value.trim() || '문의',
        catering: catering || '문의',
      },
      _source: 'form',
      _uploaded_at: new Date().toISOString(),
    };

    upsertVenue(venue);
    closeAdmin();
    showToast(`✅ "${name}" ${dup ? '업데이트' : '등록'} 완료 (추천점수 ${baseScore}점)`);
  });

  /* ════════════════════════════════════
     탭 2: 엑셀 업로드
  ════════════════════════════════════ */
  const zone = panel.querySelector('#uploadZone');
  const input = panel.querySelector('#xlsxInput');
  const results = panel.querySelector('#uploadResults');

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag'); processXLSXFiles([...e.dataTransfer.files]); });
  input.addEventListener('change', e => processXLSXFiles([...e.target.files]));

  async function processXLSXFiles(files) {
    if (typeof XLSX === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      document.head.appendChild(script);
      await new Promise((res, rej) => { script.onload = res; script.onerror = rej; });
    }
    for (const file of files) {
      if (!file.name.match(/\.xlsx?$/i)) { addResult(results,'err',`❌ ${file.name}`,'.xlsx 파일만 업로드 가능합니다.'); continue; }
      const loadRow = addResult(results,'loading',`⏳ ${file.name}`,'파일 읽는 중...');
      try {
        const buf = await file.arrayBuffer();
        const rawData = parseXLSX(buf);
        const venue = xlsxDataToVenue(rawData);

        // 중복 체크
        const dup = checkDuplicate(venue.name);
        if (dup) {
          const ok = await confirmOverwrite(venue.name);
          if (!ok) { loadRow.className='upload-result'; loadRow.innerHTML=`<span>⏭</span><div><b>${venue.name}</b> — 기존 데이터 유지</div>`; continue; }
        }

        upsertVenue(venue);
        loadRow.className = 'upload-result ok';
        loadRow.innerHTML = `<span>✅</span><div><b>${venue.name}</b> ${dup?'업데이트':'추가'} 완료 <span style="font-size:10px;color:#9A9690;margin-left:6px">추천점수 ${venue.base_score}점</span><br><span style="font-size:11px;color:#4B7A4B">태그: ${venue.tags.join(', ')||'없음'}</span></div>`;
        showToast(`✅ "${venue.name}" 학습 완료`);
      } catch(err) {
        loadRow.className = 'upload-result err';
        loadRow.innerHTML = `<span>❌</span><div><b>${file.name}</b><br>${err.message}</div>`;
      }
    }
  }

  function addResult(container, type, title, desc) {
    const row = document.createElement('div');
    row.className = `upload-result ${type}`;
    row.innerHTML = `<span>${type==='loading'?'⏳':type==='ok'?'✅':'❌'}</span><div><b>${title}</b><br>${desc}</div>`;
    container.appendChild(row);
    return row;
  }

  /* ════════════════════════════════════
     탭 3: 등록 장소 목록
  ════════════════════════════════════ */
  function renderAdmList() {
    const box = document.getElementById('amList');
    const builtIn = MOCK_DB.map(v => ({...v, _builtin:true}));
    const uploaded = getUploadedVenues();
    const all = [...builtIn, ...uploaded];

    if (!all.length) { box.innerHTML='<p style="text-align:center;color:#ABA99F;padding:30px">등록된 장소가 없습니다.</p>'; return; }

    const builtInCount = builtIn.length;
    const uploadedCount = uploaded.length;

    box.innerHTML = `
      <div style="display:flex;gap:10px;margin-bottom:14px">
        <div style="padding:10px 16px;background:#F0EFE9;border-radius:8px;flex:1;text-align:center">
          <div style="font-size:20px;font-weight:700;font-family:'DM Mono',monospace">${builtInCount}</div>
          <div style="font-size:11px;color:#9A9690;margin-top:2px">기본 내장</div>
        </div>
        <div style="padding:10px 16px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;flex:1;text-align:center">
          <div style="font-size:20px;font-weight:700;font-family:'DM Mono',monospace;color:#166534">${uploadedCount}</div>
          <div style="font-size:11px;color:#166534;margin-top:2px">직접 등록</div>
        </div>
        <div style="padding:10px 16px;background:#EEF2FF;border:1px solid #C7D2FE;border-radius:8px;flex:1;text-align:center">
          <div style="font-size:20px;font-weight:700;font-family:'DM Mono',monospace;color:#4338CA">${all.length}</div>
          <div style="font-size:11px;color:#4338CA;margin-top:2px">총 추천 풀</div>
        </div>
      </div>
      ${all.map(v => `
        <div class="venue-chip">
          <div>
            <div class="venue-chip-name">
              ${v.name}
              ${v._source==='form'?'<span style="font-size:9px;background:#F0F4FF;color:#4338CA;border:1px solid #C7D2FE;border-radius:3px;padding:1px 5px;margin-left:5px">직접입력</span>':''}
              ${v._source==='xlsx'||v._uploaded_at&&!v._builtin&&v._source!=='form'?'<span style="font-size:9px;background:#F0FDF4;color:#166534;border:1px solid #BBF7D0;border-radius:3px;padding:1px 5px;margin-left:5px">엑셀업로드</span>':''}
              ${v._builtin?'<span style="font-size:9px;background:#F4F3EF;color:#ABA99F;border:1px solid #E5E3DC;border-radius:3px;padding:1px 5px;margin-left:5px">기본내장</span>':''}
            </div>
            <div class="venue-chip-meta">
              ${v.type} · ${v.location||'주소 없음'} · 추천점수 ${v.base_score}점
              ${v.tags?.length ? ' · 태그: ' + v.tags.join(', ') : ''}
            </div>
          </div>
          ${!v._builtin ? `<button class="chip-del" data-id="${v.id}">삭제</button>` : '<span style="font-size:10px;color:#ABA99F">내장</span>'}
        </div>`).join('')}`;

    box.querySelectorAll('.chip-del').forEach(btn => {
      btn.addEventListener('click', () => {
        saveUploadedVenues(getUploadedVenues().filter(v => v.id !== btn.dataset.id));
        renderAdmList();
        showToast('장소 삭제됨');
      });
    });
  }
}

function closeAdmin() { const p = document.getElementById('admPanel'); if(p) p.remove(); }

/* ═══════════════════════════════════════
   STEP 4 — 배치 시뮬레이션
═══════════════════════════════════════ */
const PIECES={
  stage:{name:'무대',w:6,h:4,seats:0,color:'#C8C0A8',stroke:'#7A7260',shape:'rect'},
  screen:{name:'스크린',w:4,h:.3,seats:0,color:'#4A6FA5',stroke:'#2D4F85',shape:'rect'},
  podium:{name:'포디엄',w:.6,h:.6,seats:0,color:'#8B7355',stroke:'#6B5335',shape:'rect'},
  roundtable:{name:'원형테이블',w:1.8,h:1.8,seats:10,color:'#E8DFD0',stroke:'#B0A090',shape:'circle'},
  longtable:{name:'긴 테이블',w:2.4,h:.9,seats:8,color:'#E8DFD0',stroke:'#B0A090',shape:'rect'},
  chairrow:{name:'의자 열',w:4,h:.5,seats:8,color:'#D4C9B8',stroke:'#A09080',shape:'rect'},
  reception:{name:'리셉션데스크',w:2,h:.6,seats:0,color:'#B8C4D0',stroke:'#7090B0',shape:'rect'},
  photozone:{name:'포토존',w:3,h:2.5,seats:0,color:'#D8C8E8',stroke:'#9880C0',shape:'rect'},
};
let simOk=false,hallW=30,hallH=20,sc=20;
let items=[],selId=null,hist=[],idc=0;
let isDrag=false,dItem=null,dox=0,doy=0,dType=null;
const CV=document.getElementById('simCanvas'),CX=CV.getContext('2d');

function initSim(){
  if(simOk){calcSc();resCv();redraw();return;}
  simOk=true;drawPalIco();
  document.querySelectorAll('.piece').forEach(p=>{p.setAttribute('draggable','true');p.addEventListener('dragstart',e=>{dType=p.dataset.type;e.dataTransfer.effectAllowed='copy';});});
  CV.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
  CV.addEventListener('drop',e=>{e.preventDefault();if(!dType)return;savH();const R=CV.getBoundingClientRect(),P=PIECES[dType];items.push({id:++idc,type:dType,x:sn(Math.max(0,Math.min(hallW-P.w,(e.clientX-R.left)/sc-P.w/2))),y:sn(Math.max(0,Math.min(hallH-P.h,(e.clientY-R.top)/sc-P.h/2))),rot:0});selId=idc;dType=null;upd();});
  CV.addEventListener('mousedown',e=>{if(e.button!==0)return;const pos=cp(e),hit=ht(pos);if(hit){savH();selId=hit.id;dItem=hit;dox=pos.x-hit.x;doy=pos.y-hit.y;isDrag=true;upd();e.preventDefault();}else{selId=null;upd();}});
  CV.addEventListener('mousemove',e=>{if(!isDrag||!dItem)return;const pos=cp(e),P=PIECES[dItem.type];dItem.x=sn(Math.max(0,Math.min(hallW-P.w,pos.x-dox)));dItem.y=sn(Math.max(0,Math.min(hallH-P.h,pos.y-doy)));upd();});
  CV.addEventListener('mouseup',()=>{isDrag=false;dItem=null;});
  CV.addEventListener('mouseleave',()=>{isDrag=false;dItem=null;});
  CV.addEventListener('dblclick',e=>{const h=ht(cp(e));if(h){savH();h.rot=(h.rot+90)%360;upd();}});
  CV.addEventListener('contextmenu',e=>{e.preventDefault();const h=ht(cp(e));if(h){savH();items=items.filter(i=>i.id!==h.id);if(selId===h.id)selId=null;upd();showToast('삭제됨');}});
  document.getElementById('btnApplyHall').addEventListener('click',()=>{hallW=Math.max(5,Math.min(200,+document.getElementById('hallW').value||30));hallH=Math.max(5,Math.min(200,+document.getElementById('hallH').value||20));document.getElementById('hallW').value=hallW;document.getElementById('hallH').value=hallH;calcSc();resCv();updSI();redraw();showToast(`홀: ${hallW}×${hallH}m`);});
  document.getElementById('btnUndo').addEventListener('click',()=>{if(!hist.length){showToast('취소 불가');return;}const s=JSON.parse(hist.pop());items=s.i;selId=s.s;upd();showToast('실행 취소');});
  document.getElementById('btnClearAll').addEventListener('click',()=>{if(!items.length)return;savH();items=[];selId=null;upd();showToast('전체 삭제');});
  document.getElementById('btnDownloadPNG').addEventListener('click',dlPNG);
  document.getElementById('btnRot90').addEventListener('click',()=>rotS(90));
  document.getElementById('btnRot45').addEventListener('click',()=>rotS(45));
  document.getElementById('btnDelSel').addEventListener('click',()=>{if(!selId)return;savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('삭제됨');});
  document.addEventListener('keydown',e=>{if(APP.step!==4)return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if((e.key==='Delete'||e.key==='Backspace')&&selId){savH();items=items.filter(i=>i.id!==selId);selId=null;upd();showToast('삭제됨');}if((e.key==='r'||e.key==='R')&&selId)rotS(90);if(e.key==='Escape'){selId=null;upd();}});
  [{type:'screen',x:11,y:.5},{type:'stage',x:10,y:1.2},{type:'roundtable',x:3,y:6},{type:'roundtable',x:8,y:6},{type:'roundtable',x:13,y:6},{type:'roundtable',x:18,y:6},{type:'roundtable',x:3,y:11},{type:'roundtable',x:8,y:11},{type:'roundtable',x:13,y:11},{type:'reception',x:12,y:17.5},{type:'photozone',x:.5,y:.5}].forEach(d=>items.push({id:++idc,type:d.type,x:d.x,y:d.y,rot:0}));
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
  if(P.shape==='circle'){const r=pw/2;CX.beginPath();CX.arc(0,0,r,0,Math.PI*2);CX.fillStyle=P.color;CX.fill();CX.shadowColor='transparent';CX.strokeStyle=sel?'#D4A843':P.stroke;CX.lineWidth=sel?2.5:1.5;CX.stroke();for(let i=0;i<P.seats;i++){const a=(i/P.seats)*Math.PI*2-Math.PI/2;CX.save();CX.translate(Math.cos(a)*(r+8),Math.sin(a)*(r+8));CX.rotate(a+Math.PI/2);CX.beginPath();CX.roundRect(-5,-4,10,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();CX.restore();}CX.fillStyle='#706050';CX.font=`bold ${Math.max(8,pw*.18)}px DM Mono,monospace`;CX.textAlign='center';CX.textBaseline='middle';CX.fillText('T·'+P.seats,0,0);}
  else{CX.beginPath();CX.roundRect(-pw/2,-ph/2,pw,ph,3);CX.fillStyle=P.color;CX.fill();CX.shadowColor='transparent';CX.strokeStyle=sel?'#D4A843':P.stroke;CX.lineWidth=sel?2.5:1.5;CX.stroke();if(it.type==='stage'){CX.strokeStyle=P.stroke+'88';CX.lineWidth=1;CX.setLineDash([4,4]);CX.strokeRect(-pw/2+7,-ph/2+7,pw-14,ph-14);CX.setLineDash([]);}if(it.type==='screen'){CX.fillStyle='#2A3F6F';CX.beginPath();CX.roundRect(-pw/2+3,-ph/2+2,pw-6,ph-4,2);CX.fill();}if(it.type==='chairrow'){const cw=pw/P.seats;for(let i=0;i<P.seats;i++){CX.beginPath();CX.roundRect(-pw/2+cw*i+1,-ph/2+1,cw-2,ph-2,2);CX.fillStyle='#C0B4A0';CX.fill();}}if(it.type==='longtable'){const sp=pw/4;for(let i=0;i<4;i++){const lx=-pw/2+sp*i+sp/2;CX.beginPath();CX.roundRect(lx-7,-ph/2-9,14,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();CX.beginPath();CX.roundRect(lx-7,ph/2+1,14,8,2);CX.fillStyle='#C8BCA8';CX.fill();CX.strokeStyle='#A09080';CX.lineWidth=.8;CX.stroke();}}if(it.type==='photozone'){CX.strokeStyle=P.stroke+'60';CX.lineWidth=.8;CX.setLineDash([3,3]);for(let i=1;i<3;i++){CX.beginPath();CX.moveTo(-pw/2+pw/3*i,-ph/2);CX.lineTo(-pw/2+pw/3*i,ph/2);CX.stroke();}CX.setLineDash([]);}const LBL={stage:'무대',screen:'SCREEN',podium:'POD',longtable:'T·8',chairrow:'×'+P.seats,reception:'RECEPTION',photozone:'PHOTO'};CX.fillStyle='#504840';CX.font=`600 ${Math.max(8,Math.min(pw,ph)*.2)}px Pretendard,sans-serif`;CX.textAlign='center';CX.textBaseline='middle';CX.fillText(LBL[it.type]||'',0,0);}
  if(sel){CX.strokeStyle='#D4A843';CX.lineWidth=1.5;CX.setLineDash([5,3]);if(P.shape==='circle'){CX.beginPath();CX.arc(0,0,pw/2+5,0,Math.PI*2);CX.stroke();}else{CX.strokeRect(-pw/2-4,-ph/2-4,pw+8,ph+8);}CX.setLineDash([]);}
  CX.restore();
}
function dlPNG(){const pad=60,tH=44,ec=document.createElement('canvas'),dpr=2;ec.width=(CV.width+pad*2)*dpr;ec.height=(CV.height+pad*2+tH)*dpr;const ex=ec.getContext('2d');ex.scale(dpr,dpr);ex.fillStyle='#fff';ex.fillRect(0,0,ec.width,ec.height);ex.fillStyle='#1A1C1E';ex.fillRect(0,0,CV.width+pad*2,tH);ex.fillStyle='#fff';ex.font='bold 13px Pretendard,sans-serif';ex.textAlign='left';ex.fillText('UNIQUEPLAN — 행사장 배치도',pad,20);if(APP.selectedVenue){ex.fillStyle='#9A9690';ex.font='10px DM Mono,monospace';ex.fillText(APP.selectedVenue.name,pad,35);}ex.fillStyle='#9A9690';ex.font='10px DM Mono,monospace';ex.textAlign='right';ex.fillText(`${hallW}m×${hallH}m · ${new Date().toLocaleDateString('ko-KR')}`,CV.width+pad,20);ex.drawImage(CV,pad,tH+pad);ex.strokeStyle='#E0DDD8';ex.lineWidth=1;ex.strokeRect(pad-8,tH+pad-8,CV.width+16,CV.height+16);const cnt={};items.forEach(i=>{cnt[i.type]=(cnt[i.type]||0)+1;});let lx=pad;const ly=tH+pad+CV.height+20;Object.entries(cnt).forEach(([t,n])=>{ex.fillStyle=PIECES[t].color;ex.fillRect(lx,ly,13,9);ex.strokeStyle=PIECES[t].stroke;ex.lineWidth=1;ex.strokeRect(lx,ly,13,9);ex.fillStyle='#5C5A57';ex.font='9px DM Mono,monospace';ex.textAlign='left';ex.fillText(`${PIECES[t].name}×${n}`,lx+17,ly+8);lx+=100;});const a=document.createElement('a');a.download=`배치도_${Date.now()}.png`;a.href=ec.toDataURL('image/png');a.click();showToast('배치도 PNG 다운로드 완료');}
function drawPalIco(){const IC={stage:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="9" width="28" height="16" rx="2" fill="#C8C0A8" stroke="#7A7260" stroke-width="1.5"/><rect x="6" y="12" width="22" height="10" rx="1" fill="none" stroke="#7A7260" stroke-dasharray="3 2" stroke-width="1"/><text x="17" y="20" text-anchor="middle" font-size="6" fill="#7A7260" font-family="monospace">STAGE</text></svg>`,screen:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="13" width="28" height="8" rx="2" fill="#4A6FA5" stroke="#2D4F85" stroke-width="1.5"/><rect x="5" y="15" width="24" height="4" rx="1" fill="#2A3F6F"/></svg>`,podium:`<svg viewBox="0 0 34 34" fill="none"><rect x="12" y="9" width="10" height="16" rx="2" fill="#8B7355" stroke="#6B5335" stroke-width="1.5"/></svg>`,roundtable:`<svg viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="9" fill="#E8DFD0" stroke="#B0A090" stroke-width="1.5"/><circle cx="17" cy="6" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="17" cy="28" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="6" cy="17" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><circle cx="28" cy="17" r="2.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/></svg>`,longtable:`<svg viewBox="0 0 34 34" fill="none"><rect x="5" y="12" width="24" height="10" rx="2" fill="#E8DFD0" stroke="#B0A090" stroke-width="1.5"/><rect x="7" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="14.5" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="22" y="4" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="7" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="14.5" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/><rect x="22" y="23" width="5" height="7" rx="1.5" fill="#C8BCA8" stroke="#A09080" stroke-width=".8"/></svg>`,chairrow:`<svg viewBox="0 0 34 34" fill="none"><rect x="2" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="10" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="18" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/><rect x="26" y="13" width="6" height="8" rx="1.5" fill="#D4C9B8" stroke="#A09080" stroke-width="1"/></svg>`,reception:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="13" width="28" height="10" rx="2" fill="#B8C4D0" stroke="#7090B0" stroke-width="1.5"/><text x="17" y="20" text-anchor="middle" font-size="5" fill="#507090" font-family="monospace">RECEPTION</text></svg>`,photozone:`<svg viewBox="0 0 34 34" fill="none"><rect x="3" y="5" width="28" height="24" rx="2" fill="#D8C8E8" stroke="#9880C0" stroke-width="1.5"/><line x1="14" y1="5" x2="14" y2="29" stroke="#9880C0" stroke-width=".8" stroke-dasharray="2 2"/><line x1="20" y1="5" x2="20" y2="29" stroke="#9880C0" stroke-width=".8" stroke-dasharray="2 2"/><circle cx="17" cy="17" r="4" fill="none" stroke="#9880C0" stroke-width="1.2"/></svg>`};Object.entries(IC).forEach(([t,s])=>{const el=document.getElementById('icon-'+t);if(el)el.innerHTML=s;});}

/* ── 토스트 & 초기화 ── */
let _tt;
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>t.classList.remove('show'),2400);}
updateReqCount();
