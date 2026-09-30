/* QUIZY ACADEMY v3
   Clean rebuild of the academic mode.
   Architecture: Year -> Term -> Subject -> Topic -> Difficulty -> Question.
   Media-ready: comprehension, read-aloud, charts, diagrams and images.
   The existing Quizy engine remains untouched.
*/
(function(){
  'use strict';

  const TERMS=[
    {id:'t1',name:'First Term'},
    {id:'t2',name:'Second Term'},
    {id:'t3',name:'Third Term'},
    {id:'all',name:'All Terms'}
  ];

  const PRIMARY_1_3=[
    'English Language','Mathematics','Basic Science','Physical and Health Education',
    'Christian Religious Studies','Islamic Studies','Nigerian History',
    'Social and Citizenship Studies','Cultural and Creative Arts'
  ];

  const PRIMARY_4_6=[
    'English Language','Mathematics','Basic Science and Technology',
    'Physical and Health Education','Christian Religious Studies',
    'Islamic Religious Studies','Nigerian History','Social and Citizenship Studies',
    'Cultural and Creative Arts','Basic Digital Literacy','Prevocational Studies',
    'French Language'
  ];

  const JSS=[
    'English Studies','Mathematics','Nigerian Languages','Intermediate Science',
    'Physical & Health Education','Digital Technologies','CRS','Islamic Studies',
    'Nigerian History','Social and Citizenship Studies','Cultural & Creative Arts',
    'Trade Subjects','Business Studies','French','Arabic Language'
  ];

  const SSS=[
    'English Language','General Mathematics','Citizenship and Heritage Studies',
    'Digital Technologies','Biology','Chemistry','Physics','Agriculture',
    'Further Mathematics','Physical Education','Health Education','Foods & Nutrition',
    'Geography','Technical Drawing','Nigerian History','Government','CRS',
    'Islamic Studies','Nigerian Language','French','Arabic','Visual Arts','Music',
    'Literature in English','Home Management','Catering Craft','Accounting',
    'Commerce','Marketing','Economics','Trade Subjects'
  ];

  const YEARS=Array.from({length:12},(_,i)=>({id:i+1,name:'Year '+(i+1)}));

  function subjectsFor(year){
    if(year<=3) return PRIMARY_1_3;
    if(year<=6) return PRIMARY_4_6;
    if(year<=9) return JSS;
    return SSS;
  }

  /* Initial verified pilot bank.
     The data model is deliberately complete before the bank is scaled to Years 1–12. */
  const BANK=[
    {
      id:'y1-m-t1-01',year:1,term:'t1',subject:'Mathematics',
      topic:'Whole Numbers',difficulty:'easy',
      q:'Which number comes after 3?',
      opts:['2','4','5','1'],a:1,
      exp:'The counting order is 1, 2, 3, 4, 5.'
    },
    {
      id:'y1-m-t1-02',year:1,term:'t1',subject:'Mathematics',
      topic:'Whole Numbers',difficulty:'medium',
      q:'Which group has 5 objects?',
      opts:['🍎🍎','🍎🍎🍎','🍎🍎🍎🍎','🍎🍎🍎🍎🍎'],a:3,
      exp:'There are five apples in the last group.'
    },
    {
      id:'y1-m-t1-03',year:1,term:'t1',subject:'Mathematics',
      topic:'Addition',difficulty:'easy',
      q:'What is 2 + 1?',
      opts:['2','3','4','1'],a:1,
      exp:'Putting one more with two gives three.'
    },
    {
      id:'y1-m-t1-04',year:1,term:'t1',subject:'Mathematics',
      topic:'Subtraction',difficulty:'medium',
      q:'You have 5 oranges and take away 2. How many remain?',
      opts:['2','3','4','5'],a:1,
      exp:'5 − 2 = 3.'
    },
    {
      id:'y1-m-t2-01',year:1,term:'t2',subject:'Mathematics',
      topic:'Ordering Numbers',difficulty:'easy',
      q:'Which number is greater?',
      opts:['12','9','7','5'],a:0,
      exp:'12 is greater than 9, 7 and 5.'
    },
    {
      id:'y1-m-t2-02',year:1,term:'t2',subject:'Mathematics',
      topic:'Money',difficulty:'medium',
      q:'Which is one of the Nigerian notes introduced in the Year 1 scheme?',
      opts:['₦10','₦3','₦7','₦15'],a:0,
      exp:'The supplied scheme introduces ₦5, ₦10, ₦20 and ₦50 notes.'
    },
    {
      id:'y1-m-t3-01',year:1,term:'t3',subject:'Mathematics',
      topic:'Fractions',difficulty:'easy',
      q:'If a shape is divided into two equal parts, one part is called what?',
      opts:['A whole','A half','A triple','A ten'],a:1,
      exp:'One of two equal parts is one-half.'
    },
    {
      id:'y1-m-t3-02',year:1,term:'t3',subject:'Mathematics',
      topic:'Shapes',difficulty:'medium',
      q:'Which shape has three sides?',
      opts:['Circle','Triangle','Square','Rectangle'],a:1,
      exp:'A triangle has three sides.'
    },
    {
      id:'y1-m-t3-03',year:1,term:'t3',subject:'Mathematics',
      topic:'Data Collection',difficulty:'medium',
      q:'A class records favourite fruits. What are they collecting?',
      opts:['Data','Rain','Money','Letters'],a:0,
      exp:'Information collected for a purpose is data.',
      media:{type:'chart',title:'Favourite fruits',items:[['Mango',4],['Orange',2],['Banana',3]]}
    },
    {
      id:'y1-m-t3-04',year:1,term:'t3',subject:'Mathematics',
      topic:'Time',difficulty:'easy',
      q:'Which word means the day before today?',
      opts:['Tomorrow','Today','Yesterday','Morning'],a:2,
      exp:'Yesterday means the day before today.'
    },

    {
      id:'y1-e-t1-01',year:1,term:'t1',subject:'English Language',
      topic:'Phonemic Awareness',difficulty:'easy',
      q:'Which word rhymes with cat?',
      opts:['dog','bat','sun','pen'],a:1,
      exp:'Cat and bat have the same ending sound.'
    },
    {
      id:'y1-e-t1-02',year:1,term:'t1',subject:'English Language',
      topic:'Listening and Speaking',difficulty:'easy',
      q:'Which animal makes a moo sound?',
      opts:['Dog','Cow','Cat','Goat'],a:1,
      exp:'A cow makes a moo sound.'
    },
    {
      id:'y1-e-t2-01',year:1,term:'t2',subject:'English Language',
      topic:'Concept of Print',difficulty:'easy',
      q:'Which part of a book usually tells you its name?',
      opts:['Title','Shoe','Window','Handle'],a:0,
      exp:'The title gives the name of a book.'
    },
    {
      id:'y1-e-t2-02',year:1,term:'t2',subject:'English Language',
      topic:'Upper and Lower Case',difficulty:'easy',
      q:'Which is the lower-case form of B?',
      opts:['D','b','P','8'],a:1,
      exp:'The lower-case form of B is b.'
    },
    {
      id:'y1-e-t3-01',year:1,term:'t3',subject:'English Language',
      topic:'Comprehension',difficulty:'medium',
      q:'Read the passage, then answer the question.',
      passage:'Amina keeps her classroom clean. Every morning, she puts paper in the bin. She also reminds her friends not to drop rubbish on the floor. A clean classroom makes learning more pleasant.',
      question:'What does Amina do with paper?',
      opts:['She drops it on the floor.','She puts it in the bin.','She takes it home.','She hides it.'],a:1,
      exp:'The passage says that Amina puts paper in the bin.'
    },
    {
      id:'y1-e-t3-02',year:1,term:'t3',subject:'English Language',
      topic:'Comprehension',difficulty:'medium',
      q:'Read the passage, then answer the question.',
      passage:'Tunde saves part of his pocket money. He keeps the money safely and does not spend all of it at once. He wants to save enough to buy a storybook.',
      question:'Why does Tunde save his money?',
      opts:['To buy a storybook','To lose it','To throw it away','To paint his room'],a:0,
      exp:'Tunde is saving enough money to buy a storybook.'
    },
    {
      id:'y1-e-t3-03',year:1,term:'t3',subject:'English Language',
      topic:'Story Structure',difficulty:'hard',
      q:'A story has a beginning, middle and end. Which part usually tells how the story finishes?',
      opts:['Beginning','Middle','End','Title'],a:2,
      exp:'The end gives the conclusion of a story.'
    },
    {
      id:'y1-e-t3-04',year:1,term:'t3',subject:'English Language',
      topic:'Vocabulary',difficulty:'easy',
      q:'Which word means the opposite of “big”?',
      opts:['large','small','huge','wide'],a:1,
      exp:'Small is an opposite of big.'
    },

    {
      id:'y1-s-t1-01',year:1,term:'t1',subject:'Basic Science',
      topic:'Environment',difficulty:'easy',
      q:'Which place is part of our immediate environment?',
      opts:['School','Moon','Sun','Jupiter'],a:0,
      exp:'School is part of a child’s immediate environment.'
    },
    {
      id:'y1-s-t1-02',year:1,term:'t1',subject:'Basic Science',
      topic:'Senses',difficulty:'easy',
      q:'Which sense helps you hear a sound?',
      opts:['Sight','Hearing','Taste','Touch'],a:1,
      exp:'Hearing helps us detect sounds.'
    },
    {
      id:'y1-s-t1-03',year:1,term:'t1',subject:'Basic Science',
      topic:'Road Safety',difficulty:'medium',
      q:'Which traffic-light colour means stop?',
      opts:['Green','Yellow','Red','Blue'],a:2,
      exp:'Red means stop.'
    },
    {
      id:'y1-s-t2-01',year:1,term:'t2',subject:'Basic Science',
      topic:'Living Things',difficulty:'easy',
      q:'Which is a living thing?',
      opts:['Stone','Plant','Chair','Cup'],a:1,
      exp:'Plants are living things.'
    },
    {
      id:'y1-s-t2-02',year:1,term:'t2',subject:'Basic Science',
      topic:'Plants',difficulty:'medium',
      q:'Which of these is a living thing found in our environment?',
      opts:['Plant','Spoon','Book','Desk'],a:0,
      exp:'Plants are living things found around us.'
    },
    {
      id:'y1-s-t3-01',year:1,term:'t3',subject:'Basic Science',
      topic:'Weather',difficulty:'easy',
      q:'Which weather condition gives us water falling from clouds?',
      opts:['Rain','Sunshine','Wind only','Dryness'],a:0,
      exp:'Rain is water falling from clouds.'
    },
    {
      id:'y1-s-t3-02',year:1,term:'t3',subject:'Basic Science',
      topic:'Materials',difficulty:'medium',
      q:'Which object is most likely made from glass?',
      opts:['Window pane','Banana','Leaf','Orange'],a:0,
      exp:'Window panes can be made from glass.'
    },
    {
      id:'y1-s-t3-03',year:1,term:'t3',subject:'Basic Science',
      topic:'Data and Observation',difficulty:'hard',
      q:'Look at the picture and choose the correct observation.',
      opts:['The taller plant has more leaves.','The plant is a fish.','The chart is a road.','The leaves are numbers.'],a:0,
      exp:'The diagram is designed to test observation.',
      media:{type:'diagram',title:'Simple plant observation',
        svg:'<svg viewBox="0 0 420 170" role="img" aria-label="Two plants of different heights"><rect x="0" y="0" width="420" height="170" rx="14" fill="#f6f8ff"/><line x1="25" y1="145" x2="395" y2="145" stroke="#94a3b8" stroke-width="3"/><rect x="75" y="105" width="38" height="40" rx="5" fill="#c08457"/><line x1="94" y1="105" x2="94" y2="65" stroke="#22a06b" stroke-width="8"/><circle cx="78" cy="75" r="13" fill="#4ade80"/><circle cx="110" cy="84" r="13" fill="#4ade80"/><rect x="270" y="75" width="38" height="70" rx="5" fill="#c08457"/><line x1="289" y1="75" x2="289" y2="28" stroke="#22a06b" stroke-width="8"/><circle cx="270" cy="40" r="13" fill="#4ade80"/><circle cx="308" cy="50" r="13" fill="#4ade80"/><text x="63" y="160" font-size="14" fill="#475569">Plant A</text><text x="258" y="160" font-size="14" fill="#475569">Plant B</text></svg>'}
    },

    {
      id:'y1-phe-t1-01',year:1,term:'t1',subject:'Physical and Health Education',
      topic:'Body Parts',difficulty:'easy',
      q:'Which body part helps us to see?',
      opts:['Eyes','Ears','Feet','Hands'],a:0,
      exp:'We use our eyes for seeing.'
    },
    {
      id:'y1-phe-t1-02',year:1,term:'t1',subject:'Physical and Health Education',
      topic:'Personal Hygiene',difficulty:'easy',
      q:'Which habit helps keep the body clean?',
      opts:['Bathing regularly','Never washing hands','Throwing rubbish around','Wearing dirty clothes'],a:0,
      exp:'Regular bathing is a healthy hygiene habit.'
    },
    {
      id:'y1-phe-t1-03',year:1,term:'t1',subject:'Physical and Health Education',
      topic:'Exercise',difficulty:'easy',
      q:'Which activity is exercise?',
      opts:['Running','Sleeping','Watching TV','Sitting still'],a:0,
      exp:'Running is a physical activity that exercises the body.'
    },
    {
      id:'y1-phe-t1-04',year:1,term:'t1',subject:'Physical and Health Education',
      topic:'Healthy Living',difficulty:'medium',
      q:'Why should we wash our hands before eating?',
      opts:['To help remove germs','To make our hands heavy','To change our height','To make food colder'],a:0,
      exp:'Handwashing helps remove germs.'
    },
    {
      id:'y1-phe-t1-05',year:1,term:'t1',subject:'Physical and Health Education',
      topic:'Safety',difficulty:'medium',
      q:'What should you do when a teacher says an activity is unsafe?',
      opts:['Stop and listen','Run away','Ignore the teacher','Push others'],a:0,
      exp:'Stopping and listening helps keep us safe.'
    },

    {
      id:'y1-cca-t1-01',year:1,term:'t1',subject:'Cultural and Creative Arts',
      topic:'Drawing',difficulty:'easy',
      q:'Which tool can be used for drawing?',
      opts:['Pencil','Spoon','Plate','Shoe'],a:0,
      exp:'A pencil is a common drawing tool.'
    },
    {
      id:'y1-cca-t1-02',year:1,term:'t1',subject:'Cultural and Creative Arts',
      topic:'Colours',difficulty:'easy',
      q:'Which colour is made by mixing red and yellow?',
      opts:['Orange','Blue','Black','White'],a:0,
      exp:'Red and yellow can be mixed to make orange.'
    },
    {
      id:'y1-cca-t1-03',year:1,term:'t1',subject:'Cultural and Creative Arts',
      topic:'Music',difficulty:'easy',
      q:'Which activity belongs to music?',
      opts:['Singing','Sleeping','Reading a map','Washing a car'],a:0,
      exp:'Singing is a musical activity.'
    },
    {
      id:'y1-cca-t1-04',year:1,term:'t1',subject:'Cultural and Creative Arts',
      topic:'Dance',difficulty:'medium',
      q:'What can dancers use when following a rhythm?',
      opts:['Body movements','A ruler only','A calculator','A spoon only'],a:0,
      exp:'Dance uses coordinated body movements.'
    },
    {
      id:'y1-cca-t1-05',year:1,term:'t1',subject:'Cultural and Creative Arts',
      topic:'Creative Work',difficulty:'medium',
      q:'Why do artists make pictures?',
      opts:['To express ideas and create artwork','To stop people learning','To break things','To hide books'],a:0,
      exp:'Art can be used to express ideas and create artwork.'
    }
  ];

  const state={
    year:1,term:'t1',subject:'Mathematics',difficulty:'all',
    questions:[],answers:[],index:0,score:0
  };

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function levelLabel(y){
    if(y<=6)return 'Primary';
    if(y<=9)return 'Junior Secondary';
    return 'Senior Secondary';
  }

  function available(){
    return BANK.filter(function(q){
      return q.year===state.year &&
        q.subject===state.subject &&
        (state.term==='all'||q.term===state.term) &&
        (state.difficulty==='all'||q.difficulty===state.difficulty);
    });
  }

  function speak(text){
    if(!('speechSynthesis' in window)){
      alert('Read-aloud is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(text||''));
    u.lang='en-NG';
    u.rate=.88;
    u.pitch=1;
    window.speechSynthesis.speak(u);
  }

  function chartHtml(media){
    const max=Math.max.apply(null,media.items.map(function(x){return Number(x[1])||0}).concat([1]));
    return '<div class="qa-media"><div class="qa-media-title">'+esc(media.title||'Chart')+
      '</div><div class="qa-chart">'+media.items.map(function(x){
        const h=Math.max(10,Math.round((Number(x[1])||0)/max*120));
        return '<div class="qa-bar-col"><div class="qa-bar-value">'+esc(x[1])+
          '</div><div class="qa-bar" style="height:'+h+'px"></div><div class="qa-bar-label">'+
          esc(x[0])+'</div></div>';
      }).join('')+'</div></div>';
  }

  function mediaHtml(q){
    if(!q.media)return '';
    if(q.media.type==='chart')return chartHtml(q.media);
    if(q.media.type==='diagram'){
      return '<div class="qa-media"><div class="qa-media-title">'+
        esc(q.media.title||'Diagram')+'</div><div class="qa-diagram">'+
        q.media.svg+'</div></div>';
    }
    if(q.media.type==='image'){
      return '<div class="qa-media"><div class="qa-media-title">'+
        esc(q.media.title||'Image')+'</div><img class="qa-image" src="'+
        esc(q.media.src)+'" alt="'+esc(q.media.alt||'Curriculum image')+'"></div>';
    }
    return '';
  }

  function injectStyle(){
    if(document.getElementById('quizyAcademyStyle'))return;
    const s=document.createElement('style');
    s.id='quizyAcademyStyle';
    s.textContent=
      '.qa-shell{padding:24px;max-width:920px;margin:auto}'+
      '.qa-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}'+
      '.qa-head h1{margin:4px 0 7px;font-size:34px}'+
      '.qa-head p{margin:0;color:var(--muted);line-height:1.55;max-width:650px}'+
      '.qa-kicker{font-size:12px;font-weight:1000;letter-spacing:1px;color:#6d55d9}'+
      '.qa-source{margin:18px 0;padding:14px 16px;border-radius:16px;background:#f6f4ff;border:1px solid #ddd7ff;color:#4f4a6e;font-weight:700;line-height:1.5}'+
      '.qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}'+
      '.qa-grid label{display:flex;flex-direction:column;gap:7px}'+
      '.qa-grid label span{font-size:12px;font-weight:1000;color:var(--muted)}'+
      '.qa-grid select{width:100%;padding:14px 15px;border:2px solid var(--line);border-radius:15px;background:#fff;color:var(--ink);font-weight:850;outline:0}'+
      '.qa-grid select:focus{border-color:var(--primary);box-shadow:0 0 0 4px #635bff14}'+
      '.qa-wide{grid-column:span 2}'+
      '.qa-status{margin-top:16px;padding:15px 17px;border-radius:17px;display:flex;flex-direction:column;gap:4px}'+
      '.qa-status.ready{background:#ecfaf0;color:#176b37}'+
      '.qa-status.waiting{background:#fff7df;color:#765817}'+
      '.qa-status strong{font-size:16px}'+
      '.qa-status span{font-size:13px;font-weight:700}'+
      '.qa-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:20px 0}'+
      '.qa-start{min-width:270px}'+
      '.qa-cards{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:10px}'+
      '.qa-cards>div{padding:15px 9px;border:1px solid var(--line);border-radius:17px;background:#fff;text-align:center}'+
      '.qa-cards strong{display:block;font-size:24px}.qa-cards span{display:block;color:var(--muted);font-size:11px;font-weight:800;margin-top:4px}'+
      '.qa-quiz{max-width:900px;margin:auto}.qa-quiz-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}'+
      '.qa-meta{text-align:center;color:var(--muted);font-size:12px;font-weight:900;margin:10px}'+
      '.qa-passage{max-width:760px;margin:0 auto 15px;padding:16px 18px;border-left:5px solid var(--primary);border-radius:12px;background:#f8f8ff;text-align:left}'+
      '.qa-passage-label{font-weight:1000;color:var(--primary);font-size:12px;text-transform:uppercase}.qa-passage p{line-height:1.75;margin:8px 0 0}'+
      '.qa-media{max-width:600px;margin:0 auto 16px;padding:14px;border:1px solid var(--line);border-radius:17px;background:#fff}'+
      '.qa-media-title{text-align:left;font-weight:1000;margin-bottom:8px}.qa-diagram{padding:8px;background:#fafbff;border-radius:12px}.qa-diagram svg{width:100%;height:auto;max-height:220px}'+
      '.qa-image{display:block;width:100%;max-height:300px;object-fit:contain;border-radius:12px}'+
      '.qa-chart{height:180px;display:flex;align-items:flex-end;justify-content:space-around;gap:14px;border-bottom:2px solid #94a3b8;padding:0 12px}'+
      '.qa-bar-col{height:170px;flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px}.qa-bar{width:min(70px,70%);background:linear-gradient(180deg,var(--primary2),var(--primary));border-radius:10px 10px 0 0}.qa-bar-value{font-weight:900;font-size:12px}.qa-bar-label{font-size:11px;font-weight:800;color:var(--muted)}'+
      '.qa-result{text-align:center;padding:40px;max-width:700px;margin:auto}.qa-result h1{font-size:64px;color:var(--primary);margin:8px}.qa-result-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:24px 0}.qa-result-grid div{padding:16px;border:1px solid var(--line);border-radius:17px}.qa-result-grid strong,.qa-result-grid span{display:block}.qa-result-grid span{font-size:13px;color:var(--muted);margin-top:4px}'+
      '.qa-map-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.qa-map-card{padding:18px;border:2px solid var(--line);border-radius:20px;background:#fff}.qa-map-icon{font-size:32px}.qa-map-card h3{margin:7px 0}.qa-map-card p{color:var(--muted);line-height:1.5}.qa-map-card small{font-weight:900;color:var(--primary)}'+
      '.qa-note{margin-top:16px;padding:15px;border-radius:16px;background:#f5f7ff;color:#475569;font-weight:700;line-height:1.5}'+
      '.quizy-academy-entry{margin-top:12px;width:min(430px,100%);padding:15px 20px;font-size:16px}'+
      '@media(max-width:700px){.qa-shell{padding:18px 14px}.qa-head{flex-direction:column}.qa-head h1{font-size:28px}.qa-grid{grid-template-columns:1fr}.qa-wide{grid-column:auto}.qa-cards{grid-template-columns:1fr 1fr}.qa-cards>div:last-child{grid-column:span 2}.qa-map-grid{grid-template-columns:1fr}.qa-result{padding:30px 16px}.qa-result-grid{grid-template-columns:1fr}.qa-start{width:100%}}';
    document.head.appendChild(s);
  }

  function addEntryButton(){
    if(document.getElementById('quizyAcademyEntry'))return;
    if(!window.state || state.screen!=='start')return;
    const host=document.querySelector('.start-actions')||document.querySelector('.start');
    if(!host)return;
    const b=document.createElement('button');
    b.id='quizyAcademyEntry';
    b.type='button';
    b.className='btn primary quizy-academy-entry';
    b.innerHTML='🎓 Quizy Academy · School Curriculum';
    b.onclick=function(){window.QuizyAcademy.open();};
    if(host.classList.contains('start-actions'))host.appendChild(b);
    else host.appendChild(b);
  }

  function renderSelect(){
    const app=document.getElementById('app');
    if(!app)return;
    const subs=subjectsFor(state.year);
    if(subs.indexOf(state.subject)<0)state.subject=subs[0];
    const count=available().length;
    const enough=count>=5;

    app.innerHTML=
      '<div class="screen card qa-shell">'+
      '<div class="qa-head"><div><div class="qa-kicker">🎓 QUIZY ACADEMY</div>'+
      '<h1>School Curriculum Challenge</h1>'+
      '<p>Pure academic Quizy: curriculum questions from Year 1 to Year 12, presented through the same Quizy challenge experience.</p></div>'+
      '<button class="btn ghost" id="qaBack">🏕️ Back to Quizy</button></div>'+
      '<div class="qa-source">📚 <strong>Question architecture:</strong> Year → Term → Subject → Topic → Difficulty. Media can be attached to any question: comprehension passages, images, diagrams, graphs and charts.</div>'+
      '<div class="qa-grid">'+
      '<label><span>CLASS / YEAR</span><select id="qaYear">'+YEARS.map(function(y){return '<option value="'+y.id+'" '+(y.id===state.year?'selected':'')+'>'+y.name+' · '+levelLabel(y.id)+'</option>';}).join('')+'</select></label>'+
      '<label><span>TERM</span><select id="qaTerm">'+TERMS.map(function(t){return '<option value="'+t.id+'" '+(t.id===state.term?'selected':'')+'>'+t.name+'</option>';}).join('')+'</select></label>'+
      '<label class="qa-wide"><span>SUBJECT</span><select id="qaSubject">'+subs.map(function(s){return '<option value="'+esc(s)+'" '+(s===state.subject?'selected':'')+'>'+esc(s)+'</option>';}).join('')+'</select></label>'+
      '<label><span>DIFFICULTY</span><select id="qaDifficulty"><option value="all">Mixed Difficulty</option><option value="easy" '+(state.difficulty==='easy'?'selected':'')+'>Easy</option><option value="medium" '+(state.difficulty==='medium'?'selected':'')+'>Medium</option><option value="hard" '+(state.difficulty==='hard'?'selected':'')+'>Hard</option></select></label>'+
      '</div>'+
      '<div class="qa-status '+(enough?'ready':'waiting')+'"><strong>'+count+' question'+(count===1?'':'s')+' available for this selection</strong>'+
      '<span>'+ (enough?'Ready for a five-question Quizy challenge.':'The curriculum slot exists, but its question bank is not populated yet. The same structure will be used as the bank is expanded.')+'</span></div>'+
      '<div class="qa-actions"><button class="btn ghost" id="qaMap">🗺️ Curriculum Map</button>'+
      '<button class="btn primary qa-start" id="qaStart" '+(enough?'':'disabled')+'>🎓 Start Academy Challenge</button></div>'+
      '<div class="qa-cards"><div><strong>12</strong><span>Year levels</span></div><div><strong>3</strong><span>Terms</span></div><div><strong>🖼️</strong><span>Media questions</span></div><div><strong>🔊</strong><span>Read aloud</span></div><div><strong>📖</strong><span>Comprehension</span></div></div>'+
      '</div>';

    document.getElementById('qaBack').onclick=function(){window.render();};
    document.getElementById('qaYear').onchange=function(e){state.year=Number(e.target.value);state.subject=subjectsFor(state.year)[0];renderSelect();};
    document.getElementById('qaTerm').onchange=function(e){state.term=e.target.value;renderSelect();};
    document.getElementById('qaSubject').onchange=function(e){state.subject=e.target.value;renderSelect();};
    document.getElementById('qaDifficulty').onchange=function(e){state.difficulty=e.target.value;renderSelect();};
    document.getElementById('qaStart').onclick=start;
    document.getElementById('qaMap').onclick=renderMap;
  }

  function filtered(){
    return available().slice().sort(function(){return Math.random()-.5;}).slice(0,5);
  }

  function start(){
    const qs=filtered();
    if(qs.length<5){renderSelect();return;}
    state.questions=qs;
    state.answers=new Array(qs.length).fill(null);
    state.index=0;
    state.score=0;
    renderQuiz();
  }

  function renderQuiz(){
    const app=document.getElementById('app');
    const q=state.questions[state.index];
    const answered=state.answers[state.index]!==null;
    const pct=Math.round((state.index+1)/state.questions.length*100);
    const passage=q.passage?
      '<div class="qa-passage"><div class="qa-passage-label">📖 Read this passage</div><p>'+esc(q.passage)+'</p></div>':'';
    const question=q.question||q.q;
    const options=q.opts.map(function(o,i){
      let c='answer';
      if(answered){
        if(i===q.a)c+=' correct';
        else if(i===state.answers[state.index])c+=' wrong';
        else c+=' dim';
      }
      return '<button class="'+c+'" data-qa-answer="'+i+'" '+(answered?'disabled':'')+'>'+
        String.fromCharCode(65+i)+'. '+esc(o)+'</button>';
    }).join('');

    app.innerHTML=
      '<div class="screen qa-quiz">'+
      '<div class="qa-quiz-top"><button class="btn ghost" id="qaQuit">← Academy</button>'+
      '<div class="q-counter">Question '+(state.index+1)+' / '+state.questions.length+'</div></div>'+
      '<div class="q-progress"><i style="width:'+pct+'%"></i></div>'+
      '<div class="qa-meta">Year '+state.year+' · '+esc(state.subject)+' · '+esc(q.topic)+' · '+esc(q.difficulty)+'</div>'+
      '<div class="question-card card"><div class="q-icon">🎓</div>'+
      mediaHtml(q)+passage+
      '<div class="q-text">'+esc(question)+'</div>'+
      '<button class="btn ghost voice-btn" id="qaRead">🔊 Read Question Aloud</button>'+
      '<div class="answers">'+options+'</div>'+
      (answered?'<div class="feedback '+(state.answers[state.index]===q.a?'good':'bad')+'">'+
        (state.answers[state.index]===q.a?'🌟 Correct!':'💪 Keep learning!')+
        '<div class="explain">'+esc(q.exp||'')+'</div></div>':'')+
      '</div><div class="q-footer"><button class="btn ghost" id="qaPrev" '+(state.index===0?'disabled':'')+'>← Back</button>'+
      '<button class="btn primary" id="qaNext" '+(answered?'':'disabled')+'>'+
      (state.index===state.questions.length-1?'Finish Challenge ✓':'Next Question →')+'</button></div></div>';

    document.getElementById('qaQuit').onclick=renderSelect;
    document.getElementById('qaRead').onclick=function(){
      speak((q.passage?'Read this passage. '+q.passage+' ':'')+question);
    };
    document.querySelectorAll('[data-qa-answer]').forEach(function(b){
      b.onclick=function(){answer(Number(b.getAttribute('data-qa-answer')));};
    });
    document.getElementById('qaPrev').onclick=function(){
      if(state.index>0){state.index--;renderQuiz();}
    };
    document.getElementById('qaNext').onclick=function(){
      if(state.index===state.questions.length-1)finish();
      else{state.index++;renderQuiz();}
    };
  }

  function answer(i){
    if(state.answers[state.index]!==null)return;
    const q=state.questions[state.index];
    state.answers[state.index]=i;
    if(i===q.a)state.score++;
    renderQuiz();
  }

  function finish(){
    const total=state.questions.length;
    const pct=Math.round(state.score/total*100);
    const app=document.getElementById('app');
    app.innerHTML=
      '<div class="screen card qa-result"><div class="break-icon">🏆</div>'+
      '<div class="qa-kicker">ACADEMY CHALLENGE COMPLETE</div>'+
      '<h1>'+state.score+' / '+total+'</h1><p>You scored <strong>'+pct+'%</strong>.</p>'+
      '<div class="qa-result-grid"><div><strong>Year '+state.year+'</strong><span>'+esc(state.subject)+'</span></div>'+
      '<div><strong>'+esc((TERMS.find(function(t){return t.id===state.term;})||{}).name||'All Terms')+'</strong><span>Curriculum challenge</span></div></div>'+
      '<div class="row"><button class="btn primary" id="qaAgain">🔁 Play Again</button>'+
      '<button class="btn ghost" id="qaHome">🎓 Academy</button><button class="btn ghost" id="qaQuizy">🏕️ Back to Quizy</button></div></div>';
    document.getElementById('qaAgain').onclick=start;
    document.getElementById('qaHome').onclick=renderSelect;
    document.getElementById('qaQuizy').onclick=function(){window.render();};
  }

  function renderMap(){
    const app=document.getElementById('app');
    const groups=[
      ['Years 1–3','Primary foundation','English Language · Mathematics · Basic Science · PHE · Social/Citizenship · Arts'],
      ['Years 4–6','Primary upper years','English · Mathematics · Basic Science & Technology · Digital Literacy · Prevocational Studies · French'],
      ['Years 7–9','Junior Secondary','English Studies · Mathematics · Intermediate Science · Digital Technologies · Business/Trade subjects'],
      ['Years 10–12','Senior Secondary','English · Mathematics · Sciences · Geography · Government · Economics · Business/Trade']
    ];
    app.innerHTML=
      '<div class="screen card qa-shell"><div class="qa-head"><div><div class="qa-kicker">🗺️ CURRICULUM MAP</div>'+
      '<h1>Quizy Academy</h1><p>The selection architecture covers Year 1 through Year 12, with three terms and subject-level question banks.</p></div>'+
      '<button class="btn ghost" id="mapBack">← Academy</button></div>'+
      '<div class="qa-map-grid">'+groups.map(function(g){
        return '<div class="qa-map-card"><div class="qa-map-icon">📚</div><h3>'+g[0]+'</h3><strong>'+g[1]+'</strong><p>'+g[2]+'</p><small>First Term · Second Term · Third Term</small></div>';
      }).join('')+'</div>'+
      '<div class="qa-note">Every question record can carry its own explanation, difficulty, comprehension passage, read-aloud text, image, diagram, graph or chart. The question-set API is kept separate so the existing Quizy Online and Bluetooth battle engines can later consume Academy sets without duplicating the quiz engine.</div></div>';
    document.getElementById('mapBack').onclick=renderSelect;
  }

  function wrapRender(){
    const base=window.render;
    if(typeof base!=='function')return;
    window.render=function(){
      base.apply(this,arguments);
      setTimeout(addEntryButton,0);
    };
    setTimeout(addEntryButton,0);
  }

  window.QuizyAcademy={
    open:function(){injectStyle();renderSelect();},
    getQuestionSet:function(opts){
      opts=opts||{};
      return BANK.filter(function(q){
        return (!opts.year||q.year===opts.year) &&
          (!opts.term||opts.term==='all'||q.term===opts.term) &&
          (!opts.subject||q.subject===opts.subject) &&
          (!opts.difficulty||opts.difficulty==='all'||q.difficulty===opts.difficulty);
      }).slice();
    },
    subjectsFor:subjectsFor,
    years:YEARS.slice(),
    terms:TERMS.slice()
  };

  injectStyle();
  wrapRender();
})();
