/* Life: pure storage, calendar and agenda helpers. Also testable with Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LifeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const listKeys = ['notes', 'reminders', 'plans', 'expenses', 'incomes', 'recurring', 'customCats', 'goals', 'services', 'carLog', 'carTodo', 'fuel', 'objects', 'workouts', 'wTemplates', 'myExercises', 'debts'];
  const plain = (x) => x && typeof x === 'object' && !Array.isArray(x);
  const CURRENCY = { RUB: '₽', USD: '$', EUR: '€', KZT: '₸', BYN: 'Br' };
  const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
  function currencySymbol(s) {
    const code = s && s.settings && s.settings.prefs && s.settings.prefs.currency;
    return CURRENCY[code] || '₽';
  }
  function validateState(s) {
    if (!plain(s) || !Number.isInteger(s.v) || s.v < 1 || s.v > 3 || !plain(s.settings)) throw new Error('Неподдерживаемая версия или повреждённая структура копии');
    for (const k of listKeys) if (s[k] !== undefined && (!Array.isArray(s[k]) || s[k].some((x) => !plain(x) || typeof x.id !== 'string'))) throw new Error('Повреждён раздел: ' + k);
    for (const k of ['order', 'quick', 'widgets']) if (s.settings[k] !== undefined && !Array.isArray(s.settings[k])) throw new Error('Повреждены настройки: ' + k);
    for (const k of ['sections', 'features', 'prefs']) if (s.settings[k] !== undefined && !plain(s.settings[k])) throw new Error('Повреждены настройки: ' + k);
    for (const k of ['food', 'diary', 'car']) if (s[k] !== undefined && !plain(s[k])) throw new Error('Повреждён раздел: ' + k);
    if (s.diary && s.diary.pages !== undefined && !Array.isArray(s.diary.pages)) throw new Error('Повреждён дневник');
    if (Array.isArray(s.debts)) s.debts.forEach((d) => {
      if (d.payments !== undefined && (!Array.isArray(d.payments) || d.payments.some((p) => !plain(p) || typeof p.id !== 'string'))) throw new Error('Повреждены платежи долга');
    });
    return s;
  }
  function migrateState(input) {
    const s = validateState(JSON.parse(JSON.stringify(input)));
    const from = s.v;
    if (!Array.isArray(s.debts)) s.debts = [];
    if (!plain(s.settings.prefs)) s.settings.prefs = {};
    if (s.v < 3) { s.settings.migratedFrom = from; s.v = 3; }
    return s;
  }
  function debtPaidCents(d) {
    return (d && Array.isArray(d.payments) ? d.payments : []).reduce((sum, p) => sum + Math.round((Number(p.amount) || 0) * 100), 0);
  }
  function debtLeft(d) {
    const left = Math.round((Number(d && d.amount) || 0) * 100) - debtPaidCents(d);
    return (left > 0 ? left : 0) / 100;
  }
  function debtOpen(d) { return !!(d && !d.done && debtLeft(d) > 0); }
  function debtSummary(list, today) {
    const items = Array.isArray(list) ? list : [];
    const open = items.filter(debtOpen);
    const sum = (arr) => round2(arr.reduce((s, d) => s + debtLeft(d), 0));
    const inn = open.filter((d) => d.direction !== 'out');
    const out = open.filter((d) => d.direction === 'out');
    return {
      open: open.length, closed: items.length - open.length,
      inCount: inn.length, outCount: out.length, inSum: sum(inn), outSum: sum(out),
      overdue: open.filter((d) => d.due && today && d.due < today).length
    };
  }
  function debtPeople(list) {
    const map = new Map();
    (Array.isArray(list) ? list : []).filter(debtOpen).forEach((d) => {
      const name = String(d.person || '').trim() || 'Без имени';
      const row = map.get(name) || { name, inSum: 0, outSum: 0 };
      if (d.direction === 'out') row.outSum += debtLeft(d); else row.inSum += debtLeft(d);
      map.set(name, row);
    });
    return [...map.values()].map((r) => ({ name: r.name, inSum: round2(r.inSum), outSum: round2(r.outSum) }))
      .sort((a, b) => (b.inSum + b.outSum) - (a.inSum + a.outSum) || a.name.localeCompare(b.name, 'ru'));
  }
  function applyPayment(debt, payment) {
    if (!plain(debt)) throw new Error('Нет долга');
    const next = JSON.parse(JSON.stringify(debt));
    if (!Array.isArray(next.payments)) next.payments = [];
    const left = debtLeft(next);
    let amt = Number(payment && payment.amount);
    if (!Number.isFinite(amt) || amt <= 0 || left <= 0) return { debt: next, applied: 0, closed: !debtOpen(next) };
    amt = Math.min(left, round2(amt));
    next.payments.push({
      id: payment && typeof payment.id === 'string' ? payment.id : 'pay',
      amount: amt,
      date: (payment && payment.date) || '',
      note: (payment && payment.note) || ''
    });
    if (debtLeft(next) <= 0) next.done = true;
    return { debt: next, applied: amt, closed: !!next.done };
  }
  function createStore(storage, key) {
    const state = { blocked: false, error: '', savedAt: null, raw: null };
    function read() {
      try {
        state.raw = storage.getItem(key);
        if (state.raw === null) return null;
        return validateState(JSON.parse(state.raw));
      } catch (e) { state.blocked = true; state.error = String(e.message || e); return null; }
    }
    function write(value, recover) {
      if (state.blocked && !recover) return false;
      try {
        validateState(value);
        const raw = JSON.stringify(value);
        // Keep the previous persisted state. A full disk must not prevent a small update.
        if (!state.blocked && state.raw && state.raw !== raw) {
          try { storage.setItem(key + '.previous', state.raw); } catch (e) { /* optional safety copy */ }
        }
        storage.setItem(key, raw);
        state.raw = raw; state.blocked = false; state.error = ''; state.savedAt = Date.now();
        return true;
      } catch (e) { state.error = String(e.message || e); return false; }
    }
    return { state, read, write };
  }
  function nextRepeat(r, now = new Date()) {
    const initial = new Date(r.at); if (!Number.isFinite(+initial)) throw new Error('Неверная дата напоминания');
    const anchor = r.repeatDay || initial.getDate();
    let d = new Date(initial), guard = 0;
    do {
      if (r.repeat === 'day' || r.repeat === 'week') d.setDate(d.getDate() + (r.repeat === 'day' ? 1 : 7));
      else {
        const month = r.repeat === 'year' ? (r.repeatMonth ?? initial.getMonth()) : d.getMonth() + 1;
        const year = d.getFullYear() + (r.repeat === 'year' ? 1 : 0);
        d = new Date(year, month, 1, initial.getHours(), initial.getMinutes(), initial.getSeconds());
        d.setDate(Math.min(anchor, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
      }
    } while (d <= now && ++guard < 10000);
    return d.toISOString();
  }
  function agenda(s, today) {
    const out = [];
    if (s.settings.sections.plans) (s.plans || []).filter((p) => !p.done && p.date && p.date <= today).forEach((p) => out.push({ kind: 'plan', id: p.id, title: p.title, date: p.date, time: p.time || '', label: 'План' }));
    if (s.settings.sections.reminders) (s.reminders || []).filter((r) => !r.done && r.at).forEach((r) => {
      const d = new Date(r.at); if (!Number.isFinite(+d)) return;
      const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (date <= today) out.push({ kind: 'reminder', id: r.id, title: r.title, date, time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`, label: 'Напоминание' });
    });
    if (s.settings.sections.objects) (s.objects || []).forEach((o) => (o.remarks || []).filter((r) => r.status !== 'done' && r.due && r.due <= today).forEach((r) => out.push({ kind: 'remark', id: r.id, obj: o.id, title: r.text, date: r.due, time: '', label: o.name + (r.unit ? ' · ' + r.unit : '') })));
    if (s.settings.sections.debts) (s.debts || []).forEach((d) => {
      if (!debtOpen(d) || d.remind === false || !d.due || d.due > today) return;
      const who = String(d.person || '').trim() || 'Без имени';
      out.push({ kind: 'debt', id: d.id, title: (d.direction === 'out' ? 'Отдать: ' : 'Получить: ') + who, date: d.due, time: '', label: 'Долг · ' + debtLeft(d) + ' ' + currencySymbol(s) });
    });
    return out.sort((a, b) => a.date.localeCompare(b.date) || (a.time || '99:99').localeCompare(b.time || '99:99') || a.title.localeCompare(b.title));
  }
  const clean = (x) => String(x || '').toLocaleLowerCase('ru').replace(/ё/g, 'е');
  function search(s, query) {
    const words = clean(query).trim().split(/\s+/).filter(Boolean); if (!words.length) return [];
    const out = [], on = s.settings.sections;
    const add = (kind, id, title, sub, text, extra) => { if (words.every((w) => clean(title + ' ' + sub + ' ' + text).includes(w))) out.push(Object.assign({ kind, id, title: title || 'Без названия', sub }, extra || {})); };
    if (on.notes) (s.notes || []).forEach((n) => add('note', n.id, n.title, 'Заметка', n.body));
    if (on.plans) (s.plans || []).forEach((p) => add('plan', p.id, p.title, 'План · ' + (p.date || p.month || ''), [p.note, ...(p.tags || []), ...(p.subtasks || []).map((s) => s && s.title)].join(' ')));
    if (on.reminders) (s.reminders || []).forEach((r) => add('reminder', r.id, r.title, 'Напоминание', r.note));
    const sym = currencySymbol(s);
    if (on.bank) ['expenses', 'incomes'].forEach((k) => (s[k] || []).forEach((x) => add(k === 'expenses' ? 'expense' : 'income', x.id, x.note || String(x.amount), (k === 'expenses' ? 'Расход' : 'Доход') + ' · ' + x.amount + ' ' + sym + ' · ' + x.date, x.cat)));
    if (on.debts) (s.debts || []).forEach((d) => add('debt', d.id, d.person || d.title || 'Долг', (d.direction === 'out' ? 'Я должен' : 'Мне должны') + ' · ' + debtLeft(d) + ' ' + sym, [d.note, d.title, d.due].join(' ')));
    if (on.bank) (s.goals || []).forEach((g) => add('goal', g.id, g.name, 'Копилка', g.note));
    if (on.objects) (s.objects || []).forEach((o) => (o.remarks || []).forEach((r) => add('remark', r.id, r.text, o.name + ' · ' + (r.unit || ''), r.section + ' ' + r.floor, { obj: o.id })));
    if (on.car) (s.carLog || []).forEach((x) => add('carlog', x.id, x.name || x.title || 'Обслуживание', 'Машина · ' + (x.date || ''), JSON.stringify(x)));
    if (on.diary && s.diary) (s.diary.pages || []).forEach((p, index) => add('diary', p.id, p.title || 'Страница дневника', 'Дневник · ' + (p.date || ''), [p.text, ...(p.items || []).map((x) => x.text || '')].join(' '), { index }));
    if (on.sport) (s.workouts || []).forEach((w) => add('workout', w.id, w.title, 'Тренировка', (w.items || []).map((i) => i.name).join(' ')));
    return out.slice(0, 100);
  }
  function mediaRefs(s) {
    const ids = new Set();
    function walk(x) {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x.photos)) x.photos.forEach((id) => ids.add(id));
      if (typeof x.drawing === 'string' && x.drawing) ids.add(x.drawing);
      if ((x.kind === 'photo' || x.kind === 'video') && x.ref) ids.add(x.ref);
      Object.values(x).forEach((v) => { if (v && typeof v === 'object') Array.isArray(v) ? v.forEach(walk) : walk(v); });
    }
    walk(s); return [...ids];
  }
  function remapMedia(s, mapping) {
    function walk(x) {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x.photos)) x.photos = x.photos.map((id) => mapping[id] || id);
      if (x.drawing && mapping[x.drawing]) x.drawing = mapping[x.drawing];
      if ((x.kind === 'photo' || x.kind === 'video') && mapping[x.ref]) x.ref = mapping[x.ref];
      Object.values(x).forEach((v) => { if (v && typeof v === 'object') Array.isArray(v) ? v.forEach(walk) : walk(v); });
    }
    walk(s); return s;
  }
  function shiftISO(iso, days) {
    const [y, m, d] = String(iso).split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, (d || 1) + days);
    const p = (n) => String(n).padStart(2, '0');
    return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate());
  }
  function parsePlanText(text, today) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(today || '')) throw new Error('Нужна дата');
    let rest = String(text || '').trim();
    let date = today;
    const eat = (re) => {
      const src = rest.toLocaleLowerCase('ru').replace(/ё/g, 'е');
      const m = src.match(re);
      if (!m) return null;
      rest = rest.slice(m[0].length).trim();
      return m;
    };
    let m = eat(/^(послезавтра|завтра|сегодня)(?:\s+|$)/);
    if (m) date = m[1] === 'послезавтра' ? shiftISO(today, 2) : m[1] === 'завтра' ? shiftISO(today, 1) : today;
    else {
      m = eat(/^через\s+(\d+)\s+(?:день|дня|дней)(?:\s+|$)/);
      if (m) date = shiftISO(today, Math.min(366, Number(m[1]) || 0));
    }
    const src = rest.toLocaleLowerCase('ru').replace(/ё/g, 'е');
    const tm = src.match(/^(?:в\s+)?(\d{1,2})(?::(\d{2}))?(?:\s+|$)/);
    let time = '';
    if (tm && (/^в\s+/.test(src) || tm[2])) {
      const h = Number(tm[1]), min = tm[2] ? Number(tm[2]) : 0;
      if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
        time = String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
        rest = rest.slice(tm[0].length).trim();
      }
    }
    return { title: rest, date, time };
  }
  function planSlot(time) {
    if (!time) return 'none';
    const h = Number(String(time).slice(0, 2));
    if (!Number.isFinite(h)) return 'none';
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'day';
    if (h >= 17 && h < 22) return 'evening';
    return 'night';
  }
  function planProgress(list) {
    const items = Array.isArray(list) ? list : [];
    const done = items.filter((p) => p && p.done).length;
    return { total: items.length, done, left: items.length - done, ratio: items.length ? done / items.length : 0 };
  }
  function migratePlan(p) {
    if (!plain(p) || typeof p.id !== 'string') throw new Error('Повреждён план');
    const next = JSON.parse(JSON.stringify(p));
    if (next.priority !== 'low' && next.priority !== 'mid' && next.priority !== 'high') next.priority = 'mid';
    next.tags = Array.isArray(next.tags) ? next.tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim()).slice(0, 8) : [];
    next.subtasks = Array.isArray(next.subtasks) ? next.subtasks.filter((s) => plain(s) && typeof s.id === 'string').map((s) => ({ id: s.id, title: String(s.title || ''), done: !!s.done })) : [];
    if (next.repeat !== 'day' && next.repeat !== 'week' && next.repeat !== 'month') next.repeat = 'none';
    next.order = Number.isFinite(Number(next.order)) ? Number(next.order) : 0;
    return next;
  }
  function migratePlans(list) {
    if (!Array.isArray(list)) throw new Error('Повреждён раздел: plans');
    return list.map(migratePlan);
  }
  function planNextDate(plan, fromISO) {
    if (plan && plan.repeat === 'month') {
      const [y, m, d] = String(fromISO).split('-').map(Number);
      const dt = new Date(y, m, 1);
      dt.setDate(Math.min(d, new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate()));
      const p = (n) => String(n).padStart(2, '0');
      return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate());
    }
    return shiftISO(fromISO, plan && plan.repeat === 'week' ? 7 : 1);
  }
  function advancePlan(plan) {
    const next = migratePlan(plan);
    if (next.repeat !== 'none' && next.date && !next.done) {
      const archive = migratePlan(next);
      archive.done = true; archive.repeat = 'none'; archive.id = '';
      next.date = planNextDate(next, next.date);
      next.month = next.date.slice(0, 7);
      next.done = false;
      next.subtasks.forEach((s) => { s.done = false; });
      return { plan: next, repeated: true, archive };
    }
    next.done = !next.done;
    return { plan: next, repeated: false, archive: null };
  }
  function isoFromDate(dt) {
    const p = (n) => String(n).padStart(2, '0');
    return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate());
  }
  function periodBounds(mode, today, custom) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(today || '')) throw new Error('Нужна дата');
    if (mode === 'custom' && custom && /^\d{4}-\d{2}-\d{2}$/.test(custom.start || '') && /^\d{4}-\d{2}-\d{2}$/.test(custom.end || '')) {
      const start = custom.start <= custom.end ? custom.start : custom.end;
      const end = custom.start <= custom.end ? custom.end : custom.start;
      return { start, end, mode: 'custom' };
    }
    const [y, m, d] = today.split('-').map(Number);
    if (mode === 'week') {
      const dt = new Date(y, m - 1, d);
      const start = new Date(y, m - 1, d - ((dt.getDay() + 6) % 7));
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      return { start: isoFromDate(start), end: isoFromDate(end), mode: 'week' };
    }
    const last = new Date(y, m, 0).getDate();
    const p = (n) => String(n).padStart(2, '0');
    return { start: y + '-' + p(m) + '-01', end: y + '-' + p(m) + '-' + p(last), mode: 'month' };
  }
  function occurrence(start, freq, k) {
    if (freq === 'week') return shiftISO(start, 7 * k);
    const [y, m, d] = start.split('-').map(Number);
    const months = freq === 'year' ? 12 * k : k;
    const dt = new Date(y, m - 1 + months, 1);
    dt.setDate(Math.min(d, new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate()));
    return isoFromDate(dt);
  }
  function financeSnapshot(s, range) {
    const expenses = (s.expenses || []).filter((x) => x.date >= range.start && x.date <= range.end);
    const incomes = (s.incomes || []).filter((x) => x.date >= range.start && x.date <= range.end);
    const sum = (list) => round2(list.reduce((a, x) => a + (Number(x.amount) || 0), 0));
    const spent = sum(expenses), income = sum(incomes), balance = round2(income - spent);
    const bills = [];
    (s.recurring || []).forEach((r) => {
      if (!r || r.kind === 'inc' || !r.start || !(Number(r.amount) > 0)) return;
      for (let k = 0; k < 240; k++) {
        const date = occurrence(r.start, r.freq || 'month', k);
        if (date > range.end) break;
        if (date < range.start) continue;
        if (r.last && date <= r.last) continue;
        if ((s.expenses || []).some((e) => e.rec === r.id && e.date === date)) continue;
        bills.push({ id: r.id, name: r.name || 'Платёж', amount: round2(r.amount), date, kind: 'bill' });
      }
    });
    const debtItems = (s.debts || []).filter((d) => debtOpen(d) && d.direction === 'out' && d.due && d.due <= range.end);
    const debtDue = round2(debtItems.reduce((a, d) => a + debtLeft(d), 0));
    const mandatorySum = round2(bills.reduce((a, x) => a + x.amount, 0));
    const cats = {};
    expenses.forEach((x) => { cats[x.cat || 'other'] = (cats[x.cat || 'other'] || 0) + (Number(x.amount) || 0); });
    const categories = Object.entries(cats).map(([cat, amount]) => ({ cat, amount: round2(amount) })).sort((a, b) => b.amount - a.amount);
    const flow = [];
    for (let iso = range.start, guard = 0; iso <= range.end && guard < 42; iso = shiftISO(iso, 1), guard++) {
      flow.push({
        date: iso,
        income: sum(incomes.filter((x) => x.date === iso)),
        spent: sum(expenses.filter((x) => x.date === iso))
      });
    }
    const timeline = bills.concat(debtItems.map((d) => ({ id: d.id, name: d.person || 'Долг', amount: debtLeft(d), date: d.due < range.start ? range.start : d.due, kind: 'debt', overdue: d.due < range.start })))
      .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name, 'ru'));
    return { income, spent, balance, mandatorySum, debtDue, safe: round2(income - spent - mandatorySum - debtDue), categories, flow, timeline };
  }
  function mergeFinanceSettings(settings) {
    const st = JSON.parse(JSON.stringify(settings || {}));
    st.sections = Object.assign({}, st.sections);
    if (st.sections.debts && st.sections.bank === false) st.sections.bank = true;
    st.sections.debts = !!st.sections.bank;
    if (Array.isArray(st.order)) st.order = st.order.filter((id) => id !== 'debts');
    st.prefs = Object.assign({ financePeriod: 'month' }, st.prefs);
    if (st.prefs.financePeriod !== 'week' && st.prefs.financePeriod !== 'custom') st.prefs.financePeriod = 'month';
    return st;
  }
  function planOccurrences(plan, rangeStart, rangeEnd) {
    if (!plan || typeof plan.date !== 'string' || plan.date.length < 10) return [];
    const repeat = plan.repeat && plan.repeat !== 'none' && !plan.done;
    const out = [];
    const add = (date) => {
      if (date >= rangeStart && date <= rangeEnd) out.push({ id: plan.id, date, virtual: date !== plan.date, title: plan.title || '', time: plan.time || '', priority: plan.priority || 'mid', done: !!(plan.done && date === plan.date) });
    };
    if (!repeat) { add(plan.date); return out; }
    let cursor = plan.date; let guard = 0;
    while (cursor < rangeStart && guard++ < 400) {
      const next = planNextDate(plan, cursor);
      if (!next || next <= cursor) return out;
      cursor = next;
    }
    while (cursor <= rangeEnd && guard++ < 500) {
      add(cursor);
      const next = planNextDate(plan, cursor);
      if (!next || next <= cursor) break;
      cursor = next;
    }
    return out;
  }
  function monthAgenda(plans, monthKey) {
    if (!/^\d{4}-\d{2}$/.test(monthKey || '')) throw new Error('Нужен месяц');
    const start = monthKey + '-01';
    const [y, m] = monthKey.split('-').map(Number);
    const end = monthKey + '-' + String(new Date(y, m, 0).getDate()).padStart(2, '0');
    const grouped = {};
    (plans || []).forEach((plan) => {
      planOccurrences(plan, start, end).forEach((item) => { (grouped[item.date] = grouped[item.date] || []).push(item); });
    });
    const days = Object.keys(grouped).sort().map((date) => ({
      date,
      count: grouped[date].length,
      items: grouped[date].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99') || a.title.localeCompare(b.title, 'ru'))
    }));
    return { start, end, days, total: days.reduce((n, day) => n + day.count, 0) };
  }
  return { validateState, createStore, nextRepeat, agenda, search, mediaRefs, remapMedia, migrateState, debtLeft, debtOpen, debtSummary, debtPeople, applyPayment, currencySymbol, shiftISO, parsePlanText, planSlot, planProgress, migratePlan, migratePlans, planNextDate, advancePlan, periodBounds, financeSnapshot, mergeFinanceSettings, planOccurrences, monthAgenda };
});
