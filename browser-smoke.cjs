// Run with CHROME_BIN pointing to Chrome or Chromium. Uses a temporary browser profile.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { execFile } = require('node:child_process');
const run = require('node:util').promisify(execFile);

function exercise() {
  const mark=document.createElement('output'); mark.id='smoke-result'; document.body.append(mark);
  const $=selector=>{const el=document.querySelector(selector);if(!el)throw Error('Missing '+selector);return el;};
  const click=selector=>$(selector).click();
  const input=(selector,value)=>{const el=$(selector);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));};
  try {
    if ($('h1').textContent!=='Сегодня') throw Error('Home');
    click('#nav [data-route=calendar]');
    if(document.querySelector('.bubbles-card')||document.querySelectorAll('.calendar .day').length<28)throw Error('Calendar grid');
    document.querySelectorAll('.calendar .day')[11].click();
    const date=$('.day[aria-pressed="true"]').dataset.value;
    click('.cal-tools [data-action=add]');
    if($('[name=date]').value!==date)throw Error('Selected day not applied');
    input('[name=title]','Проверка новой версии');
    $('#entry-form').requestSubmit();
    if(!$('#main').textContent.includes('Проверка новой версии'))throw Error('Task not visible');
    click('#nav [data-route=search]');
    input('#query','новой версии');
    click('#results [data-action=open]');
    if($('#sheet-title').textContent!=='Проверка новой версии')throw Error('Search result opens wrong record');
    click('#sheet [data-action=close]');
    click('[data-action=save-query]');
    input('#query','');
    click('#results [data-action=open-query]');
    if(!$('#results').textContent.includes('Проверка новой версии'))throw Error('Saved search');
    click('.prefs[data-route=settings]');
    const range=$('#look-text');
    range.value='112';
    range.dispatchEvent(new Event('input',{bubbles:true}));
    if(document.documentElement.style.getPropertyValue('--life-text-scale')!=='1.12')throw Error('No live slider preview');
    range.dispatchEvent(new Event('change',{bubbles:true}));
    if(JSON.parse(localStorage.getItem('life.v1')).settings.prefs.appearanceV4.text!==112)throw Error('Slider not persisted');
    click('[data-action=wallpaper][data-value=warm]');
    if(document.documentElement.dataset.wallpaper!=='warm')throw Error('Background choice not applied');
    click('[data-action=reset-look]');
    if($('#look-text').value!=='100')throw Error('Appearance reset');
    click('#nav [data-route=areas]');
    if(document.querySelectorAll('.area').length<8)throw Error('Missing sections');
    const value=JSON.parse(localStorage.getItem('life.v1'));
    if(value.plans[0].date!==date)throw Error('Task not stored');
    if(document.documentElement.scrollWidth>window.innerWidth+1)throw Error('Page overflows viewport');
    mark.textContent='PASS';
  } catch(error){mark.textContent=error.stack||String(error);}
}

test('Chrome workspace flows', {timeout:90000}, async () => {
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'life-chrome-'));
  const server = http.createServer(async (req,res) => {
    const pathname = new URL(req.url,'http://localhost').pathname;
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!/^[\w./-]+$/.test(file) || file.includes('..')) { res.writeHead(404).end(); return; }
    try {
      let data = await fs.readFile(path.join(__dirname,file));
      if (file === 'index.html') data = data.toString().replace('</head>','<script>window.LIFE_PREVIEW=true</script></head>').replace('</body>', () => '<script>('+exercise.toString()+')()</script></body>');
      const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png'};
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/json');
      res.end(data);
    } catch { res.writeHead(404).end(); }
  });
  try {
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    const url = 'http://127.0.0.1:'+server.address().port+'/?selftest';
    for (const size of ['390,844','1366,900']) {
    const {stdout} = await run(process.env.CHROME_BIN || 'google-chrome', ['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size='+size,'--virtual-time-budget=6000','--user-data-dir='+path.join(profile,size),'--dump-dom',url], {maxBuffer:8*1024*1024,timeout:80000});
    const result = stdout.match(/<output id="smoke-result">([\s\S]*?)<\/output>/);
    assert.equal(result && result[1], 'PASS', size + ' ' + (result && result[1]));
    }
  } finally {server.close();await fs.rm(profile,{recursive:true,force:true,maxRetries:3});}
});
