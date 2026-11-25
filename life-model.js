/* Life: app schema adapter. Records stay in the original life.v1 browser store. */
((global, factory) => {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory(require('./life-core.js'));
  else global.LifeModel = factory(global.LifeCore);
})(globalThis, C => {
  'use strict';
  const KEY = 'life.v1';
  const clone = s => JSON.parse(JSON.stringify(s));
  const pad = n => String(n).padStart(2, '0');
  const dateKey = (d = new Date()) => Number.isFinite(+d) ? [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-') : '';
  const localDate = (key, time='12:00') => new Date(key + 'T' + time + ':00');
  const dated = x => x ? dateKey(new Date(x)) : '';
  const id = () => globalThis.crypto?.randomUUID?.() || ('life-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  const definitions = {
    plan:{name:'Задача', icon:'check', area:'plans', list:'plans', title:'title'},
    note:{name:'Заметка', icon:'note', area:'notes', list:'notes', title:'title'},
    reminder:{name:'Напоминание', icon:'bell', area:'reminders', list:'reminders', title:'title'},
    expense:{name:'Расход', icon:'wallet', area:'bank', list:'expenses', title:'note'},
    income:{name:'Доход', icon:'wallet', area:'bank', list:'incomes', title:'note'},
    debt:{name:'Долг', icon:'wallet', area:'bank', list:'debts', title:'person'},
    recurring:{name:'Регулярный платёж', icon:'clock', area:'bank', list:'recurring', title:'name'},
    goal:{name:'Копилка', icon:'wallet', area:'bank', list:'goals', title:'name'},
    food:{name:'Приём пищи', icon:'food', area:'food', list:'food.entries', title:'name'},
    weight:{name:'Вес', icon:'scale', area:'food', list:'food.weights', title:'kg'},
    workout:{name:'Тренировка', icon:'sport', area:'sport', list:'workouts', title:'title'},
    carlog:{name:'Обслуживание', icon:'car', area:'car', list:'carLog', title:'what'},
    fuel:{name:'Заправка', icon:'car', area:'car', list:'fuel', title:'station'},
    cartask:{name:'Задача по авто', icon:'car', area:'car', list:'carTodo', title:'text'},
    service:{name:'Регламент', icon:'clock', area:'car', list:'services', title:'name'},
    object:{name:'Объект', icon:'building', area:'objects', list:'objects', title:'name'},
    remark:{name:'Замечание', icon:'flag', area:'objects', list:'remarks', title:'text'},
    walk:{name:'Обход', icon:'building', area:'objects', list:'walks', title:'title'},
    diary:{name:'Запись дневника', icon:'book', area:'diary', list:'diary.pages', title:'title'}
  };
  const areas = {
    plans:['Планы','Задачи, приоритеты и повторы','check',['plan']],
    notes:['Заметки','Идеи, списки и фото','note',['note']],
    reminders:['Напоминания','Время и повтор','bell',['reminder']],
    bank:['Финансы','Расходы, доходы и обязательства','wallet',['expense','income','debt','recurring','goal']],
    food:['Питание','Еда, вода и вес','food',['food','weight']],
    sport:['Тренировки','Занятия и история','sport',['workout']],
    car:['Авто','Обслуживание, топливо и задачи','car',['carlog','fuel','cartask','service']],
    objects:['Объекты','Замечания, обходы и подрядчики','building',['object','remark','walk']],
    diary:['Дневник','Личные записи и вложения','book',['diary']]
  };
  const get = (obj,path) => path.split('.').reduce((x,k) => x && x[k], obj);
  function seed() {
    return {v:3,settings:{name:'',theme:'auto',sections:{notes:true,reminders:true,plans:true,bank:true,car:true,objects:true,food:true,sport:true,diary:false,debts:true},prefs:{},onboarded:true},notes:[],reminders:[],plans:[],expenses:[],incomes:[],recurring:[],customCats:[],goals:[],debts:[],services:[],carLog:[],carTodo:[],fuel:[],objects:[],workouts:[],wTemplates:[],myExercises:[],car:{},food:{entries:[],weights:[],waterMl:{},my:[],recent:[],goals:{}},diary:{pages:[],cover:{items:[]}}};
  }
  function safePlan(raw) {
    const p=C.migratePlan(raw);
    const subs=new Map((Array.isArray(raw.subtasks)?raw.subtasks:[]).filter(s=>s&&typeof s.id==='string').map(s=>[s.id,s]));
    p.subtasks=p.subtasks.map(s=>({...subs.get(s.id),...s}));
    return p;
  }
  function hydrate(input) {
    if (!input) return seed();
    const s = C.migrateState(input);
    const base = seed();
    s.settings.sections = {...base.settings.sections,...s.settings.sections};
    for (const [k,v] of Object.entries(base)) if (s[k] == null) s[k] = v;
    for (const k of ['food','diary','car']) s[k]={...base[k],...s[k]};
    if (input.food && !input.food.waterMl && input.food.water) s.food.waterMl=Object.fromEntries(Object.entries(input.food.water).map(([k,n])=>[k,Math.round(n*250/200)*200]));
    s.plans=s.plans.map(safePlan);
    return s;
  }
  function records(s, kind) {
    const def = definitions[kind]; if (!def) return [];
    if (kind === 'remark' || kind === 'walk') return (s.objects || []).flatMap(o => (o[def.list] || []).map(x => ({kind, x, parent:o.id, parentName:o.name})));
    return (get(s,def.list) || []).map(x => ({kind,x}));
  }
  const title = ({kind,x}) => String(x[definitions[kind].title] || x.title || (kind === 'weight' ? x.kg : '') || definitions[kind].name);
  function entryDate({kind,x}) {
    if (kind==='reminder') return dated(x.at);
    if (kind==='workout') return dated(x.start);
    if (kind==='note') return x.date || dated(x.updated || x.created);
    return x.date || x.due || x.lastDate || '';
  }
  const active = ({kind,x}) => kind === 'debt' ? C.debtOpen(x) : kind==='remark' ? x.status!=='done' : !x.done;
  function query(s,q,kind) {
    const words = String(q||'').toLowerCase().replace(/ё/g,'е').trim().split(/\s+/).filter(Boolean);
    if (!words.length && !kind) return [];
    return Object.keys(definitions).filter(k => !kind || kind===k).flatMap(k=>records(s,k)).filter(r=>{
      const x=r.x;
      const hay=[title(r),definitions[r.kind].name,r.parentName,x.note,x.body,x.text,x.cat,x.address,x.scope,x.section,x.unit,entryDate(r),...(Array.isArray(x.tags)?x.tags:[]),...(Array.isArray(x.subtasks)?x.subtasks.map(y=>y.title):[]),...(Array.isArray(x.items)?x.items.map(y=>y.name||y.text):[])].join(' ').toLowerCase().replace(/ё/g,'е');
      return words.every(w=>hay.includes(w));
    }).sort((a,b)=>entryDate(b).localeCompare(entryDate(a))||title(a).localeCompare(title(b),'ru')).slice(0,150);
  }
  function day(s,iso,includeCompleted=true) {
    const items=[];
    for (const r of records(s,'plan')) {
      if (r.x.date===iso) { if(includeCompleted||active(r)) items.push({...r,time:r.x.time||'',date:iso}); }
      else if (!r.x.done && C.planOccurrences(r.x,iso,iso).length) items.push({...r,time:r.x.time||'',date:iso,occurrence:true});
    }
    for (const k of ['reminder','debt','remark']) for (const r of records(s,k)) {
      if (entryDate(r)!==iso || (!includeCompleted&&!active(r)) || (k==='debt'&&r.x.remind===false)) continue;
      const d = new Date(r.x.at);
      items.push({...r,time:k==='reminder'?pad(d.getHours())+':'+pad(d.getMinutes()):'',date:iso});
    }
    return items.sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')||title(a).localeCompare(title(b),'ru'));
  }
  const overdue = (s,iso) => ['plan','reminder','debt','remark'].flatMap(k=>records(s,k)).filter(r=>active(r)&&entryDate(r)&&entryDate(r)<iso&&!(r.kind==='debt'&&r.x.remind===false)).sort((a,b)=>entryDate(a).localeCompare(entryDate(b)));
  const inbox = s => records(s,'plan').filter(r=>active(r)&&!r.x.date);
  function edit(s,{kind,recordId,parent,patch}) {
    const def=definitions[kind]; if (!def) throw new Error('Неизвестный раздел');
    const own = kind==='remark'||kind==='walk' ? s.objects.find(x=>x.id===parent) : s;
    if (!own) throw new Error('Сначала добавьте объект');
    let bag=get(own,def.list);
    if (!Array.isArray(bag)) { if(def.list.includes('.')) throw new Error('Раздел недоступен'); bag=own[def.list]=[]; }
    const i=recordId?bag.findIndex(x=>x.id===recordId):-1;
    if(recordId&&i<0) throw new Error('Запись уже изменилась');
    let next={...(i>=0?bag[i]:{}),...patch,id:recordId||id()};
    if (kind==='plan') {
      next=safePlan(next);
      // The legacy adapter fills an invalid/missing month, but no date still means Inbox.
      if ('date' in patch && !patch.date) next.date=null;
    }
    if (i>=0) bag[i]=next; else bag.push(next);
    return next.id;
  }
  function remove(s, record) {
    const bag = record.parent ? get(s.objects.find(o=>o.id===record.parent), definitions[record.kind].list) : get(s,definitions[record.kind].list);
    const ix = bag?.findIndex(x=>x.id===record.x.id);
    if (ix == null || ix<0) throw new Error('Запись уже изменилась');
    const [x] = bag.splice(ix,1);
    return x;
  }
  function complete(s, r) {
    if (r.occurrence) throw new Error('Измените ближайшее повторение');
    if (r.kind==='plan') {
      const i=s.plans.findIndex(p=>p.id===r.x.id); if(i<0) throw new Error('Запись уже изменилась');
      const result=C.advancePlan(s.plans[i]); s.plans[i]=result.plan;
      if(result.archive)s.plans.push({...result.archive,id:id()});
    } else if (r.kind==='reminder') {
      const x=s.reminders.find(x=>x.id===r.x.id);
      if (!x) throw new Error('Запись уже изменилась');
      if(!x.done&&x.repeat&&x.repeat!=='none'){const initial=new Date(x.at);x.repeatDay ||= initial.getDate();x.repeatMonth ??= initial.getMonth();x.at=C.nextRepeat(x);}
      else x.done=!x.done;
    } else if(r.kind==='remark'||r.kind==='cartask') {
      edit(s,{kind:r.kind,recordId:r.x.id,parent:r.parent,patch:r.kind==='remark'?{status:active(r)?'done':'open'}:{done:!r.x.done}});
    }
  }
  const unitMoney = (s,n) => new Intl.NumberFormat('ru',{maximumFractionDigits:2}).format(Number(n)||0)+' '+C.currencySymbol(s);
  return {KEY,clone,pad,dateKey,localDate,dated,id,definitions,areas,get,seed,hydrate,records,title,entryDate,active,query,day,overdue,inbox,edit,remove,complete,unitMoney};
});
