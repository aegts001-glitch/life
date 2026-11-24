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
test('v2 backup migrates to v3 and keeps notes', () => {
  const s = state(); s.notes = [{ id: 'n1', title: 'Каска', body: 'Белая' }];
  const m = core.migrateState(s);
  assert.equal(m.v, 3); assert.equal(s.v, 2); assert.deepEqual(m.notes, s.notes);
  assert.deepEqual(m.debts, []); assert.equal(m.settings.migratedFrom, 2); assert.deepEqual(m.settings.prefs, {});
  assert.equal(core.validateState(m).v, 3);
});
test('partial repayment reduces the balance and closes the debt', () => {
  const debt = { id: 'd1', direction: 'in', person: 'Игорь', amount: 1000, payments: [{ id: 'p0', amount: 200 }] };
  assert.equal(core.debtLeft(debt), 800); assert.equal(core.debtOpen(debt), true);
  const part = core.applyPayment(debt, { id: 'p1', amount: 300, date: '2026-11-01' });
  assert.equal(part.applied, 300); assert.equal(core.debtLeft(part.debt), 500); assert.equal(debt.payments.length, 1);
  const over = core.applyPayment(part.debt, { id: 'p2', amount: 900, date: '2026-11-02' });
  assert.equal(over.applied, 500); assert.equal(over.closed, true); assert.equal(core.debtLeft(over.debt), 0); assert.equal(core.debtOpen(over.debt), false);
});
test('debt totals split who owes whom and count overdue', () => {
  const list = [
    { id: 'a', direction: 'in', person: 'Игорь', amount: 1000, due: '2026-10-01', payments: [{ id: 'p', amount: 250 }] },
    { id: 'b', direction: 'out', person: 'Игорь', amount: 400, due: '2026-12-01', payments: [] },
    { id: 'c', direction: 'in', person: 'Олег', amount: 100, due: '2026-10-01', done: true, payments: [] }
  ];
  const sum = core.debtSummary(list, '2026-11-01');
  assert.equal(sum.inSum, 750); assert.equal(sum.outSum, 400); assert.equal(sum.overdue, 1); assert.equal(sum.closed, 1);
  assert.deepEqual(core.debtPeople(list).map((p) => p.name), ['Игорь']);
});
test('agenda includes an open due debt and skips a future or silenced one', () => {
  const s = state(); s.settings.sections.debts = true;
  s.debts = [
    { id: 'now', direction: 'out', person: 'Бригада', amount: 500, due: '2026-10-30', payments: [] },
    { id: 'later', direction: 'in', person: 'Позже', amount: 500, due: '2026-11-02', payments: [] },
    { id: 'quiet', direction: 'in', person: 'Тихо', amount: 500, due: '2026-10-01', remind: false, payments: [] }
  ];
  assert.deepEqual(core.agenda(s, '2026-10-30').map((r) => r.id), ['now']);
});
test('search finds a debt by person and respects a disabled section', () => {
  const s = state(); s.settings.sections.debts = true;
  s.debts = [{ id: 'd', direction: 'in', person: 'Ёжиков', amount: 10, note: 'перфоратор', payments: [] }];
  assert.equal(core.search(s, 'ежиков перфоратор')[0].kind, 'debt');
  s.settings.sections.debts = false; assert.equal(core.search(s, 'ежиков').length, 0);
});
test('broken debt payments and a future schema are rejected', () => {
  const s = state(); s.v = 3; s.debts = [{ id: 'd', payments: [{ amount: 1 }] }];
  assert.throws(() => core.validateState(s));
  assert.throws(() => core.validateState({ v: 4, settings: {} }));
  assert.throws(() => core.validateState({ v: 3, settings: { prefs: [] } }));
});
test('natural plan text reads day and time and keeps the title', () => {
  const a = core.parsePlanText('завтра в 9 купить диски', '2026-11-24');
  assert.equal(a.date, '2026-11-25'); assert.equal(a.time, '09:00'); assert.equal(a.title, 'купить диски');
  const b = core.parsePlanText('сегодня 18:30 созвон', '2026-11-24');
  assert.equal(b.date, '2026-11-24'); assert.equal(b.time, '18:30'); assert.equal(b.title, 'созвон');
  const c = core.parsePlanText('через 2 дня масло', '2026-11-24');
  assert.equal(c.date, '2026-11-26'); assert.equal(c.time, ''); assert.equal(c.title, 'масло');
  const d = core.parsePlanText('просто текст', '2026-11-24');
  assert.equal(d.date, '2026-11-24'); assert.equal(d.title, 'просто текст');
});
test('old plans migrate without losing the title or the date', () => {
  const old = [{ id: 'p1', title: 'Стяжка', date: '2026-11-24', time: '09:30', cat: 'work', done: false, note: 'секция', month: '2026-11' }];
  const next = core.migratePlans(old);
  assert.equal(next[0].title, 'Стяжка'); assert.equal(next[0].date, '2026-11-24'); assert.equal(next[0].time, '09:30');
  assert.equal(next[0].priority, 'mid'); assert.deepEqual(next[0].subtasks, []); assert.equal(next[0].repeat, 'none');
  assert.equal(old[0].priority, undefined);
  assert.equal(core.planSlot('09:30'), 'morning'); assert.equal(core.planSlot(''), 'none');
  assert.deepEqual(core.planProgress([{ done: true }, { done: false }]), { total: 2, done: 1, left: 1, ratio: 0.5 });
});
test('repeating plan keeps a finished copy and moves the next date', () => {
  const plan = { id: 'p', title: 'Табель', date: '2026-01-31', repeat: 'month', done: false, subtasks: [{ id: 's', title: 'сдать', done: true }] };
  const res = core.advancePlan(plan);
  assert.equal(res.repeated, true); assert.equal(res.plan.date, '2026-02-28'); assert.equal(res.plan.done, false); assert.equal(res.plan.subtasks[0].done, false);
  assert.equal(res.archive.done, true); assert.equal(res.archive.date, '2026-01-31'); assert.equal(plan.date, '2026-01-31');
  const once = core.advancePlan({ id: 'q', title: 'Разовое', date: '2026-11-24', done: false });
  assert.equal(once.repeated, false); assert.equal(once.plan.done, true); assert.equal(once.archive, null);
});
test('finance period, safe-to-spend and section merge keep the records', () => {
  assert.deepEqual(core.periodBounds('week', '2026-11-24'), { start: '2026-11-23', end: '2026-11-29', mode: 'week' });
  assert.equal(core.periodBounds('month', '2026-11-24').start, '2026-11-01');
  assert.equal(core.periodBounds('custom', '2026-11-24', { start: '2026-11-20', end: '2026-11-10' }).start, '2026-11-10');
  const range = { start: '2026-11-01', end: '2026-11-30' };
  const snap = core.financeSnapshot({
    incomes: [{ id: 'i', amount: 1000, date: '2026-11-02' }],
    expenses: [{ id: 'e', amount: 200, date: '2026-11-10', rec: 'net' }],
    recurring: [{ id: 'net', kind: 'exp', amount: 200, start: '2026-11-10', freq: 'month', last: '2026-11-10', name: 'Интернет' }, { id: 'rent', kind: 'exp', amount: 300, start: '2026-11-20', freq: 'month', name: 'Квартира' }],
    debts: [{ id: 'old', direction: 'out', amount: 100, due: '2026-10-01', payments: [] }, { id: 'now', direction: 'out', amount: 50, due: '2026-11-18', payments: [] }, { id: 'mine', direction: 'in', amount: 80, due: '2026-11-18', payments: [] }]
  }, range);
  assert.equal(snap.income, 1000); assert.equal(snap.spent, 200); assert.equal(snap.balance, 800);
  assert.equal(snap.mandatorySum, 300); assert.equal(snap.debtDue, 150); assert.equal(snap.safe, 350);
  assert.equal(snap.timeline.some((x) => x.id === 'net'), false);
  const merged = core.mergeFinanceSettings({ sections: { bank: false, debts: true, notes: true }, order: ['debts', 'notes', 'bank'], prefs: {} });
  assert.equal(merged.sections.bank, true); assert.equal(merged.sections.debts, true);
  assert.deepEqual(merged.order, ['notes', 'bank']); assert.equal(merged.sections.notes, true);
  assert.equal(merged.prefs.financePeriod, 'month');
});
test('search finds a plan by a subtask', () => {
  const s = state(); s.plans = [{ id: 'p', title: 'Склад', date: '2026-11-24', note: '', subtasks: [{ id: 's', title: 'перфоратор', done: false }] }];
  assert.equal(core.search(s, 'перфоратор')[0].id, 'p');
});
test('restore remaps media references and preserves text', () => {
  const s = state(); s.notes = [{ id: 'n', title: 'old', photos: ['old'] }]; s.diary = { pages: [{ drawing: 'drawing', items: [{ kind: 'video', ref: 'video' }] }] };
  assert.deepEqual(core.mediaRefs(s).sort(), ['drawing', 'old', 'video']); core.remapMedia(s, { old: 'new', drawing: 'new-d', video: 'new-v' });
  assert.equal(s.notes[0].title, 'old'); assert.equal(s.notes[0].photos[0], 'new'); assert.equal(s.diary.pages[0].drawing, 'new-d'); assert.equal(s.diary.pages[0].items[0].ref, 'new-v');
});
