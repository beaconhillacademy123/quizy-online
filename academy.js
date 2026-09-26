/* QUIZY ACADEMY V1 */
(function(){
'use strict';

const PRIMARY_SUBJECTS=[
 {group:'Core',items:['English Language','Mathematics','Basic Science']},
 {group:'Social & Citizenship',items:['Social and Citizenship Studies']},
 {group:'Pre-Vocational',items:['Prevocational Studies']},
 {group:'Arts & Culture',items:['Cultural and Creative Arts']},
 {group:'History & Society',items:['Nigerian History']},
 {group:'Physical & Health',items:['Physical and Health Education']},
 {group:'Religious Studies',items:['Christian Religious Studies','Islamic Studies']},
 {group:'Digital & Languages',items:['Basic Digital Literacy','French Language']}
];
const JUNIOR_SUBJECTS=['English Studies','Mathematics','Intermediate Science','Social and Citizenship Studies','Digital Technologies','Cultural and Creative Arts','French'];
const SENIOR_SUBJECTS=['English Language','Mathematics','Physics','Chemistry','Biology','Economics','Geography','Government','Civic Education','Literature in English','Agricultural Science','Further Mathematics','Financial Accounting','Business Studies'];

const PILOT={
 'Year 1|First Term|Mathematics':[
  {q:'Which number comes after 4?',opts:['3','5','6','2'],a:1,exp:'The number after 4 is 5.',difficulty:'easy'},
  {q:'Which number means nothing or an empty set?',opts:['1','5','0','10'],a:2,exp:'Zero (0) represents nothing or an empty set.',difficulty:'easy'},
  {q:'Which number is the greatest: 6, 8 or 7?',opts:['6','8','7','5'],a:1,exp:'8 is greater than 6 and 7.',difficulty:'easy'},
  {q:'What is 2 + 1?',opts:['2','3','4','1'],a:1,exp:'Putting 2 and 1 together gives 3.',difficulty:'easy'},
  {q:'What is 5 − 2?',opts:['2','3','4','1'],a:1,exp:'Taking 2 away from 5 leaves 3.',difficulty:'easy'}
 ]
};

function years(){return Array.from({length:12},(_,i)=>'Year '+(i+1));}
function subjectsFor(year){
 const n=Number(String(year).replace(/\D/g,''));
 if(n<=6)return PRIMARY_SUBJECTS;
 if(n<=9)return [{group:'Junior Secondary',items:JUNIOR_SUBJECTS}];
 return [{group:'Senior Secondary',items:SENIOR_SUBJECTS}];
}
function flatSubjects(year){return subjectsFor(year).flatMap(g=>g.items);}
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
 '.academy-question{padding:28px;max-width:820px;margin:auto;text-align:center}.academy-breadcrumb{font-size:12px;color:var(--muted);font-weight:900;margin-bottom:10px}.academy-qtext{font:700 29px Fredoka,sans-serif;line-height:1.28;margin:18px auto 24px;max-width:700px}.academy-answers{display:grid;grid-template-columns:1fr 1fr;gap:11px}',
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
 state.academyQuestions=state.academyQuestions||[];
 state.academyQIndex=state.academyQIndex||0;
 state.academyScore=state.academyScore||0;
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
 '<div class="academy-field"><label>Coverage</label><select class="academy-select" disabled><option>Selected term</option></select><div class="academy-subject-note">Full-year mixing will be added with the complete question bank.</div></div>'+
 '</div>'+
 '<div class="academy-status '+(hasPilot?'ready':'info')+'" id="academyStatus">'+(hasPilot?'✅ Pilot question set ready for this selection.':'📚 This curriculum selection is registered. Its full question bank will be added from the curriculum scheme.')+'</div>'+
 '<div class="academy-actions"><button class="btn ghost" id="academyBack">🏕️ Back to Quizy</button><button class="btn primary" id="academyStart" '+(hasPilot?'':'disabled')+'>🎓 Start Academy Challenge</button></div>'+
 '<div class="academy-feature-row"><div class="academy-feature"><b>12</b><span>Year levels</span></div><div class="academy-feature"><b>3</b><span>Terms per year</span></div><div class="academy-feature"><b>⚔️</b><span>Solo + Battle ready</span></div></div></div>';

 document.getElementById('academyDifficulty').value=state.academyDifficulty;
 document.getElementById('academyMode').value=state.academyMode;
 document.getElementById('academyClass').onchange=function(){state.academyClass=this.value;state.academySubject='';academyMenu();};
 document.getElementById('academyTerm').onchange=function(){state.academyTerm=this.value;academyMenu();};
 document.getElementById('academySubject').onchange=function(){state.academySubject=this.value;academyMenu();};
 document.getElementById('academyDifficulty').onchange=function(){state.academyDifficulty=this.value;academyMenu();};
 document.getElementById('academyMode').onchange=function(){state.academyMode=this.value;academyMenu();};
 document.getElementById('academyBack').onclick=function(){state.screen='start';render();};
 document.getElementById('academyStart').onclick=startAcademy;
}

function startAcademy(){
 const key=state.academyClass+'|'+state.academyTerm+'|'+state.academySubject,source=PILOT[key];
 if(!source)return;
 state.academyQuestions=source.slice();state.academyQIndex=0;state.academyScore=0;state.screen='academyQuestion';render();
}

function academyQuestion(){
 const q=state.academyQuestions[state.academyQIndex];
 if(!q){state.screen='academyResult';render();return;}
 const app=document.getElementById('app'),pct=Math.round((state.academyQIndex/state.academyQuestions.length)*100);
 app.innerHTML='<div class="screen card academy-question">'+
 '<div class="academy-breadcrumb">🎓 Quizy Academy · '+escA(state.academyClass)+' · '+escA(state.academyTerm)+' · '+escA(state.academySubject)+'</div>'+
 '<div class="q-progress"><i style="width:'+pct+'%"></i></div><div class="q-counter">Question '+(state.academyQIndex+1)+' of '+state.academyQuestions.length+'</div>'+
 '<div class="q-icon">🎓</div><div class="academy-qtext">'+escA(q.q)+'</div>'+
 '<div class="academy-answers">'+q.opts.map((o,i)=>'<button class="academy-answer" data-a="'+i+'">'+escA(o)+'</button>').join('')+'</div>'+
 '<div class="academy-actions"><button class="btn ghost" id="academyQuit">🏕️ Exit Academy</button></div></div>';
 document.querySelectorAll('.academy-answer').forEach(b=>b.onclick=function(){academyAnswer(Number(this.dataset.a));});
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
ensureAcademyLaunch();
})();