from pathlib import Path

p = Path("index.html")
s = p.read_text(encoding="utf-8")

if "QUIZY_COMMAND_CENTER_TELEMETRY_V1" in s:
    print("telemetry already installed")
    pass

bootstrap = r'''
<!-- QUIZY_COMMAND_CENTER_TELEMETRY_V1 -->
<script>
(function(){
  const SUPA_URL='https://snxehcpichoskvdtuveh.supabase.co';
  const KEY='sb_publishable_54n8FEVRWSq1A17OeO-lxw_E_74g9Gh';
  let cloud=null, user=null, sentOpen=false, installKey=null;

  function esc(v){return String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

  async function waitForCloud(){
    for(let i=0;i<80;i++){
      try{
        cloud=window.QuizyCloud?.supabase || null;
        user=window.QuizyCloud?.user || null;
        if(cloud && user) return true;
      }catch(e){}
      await new Promise(r=>setTimeout(r,500));
    }
    return false;
  }

  async function activity(event_type,metadata={}){
    if(!cloud || !user) return;
    try{
      await cloud.from('quizy_activity').insert({
        user_id:user.id,
        event_type,
        metadata
      });
    }catch(e){ console.warn('Command Center activity:',e); }
  }

  async function installation(){
    if(!cloud || !user) return;
    installKey=localStorage.getItem('quizy_command_install_key');
    if(!installKey){
      installKey=(crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random());
      localStorage.setItem('quizy_command_install_key',installKey);
    }
    const ua=navigator.userAgent||'';
    const platform=/Android/i.test(ua)?'android':/iPhone|iPad/i.test(ua)?'ios':'web';
    try{
      await cloud.from('quizy_installations').upsert({
        user_id:user.id,
        install_key:installKey,
        platform,
        last_seen_at:new Date().toISOString()
      },{onConflict:'user_id,install_key'});
    }catch(e){ console.warn('Command Center installation:',e); }
  }

  async function messages(){
    if(!cloud || !user) return;
    try{
      const {data,error}=await cloud.from('quizy_messages')
        .select('id,subject,message,sender_name,created_at')
        .eq('recipient_user_id',user.id)
        .is('read_at',null)
        .order('created_at',{ascending:false})
        .limit(1);
      if(error || !data?.length) return;
      const m=data[0];
      if(document.getElementById('quizy-command-message')) return;
      const box=document.createElement('div');
      box.id='quizy-command-message';
      box.style.cssText='position:fixed;inset:0;background:#0009;z-index:999999;display:grid;place-items:center;padding:20px;font-family:system-ui';
      box.innerHTML='<div style="max-width:520px;width:100%;background:#10233a;color:white;border:1px solid #315575;border-radius:20px;padding:24px;text-align:center;box-shadow:0 20px 60px #0008"><div style="font-size:48px">📜🧭</div><div style="opacity:.7">'+esc(m.sender_name||'Quizy Expedition Commander')+'</div><h2>'+esc(m.subject)+'</h2><p style="line-height:1.6">'+esc(m.message).replace(/\n/g,'<br>')+'</p><button id="qcm-ack" style="background:#e8bf50;border:0;border-radius:10px;padding:12px 18px;font-weight:800">⭐ Message Received</button></div>';
      document.body.appendChild(box);
      document.getElementById('qcm-ack').onclick=async()=>{
        await cloud.from('quizy_messages').update({read_at:new Date().toISOString()}).eq('id',m.id);
        box.remove();
      };
    }catch(e){console.warn('Command Center messages:',e);}
  }

  function wrapFunction(name,event){
    const fn=window[name];
    if(typeof fn!=='function' || fn.__quizyCCWrapped) return;
    const wrapped=function(){
      const result=fn.apply(this,arguments);
      try{ activity(event,{}); installation(); }catch(e){}
      return result;
    };
    wrapped.__quizyCCWrapped=true;
    window[name]=wrapped;
  }

  async function boot(){
    const ok=await waitForCloud();
    if(!ok) return;
    if(!sentOpen){
      sentOpen=true;
      await activity('app_open',{path:location.pathname});
      await installation();
    }
    wrapFunction('startGame','expedition_start');
    wrapFunction('finishLand','expedition_complete');
    setInterval(()=>{
      user=window.QuizyCloud?.user || user;
      wrapFunction('startGame','expedition_start');
      wrapFunction('finishLand','expedition_complete');
      if(user) installation();
      messages();
    },10000);
    messages();
  }

  window.addEventListener('appinstalled',()=>activity('app_installed',{}));
  boot();
})();
</script>
'''

marker="<!-- QUIZY_COMMAND_CENTER_TELEMETRY_V1 -->"
if marker not in s:
    if "</body>" in s:
        s=s.replace("</body>", bootstrap + "\n</body>", 1)
    else:
        s += bootstrap

p.write_text(s,encoding="utf-8")
print("patched", p.stat().st_size)

# --- About Quizy robust action ---
about_old = '<button class="btn ghost" id="aboutQuizy" type="button" onclick="showQuizyLegal()">ⓘ About Quizy</button>'
about_new = '<button class="btn ghost" id="aboutQuizy" type="button" onclick="window.openQuizyAbout()">ⓘ About Quizy</button>'
if about_old in s:
    s = s.replace(about_old, about_new, 1)
elif '<button class="btn ghost" id="aboutQuizy">ⓘ About Quizy</button>' in s:
    s = s.replace('<button class="btn ghost" id="aboutQuizy">ⓘ About Quizy</button>', about_new, 1)

if 'window.openQuizyAbout=function(){' not in s:
    about_bootstrap = r'''
<script>
window.openQuizyAbout=function(){
  var old=document.getElementById('quizyAboutStandalone');
  if(old) old.remove();
  var o=document.createElement('div');
  o.id='quizyAboutStandalone';
  o.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;';
  o.innerHTML='<div style="width:min(680px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:22px;padding:24px;box-sizing:border-box;color:#172033;font-family:system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.35);position:relative"><button type="button" id="quizyAboutClose" style="position:absolute;right:14px;top:12px;border:0;background:#eef3ff;border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer">×</button><h2 style="margin:0 48px 6px 0;color:#1456d9">Quizy — Adventure Quiz</h2><h3 style="margin:0 0 18px">About Quizy</h3><p><strong>© 2026 Uche Promise Egbe</strong><br>Owner / Creator: Uche Promise Egbe / Promise Uche Egbe</p><p><strong>Original educational game</strong></p><p><strong>Our Purpose</strong><br>Quizy is an educational adventure game designed to make learning engaging, interactive and rewarding for children.</p><p><strong>What Quizy Offers</strong><br>Interactive quiz adventures, age-appropriate challenges, achievements, exploration and learning activities.</p><p><strong>Ownership & Intellectual Property</strong><br>Quizy and its original materials are owned by Uche Promise Egbe. Copying, reproducing, publishing, redistributing, reselling, rebranding, modifying for redistribution, or commercially exploiting Quizy or its original materials without prior permission is not permitted.</p><p><strong>Brand</strong><br>Quizy — Learn. Explore. Achieve.</p><p><strong>Contact</strong><br>0706 424 2015</p><p style="margin-bottom:0;font-weight:600">© 2026 Uche Promise Egbe. All rights reserved.</p></div>';
  document.body.appendChild(o);
  document.getElementById('quizyAboutClose').onclick=function(){o.remove()};
  o.onclick=function(e){if(e.target===o)o.remove()};
};
</script>
'''
    if "</body>" in s:
        s=s.replace("</body>", about_bootstrap + "\n</body>", 1)
    else:
        s += about_bootstrap
