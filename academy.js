/* QUIZY ACADEMY v1
   Separate academic mode. Uses its own renderer so the main Quizy engine stays untouched.
   Curriculum structure follows the user's requested Year 1–12 model.
*/
(function(){
  'use strict';

  const TERMS = [
    {id:'t1',name:'First Term'},
    {id:'t2',name:'Second Term'},
    {id:'t3',name:'Third Term'},
    {id:'all',name:'All Terms'}
  ];

  const PRIMARY_1_3 = [
    'English Studies','Mathematics','Nigerian Languages','Basic Science',
    'Physical & Health Education','CRS / Islamic Studies','Nigerian History',
    'Social and Citizenship Studies','Cultural & Creative Arts','Arabic Language'
  ];
  const PRIMARY_4_6 = [
    'English Studies','Mathematics','Nigerian Languages','Basic Science and Technology',
    'Physical & Health Education','Basic Digital Literacy','CRS / Islamic Studies',
    'Nigerian History','Social and Citizenship Studies','Cultural & Creative Arts',
    'Pre-vocational Studies','French','Arabic Language'
  ];
  const JSS = [
    'English Studies','Mathematics','Nigerian Languages','Intermediate Science',
    'Physical & Health Education','Digital Technologies','CRS','Islamic Studies',
    'Nigerian History','Social and Citizenship Studies','Cultural & Creative Arts',
    'Trade Subjects','Business Studies','French','Arabic Language'
  ];
  const SSS = [
    'English Language','General Mathematics','Citizenship and Heritage Studies',
    'Digital Technologies','Biology','Chemistry','Physics','Agriculture',
    'Further Mathematics','Physical Education','Health Education','Foods & Nutrition',
    'Geography','Technical Drawing','Nigerian History','Government','CRS',
    'Islamic Studies','Nigerian Language','French','Arabic','Visual Arts','Music',
    'Literature in English','Home Management','Catering Craft','Accounting',
    'Commerce','Marketing','Economics','Trade Subjects'
  ];

  const years = Array.from({length:12},(_,i)=>{
    const n=i+1;
    return {id:'y'+n,name:n<=6?'Year '+n:(n<=9?'Year '+n:'Year '+n)};
  });

  function subjectsFor(year){
    if(year<=3) return PRIMARY_1_3;
    if(year<=6) return PRIMARY_4_6;
    if(year<=9) return JSS;
    return SSS;
  }

  /* Pilot bank: deliberately small, but real and source-aligned.
     Expansion will add complete curriculum coverage without changing the UI/data model. */
  const BANK = [
    {id:'y1-m1-1',year:1,term:'t1',subject:'Mathematics',topic:'Whole Numbers 1–5',difficulty:'easy',
      q:'Which number comes after 3?',opts:['2','4','5','1'],a:1,exp:'The counting order is 1, 2, 3, 4, 5.'},
    {id:'y1-m1-2',year:1,term:'t1',subject:'Mathematics',topic:'Whole Numbers 1–5',difficulty:'medium',
      q:'Which group has 5 objects?',opts:['🍎🍎','🍎🍎🍎','🍎🍎🍎🍎','🍎🍎🍎🍎🍎'],a:3,exp:'There are five apples in the last group.'},
    {id:'y1-m1-3',year:1,term:'t1',subject:'Mathematics',topic:'Addition',difficulty:'easy',
      q:'What is 2 + 1?',opts:['2','3','4','1'],a:1,exp:'Putting one more with two gives three.'},
    {id:'y1-m1-4',year:1,term:'t1',subject:'Mathematics',topic:'Subtraction',difficulty:'medium',
      q:'You have 5 oranges and take away 2. How many remain?',opts:['2','3','4','5'],a:1,exp:'5 − 2 = 3.'},
    {id:'y1-m1-5',year:1,term:'t2',subject:'Mathematics',topic:'Ordering Numbers',difficulty:'easy',
      q:'Which number is greater?',opts:['12','9','7','5'],a:0,exp:'12 is greater than 9, 7 and 5.'},
    {id:'y1-m1-6',year:1,term:'t2',subject:'Mathematics',topic:'Money',difficulty:'medium',
      q:'Which is a Nigerian note listed in the Year 1 scheme?',opts:['₦10','₦3','₦7','₦15'],a:0,exp:'The scheme introduces ₦5, ₦10, ₦20 and ₦50 notes.'},
    {id:'y1-m1-7',year:1,term:'t3',subject:'Mathematics',topic:'Fractions',difficulty:'easy',
      q:'If a shape is divided into two equal parts, one part is called what?',opts:['A whole','A half','A triple','A ten'],a:1,exp:'One of two equal parts is one-half.'},
    {id:'y1-m1-8',year:1,term:'t3',subject:'Mathematics',topic:'Time',difficulty:'easy',
      q:'Which word means the day before today?',opts:['Tomorrow','Today','Yesterday','Morning'],a:2,exp:'Yesterday means the day before today.'},
    {id:'y1-m1-9',year:1,term:'t3',subject:'Mathematics',topic:'Shapes',difficulty:'medium',
      q:'Which shape has three sides?',opts:['Circle','Triangle','Square','Rectangle'],a:1,exp:'A triangle has three sides.'},
    {id:'y1-m1-10',year:1,term:'t3',subject:'Mathematics',topic:'Data Collection',difficulty:'medium',
      q:'A class records favourite fruits. What are they collecting?',opts:['Data','Rain','Money','Letters'],a:0,exp:'Information collected for a purpose is data.',
      media:{type:'chart',title:'Favourite fruits',items:[['Mango',4],['Orange',2],['Banana',3]]}},

    {id:'y1-e1-1',year:1,term:'t1',subject:'English Studies',topic:'Phonemic Awareness',difficulty:'easy',
      q:'Which word rhymes with cat?',opts:['dog','bat','sun','pen'],a:1,exp:'Cat and bat have the same ending sound.'},
    {id:'y1-e1-2',year:1,term:'t1',subject:'English Studies',topic:'Animal Sounds',difficulty:'easy',
      q:'Which animal makes a moo sound?',opts:['Dog','Cow','Cat','Goat'],a:1,exp:'A cow makes a moo sound.'},
    {id:'y1-e1-3',year:1,term:'t1',subject:'English Studies',topic:'Animal Sounds',difficulty:'medium',
      q:'Which animal is commonly associated with the sound “quack”?',opts:['Duck','Cow','Horse','Lion'],a:0,exp:'A duck is associated with a quack.'},
    {id:'y1-e1-4',year:1,term:'t2',subject:'English Studies',topic:'Concept of Print',difficulty:'easy',
      q:'Which part of a book usually tells you its name?',opts:['Title','Shoe','Window','Handle'],a:0,exp:'The title gives the name of a book.'},
    {id:'y1-e1-5',year:1,term:'t2',subject:'English Studies',topic:'Upper and Lower Case',difficulty:'easy',
      q:'Which is the lower-case form of B?',opts:['D','b','P','8'],a:1,exp:'The lower-case form of B is b.'},
    {id:'y1-e1-6',year:1,term:'t2',subject:'English Studies',topic:'Listening and Speaking',difficulty:'medium',
      q:'Which is a polite word to use when making a request?',opts:['Please','Move!','No!','Go!'],a:0,exp:'The scheme teaches polite requests using words such as please.'},
    {id:'y1-e1-7',year:1,term:'t3',subject:'English Studies',topic:'Comprehension',difficulty:'medium',
      q:'Read the passage, then answer the question.',
      passage:'Amina keeps her classroom clean. Every morning, she puts paper in the bin. She also reminds her friends not to drop rubbish on the floor. A clean classroom makes learning more pleasant.',
      question:'What does Amina do with paper?',opts:['She drops it on the floor.','She puts it in the bin.','She takes it home.','She hides it.'],a:1,
      exp:'The passage says that Amina puts paper in the bin.'},
    {id:'y1-e1-8',year:1,term:'t3',subject:'English Studies',topic:'Comprehension',difficulty:'medium',
      q:'Read the passage, then answer the question.',
      passage:'Tunde saves part of his pocket money. He keeps the money safely and does not spend all of it at once. He wants to save enough to buy a storybook.',
      question:'Why does Tunde save his money?',opts:['To buy a storybook','To lose it','To throw it away','To paint his room'],a:0,
      exp:'Tunde is saving enough money to buy a storybook.'},
    {id:'y1-e1-9',year:1,term:'t3',subject:'English Studies',topic:'Signs and Symbols',difficulty:'easy',
      q:'What does the plus sign + usually show?',opts:['Addition','Stopping','Sleeping','Singing'],a:0,exp:'The plus sign is used for addition.'},
    {id:'y1-e1-10',year:1,term:'t3',subject:'English Studies',topic:'Story Structure',difficulty:'hard',
      q:'A story has a beginning, middle and end. Which part usually tells how the story finishes?',opts:['Beginning','Middle','End','Title'],a:2,exp:'The end gives the conclusion of a story.'},

    {id:'y1-s1-1',year:1,term:'t1',subject:'Basic Science',topic:'Environment',difficulty:'easy',
      q:'Which place is part of our immediate environment?',opts:['School','Moon','Sun','Jupiter'],a:0,exp:'School is part of a child’s immediate environment.'},
    {id:'y1-s1-2',year:1,term:'t1',subject:'Basic Science',topic:'Senses',difficulty:'easy',
      q:'Which sense helps you hear a sound?',opts:['Sight','Hearing','Taste','Touch'],a:1,exp:'Hearing helps us detect sounds.'},
    {id:'y1-s1-3',year:1,term:'t1',subject:'Basic Science',topic:'Road Safety',difficulty:'medium',
      q:'Which traffic-light colour means stop?',opts:['Green','Yellow','Red','Blue'],a:2,exp:'Red means stop.'},
    {id:'y1-s1-4',year:1,term:'t1',subject:'Basic Science',topic:'Colours',difficulty:'easy',
      q:'Which is a primary colour?',opts:['Green','Purple','Red','Orange'],a:2,exp:'Red is one of the primary colours listed in the scheme.'},
    {id:'y1-s1-5',year:1,term:'t2',subject:'Basic Science',topic:'Living Things',difficulty:'easy',
      q:'Which is a living thing?',opts:['Stone','Plant','Chair','Cup'],a:1,exp:'Plants are living things.'},
    {id:'y1-s1-6',year:1,term:'t2',subject:'Basic Science',topic:'Plants',difficulty:'medium',
      q:'Which of these can be found as a living thing in our environment?',opts:['Plant','Spoon','Book','Desk'],a:0,exp:'Plants are living things found around us.'},
    {id:'y1-s1-7',year:1,term:'t3',subject:'Basic Science',topic:'Weather',difficulty:'easy',
      q:'Which weather condition gives us water falling from clouds?',opts:['Rain','Sunshine','Wind only','Dryness'],a:0,exp:'Rain is water falling from clouds.'},
    {id:'y1-s1-8',year:1,term:'t3',subject:'Basic Science',topic:'Materials',difficulty:'medium',
      q:'Which object is most likely made from glass?',opts:['Window pane','Banana','Leaf','Orange'],a:0,exp:'Window panes can be made from glass.'},
    {id:'y1-s1-9',year:1,term:'t3',subject:'Basic Science',topic:'Shapes',difficulty:'easy',
      q:'Which object has a shape like a ball?',opts:['Sphere','Triangle','Square','Rectangle'],a:0,exp:'A ball is an example of a sphere.'},
    {id:'y1-s1-10',year:1,term:'t3',subject:'Basic Science',topic:'Environment',difficulty:'hard',
      q:'Which action helps to keep our environment clean?',opts:['Dropping rubbish anywhere','Putting rubbish in a bin','Blocking drains','Throwing bottles on the road'],a:1,exp:'Using a bin helps keep the environment clean.'}
,
    {id:'y1-m1-11',year:1,term:'t1',subject:'Mathematics',topic:'Whole Numbers 6–9',difficulty:'easy',q:'Which number is the smallest?',opts:['7','9','6','8'],a:2,exp:'6 is smaller than 7, 8 and 9.'}
  

  const state={year:1,term:'t1',subject:'Mathematics',difficulty:'all',index:0,questions:[],answers:[],score:0,mode:'select'};

  function esc(v){
    return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function levelLabel(y){
    if(y<=6) return 'Primary';
    if(y<=9) return 'Junior Secondary';
    return 'Senior Secondary';
  }
  function qAvailable(){
    return BANK.filter(q=>q.year===state.year && q.subject===state.subject && (state.term==='all'||q.term===state.term));
  }
  function chartHtml(m){
    const max=Math.max(...m.items.map(x=>x[1]),1);
    return '<div class="qa-media"><div class="qa-media-title">'+esc(m.title)+'</div><div class="qa-chart">'+m.items.map(x=>{
      const h=Math.max(10,Math.round(x[1]/max*120));
      return '<div class="qa-bar-col"><div class="qa-bar-value">'+x[1]+'</div><div class="qa-bar" style="height:'+h+'px"></div><div class="qa-bar-label">'+esc(x[0])+'</div></div>';
    }).join('')+'</div></div>';
  }
  function mediaHtml(q){
    if(!q.media) return '';
    if(q.media.type==='chart') return chartHtml(q.media);
    return '';
  }
  function speak(text){
    if(!('speechSynthesis' in window)){alert('Read-aloud is not available on this device.');return;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(text||''));
    u.lang='en-NG'; u.rate=0.88; u.pitch=1;
    speechSynthesis.speak(u);
  }
  function renderSelect(){
    const subs=subjectsFor(state.year);
    if(!subs.includes(state.subject)) state.subject=subs[0];
    const count=qAvailable().length;
    const enough=count>=5;
    const subjectOptions=subs.map(s=>'<option value="'+esc(s)+'" '+(s===state.subject?'selected':'')+'>'+esc(s)+'</option>').join('');
    document.getElementById('app').innerHTML=
      '<div class="screen card qa-shell">'+
      '<div class="qa-head"><div><div class="qa-kicker">🎓 QUIZY ACADEMY</div><h1>School Curriculum Challenge</h1><p>Choose your class, term and subject. Quizy keeps the adventure feel while the questions stay academic.</p></div><button class="btn ghost" id="qaBack">🏕️ Back to Quizy</button></div>'+
      '<div class="qa-source">📚 Curriculum framework: Nigerian school curriculum · Questions are organised as <strong>Year → Term → Subject → Topic → Difficulty</strong>.</div>'+
      '<div class="qa-grid">'+
      '<label><span>CLASS / YEAR</span><select id="qaYear">'+years.map(y=>'<option value="'+y.id+'" '+(y.id==='y'+state.year?'selected':'')+'>'+y.name+' · '+levelLabel(state.year)+'</option>').join('')+'</select></label>'+
      '<label><span>TERM</span><select id="qaTerm">'+TERMS.map(t=>'<option value="'+t.id+'" '+(t.id===state.term?'selected':'')+'>'+t.name+'</option>').join('')+'</select></label>'+
      '<label class="qa-wide"><span>SUBJECT</span><select id="qaSubject">'+subjectOptions+'</select></label>'+
      '<label><span>DIFFICULTY</span><select id="qaDifficulty"><option value="all">Mixed Difficulty</option><option value="easy" '+(state.difficulty==='easy'?'selected':'')+'>Easy</option><option value="medium" '+(state.difficulty==='medium'?'selected':'')+'>Medium</option><option value="hard" '+(state.difficulty==='hard'?'selected':'')+'>Hard</option></select></label>'+
      '</div>'+
      '<div class="qa-status '+(enough?'ready':'waiting')+'"><strong>'+count+' question'+(count===1?'':'s')+' available</strong><span>'+ (enough?'Ready for a 5-question challenge.':'This selection is registered and awaiting its curriculum question bank.')+'</span></div>'+
      '<div class="qa-actions"><button class="btn ghost" id="qaMap">🗺️ Curriculum Map</button><button class="btn primary qa-start" id="qaStart" '+(enough?'':'disabled')+'>🎓 Start Academy Challenge</button></div>'+
      '<div class="qa-cards"><div><strong>12</strong><span>Year levels</span></div><div><strong>3</strong><span>Terms per year</span></div><div><strong>🖼️</strong><span>Images · Graphs · Charts</span></div><div><strong>🔊</strong><span>Read questions aloud</span></div><div><strong>📖</strong><span>English comprehension</span></div></div>'+
      '</div>';
    document.getElementById('qaBack').onclick=()=>{state.mode='select';window.render()};
    document.getElementById('qaYear').onchange=e=>{state.year=+e.target.value.slice(1);state.subject=subjectsFor(state.year)[0];renderSelect()};
    document.getElementById('qaTerm').onchange=e=>{state.term=e.target.value;renderSelect()};
    document.getElementById('qaSubject').onchange=e=>{state.subject=e.target.value;renderSelect()};
    document.getElementById('qaDifficulty').onchange=e=>{state.difficulty=e.target.value;renderSelect()};
    document.getElementById('qaStart').onclick=start;
    document.getElementById('qaMap').onclick=renderMap;
  }

  function filtered(){
    let qs=qAvailable();
    if(state.difficulty!=='all') qs=qs.filter(q=>q.difficulty===state.difficulty);
    return qs.slice().sort(()=>Math.random()-.5).slice(0,5);
  }

  function start(){
    const qs=filtered();
    if(qs.length<5){renderSelect();return;}
    state.questions=qs;state.answers=Array(qs.length).fill(null);state.index=0;state.score=0;state.mode='quiz';renderQuiz();
  }

  function renderQuiz(){
    const q=state.questions[state.index], answered=state.answers[state.index]!==null;
    const pct=Math.round((state.index+1)/state.questions.length*100);
    const passage=q.passage?'<div class="qa-passage"><div class="qa-passage-label">📖 Read this passage</div><p>'+esc(q.passage)+'</p></div>':'';
    const question=q.question||q.q;
    const opts=q.opts.map((o,i)=>{
      let c='answer';
      if(answered){if(i===q.a)c+=' correct';else if(i===state.answers[state.index])c+=' wrong';else c+=' dim';}
      return '<button class="'+c+'" data-qa-answer="'+i+'" '+(answered?'disabled':'')+'>'+String.fromCharCode(65+i)+'. '+esc(o)+'</button>';
    }).join('');
    document.getElementById('app').innerHTML=
      '<div class="screen qa-quiz"><div class="qa-quiz-top"><button class="btn ghost" id="qaQuit">← Academy</button><div class="q-counter">Question '+(state.index+1)+' / '+state.questions.length+'</div></div>'+
      '<div class="q-progress"><i style="width:'+pct+'%"></i></div>'+
      '<div class="qa-meta">Year '+state.year+' · '+esc(state.subject)+' · '+esc(q.topic)+' · '+esc(q.difficulty)+'</div>'+
      '<div class="question-card card"><div class="q-icon">🎓</div>'+mediaHtml(q)+passage+'<div class="q-text">'+esc(question)+'</div><button class="btn ghost voice-btn" id="qaRead">🔊 Read Question Aloud</button><div class="answers">'+opts+'</div>'+
      (answered?'<div class="feedback '+(state.answers[state.index]===q.a?'good':'bad')+'">'+(state.answers[state.index]===q.a?'🌟 Correct!':'💪 Keep learning!')+'<div class="explain">'+esc(q.exp||'')+'</div></div>':'')+
      '</div><div class="q-footer"><button class="btn ghost" id="qaPrev" '+(state.index===0?'disabled':'')+'>← Back</button><button class="btn primary" id="qaNext" '+(answered?'':'disabled')+'>'+(state.index===state.questions.length-1?'Finish Challenge ✓':'Next Question →')+'</button></div></div>';
    document.getElementById('qaQuit').onclick=renderSelect;
    document.getElementById('qaRead').onclick=()=>speak((q.passage?'Read this passage. '+q.passage+' ':'')+question);
    document.querySelectorAll('[data-qa-answer]').forEach(b=>b.onclick=()=>answer(+b.dataset.qaAnswer));
    document.getElementById('qaPrev').onclick=()=>{if(state.index>0){state.index--;renderQuiz()}};
    document.getElementById('qaNext').onclick=()=>{if(state.index===state.questions.length-1)finish();else{state.index++;renderQuiz()}};
  }

  function answer(i){
    if(state.answers[state.index]!==null)return;
    const q=state.questions[state.index];state.answers[state.index]=i;if(i===q.a)state.score++;renderQuiz();
  }

  function finish(){
    state.mode='result';
    const total=state.questions.length, pct=Math.round(state.score/total*100);
    document.getElementById('app').innerHTML='<div class="screen card qa-result"><div class="break-icon">🏆</div><div class="qa-kicker">ACADEMY CHALLENGE COMPLETE</div><h1>'+state.score+' / '+total+'</h1><p>You scored <strong>'+pct+'%</strong>.</p><div class="qa-result-grid"><div><strong>Year '+state.year+'</strong><span>'+esc(state.subject)+'</span></div><div><strong>'+esc(TERMS.find(t=>t.id===state.term)?.name||'All Terms')+'</strong><span>Curriculum challenge</span></div></div><div class="row"><button class="btn primary" id="qaAgain">🔁 Play Again</button><button class="btn ghost" id="qaHome">🎓 Academy</button><button class="btn ghost" id="qaQuizy">🏕️ Back to Quizy</button></div></div>';
    document.getElementById('qaAgain').onclick=start;
    document.getElementById('qaHome').onclick=renderSelect;
    document.getElementById('qaQuizy').onclick=()=>window.render();
  }

  function renderMap(){
    const groups=[
      ['Years 1–3','Primary foundation subjects','English Studies · Mathematics · Basic Science · Nigerian History · Social and Citizenship Studies'],
      ['Years 4–6','Primary upper years','English Studies · Mathematics · Basic Science & Technology · Digital Literacy · Pre-vocational Studies'],
      ['Years 7–9','Junior Secondary','English Studies · Mathematics · Intermediate Science · Digital Technologies · Business Studies'],
      ['Years 10–12','Senior Secondary','English Language · General Mathematics · Sciences · Humanities · Business · Trade']
    ];
    document.getElementById('app').innerHTML='<div class="screen card qa-shell"><div class="qa-head"><div><div class="qa-kicker">🗺️ CURRICULUM MAP</div><h1>Quizy Academy</h1><p>The full architecture is ready for the question bank to grow year by year.</p></div><button class="btn ghost" id="mapBack">← Academy</button></div><div class="qa-map-grid">'+groups.map(g=>'<div class="qa-map-card"><div class="qa-map-icon">📚</div><h3>'+g[0]+'</h3><strong>'+g[1]+'</strong><p>'+g[2]+'</p><small>First Term · Second Term · Third Term</small></div>').join('')+'</div><div class="qa-note">Question records support explanations, difficulty, comprehension passages, read-aloud, images, diagrams, graphs and charts. Battle integration will consume the same question-set format.</div></div>';
    document.getElementById('mapBack').onclick=renderSelect;
  }

  function injectStyle(){
    if(document.getElementById('quizyAcademyStyle'))return;
    const s=document.createElement('style');s.id='quizyAcademyStyle';s.textContent=
      '.qa-shell{padding:26px;max-width:900px;margin:auto}.qa-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.qa-head h1{margin:4px 0 6px;font-size:34px}.qa-head p{color:var(--muted);max-width:620px;line-height:1.55}.qa-kicker{font-size:12px;font-weight:1000;letter-spacing:1px;color:#6d55d9}.qa-source{margin:18px 0;padding:14px 16px;border-radius:16px;background:#f6f4ff;border:1px solid #ddd7ff;color:#4f4a6e;font-weight:700}.qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.qa-grid label{display:flex;flex-direction:column;gap:7px}.qa-grid label span{font-size:12px;font-weight:1000;color:var(--muted)}.qa-grid select{width:100%;padding:14px 15px;border:2px solid var(--line);border-radius:15px;background:#fff;color:var(--ink);font-weight:850;outline:0}.qa-grid select:focus{border-color:var(--primary);box-shadow:0 0 0 4px #635bff14}.qa-wide{grid-column:span 2}.qa-status{margin-top:16px;padding:15px 17px;border-radius:17px;display:flex;flex-direction:column;gap:3px}.qa-status.ready{background:#ecfaf0;color:#176b37}.qa-status.waiting{background:#fff7df;color:#765817}.qa-status span{font-size:13px;font-weight:700}.qa-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:20px 0}.qa-start{min-width:260px}.qa-cards{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:10px}.qa-cards>div{padding:16px 10px;border:1px solid var(--line);border-radius:17px;background:#fff;text-align:center}.qa-cards strong{display:block;font-size:25px}.qa-cards span{display:block;color:var(--muted);font-size:12px;font-weight:800;margin-top:4px}.qa-quiz{max-width:900px;margin:auto}.qa-quiz-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.qa-meta{text-align:center;color:var(--muted);font-size:12px;font-weight:900;margin:10px}.qa-passage{max-width:760px;margin:0 auto 15px;padding:16px 18px;border-left:5px solid var(--primary);border-radius:12px;background:#f8f8ff;text-align:left}.qa-passage-label{font-weight:1000;color:var(--primary);font-size:12px;text-transform:uppercase}.qa-passage p{line-height:1.7;margin:8px 0 0}.qa-media{max-width:560px;margin:0 auto 16px;padding:14px;border:1px solid var(--line);border-radius:17px;background:#fff}.qa-media-title{text-align:left;font-weight:1000;margin-bottom:8px}.qa-chart{height:180px;display:flex;align-items:flex-end;justify-content:space-around;gap:14px;border-bottom:2px solid #94a3b8;padding:0 12px}.qa-bar-col{height:170px;flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px}.qa-bar{width:min(70px,70%);background:linear-gradient(180deg,var(--primary2),var(--primary));border-radius:10px 10px 0 0}.qa-bar-value{font-weight:900;font-size:12px}.qa-bar-label{font-size:11px;font-weight:800;color:var(--muted)}.qa-result{text-align:center;padding:40px;max-width:700px;margin:auto}.qa-result h1{font-size:64px;color:var(--primary);margin:8px}.qa-result-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:24px 0}.qa-result-grid div{padding:16px;border:1px solid var(--line);border-radius:17px}.qa-result-grid strong,.qa-result-grid span{display:block}.qa-result-grid span{font-size:13px;color:var(--muted);margin-top:4px}.qa-map-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.qa-map-card{padding:18px;border:2px solid var(--line);border-radius:20px;background:#fff}.qa-map-icon{font-size:32px}.qa-map-card h3{margin:7px 0}.qa-map-card p{color:var(--muted);line-height:1.5}.qa-map-card small{font-weight:900;color:var(--primary)}.qa-note{margin-top:16px;padding:15px;border-radius:16px;background:#f5f7ff;color:#475569;font-weight:700;line-height:1.5}@media(max-width:700px){.qa-shell{padding:18px 14px}.qa-head{flex-direction:column}.qa-head h1{font-size:28px}.qa-grid{grid-template-columns:1fr}.qa-wide{grid-column:auto}.qa-cards{grid-template-columns:1fr 1fr}.qa-cards>div:last-child{grid-column:span 2}.qa-map-grid{grid-template-columns:1fr}.qa-result{padding:30px 16px}.qa-result-grid{grid-template-columns:1fr}.qa-start{width:100%}}';
    document.head.appendChild(s);
  }

  window.QuizyAcademy={open:function(){injectStyle();state.mode='select';renderSelect();}};
})();
