// faisal-hq service worker. Network-first, never trusts the HTTP cache. Cache is offline fallback only.
const V='20261023-0107',C='faisal-hq-'+V,ASSETS=['./','index.html','config.js','style.css','app.js','v2.js','note.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();
 e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(u=>fetch(u,{cache:'no-store'}).then(r=>r.ok?c.put(u,r):0).catch(()=>0)))))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 const ks=await caches.keys(),old=ks.filter(k=>k!==C);
 await Promise.all(old.map(k=>caches.delete(k)));
 await self.clients.claim();
 if(old.length){const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  cl.forEach(c=>{try{const u=new URL(c.url);u.searchParams.set('v',Date.now());c.navigate(u.href)}catch(_){}})}
})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 let u;try{u=new URL(r.url)}catch(_){return}if(u.origin!==location.origin)return;
 const q=r.mode==='navigate'?new Request(r.url,{cache:'no-store',credentials:'same-origin',redirect:'manual'}):new Request(r,{cache:'no-store'});
 e.respondWith(fetch(q).then(n=>{if(n.ok&&n.type==='basic'){const cp=n.clone();caches.open(C).then(c=>c.put(r,cp))}return n})
  .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||Response.error())))});
