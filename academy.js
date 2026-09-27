/* QUIZY ACADEMY V3 — curriculum expansion + rich media + comprehension voice + update centre */
(function(){
'use strict';

const PRIMARY_1_3_SUBJECTS=[
 {group:'Core',items:['English Language','Mathematics','Basic Science']},
 {group:'Social & Citizenship',items:['Social and Citizenship Studies']},
 {group:'History & Society',items:['Nigerian History']},
 {group:'Arts & Culture',items:['Cultural and Creative Arts']},
 {group:'Physical & Health',items:['Physical and Health Education']},
 {group:'Religious Studies',items:['Christian Religious Studies','Islamic Studies']}
];
const PRIMARY_4_6_SUBJECTS=[
 {group:'Core',items:['English Language','Mathematics','Basic Science & Technology']},
 {group:'Social & Citizenship',items:['Social and Citizenship Studies']},
 {group:'History & Society',items:['Nigerian History']},
 {group:'Arts & Culture',items:['Cultural and Creative Arts']},
 {group:'Physical & Health',items:['Physical and Health Education']},
 {group:'Religious Studies',items:['Christian Religious Studies','Islamic Studies']},
 {group:'Pre-Vocational',items:['Prevocational Studies']},
 {group:'Digital & Languages',items:['Basic Digital Literacy','French Language']}
];
const JUNIOR_SUBJECT_GROUPS=[
 {group:'Core',items:['English Studies','Mathematics','Basic Science']},
 {group:'Society & Citizenship',items:['Social and Citizenship Studies','Nigerian History']},
 {group:'Business & Digital',items:['Business Studies','Digital Technologies']},
 {group:'Arts & Life Skills',items:['Cultural and Creative Arts','Physical and Health Education']},
 {group:'Religious Studies',items:['Christian Religious Studies','Islamic Religious Studies']},
 {group:'Languages',items:['French']}
];
const SENIOR_SUBJECT_GROUPS=[
 {group:'Core & Sciences',items:['English Language','Mathematics','Physics','Chemistry','Biology']},
 {group:'Social Sciences',items:['Economics','Geography','Government']},
 {group:'Business',items:['Commerce','Financial Accounting','Business Studies']},
 {group:'Humanities & Languages',items:['Literature in English','French']},
 {group:'Technology & Applied',items:['Digital Technologies','Agricultural Science','Further Mathematics','Technical Drawing']},
 {group:'Religious Studies',items:['Christian Religious Studies','Islamic Religious Studies']}
];

/*
 * Curriculum source note:
 * The Academy catalogue is being aligned to the supplied 2025 NERDC schemes.
 * The PDFs are the curriculum reference; question content will be populated
 * term-by-term instead of inventing a full 12-year bank in one deployment.
 * Visual questions support diagrams, charts, tables and images through q.media.
 * English comprehension is represented by q.passage and can be read aloud.
 */
const PILOT={
 'Year 1|First Term|English Language':[
  {passage:'Tunde woke up early on Saturday morning. He helped his mother sweep the compound before breakfast. After eating, he packed his books and went to the library with his sister.',q:'What did Tunde do before breakfast?',opts:['He went to school','He swept the compound','He played football','He went to the market'],a:1,exp:'The passage says Tunde helped his mother sweep the compound before breakfast.',difficulty:'easy'},
  {passage:'Tunde woke up early on Saturday morning. He helped his mother sweep the compound before breakfast. After eating, he packed his books and went to the library with his sister.',q:'Where did Tunde go after eating?',opts:['The farm','The market','The library','The playground'],a:2,exp:'After eating, Tunde packed his books and went to the library with his sister.',difficulty:'easy'},
  {q:'Which word is a noun?',opts:['Quickly','School','Run','Beautiful'],a:1,exp:'School is a noun because it names a place.',difficulty:'easy'},
  {q:'Choose the word that completes the sentence: She ___ to school every day.',opts:['go','goes','going','gone'],a:1,exp:'With “she” in the simple present tense, we use “goes”.',difficulty:'easy'},
  {q:'Which word means the opposite of “big”?',opts:['Tall','Small','Long','Wide'],a:1,exp:'Small is the opposite of big.',difficulty:'easy'}
 ],
 'Year 1|First Term|Basic Science':[
  {q:'Which of these is a living thing?',opts:['Stone','Chair','Goat','Spoon'],a:2,exp:'A goat is a living thing because it grows, breathes and needs food.',difficulty:'easy'},
  {q:'Which part of the body helps us to see?',opts:['Ear','Eye','Nose','Hand'],a:1,exp:'We use our eyes for seeing.',difficulty:'easy'},
  {q:'Which of these gives us light during the day?',opts:['The Sun','A shoe','A table','A book'],a:0,exp:'The Sun provides natural light during the day.',difficulty:'easy'},
  {q:'Which of these is used for drinking water?',opts:['Cup','Shoe','Pencil','Book'],a:0,exp:'A cup is commonly used for drinking water.',difficulty:'easy'},
  {q:'Which sense organ helps us hear sounds?',opts:['Eye','Ear','Tongue','Skin'],a:1,exp:'We use our ears to hear sounds.',difficulty:'easy'}
 ],

 'Year 1|First Term|Mathematics':[
  {q:'Which number comes after 4?',opts:['3','5','6','2'],a:1,exp:'The number after 4 is 5.',difficulty:'easy'},
  {q:'How many apples are shown?',opts:['2','3','4','5'],a:1,exp:'There are three apples in the picture.',difficulty:'easy',media:{type:'diagram',label:'Count the apples',svg:'<svg viewBox="0 0 360 120" role="img" aria-label="Three apples"><rect width="360" height="120" rx="20" fill="#f8fbff"/><g transform="translate(55 25)"><circle cx="25" cy="42" r="25" fill="#ef4444"/><path d="M25 17Q20 4 9 8" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/><circle cx="145" cy="42" r="25" fill="#ef4444"/><path d="M145 17Q140 4 129 8" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/><circle cx="265" cy="42" r="25" fill="#ef4444"/><path d="M265 17Q260 4 249 8" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/></g></svg>'}},
  {q:'Which number means nothing or an empty set?',opts:['1','5','0','10'],a:2,exp:'Zero (0) represents nothing or an empty set.',difficulty:'easy'},
  {q:'Which number is the greatest: 6, 8 or 7?',opts:['6','8','7','5'],a:1,exp:'8 is greater than 6 and 7.',difficulty:'easy'},
  {passage:'Amina visited her grandmother during the holiday. Her grandmother showed her a small garden behind the house. Amina helped to water the vegetables and picked three ripe tomatoes.',q:'How many ripe tomatoes did Amina pick?',opts:['One','Two','Three','Five'],a:2,exp:'The passage says Amina picked three ripe tomatoes.',difficulty:'easy'},
  {q:'What is 2 + 1?',opts:['2','3','4','1'],a:1,exp:'Putting 2 and 1 together gives 3.',difficulty:'easy'}
 ],
 'Year 7|Third Term|Mathematics':[
  {q:'Study the bar chart. Which category has the highest value?',opts:['A','B','C','D'],a:2,exp:'Category C is the tallest bar, so it has the highest value.',difficulty:'medium',media:{type:'chart',label:'Bar chart — data presentation',svg:'<svg viewBox="0 0 520 300" role="img" aria-label="Bar chart with A at 4, B at 6, C at 9 and D at 5"><rect width="520" height="300" rx="18" fill="#f8fbff"/><line x1="70" y1="245" x2="480" y2="245" stroke="#64748b" stroke-width="2"/><line x1="70" y1="35" x2="70" y2="245" stroke="#64748b" stroke-width="2"/><g fill="#635bff"><rect x="105" y="151" width="65" height="94" rx="8"/><rect x="205" y="104" width="65" height="141" rx="8"/><rect x="305" y="57" width="65" height="188" rx="8"/><rect x="405" y="128" width="65" height="117" rx="8"/></g><g font-family="Arial" font-size="18" font-weight="700" fill="#18233a"><text x="130" y="272">A</text><text x="230" y="272">B</text><text x="330" y="272">C</text><text x="430" y="272">D</text><text x="128" y="142">4</text><text x="228" y="95">6</text><text x="328" y="48">9</text><text x="428" y="119">5</text></g></svg>'}}
 ]
};

function years(){return Array.from({length:12},(_,i)=>'Year '+(i+1));}
function subjectsFor(year){
 const n=Number(String(year).replace(/\D/g,''));
 if(n<=3)return PRIMARY_1_3_SUBJECTS;
 if(n<=6)return PRIMARY_4_6_SUBJECTS;
 if(n<=9)return JUNIOR_SUBJECT_GROUPS;
 return SENIOR_SUBJECT_GROUPS;
}
function flatSubjects(year){return subjectsFor(year).flatMap(g=>g.items);}
function speakAcademy(text){try{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.rate=0.92;u.pitch=1;u.volume=1;window.speechSynthesis.speak(u);}catch(e){console.warn('Academy voice:',e)}}
function escA(v){return String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

function injectStyles(){
 if(document.getElementById('quizyAcademyStyles'))return;
 const st=document.createElement('style');st.id='quizyAcademyStyles';
 st.textContent=[
 '.academy-wrap{padding:26px;max-width:900px;margin:auto}',
 '.academy-hero{padding:28px;text-align:center;background:linear-gradient(145deg,#f5f2ff,#eefaff 55%,#effcf5);border-radius:26px;border:1px solid #fff;box-shadow:0 20px 55px rgba(24,35,58,.11)}',
 '.academy-icon{font-size:58px;line-height:1}.academy-title{font:700 38px Fredoka,sans-serif;margin:6px 0}.academy-sub{color:var(--muted);font-weight:700;margin:0 auto;max-width:650px;line-height:1.5}',
 '.academy-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:18px 0}.academy-field{padding:14px;border:1px solid var(--line);border-radius:18px;background:#fff;text-align:left}',
 '.academy-field label{display:block;font-size:11px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:7px}.academy-select{width:100%;padding:13px 14px;border:2px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);font:inherit;font-weight:850;outline:0}',
 '.academy-select:focus{border-color:var(--primary);box-shadow:0 0 0 4px #635bff14}.academy-subject-note{font-size:12px;color:var(--muted);margin-top:7px;line-height:1.4}',
 '.academy-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:18px}.academy-status{margin:14px auto 0;padding:12px 14px;border-radius:15px;background:#f5f7ff;color:#526078;font-weight:800;font-size:13px}.academy-status.ready{background:#ecfaf0;color:#18743a}.academy-status.info{background:#fff8df;color:#7a5711}',
 '.academy-feature-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.academy-feature{padding:13px;border:1px solid var(--line);border-radius:17px;background:#fff;text-align:center}.academy-feature b{display:block;font-size:22px}.academy-feature span{font-size:11px;color:var(--muted);font-weight:800}',
 '.academy-question{padding:28px;max-width:820px;margin:auto;text-align:center}.academy-media{margin:16px auto 20px;max-width:720px;padding:12px;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(24,35,58,.06)}.academy-media-label{font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--muted);font-weight:900;margin-bottom:8px}.academy-media svg{display:block;width:100%;height:auto}.academy-media img{display:block;width:100%;height:auto;max-height:320px;object-fit:contain;border-radius:12px}.academy-media table{width:100%;border-collapse:collapse;font-size:13px}.academy-media th,.academy-media td{padding:8px;border:1px solid var(--line);text-align:center}.academy-media th{background:#f5f7ff;font-weight:900}.academy-breadcrumb{font-size:12px;color:var(--muted);font-weight:900;margin-bottom:10px}.academy-qtext{font:700 29px Fredoka,sans-serif;line-height:1.28;margin:18px auto 24px;max-width:700px}.academy-answers{display:grid;grid-template-columns:1fr 1fr;gap:11px}',
 '.academy-answer{padding:16px;border:2px solid var(--line);border-radius:15px;background:#fff;text-align:left;font-weight:900;cursor:pointer}.academy-answer:hover{border-color:var(--primary);background:#f8f7ff}.academy-answer.correct{background:#eaf8ef;border-color:#55bf76;color:#137536}.academy-answer.wrong{background:#fff0f0;border-color:#f38b8b;color:#b42323}',
 '.academy-result{padding:35px;text-align:center}.academy-score{font:700 56px Fredoka,sans-serif;color:var(--primary);margin:10px}.academy-result p{color:var(--muted);font-weight:750}',
 '@media(max-width:700px){.academy-wrap{padding:16px}.academy-grid{grid-template-columns:1fr}.academy-feature-row{grid-template-columns:1fr}.academy-title{font-size:32px}.academy-qtext{font-size:23px}.academy-answers{grid-template-columns:1fr}.academy-question{padding:18px 10px}}'
 ].join('');
 document.head.appendChild(st);
}

function initState(){
 state.academyClass=state.academyClass||'Year 1';
 state.academyTerm=state.academyTerm||'First Term';
 state.academySubject=state.academySubject||'Mathematics';
 state.academyDifficulty=state.academyDifficulty||'easy';
 state.academyMode=state.academyMode||'Solo';
 state.academyCoverage=state.academyCoverage||'term';
 state.academyQuestions=state.academyQuestions||[];
 state.academyQIndex=state.academyQIndex||0;
 state.academyScore=state.academyScore||0;
}

function academyCurriculumModal(){
 const existing=document.getElementById('academyCurriculumOverlay');if(existing){existing.remove();return;}
 const overlay=document.createElement('div');overlay.id='academyCurriculumOverlay';
 overlay.style.cssText='position:fixed;inset:0;z-index:10050;background:rgba(7,18,34,.68);backdrop-filter:blur(6px);display:grid;place-items:center;padding:16px';
 const groups=subjectsFor(state.academyClass);
 const mapped=groups.reduce((n,g)=>n+g.items.length,0);
 overlay.innerHTML='<div style="width:min(760px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:26px;padding:22px;box-shadow:0 25px 80px rgba(0,0,0,.3)">'+
 '<div style="text-align:center"><div style="font-size:46px">🗺️</div><h2 style="margin:4px 0">Academy Curriculum Map</h2><p style="color:var(--muted);font-weight:700;margin:0">'+escA(state.academyClass)+' · 2025 curriculum reference</p></div>'+
 '<div style="margin:16px 0;padding:13px;border-radius:16px;background:#f5f7ff;color:#526078;font-weight:800;font-size:13px;line-height:1.5">'+mapped+' subject entries are mapped for this class. The question bank is being populated term-by-term from the supplied curriculum schemes. We will not fill missing areas with made-up curriculum content.</div>'+
 '<div style="display:grid;gap:10px">'+groups.map(g=>'<div style="border:1px solid var(--line);border-radius:18px;padding:14px"><div style="font-weight:900;margin-bottom:8px">📚 '+escA(g.group)+'</div><div style="display:flex;gap:7px;flex-wrap:wrap">'+g.items.map(s=>'<span style="padding:7px 10px;border-radius:999px;background:#f7f8fb;border:1px solid var(--line);font-size:12px;font-weight:800">'+escA(s)+'</span>').join('')+'</div></div>').join('')+'</div>'+
 '<div style="display:flex;justify-content:center;gap:9px;margin-top:18px"><button class="btn primary" id="academyMapClose">Close Map</button></div></div>';
 document.body.appendChild(overlay);
 document.getElementById('academyMapClose').onclick=function(){overlay.remove();};
 overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.remove();});
}
 
function academyMenu(){
 initState();
 const yearList=years(),groups=subjectsFor(state.academyClass);
 const available=flatSubjects(state.academyClass);
 if(!available.includes(state.academySubject))state.academySubject=available[0];
 const subjectOptions=groups.map(g=>'<optgroup label="'+escA(g.group)+'">'+g.items.map(s=>'<option value="'+escA(s)+'" '+(s===state.academySubject?'selected':'')+'>'+escA(s)+'</option>').join('')+'</optgroup>').join('');
 const key=state.academyClass+'|'+state.academyTerm+'|'+state.academySubject,hasPilot=!!PILOT[key];
 const app=document.getElementById('app');
 app.innerHTML='<div class="screen card academy-wrap">'+
 '<div class="academy-hero"><div class="academy-icon">🎓📚</div><div class="academy-title">Quizy Academy</div><p class="academy-sub">School Curriculum Challenge — choose your class, term, subject and difficulty, then enter the Quizy academic adventure.</p></div>'+
 '<div class="academy-grid">'+
 '<div class="academy-field"><label>Class</label><select id="academyClass" class="academy-select">'+yearList.map(y=>'<option '+(y===state.academyClass?'selected':'')+'>'+y+'</option>').join('')+'</select></div>'+
 '<div class="academy-field"><label>Term</label><select id="academyTerm" class="academy-select"><option '+(state.academyTerm==='First Term'?'selected':'')+'>First Term</option><option '+(state.academyTerm==='Second Term'?'selected':'')+'>Second Term</option><option '+(state.academyTerm==='Third Term'?'selected':'')+'>Third Term</option></select></div>'+
 '<div class="academy-field"><label>Subject</label><select id="academySubject" class="academy-select">'+subjectOptions+'</select><div class="academy-subject-note">Subjects are grouped to keep the screen clean.</div></div>'+
 '<div class="academy-field"><label>Difficulty</label><select id="academyDifficulty" class="academy-select"><option value="easy">🌱 Easy</option><option value="medium">⭐ Medium</option><option value="difficult">🔥 Difficult</option><option value="advanced">⚔️ Advanced</option></select></div>'+
 '<div class="academy-field"><label>Play Mode</label><select id="academyMode" class="academy-select"><option>Solo</option><option>Online Battle</option><option>Bluetooth Battle</option></select><div class="academy-subject-note">Battle modes remain part of the Quizy experience.</div></div>'+
 '<div class="academy-field"><label>Coverage</label><select id="academyCoverage" class="academy-select"><option value="term">Selected term</option><option value="year">Full Academic Year</option></select><div class="academy-subject-note">Choose one term or eventually mix questions across all three terms.</div></div>'+
 '</div>'+
 '<div class="academy-status '+(hasPilot?'ready':'info')+'" id="academyStatus">'+(hasPilot?'✅ Pilot question set ready for this selection.':'📚 This curriculum selection is registered. Its full question bank will be added from the curriculum scheme.')+'</div>'+
 '<div class="academy-actions"><button class="btn ghost" id="academyBack">🏕️ Back to Quizy</button><button class="btn ghost" id="academyMap">🗺️ Curriculum Map</button><button class="btn primary" id="academyStart" '+(hasPilot?'':'disabled')+'>🎓 Start Academy Challenge</button></div>'+
 '<div class="academy-feature-row"><div class="academy-feature"><b>12</b><span>Year levels</span></div><div class="academy-feature"><b>3</b><span>Terms per year</span></div><div class="academy-feature"><b>🖼️</b><span>Images · Graphs · Charts</span></div></div></div>';

 document.getElementById('academyDifficulty').value=state.academyDifficulty;
 document.getElementById('academyCoverage').value=state.academyCoverage;
 document.getElementById('academyMode').value=state.academyMode;
 document.getElementById('academyClass').onchange=function(){state.academyClass=this.value;state.academySubject='';academyMenu();};
 document.getElementById('academyTerm').onchange=function(){state.academyTerm=this.value;academyMenu();};
 document.getElementById('academySubject').onchange=function(){state.academySubject=this.value;academyMenu();};
 document.getElementById('academyDifficulty').onchange=function(){state.academyDifficulty=this.value;academyMenu();};
 document.getElementById('academyMode').onchange=function(){state.academyMode=this.value;academyMenu();};
 document.getElementById('academyCoverage').onchange=function(){state.academyCoverage=this.value;academyMenu();};
 document.getElementById('academyBack').onclick=function(){state.screen='start';render();};
 document.getElementById('academyStart').onclick=startAcademy;
}

function startAcademy(){
 const key=state.academyClass+'|'+state.academyTerm+'|'+state.academySubject;
 let source=PILOT[key]||[];
 if(state.academyCoverage==='year'){
  source=[];
  ['First Term','Second Term','Third Term'].forEach(function(t){const s=PILOT[state.academyClass+'|'+t+'|'+state.academySubject];if(s)source=source.concat(s);});
 }
 if(state.academyMode==='Online Battle' && typeof onlineBattleLaunch==='function'){state.academyBattleQuestions=source.slice();onlineBattleLaunch();return;}
 if(state.academyMode==='Bluetooth Battle' && typeof battleMenu==='function'){state.academyBattleQuestions=source.slice();battleMenu();return;}
 if(!source)return;
 state.academyQuestions=source.slice();state.academyQIndex=0;state.academyScore=0;state.screen='academyQuestion';render();
 const first=state.academyQuestions[0];if(first)speakAcademy((first.passage?first.passage+' ':'')+first.q);
}

function academyMedia(q){
 const m=q&&q.media;if(!m)return '';
 if(m.type==='image'&&m.src)return '<div class="academy-media"><div class="academy-media-label">'+escA(m.label||'Study the image')+'</div><img src="'+escA(m.src)+'" alt="'+escA(m.alt||m.label||'Question image')+'"></div>';
 if(m.type==='diagram'||m.type==='chart')return '<div class="academy-media"><div class="academy-media-label">'+escA(m.label||'Study the diagram')+'</div>'+String(m.svg||'')+'</div>';
 if(m.type==='table'&&Array.isArray(m.headers)&&Array.isArray(m.rows)){const h=m.headers.map(x=>'<th>'+escA(x)+'</th>').join('');const rows=m.rows.map(r=>'<tr>'+r.map(x=>'<td>'+escA(x)+'</td>').join('')+'</tr>').join('');return '<div class="academy-media"><div class="academy-media-label">'+escA(m.label||'Study the table')+'</div><table><thead><tr>'+h+'</tr></thead><tbody>'+rows+'</tbody></table></div>';}
 return '';
}

function academyQuestion(){
 const q=state.academyQuestions[state.academyQIndex];
 if(!q){state.screen='academyResult';render();return;}
 const app=document.getElementById('app'),pct=Math.round((state.academyQIndex/state.academyQuestions.length)*100);
 app.innerHTML='<div class="screen card academy-question">'+
 '<div class="academy-breadcrumb">🎓 Quizy Academy · '+escA(state.academyClass)+' · '+escA(state.academyTerm)+' · '+escA(state.academySubject)+'</div>'+
 '<div class="q-progress"><i style="width:'+pct+'%"></i></div><div class="q-counter">Question '+(state.academyQIndex+1)+' of '+state.academyQuestions.length+'</div>'+
 '<div class="q-icon">🎓</div>'+(q.passage?'<div class="academy-passage"><div class="academy-media-label">READING COMPREHENSION</div><div>'+escA(q.passage)+'</div><button class="btn ghost" id="academyReadPassage" style="margin-top:10px">🔊 Read Passage</button></div>':'')+academyMedia(q)+'<div class="academy-qtext">'+escA(q.q)+'</div><button class="btn ghost" id="academyReadQuestion" style="margin-bottom:14px">🔊 Read Question</button>'+
 '<div class="academy-answers">'+q.opts.map((o,i)=>'<button class="academy-answer" data-a="'+i+'">'+escA(o)+'</button>').join('')+'</div>'+
 '<div class="academy-actions"><button class="btn ghost" id="academyQuit">🏕️ Exit Academy</button></div></div>';
 document.querySelectorAll('.academy-answer').forEach(b=>b.onclick=function(){academyAnswer(Number(this.dataset.a));});
 const rp=document.getElementById('academyReadPassage');if(rp)rp.onclick=function(){speakAcademy(q.passage)};
 const rq=document.getElementById('academyReadQuestion');if(rq)rq.onclick=function(){speakAcademy(q.q+' '+q.opts.map((x,i)=>String.fromCharCode(65+i)+'. '+x).join('. '))};
 speakAcademy(q.passage?q.passage+' '+q.q:q.q);
 document.getElementById('academyQuit').onclick=function(){state.screen='academy';render();};
}

function academyAnswer(i){
 const q=state.academyQuestions[state.academyQIndex],buttons=[...document.querySelectorAll('.academy-answer')];
 buttons.forEach(b=>b.disabled=true);
 const ok=i===q.a;if(ok)state.academyScore++;
 if(buttons[q.a])buttons[q.a].classList.add('correct');if(!ok&&buttons[i])buttons[i].classList.add('wrong');
 const fb=document.createElement('div');fb.className='feedback '+(ok?'good':'bad');
 fb.innerHTML=(ok?'Correct! ⭐ ':'Not quite. ')+'<div class="explain">'+escA(q.exp||'')+'</div><button class="btn primary" id="academyNext" style="margin-top:10px">Continue ➜</button>';
 document.querySelector('.academy-question').appendChild(fb);
 document.getElementById('academyNext').onclick=function(){state.academyQIndex++;render();};
}

function academyResultView(){
 const total=state.academyQuestions.length||1,pct=Math.round(state.academyScore/total*100);
 document.getElementById('app').innerHTML='<div class="screen card academy-result"><div style="font-size:62px">🏆</div><h2>Academy Challenge Complete!</h2><div class="academy-score">'+state.academyScore+'/'+total+'</div><p>'+pct+'% correct · '+escA(state.academyClass)+' · '+escA(state.academyTerm)+' · '+escA(state.academySubject)+'</p><div class="academy-actions"><button class="btn primary" id="academyAgain">🔁 Try Again</button><button class="btn ghost" id="academyChoose">📚 Choose Another</button></div></div>';
 document.getElementById('academyAgain').onclick=startAcademy;
 document.getElementById('academyChoose').onclick=function(){state.screen='academy';render();};
}

const previousRender=window.render;
window.render=function(){
 if(state.screen==='academy'){injectStyles();academyMenu();return;}
 if(state.screen==='academyQuestion'){injectStyles();academyQuestion();return;}
 if(state.screen==='academyResult'){injectStyles();academyResultView();return;}
 previousRender();
 if(state.screen==='start'){
  const actions=document.querySelector('.start-actions');
  if(actions&&!document.getElementById('academyLaunch')){
   const b=document.createElement('button');b.className='btn ghost';b.id='academyLaunch';b.style.marginTop='9px';b.textContent='🎓 Quizy Academy';
   b.onclick=function(){initState();state.screen='academy';render();};actions.appendChild(b);
  }
 }
};

function ensureAcademyLaunch(){
 try{
  if(typeof state==='undefined'||state.screen!=='start')return;
  const actions=document.querySelector('.start-actions');
  if(actions&&!document.getElementById('academyLaunch')){
   const b=document.createElement('button');b.className='btn ghost';b.id='academyLaunch';b.style.marginTop='9px';b.textContent='🎓 Quizy Academy';
   b.onclick=function(){initState();state.screen='academy';render();};actions.appendChild(b);
  }
 }catch(e){console.warn('Quizy Academy launch hook:',e)}
}
/* QUIZY ACADEMY V3 — What's New integration and curriculum metadata */
const ACADEMY_BUILD='3.1';
const ACADEMY_UPDATE={icon:'🎓',title:'Quizy Academy expanded',tag:'NEW',text:'Quizy Academy now includes a Curriculum Map so parents and pupils can see the curriculum structure for the selected year without a crowded screen. The Academy continues to support Year 1–12 selection, term and subject filtering, comprehension passages, system read-aloud, and rich question media such as diagrams, charts, tables and images. Question banks are being populated term-by-term from the supplied 2025 curriculum schemes.'};
function injectAcademyUpdate(){
 try{
  const list=document.querySelector('.quizy-update-list');
  if(!list || list.querySelector('[data-quizy-academy-update]'))return;
  const item=document.createElement('div');item.className='quizy-update-item';item.setAttribute('data-quizy-academy-update','1');
  item.innerHTML='<div class="quizy-update-item-icon">'+ACADEMY_UPDATE.icon+'</div><div class="quizy-update-item-body"><div class="quizy-update-item-title">'+ACADEMY_UPDATE.title+'<span class="quizy-update-tag">'+ACADEMY_UPDATE.tag+'</span></div><div class="quizy-update-item-text">'+ACADEMY_UPDATE.text+'</div></div>';
  list.prepend(item);
  const version=document.querySelector('.quizy-update-card [style*="text-align:center"][style*="font-size:11px"]');
  if(version && /Quizy Update v/.test(version.textContent))version.textContent='Quizy Update v2.6 · Academy '+ACADEMY_BUILD;
 }catch(e){console.warn('Quizy Academy update centre:',e)}
}
const academyUpdateObserver=new MutationObserver(injectAcademyUpdate);
academyUpdateObserver.observe(document.body,{childList:true,subtree:true});
setTimeout(injectAcademyUpdate,300);

ensureAcademyLaunch();
})();