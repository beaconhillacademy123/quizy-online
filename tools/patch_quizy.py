from pathlib import Path
p=Path("index.html")
s=p.read_text()
if "function loadQuizySettings()" in s:
    print("already patched")
    raise SystemExit(0)
needle="async function currentUser(){"
inject=r"""let quizySettings={};
async function loadQuizySettings(){
  try{const {data,error}=await supabase.from('quizy_settings').select('key,value');if(error)throw error;quizySettings={};(data||[]).forEach(x=>quizySettings[x.key]=x.value)}catch(e){console.warn('Quizy settings unavailable:',e)}
  return quizySettings;
}
function settingBool(key,fallback=true){const v=quizySettings[key];return typeof v==='boolean'?v:fallback}
async function trackActivity(event_type,metadata={}){
  if(!window.QuizyCloud.user)return;
  try{await supabase.from('quizy_activity').insert({user_id:window.QuizyCloud.user.id,event_type,metadata})}catch(e){console.warn('Quizy activity unavailable:',e)}
}
async function recordInstallation(){
  if(!window.QuizyCloud.user)return;
  let k=localStorage.getItem('quizyDeviceInstallKey');
  if(!k){k=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random();localStorage.setItem('quizyDeviceInstallKey',k)}
  const platform=/Android/i.test(navigator.userAgent)?'android':/iPhone|iPad/i.test(navigator.userAgent)?'ios':'web';
  try{await supabase.from('quizy_installations').upsert({user_id:window.QuizyCloud.user.id,install_key:k,platform,last_seen_at:new Date().toISOString()},{onConflict:'user_id,install_key'})}catch(e){console.warn('Quizy installation tracking unavailable:',e)}
}
async function checkCloudAccess(){
  if(!window.QuizyCloud.user)return false;
  try{const {data,error}=await supabase.from('quizy_user_controls').select('suspended,reason').eq('user_id',window.QuizyCloud.user.id).maybeSingle();if(error)throw error;if(data?.suspended){window.QuizyCloud.blocked=true;app.innerHTML='<div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#07111f;color:white;font-family:system-ui;text-align:center"><div><div style="font-size:64px">🔒</div><h2>Expedition Access Paused</h2><p>Your Quizy account is temporarily paused by the Expedition Command Center.</p></div></div>';return true}}catch(e){console.warn('Quizy access check unavailable:',e)}
  return false;
}
async function checkQuizyMessages(){
  if(!window.QuizyCloud.user)return;
  try{const {data,error}=await supabase.from('quizy_messages').select('*').eq('recipient_user_id',window.QuizyCloud.user.id).is('read_at',null).order('created_at',{ascending:false}).limit(1);if(error)throw error;if(!data?.length)return;const m=data[0];const wrap=document.createElement('div');wrap.className='adventure-modal-back';wrap.innerHTML='<div class="adventure-modal card"><div class="map-symbol">📜🧭</div><div class="small">'+esc(m.sender_name||'Quizy Expedition Commander')+'</div><h2>'+esc(m.subject)+'</h2><p class="q-text">'+esc(m.message).replace(/\n/g,'<br>')+'</p><div class="adventure-actions"><button class="btn primary" id="ackMessage">⭐ Message Received</button></div></div>';document.body.appendChild(wrap);wrap.querySelector('#ackMessage').onclick=async()=>{await supabase.from('quizy_messages').update({read_at:new Date().toISOString()}).eq('id',m.id);wrap.remove()}}catch(e){console.warn('Quizy messages unavailable:',e)}
}
window.addEventListener('appinstalled',()=>{trackActivity('app_installed');recordInstallation()});
"""
if needle not in s: raise SystemExit("needle not found")
s=s.replace(needle,inject+needle,1)
old="wrap.querySelector('#qcSignUp').onclick=async()=>{msg('Creating account…');const {data,error}=await supabase.auth.signUp({email:email(),password:pass()});"
new="wrap.querySelector('#qcSignUp').onclick=async()=>{if(!settingBool('registrations_enabled',true)){msg('New explorer registrations are temporarily closed by the Expedition Command Center.');return}msg('Creating account…');const {data,error}=await supabase.auth.signUp({email:email(),password:pass()});"
if old in s:s=s.replace(old,new,1)
old="window.startGame=function(){const chosenAge=state.age,chosenDifficulty=state.difficulty;localStartGame();state.age=chosenAge;state.difficulty=chosenDifficulty;if(window.QuizyCloud.user){pullCloudProfile().then(()=>{state.age=chosenAge;state.difficulty=chosenDifficulty;saveCloudProfile();saveProgress();render();});}};"
new="window.startGame=function(){if(settingBool('maintenance_mode',false)){alert('Quizy is currently on an expedition maintenance break. Please check back shortly.');return}const chosenAge=state.age,chosenDifficulty=state.difficulty;localStartGame();state.age=chosenAge;state.difficulty=chosenDifficulty;if(window.QuizyCloud.user){trackActivity('expedition_start',{difficulty:state.difficulty,age_band:state.age});recordInstallation();pullCloudProfile().then(()=>{state.age=chosenAge;state.difficulty=chosenDifficulty;saveCloudProfile();saveProgress();render();});}};"
if old in s:s=s.replace(old,new,1)
old="window.finishLand=function(){localFinishLand();logAttempt();};"
new="window.finishLand=function(){localFinishLand();if(window.QuizyCloud.user){const l=LANDS[state.landIndex];trackActivity('expedition_complete',{land_id:l?.id||'',correct:state.landCorrect?.[l?.id]||0,total:l?.count||0});}logAttempt();};"
if old in s:s=s.replace(old,new,1)
old="(async()=>{await currentUser();await pullQuestions();try{navigator.serviceWorker?.register('/sw.js')}catch(e){}decorate();})();"
new="(async()=>{await currentUser();await loadQuizySettings();if(await checkCloudAccess())return;await trackActivity('app_open');await recordInstallation();await pullQuestions();try{navigator.serviceWorker?.register('/sw.js')}catch(e){}decorate();setTimeout(checkQuizyMessages,500);})();"
if old in s:s=s.replace(old,new,1)
p.write_text(s)
print("patched",p.stat().st_size)
