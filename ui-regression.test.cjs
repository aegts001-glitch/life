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
