(() => {
'use strict';
const M=LifeModel,C=LifeCore,$=q=>document.querySelector(q),main=$('#main'),nav=$('#nav'),sheet=$('#sheet'),gate=$('#gate'),frame=$('#frame'),toastBox=$('#toast');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const icons={
 today:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-11 6h4"/>', calendar:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 4h1m3 0h1m3 0h1m-9 3h1m3 0h1"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
 search:'<circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4 4"/>', plus:'<path d="M12 4v16M4 12h16"/>', settings:'<circle cx="12" cy="12" r="3"/><path d="m12 2 1.5 3 3-.2 1.3 2.8 3 1 .2 3.3-2.5 1.8.1 3.1-2.8 1.7-2.8-1.3-2.8 1.3-2.8-1.7.1-3.1L3 12l.2-3.3 3-1 1.3-2.8 3 .2Z"/>',
 check:'<path d="m6 12 4 4 8-9"/>', square:'<rect x="4" y="4" width="16" height="16" rx="4"/>', checked:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8 12 3 3 5-6"/>',
 note:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h6"/>', bell:'<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zM10 20h4"/>', wallet:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18m-5 5h2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', car:'<path d="m6 10 2-5h8l2 5M4 10h16v8H4zM6 18v2m12-2v2m-11-6h1m8 0h1"/>', food:'<path d="M5 3v5a3 3 0 0 0 6 0V3M8 3v18m10-18v18m0-18c-3 2-3 6-3 9h3"/>',
 scale:'<path d="M4 4h16v16H4zM8 9a5 5 0 0 1 8 0l-4 4z"/>', sport:'<path d="M8 6v12m8-12v12m-8-6h8M4 9v6m16-6v6M4 12h4m8 0h4"/>',
 building:'<path d="M4 21h16M6 21V4h8v17m0-11h4v11M9 8h1m-1 4h1m-1 4h1"/>', flag:'<path d="M5 21V4m0 1c5-4 8 4 14 0v10c-6 4-9-4-14 0"/>', book:'<path d="M12 6c-3-3-7-3-10-2v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/>',
 right:'<path d="m9 5 7 7-7 7"/>', left:'<path d="m15 5-7 7 7 7"/>', close:'<path d="m6 6 12 12M6 18 18 6"/>', arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'
};
const ic=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[k]||icons.note)+'</svg>';
const defs=M.definitions,areas=M.areas;
const tabs=[['today','Сегодня','today'],['calendar','Календарь','calendar'],['areas','Разделы','grid'],['search','Поиск','search']];
const nDay=new Intl.DateTimeFormat('ru',{day:'numeric',month:'long'}),nWeek=new Intl.DateTimeFormat('ru',{weekday:'long',day:'numeric',month:'long'}),nMonth=new Intl.DateTimeFormat('ru',{month:'long',year:'numeric'});
const short=d=>d&&Number.isFinite(+M.localDate(d))?nDay.format(M.localDate(d)):'';
const today=()=>M.dateKey(),currDay=()=>ui.route==='calendar'?ui.date:today();
let S,originRaw,store,unlocked=false,pinFails=0,pinWait=0,hiddenAt=0;
const ui={route:'today',date:today(),month:today().slice(0,7),kind:'',search:'',searchKind:'',detail:null,sheetMode:'',focus:null,mediaURLs:[],reminded:[]};
const title=M.title;
function labelDate(d){return nWeek.format(M.localDate(d)).replace(/^./,l=>l.toUpperCase());}
function read(){
 store=C.createStore({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},M.KEY);
 const data=store.read();originRaw=store.state.raw;
 try {S=M.hydrate(data);}catch(e){store.state.blocked=true;store.state.error=String(e);S=M.seed();}
}
function write(fn){
 if(store.state.blocked) throw new Error('Сначала восстановите повреждённые данные');
 const raw=localStorage.getItem(M.KEY);
 if(raw!==originRaw){read();throw new Error('Данные изменились в другой вкладке. Откройте запись снова.');}
 const next=M.clone(S); const result=fn(next);
 if(!store.write(next))throw new Error('Не удалось сохранить запись. Освободите место и повторите.');
 S=next;originRaw=store.state.raw;return result;
}
const lookSpec={
 text:[90,118,100,1,'Размер текста','%'],
 spacing:[80,120,100,1,'Масштаб отступов','%'],
 glass:[68,100,88,1,'Плотность стекла','%'],
 motion:[0,380,205,5,'Длительность переходов',' мс'],
 hue:[0,360,163,1,'Оттенок акцента','°']
};
const wallpapers=[['plain','Чистый'],['mist','Дымка'],['warm','Тёплый']];
const legacyHues={blue:223,pine:163,amber:39,berry:341,sky:199,graphite:211,orange:20,lime:132};
function appearance(custom={}){
 const persisted=S.settings.prefs?.appearanceV4||{};
 const values={};
 for(const [key,[min,max,initial]] of Object.entries(lookSpec)){
  const n=Number(custom[key]??persisted[key]??(key==='hue'?legacyHues[S.settings.accent]:undefined)??initial);
  values[key]=Number.isFinite(n)?Math.min(max,Math.max(min,Math.round(n))):initial;
 }
 const wallpaper=custom.wallpaper??persisted.wallpaper;
 values.wallpaper=wallpapers.some(([id])=>id===wallpaper)?wallpaper:'mist';
 return values;
}
function applyTheme(custom={}){
 const saved=custom.theme??S.settings.theme,root=document.documentElement,look=appearance(custom);
 root.dataset.theme=['dark','light'].includes(saved)?saved:'auto';
 root.dataset.wallpaper=look.wallpaper;
 const preview=main.querySelector('.appearance-preview');if(preview)preview.dataset.wallpaper=look.wallpaper;
 root.dataset.lifeMotion=look.motion?'on':'off';
 for(const [name,value] of Object.entries({
  '--life-text-scale':look.text/100,'--life-density':look.spacing/100,'--life-glass':look.glass+'%',
  '--life-motion':look.motion+'ms','--life-accent-hue':look.hue
 }))root.style.setProperty(name,value);
}
function saveAppearance(patch){
 const next=appearance(patch);
 write(s=>{s.settings.prefs??={};s.settings.prefs.appearanceV4=next;});
 applyTheme();
}
function showToast(message,undo){
 clearTimeout(showToast.timer);
 toastBox.innerHTML=esc(message)+(undo?' <button type="button">Отменить</button>':'');
 toastBox.hidden=false;
 if(undo)toastBox.querySelector('button').onclick=()=>{try{undo();render();showToast('Изменение отменено');}catch(e){showToast(e.message);}};
 showToast.timer=setTimeout(()=>{toastBox.hidden=true},undo?10000:4200);
}
function applyRoute(){
 const raw=location.hash.slice(1).split('/');
 if(raw[0]==='main')return;
 const aliases={home:'today',plans:'calendar',tasks:'plans',sections:'areas',global:'search',debts:'bank'};
 const name=(Object.hasOwn(aliases,raw[0])?aliases[raw[0]]:raw[0])||'today';
 if(name==='calendar'&&/^\d{4}-\d\d-\d\d$/.test(raw[1]||'')&&Number.isFinite(+M.localDate(raw[1]))){ui.date=raw[1];ui.month=ui.date.slice(0,7);}
 ui.kind=Object.hasOwn(defs,raw[1])&&defs[raw[1]].area===name?raw[1]:'';
 ui.route=tabs.some(t=>t[0]===name)||Object.hasOwn(areas,name)||name==='settings'?name:'today';
}
let displayedHash=location.hash;
function transitionRoute(){
 const changed=displayedHash!==location.hash;
 displayedHash=location.hash;
 main.classList.remove('route-enter');
 applyRoute();render();
 if(changed&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&appearance().motion){
  void main.offsetWidth;
  main.classList.add('route-enter');
 }
 return changed;
}
main.addEventListener('animationend',()=>main.classList.remove('route-enter'));
function go(r,keyboard=false,selector){
 if(r===ui.route&&!r.includes('/')){
  if(keyboard)main.focus({preventScroll:true});return;
 }
 if(location.hash!=='#'+r)history.pushState(null,'','#'+r);
 if(transitionRoute())window.scrollTo(0,0);
 if(keyboard)(selector?$(selector):main)?.focus({preventScroll:true});
}
const handleHistory=()=>{if(location.hash!==displayedHash)transitionRoute();};
window.addEventListener('popstate',handleHistory);
window.addEventListener('hashchange',handleHistory);
const heading=(k,title,sub,action='')=>'<header class="heading"><div><p class="eyebrow">'+esc(k)+'</p><h1>'+esc(title)+'</h1>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</div>'+action+'</header>';
const add=(label='Записать',kind)=>'<button type="button" class="primary" data-action="add"'+(kind?' data-kind="'+kind+'"':'')+'>'+ic('plus')+esc(label)+'</button>';
const empty=(text,description='')=>'<div class="empty"><strong>'+esc(text)+'</strong>'+esc(description)+'</div>';
function legacyUrl(hash){
 const map={bank:'bank',food:'food',sport:'sport',car:'car',objects:'objects',notes:'notes',reminders:'reminders'};
 if(map[hash])return 'legacy.html?advanced=1#'+map[hash];
 return 'legacy.html?advanced=1#home';
}
const legacyLink=(hash,label='Расширенные инструменты')=>'<a class="subtle" href="'+legacyUrl(hash)+'">'+esc(label)+ic('right')+'</a>';
function meta(r){
 const x=r.x,a=[r.time||x.time, r.parentName||defs[r.kind].name];const d=M.entryDate(r);
 if(d&&ui.route!=='calendar'&&!r.time)a.push(short(d));
 if(['expense','income','debt','recurring','goal'].includes(r.kind))a.push(M.unitMoney(S,r.kind==='debt'?C.debtLeft(x):x.amount||x.target));
 if(r.kind==='food')a.push(String(x.grams||0)+' г'+(Number(x.kcal100)>0?' · '+Math.round(x.grams*x.kcal100/100)+' ккал':''));
 if(r.kind==='weight')a.push(x.kg+' кг');
 if(r.kind==='fuel'&&x.liters)a.push(x.liters+' л');
 if(r.kind==='workout'&&x.items?.length)a.push(x.items.length+' упр.');
 return a.filter(Boolean).join(' · ');
}
function rows(items,none,desc){
 if(!items.length)return empty(none,desc);
 return '<div class="rows">'+items.map(r=>{
 const completed=!M.active(r),def=defs[r.kind],toggle=['plan','reminder','remark','cartask'].includes(r.kind)&&!r.occurrence;
 const attrs=' data-kind="'+r.kind+'" data-id="'+esc(r.x.id)+'"'+(r.parent?' data-parent="'+esc(r.parent)+'"':'')+(r.occurrence?' data-occurrence="true"':'');
 return '<div class="row"'+(completed&&toggle?' data-done':'')+'>'+(toggle?'<button type="button" class="check" data-action="complete"'+attrs+' aria-label="'+esc((completed?'Вернуть: ':'Завершить: ')+title(r))+'">'+ic(completed?'checked':'square')+'</button>':'')+'<button type="button" class="row-open" data-action="open"'+attrs+'><span class="row-icon">'+ic(def.icon)+'</span><span class="row-copy"><strong>'+esc(title(r))+'</strong><small>'+esc(meta(r))+'</small></span>'+ic('right')+'</button></div>';
 }).join('')+'</div>';
}
const card=(head,items,none,desc)=>'<section class="card"><div class="card-head"><h2>'+esc(head)+'</h2><span>'+items.length+'</span></div>'+rows(items,none,desc)+'</section>';
const chip=(name,act,value,on=false,icon='')=>'<button type="button" class="chip" data-action="'+act+'" data-value="'+esc(value)+'"'+(on?' aria-pressed="true"':' aria-pressed="false"')+'>'+(icon?ic(icon):'')+esc(name)+'</button>';
function home(){
 const now=today(),list=M.day(S,now,true),over=M.overdue(S,now),inb=M.inbox(S),n=list.filter(M.active).length;
 const name=S.settings.name?.trim();
 return heading('Личное пространство','Сегодня',labelDate(now),add())+
 '<div class="banner"><div><strong>'+esc(name?'Привет, '+name:'Всё важное под рукой')+'</strong><p>'+esc(n?('На сегодня: '+n+' в работе'): 'На сегодня открытых дел нет')+(over.length?' · Просрочено: '+over.length:'')+'</p></div><button type="button" class="subtle" data-route="calendar">Календарь '+ic('arrow')+'</button></div>'+
 '<div class="shortcuts">'+['plan','note','expense','reminder'].map(k=>'<button type="button" class="chip" data-action="add" data-kind="'+k+'">'+ic(defs[k].icon)+defs[k].name+'</button>').join('')+'</div>'+
 '<div class="split">'+card('Повестка',list,'День свободен','Новые задачи и напоминания появятся здесь.')+'<div class="stack">'+(over.length?card('Просрочено',over,'Всё вовремя'):'')+card('Входящие',inb,'Задач без даты нет','Укажите дату позже, когда будете готовы.')+'</div></div>';
}
function calendar(){
 const ym=ui.month,begin=M.localDate(ym+'-01');const off=(begin.getDay()+6)%7;
 const count=new Date(begin.getFullYear(),begin.getMonth()+1,0).getDate();
 const days=Array.from({length:count},(_,i)=>{const d=ym+'-'+M.pad(i+1),number=M.day(S,d,false).length;
 return '<button type="button" class="day" data-action="day" data-value="'+d+'" aria-label="'+esc(labelDate(d)+(number?', записей: '+number:''))+'" aria-pressed="'+(d===ui.date)+'"'+(d===today()?' aria-current="date"':'')+'> <span>'+(i+1)+'</span><small>'+ (number?number:'&nbsp;')+'</small></button>';}).join('');
 const agenda=M.day(S,ui.date,true);
 return heading('Планы по датам','Календарь','Выберите дату, чтобы открыть её повестку.',add('Записать на день','plan'))+
 '<div class="calendar-layout"><section class="card cal-card"><div class="cal-control"><button type="button" class="icon" data-action="month" data-value="-1" aria-label="Предыдущий месяц">'+ic('left')+'</button><h2>'+esc(nMonth.format(begin))+'</h2><button type="button" class="icon" data-action="month" data-value="1" aria-label="Следующий месяц">'+ic('right')+'</button></div><div class="week" aria-hidden="true">'+['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>'<span>'+x+'</span>').join('')+'</div><div class="calendar">'+('<span aria-hidden="true"></span>'.repeat(off))+days+'</div></section><div><div class="cal-tools"><button type="button" class="subtle" data-action="day" data-value="'+today()+'">Сегодня</button>'+add('Задача','plan')+'</div>'+card(labelDate(ui.date),agenda,'На этот день пока ничего нет','Добавьте задачу или напоминание.')+'</div></div>';
}
function directory(){
 const areaList=Object.keys(areas).filter(k=>k!=='diary'||M.records(S,'diary').length||S.settings.sections.diary);
 return heading('Ваши записи','Разделы','У каждого раздела свои записи и инструменты.',add())+'<div class="area-grid">'+areaList.map(k=>{const [name,desc,icon,types]=areas[k];return '<button type="button" class="area" data-route="'+(k==='plans'?'tasks':k)+'"><span class="area-icon">'+ic(icon)+'</span><strong>'+name+'</strong><small>'+desc+'</small></button>';}).join('')+'</div>';
}
function summary(key){
 const now=today();
 if(key==='bank'){
 const e=S.expenses.filter(x=>x.date?.startsWith(now.slice(0,7))).reduce((s,x)=>s+(Number(x.amount)||0),0),i=S.incomes.filter(x=>x.date?.startsWith(now.slice(0,7))).reduce((s,x)=>s+(Number(x.amount)||0),0);
 return '<div class="banner"><div><strong>'+esc(M.unitMoney(S,i-e))+'</strong><p>Баланс месяца · доходы '+esc(M.unitMoney(S,i))+' · расходы '+esc(M.unitMoney(S,e))+'</p></div></div>';
 }
 if(key==='food'){
 const water=S.food.waterMl?.[now]||0,cals=S.food.entries.filter(x=>x.date===now).reduce((s,x)=>s+(Number(x.grams*x.kcal100/100)||0),0);
 return '<div class="banner"><div><strong>'+Math.round(cals)+' ккал · '+Number(water)+' мл</strong><p>Еда и вода сегодня</p></div><button type="button" class="subtle" data-action="water">+ 200 мл</button></div>';
 }
 if(key==='car'&&(S.car.name||S.car.mileage))return '<div class="banner"><div><strong>'+esc(S.car.name||'Автомобиль')+'</strong><p>Пробег: '+esc(S.car.mileage??'не указан')+' км</p></div></div>';
 if(key==='sport'&&S.workoutActive)return '<div class="banner"><div><strong>Тренировка в процессе</strong><p>Продолжите с последнего упражнения.</p></div>'+legacyLink('sport','Продолжить')+'</div>';
 return '';
}
function area(key){
 const [name,sub,icon,types]=areas[key],kind=ui.kind;
 const show=kind?[kind]:types;
 const advanced=['bank','car','food','sport','objects','notes','reminders'].includes(key)?'<div class="tools">'+legacyLink(key)+'</div>':'';
 return '<button type="button" class="top-link" data-route="areas">'+ic('left')+'Все разделы</button>'+heading('Раздел Life',name,sub,add('Записать',kind||types[0]))+summary(key)+
 '<div class="filters">'+(types.length>1?chip('Все','filter','',!kind)+types.map(k=>chip(defs[k].name,'filter',k,kind===k)).join(''):'')+'</div>'+
 '<div class="stack">'+show.map(k=>{
 const items=M.records(S,k).sort((a,b)=>M.entryDate(b).localeCompare(M.entryDate(a))||title(a).localeCompare(title(b),'ru'));
 return '<section class="card"><div class="card-head"><h2>'+esc(defs[k].name)+'</h2><button class="subtle" type="button" data-action="add" data-kind="'+k+'">'+ic('plus')+'Добавить</button></div>'+rows(items,'Пока нет записей','')+'</section>';
 }).join('')+'</div>'+advanced;
}
function savedQueries(){
 const values=S.settings.prefs?.savedQueries;
 return Array.isArray(values)?[...new Set(values.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()))].slice(0,16):[];
}
function resultMarkup(){
 const q=ui.search.trim(),result=M.query(S,q,ui.searchKind),saved=savedQueries(),selected=saved.includes(q);
 const collections=saved.length?'<section class="query-collections"><h2>Подборки</h2><div class="filters">'+saved.map(x=>chip(x,'open-query',x,x===q,'search')).join('')+'</div></section>':'';
 const save=q?'<div class="query-toolbar"><button type="button" class="subtle" data-action="save-query">'+ic(selected?'check':'plus')+(selected?'Убрать из подборок':'Сохранить подборку')+'</button></div>':'';
 return collections+save+((!q&&!ui.searchKind)?empty('Найдите любую запись','Поиск по названию, тексту, тегам и разделам.'):card('Результаты',result,'Ничего не найдено','Измените запрос или фильтр.'));
}
function search(){
 return heading('Весь Life','Поиск','Напишите то, что помните о записи.')+
 '<label class="search">'+ic('search')+'<input id="query" type="search" aria-label="Поиск записей" placeholder="Например: поездка, продукты, тренировка" value="'+esc(ui.search)+'"></label>'+
 '<div class="filters">'+chip('Все','search-kind','',!ui.searchKind)+['plan','note','reminder','expense','food','workout','object'].map(k=>chip(defs[k].name,'search-kind',k,ui.searchKind===k)).join('')+'</div><div id="results">'+resultMarkup()+'</div>';
}
const formItem=(name,label,value='',type='text',config={})=>{
 const attr=' name="'+name+'"'+(config.required?' required':'')+(config.first?' id="initial"':'');
 const control=config.options?'<select'+attr+'>'+config.options.map(([v,l])=>'<option value="'+esc(v)+'"'+(String(value)===String(v)?' selected':'')+'>'+esc(l)+'</option>').join('')+'</select>':type==='textarea'?'<textarea'+attr+'>'+esc(value)+'</textarea>':'<input'+attr+' type="'+type+'"'+(type==='checkbox'?(value?' checked':''):' value="'+esc(value)+'"')+(type==='number'?' inputmode="decimal" min="0" step="any"':'')+' autocomplete="off">';
 return '<label class="form-item'+(type==='checkbox'?' checklabel':'')+'"><span>'+esc(label)+'</span>'+control+'</label>';
};
function settings(){
 const themes=[['auto','Как в системе'],['light','Светлая'],['dark','Тёмная']],look=appearance();
 const ranges=Object.entries(lookSpec).map(([key,[min,max,,step,label,suffix]])=>
  '<div class="range-row"><label class="range-label" for="look-'+key+'">'+label+'</label><output for="look-'+key+'">'+look[key]+suffix+'</output><input id="look-'+key+'" type="range" data-look="'+key+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+look[key]+'" style="--range-progress:'+((look[key]-min)/(max-min)*100)+'%"></div>').join('');
 const presets=wallpapers.map(([value,label])=>'<button type="button" class="swatch" data-action="wallpaper" data-value="'+value+'" aria-pressed="'+(look.wallpaper===value)+'"><i aria-hidden="true"></i>'+label+'</button>').join('');
 return heading('Личное пространство','Настройки','Настрой Life под себя. Изменения внешнего вида сохраняются на этом устройстве.')+
 '<div class="account"><section class="card note appearance-card"><div class="appearance-intro"><h2>Внешний вид</h2><button type="button" class="subtle" data-action="reset-look">Сбросить</button></div><div class="appearance-preview" data-wallpaper="'+look.wallpaper+'"><div><small>ПРЕДПРОСМОТР</small><strong>Мой Life</strong><span>Перейти к делам на сегодня</span></div><span class="appearance-dot">'+ic('check')+'</span></div><div class="appearance-controls">'+ranges+'</div><h3>Фон</h3><div class="preset-grid">'+presets+'</div><form id="profile">'+grid(formItem('name','Имя',S.settings.name||'')+formItem('theme','Тема',S.settings.theme||'auto','text',{options:themes}))+'<div class="form-actions"><button type="submit" class="primary">Сохранить имя и тему</button></div></form></section><section class="card note settings-list"><h2>Данные и доступ</h2><p class="muted">Резервная копия сохраняет записи и фотографии. Видео сохраняются отдельно.</p><div class="tools"><button type="button" class="subtle" data-action="export">Скачать копию</button><button type="button" class="subtle" data-action="restore">Восстановить</button>'+legacyLink('', 'Код-пароль и другие настройки')+'</div></section><section class="card note"><h2>Life 4.1</h2><p class="muted">Работает на этом устройстве. Синхронизации между устройствами нет.</p></section></div>';
}
function render(){
 if(!unlocked||store.state.blocked)return;
 const current=areas[ui.route]?'areas':ui.route;
 nav.innerHTML=tabs.map(([k,label,symbol])=>'<button type="button" class="nav-item" data-route="'+k+'"'+(current===k?' aria-current="page"':'')+'>'+ic(symbol)+esc(label)+'</button>').join('');
 const cap=$('.capture'),pref=$('.prefs');cap.innerHTML=ic('plus')+'Записать';pref.innerHTML=ic('settings')+'Настройки';pref.toggleAttribute('aria-current',ui.route==='settings');if(ui.route==='settings')pref.setAttribute('aria-current','page');
 main.innerHTML=ui.route==='today'?home():ui.route==='calendar'?calendar():ui.route==='areas'?directory():ui.route==='search'?search():ui.route==='settings'?settings():area(ui.route);
 document.title='Life · '+(tabs.find(t=>t[0]===ui.route)?.[1]||areas[ui.route]?.[0]||'Настройки');
}
function openSheet(head,body,mode){
 if(!sheet.open){ui.focus=document.activeElement;sheet.showModal();}
 ui.sheetMode=mode;
 sheet.querySelector('.sheet-content').innerHTML='<div class="sheet-head"><h2 id="sheet-title">'+esc(head)+'</h2><button type="button" data-action="close" aria-label="Закрыть">'+ic('close')+'</button></div>'+body;
}
function clearMedia(){for(const url of ui.mediaURLs)URL.revokeObjectURL(url);ui.mediaURLs=[];}
sheet.addEventListener('close',()=>{clearMedia();ui.detail=null;ui.sheetMode='';ui.focus?.focus();});
function getRecord(k,id,parent,occurrence){return M.records(S,k).find(r=>r.x.id===id&&(!parent||r.parent===parent))&&{...M.records(S,k).find(r=>r.x.id===id&&(!parent||r.parent===parent)),occurrence:!!occurrence};}
const more=html=>html?'<details class="more-fields"><summary>Дополнительные поля</summary><div class="form-grid">'+html+'</div></details>':'';
const grid=html=>'<div class="form-grid">'+html+'</div>';
const repeats=[['none','Без повтора'],['day','Каждый день'],['week','Каждую неделю'],['month','Каждый месяц']];
const priorities=[['mid','Обычный'],['high','Высокий'],['low','Низкий']];
function editSheet(kind,record,carry){
 kind=kind|| (areas[ui.route]?.[3][0])||'plan';
 const d=defs[kind],x=record?.x||{},date=currDay();
 const editing=!!record;
 const at=x.at?new Date(x.at):null,remTime=at&&Number.isFinite(+at)?M.pad(at.getHours())+':'+M.pad(at.getMinutes()):'09:00';
 const f=(name,label,value=x[name]??'',type='text',config)=>formItem(name,label,value,type,config);
 const first=(name,label,value=x[name]??carry??'',type='text')=>f(name,label,value,type,{required:true,first:true});
 const dateInput=(value=x.date||date)=>f('date','Дата',value,'date');
 const note=()=>f('note','Комментарий',x.note||'','textarea');
 const currency=C.currencySymbol(S);
 const fields={
 plan:()=>first('title','Что нужно сделать?')+grid(dateInput(editing?(x.date||''):date)+f('time','Время',x.time||'','time'))+more(f('priority','Приоритет',x.priority||'mid','text',{options:priorities})+f('repeat','Повтор',x.repeat||'none','text',{options:repeats})+f('tags','Теги через запятую',(x.tags||[]).join(', '))+f('subtasks','Подзадачи, по одной на строку',(x.subtasks||[]).map(z=>z.title).join('\n'),'textarea')+note()),
 note:()=>first('title','Заголовок')+f('body','Текст',x.body||'','textarea')+f('photos','Добавить фото','','file'),
 reminder:()=>first('title','О чём напомнить?')+grid(dateInput(x.at?M.dated(x.at):date)+f('time','Время',remTime,'time',{required:true}))+'<p class="muted">Чтобы получить сигнал на iPhone, после сохранения добавьте событие в «Календарь».</p>'+more(f('repeat','Повтор',x.repeat||'none','text',{options:[...repeats,['year','Каждый год']]})+note()),
 expense:()=>first('amount','Сумма, '+currency,x.amount||'','number')+grid(dateInput()+f('cat','Категория',x.cat||'other'))+note(),
 income:()=>first('amount','Сумма, '+currency,x.amount||'','number')+grid(dateInput()+f('cat','Категория',x.cat||'other'))+note(),
 debt:()=>first('person','Кто?')+grid(f('amount','Сумма, '+currency,x.amount||'','number',{required:true})+f('due','Срок',x.due||'','date')+f('direction','Тип',x.direction||'in','text',{options:[['in','Мне должны'],['out','Я должен']]})+f('remind','Показывать в повестке',x.remind!==false,'checkbox'))+note(),
 recurring:()=>first('name','Название')+grid(f('amount','Сумма, '+currency,x.amount||'','number',{required:true})+f('day','День месяца',x.day||1,'number')),
 goal:()=>first('name','Название')+f('target','Цель, '+currency,x.target||'','number',{required:true})+note(),
 food:()=>first('name','Продукт или блюдо')+grid(f('grams','Порция, г',x.grams||'','number',{required:true})+dateInput()+f('meal','Приём пищи',x.meal||'breakfast','text',{options:[['breakfast','Завтрак'],['lunch','Обед'],['dinner','Ужин'],['snack','Перекус']]}))+more(f('kcal100','ккал на 100 г',x.kcal100||'','number')+f('p100','Белки на 100 г',x.p100||'','number')+f('f100','Жиры на 100 г',x.f100||'','number')+f('c100','Углеводы на 100 г',x.c100||'','number')),
 weight:()=>first('kg','Вес, кг',x.kg||'','number')+dateInput(),
 workout:()=>first('title','Название тренировки')+grid(dateInput(x.start?M.dated(x.start):date)+f('duration','Продолжительность, мин',x.start&&x.end?Math.round((x.end-x.start)/60000):'','number'))+note(),
 carlog:()=>first('what','Что сделали?')+grid(dateInput()+f('km','Пробег, км',x.km??'','number')+f('cost','Стоимость',x.cost??'','number'))+note(),
 fuel:()=>first('station','Заправка')+grid(dateInput()+f('liters','Литры',x.liters||'','number',{required:true})+f('total','Стоимость',x.total||'','number',{required:true})+f('km','Пробег, км',x.km??'','number')+f('full','Полный бак',x.full,'checkbox'))+note(),
 cartask:()=>first('text','Что нужно сделать?')+note(),
 service:()=>first('name','Название регламента')+grid(f('km','Через, км',x.km||'','number')+f('months','Через, месяцев',x.months||'','number')+f('lastDate','Последнее ТО',x.lastDate||'','date')+f('lastKm','Пробег на ТО, км',x.lastKm??'','number')),
 object:()=>first('name','Название объекта')+grid(f('address','Адрес')+f('days','Срок по умолчанию, дней',x.days||20,'number')),
 remark:()=>first('text','Замечание')+grid(f('parent','Объект',record?.parent||S.objects[0]?.id,'text',{options:S.objects.map(o=>[o.id,o.name])})+f('due','Срок',x.due||'','date')+f('unit','Помещение')+f('section','Секция')+f('floor','Этаж')),
 walk:()=>first('title','Название обхода')+grid(f('parent','Объект',record?.parent||S.objects[0]?.id,'text',{options:S.objects.map(o=>[o.id,o.name])})+dateInput())+note(),
 diary:()=>first('title','Заголовок')+dateInput()+f('text','Текст записи',x.text||'','textarea')
 };
 const quick=['plan','note','reminder','expense','food','workout'];
 const typeChoice=!editing&&ui.sheetMode!=='domain'?
 '<div class="filters" aria-label="Тип записи">'+quick.map(k=>chip(defs[k].name,'capture-kind',k,kind===k,defs[k].icon)).join('')+'</div>':'';
 ui.detail=record||null;
 const needParent=['walk','remark'].includes(kind)&&!S.objects.length;
 openSheet(editing?'Изменить запись':'Новая запись',needParent?empty('Сначала добавьте объект')+add('Создать объект','object'):typeChoice+
 '<form id="entry-form" data-kind="'+kind+'">'+fields[kind]()+'<p class="form-error" hidden role="alert"></p><div class="form-actions"><button type="submit" class="primary">'+(editing?'Сохранить изменения':'Сохранить')+'</button></div></form>','edit');
 const photo=sheet.querySelector('[name=photos]');if(photo){photo.accept='image/jpeg,image/png,image/webp';photo.multiple=true;}
 if(!editing&&kind!=='expense'&&kind!=='food')sheet.querySelector('#initial')?.focus({preventScroll:true});
}
function dbAccess(mode,access){
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open('life-photos',1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('photos'))req.result.createObjectStore('photos',{keyPath:'id'});};
  req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{const db=req.result,tx=db.transaction('photos',mode);let r;
   try{r=access(tx.objectStore('photos'));}catch(e){db.close();reject(e);return;}
   tx.oncomplete=()=>{db.close();resolve(r?.result);};
   tx.onerror=tx.onabort=()=>{db.close();reject(tx.error||new Error('Ошибка вложения'));};
  };
 });
}
const blobURL=blob=>new Promise((ok,no)=>{const reader=new FileReader();reader.onload=()=>ok(reader.result);reader.onerror=()=>no(reader.error);reader.readAsDataURL(blob);});
async function attachPhotos(files){
 const added=[];
 try{ for(const file of files){
   if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>18*1024*1024)throw new Error('Добавьте фото JPEG, PNG или WebP до 18 МБ');
   const id=M.id();await dbAccess('readwrite',db=>db.put({id,full:file,thumb:file,created:Date.now()}));added.push(id);
 } return added;}catch(e){await Promise.allSettled(added.map(id=>dbAccess('readwrite',db=>db.delete(id))));throw e;}
}
async function handleEdit(form){
 const record=ui.detail, kind=form.dataset.kind,v=Object.fromEntries(new FormData(form)),x=record?.x||{};
 const patch={}, strings=['title','name','note','body','text','what','station','date','time','cat','person','due','direction','meal','unit','address','section','floor','lastDate','repeat','priority'];
 for(const k of strings)if(k in v)patch[k]=String(v[k]).trim();
 const first=form.querySelector('#initial');
 if(!first?.value.trim())throw new Error('Заполните основное поле');
 const positive=['amount','target','kg','grams','liters'];
 for(const k of [...positive,'km','months','lastKm','total','cost','kcal100','p100','f100','c100','days','day'])if(k in v){
  const n=Number(v[k]);if(!Number.isFinite(n)||(positive.includes(k)&&n<=0))throw new Error('Проверьте числовые поля');
  patch[k]=v[k]===''&&['km','lastKm','months'].includes(k)?null:n;
 }
 if(kind==='plan'){
  const hasNaturalDate=/^(?:сегодня|завтра|послезавтра|через\s+\d+\s+д)/i.test(patch.title);
  if(!record&&hasNaturalDate&&patch.date===currDay()&&!patch.time){const parsed=C.parsePlanText(patch.title,today());if(parsed.title){patch.title=parsed.title;patch.date=parsed.date;patch.time=parsed.time;}}
  patch.month=patch.date?.slice(0,7)||x.month||currDay().slice(0,7);
  patch.tags=String(v.tags||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,8);
  const prev=(x.subtasks||[]).slice();
  patch.subtasks=String(v.subtasks||'').split('\n').map(t=>t.trim()).filter(Boolean).map(title=>{const i=prev.findIndex(t=>t.title===title);return i>=0?prev.splice(i,1)[0]:{id:M.id(),title,done:false};});
  if(!patch.date)patch.repeat='none';
  if(!editingPlan(x))patch.cat=x.cat||'life';
 }
 if(kind==='reminder'){
  const next=M.localDate(v.date,v.time);if(!Number.isFinite(+next))throw new Error('Укажите дату и время напоминания');
  patch.at=next.toISOString();
  if(!x.at||M.dated(x.at)!==v.date||patch.repeat!==x.repeat){patch.repeatDay=next.getDate();patch.repeatMonth=next.getMonth();}
 }
 if(kind==='note'){patch.updated=new Date().toISOString();patch.cat=x.cat||'life';}
 if(kind==='debt'){patch.remind=v.remind==='on';patch.payments=x.payments||[];}
 if(kind==='food')Object.assign(patch,{key:x.key||('life:'+M.id()),kcal100:patch.kcal100||0,p100:patch.p100||0,f100:patch.f100||0,c100:patch.c100||0});
 if(kind==='workout'){
  const start=editingPlan(x)&&M.dated(x.start)===v.date?Number(x.start):+M.localDate(v.date);
  if(!Number.isFinite(start))throw new Error('Укажите дату тренировки');
  patch.start=start;patch.end=start+Math.max(0,Number(v.duration)||0)*60000;patch.items=x.items||[];patch.kcal=x.kcal||0;patch.volume=x.volume||0;delete patch.date;
 }
 if(kind==='fuel'){patch.full=v.full==='on';patch.price=patch.liters?Math.round(patch.total/patch.liters*100)/100:null;}
 if(kind==='recurring'&&(patch.day<1||patch.day>31||!Number.isInteger(patch.day)))throw new Error('Введите день месяца от 1 до 31');
 if(kind==='object')Object.assign(patch,{contractors:x.contractors||[],remarks:x.remarks||[],walks:x.walks||[]});
 if(kind==='remark')Object.assign(patch,{status:x.status||'open',photos:x.photos||[],created:x.created||new Date().toISOString()});
 if(kind==='diary')patch.items=x.items||[];
 const files=kind==='note'?[...form.querySelector('[name=photos]').files]:[];
 const added=files.length?await attachPhotos(files):[];
 if(kind==='note')patch.photos=[...(x.photos||[]),...added];
 const parent=record?.parent||v.parent;
 try{write(next=>{M.edit(next,{kind,recordId:x.id,parent,patch});});}
 catch(e){await Promise.allSettled(added.map(id=>dbAccess('readwrite',db=>db.delete(id))));throw e;}
 sheet.close();render();showToast(record?'Изменения сохранены':kind==='reminder'?'Сохранено в Life. Сигнал iPhone настраивается отдельно.':'Запись сохранена');
}
const editingPlan=x=>!!x.id;
async function showMedia(r,holder){
 const keys=[...(r.x.photos||[]),...(r.x.items||[]).filter(x=>x.ref).map(x=>x.ref),...(r.x.drawing?[r.x.drawing]:[])];
 const linked=await Promise.allSettled([...new Set(keys)].map(id=>dbAccess('readonly',db=>db.get(id))));
 if(!holder.isConnected)return;
 for(const raw of linked){const item=raw.value;if(!item?.full&&!item?.video)continue;
  const url=URL.createObjectURL(item.video||item.full);ui.mediaURLs.push(url);
  const node=document.createElement(item.video?'video':'img');node.src=url;
  if(item.video)node.controls=true;else node.alt='Фото записи';holder.append(node);}
 if(keys.length&&!holder.children.length){holder.textContent='Вложения недоступны на этом устройстве.';holder.classList.add('muted');}
}
function details(r){
 clearMedia();ui.detail=r;
 const x=r.x, canToggle=['plan','reminder','remark','cartask'].includes(r.kind)&&!r.occurrence;
 const plain=[x.body,x.note,r.kind==='diary'?x.text:'',x.address,x.section,x.unit].filter(Boolean).map(t=>'<p class="detail-text">'+esc(t)+'</p>').join('');
 const subs=r.kind==='plan'&&x.subtasks?.length?'<div class="subtasks">'+x.subtasks.map(s=>'<label><input type="checkbox" data-subtask="'+esc(s.id)+'"'+(s.done?' checked':'')+'>'+esc(s.title)+'</label>').join('')+'</div>':'';
 const tags=x.tags?.length?'<p class="meta">'+x.tags.map(t=>'#'+esc(t)).join(' ')+'</p>':'';
 const debt=r.kind==='debt'&&C.debtOpen(x)?'<button type="button" class="subtle" data-action="payment">Внести платёж</button>':'';
 const reminder=r.kind==='reminder'?'<button type="button" class="subtle" data-action="ics">В календарь iPhone</button>':'';
 const workout=r.kind==='workout'&&x.items?.length?'<div class="stack">'+x.items.map(i=>'<p class="meta">'+esc(i.name||'Упражнение')+' · '+Number(i.sets?.length||0)+' подх.</p>').join('')+'</div>':'';
 openSheet(title(r),'<p class="meta">'+esc(meta(r))+'</p>'+plain+workout+tags+subs+'<div class="media"></div><div class="form-actions"><button type="button" class="primary" data-action="edit">Изменить</button>'+(canToggle?'<button type="button" class="subtle" data-action="complete-detail">'+(M.active(r)?'Завершить':'Вернуть')+'</button>':'')+debt+reminder+'<button type="button" class="subtle danger" data-action="delete">Удалить</button></div>','detail');
 showMedia(r,sheet.querySelector('.media')).catch(()=>{});
}
function runComplete(r){const before=M.clone(S),undoRaw=()=>{const expected=originRaw;return ()=>{if(originRaw!==expected)throw new Error('В записях уже есть новые изменения');write(s=>Object.assign(s,before));};};write(s=>M.complete(s,r));if(sheet.open)sheet.close();render();showToast('Повестка обновлена',undoRaw());}
function download(name,data,type){
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([data],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
async function backup(){
 try{
  const snapshot=M.clone(S),photos={},videos=[],missing=[];
  for(const id of C.mediaRefs(snapshot)){
   const r=await dbAccess('readonly',db=>db.get(id));
   if(r?.video)videos.push(id);else if(r?.full)photos[id]=await blobURL(r.full);else missing.push(id);
  }
  const value=JSON.stringify({life:snapshot,photos,backup:{version:1,created:new Date().toISOString(),videos,missing}});
  download('life-копия-'+today()+'.json',value,'application/json');
  showToast(videos.length||missing.length?'Копия скачана. Видео и недоступные вложения не включены.':'Резервная копия скачана');
 }catch(e){showToast('Копия не создана: '+e.message);}
}
function restore(){openSheet('Восстановление копии','<p class="meta">Выберите резервную копию Life. Перед заменой записей будет показана сводка.</p><form id="restore-file">'+formItem('file','Файл копии','','file',{required:true})+'<button class="primary" type="submit">Проверить файл</button><p class="form-error" hidden role="alert"></p></form>','restore');sheet.querySelector('input').accept='.json,application/json';}
let pending=null;
async function loadBackup(form){
 const file=form.elements.namedItem('file').files[0];if(!file)throw new Error('Выберите файл');
 const source=JSON.parse(await file.text()),data=M.hydrate(source.life||source);
 const photos=source.photos||{};if(!photos||typeof photos!=='object'||Array.isArray(photos))throw new Error('Неверный список вложений');
 const counts=Object.keys(defs).reduce((sum,k)=>sum+M.records(data,k).length,0);
 pending={data,photos,raw:originRaw};
 openSheet('Проверьте резервную копию','<p class="meta">Записей: '+counts+' · Вложений в файле: '+Object.keys(photos).length+'</p><p class="detail-text">Текущие записи будут заменены. Сначала скачайте резервную копию, если нужно сохранить их вне этого устройства.</p><div class="form-actions"><button type="button" class="primary" data-action="restore-confirm">Заменить записи</button><button type="button" class="subtle" data-action="close">Отмена</button></div>','restore-confirm');
}
async function applyRestore(){
 if(!pending)return;
 const {data,photos,raw}=pending,added=[],map=Object.create(null);
 try{
  if(localStorage.getItem(M.KEY)!==raw)throw new Error('Записи изменились. Повторно откройте копию.');
  if(raw)localStorage.setItem(M.KEY+'.before-import',raw);
  for(const id of C.mediaRefs(data)){
   if(!Object.prototype.hasOwnProperty.call(photos,id))continue;
   const u=photos[id];if(typeof u!=='string'||!/^data:image\/(?:jpeg|png|webp);base64,/i.test(u))continue;
   const blob=await(await fetch(u)).blob(),newId=M.id();
   await dbAccess('readwrite',db=>db.put({id:newId,full:blob,thumb:blob,created:Date.now()}));added.push(newId);map[id]=newId;
  }
  if(localStorage.getItem(M.KEY)!==raw)throw new Error('Записи изменились во время восстановления.');
  const next=C.remapMedia(data,map);next.settings.pin=S.settings.pin;next.settings.onboarded=true;
  if(!store.write(next,true))throw new Error('Не удалось сохранить данные');
  read();applyTheme();sheet.close();showGate();showToast('Копия восстановлена');
 }catch(e){await Promise.allSettled(added.map(id=>dbAccess('readwrite',db=>db.delete(id))));showToast(e.message);}
 finally{pending=null;}
}
function ics(record){
 const r=record.x,d=new Date(r.at);if(!Number.isFinite(+d))return showToast('Некорректная дата напоминания');
 const stamp=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
 const val=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[,;]/g,x=>'\\'+x);
 const map={day:'DAILY',week:'WEEKLY',month:'MONTHLY',year:'YEARLY'};
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Life//Life Calendar//RU','BEGIN:VEVENT','UID:'+val(r.id)+'@life','DTSTAMP:'+stamp(Date.now()),'DTSTART:'+stamp(d),'DTEND:'+stamp(+d+1800000),'SUMMARY:'+val(r.title),'DESCRIPTION:'+val(r.note)];
 if(map[r.repeat])lines.push('RRULE:FREQ='+map[r.repeat]);
 lines.push('BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:'+val(r.title),'END:VALARM','END:VEVENT','END:VCALENDAR','');
 download('Life-'+M.dated(r.at)+'.ics',lines.join('\r\n'),'text/calendar');
}
function payment(r){
 ui.detail=r;openSheet('Внести платёж','<p class="meta">Осталось: '+esc(M.unitMoney(S,C.debtLeft(r.x)))+'</p><form id="payment-form">'+formItem('amount','Сумма','','number',{required:true,first:true})+formItem('date','Дата',today(),'date')+formItem('note','Комментарий')+'<button class="primary" type="submit">Записать платёж</button><p class="form-error" hidden role="alert"></p></form>','payment');
}
function showGate(){
 frame.hidden=true;gate.hidden=false;
 if(store.state.blocked){
  gate.innerHTML='<div class="brand"><span class="mark">L</span><b>Life.</b></div><h1>Данные не удалось открыть</h1><p class="muted">Life не будет перезаписывать существующие записи.</p><div class="tools"><button class="primary" type="button" data-action="restore">Восстановить копию</button><button class="subtle" type="button" data-action="export-raw">Скачать исходные данные</button></div>';
  return;
 }
 if(S.settings.pin&&!unlocked){
  gate.innerHTML='<div class="brand"><span class="mark">L</span><b>Life.</b></div><h1>Введите код-пароль</h1><p class="muted">Ваши записи закрыты на этом устройстве.</p><form id="unlock">'+formItem('pin','Код из 4 цифр','','password',{required:true,first:true})+'<button class="primary" type="submit">Открыть Life</button><p class="form-error" hidden role="alert"></p></form>';
  const field=$('#initial');field.inputMode='numeric';field.pattern='[0-9]{4}';field.maxLength=4;field.focus();return;
 }
 unlocked=true;frame.hidden=false;gate.hidden=true;render();
}
async function unlock(form){
 if(Date.now()<pinWait)throw new Error('Подождите несколько секунд и попробуйте снова.');
 const p=S.settings.pin,data=new TextEncoder().encode(p.salt+':'+new FormData(form).get('pin'));
 let hash;
 if(p.hash.startsWith('f')&&p.hash.length<12){let h=2166136261;for(const b of data){h^=b;h=Math.imul(h,16777619);}hash='f'+(h>>>0).toString(16);}
 else{if(!crypto.subtle)throw new Error('Откройте Life по защищённому HTTPS-адресу.');const h=await crypto.subtle.digest('SHA-256',data);hash=[...new Uint8Array(h)].map(n=>n.toString(16).padStart(2,'0')).join('');}
 if(hash!==p.hash){pinFails+=1;if(pinFails%5===0)pinWait=Date.now()+30000;throw new Error('Неверный код-пароль');}
 pinFails=0;unlocked=true;showGate();
}
function refresh(force=false){
 const next=(()=>{try{return localStorage.getItem(M.KEY);}catch{return null;}})();
 if(!force&&next===originRaw)return;
 const oldPin=S?.settings?.pin?.hash;read();applyTheme();if(oldPin!==S.settings.pin?.hash)unlocked=false;
 if(sheet.open)sheet.close();showGate();
}
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='hidden'){hiddenAt=Date.now();return;}
 refresh();if(unlocked&&S.settings.pin&&hiddenAt&&Date.now()-hiddenAt>=(Number(S.settings.lockAfter)||0)*60000){unlocked=false;if(sheet.open)sheet.close();showGate();}
});
window.addEventListener('pageshow',()=>refresh());
window.addEventListener('storage',e=>{if(e.key===M.KEY||e.key===null)refresh();});
document.addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 try{
 const route=b.dataset.route;
 if(route){go(route,e.detail===0);return;}
 const {action,value,kind,id,parent,occurrence}=b.dataset;
 if(!unlocked&&!['close','restore','restore-confirm','export-raw'].includes(action))return;
 if(action==='day'){
  ui.date=value;ui.month=value.slice(0,7);history.replaceState(null,'','#calendar/'+value);displayedHash=location.hash;render();if(e.detail===0)main.querySelector('.day[aria-pressed=true]')?.focus();return;
 }
 if(action==='month'){
  const d=M.localDate(ui.month+'-01');d.setMonth(d.getMonth()+Number(value));ui.month=M.dateKey(d).slice(0,7);ui.date=ui.month+'-01';
  history.replaceState(null,'','#calendar/'+ui.date);displayedHash=location.hash;render();if(e.detail===0)main.querySelector('[data-action=month][data-value="'+value+'"]')?.focus();return;
 }
 if(action==='filter'){go((ui.route==='plans'?'tasks':ui.route)+(value?'/'+value:'/'),e.detail===0);return;}
 if(action==='search-kind'){ui.searchKind=value;render();if(e.detail===0)main.querySelector('[data-action=search-kind][aria-pressed=true]')?.focus();return;}
 if(action==='open-query'){ui.search=value;ui.searchKind='';render();if(e.detail===0)$('#query')?.focus();return;}
 if(action==='save-query'){
  const q=ui.search.trim().slice(0,120);if(!q)return;
  const list=savedQueries(),exists=list.includes(q);
  write(s=>{s.settings.prefs??={};s.settings.prefs.savedQueries=exists?list.filter(x=>x!==q):[q,...list].slice(0,16);});
  $('#results').innerHTML=resultMarkup();if(e.detail===0)main.querySelector('[data-action=save-query]')?.focus();showToast(exists?'Подборка удалена':'Подборка сохранена');return;
 }
 if(action==='add'){ui.sheetMode=areas[ui.route]?'domain':'';editSheet(kind);return;}
 if(action==='capture-kind'){editSheet(value,null,sheet.querySelector('#initial')?.type==='text'?sheet.querySelector('#initial').value:undefined);return;}
 if(action==='open'){const r=getRecord(kind,id,parent,occurrence);if(r)details(r);return;}
 if(action==='close'){sheet.close();return;}
 if(action==='edit'&&ui.detail){if(ui.detail.occurrence){showToast('Будущее повторение изменяется через ближайшую задачу');return;}editSheet(ui.detail.kind,ui.detail);return;}
 if(action==='complete'){const r=getRecord(kind,id,parent,occurrence);if(r)runComplete(r);return;}
 if(action==='complete-detail'&&ui.detail){runComplete(ui.detail);return;}
 if(action==='payment'&&ui.detail){payment(ui.detail);return;}
 if(action==='ics'&&ui.detail){ics(ui.detail);return;}
 if(action==='delete'&&ui.detail){
  if(ui.detail.occurrence){showToast('Удалите серию через ближайшую задачу');return;}
  openSheet('Удалить запись?','<p class="detail-text">'+esc(title(ui.detail))+'</p><div class="form-actions"><button type="button" class="subtle danger" data-action="delete-confirm">Удалить</button><button type="button" class="primary" data-action="cancel-delete">Оставить</button></div>','delete');return;
 }
 if(action==='cancel-delete'&&ui.detail){details(ui.detail);return;}
 if(action==='delete-confirm'&&ui.detail){
  const r=ui.detail,removed=write(s=>M.remove(s,r)),expected=originRaw;sheet.close();render();
  showToast('Запись удалена',()=>{if(originRaw!==expected)throw new Error('В записях уже есть новые изменения');write(s=>{const owner=r.parent?s.objects.find(o=>o.id===r.parent):s;M.get(owner,defs[r.kind].list).push(removed);});});return;
 }
 if(action==='water'){const date=today();write(s=>{s.food.waterMl[date]=(Number(s.food.waterMl[date])||0)+200;});render();showToast('Добавлено 200 мл',()=>write(s=>{s.food.waterMl[date]=Math.max(0,(Number(s.food.waterMl[date])||0)-200);}));return;}
 if(action==='wallpaper'){saveAppearance({wallpaper:value});main.querySelectorAll('.swatch').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));return;}
 if(action==='reset-look'){const defaults=Object.fromEntries(Object.entries(lookSpec).map(([k,spec])=>[k,spec[2]]));saveAppearance({...defaults,wallpaper:'mist'});render();if(e.detail===0)main.querySelector('[data-action=reset-look]')?.focus();showToast('Оформление возвращено к исходному');return;}
 if(action==='export'){await backup();return;}
 if(action==='export-raw'){download('life-исходные-данные.txt',String(originRaw||''),'text/plain');return;}
 if(action==='restore'){restore();return;}
 if(action==='restore-confirm'){b.disabled=true;await applyRestore();if(b.isConnected)b.disabled=false;}
 }catch(err){showToast(err.message);}
});
document.addEventListener('input',e=>{
 const {target:t}=e,key=t.dataset.look;
 if(t.id==='query'){ui.search=t.value;$('#results').innerHTML=resultMarkup();}
 if(Object.hasOwn(lookSpec,key)){
  applyTheme({[key]:t.value});t.style.setProperty('--range-progress',((+t.value-+t.min)/(+t.max-+t.min)*100)+'%');t.closest('.range-row').querySelector('output').textContent=t.value+lookSpec[key][5];
 }
});
document.addEventListener('change',e=>{
 const key=e.target.dataset.look;
 if(Object.hasOwn(lookSpec,key)){try{saveAppearance({[key]:e.target.value});}catch(err){applyTheme();render();showToast(err.message);}return;}
 const id=e.target.dataset.subtask;if(!id||!ui.detail)return;
 try{const r=ui.detail;write(s=>{const p=s.plans.find(x=>x.id===r.x.id),sub=p?.subtasks.find(x=>x.id===id);if(!sub)throw new Error('Подзадача не найдена');sub.done=e.target.checked;});ui.detail=getRecord('plan',r.x.id);render();}catch(err){e.target.checked=!e.target.checked;showToast(err.message);}
});
document.addEventListener('submit',async e=>{
 const form=e.target;e.preventDefault();const btn=form.querySelector('[type=submit]');if(btn?.disabled)return;if(btn)btn.disabled=true;
 try{
 if(form.id==='entry-form')await handleEdit(form);
 else if(form.id==='restore-file')await loadBackup(form);
 else if(form.id==='unlock')await unlock(form);
 else if(form.id==='profile'){
  const v=new FormData(form);write(s=>{s.settings.name=String(v.get('name')).trim();s.settings.theme=v.get('theme');});applyTheme();render();showToast('Настройки сохранены');
 }else if(form.id==='payment-form'){
  const r=ui.detail,v=Object.fromEntries(new FormData(form));if(!Number(v.amount)||Number(v.amount)<0)throw new Error('Введите сумму больше нуля');
  write(s=>{const n=s.debts.findIndex(x=>x.id===r.x.id),res=C.applyPayment(s.debts[n],{id:M.id(),...v});if(!res.applied)throw new Error('Платёж не записан');s.debts[n]=res.debt;});
  sheet.close();render();showToast('Платёж записан');
 }
 }catch(err){const out=form.querySelector('.form-error');if(out){out.hidden=false;out.textContent=err.message;}else showToast(err.message);}
 finally{if(btn&&btn.isConnected)btn.disabled=false;}
});
read();applyRoute();applyTheme();showGate();
if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
