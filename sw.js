const CACHE='quizy-shell-v9';
const CORE=['/','/index.html','/manifest.json','/icon-192.svg','/icon-512.svg'];


async function patchQuizyShell(response){
  const type=response.headers.get('content-type')||'';
  if(!type.includes('text/html')) return response;
  try{
    let html=await response.text();
    html=html.replace(/<script id="quizy-clean-startup-v1">[\\s\\S]*?<\\/script>/,
      '<script id="quizy-clean-startup-v2">(function(){var splash=document.getElementById("quizyWelcomeSplash");function hide(){if(splash){splash.classList.add("qs-hide");setTimeout(function(){if(splash)splash.remove()},380)}}function check(){var app=document.getElementById("app");if(app&&app.querySelector(".screen")){setTimeout(hide,180);return}if(Date.now()-window.__quizySplashStarted>6000){hide();return}setTimeout(check,120)}window.__quizySplashStarted=Date.now();if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",check,{once:true});else check();window.addEventListener("quizy:initial-render",function(){setTimeout(hide,180)},{once:true});})();<\\/script>');
    return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
  }catch(e){ return response; }
}

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

  // Always check the network first for the app shell so installed users
  // receive new production deployments instead of an old cached index.
  if(e.request.mode==='navigate' || u.pathname==='/' || u.pathname==='/index.html'){
    e.respondWith(
      fetch(e.request)
        .then(r=>{
          const copy=r.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy));
          return patchQuizyShell(r);
        })
        .catch(()=>caches.match(e.request))
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