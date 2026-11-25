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
  const mark = document.createElement('output');
  mark.id = 'smoke-result';
  document.body.append(mark);
  const click = selector => {
    const button = document.querySelector(selector);
    if (!button) throw Error('Missing ' + selector);
    button.click();
  };
  try {
    const state = window.__life.S;
    if (!state.settings.onboarded) {
      state.settings.onboarded = true;
      for (const key of ['plans','notes','bank','car','food','sport','reminders','objects']) state.settings.sections[key] = true;
      state.notes.push({ id:'test-note', title:'Поездка', body:'Билеты', cat:'life', photos:[], updated:new Date().toISOString() });
      localStorage.setItem('life.v1', JSON.stringify(state));
      location.reload();
      return;
    }
    click('.desk-directory [data-tab="plans"]');
    if (!document.documentElement.classList.contains('plans-screen') || document.documentElement.scrollHeight > innerHeight + 1) throw Error('Calendar overflow');
    const days = document.querySelectorAll('.compact-plans [data-act="plan-day"]');
    if (days.length < 28 || days[12].getBoundingClientRect().height < 1) throw Error('Calendar layout');
    days[12].click();
    const input = document.querySelector('#planQuickText');
    input.value = 'Проверка рабочего стола';
    input.form.requestSubmit();
    if (!document.querySelector('#view').textContent.includes(input.value)) throw Error('Creating plan on selected day');
    click('#view [data-act="back"]');
    if (!document.querySelector('.compact-plans')) throw Error('Back to month');
    click('#tabbarNav [data-tab="home"]');
    click('.desk-head [data-act="global-search"]');
    const query = document.querySelector('#globalSearch');
    query.value = 'Поездка';
    query.dispatchEvent(new Event('input',{bubbles:true}));
    click('[data-act="desk-save-query"]');
    click('#view [data-act="back"]');
    click('[data-act="desk-query"]');
    if (!document.querySelector('#globalResults [data-kind="note"]')) throw Error('Saved collection');
    click('#tabbarNav [data-tab="home"]');
    for (const id of ['bank','car','food','notes','reminders','objects','sport']) {
      click('.desk-directory [data-tab="'+id+'"]');
      click('.desk-record-link');
      if (!document.querySelector('#deskRecordQuery')) throw Error('Catalog '+id);
      click('#tabbarNav [data-tab="home"]');
    }
    mark.textContent = 'PASS';
  } catch (error) { mark.textContent = error.stack || String(error); }
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
    const {stdout} = await run(process.env.CHROME_BIN || 'google-chrome', ['--headless','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=390,844','--virtual-time-budget=6000','--user-data-dir='+profile,'--dump-dom',url], {maxBuffer:8*1024*1024,timeout:80000});
    const result = stdout.match(/<output id="smoke-result">([\s\S]*?)<\/output>/);
    assert.equal(result && result[1], 'PASS');
  } finally {server.close();await fs.rm(profile,{recursive:true,force:true,maxRetries:3});}
});
