const { test } = require('node:test');
const assert = require('node:assert/strict');
const core = require('./life-core.js');
const state = () => ({ v: 2, settings: { sections: { plans: true, reminders: true, notes: true, objects: true, bank: true, diary: true } }, notes: [], reminders: [], plans: [], objects: [] });
function storage() { const data = new Map(); return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) }; }
test('corrupt storage cannot be replaced with an empty state', () => {
  const s = storage(); s.setItem('life', '{broken'); const st = core.createStore(s, 'life');
  assert.equal(st.read(), null); assert.equal(st.state.blocked, true); assert.equal(st.write(state()), false); assert.equal(s.getItem('life'), '{broken');
});
test('storage access error cannot cause an empty overwrite', () => {
  let writes = 0; const st = core.createStore({ getItem() { throw Error('denied'); }, setItem() { writes++; } }, 'life');
  st.read(); assert.equal(st.write(state()), false); assert.equal(writes, 0);
});
test('quota failure retains persisted data and reports failure', () => {
  const s = storage(), old = state(); s.setItem('life', JSON.stringify(old)); const st = core.createStore(s, 'life'); st.read();
  s.setItem = () => { throw Error('quota'); }; assert.equal(st.write({ ...state(), notes: [{ id: 'n1' }] }), false); assert.deepEqual(JSON.parse(s.getItem('life')), old);
});
test('explicit recovery and previous state', () => {
  const s = storage(), st = core.createStore(s, 'life'); st.read(); assert.equal(st.write(state()), true);
  const next = state(); next.notes.push({ id: 'n1' }); assert.equal(st.write(next), true); assert.equal(JSON.parse(s.getItem('life.previous')).notes.length, 0);
  s.setItem('life', 'broken'); const other = core.createStore(s, 'life'); other.read(); assert.equal(other.write(next, true), true); assert.equal(other.state.blocked, false);
});
test('invalid and future backups rejected', () => {
  assert.throws(() => core.validateState({ v: 99, settings: {} })); assert.throws(() => core.validateState({ v: 2, settings: {}, notes: 'broken' }));
});
test('monthly repeat clamps January 31 and restores March 31', () => {
  const r = { at: new Date(2026, 0, 31, 9).toISOString(), repeat: 'month', repeatDay: 31 };
  const feb = new Date(core.nextRepeat(r, new Date(2026, 0, 31, 10))); assert.equal(feb.getMonth(), 1); assert.equal(feb.getDate(), 28);
  r.at = feb.toISOString(); const mar = new Date(core.nextRepeat(r, new Date(2026, 1, 28, 10))); assert.equal(mar.getMonth(), 2); assert.equal(mar.getDate(), 31);
});
test('leap day annual repeat returns February 29 in leap year', () => {
  const r = { at: new Date(2024, 1, 29, 9).toISOString(), repeat: 'year', repeatDay: 29, repeatMonth: 1 };
  const d = new Date(core.nextRepeat(r, new Date(2027, 2, 1))); assert.equal(d.getFullYear(), 2028); assert.equal(d.getMonth(), 1); assert.equal(d.getDate(), 29);
});
test('agenda orders overdue, timed, untimed; ignores completed and future', () => {
  const s = state(); s.plans = [{ id: 'a', title: 'Old', date: '2026-10-29' }, { id: 'b', title: 'Untimed', date: '2026-10-30' }, { id: 'c', title: 'Timed', date: '2026-10-30', time: '09:00' }, { id: 'd', title: 'Done', date: '2026-10-30', done: true }, { id: 'e', title: 'Future', date: '2026-11-01' }];
  assert.deepEqual(core.agenda(s, '2026-10-30').map((r) => r.id), ['a', 'c', 'b']);
});
test('search handles case, ё, multiple words and disabled sections', () => {
  const s = state(); s.notes = [{ id: '1', title: 'Ёлка', body: 'Купить домой' }]; s.plans = [{ id: '2', title: 'Купить ёлку', date: '2026-12-01' }];
  assert.equal(core.search(s, 'ЕЛКА домой').length, 1); assert.equal(core.search(s, 'купить').length, 2); s.settings.sections.notes = false; assert.equal(core.search(s, 'купить').length, 1);
});
test('restore remaps media references and preserves text', () => {
  const s = state(); s.notes = [{ id: 'n', title: 'old', photos: ['old'] }]; s.diary = { pages: [{ drawing: 'drawing', items: [{ kind: 'video', ref: 'video' }] }] };
  assert.deepEqual(core.mediaRefs(s).sort(), ['drawing', 'old', 'video']); core.remapMedia(s, { old: 'new', drawing: 'new-d', video: 'new-v' });
  assert.equal(s.notes[0].title, 'old'); assert.equal(s.notes[0].photos[0], 'new'); assert.equal(s.diary.pages[0].drawing, 'new-d'); assert.equal(s.diary.pages[0].items[0].ref, 'new-v');
});
