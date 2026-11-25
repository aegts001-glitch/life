const CACHE='life-4.0.0';
const SHELL=['./','index.html','life-next.css?v=4.0.0','life-model.js?v=4.0.0','life-next.js?v=4.0.0','life-core.js?v=3.0.0','legacy.html','appearance.css?v=3.0.0','workspace.css?v=3.0.0','polish.css?v=3.0.0','motion.css?v=3.0.0','app.js?v=3.0.0','manifest.webmanifest','icons/apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png','icons/logo.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>/^life-\d/.test(k)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request,base=new URL(self.registration.scope),url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 if(req.mode==='navigate'){
  const rel=url.pathname.slice(base.pathname.length);
  if(!['','index.html','legacy.html'].includes(rel))return;
  const key=rel==='legacy.html'?'legacy.html':'index.html';
  e.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),3500);
   try{const r=await fetch(req,{signal:abort.signal});if(!r.ok)throw Error('offline');await cache.put(key,r.clone());return r;}
   catch{ return await cache.match(key) || Response.error();}
   finally{clearTimeout(timer);}
  })());return;
 }
 e.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(req))||fetch(req)));
});
self.addEventListener('notificationclick',e=>{
 e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async cs=>{
  const dest=new URL('./#reminders',self.registration.scope).href;
  const client=cs.find(c=>c.url.startsWith(self.registration.scope));
  if(client){await client.navigate(dest);return client.focus();}return self.clients.openWindow(dest);
 }));
});
