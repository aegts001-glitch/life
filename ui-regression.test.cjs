const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const app = fs.readFileSync(__dirname + '/app.js', 'utf8');
function style(values) { return { ...values, getPropertyValue(k) { return this[k] || ''; }, setProperty(k,v) { this[k]=v; } }; }
test('compact Plans mounts every day without throwing or cancelling taps', () => {
 const bubbles=Array.from({length:31},(_,i)=>({style:style({'--x':i,'--y':i*10,'--d':40})}));
 const events=[]; const stage={clientHeight:200,_v:{W:350,H:400},addEventListener:(...a)=>events.push(a)};
 const band={style:{}},layer={},ui={mounts:[]},RENDER={};let committed=false;
 const context={RENDER,ui,COMPACT_PLAN_RENDER:()=>'<div class="bubbles-card">calendar</div><div class="section-label">long list</div>',
  $:s=>s==='#bubbleStage'?stage:s==='#bubLayer'?layer:s==='.wk-band'?band:null,
  $$:()=>bubbles,commitView:()=>{committed=true;}};
 const start=app.lastIndexOf('RENDER.plans=function(){'),end=app.indexOf('/* ================= Запуск',start);
 vm.runInNewContext(app.slice(start,end),context);
 assert.equal(RENDER.plans().includes('long list'),false);ui.mounts[0]();
 assert.equal(committed,true);assert.equal(stage._v.H,200);assert.equal(band.style.display,'none');
 assert.equal(events.some(e=>e[0]==='touchmove'),false);
 bubbles.forEach(b=>assert.ok(Number(b.style['--d'])>0 && Number(b.style['--d'])<=40));
});
test('appearance sliders bind input/change on ALL controls and persist on release', () => {
 const inputs=Array.from({length:4},(_,i)=>({dataset:{visualRange:['glass','blur','radius','intensity'][i],unit:'%'},value:'42',events:{},addEventListener(k,v){this.events[k]=v;}}));
 let applied=0,saved=0;const outputs={},S={settings:{}};
 const context={S,$$:()=>inputs,$:s=>s==='#visualMotion'?null:(outputs[s]||=( {} )),visualSettings:()=>({}),applyVisual:()=>applied++,save:()=>saved++};
 vm.runInNewContext(app.slice(app.indexOf('function bindVisualStudio()'),app.indexOf("ACT['visual-bg']")),context);
 context.bindVisualStudio();for(const input of inputs){input.events.input();input.events.change();}
 assert.equal(applied,4);assert.equal(saved,4);assert.equal(S.settings.visual.intensity,42);
});
function gestures() {
 const handlers={},BUB={kMax:5,suppress:0};let now=1000,cancelled=0;
 const stage={_v:null,getBoundingClientRect:()=>({left:0,top:0}),addEventListener:(k,f)=>handlers[k]=f};
 const V={stage,W:350,H:500,k:1,kc:1,tx:0,ty:0,anim:0};
 const context={BUB,performance:{now:()=>now},Date,Math,cancelAnimationFrame:()=>{},commitView:()=>{},frameView:()=>{},clampView:v=>{v.k=Math.max(.85,Math.min(5,v.k));},settleView:()=>{},window:{addEventListener:()=>{},removeEventListener:()=>{}},setTimeout,clearTimeout};
 const start=app.indexOf('function bindBubbleGestures('),end=app.indexOf("ACT['bub-zoom']",start);
 vm.runInNewContext(app.slice(start,end),context);context.bindBubbleGestures(V);
 return {handlers,V,BUB,event:(touches)=>({touches,cancelable:true,preventDefault(){cancelled++;}}),get cancelled(){return cancelled;},advance(){now+=20;}};
}
test('small finger movement at base scale leaves native tap intact', () => {
 const g=gestures();g.handlers.touchstart(g.event([{clientX:90,clientY:100}]));g.handlers.touchmove(g.event([{clientX:92,clientY:102}]));g.handlers.touchend(g.event([]));
 assert.equal(g.cancelled,0);assert.equal(g.BUB.suppress,0);
});
test('pinch zoom contains movement and suppresses only the ending gesture click', () => {
 const g=gestures();g.handlers.touchstart(g.event([{clientX:50,clientY:100},{clientX:150,clientY:100}]));g.handlers.touchmove(g.event([{clientX:0,clientY:100},{clientX:200,clientY:100}]));g.handlers.touchend(g.event([]));
 assert.equal(g.V.k,2);assert.equal(g.cancelled,1);assert.ok(g.BUB.suppress>Date.now());
});
test('small tap at enlarged scale also remains a tap', () => {
 const g=gestures();g.V.k=g.V.kc=2;g.handlers.touchstart(g.event([{clientX:90,clientY:100}]));g.handlers.touchmove(g.event([{clientX:92,clientY:102}]));g.handlers.touchend(g.event([]));
 assert.equal(g.cancelled,0);assert.equal(g.BUB.suppress,0);
});
test('calendar geometry cannot be overwritten by generic pressed-button transform', () => {
 const css=fs.readFileSync(__dirname+'/appearance.css','utf8');
 assert.match(css,/\.compact-plans \.bub\{[^}]*transform:none!important;[^}]*transition:none!important/);
});

const model = require('./life-model.js');
test('remake preserves legacy records and unknown fields in the original state format', () => {
 const s=model.hydrate({v:2,settings:{sections:{},prefs:{},pin:{hash:'test'}},notes:[{id:'photo',photos:['m1'],title:'Ёлка'}],plans:[{id:'p1',title:'План',date:'2026-11-25',subtasks:[{id:'sub1',title:'1',done:false,legacyExtra:{preserve:true}}]}],objects:[{id:'o1',name:'Площадка',walks:[{id:'w1',title:'Обход'}]}],extra:{owner:'keep'}});
 model.edit(s,{kind:'note',recordId:'photo',patch:{body:'Новый текст'}});
 assert.equal(s.v,3);
 assert.deepEqual(s.notes[0].photos,['m1']);
 assert.equal(s.settings.pin.hash,'test');
 assert.deepEqual(s.extra,{owner:'keep'});
 assert.deepEqual(s.plans[0].subtasks[0].legacyExtra,{preserve:true});
 assert.equal(model.title(model.records(s,'walk')[0]),'Обход');
 assert.equal(model.query(s,'елка')[0].x.id,'photo');
 assert.equal(model.KEY,'life.v1');
});
test('agenda includes repeat occurrences, overdue reminders and undated Inbox; completion advances a series', () => {
 const s=model.seed();
 s.plans.push({id:'weekly',title:'Встреча',date:'2026-11-18',time:'08:00',repeat:'week',subtasks:[]},{id:'inbox',title:'Задача без даты',date:null,repeat:'none',subtasks:[]});
 s.reminders.push({id:'old',title:'Позвонить',at:model.localDate('2026-11-23','16:15').toISOString(),repeat:'none'});
 assert.equal(model.day(s,'2026-11-25')[0].x.id,'weekly');
 assert.equal(model.day(s,'2026-11-25')[0].occurrence,true);
 assert.equal(model.overdue(s,'2026-11-25').length,2);
 assert.equal(model.inbox(s)[0].x.id,'inbox');
 model.complete(s,model.records(s,'plan')[0]);
 assert.equal(s.plans.find(x=>x.id==='weekly').date,'2026-11-25');
 assert.ok(s.plans.some(x=>x.done&&x.date==='2026-11-18'));
});
test('default entry point and offline shell are independent of the old bubble UI', () => {
 const html=fs.readFileSync(__dirname+'/index.html','utf8'),css=fs.readFileSync(__dirname+'/life-next.css','utf8'),sw=fs.readFileSync(__dirname+'/sw.js','utf8');
 assert.match(html,/life-next\.js\?v=4\.0\.0/);
 assert.doesNotMatch(html,/bub|src="app\.js/);
 assert.match(css,/grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 for(const file of ['index.html','life-model.js','life-next.css','life-next.js','legacy.html'])assert.match(sw,new RegExp(file.replace('.','\\.')));
 assert.match(sw,/rel==='legacy\.html'\?'legacy\.html':'index\.html'/);
});
