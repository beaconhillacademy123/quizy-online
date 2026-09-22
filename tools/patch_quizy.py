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

# Persist any subsequent patches made to the in-memory source, including About Quizy.
p.write_text(s,encoding="utf-8")
print("final source written", p.stat().st_size)

# Persist all About Quizy changes made below before the script exits.



# --- About Quizy robust action ---
import re
s = re.sub(
    r'<button class="btn ghost" id="aboutQuizy"[^>]*>ⓘ About Quizy</button>',
    '<button class="btn ghost" id="aboutQuizy" type="button" onclick="window.openQuizyAbout()">ⓘ About Quizy</button>',
    s, count=1
)

if 'window.openQuizyAbout=function(){' not in s:
    about_bootstrap = r'''
<script>
window.openQuizyAbout=function(){
  var old=document.getElementById('quizyAboutStandalone');
  if(old) old.remove();
  var o=document.createElement('div');
  o.id='quizyAboutStandalone';
  o.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;';
  o.innerHTML='<div style="width:min(680px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:22px;padding:24px;box-sizing:border-box;color:#172033;font-family:system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.35);position:relative"><button type="button" id="quizyAboutClose" style="position:absolute;right:14px;top:12px;border:0;background:#eef3ff;border-radius:50%;width:38px;height:38px;font-size:22px;cursor:pointer">×</button><h2 style="margin:0 48px 6px 0;color:#1456d9">Quizy — Adventure Quiz</h2><h3 style="margin:0 0 18px">About Quizy</h3><p><strong>© 2026 Uche Promise Egbe</strong><br>Owner / Creator: Uche Promise Egbe / Promise Uche Egbe</p><p><strong>Original educational game</strong></p><p><strong>Our Purpose</strong><br>Quizy is an educational adventure game designed to make learning engaging, interactive and rewarding for children.</p><p><strong>What Quizy Offers</strong><br>Interactive quiz adventures, age-appropriate challenges, achievements, exploration and learning activities.</p><p><strong>Ownership & Intellectual Property</strong><br>Quizy and its original materials are owned by Uche Promise Egbe. Copying, reproducing, publishing, redistributing, reselling, rebranding, modifying for redistribution, or commercially exploiting Quizy or its original materials without prior permission is not permitted.</p><p><strong>Brand</strong><br>Quizy — Learn. Explore. Achieve.</p><p><strong>Contact &amp; Collaboration</strong><br><a href="mailto:uchep1990@gmail.com" style="color:#1456d9;font-weight:800;text-decoration:none">uchep1990@gmail.com</a><br><a href="tel:07064242015" style="color:#1456d9;text-decoration:none">0706 424 2015</a></p><p><strong>Collaboration &amp; Sponsorship</strong><br>Quizy welcomes genuine opportunities for collaboration, sponsorship, partnership and other enquiries. Please use the email address above to get in touch.</p><p style="margin-bottom:0;font-weight:600">© 2026 Uche Promise Egbe. All rights reserved.</p></div>';
  document.body.appendChild(o);
  document.getElementById('quizyAboutClose').onclick=function(){o.remove()};
  o.onclick=function(e){if(e.target===o)o.remove()};
};
</script>
'''
    s=s.replace("</body>", about_bootstrap + "\n</body>", 1)

p.write_text(s,encoding="utf-8")
print("about source persisted", p.stat().st_size)



# --- Explorer's Help Map: first destination (standalone, core-game safe) ---
s = p.read_text(encoding="utf-8")
if "QUIZY_EXPLORER_HELP_MAP_V1" not in s:
    s = re.sub(
        r'(<button class="btn ghost" id="aboutQuizy"[^>]*>ⓘ About Quizy</button>)',
        r'\1 <button class="btn ghost" id="openQuizyHelpMap" type="button" onclick="window.openQuizyHelpMap()">🗺️ Help Map</button>',
        s, count=1
    )

    help_map = r'''
<!-- QUIZY_EXPLORER_HELP_MAP_V1 -->
<style>
#quizyHelpMapOverlay{position:fixed;inset:0;z-index:2147483646;background:linear-gradient(180deg,#071b2d,#0b2940);display:none;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
#quizyHelpMapOverlay *{box-sizing:border-box}
.qhm-shell{width:min(980px,100%);height:min(760px,100%);position:relative;overflow:hidden;border:2px solid rgba(255,255,255,.18);border-radius:28px;background:radial-gradient(circle at 50% 30%,#315e5b 0,#163d3e 38%,#092638 100%);box-shadow:0 30px 90px rgba(0,0,0,.55);color:#fff}
.qhm-top{position:absolute;left:0;right:0;top:0;z-index:5;padding:18px 20px;text-align:center;background:linear-gradient(180deg,rgba(5,20,31,.88),rgba(5,20,31,.12))}
.qhm-top h2{margin:0;font-size:clamp(22px,4vw,34px);text-shadow:0 3px 8px #0008}
.qhm-top p{margin:5px 0 0;opacity:.9;font-size:14px}
.qhm-map{position:absolute;inset:88px 0 0;background:radial-gradient(circle at 20% 25%,rgba(255,255,255,.12) 0 3px,transparent 4px),radial-gradient(circle at 75% 70%,rgba(255,255,255,.1) 0 2px,transparent 3px);overflow:hidden}
.qhm-water{position:absolute;inset:0;background:repeating-radial-gradient(ellipse at 20% 80%,transparent 0 18px,rgba(117,205,210,.06) 19px 21px);opacity:.8}
.qhm-land{position:absolute;background:linear-gradient(135deg,#c49a57,#e1bd75 48%,#9b733f);border:3px solid #6f4c2a;box-shadow:inset 0 0 0 5px rgba(255,255,255,.12),0 12px 25px #0005}
.qhm-land.one{width:48%;height:42%;left:8%;top:14%;border-radius:45% 55% 42% 58%/55% 42% 58% 45%;transform:rotate(-7deg)}
.qhm-land.two{width:34%;height:35%;right:9%;top:27%;border-radius:58% 42% 52% 48%/43% 57% 45% 55%;transform:rotate(8deg)}
.qhm-land.three{width:30%;height:23%;left:35%;bottom:8%;border-radius:50% 45% 55% 40%/55% 45% 50% 45%;transform:rotate(-4deg)}
.qhm-path{position:absolute;border:4px dashed rgba(94,63,34,.65);border-left:0;border-bottom:0;border-radius:50%;transform:rotate(-12deg);width:52%;height:30%;left:22%;top:38%;pointer-events:none}
.qhm-pin{position:absolute;z-index:3;border:0;background:#fff;color:#152333;border-radius:18px;padding:10px 12px;min-width:132px;box-shadow:0 8px 18px #0005;font-weight:800;cursor:pointer;transition:transform .18s}
.qhm-pin:hover{transform:translateY(-4px) scale(1.03)}
.qhm-pin small{display:block;font-weight:500;opacity:.7;margin-top:2px}
.qhm-pin.camp{left:12%;top:23%}
.qhm-pin.library{right:12%;top:36%}
.qhm-pin.workshop{left:26%;bottom:18%}
.qhm-pin.idea{right:13%;bottom:13%}
.qhm-pin.family{left:48%;top:54%}
.qhm-pin.whatsnew{left:53%;top:15%}
.qhm-pin.terms{left:5%;bottom:7%}
.qhm-pin.about{right:4%;top:8%}
.qhm-lock{opacity:.65;cursor:default}
.qhm-explorer{position:absolute;left:50%;top:49%;transform:translate(-50%,-50%);font-size:58px;filter:drop-shadow(0 8px 8px #0006);z-index:4;pointer-events:none}
.qhm-close{position:absolute;right:14px;top:14px;z-index:8;border:0;border-radius:50%;width:42px;height:42px;background:rgba(255,255,255,.15);color:#fff;font-size:25px;cursor:pointer}
.qhm-back{border:0;border-radius:12px;padding:10px 15px;background:#eef4ff;color:#17304a;font-weight:800;cursor:pointer}
.qhm-content{position:absolute;inset:0;z-index:7;display:none;padding:82px 20px 20px;background:linear-gradient(180deg,#102c3e,#173d4c 45%,#0a2536);overflow:auto}
.qhm-card{max-width:720px;margin:0 auto;background:#fff;color:#172033;border-radius:24px;padding:24px;box-shadow:0 20px 60px #0007}
.qhm-card h3{margin:8px 0 6px;font-size:28px;color:#1456d9}
.qhm-card h4{margin:20px 0 6px}
.qhm-card p,.qhm-card li{line-height:1.65}
.qhm-card li{margin:7px 0}
.qhm-badge{display:inline-block;background:#e9f0ff;color:#1456d9;border-radius:999px;padding:6px 10px;font-weight:800}
@media(max-width:650px){
 .qhm-pin{min-width:0;width:122px;padding:8px;font-size:12px}.qhm-pin small{font-size:10px}
 .qhm-pin.camp{left:4%;top:18%}.qhm-pin.library{right:3%;top:34%}.qhm-pin.workshop{left:5%;bottom:17%}.qhm-pin.idea{right:4%;bottom:8%}.qhm-pin.family{left:39%;top:55%}.qhm-pin.whatsnew{left:45%;top:13%}.qhm-pin.terms{left:2%;bottom:4%}.qhm-pin.about{right:2%;top:5%}
 .qhm-explorer{font-size:45px}
}
</style>
<div id="quizyHelpMapOverlay" aria-hidden="true">
  <div class="qhm-shell">
    <button class="qhm-close" type="button" onclick="window.closeQuizyHelpMap()">×</button>
    <div class="qhm-top">
      <h2>🧭 Explorer's Help Map</h2>
      <p>Lost, curious, or need a little help? Choose a destination and explore.</p>
    </div>
    <div class="qhm-map" id="quizyHelpMapHome">
      <div class="qhm-water"></div><div class="qhm-land one"></div><div class="qhm-land two"></div><div class="qhm-land three"></div><div class="qhm-path"></div>
      <div class="qhm-explorer">🧭</div>
      <button class="qhm-pin camp" type="button" onclick="window.openQuizyHelpDestination('play')">🏕️ Explorer's Camp<small>How to Play</small></button>
      <button class="qhm-pin library qhm-lock" type="button" onclick="window.helpMapComingSoon()">📚 Knowledge Library<small>Coming soon</small></button>
      <button class="qhm-pin workshop qhm-lock" type="button" onclick="window.helpMapComingSoon()">🛠️ Fix-It Workshop<small>Coming soon</small></button>
      <button class="qhm-pin idea qhm-lock" type="button" onclick="window.helpMapComingSoon()">💡 Idea Island<small>Coming soon</small></button>
      <button class="qhm-pin family qhm-lock" type="button" onclick="window.helpMapComingSoon()">🏡 Family Village<small>Coming soon</small></button>
      <button class="qhm-pin whatsnew qhm-lock" type="button" onclick="window.helpMapComingSoon()">✨ Discovery Observatory<small>Coming soon</small></button>
      <button class="qhm-pin terms qhm-lock" type="button" onclick="window.helpMapComingSoon()">📜 Scroll Temple<small>Coming soon</small></button>
      <button class="qhm-pin about" type="button" onclick="window.openQuizyAbout()">🏢 Quizy HQ<small>About Quizy</small></button>
    </div>
    <div class="qhm-content" id="quizyHelpPlay">
      <div class="qhm-card">
        <button class="qhm-back" type="button" onclick="window.helpMapBack()">← Back to Help Map</button>
        <div style="text-align:center;margin-top:16px;font-size:48px">🏕️</div>
        <div style="text-align:center"><span class="qhm-badge">Explorer's Camp</span><h3>How to Play Quizy</h3></div>
        <p>Welcome, Explorer! Quizy turns questions into an adventure. Choose a land, answer the questions, learn from the feedback, and keep exploring.</p>
        <h4>🗺️ 1. Choose your adventure</h4>
        <p>Pick an adventure land and enter an expedition. Quizy gives you questions suited to your age group and chosen difficulty.</p>
        <h4>🧠 2. Think before you answer</h4>
        <p>Read the question carefully and choose the answer you believe is correct. Take your time—learning is more important than rushing.</p>
        <h4>❤️ 3. Watch your lives</h4>
        <p>Wrong answers can cost a life, so use what you know and think carefully. Keep learning and try again when you need to.</p>
        <h4>💡 4. Use your Explorer's tools</h4>
        <ul><li><strong>Explorer's Lens</strong> can give you a helpful hint.</li><li><strong>Read Challenge</strong> can read questions aloud.</li><li><strong>Discover More</strong> gives you an extra learning adventure after an answer.</li></ul>
        <h4>⭐ 5. Collect rewards</h4>
        <p>Complete challenges to earn coins, achievements and progress through your Quizy journey.</p>
        <h4>📚 6. Learn from every answer</h4>
        <p>Even when you get an answer wrong, you have discovered something new. Read the feedback, use Discover More, and carry the lesson into your next question.</p>
        <h4>🏆 7. Keep exploring</h4>
        <p>Quizy is a journey, not a race. Explore different lands, challenge yourself, and keep growing your knowledge.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:22px">
          <button class="qhm-back" type="button" onclick="window.helpMapBack()">🗺️ Help Map</button>
          <button class="qhm-back" type="button" onclick="window.closeQuizyHelpMap()">🏠 Quizy</button>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
window.openQuizyHelpMap=function(){
  var o=document.getElementById('quizyHelpMapOverlay');
  if(!o)return;
  document.getElementById('quizyHelpMapHome').style.display='block';
  document.getElementById('quizyHelpPlay').style.display='none';
  o.style.display='flex'; o.setAttribute('aria-hidden','false');
};
window.closeQuizyHelpMap=function(){
  var o=document.getElementById('quizyHelpMapOverlay');
  if(o){o.style.display='none';o.setAttribute('aria-hidden','true');}
};
window.openQuizyHelpDestination=function(dest){
  if(dest!=='play')return;
  document.getElementById('quizyHelpMapHome').style.display='none';
  document.getElementById('quizyHelpPlay').style.display='block';
};
window.helpMapBack=function(){window.openQuizyHelpMap();};
window.helpMapComingSoon=function(){
  var old=document.getElementById('quizyHelpComingSoon');
  if(old)old.remove();
  var o=document.createElement('div');
  o.id='quizyHelpComingSoon';
  o.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.65);display:grid;place-items:center;padding:20px;font-family:system-ui';
  o.innerHTML='<div style="max-width:420px;background:#fff;color:#172033;border-radius:20px;padding:24px;text-align:center;box-shadow:0 20px 60px #0008"><div style="font-size:45px">🗺️</div><h3 style="margin:8px 0">This destination is still being prepared</h3><p>More Help Map destinations will be opened one by one as they are completed.</p><button type="button" class="qhm-back" onclick="document.getElementById(\'quizyHelpComingSoon\').remove()">Got it</button></div>';
  document.body.appendChild(o);
};
</script>
'''
    s=s.replace("</body>", help_map+"\n</body>", 1)

p.write_text(s,encoding="utf-8")
print("Explorer's Help Map patch prepared",p.stat().st_size)
