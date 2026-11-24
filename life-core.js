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
    if (on.plans) (s.plans || []).forEach((p) => add('plan', p.id, p.title, 'План · ' + (p.date || p.month || ''), p.note));
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
  return { validateState, createStore, nextRepeat, agenda, search, mediaRefs, remapMedia, migrateState, debtLeft, debtOpen, debtSummary, debtPeople, applyPayment, currencySymbol };
});
