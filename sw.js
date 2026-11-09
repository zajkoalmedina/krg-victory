// KRG Victory: radi i kad je internet slab (osnovni ekran se čuva)
const C="victory-v11";
const SHELL=["./","index.html","logo.png","manifest.json","icon-192.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// obavijest na telefonu
self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(x){d={title:"KRG Victory",body:e.data?e.data.text():""}}
  e.waitUntil(self.registration.showNotification(d.title||"KRG Victory",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||undefined,renotify:!!d.tag,data:{url:d.url||"./"}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=new URL(e.notification.data?.url||"./",self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{const c=cs.find(x=>x.url.startsWith(self.registration.scope));
    if(c){c.postMessage({go:url.includes("#poruke")?"msg":"home"});return c.focus()}return clients.openWindow(url)}))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return; // baza i prijava uvijek idu na internet
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
});
