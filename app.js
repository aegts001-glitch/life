(() => {
'use strict';
const LIFE_VERSION = '1.4';
/* ================= Иконки ================= */
const svg = (d, w = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  home: svg('<path d="M3.5 10.5 12 3.8l8.5 6.7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/>'),
  notes: svg('<path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14.5 3v4.5H19M8.5 12h7M8.5 16h5"/>'),
  bell: svg('<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>'),
  car: svg('<path d="M4 16.5V12l1.8-4.6A2 2 0 0 1 7.7 6h8.6a2 2 0 0 1 1.9 1.4L20 12v4.5"/><path d="M3 12h18v4.5H3z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/><path d="M6 12l1.3-3.5h9.4L18 12"/>'),
  bank: svg('<ellipse cx="12" cy="6.5" rx="7" ry="2.8"/><path d="M5 6.5v4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-4"/><path d="M5 10.5v4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-4"/><path d="M5 14.5v3c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-3"/>'),
  plans: svg('<circle cx="8" cy="9" r="4.5"/><circle cx="16.5" cy="7" r="2.5"/><circle cx="15.5" cy="16" r="5"/><circle cx="5.5" cy="18" r="1.8"/>'),
  building: svg('<path d="M4 21V5.5a1 1 0 0 1 .7-1l8-2.4a1 1 0 0 1 1.3 1V21"/><path d="M14 9h5a1 1 0 0 1 1 1v11M2.5 21h19M7.5 8h3M7.5 12h3M7.5 16h3M16.5 13h.5M16.5 17h.5"/>'),
  more: svg('<circle cx="6" cy="6" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><circle cx="12" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>', 2.2),
  minus: svg('<path d="M5 12h14"/>', 2.2),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>', 2.2),
  tick: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 3),
  cal: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13.5v4M10 15.5h4"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>', 2),
  edit: svg('<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
  up: svg('<path d="m6 14 6-6 6 6"/>', 2.2),
  down: svg('<path d="m6 10 6 6 6-6"/>', 2.2),
  left: svg('<path d="m14 6-6 6 6 6"/>', 2.2),
  right: svg('<path d="m10 6 6 6-6 6"/>', 2.2),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  odo: svg('<path d="M4.5 17a8.5 8.5 0 1 1 15 0"/><path d="m12 13 4-4"/><circle cx="12" cy="13" r="1.3"/>'),
  receipt: svg('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  income: svg('<path d="M12 20V6M6 12l6-6 6 6"/><path d="M4 21h16"/>'),
  repeat: svg('<path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 11V9a3 3 0 0 1 3-3h14M7 21.5 3.5 18 7 14.5"/><path d="M20.5 13v2a3 3 0 0 1-3 3h-14"/>'),
  fuel: svg('<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M4 10h11"/><path d="M15 8h2a2 2 0 0 1 2 2v6.5a1.5 1.5 0 0 0 3 0V8l-3-3"/>'),
  lock: svg('<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
  camera: svg('<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.8"/>'),
  walk: svg('<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6.5L14 17v4M8 11l2.5-3.5 3.5.5 2.5 3.5 2.5 1M11.5 14.5 12.8 8"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>'),
  pin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 3 21 8.5l-2.2.7-3.4 3.4.4 4.6-1.7 1.7-3.8-3.8L5 20.4 3.6 19l5.3-5.3-3.8-3.8 1.7-1.7 4.6.4 3.4-3.4z"/></svg>',
  back: svg('<path d="M15 5 8 12l7 7"/>', 2.4),
  food: svg('<path d="M4 13h16a8 8 0 0 1-16 0z"/><path d="M8 9c0-2 1.5-2.5 1.5-4.5M12 9c0-2 1.5-2.5 1.5-4.5M16 9c0-2 1.5-2.5 1.5-4.5"/>'),
  dumbbell: svg('<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>', 2),
  scale: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0L13 12"/>')
};

/* ================= Утилиты ================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NB = ' ';
const nf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const money = (n) => nf.format(Math.round(n || 0)) + NB + '₽';
const kmf = (n) => nf.format(Math.round(n || 0)) + NB + 'км';
const pad = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => isoOf(new Date());
const toDate = (iso) => { if (!iso) return null; const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths = (d, m) => { const r = new Date(d); const day = r.getDate(); r.setDate(1); r.setMonth(r.getMonth() + m); r.setDate(Math.min(day, new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate())); return r; };
const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayDiff = (a, b) => Math.round((dayStart(a) - dayStart(b)) / 864e5);
const fmtD = (d, opts = { day: 'numeric', month: 'long' }) => d ? d.toLocaleDateString('ru-RU', opts) : '';
const fmtDY = (d) => fmtD(d, { day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = (d) => fmtD(d, { day: 'numeric', month: 'short' });
const fmtT = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const plural = (n, a, b, c) => { n = Math.abs(n); const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c); };
const MONTH_NOM = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
const MONTH_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MONTH_DAT = ['январю', 'февралю', 'марту', 'апрелю', 'маю', 'июню', 'июлю', 'августу', 'сентябрю', 'октябрю', 'ноябрю', 'декабрю'];
const MONTH_PREP = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
const WD_SHORT = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const WD_LONG = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const monthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const monthTitle = (d) => `${cap(MONTH_NOM[d.getMonth()])} ${d.getFullYear()}`;
const relDay = (d) => {
  const n = dayDiff(d, new Date());
  if (n === 0) return 'сегодня'; if (n === 1) return 'завтра'; if (n === -1) return 'вчера';
  if (n > 1 && n < 7) return `через ${n} ${plural(n, 'день', 'дня', 'дней')}`;
  return fmtD(d, Math.abs(n) > 300 ? { day: 'numeric', month: 'short', year: 'numeric' } : undefined);
};
const num = (v) => { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) ? n : null; };
const hexToRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= Справочники ================= */
const CATS = { work: 'Работа', study: 'Учёба', life: 'Жизнь' };
const ACCENTS = [
  { id: 'blue', name: 'Ультрамарин', c: '#3550E6' }, { id: 'pine', name: 'Хвоя', c: '#1E7A58' },
  { id: 'amber', name: 'Янтарь', c: '#C97A12' }, { id: 'berry', name: 'Брусника', c: '#C2365C' },
  { id: 'sky', name: 'Лазурь', c: '#1C86C2' }, { id: 'graphite', name: 'Графит', c: '#4A505C' }
];
const CAR_COLORS = ['#C9CDD3', '#F4F4F2', '#20232A', '#B3282E', '#2D5BA8', '#3F7A4E', '#D9A93A', '#8A6BB8'];
const GOAL_COLORS = ['#3550E6', '#1E7A58', '#C97A12', '#C2365C', '#1C86C2', '#7A4FC4'];
const REPEAT = { none: 'Без повтора', day: 'Каждый день', week: 'Каждую неделю', month: 'Каждый месяц', year: 'Каждый год' };
const PAY = { card: 'Карта', cash: 'Наличные' };
const EXP_GROUPS = [
  ['Еда', [['groceries', 'Продукты', '🛒'], ['cafe', 'Кафе и рестораны', '🍽️'], ['delivery', 'Доставка еды', '🛵'], ['coffee', 'Кофе и перекусы', '☕'], ['lunch', 'Обеды на работе', '🥪']]],
  ['Авто', [['fuel', 'Бензин', '⛽'], ['carservice', 'Ремонт и ТО', '🔧'], ['parts', 'Запчасти', '⚙️'], ['wash', 'Мойка', '🧽'], ['parking', 'Парковка', '🅿️'], ['tires', 'Шиномонтаж', '🛞'], ['insurance', 'Страховка', '📄'], ['fines', 'Штрафы', '🚨']]],
  ['Дом', [['utilities', 'Квартплата и ЖКХ', '🏠'], ['internet', 'Интернет и ТВ', '📶'], ['phone', 'Мобильная связь', '📱'], ['household', 'Хозтовары', '🧴'], ['homerepair', 'Ремонт дома', '🛠️'], ['furniture', 'Мебель и техника', '🛋️']]],
  ['Транспорт', [['taxi', 'Такси', '🚕'], ['transit', 'Автобус и транспорт', '🚌'], ['trips', 'Билеты и поездки', '✈️']]],
  ['Здоровье', [['pharmacy', 'Аптека', '💊'], ['doctor', 'Врачи и анализы', '🩺'], ['sport', 'Спорт', '🏋️'], ['beauty', 'Стрижка и уход', '💈']]],
  ['Покупки', [['clothes', 'Одежда и обувь', '👕'], ['electronics', 'Электроника', '💻'], ['gifts', 'Подарки', '🎁'], ['hygiene', 'Косметика и гигиена', '🧼'], ['tools', 'Инструменты', '🧰']]],
  ['Отдых', [['fun', 'Кино и развлечения', '🎬'], ['subs', 'Подписки', '🔁'], ['hobby', 'Хобби', '🎣'], ['vacation', 'Отпуск', '🏖️'], ['bar', 'Бары', '🍻']]],
  ['Учёба и работа', [['courses', 'Курсы', '🎓'], ['books', 'Книги', '📚'], ['workexp', 'Расходы по работе', '💼'], ['materials', 'Стройматериалы', '🧱']]],
  ['Финансы', [['loan', 'Кредит', '🏦'], ['taxes', 'Налоги и пошлины', '🧾'], ['fees', 'Комиссии', '💳'], ['transfer', 'Переводы', '💸'], ['charity', 'Помощь другим', '🤝']]],
  ['Другое', [['pets', 'Питомцы', '🐾'], ['family', 'Семья', '👪'], ['other', 'Прочее', '📦']]]
];
const EXP_CAT = {}; EXP_GROUPS.forEach(([g, list]) => list.forEach(([id, name, e]) => { EXP_CAT[id] = { id, name, e, g }; }));
const POPULAR = ['groceries', 'fuel', 'cafe', 'taxi', 'pharmacy', 'utilities', 'phone', 'clothes'];
const INC_LIST = [['salary', 'Зарплата', '💼'], ['advance', 'Аванс', '💵'], ['bonus', 'Премия', '🏆'], ['side', 'Подработка', '🛠️'], ['repair', 'Ремонт квартир', '🏗️'],
  ['cashback', 'Кэшбэк и возвраты', '🔄'], ['gift', 'Подарки', '🎁'], ['sale', 'Продажа вещей', '🏷️'], ['interest', 'Проценты по вкладу', '🏦'], ['transfer', 'Переводы', '💸'], ['other', 'Другое', '📦']];
const INC_CAT = {}; INC_LIST.forEach(([id, name, e]) => { INC_CAT[id] = { id, name, e }; });
const CUSTOM_EMOJI = ['🍰', '🍺', '🎮', '🐟', '🌱', '🧸', '👶', '🚲', '🏍️', '🎤', '📸', '🧹', '🔌', '🪵', '🛏️', '⚽', '🎨', '🧳', '💍', '🌸'];

const SECTION_DEFS = {
  notes: { name: 'Заметки', icon: 'notes', desc: 'Работа, учёба, жизнь, фото' },
  reminders: { name: 'Напоминания', icon: 'bell', desc: 'С сигналом в Календаре iPhone' },
  plans: { name: 'Планы', icon: 'plans', desc: 'Месяц в пузырях дней' },
  bank: { name: 'Деньги', icon: 'bank', desc: 'Расходы, доходы, платежи, копилка' },
  car: { name: 'Авто', icon: 'car', desc: 'Регламент, заправки, история' },
  objects: { name: 'Объекты', icon: 'building', desc: 'Замечания, обходы, подрядчики' },
  food: { name: 'Питание', icon: 'food', desc: 'Еда, калории и БЖУ, вода, вес' },
  sport: { name: 'Тренировки', icon: 'dumbbell', desc: 'Турник, бег, бокс, зал, рекорды' }
};
const FEATURE_DEFS = {
  income: { sec: 'bank', name: 'Доходы' }, recurring: { sec: 'bank', name: 'Регулярные платежи' }, piggy: { sec: 'bank', name: 'Копилка' },
  fuel: { sec: 'car', name: 'Заправки' }, photos: { sec: 'notes', name: 'Фото в заметках' }
};
const WIDGETS = {
  quick: { name: 'Быстрые кнопки' }, food: { name: 'Питание сегодня', sec: 'food' }, sport: { name: 'Тренировки', sec: 'sport' }, reminders: { name: 'Ближайшие напоминания', sec: 'reminders' }, plans: { name: 'Планы на сегодня', sec: 'plans' },
  expenses: { name: 'Деньги за месяц', sec: 'bank' }, objects: { name: 'Объекты: сроки', sec: 'objects' }, car: { name: 'Машина', sec: 'car' },
  bank: { name: 'Копилка', sec: 'bank', feat: 'piggy' }, notes: { name: 'Последние заметки', sec: 'notes' }
};
const QUICK_DEFS = {
  'new-note': { name: 'Заметка', icon: 'notes', sec: 'notes' }, 'new-rem': { name: 'Напомнить', icon: 'bell', sec: 'reminders' },
  'new-plan': { name: 'План', icon: 'plans', sec: 'plans' }, 'new-exp': { name: 'Расход', icon: 'receipt', sec: 'bank' },
  'new-inc': { name: 'Доход', icon: 'income', sec: 'bank', feat: 'income' }, 'new-fuel': { name: 'Заправка', icon: 'fuel', sec: 'car', feat: 'fuel' },
  mileage: { name: 'Пробег', icon: 'odo', sec: 'car' }, 'new-remark': { name: 'Замечание', icon: 'building', sec: 'objects' },
  'quick-deposit': { name: 'В копилку', icon: 'bank', sec: 'bank', feat: 'piggy' },
  'add-food': { name: 'Еда', icon: 'food', sec: 'food' }, 'start-workout': { name: 'Тренировка', icon: 'dumbbell', sec: 'sport' },
  'add-weight': { name: 'Вес', icon: 'scale', sec: 'food' }
};

/* ================= Данные ================= */
const KEY = 'life.v1';
let S;
const DEFAULT_SERVICES = [
  ['Моторное масло и фильтр', 7500, 6], ['Воздушный фильтр', 15000, 12], ['Салонный фильтр', 15000, 12],
  ['Жидкость коробки передач', 40000, 24], ['Свечи зажигания', 30000, 36], ['Тормозная жидкость', 40000, 24],
  ['Антифриз', 40000, 36], ['Ремень навесного оборудования', 60000, 48], ['Тормозные колодки, проверка', 15000, 12]
];
/* Чистое приложение без чужих данных: так его видит каждый новый человек */
function seed() {
  return {
    v: 2,
    settings: {
      name: '', theme: 'auto', accent: 'blue', wallpaper: 'dots', icon: 'light', budget: null,
      sections: { notes: true, reminders: true, plans: true, bank: true, car: true, objects: false, food: true, sport: true },
      order: ['plans', 'food', 'bank', 'sport', 'notes', 'car', 'reminders', 'objects'],
      features: { income: true, recurring: true, piggy: true, fuel: true, photos: true },
      quick: ['add-food', 'start-workout', 'new-exp', 'new-plan', 'new-note'],
      widgets: Object.keys(WIDGETS).map((id) => ({ id, on: true })),
      pin: null, lockAfter: 1, onboarded: false
    },
    notes: [], reminders: [], plans: [], expenses: [], incomes: [], recurring: [], customCats: [], goals: [],
    car: { name: '', body: '', year: '', engine: '', color: '#C9CDD3', mileage: null, mileageDate: null },
    services: DEFAULT_SERVICES.map(([name, km, months]) => ({ id: uid(), name, km, months, lastKm: null, lastDate: null, rec: true })),
    carLog: [], carTodo: [], fuel: [], objects: [],
    food: { entries: [], my: [], recent: [], water: {}, weights: [], goals: { mode: 'loss', sex: 'm', age: '', height: '', weight: '', activity: 1.55, manual: false, set: false } },
    workouts: [], wTemplates: [], workoutActive: null, myExercises: []
  };
}
function normalize(s) {
  const d = seed();
  const legacy = !s.settings || s.settings.onboarded === undefined;
  const st = s.settings = Object.assign({}, d.settings, s.settings || {});
  st.sections = Object.assign({}, d.settings.sections, st.sections || {});
  st.features = Object.assign({}, d.settings.features, st.features || {});
  st.order = (st.order || []).filter((id) => SECTION_DEFS[id]);
  Object.keys(SECTION_DEFS).forEach((id) => { if (!st.order.includes(id)) st.order.push(id); });
  if (!Array.isArray(st.quick)) st.quick = d.settings.quick;
  st.quick = st.quick.filter((q) => QUICK_DEFS[q]);
  const wids = (st.widgets || []).filter((w) => WIDGETS[w.id]);
  Object.keys(WIDGETS).forEach((id) => { if (!wids.some((w) => w.id === id)) wids.push({ id, on: true }); });
  st.widgets = wids;
  ['notes', 'reminders', 'plans', 'expenses', 'incomes', 'recurring', 'customCats', 'goals', 'services', 'carLog', 'carTodo', 'fuel', 'objects'].forEach((k) => {
    if (!Array.isArray(s[k])) s[k] = k === 'services' ? d.services : [];
  });
  if (legacy) { st.onboarded = false; st.freshOffer = true; }
  s.car = Object.assign({}, d.car, s.car || {});
  s.food = Object.assign({}, d.food, s.food || {}); ['entries', 'my', 'recent', 'weights'].forEach((k) => { if (!Array.isArray(s.food[k])) s.food[k] = []; });
  if (!s.food.water || typeof s.food.water !== 'object') s.food.water = {}; s.food.goals = Object.assign({}, d.food.goals, s.food.goals || {});
  ['workouts', 'wTemplates', 'myExercises'].forEach((k) => { if (!Array.isArray(s[k])) s[k] = []; }); if (s.workoutActive === undefined) s.workoutActive = null;
  s.notes.forEach((n) => { if (!Array.isArray(n.photos)) n.photos = []; });
  s.goals.forEach((g) => { if (!Array.isArray(g.ops)) g.ops = []; });
  s.objects.forEach((o) => { ['contractors', 'remarks', 'walks'].forEach((k) => { if (!Array.isArray(o[k])) o[k] = []; }); o.remarks.forEach((r) => { if (!Array.isArray(r.photos)) r.photos = []; }); if (!o.days) o.days = 20; });
  s.v = 2;
  return s;
}
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s && s.v) return normalize(s); } } catch (e) { /* нет хранилища */ }
  return seed();
}
/* Стереть записи. keepSetup — оставить машину (без пробега и отметок) и объекты с подрядчиками */
async function wipeAll(keepSetup) {
  try { (await phAll() || []).forEach((p) => phDel(p.id)); } catch (e) { /* нет фото */ }
  const old = S; const fresh = seed();
  fresh.settings = Object.assign({}, old.settings, { pin: keepSetup ? old.settings.pin : null, budget: null });
  if (keepSetup) {
    fresh.car = Object.assign({}, old.car, { mileage: null, mileageDate: null });
    fresh.services = old.services.map((x) => Object.assign({}, x, { lastKm: null, lastDate: null }));
    fresh.objects = old.objects.map((o) => Object.assign({}, o, { remarks: [], walks: [] }));
    fresh.customCats = old.customCats;
    fresh.food.my = old.food.my; fresh.food.goals = old.food.goals; fresh.wTemplates = old.wTemplates; fresh.myExercises = old.myExercises;
  }
  S = fresh; save();
}
let saveFailed = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); saveFailed = false; }
  catch (e) { if (!saveFailed) toast('Не удалось сохранить: память телефона заполнена. Удалите старые фото или сделайте резервную копию.'); saveFailed = true; }
}
const sec = (id) => !!S.settings.sections[id];
const feat = (id) => !!S.settings.features[id] && sec(FEATURE_DEFS[id].sec);

/* ================= Фото (IndexedDB) ================= */
const PH = { db: null, urls: new Map() };
function phDB() {
  if (PH.db) return Promise.resolve(PH.db);
  return new Promise((res, rej) => {
    let rq; try { rq = indexedDB.open('life-photos', 1); } catch (e) { rej(e); return; }
    rq.onupgradeneeded = () => { rq.result.createObjectStore('photos', { keyPath: 'id' }); };
    rq.onsuccess = () => { PH.db = rq.result; res(PH.db); };
    rq.onerror = () => rej(rq.error);
  });
}
function phTx(mode, fn) {
  return phDB().then((db) => new Promise((res, rej) => {
    const tx = db.transaction('photos', mode); const st = tx.objectStore('photos'); let out;
    const r = fn(st); if (r) r.onsuccess = () => { out = r.result; };
    tx.oncomplete = () => res(out); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error);
  }));
}
const phGet = (id) => phTx('readonly', (st) => st.get(id));
const phPut = (rec) => phTx('readwrite', (st) => st.put(rec));
const phDel = (id) => { const u = PH.urls.get(id); if (u) { URL.revokeObjectURL(u.full); URL.revokeObjectURL(u.thumb); PH.urls.delete(id); } return phTx('readwrite', (st) => st.delete(id)).catch(() => {}); };
const phAll = () => phTx('readonly', (st) => st.getAll());
function scaleImage(file, max, q) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const cv = document.createElement('canvas'); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
      cv.toBlob((b) => b ? res(b) : rej(new Error('blob')), 'image/jpeg', q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
    img.src = url;
  });
}
async function addPhotos(files) {
  const ids = [];
  for (const f of Array.from(files || [])) {
    if (!/^image\//.test(f.type) && !/\.(heic|jpe?g|png|webp)$/i.test(f.name)) continue;
    try {
      const [full, thumb] = await Promise.all([scaleImage(f, 1600, 0.82), scaleImage(f, 360, 0.75)]);
      const id = 'p' + uid(); await phPut({ id, full, thumb, created: Date.now() }); ids.push(id);
    } catch (e) { toast('Не получилось добавить фото. Попробуйте другое.'); }
  }
  return ids;
}
async function photoURL(id, kind) {
  let u = PH.urls.get(id);
  if (!u) { const rec = await phGet(id).catch(() => null); if (!rec) return ''; u = { full: URL.createObjectURL(rec.full), thumb: URL.createObjectURL(rec.thumb) }; PH.urls.set(id, u); }
  return kind === 'full' ? u.full : u.thumb;
}
function hydratePhotos(root) {
  $$('img[data-photo]', root || document).forEach((im) => { if (im.dataset.loaded) return; im.dataset.loaded = '1'; photoURL(im.dataset.photo, 'thumb').then((u) => { if (u) im.src = u; else im.closest('.ph')?.classList.add('missing'); }); });
}
function photoStrip(ids, edit) {
  return `<div class="ph-strip">${ids.map((id, i) => `<button type="button" class="ph" data-view-photo="${id}" data-i="${i}" aria-label="Фото ${i + 1}"><img data-photo="${id}" alt=""></button>`).join('')}${edit ? `<label class="ph add" aria-label="Добавить фото">${I.camera}<span>Фото</span><input type="file" accept="image/*" multiple hidden data-photo-input></label>` : ''}</div>`;
}
/* Просмотр фото */
const VW = { ids: [], i: 0, onDelete: null };
async function openViewer(ids, i, onDelete) {
  VW.ids = ids; VW.i = i; VW.onDelete = onDelete;
  const v = $('#viewer'); v.hidden = false; requestAnimationFrame(() => v.classList.add('show'));
  $('#vwDelBox').hidden = true; $('#vwDel').hidden = !onDelete;
  await showViewerImg();
}
async function showViewerImg() {
  const im = $('#vwImg'); im.src = await photoURL(VW.ids[VW.i], 'full');
  $('#vwCount').textContent = VW.ids.length > 1 ? `${VW.i + 1} из ${VW.ids.length}` : '';
}
function closeViewer() { const v = $('#viewer'); v.classList.remove('show'); setTimeout(() => { v.hidden = true; $('#vwImg').removeAttribute('src'); }, 220); }
const viewerOpen = () => !$('#viewer').hidden;

/* ================= Тема и иконка ================= */
const accentHex = () => (ACCENTS.find((a) => a.id === S.settings.accent) || ACCENTS[0]).c;
function applyTheme() {
  const root = document.documentElement; const t = S.settings.theme;
  if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
  const c = accentHex(); const [r, g, b] = hexToRgb(c);
  root.style.setProperty('--accent', c); root.style.setProperty('--accent-soft', `rgba(${r},${g},${b},.13)`); root.style.setProperty('--accent-rgb', `${r},${g},${b}`);
  document.body.classList.toggle('wp-dots', S.settings.wallpaper === 'dots');
  document.body.classList.toggle('wp-glow', S.settings.wallpaper === 'glow');
  const meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', getComputedStyle(document.body).backgroundColor);
}
const iconCache = {}; let baseIcon = null;
function loadBaseIcon() {
  return new Promise((res) => {
    if (baseIcon) return res(baseIcon);
    const img = new Image(); img.onload = () => { baseIcon = img; res(img); }; img.onerror = () => res(null); img.src = 'icons/apple-touch-icon.png';
  });
}
async function iconVariant(kind) {
  const key = kind + ':' + (kind === 'accent' ? accentHex() : '');
  if (iconCache[key]) return iconCache[key];
  if (kind === 'light') return (iconCache[key] = 'icons/apple-touch-icon.png');
  const img = await loadBaseIcon(); if (!img) return 'icons/logo.png';
  const s = 180, cv = document.createElement('canvas'); cv.width = cv.height = s;
  const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, s, s);
  let data; try { data = ctx.getImageData(0, 0, s, s); } catch (e) { return 'icons/apple-touch-icon.png'; }
  const p = data.data; const [ar, ag, ab] = hexToRgb(accentHex());
  for (let i = 0; i < p.length; i += 4) {
    const l = (p[i] + p[i + 1] + p[i + 2]) / 765;
    if (kind === 'dark') { p[i] = 255 - p[i] * 0.93; p[i + 1] = 255 - p[i + 1] * 0.93; p[i + 2] = 255 - p[i + 2] * 0.92; }
    else { p[i] = ar * l + 255 * (1 - l); p[i + 1] = ag * l + 255 * (1 - l); p[i + 2] = ab * l + 255 * (1 - l); }
  }
  ctx.putImageData(data, 0, 0);
  return (iconCache[key] = cv.toDataURL('image/png'));
}
async function applyIcon() {
  const url = await iconVariant(S.settings.icon);
  const link = $('#touchIcon'); if (link) link.setAttribute('href', url);
  $$('[data-logo]').forEach((im) => { im.src = url; });
}

/* ================= Тост с «Вернуть» ================= */
let toastT, pendingFinal = null;
function toast(msg, undo) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button type="button" id="toastUndo">Вернуть</button>' : ''}`;
  t.classList.toggle('has-undo', !!undo); t.classList.add('show');
  if (undo) $('#toastUndo').onclick = () => { clearTimeout(toastT); t.classList.remove('show'); pendingFinal = null; undo(); };
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.classList.remove('show'); if (undo && pendingFinal) { const f = pendingFinal; pendingFinal = null; f(); } }, undo ? 4500 : 2400);
}
/* Удаление с возможностью вернуть: remove() убирает запись, restore() возвращает, finalize() — окончательная уборка (фото) */
function removeWithUndo(msg, remove, restore, finalize) {
  if (pendingFinal) { const f = pendingFinal; pendingFinal = null; f(); }
  remove(); save(); render();
  pendingFinal = finalize || null;
  toast(msg, () => { restore(); save(); render(); toast('Восстановлено'); });
}

/* ================= Лист снизу ================= */
let sheetOpen = false, sheetOnClose = null, sheetBack = null;
function openSheet(title, html, mount, opts = {}) {
  const scrim = $('#scrim'), sh = $('#sheet');
  // Новый контейнер на каждую карточку: обработчики прошлых карточек не доживают до новых
  const old = $('#sheetBody'); const body = old.cloneNode(false); old.replaceWith(body);
  const wasOpen = sheetOpen;
  $('#sheetTitle').textContent = title;
  sheetBack = opts.back || null; $('#sheetBack').hidden = !sheetBack;
  sheetOnClose = opts.onClose || null;
  body.innerHTML = html; body.scrollTop = 0;
  // Панель «Сохранить» всегда последняя, чтобы ничего не перекрывала (кнопка «Удалить» стоит над ней)
  $$('.sticky-save', body).forEach((ss) => ss.parentElement.appendChild(ss));
  if (wasOpen) { body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap'); }
  scrim.hidden = false; sh.hidden = false; sheetOpen = true;
  document.documentElement.classList.add('no-scroll');
  if (!wasOpen) requestAnimationFrame(() => requestAnimationFrame(() => { scrim.classList.add('show'); sh.classList.add('show'); }));
  hydratePhotos(body);
  if (mount) mount(body);
  // Корзина в шапке листа: удаление видно сразу, без прокрутки
  const del = $('.btn.danger', body); const hd = $('#sheetDel');
  hd.hidden = !del; hd.onclick = del ? () => { del.click(); const box = $('#delBox', body); if (box && !box.hidden) box.scrollIntoView({ block: 'center', behavior: 'smooth' }); } : null;
}
function closeSheet() {
  if (!sheetOpen) return; sheetOpen = false;
  const scrim = $('#scrim'), sh = $('#sheet');
  scrim.classList.remove('show'); sh.classList.remove('show'); sh.style.transform = '';
  document.documentElement.classList.remove('no-scroll');
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  const cb = sheetOnClose; sheetOnClose = null; sheetBack = null; if (cb) cb();
  setTimeout(() => { if (!sheetOpen) { scrim.hidden = true; sh.hidden = true; $('#sheetBody').innerHTML = ''; } }, 330);
}
/* Подтверждение внутри листа */
const confirmBox = (btnText, question, yesText = 'Удалить') => `<button class="btn danger" type="button" data-act="ask-del">${btnText}</button><div class="confirm" id="delBox" hidden><p>${question}</p><div class="btn-row"><button type="button" class="btn sm" data-act="cancel-del">Отмена</button><button type="button" class="btn sm danger" id="delYes">${yesText}</button></div></div>`;
/* Привязка фото-ленты в листе */
function bindPhotoStrip(body, getIds, setIds) {
  const rerender = () => { const box = $('.ph-strip', body); if (box) { box.outerHTML = photoStrip(getIds(), true); hydratePhotos(body); } };
  body.addEventListener('change', async (e) => {
    if (!e.target.matches('[data-photo-input]')) return;
    const files = e.target.files; if (!files || !files.length) return;
    toast('Добавляю фото…');
    const ids = await addPhotos(files); setIds(getIds().concat(ids)); rerender();
    if (ids.length) toast(ids.length === 1 ? 'Фото добавлено' : `Добавлено фото: ${ids.length}`);
  });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view-photo]'); if (!b) return; e.stopPropagation();
    const ids = getIds();
    openViewer(ids, +b.dataset.i, (id) => { setIds(getIds().filter((x) => x !== id)); phDel(id); rerender(); });
  });
}

/* ================= Навигация ================= */
const ui = {
  tab: 'home', stack: [], scroll: {}, mounts: [],
  noteCat: 'all', noteQuery: '', showDone: false, carSec: 'service', money: 'exp', month: null, expFilter: null, allCats: false,
  planMonth: null, objSec: 'remarks', remFilter: 'active', remContractor: '', remQuery: ''
};
const RENDER = {}; const DETAIL = {}; const ACT = {};
const sectionsOn = () => S.settings.order.filter((id) => sec(id));
function tabSlots() { const on = sectionsOn(); return on.length <= 4 ? on : [...on.slice(0, 3), 'more']; }
function renderTabbar() {
  const slots = ['home', ...tabSlots()];
  const nav = $('#tabbarNav');
  nav.style.gridTemplateColumns = `repeat(${slots.length}, minmax(0, 1fr))`;
  const inMore = !tabSlots().includes(ui.tab) && ui.tab !== 'home';
  nav.innerHTML = slots.map((id) => {
    const d = id === 'home' ? { name: 'Главная', icon: 'home' } : id === 'more' ? { name: 'Ещё', icon: 'more' } : SECTION_DEFS[id];
    const on = id === ui.tab || (id === 'more' && inMore);
    return `<button data-act="${id === 'more' ? 'more' : 'tab'}" data-tab="${id}" class="${on ? 'on' : ''}" aria-label="${d.name}">${I[d.icon]}<span>${d.name}</span></button>`;
  }).join('');
}
function currentHTML() {
  const top = ui.stack[ui.stack.length - 1];
  if (top) return DETAIL[top.type](top);
  return (RENDER[ui.tab] || RENDER.home)();
}
function render(anim) {
  ui.mounts = [];
  const el = $('#view');
  el.innerHTML = `<div class="view ${anim || ''}">${currentHTML()}</div>`;
  renderTabbar();
  hydratePhotos(el);
  const ms = ui.mounts; ui.mounts = []; ms.forEach((f) => f());
}
function go(tab) {
  if (tab !== 'home' && !sec(tab)) tab = 'home';
  if (sheetOpen) closeSheet();
  ui.scroll[ui.tab] = window.scrollY;
  const same = tab === ui.tab && !ui.stack.length;
  ui.stack = []; ui.tab = tab;
  render(same ? '' : 'anim-fade');
  window.scrollTo(0, same ? 0 : (ui.scroll[tab] || 0));
  try { if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab); } catch (e) { /* без истории */ }
}
function push(d) {
  ui.scroll['d' + ui.stack.length + ui.tab] = window.scrollY;
  ui.stack.push(d); render('anim-in'); window.scrollTo(0, 0);
}
function back() {
  if (lockShown()) return;
  if (viewerOpen()) { closeViewer(); return; }
  if (sheetOpen) { if (sheetBack) sheetBack(); else closeSheet(); return; }
  if (!ui.stack.length) return;
  ui.stack.pop(); render('anim-back'); window.scrollTo(0, ui.scroll['d' + ui.stack.length + ui.tab] || 0);
}
const backBtn = (label) => `<button class="back-btn" data-act="back" aria-label="Назад">${I.back}<span>${esc(label)}</span></button>`;
function head(title, sub, actions) {
  return `<div class="head"><div class="head-text"><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div><div class="head-actions">${actions || ''}</div></div>`;
}
const plusBtn = (actName, label, extra = '') => `<button class="icon-btn primary" data-act="${actName}" ${extra} aria-label="${label}">${I.plus}</button>`;
function moreSheet() {
  const rest = sectionsOn().slice(3);
  openSheet('Разделы', `<div class="list">${rest.map((id) => { const d = SECTION_DEFS[id]; return `<button class="row big" data-act="tab" data-tab="${id}"><span class="sec-ic">${I[d.icon]}</span><span class="grow"><span class="t">${d.name}</span><span class="m">${d.desc}</span></span><span class="chev">${I.right}</span></button>`; }).join('')}</div>
    <button class="btn" data-act="settings-sections">${I.gear}Выбрать разделы</button>`);
}

/* ================= Код-пароль ================= */
const LK = { entry: '', mode: 'unlock', first: '', fails: 0, until: 0, hiddenAt: 0, onDone: null };
const lockShown = () => !$('#lock').hidden;
async function hashPin(pin, salt) {
  const data = new TextEncoder().encode(salt + ':' + pin);
  if (window.crypto && crypto.subtle) { const h = await crypto.subtle.digest('SHA-256', data); return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, '0')).join(''); }
  let h = 2166136261; for (const b of data) { h ^= b; h = Math.imul(h, 16777619); } return 'f' + (h >>> 0).toString(16);
}
function showLock(mode, onDone, cancellable) {
  LK.mode = mode; LK.entry = ''; LK.first = ''; LK.onDone = onDone || null;
  const l = $('#lock'); l.hidden = false; l.classList.toggle('setup', mode !== 'unlock');
  $('#lockCancel').hidden = mode === 'unlock' && !cancellable;
  $('#lockForgot').hidden = mode !== 'unlock' || !!cancellable; $('#forgotBox').hidden = true;
  lockText(); lockDots();
  requestAnimationFrame(() => l.classList.add('show'));
}
function hideLock() { const l = $('#lock'); l.classList.remove('show'); setTimeout(() => { l.hidden = true; }, 250); }
function lockText() {
  const t = { unlock: 'Введите код-пароль', set: 'Придумайте код из 4 цифр', confirm: 'Повторите код' }[LK.mode];
  $('#lockTitle').textContent = t; $('#lockMsg').textContent = '';
}
function lockDots() { $$('#lockDots i').forEach((d, i) => d.classList.toggle('on', i < LK.entry.length)); }
async function lockKey(k) {
  if (LK.mode === 'unlock' && Date.now() < LK.until) { $('#lockMsg').textContent = `Слишком много попыток. Подождите ${Math.ceil((LK.until - Date.now()) / 1000)} с`; return; }
  if (k === 'del') { LK.entry = LK.entry.slice(0, -1); lockDots(); return; }
  if (LK.entry.length >= 4) return;
  LK.entry += k; lockDots();
  if (LK.entry.length < 4) return;
  const pin = LK.entry;
  await new Promise((r) => setTimeout(r, 120));
  if (LK.mode === 'set') { LK.first = pin; LK.mode = 'confirm'; LK.entry = ''; lockText(); lockDots(); return; }
  if (LK.mode === 'confirm') {
    if (pin !== LK.first) { shakeLock('Коды не совпали. Придумайте заново'); LK.mode = 'set'; LK.first = ''; return; }
    const salt = uid(); S.settings.pin = { salt, hash: await hashPin(pin, salt) }; save();
    hideLock(); toast('Код-пароль включён'); if (LK.onDone) LK.onDone(); return;
  }
  const p = S.settings.pin;
  if (p && await hashPin(pin, p.salt) === p.hash) { LK.fails = 0; hideLock(); if (LK.onDone) LK.onDone(); return; }
  LK.fails++; if (LK.fails >= 5) { LK.until = Date.now() + 30000; LK.fails = 0; }
  shakeLock(LK.until > Date.now() ? 'Слишком много попыток. Подождите 30 с' : 'Неверный код');
}
function shakeLock(msg) {
  LK.entry = ''; lockDots(); $('#lockMsg').textContent = msg;
  const d = $('#lockDots'); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake');
}

/* ================= База продуктов =================
   Формат строки: название|ккал|белки|жиры|углеводы|порция, г|единица:граммы|слова для поиска
   Значения на 100 г. Строки со звёздочкой — магазинные товары: значения ориентировочные, на упаковке могут отличаться. */
const FOOD_RAW = `
#Крупы и гарниры|🥣
Гречка варёная|110|4.2|1.1|21.3|200||греча гарнир крупа
Гречка сухая|313|12.6|3.3|62.1|70||греча крупа
Рис белый варёный|116|2.2|0.5|24.9|200||гарнир крупа
Рис белый сухой|344|6.7|0.7|78.9|70||крупа
Рис бурый варёный|111|2.6|0.9|23|200||коричневый крупа
Овсянка на воде|88|3|1.7|15|250||каша геркулес
Овсянка на молоке|116|4|3.3|17.5|250||каша геркулес
Овсяные хлопья сухие|352|12.3|6.2|61.8|50||геркулес крупа
Пшённая каша на воде|90|3|0.7|17|250||пшено каша
Перловка варёная|109|3.1|0.4|22.2|200||перловая крупа
Булгур варёный|83|3.1|0.2|18.6|200||крупа
Киноа варёная|120|4.4|1.9|21.3|200||крупа
Кускус варёный|112|3.8|0.2|23.2|200||крупа
Манная каша на молоке|98|3|3.2|15.3|250||манка каша
Рисовая каша на молоке|97|2.9|1.4|18|250||каша
Макароны варёные|112|3.6|0.4|23|200||паста гарнир рожки
Макароны сухие|344|11|1.3|71|80||паста
Спагетти варёные|158|5.8|0.9|30.9|200||паста
Картофель варёный|82|2|0.4|16.7|200||картошка гарнир
Картофельное пюре|106|2.5|4.2|14.7|200||картошка пюре гарнир
Картофель жареный|192|2.8|9.5|23.4|200||картошка
Картофель запечённый|93|2.5|0.1|21|200||картошка
Картофель фри|312|3.4|15|41|150||картошка фастфуд
Лапша гречневая соба|99|5|0.1|21|200||гарнир
Фасоль варёная|123|7.8|0.5|21.5|150||бобовые
Чечевица варёная|116|9|0.4|20|200||бобовые
Нут варёный|164|8.9|2.6|27.4|150||бобовые
Гороховое пюре|98|6.7|0.4|17.3|200||горох

#Каши и лапша быстрого приготовления|⏱️
*Каша овсяная быстрого приготовления с фруктами|360|9|5|67|40|пакет:40|минутка каша пакетик
*Каша «Быстров» овсяная|370|9|6|67|40|пакет:40|быстров минутка каша
*Каша «Увелка» овсяная минутка|350|11|6|62|35|пакет:35|увелка минутка каша
*Каша гречневая быстрого приготовления|340|10|3|68|40|пакет:40|минутка каша
*Каша рисовая быстрого приготовления|380|7|5|76|40|пакет:40|минутка каша
*Лапша «Роллтон» с курицей|440|9|19|58|60|упаковка:60|роллтон лапша бомжпакет
*Лапша «Доширак» говядина|440|9|19|58|90|упаковка:90|доширак лапша
*Лапша «Бигбон» с курицей|450|9|21|56|75|упаковка:75|бигбон лапша
*Вермишель быстрого приготовления в стакане|450|9|20|58|70|стакан:70|лапша стакан
*Пюре картофельное «Роллтон»|390|7|11|65|40|пакет:40|роллтон пюре быстрое
*Суп быстрого приготовления в кружке|400|7|13|63|15|пакет:15|горячая кружка суп
*Хлопья кукурузные|370|7|1|83|30||завтрак хлопья
*Мюсли с фруктами|350|9|6|65|50||завтрак гранола
*Гранола запечённая|450|10|15|65|50||завтрак мюсли

#Мясо и птица|🍗
Куриная грудка варёная|137|29.8|1.8|0.5|150||курица филе
Куриная грудка запечённая|165|31|3.6|0|150||курица филе
Куриная грудка сырая|113|23.6|1.9|0.4|150||курица филе
Куриное филе жареное|197|30|8|1|150||курица
Куриное бедро без кожи запечённое|185|24|9.5|0|150||курица бедро
Куриные голени запечённые|214|26|12|0|150||курица ножки
Куриные крылья запечённые|245|24|16|0|120||курица крылышки
Курица гриль|210|21|14|0|200||курица
Фарш куриный|143|17.4|8.1|0|150||курица фарш
Индейка филе варёное|130|25|3|0|150||индейка
Фарш из индейки|150|19|8|0|150||индейка
Говядина варёная|254|25.8|16.8|0|150||мясо
Говядина тушёная|232|16.8|18.3|0|150||мясо
Говяжья вырезка жареная|180|28|7|0|150||мясо стейк
Фарш говяжий|254|17.2|20|0|150||мясо фарш
Фарш домашний свинина и говядина|263|17|21.5|0|150||мясо фарш
Свинина нежирная жареная|260|26|17|0|150||мясо
Свиная шея запечённая|300|22|24|0|150||мясо
Шашлык из свинины|324|20|27|0|200||мясо мангал
Шашлык из курицы|160|22|7.5|1|200||мангал
Котлета говяжья|220|16|14|8|100|шт:100|котлеты
Котлета куриная|190|17|10|7|100|шт:100|котлеты
Тефтели в соусе|160|9|10|9|200||мясо
Печень куриная тушёная|165|20|9|1|150||субпродукты
Печень говяжья жареная|199|22.9|10.2|3.9|150||субпродукты
Сосиски молочные|266|11|23.9|0.4|50|шт:50|сосиска
Сардельки|330|10|31.6|1.9|100|шт:100|сарделька
Колбаса варёная докторская|257|12.8|22.2|1.5|30|ломтик:15|колбаса
Колбаса сервелат|461|24|40.5|0|30|ломтик:10|колбаса копчёная
Ветчина|270|14|23|1|30|ломтик:15|колбаса
Бекон|500|23|45|0|20||свинина
Гуляш из говядины|145|14|8|4|200||мясо подлива

#Рыба и морепродукты|🐟
Минтай отварной|79|17.6|1|0|150||рыба
Треска отварная|78|17.8|0.7|0|150||рыба
Хек отварной|95|16.6|2.2|0|150||рыба
Горбуша запечённая|170|24|8|0|150||рыба красная
Кета запечённая|155|22|7|0|150||рыба красная
Лосось запечённый|206|22|13|0|150||рыба красная сёмга
Сёмга слабосолёная|202|22|12.5|0|50||рыба красная
Селёдка солёная|217|19.8|15.4|0|60||рыба сельдь
Скумбрия холодного копчения|221|23.4|14.4|0|100||рыба
*Тунец в собственном соку|96|21|1|0|100|банка:185|рыба консервы
*Сардины в масле|220|24|14|0|100||рыба консервы
*Шпроты в масле|363|17.4|32.4|0.4|50||рыба консервы
*Горбуша консервированная|142|20.9|5|0|100|банка:245|рыба консервы
Кальмар варёный|110|18|2.2|2|100||морепродукты
Креветки варёные|95|18.9|2.2|0|100||морепродукты
*Крабовые палочки|73|6|1|10|100|упаковка:200|снежный краб
Икра красная|263|31.6|13.8|0|20||
Рыбные котлеты|168|12.5|6.5|14|100|шт:100|котлеты
Роллы «Филадельфия»|150|7|5|19|240|шт:30|суши ролл
Роллы «Калифорния»|170|6|7|21|240|шт:30|суши ролл
Суши с лососем|160|8|4|22|80|шт:40|суши

#Яйца и молочное|🥚
Яйцо куриное варёное|160|12.9|11.6|0.8|55|шт:55|яйца
Яичница|196|12.9|15.3|0.9|110|из 2 яиц:110|яйца жареные
Омлет|184|9.6|15.4|1.9|150||яйца
Яичный белок|52|10.9|0.2|0.7|33|шт:33|яйца
Творог 0%|71|16.5|0.2|1.3|180|пачка:180|творог обезжиренный
Творог 5%|121|17.2|5|1.8|180|пачка:180|творог
Творог 9%|159|16.7|9|2|180|пачка:180|творог
Зернёный творог|105|12|5|2|150||творог в сливках
Сырники|220|13|11|17|120|шт:60|творог
Йогурт натуральный|66|4.3|2.5|6.5|150||йогурт
Кефир 1%|40|3|1|4|250|стакан:250|кефир
Кефир 2,5%|53|3|2.5|4|250|стакан:250|кефир
Молоко 2,5%|52|2.8|2.5|4.7|250|стакан:250|молоко
Молоко 3,2%|59|2.9|3.2|4.7|250|стакан:250|молоко
Ряженка 4%|76|2.9|4|4.2|250|стакан:250|ряженка
Сметана 15%|158|2.6|15|3|20|ст. ложка:20|сметана
Сметана 20%|206|2.8|20|3.2|20|ст. ложка:20|сметана
Сыр твёрдый|360|23|29|0|30|ломтик:15|сыр российский голландский
Сыр моцарелла|280|18|22|1|30||сыр
Брынза|260|17.9|20.1|0|30||сыр
Сыр плавленый|250|16|19|5|20||сыр
Масло сливочное 82%|748|0.5|82.5|0.8|10||масло
Мороженое пломбир|232|3.2|15|20.8|80|стаканчик:80|мороженое
Сгущённое молоко|320|7.2|8.5|56|20|ст. ложка:20|сгущёнка
*Сырок глазированный|407|8.5|27.8|32|45|шт:45|сырок творожный б.ю. александров
*Творожок «Даниссимо»|140|6|5|18|130|шт:130|даниссимо творожок
*Йогурт питьевой с фруктами|80|2.9|2.5|11.6|270|бутылка:270|йогурт активиа чудо
*Йогурт «Активиа»|76|2.8|2.4|10.7|130|шт:130|активиа
*Протеиновый йогурт|60|10|0.5|4|130|шт:130|высокобелковый
*Пудинг творожный|110|6|5|11|125|шт:125|творожный десерт

#Овощи и салаты|🥦
Огурец|15|0.8|0.1|2.8|100|шт:100|овощи
Помидор|20|0.6|0.2|4.2|120|шт:120|томат овощи
Перец болгарский|26|1.3|0.1|5.3|150|шт:150|овощи
Капуста белокочанная|27|1.8|0.1|4.7|100||овощи
Капуста тушёная|75|2|3.3|9.6|200||овощи гарнир
Брокколи варёная|35|2.4|0.4|7.2|150||овощи
Цветная капуста варёная|29|1.8|0.3|4|150||овощи
Морковь|35|1.3|0.1|6.9|80|шт:80|овощи
Свёкла варёная|49|1.8|0|10.8|100||овощи
Лук репчатый|41|1.4|0|10.4|50|шт:80|овощи
Кабачок жареный|88|1.2|6|7|150||овощи
Баклажан запечённый|35|1.2|0.1|8|150||овощи
Листья салата|14|1.5|0.1|2|50||зелень
Шампиньоны жареные|108|3.7|9|1|100||грибы
Зелёный горошек консервированный|55|3.6|0.2|9.8|80||горошек
Кукуруза консервированная|119|3.9|1.2|22.7|80||кукуруза
Квашеная капуста|23|1.8|0.1|3|100||соленья
Огурцы солёные|13|0.8|0.1|1.7|100||соленья
Авокадо|160|2|14.7|8.5|100|шт:150|
Овощной салат с маслом|90|1|7|5|200||салат огурцы помидоры
Салат «Цезарь» с курицей|200|10|14|8|200||салат цезарь
Салат «Греческий»|85|2.5|7|3|200||салат
Салат «Оливье»|198|5.5|16.5|6.9|200||салат оливье
Винегрет|130|1.7|10.3|8|200||салат
Рагу овощное|70|1.8|3.4|8|250||овощи

#Фрукты и ягоды|🍎
Банан|95|1.5|0.2|21.8|120|шт:120|фрукты
Яблоко|47|0.4|0.4|9.8|180|шт:180|фрукты
Груша|47|0.4|0.3|10.3|180|шт:180|фрукты
Апельсин|43|0.9|0.2|8.1|200|шт:200|фрукты цитрус
Мандарин|38|0.8|0.2|7.5|80|шт:80|фрукты цитрус
Грейпфрут|35|0.7|0.2|6.5|250|шт:350|фрукты цитрус
Киви|47|0.8|0.4|8.1|75|шт:75|фрукты
Виноград|72|0.6|0.6|15.4|150||фрукты
Арбуз|27|0.6|0.1|5.8|300||ягода
Дыня|35|0.6|0.3|7.4|300||
Клубника|41|0.8|0.4|7.5|150||ягоды
Голубика|39|1|0.5|6.6|100||ягоды черника
Малина|46|0.8|0.5|8.3|100||ягоды
Хурма|67|0.5|0.4|15.3|200|шт:200|фрукты
Персик|45|0.9|0.1|9.5|150|шт:150|фрукты
Ананас|52|0.4|0.2|11.5|150||фрукты
Финики|282|2.5|0.4|69|30|шт:8|сухофрукты
Курага|241|3.4|0.5|62.6|30||сухофрукты
Изюм|299|3.1|0.5|66|30||сухофрукты

#Хлеб и выпечка|🥖
Хлеб белый|262|7.5|2.9|51.4|30|ломтик:30|батон хлеб
Хлеб бородинский|208|6.8|1.3|40.7|30|ломтик:30|чёрный хлеб
Хлеб цельнозерновой|245|9|3.5|45|30|ломтик:30|хлеб
Лаваш тонкий|236|7.9|1|47.6|50|лист:80|
*Хлебцы цельнозерновые|330|11|3|63|20|шт:10|хлебцы dr korner
Блины|233|6.1|12.3|26|100|шт:50|блинчики
Оладьи|233|6.3|7.3|34|120|шт:40|
Булочка сдобная|339|7.9|9.4|55.5|70|шт:70|выпечка
Круассан|406|8.2|21|45.8|60|шт:60|выпечка
Пирожок с капустой|240|5|10|33|80|шт:80|выпечка
Пирожок с мясом жареный|290|9|14|33|90|шт:90|выпечка
Беляш|260|11|14|23|120|шт:120|выпечка
Чебурек|300|9|17|28|120|шт:120|выпечка
Самса с курицей|310|10|17|30|120|шт:120|выпечка
*Печенье овсяное|437|6.5|14.4|71.8|30|шт:15|печенье
*Печенье «Юбилейное»|469|7.6|19.4|68|30|шт:10|печенье
Пряник|364|4.8|2.8|77.7|30|шт:30|
Вафли с начинкой|530|3.4|30|62|20||сладкое
Сушки|336|10|1.1|72|20|шт:10|

#Готовые блюда|🍲
Гречка с курицей|124|17|1.5|11|300||ужин гречка курица
Рис с курицей|140|12|3|16|300||
Макароны по-флотски|190|9|8|20|250||макароны фарш
Плов с курицей|165|8|6|20|250||плов
Плов со свининой|210|7|10|22|250||плов
Пельмени варёные|248|11.9|12.4|22|250|шт:12|пельмени
Пельмени куриные варёные|210|12|8|23|250|шт:12|пельмени
Вареники с картошкой|148|4.4|3.5|25|250|шт:25|вареники
Манты|220|10|11|21|250|шт:50|
Голубцы|104|7|4|10|250|шт:120|
Жаркое с мясом|140|7|7|12|250||картошка мясо
Котлета с пюре|150|8|8|12|300||котлета пюре обед
Борщ|57|2.6|2.8|5.7|300|тарелка:300|суп
Щи|31|1|2|2.8|300|тарелка:300|суп
Солянка|69|5|4|3|300|тарелка:300|суп
Суп куриный с лапшой|40|2.5|1.2|5|300|тарелка:300|суп
Суп гороховый|66|4.4|2.4|7.2|300|тарелка:300|суп
Уха|46|5|1.6|3|300|тарелка:300|суп
Окрошка на кефире|52|2.7|2.9|4|300|тарелка:300|суп
Рассольник|42|1.3|2|5|300|тарелка:300|суп
Лапша удон с курицей|160|9|5|20|300||вок лапша
Сэндвич с курицей|220|12|9|22|150|шт:150|бутерброд
Бутерброд с сыром|300|11|15|30|60|шт:60|бутерброд
Бутерброд с колбасой|290|10|16|27|60|шт:60|бутерброд

#Полуфабрикаты и магазин|🛒
*Чебупели с мясом «Горячая штучка»|280|7.7|15|27.6|150|шт:50|чебупели горячая штучка
*Чебупели «Курочка» «Горячая штучка»|260|8|12|29|150|шт:50|чебупели горячая штучка
*Бульмени «Горячая штучка»|250|11|13|23|250||бульмени пельмени горячая штучка
*Наггетсы куриные замороженные|260|13|15|18|150|шт:20|наггетсы
*Пельмени «Сибирская коллекция»|260|12|13|23|250||пельмени
*Блинчики с мясом замороженные|210|9|9|22|160|шт:80|блинчики
*Пицца замороженная|250|10|10|30|150||пицца
*Сосиски «Вязанка» молочные|240|10|21|2|50|шт:50|сосиски вязанка
*Котлеты замороженные «По-домашнему»|240|13|16|11|150|шт:75|котлеты
*Сырники замороженные|220|13|9|21|150|шт:50|сырники
*Вареники с картошкой замороженные|150|4.5|3|26|250||вареники
*Чипсы картофельные|536|6.2|35.6|49|30|пачка:140|чипсы lays лейс
*Сухарики «Кириешки»|380|11|2.5|77|40|пачка:40|кириешки сухарики
*Попкорн солёный|480|8|28|50|30||попкорн
*Шоколад молочный|534|7.6|30|58|20|плитка:90|шоколад alpen gold милка
*Шоколад горький 70%|580|7.8|43|33|20|плитка:90|шоколад тёмный
*Батончик «Snickers»|510|8.5|27|58|50|шт:50|сникерс батончик
*Батончик «Mars»|450|4|17|70|50|шт:50|марс батончик
*Батончик «Twix»|495|4.7|24|65|55|шт:55|твикс батончик
*Батончик «Bounty»|485|4|26|58|55|шт:55|баунти батончик
*Батончик «KitKat»|510|7|26|61|40|шт:40|киткат батончик
*Мороженое эскимо|300|3.5|20|27|70|шт:70|мороженое
*Мороженое «48 копеек»|230|3.5|14|22|80|шт:80|мороженое
*Сникерс-мороженое|360|6|22|35|48|шт:48|мороженое

#Фастфуд|🍔
Шаурма с курицей|230|11|12|20|300|шт:300|шаверма
Бургер|260|13|11|28|200|шт:200|гамбургер
Чизбургер|265|14|12|27|120|шт:120|бургер
Хот-дог|270|10|15|24|150|шт:150|
Пицца пепперони|280|12|12|30|120|кусок:120|пицца
Пицца «Маргарита»|240|10|9|30|120|кусок:120|пицца
Наггетсы из кафе|290|15|18|17|100|шт:17|
Картофель по-деревенски|200|3|9|27|150||картошка

#Сладкое|🍬
Конфеты шоколадные|500|5|25|62|20|шт:10|конфеты
Мармелад|321|0.1|0|79.4|30||сладкое
Зефир|326|0.8|0.1|79.8|35|шт:35|сладкое
Халва подсолнечная|516|11.6|29.7|54|30||сладкое
Мёд|329|0.8|0|80.3|15|ч. ложка:8|сладкое
Сахар|399|0|0|99.8|5|ч. ложка:5|сладкое
Варенье|270|0.5|0.3|66|20|ст. ложка:20|сладкое
Шоколадная паста|540|6|31|57|15|ч. ложка:15|нутелла сладкое
Торт «Наполеон»|400|6|25|38|100|кусок:100|торт
Пирожное «Картошка»|430|6|22|53|50|шт:50|пирожное

#Напитки|🥤
Вода|0|0|0|0|250|стакан:250|
Кофе чёрный без сахара|2|0.2|0|0.3|200|чашка:200|кофе американо эспрессо
Капучино|45|2.4|2.3|3.7|300|стакан:300|кофе
Латте|54|2.8|2.8|4.3|350|стакан:350|кофе
Чай без сахара|1|0|0|0.2|250|чашка:250|чай
*Кока-кола|42|0|0|10.6|330|банка:330|газировка кола
*Кока-кола без сахара|0.3|0|0|0|330|банка:330|газировка зеро
*Энергетик|45|0|0|11|250|банка:250|адреналин ред булл
Сок апельсиновый|45|0.7|0.1|10|250|стакан:250|сок
Морс клюквенный|41|0.1|0|10.7|250|стакан:250|морс
Компот|60|0.2|0|14|250|стакан:250|
Квас|27|0.2|0|5.2|500|бутылка:500|
Пиво светлое|43|0.5|0|3.6|500|бутылка:500|пиво

#Орехи, соусы и масла|🥜
Грецкий орех|654|15.2|65.2|7|30||орехи
Миндаль|609|18.6|53.7|13|30||орехи
Арахис|552|26.3|45.2|9.9|30||орехи
Кешью|600|18.5|48.5|22.5|30||орехи
Семечки подсолнуха|578|20.7|52.9|10.5|30||семечки
Арахисовая паста|588|25|50|20|15|ст. ложка:15|
Майонез|627|0.3|67|2.6|15|ст. ложка:15|соус
Кетчуп|100|1.8|0.2|23|15|ст. ложка:15|соус
Соевый соус|50|6|0|6.8|15|ст. ложка:15|соус
Масло подсолнечное|899|0|99.9|0|10|ст. ложка:17|масло растительное
Масло оливковое|898|0|99.8|0|10|ст. ложка:17|масло
Горчица|162|9.9|12.7|5.3|10||соус
Хумус|166|7.9|9.6|14.3|50||

#Спортивное питание|💪
Протеин сывороточный|380|75|5|8|30|мерная ложка:30|протеин спортпит
Гейнер|380|20|3|68|100|порция:100|спортпит
*Протеиновый батончик|330|30|10|33|60|шт:60|bombbar батончик спортпит
*Протеиновое печенье|400|20|15|45|60|шт:60|спортпит
`;
const STORE_TAGS = 'магазин пятерочка самбери раз два магнит';
const FOOD_DB = []; const FOOD_CATS = [];
(() => {
  let cat = '';
  FOOD_RAW.split('\n').forEach((ln) => {
    ln = ln.trim(); if (!ln) return;
    if (ln[0] === '#') { const [n, e] = ln.slice(1).split('|'); cat = n; FOOD_CATS.push({ id: n, e }); return; }
    const store = ln[0] === '*'; if (store) ln = ln.slice(1);
    const [name, kcal, p, f, c, portion, unit, tags] = ln.split('|');
    const [uName, uG] = (unit || '').split(':');
    FOOD_DB.push({ key: 'db:' + name, name, kcal: +kcal, p: +p, f: +f, c: +c, portion: +portion || 100, unit: uName || '', unitG: +uG || 0, cat, store,
      tags: ((tags || '') + ' ' + cat + (store ? ' ' + STORE_TAGS : '')).toLowerCase() });
  });
})();

/* ================= База упражнений =================
   тип: w — вес и повторы, bw — повторы (можно с доп. весом), time — время, cardio — минуты и км, rounds — раунды
   met — затраты для оценки калорий */
const EX_RAW = `
#Турник и брусья
Подтягивания|bw|8|турник спина широкий хват
Подтягивания обратным хватом|bw|8|турник бицепс
Подтягивания узким хватом|bw|8|турник
Австралийские подтягивания|bw|5|турник низкая перекладина
Негативные подтягивания|bw|6|турник
Отжимания на брусьях|bw|8|брусья трицепс грудь
Подъём ног в висе|bw|5|турник пресс
Подъём коленей в висе|bw|4|турник пресс
Выход силой|bw|8|турник
Вис на турнике|time|3|турник хват
#Отжимания и вес тела
Отжимания от пола|bw|8|грудь трицепс
Отжимания узким хватом|bw|8|трицепс
Отжимания на кулаках|bw|8|бокс грудь
Отжимания с хлопком|bw|8|взрывные
Отжимания с ног на возвышении|bw|8|грудь
Приседания без веса|bw|5|ноги
Выпрыгивания из приседа|bw|8|ноги прыжки
Выпады|bw|5|ноги
Болгарские выпады|bw|5|ноги
Пистолетик|bw|6|ноги
Берпи|bw|8|кардио
Ягодичный мост|bw|4|ноги ягодицы
#Грудь
Жим штанги лёжа|w|6|грудь зал
Жим гантелей лёжа|w|6|грудь зал
Жим на наклонной скамье|w|6|грудь зал
Разводка гантелей|w|5|грудь зал
Кроссовер|w|5|грудь зал
Жим в тренажёре|w|5|грудь зал
#Спина
Становая тяга|w|6|спина ноги зал
Тяга штанги в наклоне|w|6|спина зал
Тяга гантели одной рукой|w|5|спина зал
Тяга верхнего блока|w|5|спина зал
Тяга горизонтального блока|w|5|спина зал
Гиперэкстензия|bw|4|поясница
Шраги|w|4|трапеция
#Ноги
Приседания со штангой|w|6|ноги зал
Жим ногами|w|6|ноги зал
Румынская тяга|w|6|ноги зал
Разгибание ног в тренажёре|w|5|ноги зал
Сгибание ног в тренажёре|w|5|ноги зал
Подъём на носки|w|4|икры
Выпады с гантелями|w|6|ноги зал
#Плечи и руки
Жим штанги стоя|w|6|плечи зал
Жим гантелей сидя|w|5|плечи зал
Махи гантелями в стороны|w|4|плечи
Разведения в наклоне|w|4|плечи
Подъём штанги на бицепс|w|4|бицепс руки
Молотки|w|4|бицепс руки
Французский жим|w|4|трицепс руки
Разгибания на блоке|w|4|трицепс руки
Обратные отжимания от скамьи|bw|5|трицепс
#Пресс
Скручивания|bw|4|пресс
Планка|time|4|пресс
Боковая планка|time|4|пресс
Велосипед|bw|5|пресс
Русский твист|bw|5|пресс
Подъём ног лёжа|bw|4|пресс
Ролик для пресса|bw|6|пресс
#Бег и кардио
Бег|cardio|9.8|пробежка улица
Бег на дорожке|cardio|9|пробежка зал
Интервальный бег|cardio|11|спринт
Ходьба|cardio|3.5|прогулка шаги
Велосипед (езда)|cardio|7.5|вело
Велотренажёр|cardio|7|вело зал
Скакалка|cardio|11|кардио бокс
Плавание|cardio|7|бассейн
Эллипс|cardio|5|зал
Гребной тренажёр|cardio|7|зал
Лестница|cardio|8|ступени
#Бокс
Бой с тенью|rounds|6|бокс
Работа на мешке|rounds|7|бокс груша
Работа на лапах|rounds|8|бокс лапы
Спарринг|rounds|9|бокс
Работа ног|rounds|6|бокс
#Растяжка и игры
Разминка|cardio|3|суставы
Растяжка|cardio|2.3|заминка
Йога|cardio|2.5|
Футбол|cardio|7|игра
Баскетбол|cardio|6.5|игра
Волейбол|cardio|4|игра
Лыжи|cardio|7|зима
Коньки|cardio|5.5|зима
`;
const EX_DB = []; const EX_GROUPS = [];
(() => {
  let g = '';
  EX_RAW.split('\n').forEach((ln) => {
    ln = ln.trim(); if (!ln) return;
    if (ln[0] === '#') { g = ln.slice(1); EX_GROUPS.push(g); return; }
    const [name, type, met, tags] = ln.split('|');
    EX_DB.push({ id: 'ex:' + name, name, type, met: +met, group: g, tags: ((tags || '') + ' ' + g).toLowerCase() });
  });
})();

/* ================= Главная ================= */
const exampleCount = () => ['notes', 'reminders', 'plans', 'expenses', 'incomes', 'recurring', 'goals', 'fuel'].reduce((s, k) => s + S[k].filter((x) => x.example).length, 0)
  + S.objects.reduce((s, o) => s + o.remarks.filter((r) => r.example).length, 0);
function greeting() { const h = new Date().getHours(); return h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; }
const quickAvailable = (q) => { const d = QUICK_DEFS[q]; return d && sec(d.sec) && (!d.feat || feat(d.feat)); };
const widgetAvailable = (w) => { const d = WIDGETS[w]; return d && (!d.sec || sec(d.sec)) && (!d.feat || feat(d.feat)); };
RENDER.home = function () {
  const d = new Date();
  let html = `<div class="head" style="align-items:center"><div class="brand"><img data-logo src="icons/logo.png" alt=""><span>Life</span></div>
    <div class="head-actions"><button class="icon-btn" data-act="settings" aria-label="Настройки">${I.gear}</button></div></div>
    <div class="hello"><h1>${greeting()}${S.settings.name ? ', ' + esc(S.settings.name) : ''}</h1><p>${cap(WD_LONG[d.getDay()])}, ${d.getDate()} ${MONTH_GEN[d.getMonth()]}</p></div>`;
  html += installBanner();
  if (exampleCount()) html += `<div class="banner"><div class="grow"><b>Это примеры</b>Записи с пометкой «пример» показывают, как всё выглядит. Удалите их, когда начнёте вести свои.</div><button class="btn sm" data-act="clear-examples">Удалить</button></div>`;
  const ws = S.settings.widgets.filter((w) => w.on && widgetAvailable(w.id));
  ws.forEach((w) => { html += WIDGET[w.id] ? WIDGET[w.id]() : ''; });
  if (S.workoutActive) ui.mounts.push(tickElapsed);
  if (!ws.length) html += `<div class="card empty"><b>Главный экран пуст</b>Включите виджеты в настройках.<button class="btn primary sm" data-act="settings">Открыть настройки</button></div>`;
  return html;
};
const WIDGET = {
  food() {
    const d = todayISO(); const g = goals(); const t = dayTotals(d); const left = g.kcal - t.kcal;
    return `<div class="card"><h2>Питание сегодня <button class="link" data-act="tab" data-tab="food">Открыть</button></h2>
      <div class="food-mini"><div class="ring-wrap sm">${kcalRing(t.kcal, g.kcal, 76)}<div class="ring-txt"><b>${nf.format(Math.round(t.kcal))}</b><span>ккал</span></div></div>
      <div class="macros">${macroBar('Белки', t.p, g.p, 'p')}<div class="left-line ${left < 0 ? 'neg' : ''}">${left >= 0 ? `Осталось ${nf.format(Math.round(left))} из ${nf.format(g.kcal)}` : `Больше нормы на ${nf.format(Math.round(-left))}`}</div></div></div>
      <div class="btn-row" style="margin-top:12px"><button class="btn sm primary" data-act="add-food">${I.plus}Еда</button><button class="btn sm" data-act="water" data-n="${(S.food.water[d] || 0) + 1}">+ стакан воды</button></div></div>`;
  },
  sport() {
    const A = S.workoutActive; const last = [...S.workouts].sort((a, b) => b.start - a.start)[0];
    return `<div class="card"><h2>Тренировки <button class="link" data-act="tab" data-tab="sport">Все</button></h2>${weekStrip()}
      ${last ? `<p class="note-small" style="margin:10px 0 0;padding:0">Последняя: ${esc(last.title)}, ${relDay(new Date(last.start))}</p>` : ''}
      <button class="btn sm ${A ? '' : 'primary'}" data-act="start-workout" style="margin-top:12px">${A ? `Продолжить <span data-elapsed="${A.start}">${fmtDur(Date.now() - A.start)}</span>` : I.plus + 'Начать тренировку'}</button></div>`;
  },
  quick() {
    const qs = S.settings.quick.filter(quickAvailable).slice(0, 5);
    if (!qs.length) return '';
    return `<div class="quick" style="grid-template-columns:repeat(${Math.max(qs.length, 3)},minmax(0,1fr))">${qs.map((q) => `<button class="tile" data-act="${q}"><span class="ic">${I[QUICK_DEFS[q].icon]}</span>${QUICK_DEFS[q].name}</button>`).join('')}</div>`;
  },
  reminders() {
    const list = S.reminders.filter((r) => !r.done).sort((a, b) => a.at.localeCompare(b.at)).slice(0, 3);
    return `<div class="card"><h2>Ближайшие напоминания <button class="link" data-act="tab" data-tab="reminders">Все</button></h2>
      ${list.length ? `<div class="ops">${list.map(remRow).join('')}</div>` : `<div class="empty" style="padding:10px 0">Напоминаний нет.<button class="btn sm primary" data-act="new-rem">Добавить</button></div>`}</div>`;
  },
  plans() {
    const t = todayISO(); const list = S.plans.filter((p) => p.date === t).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
    const month = S.plans.filter((p) => p.month === t.slice(0, 7)); const done = month.filter((p) => p.done).length;
    return `<div class="card"><h2>Планы на сегодня <button class="link" data-act="tab" data-tab="plans">Месяц</button></h2>
      ${list.length ? `<div class="ops">${list.map(planRow).join('')}</div>` : `<div class="empty" style="padding:8px 0">На сегодня планов нет.<button class="btn sm primary" data-act="new-plan" data-date="${t}">Запланировать</button></div>`}
      ${month.length ? `<div class="svc-meta" style="margin-top:10px"><span>За ${MONTH_NOM[new Date().getMonth()]} выполнено ${done} из ${month.length}</span></div><div class="bar" style="margin-top:6px"><i style="width:${Math.round(done / month.length * 100)}%"></i></div>` : ''}</div>`;
  },
  expenses() {
    const mk = todayISO().slice(0, 7); const list = S.expenses.filter((x) => x.date.startsWith(mk));
    const total = list.reduce((s, x) => s + x.amount, 0); const b = S.settings.budget;
    const inc = feat('income') ? S.incomes.filter((x) => x.date.startsWith(mk)).reduce((s, x) => s + x.amount, 0) : null;
    const top = catTotals(list).slice(0, 3);
    return `<div class="card"><h2>Деньги за ${MONTH_NOM[new Date().getMonth()]} <button class="link" data-act="money" data-sec="exp">Все</button></h2>
      <div class="money-row"><div><div class="lbl">Расходы</div><div class="big-num">${money(total)}</div></div>${inc != null ? `<div><div class="lbl">Доходы</div><div class="big-num muted">${money(inc)}</div></div>` : ''}</div>
      ${b ? budgetBar(total, b) : ''}
      ${top.length ? `<div class="top-cats">${top.map((t) => `<span><span class="e">${catOf(t.cat).e}</span>${esc(catOf(t.cat).name)} <b>${money(t.sum)}</b></span>`).join('')}</div>` : ''}
      <div class="btn-row" style="margin-top:12px"><button class="btn sm primary" data-act="new-exp">${I.plus}Расход</button>${feat('income') ? `<button class="btn sm" data-act="new-inc">${I.plus}Доход</button>` : ''}</div></div>`;
  },
  objects() {
    if (!S.objects.length) return '';
    const rows = S.objects.map((o) => { const c = objCounts(o); return `<button class="row" data-act="obj-open" data-id="${o.id}"><span class="sec-ic">${I.building}</span><span class="grow"><span class="t">${esc(o.name)}</span><span class="m">${c.open} в работе${c.overdue ? '' : ', просрочек нет'}</span></span>${c.overdue ? `<span class="pill bad">${c.overdue} просроч.</span>` : c.soon ? `<span class="pill warn">${c.soon} скоро</span>` : '<span class="pill ok">в срок</span>'}</button>`; }).join('');
    return `<div class="card"><h2>Объекты <button class="link" data-act="tab" data-tab="objects">Все</button></h2><div class="ops">${rows}</div></div>`;
  },
  car() {
    const c = S.car; const next = nextService(); const fs = fuelStats();
    return `<button class="card" style="border:0;text-align:left;width:100%;display:block" data-act="tab" data-tab="car">
      <h2>Машина</h2><div class="mini-car">${carSVG(c.color)}<div>
      <div style="font-weight:700;font-size:17px">${esc(c.name) || 'Машина не указана'}</div>
      <div style="color:var(--ink-2);font-size:14px">${c.mileage != null ? kmf(c.mileage) : 'Пробег не указан'}${feat('fuel') && fs.avg ? `, ${nf1.format(fs.avg)} л/100 км` : ''}</div>
      ${next ? `<div style="margin-top:6px"><span class="pill ${next.st.cls}">${esc(next.s.name)}: ${esc(next.st.short)}</span></div>` : ''}
      </div></div></button>`;
  },
  bank() {
    const total = S.goals.reduce((s, g) => s + goalSaved(g), 0); const g = S.goals[0];
    return `<div class="card"><h2>Копилка <button class="link" data-act="money" data-sec="bank">Открыть</button></h2>
      <div class="big-num">${money(total)}</div>
      ${g ? `<div style="display:grid;gap:6px;margin-top:10px"><div class="svc-meta"><span>${esc(g.name)}</span><span>${Math.min(100, Math.round(goalSaved(g) / (g.target || 1) * 100))}%</span></div><div class="bar"><i style="width:${Math.min(100, goalSaved(g) / (g.target || 1) * 100)}%"></i></div></div>` : ''}</div>`;
  },
  notes() {
    const list = [...S.notes].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 3);
    return `<div class="card"><h2>Последние заметки <button class="link" data-act="tab" data-tab="notes">Все</button></h2>
      ${list.length ? `<div class="ops">${list.map((n) => `<button class="row" data-act="edit-note" data-id="${n.id}"><span class="dot cat-${n.cat}"></span><span class="grow"><span class="t">${esc(n.title || 'Без названия')}</span></span><span class="r">${relDay(new Date(n.updated))}</span></button>`).join('')}</div>` : `<div class="empty" style="padding:10px 0">Заметок пока нет.<button class="btn sm primary" data-act="new-note">Написать</button></div>`}</div>`;
  }
};
ACT['clear-examples'] = () => {
  ['notes', 'reminders', 'plans', 'expenses', 'incomes', 'recurring', 'goals', 'fuel'].forEach((k) => { S[k] = S[k].filter((x) => !x.example); });
  S.objects.forEach((o) => { o.remarks = o.remarks.filter((r) => !r.example); });
  save(); render(); toast('Примеры удалены');
};

/* ================= Заметки ================= */
RENDER.notes = function () {
  const count = (c) => S.notes.filter((n) => c === 'all' || n.cat === c).length;
  const chips = [['all', 'Все'], ...Object.entries(CATS)].map(([id, name]) =>
    `<button class="chip ${ui.noteCat === id ? 'on' : ''}" data-act="note-cat" data-cat="${id}">${id !== 'all' ? `<span class="dot cat-${id}"></span>` : ''}${name}<span class="n">${count(id)}</span></button>`).join('');
  ui.mounts.push(renderNoteList);
  return head('Заметки', '', plusBtn('new-note', 'Новая заметка')) +
    `<label class="search">${I.search}<input type="search" id="noteSearch" placeholder="Поиск по заметкам" value="${esc(ui.noteQuery)}" autocomplete="off"></label>
     <div class="chips">${chips}</div><div class="notes-grid" id="noteList"></div>`;
};
function renderNoteList() {
  const q = ui.noteQuery.trim().toLowerCase();
  const list = S.notes.filter((n) => (ui.noteCat === 'all' || n.cat === ui.noteCat) && (!q || (n.title + ' ' + n.body).toLowerCase().includes(q)))
    .sort((a, b) => (b.pinned - a.pinned) || b.updated.localeCompare(a.updated));
  const el = $('#noteList'); if (!el) return;
  el.innerHTML = list.length ? list.map((n) => `<button class="note-card" data-act="edit-note" data-id="${n.id}">
      <span class="top"><span class="dot cat-${n.cat}"></span>${CATS[n.cat]}${n.pinned ? `<span class="pin-ic">${I.pin}</span>` : ''}${n.example ? '<span class="tag-ex">пример</span>' : ''}<span class="when">${relDay(new Date(n.updated))}</span></span>
      <span class="t">${esc(n.title || 'Без названия')}</span>${n.body ? `<span class="b">${esc(n.body)}</span>` : ''}
      ${n.photos.length ? `<span class="note-photos">${n.photos.slice(0, 4).map((id) => `<span class="ph sm"><img data-photo="${id}" alt=""></span>`).join('')}${n.photos.length > 4 ? `<span class="ph sm more">+${n.photos.length - 4}</span>` : ''}</span>` : ''}</button>`).join('')
    : `<div class="card empty"><b>${q ? 'Ничего не найдено' : 'Здесь пока пусто'}</b>${q ? 'Попробуйте другое слово.' : 'Нажмите «+», чтобы написать первую заметку.'}</div>`;
  hydratePhotos(el);
}
function noteSheet(id) {
  const n = id ? S.notes.find((x) => x.id === id) : null;
  const d = n ? { ...n, photos: [...n.photos] } : { cat: ui.noteCat !== 'all' ? ui.noteCat : 'work', title: '', body: '', pinned: false, photos: [] };
  let saved = false; const added = [];
  openSheet(id ? 'Заметка' : 'Новая заметка', `<form id="f" class="form">
    <div class="seg" id="catSeg">${Object.entries(CATS).map(([c, name]) => `<button type="button" data-cat="${c}" class="${d.cat === c ? 'on' : ''}">${name}</button>`).join('')}</div>
    <input type="text" id="nTitle" placeholder="Заголовок" value="${esc(d.title)}" maxlength="140">
    <textarea id="nBody" placeholder="Текст заметки">${esc(d.body)}</textarea>
    ${feat('photos') ? photoStrip(d.photos, true) : ''}
    <div class="switch-row"><span>Закрепить наверху</span><label class="switch"><input type="checkbox" id="nPin" ${d.pinned ? 'checked' : ''}><i></i></label></div>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${id ? `<button class="btn danger" type="button" id="nDel">${I.trash}Удалить заметку</button>` : ''}
  </form>`, (body) => {
    $('#catSeg', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; d.cat = b.dataset.cat; $$('#catSeg button', body).forEach((x) => x.classList.toggle('on', x === b)); });
    const ta = $('#nBody', body); const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.max(150, ta.scrollHeight + 2) + 'px'; }; ta.addEventListener('input', grow); grow();
    bindPhotoStrip(body, () => d.photos, (ids) => { ids.filter((x) => !d.photos.includes(x)).forEach((x) => added.push(x)); d.photos = ids; });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const title = $('#nTitle', body).value.trim(), text = ta.value.trim();
      if (!title && !text && !d.photos.length) { toast('Напишите заголовок или текст'); return; }
      const data = { cat: d.cat, title, body: text, pinned: $('#nPin', body).checked, photos: d.photos, updated: new Date().toISOString() };
      if (n) { n.photos.filter((x) => !d.photos.includes(x)).forEach(phDel); Object.assign(n, data, { example: false }); }
      else S.notes.push(Object.assign({ id: uid() }, data));
      saved = true; save(); closeSheet(); render(); toast('Заметка сохранена');
    });
    const del = $('#nDel', body);
    if (del) del.addEventListener('click', () => {
      saved = true; const idx = S.notes.indexOf(n); closeSheet();
      removeWithUndo('Заметка удалена', () => { S.notes.splice(idx, 1); }, () => { S.notes.splice(idx, 0, n); }, () => n.photos.forEach(phDel));
    });
    if (!id) setTimeout(() => $('#nTitle', body).focus(), 320);
  }, { onClose: () => { if (!saved) added.forEach(phDel); } });
}
ACT['new-note'] = () => noteSheet();
ACT['edit-note'] = (el) => noteSheet(el.dataset.id);
ACT['note-cat'] = (el) => { ui.noteCat = el.dataset.cat; render(); };

/* ================= Напоминания ================= */
function remRow(r) {
  const d = new Date(r.at); const over = !r.done && d < new Date();
  return `<div class="row ${r.done ? 'done' : ''}" data-act="edit-rem" data-id="${r.id}" role="button" tabindex="0">
    <button class="check ${r.done ? 'on' : ''}" data-act="toggle-rem" data-id="${r.id}" aria-label="${r.done ? 'Вернуть' : 'Выполнено'}">${r.done ? I.tick : ''}</button>
    <span class="grow"><span class="t">${esc(r.title)}${r.example ? '<span class="tag-ex">пример</span>' : ''}</span>
    <span class="m" style="${over ? 'color:var(--bad)' : ''}">${relDay(d)}, ${fmtT(d)}${r.repeat !== 'none' ? ', ' + REPEAT[r.repeat].toLowerCase() : ''}</span></span>
    ${!r.done ? `<button class="act" data-act="rem-cal" data-id="${r.id}" aria-label="В Календарь iPhone">${I.cal}</button>` : ''}</div>`;
}
RENDER.reminders = function () {
  const now = new Date();
  const open = S.reminders.filter((r) => !r.done).sort((a, b) => a.at.localeCompare(b.at));
  const done = S.reminders.filter((r) => r.done).sort((a, b) => b.at.localeCompare(a.at));
  const groups = [['Просрочено', (d) => d < now], ['Сегодня', (d) => d >= now && dayDiff(d, now) === 0], ['Завтра', (d) => dayDiff(d, now) === 1], ['Позже', (d) => dayDiff(d, now) > 1]];
  let html = head('Напоминания', open.length ? `${open.length} ${plural(open.length, 'активное', 'активных', 'активных')}` : '', plusBtn('new-rem', 'Новое напоминание'));
  if (notifState() === 'default') html += `<div class="banner"><div class="grow"><b>Уведомления в Life</b>Life покажет напоминание, пока он открыт. Чтобы сигнал пришёл при закрытом приложении, нажимайте значок календаря.</div><button class="btn sm primary" data-act="notif-on">Включить</button></div>`;
  if (!open.length) html += `<div class="card empty"><b>Активных напоминаний нет</b>Нажмите «+», чтобы добавить первое.</div>`;
  groups.forEach(([name, test]) => { const g = open.filter((r) => test(new Date(r.at))); if (g.length) html += `<div class="section-label">${name}</div><div class="list">${g.map(remRow).join('')}</div>`; });
  if (done.length) {
    html += `<button class="btn ghost" data-act="toggle-done" style="justify-self:start">${ui.showDone ? 'Скрыть выполненные' : `Показать выполненные (${done.length})`}</button>`;
    if (ui.showDone) html += `<div class="list">${done.map(remRow).join('')}</div><button class="btn sm" data-act="clear-done" style="justify-self:start">Удалить выполненные</button>`;
  }
  html += `<p class="note-small">Значок календаря добавляет событие с сигналом в Календарь iPhone. Тогда уведомление придёт, даже если Life закрыт.</p>`;
  return html;
};
function remSheet(id, preset) {
  const now = new Date(); const def = new Date(now.getTime() + 3600e3); def.setMinutes(0, 0, 0);
  const r = id ? S.reminders.find((x) => x.id === id) : Object.assign({ title: '', note: '', at: def.toISOString(), repeat: 'none' }, preset || {});
  if (!r) return; const d = new Date(r.at);
  openSheet(id ? 'Напоминание' : 'Новое напоминание', `<form id="f" class="form">
    <input type="text" id="rTitle" placeholder="Что напомнить" value="${esc(r.title)}" maxlength="140">
    <div class="two"><label class="field"><span>Дата</span><input type="date" id="rDate" value="${isoOf(d)}"></label>
    <label class="field"><span>Время</span><input type="time" id="rTime" value="${fmtT(d)}"></label></div>
    <label class="field"><span>Повтор</span><select id="rRepeat">${Object.entries(REPEAT).map(([k, v]) => `<option value="${k}" ${r.repeat === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
    <label class="field"><span>Комментарий</span><input type="text" id="rNote" value="${esc(r.note)}" placeholder="Необязательно"></label>
    <div class="switch-row"><span>Добавить в Календарь iPhone</span><label class="switch"><input type="checkbox" id="rCal" ${id ? '' : 'checked'}><i></i></label></div>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${id ? `<button class="btn danger" type="button" id="rDel">${I.trash}Удалить напоминание</button>` : ''}
  </form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const title = $('#rTitle', body).value.trim(); if (!title) { toast('Напишите, что напомнить'); $('#rTitle', body).focus(); return; }
      const dv = $('#rDate', body).value, tv = $('#rTime', body).value || '09:00';
      if (!dv) { toast('Укажите дату'); return; }
      const [y, m, dd] = dv.split('-').map(Number); const [hh, mm] = tv.split(':').map(Number);
      const data = { title, note: $('#rNote', body).value.trim(), at: new Date(y, m - 1, dd, hh, mm).toISOString(), repeat: $('#rRepeat', body).value, done: false, notified: false };
      let rec; if (id) rec = Object.assign(r, data, { example: false }); else { rec = Object.assign({ id: uid() }, data); S.reminders.push(rec); }
      const toCal = $('#rCal', body).checked;
      save(); closeSheet(); render(); toast('Напоминание сохранено');
      if (toCal) addToCalendar(rec);
    });
    const del = $('#rDel', body);
    if (del) del.addEventListener('click', () => { const idx = S.reminders.indexOf(r); closeSheet(); removeWithUndo('Напоминание удалено', () => S.reminders.splice(idx, 1), () => S.reminders.splice(idx, 0, r)); });
    if (!id) setTimeout(() => $('#rTitle', body).focus(), 320);
  });
}
function nextOccurrence(r) {
  const d = new Date(r.at); const now = new Date(); let guard = 0;
  const step = (x) => { if (r.repeat === 'day') x.setDate(x.getDate() + 1); else if (r.repeat === 'week') x.setDate(x.getDate() + 7); else if (r.repeat === 'month') x.setMonth(x.getMonth() + 1); else x.setFullYear(x.getFullYear() + 1); };
  do { step(d); guard++; } while (d < now && guard < 5000);
  return d.toISOString();
}
function icsDate(d) { return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`; }
function icsText(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
function addToCalendar(r) {
  const d = new Date(r.at); const end = new Date(d.getTime() + 15 * 60000); const now = new Date();
  const rr = { day: 'DAILY', week: 'WEEKLY', month: 'MONTHLY', year: 'YEARLY' }[r.repeat];
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Life//RU', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${r.id}@life`,
    `DTSTAMP:${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`,
    `DTSTART:${icsDate(d)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${icsText(r.title)}`];
  if (r.note) lines.push(`DESCRIPTION:${icsText(r.note)}`);
  if (rr) lines.push(`RRULE:FREQ=${rr}`);
  lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(r.title)}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.rel = 'noopener';
  if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) a.download = 'life-' + r.id + '.ics';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
const notifState = () => ('Notification' in window) ? Notification.permission : 'unsupported';
async function notifyNow(title, body) {
  try {
    if (notifState() !== 'granted') return false;
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (reg) { await reg.showNotification(title, { body, icon: 'icons/icon-192.png', tag: title + body }); return true; }
    new Notification(title, { body, icon: 'icons/icon-192.png' }); return true;
  } catch (e) { return false; }
}
function checkDue() {
  const now = new Date(); let changed = false;
  S.reminders.forEach((r) => {
    if (r.done || r.notified) return; const d = new Date(r.at);
    if (d <= now && now - d < 12 * 3600e3) { r.notified = true; changed = true; notifyNow('Life: напоминание', r.title).then((ok) => { if (!ok) toast('Напоминание: ' + r.title); }); }
  });
  if (changed) { save(); if (!sheetOpen && (ui.tab === 'reminders' || ui.tab === 'home')) render(); }
}
ACT['new-rem'] = () => remSheet();
ACT['edit-rem'] = (el) => remSheet(el.dataset.id);
ACT['toggle-rem'] = (el) => {
  const r = S.reminders.find((x) => x.id === el.dataset.id); if (!r) return;
  if (!r.done && r.repeat !== 'none') { r.at = nextOccurrence(r); r.notified = false; save(); render(); toast('Выполнено. Следующее: ' + relDay(new Date(r.at))); }
  else { r.done = !r.done; save(); render(); if (r.done) toast('Выполнено'); }
};
ACT['rem-cal'] = (el) => { const r = S.reminders.find((x) => x.id === el.dataset.id); if (r) addToCalendar(r); };
ACT['toggle-done'] = () => { ui.showDone = !ui.showDone; render(); };
ACT['clear-done'] = () => { const old = S.reminders.slice(); removeWithUndo('Выполненные удалены', () => { S.reminders = S.reminders.filter((r) => !r.done); }, () => { S.reminders = old; }); };
ACT['notif-on'] = () => { if ('Notification' in window) Notification.requestPermission().then((p) => { render(); toast(p === 'granted' ? 'Уведомления включены' : 'Уведомления не разрешены. Их можно включить в настройках iPhone.'); }); };

/* ================= Планы ================= */
const planMonth = () => { if (!ui.planMonth) { const n = new Date(); ui.planMonth = new Date(n.getFullYear(), n.getMonth(), 1); } return ui.planMonth; };
function planRow(p) {
  const meta = [p.time, p.date ? null : 'на месяц', p.note && esc(p.note)].filter(Boolean).join(', ');
  return `<div class="row ${p.done ? 'done' : ''}" data-act="edit-plan" data-id="${p.id}" role="button" tabindex="0">
    <button class="check ${p.done ? 'on' : ''}" data-act="toggle-plan" data-id="${p.id}" aria-label="${p.done ? 'Вернуть' : 'Выполнено'}">${p.done ? I.tick : ''}</button>
    <span class="dot cat-${p.cat}"></span>
    <span class="grow"><span class="t">${esc(p.title)}${p.example ? '<span class="tag-ex">пример</span>' : ''}</span>${meta ? `<span class="m">${meta}</span>` : ''}</span></div>`;
}
RENDER.plans = function () {
  const m = planMonth(); const mk = monthKey(m); const isCur = mk === todayISO().slice(0, 7);
  const all = S.plans.filter((p) => p.month === mk);
  const done = all.filter((p) => p.done).length;
  const goals = all.filter((p) => !p.date);
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  let html = head('Планы', '', plusBtn('new-plan', 'Новый план', `data-date="${isCur ? todayISO() : mk + '-01'}"`));
  html += `<div class="month-nav"><button class="icon-btn" data-act="plan-month" data-dir="-1" aria-label="Предыдущий месяц">${I.left}</button><b>${monthTitle(m)}</b><button class="icon-btn" data-act="plan-month" data-dir="1" aria-label="Следующий месяц">${I.right}</button></div>`;
  html += `<div class="bubbles-card"><div class="bubbles" id="bubbleStage" aria-label="Дни месяца">`;
  for (let d = 1; d <= days; d++) {
    const iso = `${mk}-${pad(d)}`; const ps = all.filter((p) => p.date === iso); const dt = new Date(m.getFullYear(), m.getMonth(), d);
    const isToday = iso === todayISO(); const past = dayDiff(dt, new Date()) < 0;
    const allDone = ps.length && ps.every((p) => p.done);
    const cls = ['bub', isToday && 'today', ps.length && 'has', allDone && 'all-done', past && !isToday && 'past', (dt.getDay() === 0 || dt.getDay() === 6) && 'wkend'].filter(Boolean).join(' ');
    html += `<button class="${cls}" data-act="plan-day" data-day="${iso}" data-n="${ps.length}" aria-label="${d} ${MONTH_GEN[m.getMonth()]}, планов: ${ps.length}"><span class="bub-in"><b>${d}</b><small>${WD_SHORT[dt.getDay()]}</small>${ps.length ? `<span class="bub-dots">${ps.slice(0, 4).map((p) => `<i class="${p.done ? 'd' : ''}"></i>`).join('')}</span>` : ''}</span></button>`;
  }
  goals.slice(0, 4).forEach((g) => { html += `<button class="bub goal ${g.done ? 'all-done' : ''}" data-act="edit-plan" data-id="${g.id}" data-goal="1"><span class="bub-in"><span class="g-t">${esc(g.title)}</span>${g.done ? `<span class="g-ok">${I.tick}</span>` : ''}</span></button>`; });
  html += `</div><div class="bubbles-foot"><span>${all.length ? `Выполнено ${done} из ${all.length}` : 'Планов на этот месяц нет'}</span><span>Нажмите на день</span></div>${all.length ? `<div class="bar" style="margin:0 14px 14px"><i style="width:${Math.round(done / all.length * 100)}%"></i></div>` : ''}</div>`;
  html += `<div class="section-label"><span>Цели на ${MONTH_NOM[m.getMonth()]}</span></div>`;
  html += goals.length ? `<div class="list">${goals.map(planRow).join('')}</div>` : '';
  html += `<button class="btn sm" data-act="new-plan" data-goal="1" style="justify-self:start">${I.plus}Цель на месяц</button>`;
  const dated = all.filter((p) => p.date).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '99').localeCompare(b.time || '99'));
  const upcoming = isCur ? dated.filter((p) => p.date >= todayISO() || !p.done) : dated;
  if (upcoming.length) {
    html += `<div class="section-label"><span>${isCur ? 'Впереди и невыполненное' : 'Все планы месяца'}</span></div>`;
    const byDay = {}; upcoming.forEach((p) => { (byDay[p.date] = byDay[p.date] || []).push(p); });
    Object.keys(byDay).forEach((d) => { const dt = toDate(d); html += `<div class="day-head"><button class="link" data-act="plan-day" data-day="${d}">${cap(relDay(dt))}${Math.abs(dayDiff(dt, new Date())) > 1 ? ', ' + WD_SHORT[dt.getDay()] : ''}</button></div><div class="list">${byDay[d].map(planRow).join('')}</div>`; });
  } else if (!all.length) html += `<div class="card empty"><b>Месяц пока пустой</b>Нажмите на любой пузырь-день или на «+», чтобы добавить план.</div>`;
  ui.mounts.push(startBubbles);
  return html;
};

/* Пузыри: мягкая физика — пружина к своему месту, лёгкое кружение и расталкивание */
const BUB = { raf: 0, items: [], stage: null, W: 0, H: 0, drag: null, suppress: 0 };
function stopBubbles() { if (BUB.raf) cancelAnimationFrame(BUB.raf); BUB.raf = 0; BUB.items = []; BUB.stage = null; }
function startBubbles() {
  stopBubbles();
  const stage = $('#bubbleStage'); if (!stage) return;
  const W = stage.clientWidth || 340; const els = $$('.bub', stage);
  const dayEls = els.filter((e) => !e.dataset.goal); const goalEls = els.filter((e) => e.dataset.goal);
  const cols = W >= 340 ? 6 : 5; const cell = W / cols; const rows = Math.ceil(dayEls.length / cols);
  const base = Math.min(cell * 0.36, 25); const rowH = cell * 0.88; const top = cell * 0.18;
  const goalH = goalEls.length ? cell * 1.75 : 0;
  const H = Math.round(top * 2 + rows * rowH + goalH); stage.style.height = H + 'px';
  const motion = !reduceMotion();
  BUB.items = els.map((el, i) => {
    let r, hx, hy;
    if (el.dataset.goal) {
      const gi = goalEls.indexOf(el); r = Math.min(cell * 0.78, 50);
      hx = W * (gi + 0.5) / goalEls.length; hy = top + rows * rowH + goalH * 0.52;
    } else {
      const n = +el.dataset.n; const c = i % cols, row = Math.floor(i / cols);
      r = base + Math.min(n, 4) * base * 0.16 + (el.classList.contains('today') ? 3 : 0);
      hx = (c + 0.5 + (row % 2 ? 0.22 : -0.22)) * cell; hx = Math.max(r + 2, Math.min(W - r - 2, hx));
      hy = top + (row + 0.5) * rowH;
    }
    el.style.width = el.style.height = (r * 2) + 'px';
    el.style.setProperty('--fs', Math.round(r * 0.66) + 'px');
    const it = { el, r, hx, hy, x: motion ? W / 2 + (Math.random() - 0.5) * 30 : hx, y: motion ? H / 2 + (Math.random() - 0.5) * 30 : hy, vx: 0, vy: 0, ph: Math.random() * 6.28, w: 0.45 + Math.random() * 0.35 };
    el.style.transform = `translate3d(${it.x - r}px, ${it.y - r}px, 0)`;
    el.style.setProperty('--d', motion ? (i * 16) + 'ms' : '0ms');
    return it;
  });
  BUB.stage = stage; BUB.W = W; BUB.H = H;
  requestAnimationFrame(() => stage.classList.add('ready'));
  bindBubbleDrag(stage);
  if (!motion) return;
  let last = performance.now(); const t0 = last;
  const frame = (now) => {
    if (!BUB.stage || !BUB.stage.isConnected) { stopBubbles(); return; }
    const dt = Math.min(2.5, (now - last) / 16.7); last = now; const t = (now - t0) / 1000;
    const its = BUB.items; const A = 4.5; const K = t < 1.4 ? 0.022 : 0.016;
    for (const b of its) {
      if (b === BUB.drag) continue;
      const tx = b.hx + Math.cos(t * b.w + b.ph) * A, ty = b.hy + Math.sin(t * b.w * 1.3 + b.ph * 1.7) * A;
      b.vx += (tx - b.x) * K * dt; b.vy += (ty - b.y) * K * dt;
    }
    for (let i = 0; i < its.length; i++) {
      const a = its[i];
      for (let j = i + 1; j < its.length; j++) {
        const b = its[j]; const dx = b.x - a.x, dy = b.y - a.y; const min = a.r + b.r + 3; const d2 = dx * dx + dy * dy;
        if (d2 < min * min && d2 > 0.01) {
          const d = Math.sqrt(d2); const push = (min - d) / d * 0.18 * dt;
          const fa = b === BUB.drag ? 1 : a === BUB.drag ? 0 : 0.5, fb = 1 - fa;
          a.vx -= dx * push * fa; a.vy -= dy * push * fa; b.vx += dx * push * fb; b.vy += dy * push * fb;
        }
      }
    }
    const damp = Math.pow(0.86, dt);
    for (const b of its) {
      if (b !== BUB.drag) {
        b.vx *= damp; b.vy *= damp; b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < b.r) { b.x = b.r; b.vx *= -0.4; } if (b.x > BUB.W - b.r) { b.x = BUB.W - b.r; b.vx *= -0.4; }
        if (b.y < b.r) { b.y = b.r; b.vy *= -0.4; } if (b.y > BUB.H - b.r) { b.y = BUB.H - b.r; b.vy *= -0.4; }
      }
      b.el.style.transform = `translate3d(${(b.x - b.r).toFixed(1)}px, ${(b.y - b.r).toFixed(1)}px, 0)`;
    }
    BUB.raf = requestAnimationFrame(frame);
  };
  BUB.raf = requestAnimationFrame(frame);
}
function bindBubbleDrag(stage) {
  let st = null;
  stage.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.bub'); if (!el || reduceMotion()) return;
    const b = BUB.items.find((x) => x.el === el); if (!b) return;
    const box = stage.getBoundingClientRect();
    st = { b, box, sx: e.clientX, sy: e.clientY, moved: false, lx: e.clientX, ly: e.clientY, id: e.pointerId };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.id) return;
    const dx = e.clientX - st.sx, dy = e.clientY - st.sy;
    if (!st.moved && Math.hypot(dx, dy) > 8) { st.moved = true; BUB.drag = st.b; st.b.el.classList.add('drag'); try { stage.setPointerCapture(e.pointerId); } catch (er) { /* нет захвата */ } }
    if (st.moved) {
      st.b.vx = (e.clientX - st.lx) * 0.6; st.b.vy = (e.clientY - st.ly) * 0.6; st.lx = e.clientX; st.ly = e.clientY;
      st.b.x = Math.max(st.b.r, Math.min(BUB.W - st.b.r, e.clientX - st.box.left)); st.b.y = Math.max(st.b.r, Math.min(BUB.H - st.b.r, e.clientY - st.box.top));
    }
  });
  const end = () => { if (!st) return; if (st.moved) { BUB.suppress = Date.now() + 350; st.b.el.classList.remove('drag'); } BUB.drag = null; st = null; };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
}

/* Лист дня */
function dayTitle(iso) { const d = toDate(iso); return `${cap(WD_LONG[d.getDay()])}, ${d.getDate()} ${MONTH_GEN[d.getMonth()]}`; }
function planDaySheet(iso) {
  const ps = S.plans.filter((p) => p.date === iso).sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  const rems = S.reminders.filter((r) => isoOf(new Date(r.at)) === iso);
  openSheet(dayTitle(iso), `<div class="form">
    ${ps.length ? `<div class="list" id="dayList">${ps.map(planRow).join('')}</div>` : `<div class="card empty" style="padding:18px"><b>Планов нет</b>Добавьте первый ниже.</div>`}
    <form class="todo-add" id="quickPlan"><input type="text" id="qpText" placeholder="Новый план на этот день" maxlength="140" autocomplete="off"><button class="btn primary" type="submit" aria-label="Добавить">${I.plus}</button></form>
    <button class="btn sm" type="button" id="qpMore" style="justify-self:start">Со временем и напоминанием</button>
    ${rems.length ? `<div class="section-label"><span>Напоминания в этот день</span></div><div class="list">${rems.map((r) => `<div class="row"><span class="sec-ic sm">${I.bell}</span><span class="grow"><span class="t">${esc(r.title)}</span><span class="m">${fmtT(new Date(r.at))}</span></span></div>`).join('')}</div>` : ''}
  </div>`, (body) => {
    $('#quickPlan', body).addEventListener('submit', (e) => {
      e.preventDefault(); const v = $('#qpText', body).value.trim(); if (!v) { $('#qpText', body).focus(); return; }
      S.plans.push({ id: uid(), title: v, date: iso, month: iso.slice(0, 7), time: '', cat: 'life', done: false, note: '' }); save(); render();
      planDaySheet(iso); toast('План добавлен'); setTimeout(() => { const i = $('#qpText'); if (i) i.focus(); }, 60);
    });
    $('#qpMore', body).addEventListener('click', () => planSheet(null, { date: iso }, () => planDaySheet(iso)));
    body.addEventListener('click', (e) => {
      const t = e.target.closest('[data-act="toggle-plan"]'); if (t) { e.stopPropagation(); togglePlan(t.dataset.id); planDaySheet(iso); return; }
      const r = e.target.closest('[data-act="edit-plan"]'); if (r) { e.stopPropagation(); planSheet(r.dataset.id, null, () => planDaySheet(iso)); }
    });
  });
}
function planSheet(id, preset, backFn) {
  const p = id ? S.plans.find((x) => x.id === id) : null; if (id && !p) return;
  const d = p ? { ...p } : Object.assign({ title: '', date: todayISO(), time: '', cat: 'life', note: '' }, preset || {});
  let kind = d.date ? 'day' : 'month'; let cat = d.cat;
  const mk = d.month || (d.date ? d.date.slice(0, 7) : monthKey(planMonth()));
  openSheet(p ? 'План' : (kind === 'month' ? 'Цель на месяц' : 'Новый план'), `<form id="f" class="form">
    <input type="text" id="pTitle" placeholder="Что планируете" value="${esc(d.title)}" maxlength="140">
    <div class="seg" id="kindSeg"><button type="button" data-v="day" class="${kind === 'day' ? 'on' : ''}">На день</button><button type="button" data-v="month" class="${kind === 'month' ? 'on' : ''}">На весь месяц</button></div>
    <div class="two" id="dayFields" ${kind === 'month' ? 'hidden' : ''}><label class="field"><span>Дата</span><input type="date" id="pDate" value="${d.date || mk + '-01'}"></label>
    <label class="field"><span>Время</span><input type="time" id="pTime" value="${d.time || ''}"></label></div>
    <label class="field" id="monthField" ${kind === 'day' ? 'hidden' : ''}><span>Месяц</span><input type="month" id="pMonth" value="${mk}"></label>
    <div class="seg" id="pCat">${Object.entries(CATS).map(([c, n]) => `<button type="button" data-cat="${c}" class="${cat === c ? 'on' : ''}">${n}</button>`).join('')}</div>
    <input type="text" id="pNote" value="${esc(d.note)}" placeholder="Комментарий, необязательно" maxlength="120">
    ${!p ? `<div class="switch-row" id="remRow" ${kind === 'month' ? 'hidden' : ''}><span>Создать напоминание</span><label class="switch"><input type="checkbox" id="pRem"><i></i></label></div>` : ''}
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${p ? `<button class="btn danger" type="button" id="pDel">${I.trash}Удалить план</button>` : ''}
  </form>`, (body) => {
    $('#kindSeg', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; kind = b.dataset.v; $$('#kindSeg button', body).forEach((x) => x.classList.toggle('on', x === b)); $('#dayFields', body).hidden = kind !== 'day'; $('#monthField', body).hidden = kind !== 'month'; const rr = $('#remRow', body); if (rr) rr.hidden = kind !== 'day'; });
    $('#pCat', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.cat; $$('#pCat button', body).forEach((x) => x.classList.toggle('on', x === b)); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const title = $('#pTitle', body).value.trim(); if (!title) { toast('Напишите, что планируете'); $('#pTitle', body).focus(); return; }
      const date = kind === 'day' ? ($('#pDate', body).value || todayISO()) : null;
      const month = date ? date.slice(0, 7) : ($('#pMonth', body).value || mk);
      const data = { title, date, month, time: kind === 'day' ? $('#pTime', body).value : '', cat, note: $('#pNote', body).value.trim() };
      if (p) Object.assign(p, data, { example: false }); else S.plans.push(Object.assign({ id: uid(), done: false }, data));
      const wantRem = $('#pRem', body) && $('#pRem', body).checked && date;
      if (wantRem) { const [y, mo, dd] = date.split('-').map(Number); const [hh, mm] = (data.time || '09:00').split(':').map(Number); S.reminders.push({ id: uid(), title, note: '', at: new Date(y, mo - 1, dd, hh, mm).toISOString(), repeat: 'none', done: false }); }
      save(); render();
      if (backFn && date) backFn(); else closeSheet();
      toast(wantRem ? 'План и напоминание сохранены' : 'План сохранён');
    });
    const del = $('#pDel', body);
    if (del) del.addEventListener('click', () => { const idx = S.plans.indexOf(p); if (!backFn || !p.date) closeSheet(); removeWithUndo('План удалён', () => S.plans.splice(idx, 1), () => S.plans.splice(idx, 0, p)); if (backFn && p.date) backFn(); });
    if (!p) setTimeout(() => $('#pTitle', body).focus(), 320);
  }, { back: backFn });
}
function togglePlan(id) { const p = S.plans.find((x) => x.id === id); if (!p) return; p.done = !p.done; save(); render(); if (p.done) toast('Выполнено'); }
ACT['new-plan'] = (el) => planSheet(null, el && el.dataset.goal ? { date: null, month: monthKey(planMonth()) } : { date: (el && el.dataset.date) || todayISO() });
ACT['edit-plan'] = (el) => { if (el.dataset.goal && Date.now() < BUB.suppress) return; planSheet(el.dataset.id); };
ACT['toggle-plan'] = (el) => togglePlan(el.dataset.id);
ACT['plan-day'] = (el) => { if (Date.now() < BUB.suppress) return; planDaySheet(el.dataset.day); };
ACT['plan-month'] = (el) => { const m = planMonth(); ui.planMonth = new Date(m.getFullYear(), m.getMonth() + (+el.dataset.dir), 1); render('anim-fade'); };

/* ================= Деньги ================= */
const MONEY_SEGS = () => [['exp', 'Расходы'], feat('income') && ['inc', 'Доходы'], feat('recurring') && ['rec', 'Платежи'], feat('piggy') && ['bank', 'Копилка']].filter(Boolean);
const curMonth = () => { if (!ui.month) { const n = new Date(); ui.month = new Date(n.getFullYear(), n.getMonth(), 1); } return ui.month; };
function catOf(id) {
  if (EXP_CAT[id]) return EXP_CAT[id];
  const c = S.customCats.find((x) => x.id === id);
  return c ? { id: c.id, name: c.name, e: c.e, g: 'Мои' } : EXP_CAT.other;
}
const incOf = (id) => INC_CAT[id] || INC_CAT.other;
function catTotals(list) {
  const m = {}; list.forEach((x) => { m[x.cat] = (m[x.cat] || 0) + x.amount; });
  return Object.entries(m).map(([cat, sum]) => ({ cat, sum })).sort((a, b) => b.sum - a.sum);
}
function budgetBar(total, b) {
  return `<div style="display:grid;gap:6px;margin-top:10px"><div class="bar ${total > b ? 'bad' : total > b * 0.85 ? 'warn' : ''}"><i style="width:${Math.min(100, total / b * 100)}%"></i></div><div class="svc-meta"><span>${Math.round(total / b * 100)}% бюджета ${money(b)}</span><span>${total <= b ? 'осталось ' + money(b - total) : 'перерасход ' + money(total - b)}</span></div></div>`;
}
RENDER.bank = function () {
  const segs = MONEY_SEGS(); if (!segs.some((s) => s[0] === ui.money)) ui.money = 'exp';
  const titles = { exp: 'Расходы', inc: 'Доходы', rec: 'Платежи', bank: 'Копилка' };
  const plus = { exp: ['new-exp', 'Новый расход'], inc: ['new-inc', 'Новый доход'], rec: ['new-recur', 'Новый регулярный платёж'], bank: ['goal-new', 'Новая цель'] }[ui.money];
  let html = head(titles[ui.money], '', plusBtn(plus[0], plus[1]));
  if (segs.length > 1) html += `<div class="seg">${segs.map(([k, v]) => `<button data-act="money" data-sec="${k}" class="${ui.money === k ? 'on' : ''}">${v}</button>`).join('')}</div>`;
  return html + ({ exp: renderExp, inc: renderInc, rec: renderRec, bank: renderGoals })[ui.money]();
};
function monthNav(actName) {
  const m = curMonth(); const isCur = monthKey(m) === todayISO().slice(0, 7);
  return `<div class="month-nav"><button class="icon-btn" data-act="${actName}" data-dir="-1" aria-label="Предыдущий месяц">${I.left}</button><b>${monthTitle(m)}</b><button class="icon-btn" data-act="${actName}" data-dir="1" aria-label="Следующий месяц" ${isCur ? 'disabled' : ''}>${I.right}</button></div>`;
}
function monthTotals(mk) {
  const exp = S.expenses.filter((x) => x.date.startsWith(mk)).reduce((s, x) => s + x.amount, 0);
  const inc = S.incomes.filter((x) => x.date.startsWith(mk)).reduce((s, x) => s + x.amount, 0);
  return { exp, inc, rest: inc - exp };
}
function balanceLine(mk) {
  if (!feat('income')) return '';
  const t = monthTotals(mk);
  return `<div class="balance"><div><span>Доходы</span><b>${money(t.inc)}</b></div><div><span>Расходы</span><b>${money(t.exp)}</b></div><div><span>Остаток</span><b class="${t.rest < 0 ? 'neg' : 'pos'}">${t.rest < 0 ? '−' : ''}${money(Math.abs(t.rest))}</b></div></div>`;
}
function renderExp() {
  const m = curMonth(); const mk = monthKey(m); const isCur = mk === todayISO().slice(0, 7);
  const all = S.expenses.filter((x) => x.date.startsWith(mk));
  const prev = new Date(m.getFullYear(), m.getMonth() - 1, 1);
  const prevTotal = S.expenses.filter((x) => x.date.startsWith(monthKey(prev))).reduce((s, x) => s + x.amount, 0);
  const total = all.reduce((s, x) => s + x.amount, 0);
  const days = isCur ? new Date().getDate() : new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const b = S.settings.budget;
  let html = monthNav('month');
  let cmp = ''; if (prevTotal > 0 && total > 0) { const d = Math.round((total - prevTotal) / prevTotal * 100); cmp = `${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)}% к ${MONTH_DAT[prev.getMonth()]}`; }
  html += `<div class="card"><h2>Потрачено <button class="link" data-act="budget">${b ? 'Бюджет' : 'Задать бюджет'}</button></h2><div class="big-num">${money(total)}</div>
    <div class="svc-meta" style="margin-top:6px"><span>${total ? 'в среднем ' + money(total / days) + ' в день' : 'трат пока нет'}</span><span>${cmp}</span></div>
    ${b ? budgetBar(total, b) : ''}${balanceLine(mk)}</div>`;
  if (feat('recurring') && isCur) {
    const soon = S.recurring.map((r) => ({ r, d: nextDue(r) })).filter((x) => x.d && dayDiff(x.d, new Date()) <= 7).sort((a, b2) => a.d - b2.d).slice(0, 3);
    if (soon.length) html += `<div class="card"><h2>Скоро по регулярным <button class="link" data-act="money" data-sec="rec">Все</button></h2><div class="ops">${soon.map(({ r, d }) => recRow(r, d)).join('')}</div></div>`;
  }
  if (!all.length) return html + `<div class="card empty"><b>${isCur ? 'В этом месяце трат нет' : 'В этом месяце трат не было'}</b>${isCur ? 'Нажмите «+», введите сумму и выберите, на что потратили.<button class="btn sm primary" data-act="new-exp">Добавить расход</button>' : ''}</div>`;
  const tots = catTotals(all); const max = tots[0].sum; const shown = ui.allCats ? tots : tots.slice(0, 6);
  html += `<div class="card"><h2>По категориям ${tots.length > 6 ? `<button class="link" data-act="all-cats">${ui.allCats ? 'Свернуть' : 'Все ' + tots.length}</button>` : ''}</h2><div class="cat-bars">${shown.map((t) => {
    const c = catOf(t.cat); return `<button class="cat-bar ${ui.expFilter === t.cat ? 'on' : ''}" data-act="exp-filter" data-cat="${t.cat}"><span class="e">${c.e}</span><span class="grow"><span class="nm"><span>${esc(c.name)}</span><b>${money(t.sum)}</b></span><span class="bar"><i style="width:${Math.max(3, t.sum / max * 100)}%"></i></span></span><span class="pc">${Math.round(t.sum / total * 100)}%</span></button>`;
  }).join('')}</div></div>`;
  const list = all.filter((x) => !ui.expFilter || x.cat === ui.expFilter);
  if (ui.expFilter) { const c = catOf(ui.expFilter); html += `<div><button class="chip on" data-act="exp-filter" data-cat="${ui.expFilter}">${c.e} ${esc(c.name)}: ${money(list.reduce((s, x) => s + x.amount, 0))}<span class="x">${I.close}</span></button></div>`; }
  return html + entryDays(list, 'edit-exp', (x) => catOf(x.cat), '−');
}
function entryDays(list, act, catFn, sign) {
  const byDay = {}; list.forEach((x) => { (byDay[x.date] = byDay[x.date] || []).push(x); });
  return Object.keys(byDay).sort().reverse().map((d) => {
    const items = byDay[d].sort((a, b) => (b.t || 0) - (a.t || 0)); const dt = toDate(d); const n = dayDiff(dt, new Date());
    const label = n === 0 ? 'Сегодня' : n === -1 ? 'Вчера' : cap(fmtD(dt, { weekday: 'short', day: 'numeric', month: 'long' }));
    return `<div class="section-label"><span>${label}</span><span>${money(items.reduce((s, x) => s + x.amount, 0))}</span></div>
      <div class="list">${items.map((x) => { const c = catFn(x); const sub = [x.note && esc(x.note), x.pay === 'cash' && 'наличные', x.rec && 'регулярный', x.ref && 'из «Авто»'].filter(Boolean).join(', '); return `<button class="row" data-act="${act}" data-id="${x.id}"><span class="cat-ic">${c.e}</span><span class="grow"><span class="t">${esc(c.name)}${x.example ? '<span class="tag-ex">пример</span>' : ''}</span>${sub ? `<span class="m">${sub}</span>` : ''}</span><span class="r amt ${sign === '+' ? 'pos' : ''}">${sign}${money(x.amount)}</span></button>`; }).join('')}</div>`;
  }).join('');
}
function frequentCats() {
  const s = isoOf(addDays(new Date(), -90)); const cnt = {};
  S.expenses.filter((x) => !x.example && x.date >= s).forEach((x) => { cnt[x.cat] = (cnt[x.cat] || 0) + 1; });
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).map((x) => x[0]).filter((id) => EXP_CAT[id] || S.customCats.some((c) => c.id === id));
  POPULAR.forEach((id) => { if (top.length < 8 && !top.includes(id)) top.push(id); });
  return top.slice(0, 8);
}
function catTile(c, sel) { return `<button type="button" class="cat-tile ${sel === c.id ? 'on' : ''}" data-cat="${c.id}"><span class="e">${c.e}</span><span class="nm">${esc(c.name)}</span></button>`; }
function catGridHTML(sel, kind) {
  if (kind === 'inc') return `<div class="cat-group"><div class="cat-grid">${INC_LIST.map(([id]) => catTile(INC_CAT[id], sel)).join('')}</div></div>`;
  let h = `<div class="cat-group"><div class="cat-gname">Частые</div><div class="cat-grid">${frequentCats().map((id) => catTile(catOf(id), sel)).join('')}</div></div>`;
  if (S.customCats.length) h += `<div class="cat-group"><div class="cat-gname">Мои</div><div class="cat-grid">${S.customCats.map((c) => catTile(catOf(c.id), sel)).join('')}</div></div>`;
  EXP_GROUPS.forEach(([g, list]) => { h += `<div class="cat-group"><div class="cat-gname">${g}</div><div class="cat-grid">${list.map(([id]) => catTile(EXP_CAT[id], sel)).join('')}${g === 'Другое' ? `<button type="button" class="cat-tile add" data-newcat="1"><span class="e">＋</span><span class="nm">Своя категория</span></button>` : ''}</div></div>`; });
  return h;
}
/* Общий лист суммы с выбором категории — для расходов и доходов */
function entrySheet(kind, id) {
  const arr = kind === 'inc' ? S.incomes : S.expenses; const ofFn = kind === 'inc' ? incOf : catOf;
  const x = id ? arr.find((e) => e.id === id) : null; if (id && !x) return;
  const d = x ? { ...x } : { amount: '', cat: null, date: todayISO(), note: '', pay: 'card' };
  let cat = d.cat, pay = d.pay || 'card';
  openSheet(kind === 'inc' ? (x ? 'Доход' : 'Новый доход') : (x ? 'Расход' : 'Новый расход'), `<form id="f" class="form">
    <label class="amount-in ${kind}"><input type="text" inputmode="decimal" id="eAmount" placeholder="0" value="${d.amount || ''}" autocomplete="off" aria-label="Сумма"><span>₽</span></label>
    <div class="sel-cat ${cat ? 'ok' : ''}" id="selCat">${cat ? `${ofFn(cat).e} ${esc(ofFn(cat).name)}` : (kind === 'inc' ? 'Выберите, откуда деньги' : 'Выберите, на что потратили')}</div>
    <div id="catPick">${catGridHTML(cat, kind)}</div>
    <div class="newcat" id="newCat" hidden><input type="text" id="ncName" placeholder="Название категории" maxlength="30">
      <div class="emoji-row" id="ncEmoji">${CUSTOM_EMOJI.map((e, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-e="${e}">${e}</button>`).join('')}</div>
      <div class="btn-row"><button type="button" class="btn sm" id="ncCancel">Отмена</button><button type="button" class="btn sm primary" id="ncAdd">Добавить</button></div></div>
    <div class="two"><label class="field"><span>Дата</span><input type="date" id="eDate" value="${d.date}"></label>
    ${kind === 'exp' ? `<div class="field"><span>Оплата</span><div class="seg" id="paySeg">${Object.entries(PAY).map(([k, v]) => `<button type="button" data-v="${k}" class="${pay === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>` : '<span></span>'}</div>
    <input type="text" id="eNote" value="${esc(d.note)}" placeholder="Комментарий, необязательно" maxlength="80">
    <div class="sticky-save"><button class="btn primary" type="submit" id="eSave">Сохранить</button></div>
    ${x ? `<button class="btn danger" type="button" id="eDel">${I.trash}Удалить ${kind === 'inc' ? 'доход' : 'расход'}</button>` : ''}
  </form>`, (body) => {
    const pick = $('#catPick', body), selEl = $('#selCat', body);
    const setCat = (c) => { cat = c; $$('.cat-tile[data-cat]', body).forEach((t) => t.classList.toggle('on', t.dataset.cat === c)); const o = ofFn(c); selEl.textContent = `${o.e} ${o.name}`; selEl.classList.add('ok'); };
    let ncE = CUSTOM_EMOJI[0];
    pick.addEventListener('click', (e) => {
      const t = e.target.closest('.cat-tile'); if (!t) return;
      if (t.dataset.newcat) { $('#newCat', body).hidden = false; $('#ncName', body).focus(); return; }
      setCat(t.dataset.cat);
    });
    $('#ncEmoji', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; ncE = b.dataset.e; $$('#ncEmoji button', body).forEach((q) => q.classList.toggle('on', q === b)); });
    $('#ncCancel', body).addEventListener('click', () => { $('#newCat', body).hidden = true; });
    $('#ncAdd', body).addEventListener('click', () => {
      const name = $('#ncName', body).value.trim(); if (!name) { toast('Напишите название категории'); return; }
      const c = { id: 'u' + uid(), name, e: ncE }; S.customCats.push(c); save();
      pick.innerHTML = catGridHTML(c.id, kind); setCat(c.id); $('#newCat', body).hidden = true; $('#ncName', body).value = ''; toast('Категория добавлена');
    });
    const ps = $('#paySeg', body); if (ps) ps.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; pay = b.dataset.v; $$('#paySeg button', body).forEach((q) => q.classList.toggle('on', q === b)); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const a = num($('#eAmount', body).value);
      if (!a || a <= 0) { toast('Введите сумму'); $('#eAmount', body).focus(); return; }
      if (!cat) { toast(kind === 'inc' ? 'Выберите, откуда деньги' : 'Выберите, на что потратили'); return; }
      const data = { amount: Math.round(a * 100) / 100, cat, date: $('#eDate', body).value || todayISO(), note: $('#eNote', body).value.trim() };
      if (kind === 'exp') data.pay = pay;
      if (x) Object.assign(x, data, { example: false }); else arr.push(Object.assign({ id: uid(), t: Date.now() }, data));
      save(); closeSheet(); render(); toast(`${ofFn(cat).e} ${kind === 'inc' ? '+' : ''}${money(data.amount)} записано`);
    });
    const del = $('#eDel', body);
    if (del) del.addEventListener('click', () => { const idx = arr.indexOf(x); closeSheet(); removeWithUndo(kind === 'inc' ? 'Доход удалён' : 'Расход удалён', () => arr.splice(idx, 1), () => arr.splice(idx, 0, x)); });
    if (!x) setTimeout(() => $('#eAmount', body).focus(), 320);
  });
}
function renderInc() {
  const m = curMonth(); const mk = monthKey(m); const isCur = mk === todayISO().slice(0, 7);
  const all = S.incomes.filter((x) => x.date.startsWith(mk)); const total = all.reduce((s, x) => s + x.amount, 0);
  let html = monthNav('month');
  html += `<div class="card"><h2>Получено</h2><div class="big-num">${money(total)}</div>${balanceLine(mk)}</div>`;
  if (!all.length) return html + `<div class="card empty"><b>${isCur ? 'В этом месяце поступлений нет' : 'Поступлений не было'}</b>${isCur ? 'Нажмите «+», введите сумму и выберите источник: зарплата, аванс, подработка.<button class="btn sm primary" data-act="new-inc">Добавить доход</button>' : ''}</div>`;
  const tots = catTotals(all);
  html += `<div class="card"><h2>Источники</h2><div class="cat-bars">${tots.map((t) => { const c = incOf(t.cat); return `<div class="cat-bar"><span class="e">${c.e}</span><span class="grow"><span class="nm"><span>${esc(c.name)}</span><b>${money(t.sum)}</b></span><span class="bar ok"><i style="width:${Math.max(3, t.sum / tots[0].sum * 100)}%"></i></span></span><span class="pc">${Math.round(t.sum / total * 100)}%</span></div>`; }).join('')}</div></div>`;
  return html + entryDays(all, 'edit-inc', (x) => incOf(x.cat), '+');
}
function budgetSheet() {
  const b = S.settings.budget;
  openSheet('Бюджет на месяц', `<form id="f" class="form">
    <label class="field"><span>Сколько готовы тратить в месяц, ₽</span><input type="number" inputmode="decimal" id="bAmount" value="${b || ''}" placeholder="Например, 60 000" min="1"></label>
    <p class="note-small" style="margin:0">Life покажет, сколько осталось, и подсветит, когда траты подходят к лимиту.</p>
    <button class="btn primary" type="submit">Сохранить</button>
    ${b ? '<button class="btn" type="button" id="bOff">Убрать бюджет</button>' : ''}</form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => { e.preventDefault(); const v = num($('#bAmount', body).value); if (!v || v <= 0) { toast('Введите сумму больше нуля'); return; } S.settings.budget = Math.round(v); save(); closeSheet(); render(); toast('Бюджет сохранён'); });
    const off = $('#bOff', body); if (off) off.addEventListener('click', () => { S.settings.budget = null; save(); closeSheet(); render(); toast('Бюджет убран'); });
    setTimeout(() => $('#bAmount', body).focus(), 320);
  });
}
/* Связь с «Авто»: работы и заправки попадают в расходы */
function syncLinkedExpense(ref, amount, cat, date, note) {
  const i = S.expenses.findIndex((x) => x.ref === ref);
  if (!amount) { if (i >= 0) S.expenses.splice(i, 1); return; }
  const data = { amount, cat, date, note, pay: 'card', ref };
  if (i >= 0) Object.assign(S.expenses[i], data); else S.expenses.push(Object.assign({ id: uid(), t: Date.now() }, data));
}

/* ---------- Регулярные платежи ---------- */
const WD_PO = ['по воскресеньям', 'по понедельникам', 'по вторникам', 'по средам', 'по четвергам', 'по пятницам', 'по субботам'];
function stepDate(d, freq, k) { return freq === 'week' ? addDays(d, 7 * k) : freq === 'year' ? addMonths(d, 12 * k) : addMonths(d, k); }
function dueDates(r, fromIso, toIso) {
  const out = []; const start = toDate(r.start); if (!start) return out;
  for (let k = 0; k < 3000; k++) { const d = stepDate(start, r.freq, k); const iso = isoOf(d); if (iso > toIso) break; if (!fromIso || iso > fromIso) out.push(iso); }
  return out;
}
function nextDue(r) {
  const start = toDate(r.start); if (!start) return null;
  for (let k = 0; k < 3000; k++) { const d = stepDate(start, r.freq, k); if (!r.last || isoOf(d) > r.last) return d; }
  return null;
}
function freqText(r) {
  const s = toDate(r.start); if (!s) return '';
  return r.freq === 'week' ? WD_PO[s.getDay()] : r.freq === 'year' ? `каждый год ${s.getDate()} ${MONTH_GEN[s.getMonth()]}` : `каждое ${s.getDate()}-е число`;
}
function recMonthly(r) { return r.freq === 'week' ? r.amount * 52 / 12 : r.freq === 'year' ? r.amount / 12 : r.amount; }
function runRecurring(silent) {
  const today = todayISO(); let added = 0, sum = 0;
  S.recurring.forEach((r) => {
    if (!r.auto) return;
    dueDates(r, r.last, today).forEach((iso) => {
      const arr = r.kind === 'inc' ? S.incomes : S.expenses;
      arr.push({ id: uid(), t: Date.now(), amount: r.amount, cat: r.cat, date: iso, note: r.name, pay: r.pay || 'card', rec: r.id, example: r.example || undefined });
      r.last = iso; added++; sum += r.kind === 'inc' ? 0 : r.amount;
    });
  });
  if (added) { save(); if (!silent) toast(`Добавлено автоматически: ${added} ${plural(added, 'платёж', 'платежа', 'платежей')}`); }
  return added;
}
function recRow(r, d) {
  d = d || nextDue(r); const c = r.kind === 'inc' ? incOf(r.cat) : catOf(r.cat); const n = d ? dayDiff(d, new Date()) : null;
  const pending = !r.auto && d && n <= 0;
  const when = !d ? '' : n < 0 ? `ждёт с ${fmtShort(d)}` : n === 0 ? 'сегодня' : n === 1 ? 'завтра' : `${fmtShort(d)}, через ${n} ${plural(n, 'день', 'дня', 'дней')}`;
  return `<div class="row" data-act="edit-recur" data-id="${r.id}" role="button" tabindex="0"><span class="cat-ic">${c.e}</span><span class="grow"><span class="t">${esc(r.name)}${r.example ? '<span class="tag-ex">пример</span>' : ''}</span><span class="m">${freqText(r)}${when ? ', ' + when : ''}${r.auto ? '' : ', вручную'}</span></span>
    ${pending ? `<button class="btn sm primary" data-act="recur-paid" data-id="${r.id}">${r.kind === 'inc' ? 'Получено' : 'Оплачено'}</button>` : `<span class="r amt ${r.kind === 'inc' ? 'pos' : ''}">${r.kind === 'inc' ? '+' : '−'}${money(r.amount)}</span>`}</div>`;
}
function renderRec() {
  const list = S.recurring.map((r) => ({ r, d: nextDue(r) })).sort((a, b) => (a.d || 0) - (b.d || 0));
  const expM = S.recurring.filter((r) => r.kind !== 'inc').reduce((s, r) => s + recMonthly(r), 0);
  const incM = S.recurring.filter((r) => r.kind === 'inc').reduce((s, r) => s + recMonthly(r), 0);
  let html = `<div class="card"><h2>В среднем за месяц</h2><div class="money-row"><div><div class="lbl">Обязательные траты</div><div class="big-num">${money(expM)}</div></div>${incM ? `<div><div class="lbl">Поступления</div><div class="big-num muted">${money(incM)}</div></div>` : ''}</div>
    <p class="note-small" style="margin:8px 0 0;padding:0">С отметкой «авто» Life сам записывает платёж в расходы или доходы в день оплаты.</p></div>`;
  if (!list.length) return html + `<div class="card empty"><b>Регулярных платежей нет</b>Добавьте квартплату, связь, интернет, подписки, зарплату. Life будет записывать их сам.<button class="btn sm primary" data-act="new-recur">Добавить платёж</button></div>`;
  const exp = list.filter((x) => x.r.kind !== 'inc'), inc = list.filter((x) => x.r.kind === 'inc');
  if (exp.length) html += `<div class="section-label"><span>Платежи</span></div><div class="list">${exp.map(({ r, d }) => recRow(r, d)).join('')}</div>`;
  if (inc.length) html += `<div class="section-label"><span>Поступления</span></div><div class="list">${inc.map(({ r, d }) => recRow(r, d)).join('')}</div>`;
  return html;
}
function recurSheet(id) {
  const r = id ? S.recurring.find((x) => x.id === id) : null; if (id && !r) return;
  const d = r ? { ...r } : { kind: 'exp', name: '', amount: '', cat: null, freq: 'month', start: todayISO(), auto: true, pay: 'card' };
  let kind = d.kind, cat = d.cat, freq = d.freq, pay = d.pay || 'card';
  const ofFn = () => kind === 'inc' ? incOf : catOf;
  openSheet(r ? 'Регулярный платёж' : 'Новый регулярный платёж', `<form id="f" class="form">
    <div class="seg" id="rkSeg"><button type="button" data-v="exp" class="${kind === 'exp' ? 'on' : ''}">Платёж</button><button type="button" data-v="inc" class="${kind === 'inc' ? 'on' : ''}">Поступление</button></div>
    <label class="amount-in"><input type="text" inputmode="decimal" id="rAmount" placeholder="0" value="${d.amount || ''}" autocomplete="off" aria-label="Сумма"><span>₽</span></label>
    <input type="text" id="rName" placeholder="Название: квартплата, интернет, зарплата" value="${esc(d.name)}" maxlength="60">
    <div class="sel-cat ${cat ? 'ok' : ''}" id="selCat">${cat ? `${ofFn()(cat).e} ${esc(ofFn()(cat).name)}` : 'Выберите категорию'}</div>
    <div id="catPick" class="cat-compact">${catGridHTML(cat, kind)}</div>
    <div class="field"><span>Как часто</span><div class="seg" id="fqSeg">${[['month', 'Каждый месяц'], ['week', 'Каждую неделю'], ['year', 'Каждый год']].map(([k, v]) => `<button type="button" data-v="${k}" class="${freq === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <label class="field"><span>Дата ближайшего платежа</span><input type="date" id="rStart" value="${d.start}"></label>
    <div class="switch-row"><span>Записывать автоматически</span><label class="switch"><input type="checkbox" id="rAuto" ${d.auto ? 'checked' : ''}><i></i></label></div>
    <div class="field" id="payF" ${kind === 'inc' ? 'hidden' : ''}><span>Оплата</span><div class="seg" id="paySeg">${Object.entries(PAY).map(([k, v]) => `<button type="button" data-v="${k}" class="${pay === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${r ? `<button class="btn danger" type="button" id="rDel">${I.trash}Удалить регулярный платёж</button><p class="note-small" style="margin:0">Уже записанные платежи останутся в расходах и доходах.</p>` : ''}
  </form>`, (body) => {
    const pick = $('#catPick', body), selEl = $('#selCat', body);
    const setCat = (c) => { cat = c; $$('.cat-tile[data-cat]', body).forEach((t) => t.classList.toggle('on', t.dataset.cat === c)); const o = ofFn()(c); selEl.textContent = `${o.e} ${o.name}`; selEl.classList.add('ok'); };
    pick.addEventListener('click', (e) => { const t = e.target.closest('.cat-tile'); if (!t || t.dataset.newcat) return; setCat(t.dataset.cat); const nm = $('#rName', body); if (!nm.value.trim()) nm.value = ofFn()(t.dataset.cat).name; });
    $('#rkSeg', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; kind = b.dataset.v; cat = null; $$('#rkSeg button', body).forEach((q) => q.classList.toggle('on', q === b)); pick.innerHTML = catGridHTML(null, kind); selEl.textContent = 'Выберите категорию'; selEl.classList.remove('ok'); $('#payF', body).hidden = kind === 'inc'; });
    $('#fqSeg', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; freq = b.dataset.v; $$('#fqSeg button', body).forEach((q) => q.classList.toggle('on', q === b)); });
    $('#paySeg', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; pay = b.dataset.v; $$('#paySeg button', body).forEach((q) => q.classList.toggle('on', q === b)); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const a = num($('#rAmount', body).value); if (!a || a <= 0) { toast('Введите сумму'); return; }
      if (!cat) { toast('Выберите категорию'); return; }
      const start = $('#rStart', body).value || todayISO();
      const name = $('#rName', body).value.trim() || ofFn()(cat).name;
      const data = { kind, name, amount: Math.round(a * 100) / 100, cat, freq, start, auto: $('#rAuto', body).checked, pay };
      if (r) {
        const scheduleChanged = r.start !== start || r.freq !== freq;
        Object.assign(r, data, { example: false });
        if (scheduleChanged) r.last = start <= todayISO() ? isoOf(addDays(new Date(), -1)) : null;
      } else S.recurring.push(Object.assign({ id: uid(), last: start < todayISO() ? isoOf(addDays(new Date(), -1)) : null }, data));
      save(); runRecurring(); closeSheet(); render(); toast('Регулярный платёж сохранён');
    });
    const del = $('#rDel', body);
    if (del) del.addEventListener('click', () => { const idx = S.recurring.indexOf(r); closeSheet(); removeWithUndo('Регулярный платёж удалён', () => S.recurring.splice(idx, 1), () => S.recurring.splice(idx, 0, r)); });
  });
}

/* ---------- Копилка ---------- */
const goalSaved = (g) => g.ops.reduce((s, o) => s + (o.amount || 0), 0);
function goalHint(g) {
  const saved = goalSaved(g); const left = (g.target || 0) - saved;
  if (g.target && left <= 0) return 'Цель достигнута';
  if (!g.deadline) return g.target ? `Осталось ${money(left)}` : '';
  const dl = toDate(g.deadline); const days = dayDiff(dl, new Date());
  if (days < 0) return `Срок прошёл, осталось ${money(left)}`;
  const months = Math.max(1, Math.ceil(days / 30.4));
  return `По ${money(Math.ceil(left / months))} в месяц до ${fmtD(dl, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
function renderGoals() {
  const total = S.goals.reduce((s, g) => s + goalSaved(g), 0); const mk = todayISO().slice(0, 7);
  const inMonth = S.goals.reduce((s, g) => s + g.ops.filter((o) => o.date.startsWith(mk)).reduce((a, o) => a + o.amount, 0), 0);
  let html = `<div class="card"><h2>Всего отложено</h2><div class="big-num">${money(total)}</div>
    <div class="svc-meta" style="margin-top:6px"><span>${S.goals.length} ${plural(S.goals.length, 'цель', 'цели', 'целей')}</span><span>за этот месяц ${inMonth >= 0 ? '+' : '−'}${money(Math.abs(inMonth))}</span></div></div>`;
  if (!S.goals.length) html += `<div class="card empty"><b>Целей пока нет</b>Создайте цель: на что копите и сколько нужно.<button class="btn sm primary" data-act="goal-new">Создать цель</button></div>`;
  S.goals.forEach((g) => {
    const saved = goalSaved(g); const p = g.target ? Math.min(100, Math.round(saved / g.target * 100)) : 0;
    html += `<div class="card goal"><button class="goal-top" data-act="goal-open" data-id="${g.id}">
      <span class="ring" style="--p:${p};--c:${g.color}"><span>${p}%</span></span>
      <span class="grow"><span class="t">${esc(g.name)}${g.example ? '<span class="tag-ex">пример</span>' : ''}</span>
      <span class="m">${money(saved)} из ${money(g.target)}</span><span class="m">${goalHint(g)}</span></span></button>
      <div class="btn-row"><button class="btn sm primary" data-act="op" data-id="${g.id}" data-kind="in">${I.plus}Пополнить</button><button class="btn sm" data-act="op" data-id="${g.id}" data-kind="out">${I.minus}Снять</button></div></div>`;
  });
  return html;
}
function goalSheet(id) {
  const g = id ? S.goals.find((x) => x.id === id) : null; if (id && !g) return;
  const d = g ? { ...g } : { name: '', target: '', deadline: '', color: accentHex() }; let color = d.color;
  const ops = g ? [...g.ops].sort((a, b) => b.date.localeCompare(a.date)) : [];
  openSheet(g ? g.name : 'Новая цель', `<form id="f" class="form">
    ${g ? `<div class="field"><span>Операции</span>${ops.length ? `<div class="ops" id="opsList">${ops.map((o) => `<div class="row"><span class="grow"><span class="${o.amount >= 0 ? 'amount-plus' : 'amount-minus'}">${o.amount >= 0 ? '+' : '−'}${money(Math.abs(o.amount))}</span><span class="m">${fmtDY(toDate(o.date))}${o.note ? ', ' + esc(o.note) : ''}</span></span><button type="button" class="act" data-op-del="${o.id}" aria-label="Удалить операцию">${I.trash}</button></div>`).join('')}</div>` : '<p class="note-small" style="margin:0">Операций пока нет.</p>'}</div>` : ''}
    <label class="field"><span>Название</span><input type="text" id="gName" value="${esc(d.name)}" placeholder="На что копим" maxlength="60"></label>
    <div class="two"><label class="field"><span>Нужно, ₽</span><input type="number" inputmode="decimal" id="gTarget" value="${d.target}" min="1"></label>
    <label class="field"><span>К дате</span><input type="date" id="gDeadline" value="${d.deadline || ''}"></label></div>
    <div class="field"><span>Цвет</span><div class="swatches" id="gColors">${GOAL_COLORS.map((x) => `<button type="button" class="swatch ${x === color ? 'on' : ''}" data-c="${x}" style="background:${x}" aria-label="Цвет"></button>`).join('')}</div></div>
    <div class="sticky-save"><button class="btn primary" type="submit">${g ? 'Сохранить' : 'Создать цель'}</button></div>
    ${g ? `<button class="btn danger" type="button" id="gDel">${I.trash}Удалить цель</button>` : ''}
  </form>`, (body) => {
    $('#gColors', body).addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (!b) return; color = b.dataset.c; $$('#gColors .swatch', body).forEach((x) => x.classList.toggle('on', x === b)); });
    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-op-del]'); if (!b || !g) return;
      const op = g.ops.find((o) => o.id === b.dataset.opDel); const idx = g.ops.indexOf(op);
      g.ops.splice(idx, 1); b.closest('.row').remove(); save(); render();
      toast('Операция удалена', () => { g.ops.splice(idx, 0, op); save(); render(); goalSheet(g.id); });
    });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#gName', body).value.trim(); const target = num($('#gTarget', body).value);
      if (!name || !target || target <= 0) { toast('Укажите название и сумму цели'); return; }
      const data = { name, target, deadline: $('#gDeadline', body).value || null, color };
      if (g) Object.assign(g, data, { example: false }); else S.goals.push(Object.assign({ id: uid(), ops: [] }, data));
      save(); closeSheet(); render(); toast(g ? 'Цель сохранена' : 'Цель создана');
    });
    const del = $('#gDel', body);
    if (del) del.addEventListener('click', () => { const idx = S.goals.indexOf(g); closeSheet(); removeWithUndo('Цель удалена', () => S.goals.splice(idx, 1), () => S.goals.splice(idx, 0, g)); });
  });
}
function opSheet(id, kind) {
  if (!S.goals.length) { goalSheet(); return; }
  let g = S.goals.find((x) => x.id === id) || S.goals[0];
  openSheet(kind === 'in' ? 'Пополнить' : 'Снять', `<form id="f" class="form">
    ${!id && S.goals.length > 1 ? `<label class="field"><span>Цель</span><select id="oGoal">${S.goals.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></label>` : `<div style="font-weight:600">${esc(g.name)}: ${money(goalSaved(g))} из ${money(g.target)}</div>`}
    <label class="amount-in"><input type="text" inputmode="decimal" id="oAmount" placeholder="0" autocomplete="off" aria-label="Сумма"><span>₽</span></label>
    <label class="field"><span>Дата</span><input type="date" id="oDate" value="${todayISO()}"></label>
    <input type="text" id="oNote" placeholder="Комментарий, необязательно" maxlength="80">
    <button class="btn primary" type="submit">${kind === 'in' ? 'Пополнить' : 'Снять'}</button></form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); const sel = $('#oGoal', body); if (sel) g = S.goals.find((x) => x.id === sel.value) || g;
      const a = num($('#oAmount', body).value); if (!a || a <= 0) { toast('Введите сумму больше нуля'); return; }
      g.ops.push({ id: uid(), amount: kind === 'in' ? a : -a, date: $('#oDate', body).value || todayISO(), note: $('#oNote', body).value.trim() });
      save(); closeSheet(); render(); toast(kind === 'in' ? `Пополнено на ${money(a)}` : `Снято ${money(a)}`);
    });
    setTimeout(() => $('#oAmount', body).focus(), 320);
  });
}
ACT.money = (el) => { ui.money = el.dataset.sec; if (ui.tab !== 'bank' || ui.stack.length) go('bank'); else render(); };
ACT['new-exp'] = () => entrySheet('exp');
ACT['edit-exp'] = (el) => entrySheet('exp', el.dataset.id);
ACT['new-inc'] = () => entrySheet('inc');
ACT['edit-inc'] = (el) => entrySheet('inc', el.dataset.id);
ACT.budget = () => budgetSheet();
ACT.month = (el) => { const m = curMonth(); const n = new Date(m.getFullYear(), m.getMonth() + (+el.dataset.dir), 1); if (monthKey(n) <= todayISO().slice(0, 7)) { ui.month = n; ui.expFilter = null; render('anim-fade'); } };
ACT['exp-filter'] = (el) => { ui.expFilter = ui.expFilter === el.dataset.cat ? null : el.dataset.cat; render(); };
ACT['all-cats'] = () => { ui.allCats = !ui.allCats; render(); };
ACT['new-recur'] = () => recurSheet();
ACT['edit-recur'] = (el) => recurSheet(el.dataset.id);
ACT['recur-paid'] = (el) => {
  const r = S.recurring.find((x) => x.id === el.dataset.id); if (!r) return; const d = nextDue(r); if (!d) return;
  const iso = isoOf(d); (r.kind === 'inc' ? S.incomes : S.expenses).push({ id: uid(), t: Date.now(), amount: r.amount, cat: r.cat, date: iso, note: r.name, pay: r.pay || 'card', rec: r.id });
  r.last = iso; save(); render(); toast(`${r.name}: ${money(r.amount)} записано`);
};
ACT['goal-new'] = () => goalSheet();
ACT['goal-open'] = (el) => goalSheet(el.dataset.id);
ACT.op = (el) => opSheet(el.dataset.id, el.dataset.kind);
ACT['quick-deposit'] = () => opSheet(null, 'in');

/* ================= Авто ================= */
function carSVG(color) {
  const c = color || '#C9CDD3';
  return `<svg class="car-svg" viewBox="0 0 320 150" role="img" aria-label="Машина">
    <ellipse cx="160" cy="132" rx="140" ry="7" fill="var(--ink)" opacity=".08"/>
    <path d="M18 112V92c0-11 6-17 16-19l40-8 34-34c6-6 12-8 21-8h121c11 0 18 5 23 13l20 36c5 8 7 14 7 22v18c0 5-3 8-8 8H26c-5 0-8-3-8-8z" fill="${c}" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/>
    <path d="M84 66l32-32c4-4 8-6 14-6h30v38z" fill="#2B3240" opacity=".86"/><path d="M168 28h50v38h-50z" fill="#2B3240" opacity=".86"/>
    <path d="M226 28h22c7 0 12 3 15 9l15 29h-52z" fill="#2B3240" opacity=".86"/><path d="M86 64l30-30c4-4 8-5 13-5h6L96 64z" fill="#fff" opacity=".18"/>
    <path d="M164 70v44M222 70v44" stroke="rgba(0,0,0,.2)" stroke-width="1.4"/>
    <rect x="146" y="78" width="12" height="3.5" rx="1.7" fill="rgba(0,0,0,.28)"/><rect x="204" y="78" width="12" height="3.5" rx="1.7" fill="rgba(0,0,0,.28)"/>
    <path d="M22 84c3-6 8-9 16-10l-2 10z" fill="#FFF6D6"/><path d="M300 52l6 12v16l-6-2z" fill="#D63A3A"/>
    <path d="M18 104h288" stroke="rgba(0,0,0,.14)" stroke-width="5"/>
    <circle cx="80" cy="114" r="26" fill="var(--surface)"/><circle cx="252" cy="114" r="26" fill="var(--surface)"/>
    <circle cx="80" cy="114" r="21" fill="#1B1E24"/><circle cx="252" cy="114" r="21" fill="#1B1E24"/>
    <circle cx="80" cy="114" r="11" fill="#9AA1AC"/><circle cx="252" cy="114" r="11" fill="#9AA1AC"/>
    <circle cx="80" cy="114" r="3.5" fill="#5D636E"/><circle cx="252" cy="114" r="3.5" fill="#5D636E"/></svg>`;
}
function svcStatus(s) {
  const c = S.car;
  if (s.lastKm == null && !s.lastDate) return { cls: 'none', label: 'Нет отметки', short: 'нет отметки', frac: 0, rank: 0 };
  let frac = 0; const parts = []; let due = false, soon = false;
  if (s.km && s.lastKm != null && c.mileage != null) {
    const left = s.lastKm + s.km - c.mileage; frac = Math.max(frac, (c.mileage - s.lastKm) / s.km);
    parts.push(left >= 0 ? `осталось ${kmf(left)}` : `просрочено на ${kmf(-left)}`);
    if (left <= 0) due = true; else if (left <= s.km * 0.15) soon = true;
  } else if (s.km && s.lastKm != null) parts.push(`в ${kmf(s.lastKm + s.km)}`);
  if (s.months && s.lastDate) {
    const dueD = addMonths(toDate(s.lastDate), s.months); const days = dayDiff(dueD, new Date());
    frac = Math.max(frac, 1 - days / (s.months * 30.4));
    parts.push(days >= 0 ? `до ${fmtD(dueD, { day: 'numeric', month: 'short', year: 'numeric' })}` : `срок прошёл ${fmtD(dueD, { day: 'numeric', month: 'short', year: 'numeric' })}`);
    if (days <= 0) due = true; else if (days <= 30) soon = true;
  }
  if (due) return { cls: 'bad', label: 'Пора менять', short: 'пора менять', frac: 1, parts, rank: 3 };
  if (soon) return { cls: 'warn', label: 'Скоро', short: 'скоро', frac: Math.min(frac, 1), parts, rank: 2 };
  return { cls: 'ok', label: 'В норме', short: 'в норме', frac: Math.min(Math.max(frac, 0), 1), parts, rank: 1 };
}
function nextService() {
  const list = S.services.map((s) => ({ s, st: svcStatus(s) })).filter((x) => x.st.cls !== 'none').sort((a, b) => b.st.rank - a.st.rank || b.st.frac - a.st.frac);
  return list[0] || null;
}
function intervalText(s) {
  const a = []; if (s.km) a.push(kmf(s.km)); if (s.months) a.push(`${s.months} ${plural(s.months, 'месяц', 'месяца', 'месяцев')}`);
  return a.length ? 'каждые ' + a.join(' или ') : 'интервал не задан';
}
/* Заправки и расход */
function fuelStats() {
  const list = S.fuel.filter((f) => f.km != null).sort((a, b) => a.km - b.km || a.date.localeCompare(b.date));
  const cons = {}; let lastFull = -1;
  list.forEach((f, i) => {
    if (!f.full) return;
    if (lastFull >= 0) { const dist = f.km - list[lastFull].km; const liters = list.slice(lastFull + 1, i + 1).reduce((s, x) => s + (x.liters || 0), 0); if (dist > 0 && liters > 0) cons[f.id] = { l100: liters / dist * 100, dist, liters }; }
    lastFull = i;
  });
  const vals = Object.values(cons); const recent = list.filter((f) => cons[f.id]).slice(-5).map((f) => cons[f.id]);
  const avg = recent.length ? recent.reduce((s, x) => s + x.liters, 0) / recent.reduce((s, x) => s + x.dist, 0) * 100 : null;
  const mk = todayISO().slice(0, 7); const month = S.fuel.filter((f) => f.date.startsWith(mk)).reduce((s, f) => s + (f.total || 0), 0);
  const priced = [...S.fuel].sort((a, b) => b.date.localeCompare(a.date)).find((f) => f.price);
  const rubKm = avg && priced ? avg / 100 * priced.price : null;
  return { cons, avg, month, lastPrice: priced ? priced.price : null, rubKm, all: vals };
}
RENDER.car = function () {
  const c = S.car;
  const secs = [['service', 'Регламент'], feat('fuel') && ['fuel', 'Заправки'], ['log', 'История'], ['todo', 'План']].filter(Boolean);
  if (!secs.some((s) => s[0] === ui.carSec)) ui.carSec = 'service';
  let html = head('Авто', '', plusBtn('car-add', 'Добавить'));
  html += `<div class="card car-hero"><button class="icon-btn edit" data-act="car-edit" aria-label="Изменить данные машины">${I.edit}</button>
    <div class="name">${esc(c.name) || 'Ваша машина'}</div><div class="meta">${c.name ? [c.body && 'кузов ' + esc(c.body), c.year && esc(c.year) + ' год', esc(c.engine)].filter(Boolean).join(', ') : '<button class="btn sm" data-act="car-edit" style="margin-top:6px">Указать марку, год и цвет</button>'}</div>
    ${carSVG(c.color)}
    <div class="odo"><div><div class="lbl">Пробег${c.mileageDate ? ' на ' + fmtD(toDate(c.mileageDate)) : ''}</div><div class="big-num">${c.mileage != null ? nf.format(c.mileage) + '<small> км</small>' : '—'}</div></div>
    <button class="btn sm primary" data-act="mileage">${I.odo}Обновить</button></div></div>`;
  html += `<div class="seg">${secs.map(([k, v]) => `<button data-act="car-sec" data-sec="${k}" class="${ui.carSec === k ? 'on' : ''}">${v}</button>`).join('')}</div>`;
  if (ui.carSec === 'service') {
    const items = S.services.map((s) => ({ s, st: svcStatus(s) })).sort((a, b) => b.st.rank - a.st.rank || b.st.frac - a.st.frac);
    if (c.mileage == null) html += `<div class="banner"><div class="grow"><b>Укажите пробег</b>Без пробега Life не посчитает, сколько осталось до замены.</div><button class="btn sm primary" data-act="mileage">Указать</button></div>`;
    html += items.length ? `<div class="list">${items.map(({ s, st }) => `<button class="row" style="display:block" data-act="svc" data-id="${s.id}"><div class="svc">
      <div class="svc-top"><span class="t">${esc(s.name)}</span><span class="pill ${st.cls}">${st.label}</span></div>
      ${st.cls !== 'none' ? `<div class="bar ${st.cls}"><i style="width:${Math.round(st.frac * 100)}%"></i></div>` : ''}
      <div class="svc-meta"><span>${intervalText(s)}</span><span>${st.parts && st.parts.length ? st.parts.join(', ') : 'нажмите, чтобы отметить замену'}</span></div></div></button>`).join('')}</div>`
      : `<div class="card empty"><b>Регламент пуст</b>Нажмите «+», чтобы добавить пункт.</div>`;
    html += `<p class="note-small">Интервалы заполнены как типовой ориентир. Поменяйте их под свою машину: нажмите на пункт. Лишнее можно удалить, своё добавить через «+».</p>`;
  } else if (ui.carSec === 'fuel') {
    const fs = fuelStats(); const list = [...S.fuel].sort((a, b) => b.date.localeCompare(a.date) || (b.km || 0) - (a.km || 0));
    const chart = list.filter((f) => fs.cons[f.id]).slice(0, 8).reverse();
    const mx = Math.max(...chart.map((f) => fs.cons[f.id].l100), 1);
    html += `<div class="card"><h2>Расход топлива</h2><div class="money-row"><div><div class="lbl">Средний</div><div class="big-num">${fs.avg ? nf1.format(fs.avg) + '<small> л/100 км</small>' : '—'}</div></div>
      <div><div class="lbl">За ${MONTH_NOM[new Date().getMonth()]}</div><div class="big-num muted">${money(fs.month)}</div></div></div>
      <div class="svc-meta" style="margin-top:8px"><span>${fs.lastPrice ? 'Последняя цена ' + nf2.format(fs.lastPrice) + NB + '₽/л' : ''}</span><span>${fs.rubKm ? '≈' + nf1.format(fs.rubKm) + NB + '₽ на 1 км' : ''}</span></div>
      ${chart.length > 1 ? `<div class="fuel-chart" aria-label="Расход по заправкам">${chart.map((f) => { const v = fs.cons[f.id].l100; return `<div class="fc"><span class="v">${nf1.format(v)}</span><span class="b" style="height:${Math.round(v / mx * 100)}%"></span><span class="d">${fmtD(toDate(f.date), { day: 'numeric', month: 'numeric' })}</span></div>`; }).join('')}</div>` : ''}
      ${!fs.avg ? '<p class="note-small" style="margin:8px 0 0;padding:0">Расход считается между двумя заправками до полного бака. Указывайте пробег при каждой заправке.</p>' : ''}</div>`;
    html += list.length ? `<div class="list">${list.map((f) => { const cn = fs.cons[f.id]; return `<button class="row" data-act="fuel-edit" data-id="${f.id}"><span class="cat-ic">⛽</span><span class="grow"><span class="t">${nf2.format(f.liters || 0)} л${f.price ? ' по ' + nf2.format(f.price) + NB + '₽' : ''}${f.example ? '<span class="tag-ex">пример</span>' : ''}</span><span class="m">${fmtD(toDate(f.date))}${f.km != null ? ', ' + kmf(f.km) : ''}${f.station ? ', ' + esc(f.station) : ''}${!f.full ? ', не полный бак' : ''}${cn ? `, <b>${nf1.format(cn.l100)} л/100</b>` : ''}</span></span><span class="r amt">${money(f.total)}</span></button>`; }).join('')}</div>`
      : `<div class="card empty"><b>Заправок пока нет</b>Записывайте литры, цену и пробег. Life посчитает расход и сколько стоит километр.<button class="btn sm primary" data-act="new-fuel">Добавить заправку</button></div>`;
  } else if (ui.carSec === 'log') {
    const list = [...S.carLog].sort((a, b) => b.date.localeCompare(a.date) || (b.km || 0) - (a.km || 0));
    const year = new Date().getFullYear(); const spent = S.carLog.filter((l) => l.date.startsWith(String(year))).reduce((s, l) => s + (l.cost || 0), 0);
    if (list.length) html += `<div class="card"><h2>На обслуживание в ${year} году</h2><div class="big-num">${money(spent)}</div></div>`;
    html += list.length ? `<div class="list">${list.map((l) => `<button class="row" data-act="log-edit" data-id="${l.id}"><span class="grow"><span class="t">${esc(l.what)}</span><span class="m">${fmtDY(toDate(l.date))}${l.km != null ? ', ' + kmf(l.km) : ''}${l.note ? ', ' + esc(l.note) : ''}</span></span>${l.cost ? `<span class="r">${money(l.cost)}</span>` : ''}</button>`).join('')}</div>`
      : `<div class="card empty"><b>История пуста</b>Записывайте, что и когда делали с машиной. Отметка в регламенте тоже попадает сюда.<button class="btn sm primary" data-act="car-add">Добавить запись</button></div>`;
  } else {
    const list = [...S.carTodo].sort((a, b) => a.done - b.done);
    html += `<form class="todo-add" id="todoForm"><input type="text" id="todoText" placeholder="Что нужно сделать с машиной" maxlength="140" autocomplete="off"><button class="btn primary" type="submit" aria-label="Добавить">${I.plus}</button></form>`;
    html += list.length ? `<div class="list">${list.map((t) => `<div class="row ${t.done ? 'done' : ''}"><button class="check ${t.done ? 'on' : ''}" data-act="todo-toggle" data-id="${t.id}" aria-label="Отметить">${t.done ? I.tick : ''}</button><span class="grow"><span class="t">${esc(t.text)}</span></span><button class="act" data-act="todo-del" data-id="${t.id}" aria-label="Удалить">${I.trash}</button></div>`).join('')}</div>`
      : `<div class="card empty"><b>Планов нет</b>Запишите, что осталось сделать: поменять лампочку, купить резину.</div>`;
  }
  return html;
};
function setMileage(km, date) { if (km != null && (S.car.mileage == null || km > S.car.mileage)) { S.car.mileage = Math.round(km); S.car.mileageDate = date || todayISO(); } }
function mileageSheet() {
  const c = S.car;
  openSheet('Пробег', `<form id="f" class="form">
    <label class="amount-in"><input type="text" inputmode="numeric" id="mKm" value="${c.mileage ?? ''}" placeholder="186 400" autocomplete="off" aria-label="Пробег"><span>км</span></label>
    ${c.mileage != null ? `<p class="note-small" style="margin:0;text-align:center">Сейчас записано ${kmf(c.mileage)}${c.mileageDate ? ' на ' + fmtDY(toDate(c.mileageDate)) : ''}.</p>` : ''}
    <button class="btn primary" type="submit">Сохранить</button></form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); const v = num($('#mKm', body).value);
      if (v == null || v < 0) { toast('Введите пробег числом'); return; }
      const less = c.mileage != null && v < c.mileage;
      c.mileage = Math.round(v); c.mileageDate = todayISO(); save(); closeSheet(); render();
      toast(less ? 'Пробег меньше прежнего. Сохранил, проверьте цифры.' : 'Пробег сохранён');
    });
    setTimeout(() => $('#mKm', body).select(), 320);
  });
}
function carEditSheet() {
  const c = S.car; let color = c.color;
  openSheet('Машина', `<form id="f" class="form">
    <div class="card" style="padding:10px" id="carPrev">${carSVG(color)}</div>
    <div class="field"><span>Цвет</span><div class="swatches" id="carColors">${CAR_COLORS.map((x) => `<button type="button" class="swatch ${x === color ? 'on' : ''}" data-c="${x}" style="background:${x}" aria-label="Цвет ${x}"></button>`).join('')}</div></div>
    <label class="field"><span>Название</span><input type="text" id="cName" value="${esc(c.name)}" maxlength="60"></label>
    <div class="two"><label class="field"><span>Кузов</span><input type="text" id="cBody" value="${esc(c.body)}" maxlength="20"></label>
    <label class="field"><span>Год</span><input type="number" inputmode="numeric" id="cYear" value="${esc(c.year)}" min="1950" max="2100"></label></div>
    <label class="field"><span>Двигатель и коробка</span><input type="text" id="cEngine" value="${esc(c.engine)}" maxlength="60"></label>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div></form>`, (body) => {
    $('#carColors', body).addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (!b) return; color = b.dataset.c; $$('#carColors .swatch', body).forEach((x) => x.classList.toggle('on', x === b)); $('#carPrev', body).innerHTML = carSVG(color); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      Object.assign(c, { name: $('#cName', body).value.trim() || 'Моя машина', body: $('#cBody', body).value.trim(), year: num($('#cYear', body).value) || '', engine: $('#cEngine', body).value.trim(), color });
      save(); closeSheet(); render(); toast('Данные машины сохранены');
    });
  });
}
function svcSheet(id) {
  const isNew = !id; const s = id ? S.services.find((x) => x.id === id) : { name: '', km: 10000, months: 12, lastKm: null, lastDate: null };
  if (!s) return; const c = S.car;
  openSheet(isNew ? 'Новый пункт' : s.name, `<form id="f" class="form">
    ${!isNew ? `<div class="card" style="display:grid;gap:10px"><div style="font-weight:600">Отметить замену</div>
      <div class="two"><label class="field"><span>Дата</span><input type="date" id="dDate" value="${todayISO()}"></label>
      <label class="field"><span>Пробег, км</span><input type="number" inputmode="numeric" id="dKm" value="${c.mileage ?? ''}" placeholder="км"></label></div>
      <label class="field"><span>Стоимость, ₽</span><input type="number" inputmode="decimal" id="dCost" placeholder="Необязательно"></label>
      <button type="button" class="btn primary" id="doneBtn">${I.tick}Сделано</button></div>` : ''}
    <label class="field"><span>Название</span><input type="text" id="sName" value="${esc(s.name)}" maxlength="80"></label>
    <div class="two"><label class="field"><span>Интервал, км</span><input type="number" inputmode="numeric" id="sKm" value="${s.km || ''}" placeholder="0 — не считать"></label>
    <label class="field"><span>Интервал, мес.</span><input type="number" inputmode="numeric" id="sMonths" value="${s.months || ''}" placeholder="0 — не считать"></label></div>
    <div class="two"><label class="field"><span>Последний раз, дата</span><input type="date" id="sLastDate" value="${s.lastDate || ''}"></label>
    <label class="field"><span>Последний раз, км</span><input type="number" inputmode="numeric" id="sLastKm" value="${s.lastKm ?? ''}"></label></div>
    <button class="btn ${isNew ? 'primary' : ''}" type="submit">${isNew ? 'Добавить пункт' : 'Сохранить изменения'}</button>
    ${!isNew ? `<button class="btn danger" type="button" id="sDel">${I.trash}Удалить пункт</button>` : ''}
  </form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#sName', body).value.trim(); if (!name) { toast('Напишите название'); return; }
      const lk = num($('#sLastKm', body).value);
      const data = { name, km: Math.max(0, Math.round(num($('#sKm', body).value) || 0)), months: Math.max(0, Math.round(num($('#sMonths', body).value) || 0)), lastDate: $('#sLastDate', body).value || null, lastKm: lk != null ? Math.round(lk) : null };
      if (isNew) S.services.push(Object.assign({ id: uid(), rec: false }, data)); else Object.assign(s, data, { rec: false });
      save(); closeSheet(); render(); toast(isNew ? 'Пункт добавлен' : 'Изменения сохранены');
    });
    const doneBtn = $('#doneBtn', body);
    if (doneBtn) doneBtn.addEventListener('click', () => {
      const date = $('#dDate', body).value || todayISO(); const km = num($('#dKm', body).value); const cost = num($('#dCost', body).value);
      s.lastDate = date; if (km != null) s.lastKm = Math.round(km); setMileage(km, date);
      const lg = { id: uid(), date, km: km != null ? Math.round(km) : null, what: s.name, cost: cost || 0, note: '' }; S.carLog.push(lg);
      syncLinkedExpense(lg.id, lg.cost, 'carservice', date, s.name);
      save(); closeSheet(); render(); toast('Замена записана в историю');
    });
    const del = $('#sDel', body);
    if (del) del.addEventListener('click', () => { const idx = S.services.indexOf(s); closeSheet(); removeWithUndo('Пункт удалён', () => S.services.splice(idx, 1), () => S.services.splice(idx, 0, s)); });
  });
}
function logSheet(id) {
  const l = id ? S.carLog.find((x) => x.id === id) : null; if (id && !l) return;
  const d = l ? { ...l } : { date: todayISO(), km: S.car.mileage, what: '', cost: 0, note: '' };
  openSheet(l ? 'Запись' : 'Новая запись', `<form id="f" class="form">
    <label class="field"><span>Что сделали</span><input type="text" id="lWhat" value="${esc(d.what)}" placeholder="Например, заменил масло" maxlength="120" list="svcNames"></label>
    <datalist id="svcNames">${S.services.map((s) => `<option value="${esc(s.name)}"></option>`).join('')}</datalist>
    <div class="two"><label class="field"><span>Дата</span><input type="date" id="lDate" value="${d.date}"></label>
    <label class="field"><span>Пробег, км</span><input type="number" inputmode="numeric" id="lKm" value="${d.km ?? ''}"></label></div>
    <label class="field"><span>Стоимость, ₽</span><input type="number" inputmode="decimal" id="lCost" value="${d.cost || ''}" placeholder="Необязательно"></label>
    <label class="field"><span>Комментарий</span><input type="text" id="lNote" value="${esc(d.note)}" placeholder="Марка масла, где делали"></label>
    ${!l ? `<p class="note-small" style="margin:0">Если название совпадает с пунктом регламента, Life обновит дату последней замены. Стоимость попадёт в «Расходы», категория «Ремонт и ТО».</p>` : ''}
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${l ? `<button class="btn danger" type="button" id="lDel">${I.trash}Удалить запись</button>` : ''}
  </form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const what = $('#lWhat', body).value.trim(); if (!what) { toast('Напишите, что сделали'); return; }
      const km = num($('#lKm', body).value);
      const data = { what, date: $('#lDate', body).value || todayISO(), km: km != null ? Math.round(km) : null, cost: num($('#lCost', body).value) || 0, note: $('#lNote', body).value.trim() };
      let rec;
      if (l) rec = Object.assign(l, data);
      else {
        rec = Object.assign({ id: uid() }, data); S.carLog.push(rec);
        const svc = S.services.find((s) => s.name.toLowerCase() === what.toLowerCase());
        if (svc && (!svc.lastDate || data.date >= svc.lastDate)) { svc.lastDate = data.date; if (data.km != null) svc.lastKm = data.km; }
      }
      syncLinkedExpense(rec.id, rec.cost, 'carservice', rec.date, rec.what); setMileage(data.km, data.date);
      save(); closeSheet(); render(); toast('Запись сохранена');
    });
    const del = $('#lDel', body);
    if (del) del.addEventListener('click', () => {
      const idx = S.carLog.indexOf(l); const exp = S.expenses.find((x) => x.ref === l.id); const eidx = S.expenses.indexOf(exp); closeSheet();
      removeWithUndo('Запись удалена', () => { S.carLog.splice(idx, 1); if (exp) S.expenses.splice(eidx, 1); }, () => { S.carLog.splice(idx, 0, l); if (exp) S.expenses.splice(eidx, 0, exp); });
    });
  });
}
function fuelSheet(id) {
  const f = id ? S.fuel.find((x) => x.id === id) : null; if (id && !f) return;
  const last = [...S.fuel].sort((a, b) => b.date.localeCompare(a.date))[0];
  const d = f ? { ...f } : { date: todayISO(), km: S.car.mileage, liters: '', price: last ? last.price : '', total: '', full: true, station: last ? last.station : '' };
  const stations = [...new Set(S.fuel.map((x) => x.station).filter(Boolean))];
  openSheet(f ? 'Заправка' : 'Новая заправка', `<form id="f" class="form">
    <label class="amount-in"><input type="text" inputmode="decimal" id="fTotal" placeholder="0" value="${d.total || ''}" autocomplete="off" aria-label="Сумма"><span>₽</span></label>
    <div class="two"><label class="field"><span>Литры</span><input type="text" inputmode="decimal" id="fLiters" value="${d.liters || ''}" placeholder="30"></label>
    <label class="field"><span>Цена за литр, ₽</span><input type="text" inputmode="decimal" id="fPrice" value="${d.price || ''}" placeholder="64,5"></label></div>
    <p class="note-small" id="fCalc" style="margin:-4px 0 0">Заполните любые два поля из трёх, третье посчитается само.</p>
    <div class="two"><label class="field"><span>Пробег, км</span><input type="number" inputmode="numeric" id="fKm" value="${d.km ?? ''}" placeholder="км"></label>
    <label class="field"><span>Дата</span><input type="date" id="fDate" value="${d.date}"></label></div>
    <label class="field"><span>АЗС</span><input type="text" id="fStation" value="${esc(d.station || '')}" placeholder="Например, Роснефть" list="stList" maxlength="40"></label>
    <datalist id="stList">${stations.map((s) => `<option value="${esc(s)}"></option>`).join('')}</datalist>
    ${stations.length ? `<div class="chips" id="stChips">${stations.slice(0, 6).map((s) => `<button type="button" class="chip" data-st="${esc(s)}">${esc(s)}</button>`).join('')}</div>` : ''}
    <div class="switch-row"><span>Полный бак</span><label class="switch"><input type="checkbox" id="fFull" ${d.full ? 'checked' : ''}><i></i></label></div>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${f ? `<button class="btn danger" type="button" id="fDel">${I.trash}Удалить заправку</button>` : ''}
  </form>`, (body) => {
    const T = $('#fTotal', body), L = $('#fLiters', body), P = $('#fPrice', body); const order = [];
    const touch = (k) => { const i = order.indexOf(k); if (i >= 0) order.splice(i, 1); order.push(k); };
    const recalc = () => {
      const t = num(T.value), l = num(L.value), p = num(P.value); const free = ['t', 'l', 'p'].find((k) => !order.slice(-2).includes(k));
      if (free === 't' && l && p) T.value = nf2.format(Math.round(l * p * 100) / 100).replace(/\s/g, '');
      else if (free === 'l' && t && p) L.value = String(Math.round(t / p * 100) / 100).replace('.', ',');
      else if (free === 'p' && t && l) P.value = String(Math.round(t / l * 100) / 100).replace('.', ',');
    };
    [[T, 't'], [L, 'l'], [P, 'p']].forEach(([el, k]) => el.addEventListener('input', () => { touch(k); recalc(); }));
    if (!f) { if (P.value) touch('p'); }
    const sc = $('#stChips', body); if (sc) sc.addEventListener('click', (e) => { const b = e.target.closest('[data-st]'); if (b) $('#fStation', body).value = b.dataset.st; });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      let t = num(T.value), l = num(L.value), p = num(P.value);
      if (!t && l && p) t = l * p; if (!l && t && p) l = t / p; if (!p && t && l) p = t / l;
      if (!t || !l) { toast('Укажите сумму и литры (или цену)'); return; }
      const km = num($('#fKm', body).value);
      const data = { date: $('#fDate', body).value || todayISO(), km: km != null ? Math.round(km) : null, liters: Math.round(l * 100) / 100, price: p ? Math.round(p * 100) / 100 : null, total: Math.round(t * 100) / 100, full: $('#fFull', body).checked, station: $('#fStation', body).value.trim() };
      let rec; if (f) rec = Object.assign(f, data, { example: false }); else { rec = Object.assign({ id: uid() }, data); S.fuel.push(rec); }
      syncLinkedExpense(rec.id, rec.total, 'fuel', rec.date, [rec.station, nf2.format(rec.liters) + ' л'].filter(Boolean).join(', '));
      setMileage(data.km, data.date);
      save(); closeSheet(); ui.carSec = 'fuel'; render();
      const cn = fuelStats().cons[rec.id]; toast(cn ? `Расход ${nf1.format(cn.l100)} л на 100 км` : 'Заправка сохранена');
    });
    const del = $('#fDel', body);
    if (del) del.addEventListener('click', () => {
      const idx = S.fuel.indexOf(f); const exp = S.expenses.find((x) => x.ref === f.id); const eidx = S.expenses.indexOf(exp); closeSheet();
      removeWithUndo('Заправка удалена', () => { S.fuel.splice(idx, 1); if (exp) S.expenses.splice(eidx, 1); }, () => { S.fuel.splice(idx, 0, f); if (exp) S.expenses.splice(eidx, 0, exp); });
    });
    if (!f) setTimeout(() => T.focus(), 320);
  });
}
ACT.mileage = () => mileageSheet();
ACT['car-edit'] = () => carEditSheet();
ACT['car-sec'] = (el) => { ui.carSec = el.dataset.sec; render(); };
ACT['car-add'] = () => {
  if (ui.carSec === 'service') svcSheet(); else if (ui.carSec === 'log') logSheet(); else if (ui.carSec === 'fuel') fuelSheet();
  else setTimeout(() => { const i = $('#todoText'); if (i) i.focus(); }, 50);
};
ACT['new-fuel'] = () => fuelSheet();
ACT['fuel-edit'] = (el) => fuelSheet(el.dataset.id);
ACT.svc = (el) => svcSheet(el.dataset.id);
ACT['log-edit'] = (el) => logSheet(el.dataset.id);
ACT['todo-toggle'] = (el) => { const t = S.carTodo.find((x) => x.id === el.dataset.id); if (t) { t.done = !t.done; save(); render(); } };
ACT['todo-del'] = (el) => { const t = S.carTodo.find((x) => x.id === el.dataset.id); if (!t) return; const idx = S.carTodo.indexOf(t); removeWithUndo('Удалено из плана', () => S.carTodo.splice(idx, 1), () => S.carTodo.splice(idx, 0, t)); };

/* ================= Объекты ================= */
const STATUS = { open: 'Открыто', work: 'В работе', done: 'Устранено' };
const objById = (id) => S.objects.find((o) => o.id === id);
function remarkState(r) {
  if (r.status === 'done') return { cls: 'ok', text: r.doneDate ? `устранено ${fmtShort(toDate(r.doneDate))}` : 'устранено', key: 'done' };
  if (!r.due) return { cls: 'none', text: 'без срока', key: 'nodue' };
  const n = dayDiff(toDate(r.due), new Date());
  if (n < 0) return { cls: 'bad', text: `просрочено на ${-n} ${plural(n, 'день', 'дня', 'дней')}`, key: 'overdue', n };
  if (n <= 3) return { cls: 'warn', text: n === 0 ? 'срок сегодня' : `осталось ${n} ${plural(n, 'день', 'дня', 'дней')}`, key: 'soon', n };
  return { cls: 'none', text: `до ${fmtShort(toDate(r.due))}, ${n} ${plural(n, 'день', 'дня', 'дней')}`, key: 'ok', n };
}
function objCounts(o, contractorId) {
  const rs = o.remarks.filter((r) => !contractorId || r.contractorId === contractorId);
  const c = { total: rs.length, open: 0, done: 0, overdue: 0, soon: 0, work: 0 };
  rs.forEach((r) => { if (r.status === 'done') c.done++; else { c.open++; if (r.status === 'work') c.work++; const k = remarkState(r).key; if (k === 'overdue') c.overdue++; if (k === 'soon') c.soon++; } });
  return c;
}
const placeText = (r) => [r.section && `секция ${esc(r.section)}`, r.floor && `этаж ${esc(r.floor)}`, r.unit && esc(r.unit)].filter(Boolean).join(', ');
function suggestContractor(o, text) {
  const t = (text || '').toLowerCase(); if (t.length < 3) return null; let best = null, score = 0;
  o.contractors.forEach((c) => { const keys = (c.keys || '').split(',').map((k) => k.trim().toLowerCase()).filter(Boolean); const s = keys.reduce((a, k) => a + (t.includes(k) ? k.length : 0), 0); if (s > score) { score = s; best = c; } });
  return best;
}
RENDER.objects = function () {
  let html = head('Объекты', '', plusBtn('obj-new', 'Новый объект'));
  if (!S.objects.length) return html + `<div class="card empty"><b>Объектов пока нет</b>Добавьте объект, чтобы вести замечания, обходы и сроки подрядчиков.<button class="btn sm primary" data-act="obj-new">Добавить объект</button></div>`;
  html += S.objects.map((o) => {
    const c = objCounts(o); const p = c.total ? Math.round(c.done / c.total * 100) : 0;
    return `<button class="card obj-card" data-act="obj-open" data-id="${o.id}"><span class="obj-top"><span class="sec-ic">${I.building}</span><span class="grow"><span class="t">${esc(o.name)}</span><span class="m">${o.contractors.length} ${plural(o.contractors.length, 'подрядчик', 'подрядчика', 'подрядчиков')}, срок устранения ${o.days} ${plural(o.days, 'день', 'дня', 'дней')}</span></span><span class="chev">${I.right}</span></span>
      <span class="stat-row"><span><b>${c.open}</b>в работе</span><span class="${c.overdue ? 'bad' : ''}"><b>${c.overdue}</b>просрочено</span><span class="${c.soon ? 'warn' : ''}"><b>${c.soon}</b>скоро срок</span><span class="ok"><b>${c.done}</b>устранено</span></span>
      ${c.total ? `<span class="bar ok"><i style="width:${p}%"></i></span>` : ''}</button>`;
  }).join('');
  return html;
};
DETAIL.object = function (d) {
  const o = objById(d.id); if (!o) { ui.stack.pop(); return currentHTML(); }
  const c = objCounts(o);
  let html = `<div class="detail-top">${backBtn('Объекты')}<button class="icon-btn" data-act="obj-edit" data-id="${o.id}" aria-label="Настройки объекта">${I.edit}</button></div>`;
  html += head(esc(o.name), `${c.open} в работе, ${c.overdue ? `<span class="t-bad">${c.overdue} просрочено</span>` : 'просрочек нет'}`, plusBtn('remark-new', 'Новое замечание', `data-obj="${o.id}"`));
  html += `<div class="seg">${[['remarks', 'Замечания'], ['walks', 'Обходы'], ['contractors', 'Подрядчики']].map(([k, v]) => `<button data-act="obj-sec" data-sec="${k}" class="${ui.objSec === k ? 'on' : ''}">${v}</button>`).join('')}</div>`;
  if (ui.objSec === 'remarks') html += remarksBlock(o);
  else if (ui.objSec === 'walks') html += walksBlock(o);
  else html += contractorsBlock(o);
  return html;
};
function remarkRow(o, r) {
  const st = remarkState(r); const ct = o.contractors.find((x) => x.id === r.contractorId);
  return `<button class="row remark ${r.status === 'done' ? 'done' : ''}" data-act="remark-edit" data-obj="${o.id}" data-id="${r.id}"><span class="stripe ${st.cls}"></span><span class="grow">
    <span class="t">${esc(r.text)}${r.example ? '<span class="tag-ex">пример</span>' : ''}</span>
    <span class="m">${[placeText(r), ct && esc(ct.name)].filter(Boolean).join(' — ')}</span>
    <span class="rm-meta"><span class="pill ${st.cls}">${st.text}</span>${r.status === 'work' ? '<span class="pill none">в работе</span>' : ''}${r.photos.length ? `<span class="ph-count">${I.camera}${r.photos.length}</span>` : ''}</span></span></button>`;
}
function remarksBlock(o, walkId) {
  const flt = walkId ? 'all' : ui.remFilter;
  let html = '';
  if (!walkId) {
    const cnt = (k) => o.remarks.filter({ active: (r) => r.status !== 'done', overdue: (r) => remarkState(r).key === 'overdue', soon: (r) => remarkState(r).key === 'soon', done: (r) => r.status === 'done', all: () => true }[k]).length;
    html += `<div class="chips">${[['active', 'В работе'], ['overdue', 'Просрочено'], ['soon', 'Скоро срок'], ['done', 'Устранено'], ['all', 'Все']].map(([k, v]) => `<button class="chip ${flt === k ? 'on' : ''}" data-act="rem-filter" data-f="${k}">${v}<span class="n">${cnt(k)}</span></button>`).join('')}</div>`;
    html += `<div class="two"><label class="search">${I.search}<input type="search" id="remSearch" placeholder="Поиск" value="${esc(ui.remQuery)}" autocomplete="off"></label>
      <select id="remCtr" aria-label="Подрядчик"><option value="">Все подрядчики</option>${o.contractors.map((c) => `<option value="${c.id}" ${ui.remContractor === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>`;
  }
  return html + `<div id="remListWrap">${remListHTML(o, walkId)}</div>`;
}
function remListHTML(o, walkId) {
  const flt = walkId ? 'all' : ui.remFilter;
  const test = { active: (r) => r.status !== 'done', overdue: (r) => remarkState(r).key === 'overdue', soon: (r) => remarkState(r).key === 'soon', done: (r) => r.status === 'done', all: () => true }[flt];
  const q = walkId ? '' : ui.remQuery.trim().toLowerCase();
  const list = o.remarks.filter((r) => (!walkId || r.walkId === walkId) && test(r) && (walkId || !ui.remContractor || r.contractorId === ui.remContractor) && (!q || (r.text + ' ' + placeText(r)).toLowerCase().includes(q)))
    .sort((a, b) => (a.status === 'done') - (b.status === 'done') || (a.due || '9').localeCompare(b.due || '9'));
  return list.length ? `<div class="list" id="remList">${list.map((r) => remarkRow(o, r)).join('')}</div>`
    : `<div class="card empty"><b>${o.remarks.length ? 'Ничего не найдено' : 'Замечаний пока нет'}</b>${o.remarks.length ? 'Попробуйте другой фильтр или поиск.' : 'Нажмите «+», опишите недостаток. Подрядчика Life подберёт сам по тексту.'}</div>`;
}
function refreshRemList() {
  const top = ui.stack[ui.stack.length - 1]; if (!top || top.type !== 'object') return;
  const o = objById(top.id); const w = $('#remListWrap'); if (o && w) w.innerHTML = remListHTML(o);
}
function walksBlock(o) {
  let html = `<button class="btn primary" data-act="walk-new" data-obj="${o.id}">${I.walk}Начать обход</button>`;
  const ws = [...o.walks].sort((a, b) => b.date.localeCompare(a.date));
  html += ws.length ? `<div class="list">${ws.map((w) => { const n = o.remarks.filter((r) => r.walkId === w.id).length; return `<button class="row" data-act="walk-open" data-obj="${o.id}" data-id="${w.id}"><span class="sec-ic">${I.walk}</span><span class="grow"><span class="t">${esc(w.title)}</span><span class="m">${fmtDY(toDate(w.date))}${w.note ? ', ' + esc(w.note) : ''}</span></span><span class="r">${n} ${plural(n, 'замечание', 'замечания', 'замечаний')}</span><span class="chev">${I.right}</span></button>`; }).join('')}</div>`
    : `<div class="card empty"><b>Обходов пока нет</b>Начните обход: все замечания, записанные во время него, соберутся в одном месте.</div>`;
  return html;
}
function contractorsBlock(o) {
  let html = `<button class="btn" data-act="ctr-new" data-obj="${o.id}">${I.plus}Добавить подрядчика</button>`;
  const list = o.contractors.map((c) => ({ c, n: objCounts(o, c.id) })).sort((a, b) => b.n.overdue - a.n.overdue || b.n.open - a.n.open);
  html += list.length ? `<div class="list">${list.map(({ c, n }) => `<button class="row" data-act="ctr-open" data-obj="${o.id}" data-id="${c.id}"><span class="sec-ic">${I.user}</span><span class="grow"><span class="t">${esc(c.name)}</span><span class="m">${esc(c.scope || '')}</span></span>
    <span class="ctr-st">${n.overdue ? `<span class="pill bad">${n.overdue} просроч.</span>` : ''}<span class="r">${n.open} в работе</span></span></button>`).join('')}</div>` : '';
  return html;
}
DETAIL.walk = function (d) {
  const o = objById(d.obj); const w = o && o.walks.find((x) => x.id === d.id); if (!w) { ui.stack.pop(); return currentHTML(); }
  const n = o.remarks.filter((r) => r.walkId === w.id).length;
  let html = `<div class="detail-top">${backBtn(o.name)}<button class="icon-btn" data-act="walk-edit" data-obj="${o.id}" data-id="${w.id}" aria-label="Изменить обход">${I.edit}</button></div>`;
  html += head(esc(w.title), `${fmtDY(toDate(w.date))}, ${n} ${plural(n, 'замечание', 'замечания', 'замечаний')}`, '');
  html += `<button class="btn primary big-add" data-act="remark-new" data-obj="${o.id}" data-walk="${w.id}">${I.plus}Записать замечание</button>`;
  if (w.note) html += `<div class="card"><div class="m">${esc(w.note)}</div></div>`;
  html += remarksBlock(o, w.id);
  return html;
};
function remarkSheet(objId, id, preset) {
  const o = objById(objId); if (!o) return;
  const r = id ? o.remarks.find((x) => x.id === id) : null; if (id && !r) return;
  const d = r ? { ...r, photos: [...r.photos] } : Object.assign({ text: '', section: '', floor: '', unit: '', contractorId: null, issued: todayISO(), due: isoOf(addDays(new Date(), o.days)), status: 'open', photos: [], walkId: null }, preset || {});
  let ctr = d.contractorId, manual = !!r, status = d.status, saved = false; const added = [];
  const ctrChips = () => `<button type="button" class="chip ${!ctr ? 'on' : ''}" data-ctr="">Без подрядчика</button>${o.contractors.map((c) => `<button type="button" class="chip ${ctr === c.id ? 'on' : ''}" data-ctr="${c.id}">${esc(c.name)}</button>`).join('')}`;
  openSheet(r ? 'Замечание' : 'Новое замечание', `<form id="f" class="form">
    <textarea id="rmText" placeholder="Что не так: трещина стеклопакета, нет подрозетников…" style="min-height:96px">${esc(d.text)}</textarea>
    <div class="three"><label class="field"><span>Секция</span><input type="text" inputmode="numeric" id="rmSec" value="${esc(d.section)}" maxlength="6"></label>
    <label class="field"><span>Этаж</span><input type="text" inputmode="numeric" id="rmFloor" value="${esc(d.floor)}" maxlength="6"></label>
    <label class="field"><span>Помещение</span><input type="text" id="rmUnit" value="${esc(d.unit)}" placeholder="кв. 5, МОП" maxlength="30"></label></div>
    <div class="field"><span>Подрядчик <em id="ctrAuto" class="auto-tag" hidden>подобран по тексту</em></span><div class="chips wrap" id="ctrChips">${ctrChips()}</div></div>
    <div class="two"><label class="field"><span>Дата выдачи</span><input type="date" id="rmIssued" value="${d.issued}"></label>
    <label class="field"><span>Срок устранения</span><input type="date" id="rmDue" value="${d.due || ''}"></label></div>
    <div class="field"><span>Статус</span><div class="seg" id="stSeg">${Object.entries(STATUS).map(([k, v]) => `<button type="button" data-v="${k}" class="${status === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    ${photoStrip(d.photos, true)}
    <div class="sticky-save two-btn">${!r ? '<button class="btn" type="button" id="rmMore">Сохранить и ещё</button>' : ''}<button class="btn primary" type="submit">Сохранить</button></div>
    ${r ? `<button class="btn danger" type="button" id="rmDel">${I.trash}Удалить замечание</button>` : ''}
  </form>`, (body) => {
    const box = $('#ctrChips', body);
    const setCtr = (id2, auto) => { ctr = id2 || null; box.innerHTML = ctrChips(); $('#ctrAuto', body).hidden = !auto; };
    box.addEventListener('click', (e) => { const b = e.target.closest('[data-ctr]'); if (!b) return; manual = true; setCtr(b.dataset.ctr, false); });
    $('#rmText', body).addEventListener('input', (e) => { if (manual) return; const s = suggestContractor(o, e.target.value); if (s && s.id !== ctr) setCtr(s.id, true); });
    $('#rmIssued', body).addEventListener('change', (e) => { const v = e.target.value; if (v) $('#rmDue', body).value = isoOf(addDays(toDate(v), o.days)); });
    $('#stSeg', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; status = b.dataset.v; $$('#stSeg button', body).forEach((x) => x.classList.toggle('on', x === b)); });
    bindPhotoStrip(body, () => d.photos, (ids) => { ids.filter((x) => !d.photos.includes(x)).forEach((x) => added.push(x)); d.photos = ids; });
    const collect = () => {
      const text = $('#rmText', body).value.trim(); if (!text) { toast('Опишите замечание'); $('#rmText', body).focus(); return null; }
      return { text, section: $('#rmSec', body).value.trim(), floor: $('#rmFloor', body).value.trim(), unit: $('#rmUnit', body).value.trim(), contractorId: ctr, issued: $('#rmIssued', body).value || todayISO(), due: $('#rmDue', body).value || null, status, photos: d.photos };
    };
    const persist = (data) => {
      if (data.status === 'done' && (!r || r.status !== 'done')) data.doneDate = todayISO(); else if (data.status !== 'done') data.doneDate = null;
      if (r) { r.photos.filter((x) => !data.photos.includes(x)).forEach(phDel); Object.assign(r, data, { example: false }); }
      else o.remarks.push(Object.assign({ id: uid(), walkId: d.walkId || null }, data));
      saved = true; save();
    };
    $('#f', body).addEventListener('submit', (e) => { e.preventDefault(); const data = collect(); if (!data) return; persist(data); closeSheet(); render(); toast(r ? 'Замечание сохранено' : 'Замечание записано'); });
    const more = $('#rmMore', body);
    if (more) more.addEventListener('click', () => { const data = collect(); if (!data) return; persist(data); render(); toast('Записано. Следующее'); remarkSheet(objId, null, { section: data.section, floor: data.floor, unit: data.unit, walkId: d.walkId, issued: data.issued }); });
    const del = $('#rmDel', body);
    if (del) del.addEventListener('click', () => { saved = true; const idx = o.remarks.indexOf(r); closeSheet(); removeWithUndo('Замечание удалено', () => o.remarks.splice(idx, 1), () => o.remarks.splice(idx, 0, r), () => r.photos.forEach(phDel)); });
    if (!r) setTimeout(() => $('#rmText', body).focus(), 320);
  }, { onClose: () => { if (!saved) added.forEach(phDel); } });
}
function objSheet(id) {
  const o = id ? objById(id) : null;
  openSheet(o ? 'Объект' : 'Новый объект', `<form id="f" class="form">
    <label class="field"><span>Название</span><input type="text" id="oName" value="${esc(o ? o.name : '')}" placeholder="Например, Дом у озера" maxlength="60"></label>
    <label class="field"><span>Срок устранения по умолчанию, дней</span><input type="number" inputmode="numeric" id="oDays" value="${o ? o.days : 20}" min="1" max="365"></label>
    ${!o && S.objects.length ? `<div class="switch-row"><span>Скопировать подрядчиков из «${esc(S.objects[0].name)}»</span><label class="switch"><input type="checkbox" id="oCopy" checked><i></i></label></div>` : ''}
    <button class="btn primary" type="submit">${o ? 'Сохранить' : 'Создать объект'}</button>
    ${o ? confirmBox(`${I.trash}Удалить объект`, `Удалить «${esc(o.name)}» со всеми замечаниями и обходами? Вернуть можно будет только из резервной копии.`) : ''}
  </form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); const name = $('#oName', body).value.trim(); if (!name) { toast('Напишите название объекта'); return; }
      const days = Math.max(1, Math.round(num($('#oDays', body).value) || 20));
      if (o) Object.assign(o, { name, days });
      else { const copy = $('#oCopy', body) && $('#oCopy', body).checked; S.objects.push({ id: uid(), name, days, contractors: copy ? S.objects[0].contractors.map((c) => ({ ...c, id: uid() })) : [], remarks: [], walks: [] }); }
      save(); closeSheet(); render(); toast(o ? 'Объект сохранён' : 'Объект создан');
    });
    const yes = $('#delYes', body);
    if (yes) yes.addEventListener('click', () => { o.remarks.forEach((r) => r.photos.forEach(phDel)); S.objects = S.objects.filter((x) => x !== o); save(); closeSheet(); ui.stack = []; render('anim-back'); toast('Объект удалён'); });
  });
}
function walkSheet(objId, id) {
  const o = objById(objId); const w = id ? o.walks.find((x) => x.id === id) : null;
  const t = new Date();
  openSheet(w ? 'Обход' : 'Новый обход', `<form id="f" class="form">
    <label class="field"><span>Что обходим</span><input type="text" id="wTitle" value="${esc(w ? w.title : '')}" placeholder="Например, 5 секция, этажи 2–12" maxlength="80"></label>
    <label class="field"><span>Дата</span><input type="date" id="wDate" value="${w ? w.date : todayISO()}"></label>
    <label class="field"><span>Заметка</span><input type="text" id="wNote" value="${esc(w ? w.note : '')}" placeholder="С кем, что взять" maxlength="120"></label>
    <button class="btn primary" type="submit">${w ? 'Сохранить' : 'Начать обход'}</button>
    ${w ? `<button class="btn danger" type="button" id="wDel">${I.trash}Удалить обход</button><p class="note-small" style="margin:0">Замечания из обхода останутся в списке объекта.</p>` : ''}
  </form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); const data = { title: $('#wTitle', body).value.trim() || `Обход ${t.getDate()} ${MONTH_GEN[t.getMonth()]}`, date: $('#wDate', body).value || todayISO(), note: $('#wNote', body).value.trim() };
      if (w) { Object.assign(w, data); save(); closeSheet(); render(); toast('Обход сохранён'); }
      else { const nw = Object.assign({ id: uid() }, data); o.walks.push(nw); save(); closeSheet(); push({ type: 'walk', obj: o.id, id: nw.id }); toast('Обход начат. Записывайте замечания'); }
    });
    const del = $('#wDel', body);
    if (del) del.addEventListener('click', () => { const idx = o.walks.indexOf(w); closeSheet(); ui.stack.pop(); removeWithUndo('Обход удалён', () => { o.walks.splice(idx, 1); o.remarks.forEach((r) => { if (r.walkId === w.id) r._w = w.id, r.walkId = null; }); }, () => { o.walks.splice(idx, 0, w); o.remarks.forEach((r) => { if (r._w === w.id) { r.walkId = w.id; delete r._w; } }); }); });
  });
}
function ctrSheet(objId, id) {
  const o = objById(objId); const c = id ? o.contractors.find((x) => x.id === id) : null;
  const n = c ? objCounts(o, c.id) : null; const open = c ? o.remarks.filter((r) => r.contractorId === c.id && r.status !== 'done') : [];
  openSheet(c ? c.name : 'Новый подрядчик', `<form id="f" class="form">
    ${c ? `<div class="stat-row in-sheet"><span><b>${n.open}</b>в работе</span><span class="${n.overdue ? 'bad' : ''}"><b>${n.overdue}</b>просрочено</span><span class="ok"><b>${n.done}</b>устранено</span></div>
      ${open.length ? `<button type="button" class="btn sm" id="ctrShow">Показать его замечания</button>` : ''}` : ''}
    <label class="field"><span>Название</span><input type="text" id="cName" value="${esc(c ? c.name : '')}" maxlength="60"></label>
    <label class="field"><span>Что делает</span><input type="text" id="cScope" value="${esc(c ? c.scope : '')}" placeholder="Окна, электрика…" maxlength="120"></label>
    <label class="field"><span>Контакт</span><input type="text" id="cContact" value="${esc(c ? c.contact : '')}" placeholder="Имя и телефон" maxlength="80"></label>
    <label class="field"><span>Слова для автоподбора, через запятую</span><input type="text" id="cKeys" value="${esc(c ? c.keys : '')}" placeholder="окн, стеклопакет, подоконник" maxlength="300"></label>
    <p class="note-small" style="margin:0">Если в тексте замечания встретится одно из слов, Life сам предложит этого подрядчика.</p>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div>
    ${c ? confirmBox(`${I.trash}Удалить подрядчика`, `Удалить «${esc(c.name)}»? Его замечания останутся без подрядчика.`) : ''}
  </form>`, (body) => {
    const show = $('#ctrShow', body); if (show) show.addEventListener('click', () => { ui.remContractor = c.id; ui.remFilter = 'active'; ui.objSec = 'remarks'; closeSheet(); render(); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); const name = $('#cName', body).value.trim(); if (!name) { toast('Напишите название'); return; }
      const data = { name, scope: $('#cScope', body).value.trim(), contact: $('#cContact', body).value.trim(), keys: $('#cKeys', body).value.trim() };
      if (c) Object.assign(c, data); else o.contractors.push(Object.assign({ id: uid() }, data));
      save(); closeSheet(); render(); toast('Подрядчик сохранён');
    });
    const yes = $('#delYes', body);
    if (yes) yes.addEventListener('click', () => { o.contractors = o.contractors.filter((x) => x !== c); o.remarks.forEach((r) => { if (r.contractorId === c.id) r.contractorId = null; }); if (ui.remContractor === c.id) ui.remContractor = ''; save(); closeSheet(); render(); toast('Подрядчик удалён'); });
  });
}
ACT['obj-new'] = () => objSheet();
ACT['obj-edit'] = (el) => objSheet(el.dataset.id);
ACT['obj-open'] = (el) => { if (ui.tab !== 'objects') { ui.tab = 'objects'; ui.stack = []; } ui.objSec = 'remarks'; ui.remFilter = 'active'; ui.remContractor = ''; ui.remQuery = ''; push({ type: 'object', id: el.dataset.id }); };
ACT['obj-sec'] = (el) => { ui.objSec = el.dataset.sec; render(); };
ACT['rem-filter'] = (el) => { ui.remFilter = el.dataset.f; render(); };
ACT['remark-new'] = (el) => {
  const objId = el.dataset.obj || (S.objects[0] && S.objects[0].id);
  if (!objId) { objSheet(); return; }
  remarkSheet(objId, null, el.dataset.walk ? { walkId: el.dataset.walk } : null);
};
ACT['remark-edit'] = (el) => remarkSheet(el.dataset.obj, el.dataset.id);
ACT['walk-new'] = (el) => walkSheet(el.dataset.obj);
ACT['walk-edit'] = (el) => walkSheet(el.dataset.obj, el.dataset.id);
ACT['walk-open'] = (el) => push({ type: 'walk', obj: el.dataset.obj, id: el.dataset.id });
ACT['ctr-new'] = (el) => ctrSheet(el.dataset.obj);
ACT['ctr-open'] = (el) => ctrSheet(el.dataset.obj, el.dataset.id);

/* ================= Питание ================= */
const MEALS = [['breakfast', 'Завтрак'], ['lunch', 'Обед'], ['dinner', 'Ужин'], ['snack', 'Перекус']];
const MEAL_NAME = Object.fromEntries(MEALS);
const stem = (t) => t.length <= 3 ? t : t.slice(0, Math.max(3, t.length - 2));
const normq = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[«»"'.,()%\-–—/]/g, ' ').replace(/\s+/g, ' ').trim();
const foodDay = () => ui.foodDate || todayISO();
function mealByTime() { const h = new Date().getHours(); return h < 11 ? 'breakfast' : h < 16 ? 'lunch' : h < 21 ? 'dinner' : 'snack'; }
const myFoodObj = (f) => ({ ...f, key: 'my:' + f.id, mine: true, tags: normq((f.tags || '') + ' ' + (f.brand || '') + ' мои') });
function allFoods() { return S.food.my.map(myFoodObj).concat(FOOD_DB); }
function findFood(key) { return allFoods().find((f) => f.key === key) || OFF_CACHE.get(key) || null; }
const OFF_CACHE = new Map();
const r1 = (n) => Math.round(n * 10) / 10;
const fmtG = (n) => nf1.format(r1(n)).replace(/,0$/, '');
function entryVals(e) { const k = e.grams / 100; return { kcal: e.kcal100 * k, p: e.p100 * k, f: e.f100 * k, c: e.c100 * k }; }
function dayTotals(date) {
  const t = { kcal: 0, p: 0, f: 0, c: 0 };
  S.food.entries.filter((e) => e.date === date).forEach((e) => { const v = entryVals(e); t.kcal += v.kcal; t.p += v.p; t.f += v.f; t.c += v.c; });
  return t;
}
const latestWeight = () => { const w = [...S.food.weights].sort((a, b) => b.date.localeCompare(a.date))[0]; return w ? w.kg : null; };
function calcGoals(g) {
  if (g.manual) return { kcal: g.kcal, p: g.p, f: g.f, c: g.c };
  const w = num(g.weight) || latestWeight() || 75, h = num(g.height) || 178, a = num(g.age) || 30;
  const bmr = 10 * w + 6.25 * h - 5 * a + (g.sex === 'f' ? -161 : 5);
  let kcal = bmr * (num(g.activity) || 1.55) * (g.mode === 'loss' ? 0.85 : g.mode === 'gain' ? 1.1 : 1);
  kcal = Math.max(kcal, g.sex === 'f' ? 1200 : 1500);
  const p = w * (g.mode === 'maintain' ? 1.6 : 1.8), f = w * 0.9, c = Math.max(50, (kcal - p * 4 - f * 9) / 4);
  return { kcal: Math.round(kcal / 10) * 10, p: Math.round(p), f: Math.round(f), c: Math.round(c) };
}
const goals = () => calcGoals(S.food.goals);
const burnedOn = (date) => S.workouts.filter((w) => isoOf(new Date(w.start)) === date).reduce((s, w) => s + (w.kcal || 0), 0);
function kcalRing(val, goal, size) {
  const p = goal ? Math.min(1, val / goal) : 0; const over = goal && val > goal; const r = 42, C = 2 * Math.PI * r;
  return `<svg class="kring" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="9"/>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="${over ? 'var(--warn)' : 'var(--accent)'}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)"/></svg>`;
}
function macroBar(label, val, goal, cls) {
  return `<div class="macro"><div class="mh"><span>${label}</span><span><b>${Math.round(val)}</b> / ${goal} г</span></div><div class="bar ${cls}"><i style="width:${Math.min(100, goal ? val / goal * 100 : 0)}%"></i></div></div>`;
}
RENDER.food = function () {
  const d = foodDay(); const dt = toDate(d); const isToday = d === todayISO(); const g = goals(); const t = dayTotals(d); const burned = burnedOn(d);
  const left = g.kcal - t.kcal;
  let html = head('Питание', '', `<button class="icon-btn" data-act="food-goals" aria-label="Норма">${I.gear}</button>${plusBtn('add-food', 'Добавить еду')}`);
  html += `<div class="month-nav"><button class="icon-btn" data-act="food-day" data-dir="-1" aria-label="Предыдущий день">${I.left}</button><b>${isToday ? 'Сегодня' : cap(relDay(dt))}${isToday ? '' : ', ' + WD_SHORT[dt.getDay()]}</b><button class="icon-btn" data-act="food-day" data-dir="1" aria-label="Следующий день" ${isToday ? 'disabled' : ''}>${I.right}</button></div>`;
  html += `<div class="card food-sum"><div class="ring-wrap">${kcalRing(t.kcal, g.kcal, 118)}<div class="ring-txt"><b>${nf.format(Math.round(t.kcal))}</b><span>из ${nf.format(g.kcal)} ккал</span></div></div>
    <div class="macros">${macroBar('Белки', t.p, g.p, 'p')}${macroBar('Жиры', t.f, g.f, 'f')}${macroBar('Углеводы', t.c, g.c, 'c')}
    <div class="left-line ${left < 0 ? 'neg' : ''}">${left >= 0 ? `Осталось ${nf.format(Math.round(left))} ккал` : `Больше нормы на ${nf.format(Math.round(-left))} ккал`}${burned ? `<span>Тренировки: −${nf.format(Math.round(burned))}</span>` : ''}</div></div></div>`;
  if (!S.food.goals.set) html += `<div class="banner"><div class="grow"><b>Посчитайте свою норму</b>Сейчас стоит средняя. Укажите рост, вес и цель, и Life посчитает калории и белок под вас.</div><button class="btn sm primary" data-act="food-goals">Посчитать</button></div>`;
  const water = S.food.water[d] || 0;
  html += `<div class="card water"><h2>Вода <span class="m">${nf1.format(water * 0.25).replace(',0', '')} из 2 л</span></h2><div class="cups">${Array.from({ length: 8 }, (_, i) => `<button class="cup ${i < water ? 'on' : ''}" data-act="water" data-n="${i + 1}" aria-label="${i + 1} стакан"><i></i></button>`).join('')}</div></div>`;
  MEALS.forEach(([id, name]) => {
    const es = S.food.entries.filter((e) => e.date === d && e.meal === id);
    const sum = es.reduce((s, e) => s + entryVals(e).kcal, 0);
    html += `<div class="card meal"><h2><span>${name}</span><span class="m">${es.length ? nf.format(Math.round(sum)) + ' ккал' : ''}</span></h2>
      ${es.length ? `<div class="ops">${es.map((e) => { const v = entryVals(e); return `<button class="row" data-act="food-entry" data-id="${e.id}"><span class="grow"><span class="t">${esc(e.name)}</span><span class="m">${fmtG(e.grams)} г, Б ${fmtG(v.p)} Ж ${fmtG(v.f)} У ${fmtG(v.c)}</span></span><span class="r amt">${nf.format(Math.round(v.kcal))}</span></button>`; }).join('')}</div>` : ''}
      <button class="btn sm meal-add" data-act="add-food" data-meal="${id}">${I.plus}Добавить</button></div>`;
  });
  // Неделя
  const days = Array.from({ length: 7 }, (_, i) => isoOf(addDays(dt, i - 6)));
  const vals = days.map((x) => dayTotals(x).kcal); const mx = Math.max(g.kcal * 1.2, ...vals, 1);
  html += `<div class="card"><h2>Неделя <span class="m">норма ${nf.format(g.kcal)}</span></h2><div class="week-chart" style="--goalpx:${(g.kcal / mx * 110).toFixed(1)}px">${days.map((x, i) => `<button class="wc ${x === d ? 'on' : ''}" data-act="food-goto" data-d="${x}"><span class="b ${vals[i] > g.kcal ? 'over' : ''}" style="height:${Math.round(vals[i] / mx * 100)}%"></span><span class="d">${WD_SHORT[toDate(x).getDay()]}</span></button>`).join('')}<i class="goal-line"></i></div></div>`;
  // Вес
  const ws = [...S.food.weights].sort((a, b) => a.date.localeCompare(b.date)); const last = ws[ws.length - 1];
  const month = ws.filter((w) => w.date >= isoOf(addDays(new Date(), -30))); const delta = last && month.length > 1 ? last.kg - month[0].kg : null;
  html += `<div class="card"><h2>Вес <button class="link" data-act="add-weight">${I.plus.replace('<svg', '<svg width="14" height="14"')} Записать</button></h2>
    ${last ? `<div class="money-row"><div class="big-num">${nf1.format(last.kg)}<small> кг</small></div>${delta != null ? `<div class="svc-meta"><span class="${delta < 0 ? 't-ok' : delta > 0 ? 't-warn' : ''}">${delta > 0 ? '+' : delta < 0 ? '−' : ''}${nf1.format(Math.abs(delta))} кг за месяц</span></div>` : ''}</div>${ws.length > 1 ? sparkline(ws.slice(-20).map((w) => w.kg)) : ''}<button class="btn ghost sm" data-act="weights" style="justify-self:start;padding:0">Все записи</button>`
    : '<p class="note-small" style="margin:0;padding:0">Записывайте вес раз в неделю, утром натощак. Life покажет, как он меняется.</p>'}</div>`;
  return html;
};
function sparkline(arr) {
  const w = 300, h = 54, mn = Math.min(...arr), mx = Math.max(...arr), span = mx - mn || 1;
  const pts = arr.map((v, i) => [i / (arr.length - 1) * (w - 8) + 4, h - 6 - (v - mn) / span * (h - 12)]);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="4" fill="var(--accent)"/></svg>`;
}

/* ---------- Поиск продуктов ---------- */
function foodSearch(q, cat) {
  const qq = normq(q); const toks = qq ? qq.split(' ') : [];
  let list = allFoods();
  if (cat === 'recent') { const rec = S.food.recent; return rec.map(findFood).filter(Boolean); }
  if (cat === 'my') list = list.filter((f) => f.mine);
  else if (cat) list = list.filter((f) => f.cat === cat);
  if (!toks.length) return list;
  const scored = [];
  list.forEach((f) => {
    const name = normq(f.name), hay = name + ' ' + normq(f.brand || '') + ' ' + f.tags;
    if (!toks.every((t) => hay.includes(stem(t)))) return;
    let sc = 0; if (name.startsWith(stem(toks[0]))) sc += 5; if (toks.every((t) => name.includes(stem(t)))) sc += 3; sc += toks.filter((t) => hay.includes(t)).length * 2; if (f.mine) sc += 2; if (S.food.recent.includes(f.key)) sc += 2;
    scored.push([sc, f]);
  });
  return scored.sort((a, b) => b[0] - a[0]).map((x) => x[1]);
}
function foodRow(f) {
  const sub = [f.brand && esc(f.brand), f.mine ? (f.src === 'off' ? 'из интернета' : 'мой продукт') : '', f.store ? 'магазинный' : ''].filter(Boolean).join(', ');
  return `<button class="row food-row" data-food="${esc(f.key)}"><span class="grow"><span class="t">${esc(f.name)}</span><span class="m">${nf.format(Math.round(f.kcal))} ккал, Б ${fmtG(f.p)} Ж ${fmtG(f.f)} У ${fmtG(f.c)}${sub ? ' — ' + sub : ''}</span></span><span class="chev">${I.right}</span></button>`;
}
function foodSearchSheet(meal, state) {
  const st = state || { q: '', cat: S.food.recent.length ? 'recent' : '' };
  openSheet(`Добавить: ${MEAL_NAME[meal].toLowerCase()}`, `<div class="form">
    <label class="search">${I.search}<input type="search" id="fq" placeholder="Гречка, чебупели, пятёрочка…" value="${esc(st.q)}" autocomplete="off"></label>
    <div class="chips" id="fcats">${[S.food.recent.length && ['recent', 'Недавние', '🕘'], ['', 'Все', ''], S.food.my.length && ['my', 'Мои', '⭐'], ...FOOD_CATS.map((c) => [c.id, c.id, c.e])].filter(Boolean).map(([id, n, e]) => `<button type="button" class="chip ${st.cat === id ? 'on' : ''}" data-fcat="${esc(id)}">${e ? e + ' ' : ''}${n}</button>`).join('')}</div>
    <div id="fres"></div>
    <div class="btn-row"><button type="button" class="btn sm" id="fOnline">${I.search}Найти в интернете</button><button type="button" class="btn sm" id="fMine">${I.plus}Своё блюдо</button></div>
    <p class="note-small" style="margin:0">Значения на 100 г — типовые. У магазинных товаров сверяйтесь с упаковкой, любое значение можно поправить.</p>
  </div>`, (body) => {
    const res = $('#fres', body); let shown = 40;
    const draw = () => {
      const list = foodSearch(st.q, st.q ? (st.cat === 'recent' ? '' : st.cat) : st.cat);
      const online = [...OFF_CACHE.values()].filter((f) => f.q === normq(st.q));
      res.innerHTML = (list.length || online.length) ? `<div class="list">${list.slice(0, shown).map(foodRow).join('')}${online.map(foodRow).join('')}</div>${list.length > shown ? `<button type="button" class="btn sm ghost" id="fMore">Показать ещё ${list.length - shown}</button>` : ''}`
        : `<div class="card empty" style="padding:18px"><b>Ничего не нашлось</b>Попробуйте другое слово, поиск в интернете или добавьте своё блюдо.</div>`;
      const more = $('#fMore', body); if (more) more.onclick = () => { shown += 60; draw(); };
    };
    $('#fq', body).addEventListener('input', (e) => { st.q = e.target.value; shown = 40; draw(); });
    $('#fcats', body).addEventListener('click', (e) => { const b = e.target.closest('[data-fcat]'); if (!b) return; st.cat = b.dataset.fcat; $$('#fcats .chip', body).forEach((x) => x.classList.toggle('on', x === b)); shown = 40; draw(); });
    res.addEventListener('click', (e) => { const b = e.target.closest('[data-food]'); if (!b) return; const f = findFood(b.dataset.food); if (f) portionSheet({ food: f, meal, back: () => foodSearchSheet(meal, st) }); });
    $('#fMine', body).onclick = () => myFoodSheet(null, { name: st.q }, (f) => portionSheet({ food: myFoodObj(f), meal, back: () => foodSearchSheet(meal, st) }), () => foodSearchSheet(meal, st));
    $('#fOnline', body).onclick = async () => {
      if (normq(st.q).length < 2) { toast('Напишите название, например «чебупели»'); $('#fq', body).focus(); return; }
      const btn = $('#fOnline', body); btn.disabled = true; btn.textContent = 'Ищу…';
      try { const n = await offSearch(st.q); toast(n ? `Найдено в интернете: ${n}` : 'В интернете ничего не нашлось'); }
      catch (err) { toast(window.LIFE_PREVIEW ? 'Поиск в интернете работает в установленном Life' : 'Нет связи с базой продуктов. Проверьте интернет'); }
      btn.disabled = false; btn.innerHTML = `${I.search}Найти в интернете`; draw();
    };
    draw();
    setTimeout(() => { const i = $('#fq', body); if (i && !st.q) i.focus(); }, 320);
  });
}
/* Open Food Facts — открытая база продуктов со всего мира, в том числе российских */
async function offSearch(q) {
  const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 12000);
  const url = 'https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=30&fields=code,product_name,product_name_ru,brands,nutriments,serving_quantity&search_terms=' + encodeURIComponent(q);
  try {
    const r = await fetch(url, { signal: ctrl.signal }); if (!r.ok) throw new Error('http');
    const data = await r.json(); let n = 0; const qn = normq(q);
    (data.products || []).forEach((p) => {
      const nu = p.nutriments || {}; let kcal = nu['energy-kcal_100g']; if (kcal == null && nu.energy_100g != null) kcal = nu.energy_100g / 4.184;
      const name = (p.product_name_ru || p.product_name || '').trim(); if (!name || kcal == null) return;
      const key = 'off:' + p.code; if (OFF_CACHE.has(key)) return;
      OFF_CACHE.set(key, { key, name, brand: (p.brands || '').split(',')[0].trim(), kcal: +kcal, p: +(nu.proteins_100g || 0), f: +(nu.fat_100g || 0), c: +(nu.carbohydrates_100g || 0), portion: Math.round(+p.serving_quantity) || 100, unit: '', unitG: 0, tags: '', off: true, code: p.code, q: qn });
      n++;
    });
    return n;
  } finally { clearTimeout(tm); }
}

/* ---------- Ползунок ---------- */
function sliderHTML(id, min, max, step, value) {
  return `<div class="slider" id="${id}" role="slider" tabindex="0" aria-label="Граммы" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}" data-min="${min}" data-max="${max}" data-step="${step}"><div class="sl-track"><div class="sl-fill"></div></div><div class="sl-thumb"></div></div>`;
}
function bindSlider(el, onInput) {
  const min = +el.dataset.min, step = +el.dataset.step; let max = +el.dataset.max; let val = +el.getAttribute('aria-valuenow');
  const paint = () => { const k = Math.max(0, Math.min(1, (val - min) / (max - min))); el.style.setProperty('--p', (k * 100).toFixed(2) + '%'); el.style.setProperty('--p-num', k.toFixed(4)); el.setAttribute('aria-valuenow', val); };
  const fromX = (x) => { const r = el.getBoundingClientRect(); const k = Math.max(0, Math.min(1, (x - r.left - 14) / (r.width - 28))); const v = Math.round((min + k * (max - min)) / step) * step; if (v !== val) { val = v; paint(); onInput(val); } };
  let st = null;
  el.addEventListener('pointerdown', (e) => { st = { x: e.clientX, y: e.clientY, id: e.pointerId, go: e.pointerType === 'mouse' }; if (st.go) { el.setPointerCapture(e.pointerId); el.classList.add('active'); fromX(e.clientX); } });
  el.addEventListener('pointermove', (e) => {
    if (!st) return;
    if (!st.go) { const dx = Math.abs(e.clientX - st.x), dy = Math.abs(e.clientY - st.y); if (dx < 5 && dy < 5) return; if (dy > dx) { st = null; return; } st.go = true; el.classList.add('active'); try { el.setPointerCapture(st.id); } catch (er) { /* без захвата */ } }
    fromX(e.clientX);
  });
  el.addEventListener('pointerup', (e) => { if (st && !st.go) fromX(e.clientX); st = null; el.classList.remove('active'); });
  el.addEventListener('pointercancel', () => { st = null; el.classList.remove('active'); });
  el.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (!d) return; e.preventDefault(); val = Math.max(min, Math.min(max, val + d * step)); paint(); onInput(val); });
  paint();
  return { set(v) { val = v; if (v > max) { max = Math.ceil(v / 100) * 100; el.dataset.max = max; el.setAttribute('aria-valuemax', max); } paint(); } };
}

/* ---------- Порция ---------- */
function portionSheet({ food, meal, entry, back }) {
  const f = food; let grams = entry ? entry.grams : (f.unitG || f.portion || 100); let ml = entry ? entry.meal : meal;
  const max = Math.max(500, Math.ceil(Math.max(f.portion * 4, f.unitG * 6, grams * 1.5) / 100) * 100); const step = max <= 300 ? 1 : 5;
  const presets = f.unitG ? [0.5, 1, 2, 3].map((k) => [k * f.unitG, `${k === 0.5 ? '½' : k} ${f.unit}`]) : [50, 100, 150, 200, 300].map((g) => [g, g + ' г']);
  openSheet(entry ? 'Порция' : f.name, `<div class="form">
    ${entry ? `<div class="t" style="font-weight:700;font-size:17px">${esc(f.name)}</div>` : ''}
    <div class="per100"><span class="v">На 100 г: <b>${nf.format(Math.round(f.kcal))} ккал</b>, Б ${fmtG(f.p)}, Ж ${fmtG(f.f)}, У ${fmtG(f.c)}${f.brand ? `. ${esc(f.brand)}` : ''}</span>
      <button type="button" class="link" id="pEdit">Поправить</button></div>
    <div class="grams-box"><div class="grams-in"><input type="text" inputmode="decimal" id="pG" value="${fmtG(grams)}" aria-label="Граммы"><span>г</span></div>
      <div class="pm"><button type="button" class="icon-btn" id="pMinus" aria-label="Минус 10 грамм">${I.minus}</button><button type="button" class="icon-btn" id="pPlus" aria-label="Плюс 10 грамм">${I.plus}</button></div></div>
    ${sliderHTML('pSl', 0, max, step, grams)}
    <div class="chips wrap" id="pPre">${presets.map(([g, l]) => `<button type="button" class="chip" data-g="${g}">${l}</button>`).join('')}</div>
    <div class="portion-tot" id="pTot"></div>
    <div class="seg" id="pMeal">${MEALS.map(([id, n]) => `<button type="button" data-v="${id}" class="${ml === id ? 'on' : ''}">${n}</button>`).join('')}</div>
    ${entry ? `<button class="btn danger" type="button" id="pDel">${I.trash}Удалить из дневника</button>` : ''}
    <div class="sticky-save"><button class="btn primary" type="button" id="pSave">${entry ? 'Сохранить' : 'Добавить'}</button></div>
  </div>`, (body) => {
    const gi = $('#pG', body); const tot = $('#pTot', body);
    const fit = () => { gi.style.width = (Math.max(2, String(gi.value).length) + 0.4) + 'ch'; };
    const paintTot = () => { fit(); const k = grams / 100; tot.innerHTML = `<div><b>${nf.format(Math.round(f.kcal * k))}</b><span>ккал</span></div><div><b>${fmtG(f.p * k)}</b><span>белки</span></div><div><b>${fmtG(f.f * k)}</b><span>жиры</span></div><div><b>${fmtG(f.c * k)}</b><span>углеводы</span></div>`; };
    const sl = bindSlider($('#pSl', body), (v) => { grams = v; gi.value = fmtG(v); paintTot(); });
    const setG = (v) => { grams = Math.max(0, Math.round(v * 10) / 10); gi.value = fmtG(grams); sl.set(grams); paintTot(); };
    gi.addEventListener('input', () => { const v = num(gi.value); if (v != null) { grams = Math.max(0, v); sl.set(grams); paintTot(); } });
    gi.addEventListener('focus', () => gi.select());
    $('#pMinus', body).onclick = () => setG(Math.max(0, grams - 10)); $('#pPlus', body).onclick = () => setG(grams + 10);
    $('#pPre', body).addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) setG(+b.dataset.g); });
    $('#pMeal', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; ml = b.dataset.v; $$('#pMeal button', body).forEach((x) => x.classList.toggle('on', x === b)); });
    $('#pEdit', body).onclick = () => myFoodSheet(f.mine ? f.id : null, { ...f, name: f.name, src: f.off ? 'off' : f.mine ? f.src : 'edit' }, (saved) => portionSheet({ food: myFoodObj(saved), meal: ml, entry, back }), () => portionSheet({ food: f, meal: ml, entry, back }));
    $('#pSave', body).onclick = () => {
      if (!grams) { toast('Укажите, сколько грамм'); gi.focus(); return; }
      let ff = f;
      if (f.off && !f.mine) { const mf = { id: uid(), name: f.name, brand: f.brand, kcal: r1(f.kcal), p: r1(f.p), f: r1(f.f), c: r1(f.c), portion: f.portion, unit: '', unitG: 0, tags: '', src: 'off', code: f.code }; S.food.my.push(mf); ff = myFoodObj(mf); }
      const data = { meal: ml, grams, name: ff.name, key: ff.key, kcal100: ff.kcal, p100: ff.p, f100: ff.f, c100: ff.c };
      if (entry) Object.assign(entry, data); else S.food.entries.push(Object.assign({ id: uid(), date: foodDay(), t: Date.now() }, data));
      S.food.recent = [ff.key, ...S.food.recent.filter((k) => k !== ff.key)].slice(0, 30);
      save(); closeSheet(); render(); toast(`${MEAL_NAME[ml]}: ${ff.name}, ${nf.format(Math.round(ff.kcal * grams / 100))} ккал`);
    };
    const del = $('#pDel', body);
    if (del) del.onclick = () => { const idx = S.food.entries.indexOf(entry); closeSheet(); removeWithUndo('Удалено из дневника', () => S.food.entries.splice(idx, 1), () => S.food.entries.splice(idx, 0, entry)); };
    paintTot();
  }, { back });
}
/* ---------- Свой продукт ---------- */
function myFoodSheet(id, pre, onSaved, backFn) {
  const ex = id ? S.food.my.find((x) => x.id === id) : null;
  const d = ex ? { ...ex } : Object.assign({ name: '', brand: '', kcal: '', p: '', f: '', c: '', portion: 100, unit: '', unitG: '', tags: '' }, pre || {});
  openSheet(ex ? 'Мой продукт' : (pre && pre.src === 'edit' ? 'Свой вариант' : 'Своё блюдо'), `<form id="f" class="form">
    ${pre && pre.src === 'edit' ? '<p class="note-small" style="margin:0">Life сохранит ваш вариант в «Мои». Встроенный продукт останется как был.</p>' : ''}
    <label class="field"><span>Название</span><input type="text" id="mfName" value="${esc(d.name)}" placeholder="Например, суп мамин" maxlength="80"></label>
    <label class="field"><span>Производитель или магазин</span><input type="text" id="mfBrand" value="${esc(d.brand || '')}" placeholder="Необязательно" maxlength="60"></label>
    <div class="field"><span>На 100 г</span><div class="four">
      <label><input type="text" inputmode="decimal" id="mfK" value="${d.kcal === '' ? '' : fmtG(d.kcal)}" placeholder="ккал"><em>ккал</em></label>
      <label><input type="text" inputmode="decimal" id="mfP" value="${d.p === '' ? '' : fmtG(d.p)}" placeholder="0"><em>белки</em></label>
      <label><input type="text" inputmode="decimal" id="mfF" value="${d.f === '' ? '' : fmtG(d.f)}" placeholder="0"><em>жиры</em></label>
      <label><input type="text" inputmode="decimal" id="mfC" value="${d.c === '' ? '' : fmtG(d.c)}" placeholder="0"><em>углев.</em></label></div></div>
    <p class="note-small" style="margin:-6px 0 0">Если калорий не знаете, оставьте пустым: Life посчитает по белкам, жирам и углеводам.</p>
    <div class="two"><label class="field"><span>Обычная порция, г</span><input type="number" inputmode="decimal" id="mfPor" value="${d.portion || 100}"></label>
    <label class="field"><span>Штука, г (если есть)</span><input type="number" inputmode="decimal" id="mfUnit" value="${d.unitG || ''}" placeholder="Например, 50"></label></div>
    <label class="field"><span>Слова для поиска</span><input type="text" id="mfTags" value="${esc(d.tags || '')}" placeholder="Например, суп обед" maxlength="120"></label>
    ${ex ? `<button class="btn danger" type="button" id="mfDel">${I.trash}Удалить продукт</button>` : ''}
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div></form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#mfName', body).value.trim(); if (!name) { toast('Напишите название'); return; }
      const p = num($('#mfP', body).value) || 0, fa = num($('#mfF', body).value) || 0, c = num($('#mfC', body).value) || 0;
      let k = num($('#mfK', body).value); if (k == null) k = p * 4 + fa * 9 + c * 4;
      const ug = num($('#mfUnit', body).value);
      const data = { name, brand: $('#mfBrand', body).value.trim(), kcal: r1(k), p: r1(p), f: r1(fa), c: r1(c), portion: num($('#mfPor', body).value) || 100, unit: ug ? 'шт' : '', unitG: ug || 0, tags: $('#mfTags', body).value.trim(), src: (pre && pre.src === 'off') ? 'off' : (ex ? ex.src : 'my') };
      let rec; if (ex) rec = Object.assign(ex, data); else { rec = Object.assign({ id: uid() }, data); S.food.my.push(rec); }
      save(); toast('Продукт сохранён в «Мои»');
      if (onSaved) onSaved(rec); else closeSheet();
    });
    const del = $('#mfDel', body);
    if (del) del.onclick = () => { const idx = S.food.my.indexOf(ex); if (backFn) backFn(); else closeSheet(); removeWithUndo('Продукт удалён', () => S.food.my.splice(idx, 1), () => S.food.my.splice(idx, 0, ex)); };
  }, { back: backFn });
}
/* ---------- Норма ---------- */
function goalsSheet() {
  const g = { ...S.food.goals };
  const ACT_L = [[1.2, 'Почти без движения'], [1.375, 'Лёгкая: 1–3 тренировки'], [1.55, 'Средняя: 3–5 тренировок'], [1.725, 'Высокая: каждый день']];
  openSheet('Норма питания', `<form id="f" class="form">
    <div class="seg" id="gMode">${[['loss', 'Сбросить жир'], ['maintain', 'Держать вес'], ['gain', 'Набрать']].map(([k, v]) => `<button type="button" data-v="${k}" class="${g.mode === k ? 'on' : ''}">${v}</button>`).join('')}</div>
    <div class="seg" id="gSex">${[['m', 'Мужчина'], ['f', 'Женщина']].map(([k, v]) => `<button type="button" data-v="${k}" class="${g.sex === k ? 'on' : ''}">${v}</button>`).join('')}</div>
    <div class="three"><label class="field"><span>Возраст</span><input type="number" inputmode="numeric" id="gAge" value="${g.age || ''}" placeholder="30"></label>
    <label class="field"><span>Рост, см</span><input type="number" inputmode="numeric" id="gH" value="${g.height || ''}" placeholder="178"></label>
    <label class="field"><span>Вес, кг</span><input type="number" inputmode="decimal" id="gW" value="${g.weight || latestWeight() || ''}" placeholder="75"></label></div>
    <label class="field"><span>Активность</span><select id="gAct">${ACT_L.map(([v, l]) => `<option value="${v}" ${+g.activity === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <div class="goal-res" id="gRes"></div>
    <div class="switch-row"><span>Свои цифры</span><label class="switch"><input type="checkbox" id="gMan" ${g.manual ? 'checked' : ''}><i></i></label></div>
    <div class="four" id="gManF" ${g.manual ? '' : 'hidden'}>
      <label><input type="number" inputmode="numeric" id="gK" value="${g.kcal || ''}"><em>ккал</em></label><label><input type="number" inputmode="numeric" id="gP" value="${g.p || ''}"><em>белки</em></label>
      <label><input type="number" inputmode="numeric" id="gF" value="${g.f || ''}"><em>жиры</em></label><label><input type="number" inputmode="numeric" id="gC" value="${g.c || ''}"><em>углев.</em></label></div>
    <p class="note-small" style="margin:0">Расчёт по формуле Миффлина — Сан Жеора. Это ориентир, а не медицинская рекомендация. Для снижения веса Life берёт умеренный дефицит 15% и белок 1,8 г на кг.</p>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div></form>`, (body) => {
    const read = () => { g.age = num($('#gAge', body).value); g.height = num($('#gH', body).value); g.weight = num($('#gW', body).value); g.activity = num($('#gAct', body).value); g.manual = $('#gMan', body).checked; if (g.manual) { g.kcal = num($('#gK', body).value) || 0; g.p = num($('#gP', body).value) || 0; g.f = num($('#gF', body).value) || 0; g.c = num($('#gC', body).value) || 0; } };
    const show = () => { read(); const r = calcGoals(g); $('#gRes', body).innerHTML = `<div><b>${nf.format(r.kcal)}</b><span>ккал в день</span></div><div><b>${r.p}</b><span>белки, г</span></div><div><b>${r.f}</b><span>жиры, г</span></div><div><b>${r.c}</b><span>углеводы, г</span></div>`; };
    const seg = (sel, key) => $(sel, body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; g[key] = b.dataset.v; $$(sel + ' button', body).forEach((x) => x.classList.toggle('on', x === b)); show(); });
    seg('#gMode', 'mode'); seg('#gSex', 'sex');
    body.addEventListener('input', show); body.addEventListener('change', show);
    $('#gMan', body).addEventListener('change', (e) => { if (e.target.checked) { const r = calcGoals({ ...g, manual: false }); $('#gK', body).value = r.kcal; $('#gP', body).value = r.p; $('#gF', body).value = r.f; $('#gC', body).value = r.c; } $('#gManF', body).hidden = !e.target.checked; show(); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); read();
      if (g.weight && !S.food.weights.some((w) => w.date === todayISO())) S.food.weights.push({ id: uid(), date: todayISO(), kg: g.weight });
      S.food.goals = Object.assign(g, { set: true }); save(); closeSheet(); render(); toast(`Норма: ${nf.format(goals().kcal)} ккал в день`);
    });
    show();
  });
}
function weightSheet() {
  const last = latestWeight() || 75; let kg = last;
  openSheet('Вес', `<form id="f" class="form">
    <div class="grams-box"><div class="grams-in"><input type="text" inputmode="decimal" id="wKg" value="${nf1.format(kg)}" aria-label="Вес"><span>кг</span></div>
      <div class="pm"><button type="button" class="icon-btn" id="wM" aria-label="Минус 100 грамм">${I.minus}</button><button type="button" class="icon-btn" id="wP" aria-label="Плюс 100 грамм">${I.plus}</button></div></div>
    <label class="field"><span>Дата</span><input type="date" id="wDate" value="${todayISO()}"></label>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить</button></div></form>`, (body) => {
    const i = $('#wKg', body); const set = (v) => { kg = Math.round(v * 10) / 10; i.value = nf1.format(kg); };
    $('#wM', body).onclick = () => set(kg - 0.1); $('#wP', body).onclick = () => set(kg + 0.1);
    i.addEventListener('input', () => { const v = num(i.value); if (v) kg = v; });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); if (!kg || kg < 20 || kg > 400) { toast('Проверьте вес'); return; }
      const date = $('#wDate', body).value || todayISO(); const ex = S.food.weights.find((w) => w.date === date);
      if (ex) ex.kg = kg; else S.food.weights.push({ id: uid(), date, kg });
      save(); closeSheet(); render(); toast(`Вес ${nf1.format(kg)} кг записан`);
    });
  });
}
function weightsSheet() {
  const ws = [...S.food.weights].sort((a, b) => b.date.localeCompare(a.date));
  openSheet('Записи веса', `<div class="form">${ws.length ? `<div class="list">${ws.map((w) => `<div class="row"><span class="grow"><span class="t">${nf1.format(w.kg)} кг</span><span class="m">${fmtDY(toDate(w.date))}</span></span><button class="act" data-wdel="${w.id}" aria-label="Удалить">${I.trash}</button></div>`).join('')}</div>` : '<p class="note-small">Записей пока нет.</p>'}</div>`, (body) => {
    body.addEventListener('click', (e) => { const b = e.target.closest('[data-wdel]'); if (!b) return; const w = S.food.weights.find((x) => x.id === b.dataset.wdel); const idx = S.food.weights.indexOf(w); closeSheet(); removeWithUndo('Запись веса удалена', () => S.food.weights.splice(idx, 1), () => S.food.weights.splice(idx, 0, w)); });
  });
}
ACT['add-food'] = (el) => foodSearchSheet((el && el.dataset.meal) || mealByTime());
ACT['food-entry'] = (el) => { const e = S.food.entries.find((x) => x.id === el.dataset.id); if (!e) return; const f = { key: e.key, name: e.name, kcal: e.kcal100, p: e.p100, f: e.f100, c: e.c100, portion: e.grams, unit: '', unitG: 0, ...(findFood(e.key) || {}) }; f.kcal = e.kcal100; f.p = e.p100; f.f = e.f100; f.c = e.c100; portionSheet({ food: f, meal: e.meal, entry: e }); };
ACT['food-day'] = (el) => { const d = addDays(toDate(foodDay()), +el.dataset.dir); if (isoOf(d) <= todayISO()) { ui.foodDate = isoOf(d); render('anim-fade'); } };
ACT['food-goto'] = (el) => { ui.foodDate = el.dataset.d; render(); };
ACT['food-goals'] = () => goalsSheet();
ACT.water = (el) => { const d = foodDay(); const n = +el.dataset.n; S.food.water[d] = (S.food.water[d] || 0) === n ? n - 1 : n; save(); render(); };
ACT['add-weight'] = () => weightSheet();
ACT.weights = () => weightsSheet();

/* ================= Тренировки ================= */
const FIELDS = {
  w: [['w', 'кг', 2.5, 1], ['r', 'повт.', 1, 0]],
  bw: [['r', 'повт.', 1, 0], ['w', '+кг', 2.5, 1]],
  time: [['t', 'сек', 5, 0]],
  cardio: [['min', 'мин', 1, 0], ['km', 'км', 0.5, 1]],
  rounds: [['rounds', 'раунды', 1, 0], ['rmin', 'мин', 0.5, 1]]
};
const TYPE_NAME = { w: 'С весом', bw: 'Свой вес', time: 'На время', cardio: 'Кардио', rounds: 'Раунды' };
const BUILTIN_PROGRAMS = [
  { id: 'b:bar', name: 'Пробежка и турник', items: ['Бег', 'Подтягивания', 'Отжимания на брусьях', 'Подъём ног в висе', 'Отжимания от пола'] },
  { id: 'b:box', name: 'Бокс', items: ['Скакалка', 'Бой с тенью', 'Работа на мешке', 'Отжимания на кулаках', 'Планка'] },
  { id: 'b:home', name: 'Всё тело без зала', items: ['Отжимания от пола', 'Приседания без веса', 'Выпады', 'Берпи', 'Планка'] },
  { id: 'b:up', name: 'Зал: верх', items: ['Жим штанги лёжа', 'Тяга верхнего блока', 'Жим гантелей сидя', 'Подъём штанги на бицепс', 'Французский жим'] },
  { id: 'b:low', name: 'Зал: ноги и пресс', items: ['Приседания со штангой', 'Румынская тяга', 'Жим ногами', 'Подъём на носки', 'Скручивания'] }
].map((p) => ({ ...p, items: p.items.map((n) => 'ex:' + n) }));
const allEx = () => S.myExercises.map((e) => ({ ...e, id: 'my:' + e.id, tags: normq(e.name + ' мои ' + (e.group || '')), mine: true })).concat(EX_DB);
const exById = (id) => allEx().find((e) => e.id === id);
const pad2 = (n) => String(n).padStart(2, '0');
const fmtDur = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h}:${pad2(m)}:${pad2(s % 60)}` : `${pad2(m)}:${pad2(s % 60)}`; };
const fmtMin = (min) => { min = Math.round(min); return min >= 60 ? `${Math.floor(min / 60)} ч ${min % 60} мин` : `${min} мин`; };
function defaultSet(ex) {
  return { w: { w: 20, r: 10 }, bw: { r: 10, w: 0 }, time: { t: 30 }, cardio: { min: 30, km: /Бег|бег/.test(ex.name) ? 5 : 0 }, rounds: { rounds: 3, rmin: 3 } }[ex.type];
}
function lastSetsFor(exId) {
  const ws = [...S.workouts].sort((a, b) => b.start - a.start);
  for (const w of ws) { const it = w.items.find((x) => x.exId === exId); if (it && it.sets.length) return it.sets.map((s) => ({ ...s, done: false })); }
  return null;
}
function makeItem(ex) {
  const last = lastSetsFor(ex.id);
  const n = ex.type === 'cardio' || ex.type === 'rounds' ? 1 : 3;
  return { exId: ex.id, name: ex.name, type: ex.type, met: ex.met, sets: last || Array.from({ length: n }, () => ({ ...defaultSet(ex), done: false })) };
}
function setSummary(it) {
  const s = it.sets.filter((x) => x.done).length ? it.sets.filter((x) => x.done) : it.sets;
  if (it.type === 'w') return s.map((x) => `${fmtG(x.w)}×${x.r}`).join(', ') + ' кг';
  if (it.type === 'bw') return s.map((x) => x.r + (x.w ? `(+${fmtG(x.w)})` : '')).join(', ') + ' повт.';
  if (it.type === 'time') return s.map((x) => x.t + ' с').join(', ');
  if (it.type === 'cardio') { const m = s.reduce((a, x) => a + (x.min || 0), 0), k = s.reduce((a, x) => a + (x.km || 0), 0); return `${fmtMin(m)}${k ? ', ' + fmtG(k) + ' км' : ''}`; }
  return s.map((x) => `${x.rounds}×${fmtG(x.rmin)} мин`).join(', ');
}
function workoutCalc(w, durMin) {
  const kg = latestWeight() || 75; let cardioMin = 0, kcal = 0, volume = 0, strength = false;
  w.items.forEach((it) => {
    const anyDone = it.sets.some((x) => x.done); const sets = anyDone ? it.sets.filter((x) => x.done) : it.sets;
    if (it.type === 'cardio') { const m = sets.reduce((a, x) => a + (x.min || 0), 0); cardioMin += m; kcal += it.met * kg * m / 60; }
    else if (it.type === 'rounds') { const m = sets.reduce((a, x) => a + (x.rounds || 0) * (x.rmin || 0), 0); cardioMin += m; kcal += it.met * kg * m / 60; }
    else { strength = true; if (it.type === 'w') volume += sets.reduce((a, x) => a + (x.w || 0) * (x.r || 0), 0); }
  });
  if (strength) kcal += 5 * kg * Math.max(0, durMin - cardioMin) / 60;
  return { kcal: Math.round(kcal), volume: Math.round(volume) };
}
function weekDays() { const n = new Date(); const dow = (n.getDay() + 6) % 7; return Array.from({ length: 7 }, (_, i) => isoOf(addDays(n, i - dow))); }
function weekStrip() {
  const days = weekDays(); const done = new Set(S.workouts.map((w) => isoOf(new Date(w.start))));
  return `<div class="wk-strip">${days.map((d) => { const dt = toDate(d); return `<span class="wk ${done.has(d) ? 'on' : ''} ${d === todayISO() ? 'today' : ''}"><i>${done.has(d) ? I.tick : dt.getDate()}</i><small>${WD_SHORT[dt.getDay()]}</small></span>`; }).join('')}</div>`;
}
RENDER.sport = function () {
  const days = weekDays(); const wk = S.workouts.filter((w) => days.includes(isoOf(new Date(w.start))));
  const min = wk.reduce((s, w) => s + (w.end - w.start) / 60000, 0), kc = wk.reduce((s, w) => s + (w.kcal || 0), 0);
  const A = S.workoutActive;
  let html = head('Тренировки', '', A ? '' : plusBtn('start-workout', 'Начать тренировку'));
  if (A) html += `<button class="card active-w" data-act="w-open"><span class="pulse"></span><span class="grow"><b>Идёт тренировка</b><span class="m">${esc(A.title)}, ${A.items.length} ${plural(A.items.length, 'упражнение', 'упражнения', 'упражнений')}</span></span><span class="w-el" data-elapsed="${A.start}">${fmtDur(Date.now() - A.start)}</span></button>`;
  html += `<div class="card"><h2>Эта неделя</h2>${weekStrip()}<div class="balance"><div><span>Тренировок</span><b>${wk.length}</b></div><div><span>Время</span><b>${fmtMin(min)}</b></div><div><span>Сожжено ≈</span><b>${nf.format(kc)} ккал</b></div></div></div>`;
  if (!A) html += `<button class="btn primary big-add" data-act="start-workout">${I.plus}Начать тренировку</button>`;
  html += `<div class="seg">${[['hist', 'История'], ['rec', 'Рекорды'], ['prog', 'Программы']].map(([k, v]) => `<button data-act="sport-sec" data-sec="${k}" class="${(ui.sportSec || 'hist') === k ? 'on' : ''}">${v}</button>`).join('')}</div>`;
  const sec2 = ui.sportSec || 'hist';
  if (sec2 === 'hist') {
    const ws = [...S.workouts].sort((a, b) => b.start - a.start);
    html += ws.length ? `<div class="list">${ws.map((w) => `<button class="row" data-act="w-view" data-id="${w.id}"><span class="sec-ic">${I.walk}</span><span class="grow"><span class="t">${esc(w.title)}</span><span class="m">${cap(relDay(new Date(w.start)))}, ${fmtMin((w.end - w.start) / 60000)}, ${w.items.length} ${plural(w.items.length, 'упражнение', 'упражнения', 'упражнений')}</span></span><span class="r">≈${nf.format(w.kcal || 0)} ккал</span></button>`).join('')}</div>`
      : `<div class="card empty"><b>Тренировок пока нет</b>Нажмите «Начать тренировку»: можно с нуля или по готовой программе — пробежка и турник, бокс, зал.</div>`;
  } else if (sec2 === 'rec') {
    const recs = computeRecords();
    html += recs.length ? `<div class="list">${recs.map((r) => `<div class="row"><span class="cat-ic">🏆</span><span class="grow"><span class="t">${esc(r.name)}</span><span class="m">${fmtD(new Date(r.date))}</span></span><span class="r amt">${r.text}</span></div>`).join('')}</div>`
      : `<div class="card empty"><b>Рекордов пока нет</b>Они появятся после первых тренировок: лучший вес, больше всего повторов, самая длинная пробежка.</div>`;
  } else {
    html += `<div class="section-label"><span>Мои программы</span></div>`;
    html += S.wTemplates.length ? `<div class="list">${S.wTemplates.map((t) => `<button class="row" data-act="prog-open" data-id="${t.id}"><span class="grow"><span class="t">${esc(t.name)}</span><span class="m">${t.items.map((id) => (exById(id) || { name: '?' }).name).join(', ')}</span></span><span class="chev">${I.right}</span></button>`).join('')}</div>`
      : '<p class="note-small">Сохраните любую тренировку как программу, и её можно будет запускать в одно касание.</p>';
    html += `<div class="section-label"><span>Готовые</span></div><div class="list">${BUILTIN_PROGRAMS.map((t) => `<button class="row" data-act="prog-start" data-id="${t.id}"><span class="grow"><span class="t">${esc(t.name)}</span><span class="m">${t.items.map((id) => (exById(id) || { name: '?' }).name).join(', ')}</span></span><span class="chev">${I.right}</span></button>`).join('')}</div>`;
  }
  if (A) ui.mounts.push(tickElapsed);
  return html;
};
function computeRecords() {
  const best = {};
  S.workouts.forEach((w) => w.items.forEach((it) => it.sets.forEach((s) => {
    if (it.sets.some((x) => x.done) && !s.done) return;
    let score = 0, text = '';
    if (it.type === 'w') { score = (s.w || 0) * 1000 + (s.r || 0); text = `${fmtG(s.w)} кг × ${s.r}`; }
    else if (it.type === 'bw') { score = (s.r || 0) * 1000 + (s.w || 0); text = `${s.r} повт.${s.w ? ' +' + fmtG(s.w) + ' кг' : ''}`; }
    else if (it.type === 'time') { score = s.t || 0; text = `${s.t} с`; }
    else if (it.type === 'cardio') { score = (s.km || 0) * 1000 + (s.min || 0); text = s.km ? `${fmtG(s.km)} км` : fmtMin(s.min || 0); }
    else { score = (s.rounds || 0) * (s.rmin || 0); text = `${s.rounds} × ${fmtG(s.rmin)} мин`; }
    if (score > 0 && (!best[it.exId] || score > best[it.exId].score)) best[it.exId] = { score, text, name: it.name, date: w.start };
  })));
  return Object.values(best).sort((a, b) => b.date - a.date);
}
let tickIv = null;
function tickElapsed() {
  clearInterval(tickIv);
  tickIv = setInterval(() => {
    const els = $$('[data-elapsed]'); if (!els.length) { clearInterval(tickIv); tickIv = null; return; }
    els.forEach((el) => { el.textContent = fmtDur(Date.now() - (+el.dataset.elapsed)); });
  }, 1000);
}
/* ---------- Идущая тренировка ---------- */
function stepper(i, j, f, val, dec) {
  return `<div class="stepper"><button type="button" data-act="st" data-i="${i}" data-j="${j}" data-f="${f}" data-d="-1" aria-label="Меньше">${I.minus}</button><input type="text" inputmode="decimal" data-sv data-i="${i}" data-j="${j}" data-f="${f}" value="${dec ? fmtG(val || 0) : (val || 0)}" aria-label="${f}"><button type="button" data-act="st" data-i="${i}" data-j="${j}" data-f="${f}" data-d="1" aria-label="Больше">${I.plus}</button></div>`;
}
DETAIL.workout = function () {
  const A = S.workoutActive; if (!A) { ui.stack.pop(); return currentHTML(); }
  const rest = S.settings.rest || 90;
  let html = `<div class="detail-top">${backBtn('Тренировки')}<button class="icon-btn" data-act="w-rename" aria-label="Переименовать">${I.edit}</button></div>
    <div class="w-head"><h1>${esc(A.title)}</h1><div class="w-timer" data-elapsed="${A.start}">${fmtDur(Date.now() - A.start)}</div></div>
    <div class="rest-pick"><span>Отдых</span>${[60, 90, 120, 180].map((s) => `<button class="chip ${rest === s ? 'on' : ''}" data-act="rest-set" data-s="${s}">${s < 120 ? s + ' с' : s / 60 + ' мин'}</button>`).join('')}</div>`;
  html += A.items.map((it, i) => {
    const fs = FIELDS[it.type]; const last = lastSetsFor(it.exId);
    return `<div class="card ex-card"><div class="ex-head"><span class="grow"><b>${esc(it.name)}</b><span class="m">${last ? 'В прошлый раз: ' + setSummary({ ...it, sets: last }) : TYPE_NAME[it.type]}</span></span><button class="act" data-act="w-ex-del" data-i="${i}" aria-label="Убрать упражнение">${I.trash}</button></div>
      <div class="sets" style="--cols:${fs.length}"><div class="set-row head"><span>№</span>${fs.map(([, l]) => `<span>${l}</span>`).join('')}<span></span></div>
      ${it.sets.map((s, j) => `<div class="set-row ${s.done ? 'done' : ''}" id="sr-${i}-${j}"><span class="n">${j + 1}</span>${fs.map(([f, , , dec]) => stepper(i, j, f, s[f], dec)).join('')}<button class="check ${s.done ? 'on' : ''}" data-act="set-done" data-i="${i}" data-j="${j}" aria-label="Подход выполнен">${s.done ? I.tick : ''}</button></div>`).join('')}</div>
      <div class="btn-row"><button class="btn sm" data-act="set-add" data-i="${i}">${I.plus}Подход</button>${it.sets.length > 1 ? `<button class="btn sm" data-act="set-del" data-i="${i}">${I.minus}Подход</button>` : ''}</div></div>`;
  }).join('');
  if (!A.items.length) html += `<div class="card empty"><b>Добавьте первое упражнение</b>Турник, бег, бокс, зал: больше 80 упражнений и свои.</div>`;
  html += `<button class="btn" data-act="w-add-ex">${I.plus}Упражнение</button>
    <button class="btn primary big-add" data-act="w-finish">${I.tick}Завершить тренировку</button>
    <button class="btn danger" type="button" data-act="ask-del">Отменить тренировку</button>
    <div class="confirm" id="delBox" hidden><p>Отменить тренировку? Записанные подходы не сохранятся.</p><div class="btn-row"><button type="button" class="btn sm" data-act="cancel-del">Продолжить</button><button type="button" class="btn sm danger" data-act="w-cancel">Отменить</button></div></div>`;
  ui.mounts.push(tickElapsed);
  return html;
};
function startWorkout(title, exIds) {
  if (S.workoutActive) { push({ type: 'workout' }); return; }
  const t = new Date();
  S.workoutActive = { id: uid(), title: title || `Тренировка ${t.getDate()} ${MONTH_GEN[t.getMonth()]}`, start: Date.now(), items: (exIds || []).map(exById).filter(Boolean).map(makeItem) };
  save(); if (ui.tab !== 'sport') { ui.tab = 'sport'; ui.stack = []; } push({ type: 'workout' });
  if (!exIds || !exIds.length) setTimeout(() => exPickSheet(), 350);
}
function startSheet() {
  openSheet('Начать тренировку', `<div class="form">
    <button class="btn primary" type="button" data-act="w-empty">${I.plus}С чистого листа</button>
    ${S.wTemplates.length ? `<div class="section-label"><span>Мои программы</span></div><div class="list">${S.wTemplates.map((t) => `<button class="row" data-act="prog-start" data-id="${t.id}"><span class="grow"><span class="t">${esc(t.name)}</span><span class="m">${t.items.length} ${plural(t.items.length, 'упражнение', 'упражнения', 'упражнений')}</span></span><span class="chev">${I.right}</span></button>`).join('')}</div>` : ''}
    <div class="section-label"><span>Готовые программы</span></div>
    <div class="list">${BUILTIN_PROGRAMS.map((t) => `<button class="row" data-act="prog-start" data-id="${t.id}"><span class="grow"><span class="t">${esc(t.name)}</span><span class="m">${t.items.map((id) => (exById(id) || { name: '?' }).name).join(', ')}</span></span><span class="chev">${I.right}</span></button>`).join('')}</div>
  </div>`);
}
function exPickSheet() {
  const st = { q: '', g: '' };
  openSheet('Упражнение', `<div class="form">
    <label class="search">${I.search}<input type="search" id="exq" placeholder="Подтягивания, бег, мешок…" autocomplete="off"></label>
    <div class="chips" id="exg">${[['', 'Все'], S.myExercises.length && ['my', 'Мои'], ...EX_GROUPS.map((g) => [g, g])].filter(Boolean).map(([id, n]) => `<button type="button" class="chip ${id === '' ? 'on' : ''}" data-g="${esc(id)}">${n}</button>`).join('')}</div>
    <div id="exres"></div>
    <button type="button" class="btn sm" id="exMine">${I.plus}Своё упражнение</button></div>`, (body) => {
    const draw = () => {
      const toks = normq(st.q).split(' ').filter(Boolean);
      const list = allEx().filter((e) => (st.g === '' || (st.g === 'my' ? e.mine : e.group === st.g)) && toks.every((t) => (normq(e.name) + ' ' + e.tags).includes(stem(t))));
      $('#exres', body).innerHTML = list.length ? `<div class="list">${list.slice(0, 80).map((e) => `<button class="row" data-ex="${esc(e.id)}"><span class="grow"><span class="t">${esc(e.name)}</span><span class="m">${esc(e.group || 'Мои')}, ${TYPE_NAME[e.type].toLowerCase()}</span></span><span class="chev">${I.plus}</span></button>`).join('')}</div>`
        : `<div class="card empty" style="padding:18px"><b>Не нашлось</b>Добавьте своё упражнение.</div>`;
    };
    $('#exq', body).addEventListener('input', (e) => { st.q = e.target.value; draw(); });
    $('#exg', body).addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (!b) return; st.g = b.dataset.g; $$('#exg .chip', body).forEach((x) => x.classList.toggle('on', x === b)); draw(); });
    $('#exres', body).addEventListener('click', (e) => { const b = e.target.closest('[data-ex]'); if (!b) return; addExercise(b.dataset.ex); });
    $('#exMine', body).onclick = () => myExSheet(st.q);
    draw(); setTimeout(() => { const i = $('#exq', body); if (i) i.focus(); }, 320);
  });
}
function addExercise(id) {
  const ex = exById(id); if (!ex || !S.workoutActive) return;
  S.workoutActive.items.push(makeItem(ex)); save(); closeSheet(); render();
  setTimeout(() => { const cards = $$('.ex-card'); const c = cards[cards.length - 1]; if (c) c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
  toast(`${ex.name}: добавлено`);
}
function myExSheet(name) {
  let type = 'bw';
  openSheet('Своё упражнение', `<form id="f" class="form">
    <label class="field"><span>Название</span><input type="text" id="meName" value="${esc(name || '')}" maxlength="60" placeholder="Например, подтягивания с утяжелением"></label>
    <div class="field"><span>Как считать</span><div class="seg col" id="meType">${Object.entries(TYPE_NAME).map(([k, v]) => `<button type="button" data-v="${k}" class="${type === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <div class="sticky-save"><button class="btn primary" type="submit">Добавить</button></div></form>`, (body) => {
    $('#meType', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; type = b.dataset.v; $$('#meType button', body).forEach((x) => x.classList.toggle('on', x === b)); });
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault(); const n = $('#meName', body).value.trim(); if (!n) { toast('Напишите название'); return; }
      const ex = { id: uid(), name: n, type, met: type === 'cardio' ? 7 : type === 'rounds' ? 7 : 5, group: 'Мои' }; S.myExercises.push(ex); save();
      addExercise('my:' + ex.id);
    });
  }, { back: () => exPickSheet() });
}
/* Таймер отдыха */
const REST = { until: 0, iv: null, ac: null };
function beep() {
  try {
    if (!REST.ac) return; const ctx = REST.ac;
    [0, 0.25].forEach((t) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(0.0001, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.18); o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.2); });
  } catch (e) { /* без звука */ }
}
function startRest(sec) {
  try { if (!REST.ac) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) REST.ac = new AC(); } else if (REST.ac.state === 'suspended') REST.ac.resume(); } catch (e) { /* без звука */ }
  REST.until = Date.now() + sec * 1000; const el = $('#rest'); el.hidden = false; requestAnimationFrame(() => el.classList.add('show'));
  clearInterval(REST.iv); const tick = () => {
    const left = REST.until - Date.now();
    if (left <= 0) { stopRest(); beep(); toast('Отдых закончен. Следующий подход'); notifyNow('Life: отдых закончен', 'Пора на следующий подход'); return; }
    $('#restT').textContent = fmtDur(left + 999);
  }; tick(); REST.iv = setInterval(tick, 250);
}
function stopRest() { clearInterval(REST.iv); REST.iv = null; const el = $('#rest'); el.classList.remove('show'); setTimeout(() => { if (!REST.iv) el.hidden = true; }, 220); }
/* Завершение */
function finishSheet() {
  const A = S.workoutActive; if (!A) return;
  if (!A.items.length) { toast('Добавьте хотя бы одно упражнение или отмените тренировку'); return; }
  const dur = (Date.now() - A.start) / 60000; const c = workoutCalc(A, dur);
  openSheet('Тренировка завершена', `<form id="f" class="form">
    <div class="balance" style="margin:0;border:0;padding:0"><div><span>Время</span><b>${fmtMin(dur)}</b></div><div><span>Упражнений</span><b>${A.items.length}</b></div><div><span>Сожжено ≈</span><b>${nf.format(c.kcal)} ккал</b></div></div>
    ${c.volume ? `<p class="note-small" style="margin:0">Поднято за тренировку: ${nf.format(c.volume)} кг</p>` : ''}
    <label class="field"><span>Название</span><input type="text" id="wfName" value="${esc(A.title)}" maxlength="60"></label>
    <div class="switch-row"><span>Сохранить как программу</span><label class="switch"><input type="checkbox" id="wfTpl"><i></i></label></div>
    <p class="note-small" style="margin:0">Калории — оценка по весу тела ${nf1.format(latestWeight() || 75)} кг. Укажите свой вес в «Питании», чтобы было точнее.</p>
    <div class="sticky-save"><button class="btn primary" type="submit">Сохранить тренировку</button></div></form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const before = new Map(computeRecords().map((r) => [r.name, r.text]));
      const w = { id: A.id, title: $('#wfName', body).value.trim() || A.title, start: A.start, end: Date.now(), items: A.items, kcal: c.kcal, volume: c.volume };
      S.workouts.push(w);
      if ($('#wfTpl', body).checked) S.wTemplates.push({ id: uid(), name: w.title, items: w.items.map((x) => x.exId) });
      S.workoutActive = null; stopRest(); save(); closeSheet(); ui.stack = []; ui.sportSec = 'hist'; render('anim-back');
      const recs = computeRecords().filter((r) => before.get(r.name) !== r.text && isoOf(new Date(r.date)) === isoOf(new Date(w.start)));
      toast(recs.length ? `Новый рекорд: ${recs[0].name}, ${recs[0].text}` : `Тренировка сохранена, ≈${nf.format(c.kcal)} ккал`);
    });
  });
}
DETAIL.wview = function (d) {
  const w = S.workouts.find((x) => x.id === d.id); if (!w) { ui.stack.pop(); return currentHTML(); }
  return `<div class="detail-top">${backBtn('Тренировки')}<button class="icon-btn" data-act="w-hdel" data-id="${w.id}" aria-label="Удалить тренировку" style="color:var(--bad)">${I.trash}</button></div>
    ${head(esc(w.title), `${cap(fmtD(new Date(w.start), { weekday: 'long', day: 'numeric', month: 'long' }))}, ${fmtT(new Date(w.start))}`, '')}
    <div class="card"><div class="balance" style="margin:0;border:0;padding:0"><div><span>Время</span><b>${fmtMin((w.end - w.start) / 60000)}</b></div><div><span>Упражнений</span><b>${w.items.length}</b></div><div><span>Сожжено ≈</span><b>${nf.format(w.kcal || 0)} ккал</b></div></div></div>
    <div class="list">${w.items.map((it) => `<div class="row"><span class="grow"><span class="t">${esc(it.name)}</span><span class="m">${setSummary(it)}</span></span></div>`).join('')}</div>
    <div class="btn-row"><button class="btn primary" data-act="w-repeat" data-id="${w.id}">Повторить</button><button class="btn" data-act="w-totpl" data-id="${w.id}">В программы</button></div>`;
};
ACT['start-workout'] = () => { if (S.workoutActive) { if (ui.tab !== 'sport') { ui.tab = 'sport'; ui.stack = []; } push({ type: 'workout' }); } else startSheet(); };
ACT['w-empty'] = () => { closeSheet(); startWorkout(); };
ACT['w-open'] = () => push({ type: 'workout' });
ACT['prog-start'] = (el) => { const t = BUILTIN_PROGRAMS.find((x) => x.id === el.dataset.id) || S.wTemplates.find((x) => x.id === el.dataset.id); if (!t) return; closeSheet(); startWorkout(t.name, t.items); };
ACT['prog-open'] = (el) => {
  const t = S.wTemplates.find((x) => x.id === el.dataset.id); if (!t) return;
  openSheet(t.name, `<div class="form"><div class="list">${t.items.map((id) => `<div class="row"><span class="grow"><span class="t">${esc((exById(id) || { name: '?' }).name)}</span></span></div>`).join('')}</div>
    <label class="field"><span>Название</span><input type="text" id="tName" value="${esc(t.name)}" maxlength="60"></label>
    <button class="btn danger" type="button" id="tDel">${I.trash}Удалить программу</button>
    <div class="sticky-save two-btn"><button class="btn" type="button" id="tSave">Сохранить</button><button class="btn primary" type="button" id="tGo">Начать</button></div></div>`, (body) => {
    $('#tSave', body).onclick = () => { t.name = $('#tName', body).value.trim() || t.name; save(); closeSheet(); render(); toast('Программа сохранена'); };
    $('#tGo', body).onclick = () => { closeSheet(); startWorkout(t.name, t.items); };
    $('#tDel', body).onclick = () => { const idx = S.wTemplates.indexOf(t); closeSheet(); removeWithUndo('Программа удалена', () => S.wTemplates.splice(idx, 1), () => S.wTemplates.splice(idx, 0, t)); };
  });
};
ACT['sport-sec'] = (el) => { ui.sportSec = el.dataset.sec; render(); };
ACT['w-add-ex'] = () => exPickSheet();
ACT['w-rename'] = () => {
  const A = S.workoutActive; if (!A) return;
  openSheet('Название', `<form id="f" class="form"><input type="text" id="wn" value="${esc(A.title)}" maxlength="60"><button class="btn primary" type="submit">Сохранить</button></form>`, (body) => {
    $('#f', body).addEventListener('submit', (e) => { e.preventDefault(); A.title = $('#wn', body).value.trim() || A.title; save(); closeSheet(); render(); });
    setTimeout(() => $('#wn', body).select(), 320);
  });
};
ACT['w-ex-del'] = (el) => { const A = S.workoutActive; const i = +el.dataset.i; const it = A.items[i]; removeWithUndo(`${it.name}: убрано`, () => A.items.splice(i, 1), () => A.items.splice(i, 0, it)); };
ACT['set-add'] = (el) => { const it = S.workoutActive.items[+el.dataset.i]; const last = it.sets[it.sets.length - 1]; it.sets.push({ ...(last || defaultSet(it)), done: false }); save(); render(); };
ACT['set-del'] = (el) => { const it = S.workoutActive.items[+el.dataset.i]; if (it.sets.length > 1) { it.sets.pop(); save(); render(); } };
ACT.st = (el) => {
  const A = S.workoutActive; if (!A) return; const it = A.items[+el.dataset.i]; const s = it.sets[+el.dataset.j]; const f = el.dataset.f;
  const def = FIELDS[it.type].find((x) => x[0] === f); const v = Math.max(0, Math.round(((s[f] || 0) + def[2] * (+el.dataset.d)) * 10) / 10);
  s[f] = v; save(); const inp = el.parentElement.querySelector('input'); if (inp) inp.value = def[3] ? fmtG(v) : v;
};
ACT['set-done'] = (el) => {
  const A = S.workoutActive; if (!A) return; const s = A.items[+el.dataset.i].sets[+el.dataset.j];
  s.done = !s.done; save();
  el.classList.toggle('on', s.done); el.innerHTML = s.done ? I.tick : ''; const row = $(`#sr-${el.dataset.i}-${el.dataset.j}`); if (row) row.classList.toggle('done', s.done);
  if (s.done && !['cardio', 'rounds'].includes(A.items[+el.dataset.i].type)) startRest(S.settings.rest || 90);
};
ACT['rest-set'] = (el) => { S.settings.rest = +el.dataset.s; save(); render(); };
ACT['w-finish'] = () => finishSheet();
ACT['w-cancel'] = () => { S.workoutActive = null; stopRest(); save(); ui.stack = []; render('anim-back'); toast('Тренировка отменена'); };
ACT['w-view'] = (el) => push({ type: 'wview', id: el.dataset.id });
ACT['w-repeat'] = (el) => { const w = S.workouts.find((x) => x.id === el.dataset.id); if (!w) return; ui.stack = []; startWorkout(w.title, w.items.map((x) => x.exId)); };
ACT['w-totpl'] = (el) => { const w = S.workouts.find((x) => x.id === el.dataset.id); if (!w) return; S.wTemplates.push({ id: uid(), name: w.title, items: w.items.map((x) => x.exId) }); save(); toast('Добавлено в «Программы»'); };
ACT['w-hdel'] = (el) => { const w = S.workouts.find((x) => x.id === el.dataset.id); if (!w) return; const idx = S.workouts.indexOf(w); ui.stack.pop(); removeWithUndo('Тренировка удалена', () => S.workouts.splice(idx, 1), () => S.workouts.splice(idx, 0, w)); };

/* ================= Настройки ================= */
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
DETAIL.settings = function () {
  const st = S.settings;
  const icons = ui.iconUrls || ['icons/apple-touch-icon.png', 'icons/apple-touch-icon.png', 'icons/apple-touch-icon.png'];
  ui.mounts.push(async () => { const arr = await Promise.all(['light', 'dark', 'accent'].map(iconVariant)); ui.iconUrls = arr; $$('#iconCh img').forEach((im, i) => { im.src = arr[i]; }); });
  const on = sectionsOn().map((id) => SECTION_DEFS[id].name);
  return `<div class="detail-top">${backBtn('Главная')}</div>${head('Настройки', '', '')}
    <div class="list">
      <button class="row big" data-act="settings-sections"><span class="sec-ic">${I.more}</span><span class="grow"><span class="t">Разделы и функции</span><span class="m">${on.length ? on.join(', ') : 'все выключены'}</span></span><span class="chev">${I.right}</span></button>
      <button class="row big" data-act="settings-home"><span class="sec-ic">${I.home}</span><span class="grow"><span class="t">Главный экран</span><span class="m">Быстрые кнопки и виджеты</span></span><span class="chev">${I.right}</span></button>
      <button class="row big" data-act="settings-lock"><span class="sec-ic">${I.lock}</span><span class="grow"><span class="t">Код-пароль</span><span class="m">${st.pin ? 'Включён' : 'Выключен'}</span></span><span class="chev">${I.right}</span></button>
      <button class="row big" data-act="install-help"><span class="sec-ic">${I.down}</span><span class="grow"><span class="t">Установить на экран «Домой»</span><span class="m">${isStandalone() ? 'Life уже установлен' : 'Пошаговая инструкция для iPhone'}</span></span><span class="chev">${I.right}</span></button>
    </div>
    <label class="field"><span>Как к вам обращаться</span><input type="text" id="setName" value="${esc(st.name)}" maxlength="30" placeholder="Имя"></label>
    <div class="field"><span>Тема</span><div class="seg" id="themeSeg">${[['auto', 'Как в iPhone'], ['light', 'Светлая'], ['dark', 'Тёмная']].map(([k, v]) => `<button type="button" data-set="theme" data-v="${k}" class="${st.theme === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <div class="field"><span>Акцентный цвет</span><div class="swatches">${ACCENTS.map((a) => `<button type="button" class="swatch ${st.accent === a.id ? 'on' : ''}" data-set="accent" data-v="${a.id}" style="background:${a.c}" aria-label="${a.name}"></button>`).join('')}</div></div>
    <div class="field"><span>Фон главного экрана</span><div class="seg">${[['plain', 'Чистый'], ['dots', 'Точки'], ['glow', 'Свечение']].map(([k, v]) => `<button type="button" data-set="wallpaper" data-v="${k}" class="${st.wallpaper === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <div class="field"><span>Иконка приложения</span><div class="icon-choices" id="iconCh">${[['light', 'Светлая'], ['dark', 'Тёмная'], ['accent', 'Цветная']].map(([k, v], i) => `<button type="button" class="icon-choice ${st.icon === k ? 'on' : ''}" data-set="icon" data-v="${k}"><img src="${icons[i]}" alt="">${v}</button>`).join('')}</div>
      <p class="note-small" style="margin:0">Выберите вариант до того, как добавите Life на экран «Домой». Чтобы сменить потом, удалите значок и добавьте заново, данные останутся.</p></div>
    <div class="field"><span>Резервная копия</span><div class="btn-row"><button type="button" class="btn sm" data-act="export">Сохранить копию</button><button type="button" class="btn sm" data-act="import">Восстановить</button></div>
      <input type="file" id="impFile" accept="application/json,.json" hidden>
      <p class="note-small" style="margin:0">Данные и фото хранятся только на этом телефоне. Сохраняйте копию в «Файлы» хотя бы раз в месяц.</p></div>
    <div class="field"><span>Сброс</span><button class="btn danger" type="button" data-act="ask-del">Стереть данные</button>
      <div class="confirm" id="delBox" hidden><p>Что стереть? Восстановить можно только из резервной копии.</p>
        <button type="button" class="btn sm danger" data-act="wipe" data-keep="1">Записи и фото, машину и объекты оставить</button>
        <button type="button" class="btn sm danger" data-act="wipe">Всё полностью</button>
        <button type="button" class="btn sm" data-act="cancel-del">Отмена</button></div></div>
    <p class="note-small" style="text-align:center">Life, версия ${LIFE_VERSION}</p>`;
};
DETAIL.sections = function () {
  const st = S.settings; const order = st.order;
  const slots = tabSlots().filter((x) => x !== 'more');
  return `<div class="detail-top">${backBtn('Настройки')}</div>${head('Разделы и функции', 'Включите нужное. Порядок задаёт нижнюю панель.', '')}
    <div class="sec-list">${order.map((id, i) => {
      const d = SECTION_DEFS[id]; const on = st.sections[id]; const feats = Object.entries(FEATURE_DEFS).filter(([, f]) => f.sec === id);
      const where = !on ? '' : slots.includes(id) ? '<span class="where">в панели</span>' : '<span class="where">в «Ещё»</span>';
      return `<div class="sec-card ${on ? 'on' : ''}"><div class="sec-main"><span class="sec-ic">${I[d.icon]}</span><span class="grow"><span class="t">${d.name}${where}</span><span class="m">${d.desc}</span></span>
        <button type="button" class="mv" data-act="sec-move" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Выше">${I.up}</button>
        <button type="button" class="mv" data-act="sec-move" data-i="${i}" data-dir="1" ${i === order.length - 1 ? 'disabled' : ''} aria-label="Ниже">${I.down}</button>
        <label class="switch"><input type="checkbox" data-sec-toggle="${id}" ${on ? 'checked' : ''} aria-label="${d.name}"><i></i></label></div>
        ${on && feats.length ? `<div class="sec-feats">${feats.map(([fid, f]) => `<label class="feat"><input type="checkbox" data-feat-toggle="${fid}" ${st.features[fid] ? 'checked' : ''}><span>${f.name}</span></label>`).join('')}</div>` : ''}</div>`;
    }).join('')}</div>
    <p class="note-small">В нижней панели помещаются Главная и ещё 4 раздела. Если включено больше, первые три стоят в панели, остальные открываются кнопкой «Ещё».</p>`;
};
DETAIL.homecfg = function () {
  const st = S.settings;
  const qs = Object.keys(QUICK_DEFS).filter(quickAvailable);
  const ws = st.widgets.filter((w) => widgetAvailable(w.id));
  return `<div class="detail-top">${backBtn('Настройки')}</div>${head('Главный экран', '', '')}
    <div class="field"><span>Быстрые кнопки, до 5 штук (выбрано ${st.quick.filter(quickAvailable).length})</span>
      <div class="quick-pick">${qs.map((q) => { const on = st.quick.includes(q); return `<button type="button" class="qp ${on ? 'on' : ''}" data-act="quick-toggle" data-q="${q}"><span class="ic">${I[QUICK_DEFS[q].icon]}</span>${QUICK_DEFS[q].name}${on ? `<span class="n">${st.quick.filter(quickAvailable).indexOf(q) + 1}</span>` : ''}</button>`; }).join('')}</div></div>
    <div class="field"><span>Виджеты: порядок и показ</span><div class="wid-list">${ws.map((w) => { const i = st.widgets.indexOf(w); return `<div class="wid-row"><span class="grow">${WIDGETS[w.id].name}</span>
      <button type="button" class="mv" data-act="wid-move" data-i="${i}" data-dir="-1" aria-label="Выше">${I.up}</button>
      <button type="button" class="mv" data-act="wid-move" data-i="${i}" data-dir="1" aria-label="Ниже">${I.down}</button>
      <label class="switch" style="margin-left:6px"><input type="checkbox" data-wid="${w.id}" ${w.on ? 'checked' : ''} aria-label="${WIDGETS[w.id].name}"><i></i></label></div>`; }).join('')}</div></div>`;
};
DETAIL.lockcfg = function () {
  const st = S.settings;
  return `<div class="detail-top">${backBtn('Настройки')}</div>${head('Код-пароль', '', '')}
    <div class="card"><p style="margin:0">Код из 4 цифр закрывает Life от посторонних глаз, если телефон окажется в чужих руках. Данные остаются на телефоне.</p></div>
    ${st.pin ? `<div class="field"><span>Блокировать после выхода из Life</span><div class="seg">${[[0, 'Сразу'], [1, 'Через 1 мин'], [5, 'Через 5 мин']].map(([k, v]) => `<button type="button" data-set="lockAfter" data-v="${k}" class="${st.lockAfter === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
      <div class="btn-row"><button class="btn" data-act="pin-change">Сменить код</button><button class="btn danger" data-act="pin-off">Выключить</button></div>`
    : `<button class="btn primary" data-act="pin-on">${I.lock}Включить код-пароль</button>`}
    <p class="note-small">Если забудете код, вход останется только через сброс всех данных. Держите резервную копию.</p>`;
};
function installSheet() {
  const ios = isIOS();
  openSheet('Установить Life', `<div class="form">
    ${isStandalone() ? `<div class="banner"><div class="grow"><b>Life уже установлен</b>Вы открыли его с экрана «Домой».</div></div>` : ''}
    <ol class="steps">
      <li><b>Откройте Life в Safari.</b> Именно в Safari, не во встроенном браузере Telegram, почты или Claude: там пункта «На экран „Домой“» нет.</li>
      <li><b>Нажмите «…» справа от адресной строки, затем «Поделиться».</b> В iOS 17 и раньше это сразу кнопка «Поделиться» внизу экрана.</li>
      <li><b>Пролистайте вниз и выберите «На экран „Домой“».</b></li>
      <li><b>Оставьте включённым «Открывать как веб-приложение»</b> и нажмите «Добавить».</li>
      <li><b>Открывайте Life с иконки.</b> Он запустится без адресной строки и будет работать без интернета.</li>
    </ol>
    ${!ios ? '<p class="note-small" style="margin:0">Сейчас Life открыт не на iPhone. На компьютере в Chrome можно установить его через значок установки в адресной строке.</p>' : ''}
    <p class="note-small" style="margin:0">Иконку выберите заранее в настройках: светлая, тёмная или цветная.</p>
    <button class="btn primary" type="button" data-act="close-sheet">Понятно</button></div>`);
}
/* Резервная копия вместе с фото */
const blobToDataURL = (b) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => res(null); r.readAsDataURL(b); });
async function exportData() {
  save(); toast('Готовлю копию…');
  const photos = {}; try { (await phAll() || []).forEach((p) => { photos[p.id] = p.full; }); } catch (e) { /* без фото */ }
  const out = { life: S, photos: {} };
  for (const [id, b] of Object.entries(photos)) { const u = await blobToDataURL(b); if (u) out.photos[id] = u; }
  const name = `life-копия-${todayISO()}.json`;
  const file = new File([JSON.stringify(out)], name, { type: 'application/json' });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Резервная копия Life' }); toast('Копия сохранена'); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(file); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
  toast('Копия сохранена');
}
async function importData(f) {
  if (!f) return;
  let data; try { data = JSON.parse(await f.text()); } catch (e) { toast('Это не резервная копия Life. Выберите файл life-копия-….json'); return; }
  const st = data && data.life ? data.life : data;
  if (!st || !st.v || !st.settings) { toast('Это не резервная копия Life. Выберите файл life-копия-….json'); return; }
  toast('Восстанавливаю…');
  for (const [id, u] of Object.entries(data.photos || {})) {
    try { const full = await (await fetch(u)).blob(); const thumb = await scaleImage(full, 360, 0.75); await phPut({ id, full, thumb, created: Date.now() }); } catch (e) { /* пропускаем битое фото */ }
  }
  S = normalize(st); S.settings.onboarded = true; delete S.settings.freshOffer; save(); applyTheme(); applyIcon(); ui.stack = []; render('anim-fade'); toast('Данные восстановлены');
}
ACT.settings = () => push({ type: 'settings' });
ACT['settings-sections'] = () => { if (sheetOpen) closeSheet(); if (ui.stack.length && ui.stack[ui.stack.length - 1].type === 'sections') return; if (!ui.stack.length || ui.stack[0].type !== 'settings') { ui.tab = 'home'; ui.stack = [{ type: 'settings' }]; } push({ type: 'sections' }); };
ACT['settings-home'] = () => push({ type: 'homecfg' });
ACT['settings-lock'] = () => push({ type: 'lockcfg' });
ACT['install-help'] = () => installSheet();
ACT['sec-move'] = (el) => { const o = S.settings.order; const i = +el.dataset.i, j = i + (+el.dataset.dir); if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; save(); render(); };
ACT['wid-move'] = (el) => {
  const w = S.settings.widgets; const avail = w.filter((x) => widgetAvailable(x.id)); const i = avail.indexOf(w[+el.dataset.i]); const j = i + (+el.dataset.dir);
  if (j < 0 || j >= avail.length) return; const a = w.indexOf(avail[i]), b = w.indexOf(avail[j]); [w[a], w[b]] = [w[b], w[a]]; save(); render();
};
ACT['quick-toggle'] = (el) => {
  const q = el.dataset.q; const list = S.settings.quick.filter(quickAvailable);
  if (S.settings.quick.includes(q)) S.settings.quick = S.settings.quick.filter((x) => x !== q);
  else { if (list.length >= 5) { toast('Можно выбрать до 5 кнопок. Сначала уберите одну.'); return; } S.settings.quick.push(q); }
  save(); render();
};
ACT.export = () => exportData();
ACT.import = () => { const i = $('#impFile'); if (i) i.click(); };
ACT['pin-on'] = () => showLock('set', () => render(), true);
ACT['pin-change'] = () => showLock('unlock', () => setTimeout(() => showLock('set', () => render(), true), 280), true);
ACT['pin-off'] = () => showLock('unlock', () => { S.settings.pin = null; save(); render(); toast('Код-пароль выключен'); }, true);

function installBanner() {
  if (window.LIFE_PREVIEW || !isIOS() || isStandalone() || S.settings.installDismissed) return '';
  return `<div class="banner"><div class="grow"><b>Установите Life на экран «Домой»</b>Так он откроется как приложение и будет работать без интернета.</div><div class="banner-acts"><button class="btn sm primary" data-act="install-help">Как</button><button class="icon-btn sm" data-act="install-dismiss" aria-label="Скрыть">${I.close}</button></div></div>`;
}
ACT['install-dismiss'] = () => { S.settings.installDismissed = true; save(); render(); };

ACT.wipe = (el) => { const keep = !!el.dataset.keep; wipeAll(keep).then(() => { ui.stack = []; applyTheme(); render('anim-back'); toast(keep ? 'Записи стёрты, машина и объекты остались' : 'Все данные стёрты'); }); };

/* ================= Первый запуск ================= */
function showWelcome(mode) {
  const w = $('#welcome'); const st = S.settings;
  const secsHTML = () => S.settings.order.map((id) => { const d = SECTION_DEFS[id]; const on = st.sections[id]; return `<button type="button" class="wl-sec ${on ? 'on' : ''}" data-wsec="${id}"><span class="sec-ic">${I[d.icon]}</span><span class="t">${d.name}</span><span class="m">${d.desc}</span><span class="wl-tick">${I.tick}</span></button>`; }).join('');
  if (mode === 'offer') {
    w.innerHTML = `<div class="wl-in"><img data-logo src="icons/logo.png" alt=""><h2>Начать с чистого листа?</h2>
      <p>Сейчас в Life примеры и тестовые записи. Можно стереть их и начать вести свои.</p>
      <label class="feat wl-keep"><input type="checkbox" id="wlKeep" checked><span>Оставить машину и объекты с подрядчиками</span></label>
      <button class="btn primary" type="button" id="wlWipe">Стереть и начать</button>
      <button class="btn ghost" type="button" id="wlKeepAll">Оставить как есть</button></div>`;
    $('#wlWipe', w).onclick = async () => { await wipeAll($('#wlKeep', w).checked); applyTheme(); render(); showWelcome('setup'); };
    $('#wlKeepAll', w).onclick = () => { st.onboarded = true; delete st.freshOffer; save(); hideWelcome(); };
  } else {
    w.innerHTML = `<div class="wl-in"><img data-logo src="icons/logo.png" alt=""><h2>Добро пожаловать в Life</h2>
      <p>Всё хранится только на этом телефоне. Настроить можно потом в любой момент.</p>
      <label class="field"><span>Как к вам обращаться</span><input type="text" id="wlName" value="${esc(st.name)}" placeholder="Имя" maxlength="30" autocomplete="given-name"></label>
      <div class="field"><span>Что будете вести</span><div class="wl-secs" id="wlSecs">${secsHTML()}</div></div>
      <label class="field" id="wlCarF" ${st.sections.car ? '' : 'hidden'}><span>Ваша машина, если есть</span><input type="text" id="wlCar" value="${esc(S.car.name)}" placeholder="Например, Toyota Corolla" maxlength="60"></label>
      <button class="btn primary" type="button" id="wlGo">Начать</button></div>`;
    $('#wlSecs', w).onclick = (e) => { const b = e.target.closest('[data-wsec]'); if (!b) return; const id = b.dataset.wsec; st.sections[id] = !st.sections[id]; b.classList.toggle('on', st.sections[id]); $('#wlCarF', w).hidden = !st.sections.car; };
    $('#wlGo', w).onclick = () => {
      if (!Object.values(st.sections).some(Boolean)) { toast('Выберите хотя бы один раздел'); return; }
      st.name = $('#wlName', w).value.trim(); const car = $('#wlCar', w).value.trim(); if (car) S.car.name = car;
      st.onboarded = true; delete st.freshOffer; save(); ui.stack = []; ui.tab = 'home'; hideWelcome(); render('anim-fade');
      toast(st.name ? `Готово, ${st.name}. Life ваш` : 'Готово. Life ваш');
    };
  }
  w.hidden = false; applyIcon(); requestAnimationFrame(() => w.classList.add('show'));
}
function hideWelcome() { const w = $('#welcome'); w.classList.remove('show'); setTimeout(() => { w.hidden = true; w.innerHTML = ''; }, 250); }

/* ================= События ================= */
ACT.tab = (el) => go(el.dataset.tab);
ACT.more = () => moreSheet();
ACT.back = () => back();
ACT['close-sheet'] = () => closeSheet();
ACT['ask-del'] = (el) => { const scope = el.parentElement; const b = $('#delBox', scope) || $('#delBox'); if (b) { b.hidden = false; el.hidden = true; b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } };
ACT['cancel-del'] = (el) => { const b = el.closest('#delBox'); if (!b) return; b.hidden = true; const a = b.parentElement.querySelector('[data-act="ask-del"]'); if (a) a.hidden = false; };

document.addEventListener('click', (e) => {
  const setEl = e.target.closest('[data-set]');
  if (setEl) {
    const k = setEl.dataset.set; let v = setEl.dataset.v; if (k === 'lockAfter') v = +v;
    S.settings[k] = v; save();
    if (k === 'theme' || k === 'accent' || k === 'wallpaper') applyTheme();
    if (k === 'accent' || k === 'icon') { applyIcon(); ui.iconUrls = null; }
    render(); return;
  }
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.closest('#sheetBody') && el.closest('form') && el.tagName === 'BUTTON' && el.type === 'submit') return;
  const fn = ACT[el.dataset.act]; if (!fn) return;
  e.preventDefault(); fn(el);
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.matches('[data-sec-toggle]')) {
    S.settings.sections[t.dataset.secToggle] = t.checked; save(); render();
    toast(t.checked ? `Раздел «${SECTION_DEFS[t.dataset.secToggle].name}» включён` : `Раздел «${SECTION_DEFS[t.dataset.secToggle].name}» скрыт. Данные сохранены.`); return;
  }
  if (t.matches('[data-feat-toggle]')) { S.settings.features[t.dataset.featToggle] = t.checked; save(); render(); return; }
  if (t.matches('[data-wid]')) { const w = S.settings.widgets.find((x) => x.id === t.dataset.wid); if (w) { w.on = t.checked; save(); render(); } return; }
  if (t.id === 'impFile') { importData(t.files[0]); t.value = ''; return; }
  if (t.id === 'remCtr') { ui.remContractor = t.value; refreshRemList(); }
});
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'noteSearch') { ui.noteQuery = t.value; renderNoteList(); }
  else if (t.id === 'remSearch') { ui.remQuery = t.value; refreshRemList(); }
  else if (t.id === 'setName') { S.settings.name = t.value.trim(); save(); }
  else if (t.matches('[data-sv]') && S.workoutActive) { const it = S.workoutActive.items[+t.dataset.i]; const v = num(t.value); if (it && v != null) { it.sets[+t.dataset.j][t.dataset.f] = Math.max(0, v); save(); } }
});
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'todoForm') return;
  e.preventDefault(); const i = $('#todoText'); const v = i.value.trim(); if (!v) { i.focus(); return; }
  S.carTodo.unshift({ id: uid(), text: v, done: false }); save(); render(); toast('Добавлено в план'); const ni = $('#todoText'); if (ni) ni.focus();
});
document.addEventListener('keydown', (e) => {
  if (lockShown()) { if (/^[0-9]$/.test(e.key)) lockKey(e.key); else if (e.key === 'Backspace') lockKey('del'); return; }
  if (e.key === 'Escape') { back(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.row[role=button]')) { e.preventDefault(); const fn = ACT[e.target.dataset.act]; if (fn) fn(e.target); }
});

/* Свайп от левого края — назад */
(() => {
  let sx = null, sy = 0, dx = 0, active = false, v = null;
  document.addEventListener('touchstart', (e) => {
    if (sheetOpen || lockShown() || viewerOpen() || !ui.stack.length) return;
    const t = e.touches[0]; if (t.clientX > 30) return;
    sx = t.clientX; sy = t.clientY; dx = 0; active = false; v = $('#view .view');
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (sx == null || !v) return; const t = e.touches[0]; const ddx = t.clientX - sx, ddy = t.clientY - sy;
    if (!active) { if (Math.abs(ddy) > Math.abs(ddx) && Math.abs(ddy) > 10) { sx = null; return; } if (ddx > 10) active = true; }
    if (active) { dx = Math.max(0, ddx); v.style.transition = 'none'; v.style.transform = `translateX(${dx}px)`; v.style.opacity = String(1 - Math.min(dx / 600, 0.4)); }
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (sx == null) return; sx = null; if (!active || !v) return;
    v.style.transition = 'transform .2s ease, opacity .2s ease';
    if (dx > 90) { v.style.transform = 'translateX(100%)'; v.style.opacity = '0'; setTimeout(back, 170); } else { v.style.transform = ''; v.style.opacity = ''; }
  });
})();
/* Потянуть лист вниз — закрыть */
(() => {
  const sh = $('#sheet'); let y0 = null, dy = 0, dragging = false;
  sh.addEventListener('touchstart', (e) => {
    const inHead = !!e.target.closest('.sheet-head'); const body = $('#sheetBody');
    if (!inHead && (body.scrollTop > 0 || e.target.closest('input, textarea, select, .chips, .emoji-row'))) { y0 = null; return; }
    y0 = e.touches[0].clientY; dy = 0; dragging = false;
  }, { passive: true });
  sh.addEventListener('touchmove', (e) => {
    if (y0 == null) return; const d = e.touches[0].clientY - y0;
    if (!dragging) { if (d > 8) { dragging = true; sh.style.transition = 'none'; } else if (d < -4) { y0 = null; return; } }
    if (dragging) { dy = Math.max(0, d); sh.style.transform = `translateY(${dy}px)`; if (e.cancelable) e.preventDefault(); }
  }, { passive: false });
  sh.addEventListener('touchend', () => {
    if (y0 == null) return; y0 = null; sh.style.transition = '';
    if (dragging && dy > 110) closeSheet(); else sh.style.transform = ''; dragging = false;
  });
})();
/* Просмотр фото */
(() => {
  $('#vwClose').addEventListener('click', closeViewer);
  $('#vwPrev').addEventListener('click', () => { if (VW.i > 0) { VW.i--; showViewerImg(); } });
  $('#vwNext').addEventListener('click', () => { if (VW.i < VW.ids.length - 1) { VW.i++; showViewerImg(); } });
  $('#vwDel').addEventListener('click', () => { $('#vwDelBox').hidden = false; $('#vwDel').hidden = true; });
  $('#vwDelNo').addEventListener('click', () => { $('#vwDelBox').hidden = true; $('#vwDel').hidden = false; });
  $('#vwDelYes').addEventListener('click', () => { const id = VW.ids[VW.i]; if (VW.onDelete) VW.onDelete(id); closeViewer(); toast('Фото удалено'); });
  let x0 = null; const img = $('#vwImg');
  img.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  img.addEventListener('touchend', (e) => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; x0 = null; if (d < -50) $('#vwNext').click(); else if (d > 50) $('#vwPrev').click(); });
})();
/* Экран кода */
(() => {
  $('#keypad').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) lockKey(b.dataset.k); });
  $('#lockCancel').addEventListener('click', () => hideLock());
  $('#lockForgot').addEventListener('click', () => { $('#forgotBox').hidden = false; $('#lockForgot').hidden = true; });
  $('#forgotNo').addEventListener('click', () => { $('#forgotBox').hidden = true; $('#lockForgot').hidden = false; });
  $('#forgotYes').addEventListener('click', async () => { await wipeAll(false); hideLock(); ui.stack = []; go('home'); toast('Данные стёрты, код сброшен'); });
})();

let lastVisible = Date.now();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { save(); LK.hiddenAt = Date.now(); if (S.settings.pin && S.settings.lockAfter === 0 && !lockShown()) showLock('unlock'); }
  else {
    if (S.settings.pin && !lockShown() && LK.hiddenAt && Date.now() - LK.hiddenAt > S.settings.lockAfter * 60000) showLock('unlock');
    checkDue(); const added = runRecurring();
    if (!sheetOpen && (added || Date.now() - lastVisible > 60000)) render();
    lastVisible = Date.now();
  }
});
window.addEventListener('pagehide', save);
window.addEventListener('hashchange', () => { const t = location.hash.slice(1); if (t && t !== ui.tab && (t === 'home' || SECTION_DEFS[t])) go(t); });

/* ================= Запуск ================= */
function start() {
  S = load();
  $('#sheetClose').innerHTML = I.close; $('#sheetBack').innerHTML = I.back; $('#sheetDel').innerHTML = I.trash;
  $('#vwClose').innerHTML = I.close; $('#vwPrev').innerHTML = I.left; $('#vwNext').innerHTML = I.right;
  $('#keypad').innerHTML = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k) => k === '' ? '<span></span>' : `<button type="button" data-k="${k}" aria-label="${k === 'del' ? 'Стереть' : k}">${k === 'del' ? I.left : k}</button>`).join('');
  $('#scrim').addEventListener('click', closeSheet);
  $('#restSkip').addEventListener('click', stopRest); $('#restPlus').addEventListener('click', () => { REST.until += 30000; });
  $('#sheetBack').addEventListener('click', () => { if (sheetBack) sheetBack(); });
  applyTheme();
  const t = location.hash.slice(1); ui.tab = (t === 'home' || (SECTION_DEFS[t] && sec(t))) ? t : 'home';
  runRecurring(true);
  if (S.settings.pin) showLock('unlock');
  render(); applyIcon(); save();
  if (!S.settings.onboarded) showWelcome(S.settings.freshOffer ? 'offer' : 'setup');
  checkDue(); setInterval(checkDue, 30000);
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  if ('serviceWorker' in navigator && !window.LIFE_PREVIEW && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
}
start();

})();
