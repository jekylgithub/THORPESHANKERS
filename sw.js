const V="shankers-5bf3e5a13f";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const req=e.request, u=new URL(req.url);
  if(req.method!=="GET"||u.origin!==self.location.origin) return;      // the relay is never cached
  if(u.pathname.endsWith("/data.json")){ e.respondWith(fetch(req)); return; }
  const fresh=(req.mode==="navigate")?new Request(req.url,{cache:"reload",credentials:"same-origin"}):req;
  e.respondWith(fetch(fresh).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(req,c).catch(()=>{}));return r;})
    .catch(()=>caches.match(req).then(m=>m||caches.match("./index.html"))));
});
