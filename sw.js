const CACHE='quizy-shell-v13';
const CORE=['/','/index.html','/academy-content.js','/academy-expansion-v2.js','/academy-expansion-v3.js','/manifest.json','/icon-192.svg','/icon-512.svg'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;

  // Navigation must prefer the current deployment so users do not get
  // trapped on an older cached index after a production update.
  // If the network is unavailable, fall back to the cached shell.
  if(e.request.mode==='navigate' || u.pathname==='/' || u.pathname==='/index.html'){
    e.respondWith(
      fetch(e.request).then(r=>{
        if(r && r.ok){
          const copy=r.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
        }
        return r;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }).catch(()=>cached))
  );
});