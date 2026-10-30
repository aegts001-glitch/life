/* Life: pure storage, calendar and agenda helpers. Also testable with Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LifeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const listKeys = ['notes', 'reminders', 'plans', 'expenses', 'incomes', 'recurring', 'customCats', 'goals', 'services', 'carLog', 'carTodo', 'fuel', 'objects', 'workouts', 'wTemplates', 'myExercises'];
  const plain = (x) => x && typeof x === 'object' && !Array.isArray(x);
  function validateState(s) {
    if (!plain(s) || !Number.isInteger(s.v) || s.v < 1 || s.v > 2 || !plain(s.settings)) throw new Error('Неподдерживаемая версия или повреждённая структура копии');
    for (const k of listKeys) if (s[k] !== undefined && (!Array.isArray(s[k]) || s[k].some((x) => !plain(x) || typeof x.id !== 'string'))) throw new Error('Повреждён раздел: ' + k);
    for (const k of ['order', 'quick', 'widgets']) if (s.settings[k] !== undefined && !Array.isArray(s.settings[k])) throw new Error('Повреждены настройки: ' + k);
    for (const k of ['sections', 'features']) if (s.settings[k] !== undefined && !plain(s.settings[k])) throw new Error('Повреждены настройки: ' + k);
    for (const k of ['food', 'diary', 'car']) if (s[k] !== undefined && !plain(s[k])) throw new Error('Повреждён раздел: ' + k);
    if (s.diary && s.diary.pages !== undefined && !Array.isArray(s.diary.pages)) throw new Error('Повреждён дневник');
    return s;
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
    if (on.bank) ['expenses', 'incomes'].forEach((k) => (s[k] || []).forEach((x) => add(k === 'expenses' ? 'expense' : 'income', x.id, x.note || String(x.amount), (k === 'expenses' ? 'Расход' : 'Доход') + ' · ' + x.amount + ' ₽ · ' + x.date, x.cat)));
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
  return { validateState, createStore, nextRepeat, agenda, search, mediaRefs, remapMedia };
});
