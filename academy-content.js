/* QUIZY ACADEMY CONTENT PACK V1
   Curriculum-backed starter bank. Source alignment: supplied NERDC 2025 scheme PDFs.
   This file is intentionally separate from index.html so the Academy can grow without
   turning the main game shell into an even larger monolith.
*/
(function(){
  const bank=typeof ACADEMY_BANK!=='undefined'?ACADEMY_BANK:null;
  if(!bank){ console.warn('Quizy Academy content pack: ACADEMY_BANK not available'); return; }
  const add=(key,set)=>{ bank[key]=Object.assign(bank[key]||{},set); };
  const q=(id,topic,text,opts,a,exp,extra)=>Object.assign({id,topic,q:text,opts,a,exp},extra||{});

  add('primary1|term1|English Language',{easy:[
    q('p1e5','Phonemic Awareness','Which word begins with the /b/ sound?', ['bat','cat','dog','fish'],0,'“Bat” begins with the /b/ sound.'),
    q('p1e6','Word Families','Which word belongs to the “-at” word family?', ['bed','cat','pot','sun'],1,'Cat rhymes with and belongs to the -at word family.'),
    q('p1e7','Phonemic Awareness','Which pair rhymes?', ['cat / hat','dog / sun','bed / fish','pen / top'],0,'Cat and hat have the same ending sound.'),
    q('p1e8','Animal Sounds','Which animal makes a “moo” sound?', ['Goat','Cow','Dog','Cat'],1,'A cow makes a moo sound.')
  ],medium:[
    q('p1e9','Sound Clusters','Which word begins with the consonant cluster “tr”?', ['tree','ship','chair','fish'],0,'Tree begins with the /tr/ consonant cluster.'),
    q('p1e10','Digraphs','Which word begins with the “sh” sound?', ['ship','chip','thin','when'],0,'Ship begins with the /sh/ digraph.')
  ]});

  add('primary1|term2|English Language',{easy:[
    q('p1e11','Concept of Print','Who writes a book?', ['The author','The cover','The page','The picture'],0,'The author writes the book.'),
    q('p1e12','Concept of Print','Which part of a book protects the pages?', ['Cover','Sentence','Word','Letter'],0,'The cover protects the pages.'),
    q('p1e13','Directionality','In English, we normally read across a line from which direction?', ['Right to left','Left to right','Bottom to top','Middle outward'],1,'English print is normally read from left to right.'),
    q('p1e14','Listening and Speaking','Which is a polite command?', ['Give me that!','Please pass the book.','Move!','Go away!'],1,'“Please pass the book” uses a polite expression.')
  ],medium:[
    q('p1e15','Book Features','Which person makes the pictures in a picture book?', ['Illustrator','Driver','Farmer','Tailor'],0,'An illustrator creates the pictures or illustrations.'),
    q('p1e16','Word Structure','How many syllables are in “teacher”?', ['1','2','3','4'],1,'Teacher can be clapped as teach-er: two syllables.')
  ]});

  add('primary1|term1|Basic Science',{easy:[
    q('p1s1','Our Environment','Which place is part of a school environment?', ['Classroom','Moon','Ocean floor','Cloud'],0,'A classroom is part of the school environment.'),
    q('p1s2','Road Safety','Which traffic-light colour means STOP?', ['Green','Yellow','Red','Blue'],2,'Red means stop.'),
    q('p1s3','Colours','Which colour is a primary colour?', ['Green','Purple','Red','Orange'],2,'Red is one of the primary colours.'),
    q('p1s4','Living Things','Which one is a living thing?', ['Stone','Chair','Plant','Cup'],2,'A plant is a living thing; a chair is not.')
  ],medium:[
    q('p1s5','Living Things','Which set contains only living things?', ['Dog, tree, goat','Chair, table, cup','Stone, book, pencil','Car, road, house'],0,'A dog, tree and goat are all living things.'),
    q('p1s6','Plant Parts','Which part of a plant usually takes in water from the soil?', ['Flower','Root','Fruit','Leaf'],1,'Roots take in water and minerals from the soil.')
  ]});

  add('primary1|term2|Mathematics',{easy:[
    q('p1m7','Whole Numbers 11–20','Which number comes immediately after 14?', ['13','15','16','20'],1,'15 comes immediately after 14.'),
    q('p1m8','Place Value','In 18, which digit is in the tens place?', ['1','8','0','18'],0,'The digit 1 represents one ten.'),
    q('p1m9','Comparing Numbers','Which sign makes this true: 7 __ 9?', ['>','<','='],1,'7 is less than 9, so the correct sign is <.'),
    q('p1m10','Money','Which Nigerian note has the greater value?', ['₦5','₦20','₦10','₦1'],1,'₦20 is greater than ₦5, ₦10 and ₦1.')
  ],medium:[
    q('p1m11','Open Sentences','What number makes 3 + __ = 5?', ['1','2','3','4'],1,'3 + 2 = 5.'),
    q('p1m12','Ordering Numbers','Which list is in descending order?', ['4, 6, 8','8, 6, 4','4, 8, 6','6, 4, 8'],1,'Descending order goes from largest to smallest.')
  ]});

  add('primary1|term3|Mathematics',{easy:[
    q('p1m13','Fractions','Which statement describes one half?', ['One of two equal parts','One of three equal parts','One of four equal parts','One whole'],0,'One half means one of two equal parts.'),
    q('p1m14','Measurement','Which object is usually longer?', ['A pencil','A school ruler','A grain of rice','A button'],1,'A school ruler is normally longer than the other listed objects.'),
    q('p1m15','Time','Which comes after morning?', ['Night','Afternoon','Yesterday','Midnight'],1,'The afternoon follows the morning.'),
    q('p1m16','Shapes','Which shape has no corners?', ['Triangle','Square','Circle','Rectangle'],2,'A circle has no corners.')
  ],medium:[
    q('p1m17','Data Collection','A class records favourite fruits. What are they collecting?', ['Data','Rain','Money','Length'],0,'Information collected for study is called data.'),
    q('p1m18','3D Shapes','Which object is most like a sphere?', ['Ball','Book','Tin','Box'],0,'A ball is a common example of a sphere.')
  ]});

  add('jss1|term2|Mathematics',{easy:[
    q('j1m8','Fractions','What is 1/2 + 1/4?', ['1/6','2/6','3/4','3/8'],2,'Using a common denominator of 4: 2/4 + 1/4 = 3/4.'),
    q('j1m9','Estimation','Round 47 to the nearest ten.', ['40','45','50','60'],2,'47 rounds to 50 because the ones digit is 7.'),
    q('j1m10','Base 2','What is 1 + 1 in binary?', ['1','10','11','100'],1,'Binary uses 10 to represent decimal 2.'),
    q('j1m11','Algebraic Processes','In 5x, what is the coefficient of x?', ['1','5','x','0'],1,'The coefficient is the number multiplying the variable: 5.')
  ],medium:[
    q('j1m12','Algebraic Expressions','Simplify 3x + 2x.', ['5','5x','6x','x'],1,'Like terms combine: 3x + 2x = 5x.'),
    q('j1m13','Fractions','What is 2/3 × 3/4?', ['1/2','2/7','5/12','3/8'],0,'Cancel 3 and 3, leaving 2/4 = 1/2.')
  ]});

  add('jss1|term3|Mathematics',{easy:[
    q('j1m14','Simple Equations','Solve x + 3 = 7.', ['3','4','5','10'],1,'Subtract 3 from both sides: x = 4.'),
    q('j1m15','Plane Shapes','How many sides does a quadrilateral have?', ['3','4','5','6'],1,'A quadrilateral has four sides.'),
    q('j1m16','Angles','How many degrees are in a right angle?', ['45°','60°','90°','180°'],2,'A right angle measures 90°.')
  ],medium:[
    q('j1m17','Statistics','Which chart is useful for comparing categories?', ['Bar chart','Sentence','Paragraph','Map only'],0,'Bar charts are useful for comparing quantities across categories.'),
    q('j1m18','Data Presentation','According to the bar chart, which fruit is most popular?', ['Mango','Orange','Apple','Banana'],1,'The Orange bar is the tallest.',{media:{type:'chart',html:'<svg viewBox="0 0 460 250" role="img" aria-label="Bar chart showing favourite fruits"><line x1="55" y1="205" x2="430" y2="205" stroke="#334155" stroke-width="3"/><line x1="55" y1="25" x2="55" y2="205" stroke="#334155" stroke-width="3"/><rect x="90" y="105" width="55" height="100" rx="6" fill="#635bff"/><rect x="180" y="65" width="55" height="140" rx="6" fill="#8b5cf6"/><rect x="270" y="125" width="55" height="80" rx="6" fill="#16a34a"/><rect x="360" y="85" width="55" height="120" rx="6" fill="#f5a623"/><g font-size="15" text-anchor="middle" fill="#172033"><text x="117" y="228">Mango</text><text x="207" y="228">Orange</text><text x="297" y="228">Apple</text><text x="387" y="228">Banana</text></g><g font-size="14" fill="#172033"><text x="20" y="210">0</text><text x="20" y="160">5</text><text x="20" y="110">10</text><text x="20" y="60">15</text></g></svg>'}})
  ]});

  add('jss1|term1|Business Studies',{easy:[
    q('j1b1','Business Studies','Which of these is a component of Business Studies?', ['Office practice','Weather forecasting','Astronomy','Geology'],0,'Office practice is one of the areas covered in Business Studies.'),
    q('j1b2','Office Practice','What is one main purpose of an office?', ['To coordinate administrative work','To grow crops','To treat patients','To build roads'],0,'An office supports and coordinates administrative work.'),
    q('j1b3','Attitude to Work','Which behaviour shows punctuality?', ['Arriving on time','Coming whenever you like','Ignoring duties','Leaving work early without permission'],0,'Punctuality means being on time.'),
    q('j1b4','Commerce','Which activity helps trade to take place?', ['Transportation','Sleeping','Rainfall','Drawing'],0,'Transportation is an aid to trade because it moves goods and people.')
  ],medium:[
    q('j1b5','Home and Foreign Trade','Buying goods from another country for use or sale is called what?', ['Import trade','Export trade','Retail only','Production'],0,'Imports are goods brought into a country from another country.'),
    q('j1b6','Production','Which is a stage of production?', ['Manufacturing','Guessing','Sleeping','Celebrating'],0,'Manufacturing is a production activity that transforms materials into goods.')
  ]});

  add('jss1|term3|Digital Technologies',{easy:[
    q('j1d1','Computer Networks','What does LAN stand for?', ['Local Area Network','Large Access Number','Long Audio Network','Local App Name'],0,'LAN means Local Area Network.'),
    q('j1d2','Internet and Web Browsing','Which program is commonly used to open websites?', ['Web browser','Calculator','Paint brush','File cabinet'],0,'A web browser is used to access websites.'),
    q('j1d3','Digital Safety','Which is a strong password practice?', ['Use a unique password','Share it publicly','Use your name only','Use 1234 everywhere'],0,'Using a unique password reduces the risk of account compromise.'),
    q('j1d4','Digital Ethics','What is plagiarism?', ['Using someone’s work as your own without proper credit','Saving your own file','Typing a message','Turning off a computer'],0,'Plagiarism is presenting another person’s work as your own without proper credit.')
  ],medium:[
    q('j1d5','Emerging Trends','Which technology is specifically mentioned in the JSS1 scheme as an emerging trend?', ['Artificial Intelligence','Stone tools','Cave painting','Handwritten ledgers'],0,'The scheme introduces awareness of Artificial Intelligence, robotics and the Internet of Things.'),
    q('j1d6','Online Information','Why should online information be evaluated before it is trusted?', ['Some information may be inaccurate or misleading','Everything online is automatically true','Websites cannot contain errors','Search engines know every fact'],0,'Online information can be inaccurate or misleading, so it should be evaluated.')
  ]});

  add('ss3|term1|Chemistry',{easy:[
    q('s3c1','Food Chemistry','Which group contains the three major food classes named in the scheme?', ['Carbohydrates, proteins and fats','Water, sand and salt','Metals, plastics and glass','Oxygen, nitrogen and helium'],0,'The scheme begins with carbohydrates, proteins and fats.'),
    q('s3c2','Environmental Chemistry','Which is a type of pollution listed in the scheme?', ['Water pollution','Moon pollution','Book pollution','Number pollution'],0,'Water pollution is one of the listed pollution types.'),
    q('s3c3','Industrial Chemistry','Which industry is listed among examples of chemical industries in Nigeria?', ['Cement','Photography only','Banking only','Sports'],0,'Cement is listed among Nigerian chemical industries.')
  ],medium:[
    q('s3c4','Chemical Calculations','Which quantity is directly used when calculating the number of moles from mass?', ['Molar mass','Colour','Temperature only','Volume of a classroom'],0,'Moles can be calculated from mass using molar mass.'),
    q('s3c5','Data Interpretation','A chemistry student records measurements in a table before drawing a conclusion. What skill is being used?', ['Data interpretation','Storytelling only','Map reading only','Handwriting only'],0,'Recording and interpreting measurements is part of scientific data handling.')
  ]});

  window.QUIZY_ACADEMY_CONTENT_PACK={version:'1.0',source:'Supplied NERDC 2025 scheme PDFs',loadedAt:new Date().toISOString()};
/* QUIZY ACADEMY EXPANSION PACK V1 — curriculum-backed senior + comprehension coverage */
(function(){
  'use strict';
  const bank=window.ACADEMY_BANK;
  if(!bank)return;
  const add=(key,set)=>{bank[key]=Object.assign(bank[key]||{},set);};
  const q=(id,topic,text,opts,a,exp,extra)=>Object.assign({id,topic,q:text,opts,a,exp},extra||{});

  add('jss1|term1|English Studies',{easy:[
    q('j1engc1','Reading & Comprehension','Read the passage and answer the question. Musa woke early, packed his books and walked to school with his younger brother. Why did Musa wake early?',['To prepare for school','To go swimming','To visit the market','To watch a film'],0,'The passage says Musa packed his books and walked to school, so he woke early to prepare for school.',{passage:'Musa woke early, packed his books and walked to school with his younger brother. He wanted to arrive before the first lesson began.'}),
    q('j1engc2','Reading & Comprehension','According to the passage, who walked to school with Musa?',['His teacher','His younger brother','His neighbour','His cousin'],1,'The passage states that Musa walked with his younger brother.',{passage:'Musa woke early, packed his books and walked to school with his younger brother. He wanted to arrive before the first lesson began.'})
  ],medium:[
    q('j1engc3','Reading & Comprehension','What can you infer about Musa from the passage?',['He was preparing to be punctual','He disliked school','He was going shopping','He had forgotten his books'],0,'Arriving before the first lesson suggests Musa was trying to be punctual.',{passage:'Musa woke early, packed his books and walked to school with his younger brother. He wanted to arrive before the first lesson began.'})
  ]});

  add('ss1|term1|Mathematics',{easy:[
    q('ss1m1','Number Base System','What is 101 in base 2 written in base 10?',['3','4','5','6'],2,'101₂ = 4 + 1 = 5.'),
    q('ss1m2','Indices','What is 2³?',['5','6','8','9'],2,'2 × 2 × 2 = 8.'),
    q('ss1m3','Logarithms','If 10² = 100, what is log₁₀100?',['1','2','10','100'],1,'The logarithm is the exponent: 10² = 100, so log₁₀100 = 2.')
  ],medium:[
    q('ss1m4','Modular Arithmetic','What is the remainder when 17 is divided by 5?',['1','2','3','4'],1,'17 = 5 × 3 + 2, so the remainder is 2.'),
    q('ss1m5','Variation','If y varies directly as x and y = 12 when x = 3, what is y when x = 5?',['15','20','24','60'],1,'The constant is 12/3 = 4, so y = 4 × 5 = 20.')
  ]});

  add('ss1|term1|Physics',{easy:[
    q('ss1p1','Measurement','Which instrument is used to measure temperature?',['Ammeter','Thermometer','Barometer','Stopwatch'],1,'A thermometer measures temperature.'),
    q('ss1p2','Motion','Which quantity describes how fast an object moves?',['Mass','Speed','Density','Temperature'],1,'Speed describes the rate at which distance is covered.'),
    q('ss1p3','Energy','Which form of energy is associated with a moving object?',['Kinetic energy','Chemical energy','Nuclear energy','Sound only'],0,'A moving object possesses kinetic energy.')
  ],medium:[
    q('ss1p4','Measurement','A student travels 100 m in 20 s. What is the average speed?',['2 m/s','5 m/s','20 m/s','120 m/s'],1,'Average speed = distance/time = 100/20 = 5 m/s.'),
    q('ss1p5','Forces','What happens when balanced forces act on an object at rest?',['It must accelerate','It remains at rest','Its mass doubles','It becomes hotter'],1,'Balanced forces have zero resultant force, so an object at rest remains at rest.')
  ]});

  add('ss1|term1|Chemistry',{easy:[
    q('ss1c1','Matter','Which state of matter has a fixed volume but no fixed shape?',['Solid','Liquid','Gas','Plasma only'],1,'A liquid has a fixed volume but takes the shape of its container.'),
    q('ss1c2','Atomic Structure','Which particle has a negative charge?',['Proton','Neutron','Electron','Nucleus'],2,'Electrons carry negative charge.'),
    q('ss1c3','Separation Techniques','Which method can separate an insoluble solid from a liquid?',['Filtration','Distillation only','Chromatography only','Sublimation'],0,'Filtration separates an insoluble solid from a liquid.')
  ],medium:[
    q('ss1c4','Atomic Structure','An atom has 11 protons. What is its atomic number?',['5','10','11','22'],2,'Atomic number equals the number of protons.'),
    q('ss1c5','Chemical Reactions','Which observation can indicate that a chemical reaction has occurred?',['Formation of a new gas','Only changing the shape of paper','Moving a book','Opening a door'],0,'Gas formation can be evidence of a chemical reaction.')
  ]});

  add('ss1|term1|Biology',{easy:[
    q('ss1b1','Cell Biology','What is the basic unit of life?',['Tissue','Organ','Cell','System'],2,'The cell is the basic structural and functional unit of life.'),
    q('ss1b2','Living Things','Which process do green plants use to make food?',['Respiration','Photosynthesis','Excretion','Digestion'],1,'Green plants make food by photosynthesis.'),
    q('ss1b3','Nutrition','Which nutrient is mainly needed for growth and repair of body tissues?',['Protein','Water only','Fibre','Salt'],0,'Proteins are important for growth and repair.')
  ],medium:[
    q('ss1b4','Ecology','What is the role of decomposers in an ecosystem?',['They recycle nutrients from dead matter','They stop rainfall','They produce sunlight','They remove all oxygen'],0,'Decomposers break down dead material and return nutrients to the environment.'),
    q('ss1b5','Photosynthesis','Which gas is taken in by green plants during photosynthesis?',['Oxygen','Carbon dioxide','Nitrogen only','Hydrogen'],1,'Plants use carbon dioxide during photosynthesis.')
  ]});

  add('ss1|term1|Economics',{easy:[
    q('ss1e1','Introduction to Economics','What is scarcity?',['Unlimited resources','Limited resources relative to unlimited wants','Free goods only','A type of market'],1,'Scarcity exists because resources are limited while human wants are numerous.'),
    q('ss1e2','Basic Economic Concepts','What is opportunity cost?',['The next best alternative forgone','The total money in a bank','A tax on imports','The price of every product'],0,'Opportunity cost is the next best alternative given up.'),
    q('ss1e3','Factors of Production','Which is a factor of production?',['Land','Weather report','School uniform','Traffic light'],0,'Land is one of the factors of production.')
  ],medium:[
    q('ss1e4','Demand','If the price of a normal good falls, what generally happens to quantity demanded, other things being equal?',['It rises','It always becomes zero','It cannot change','It becomes negative'],0,'The law of demand states that quantity demanded generally rises as price falls, other things equal.')
  ]});

  add('ss1|term1|Geography',{easy:[
    q('ss1g1','The Earth','Which line divides the Earth into the Northern and Southern Hemispheres?',['Prime Meridian','Equator','Tropic of Cancer','Arctic Circle'],1,'The Equator divides the Earth into Northern and Southern Hemispheres.'),
    q('ss1g2','Maps','What does a map scale help a reader understand?',['The relationship between map distance and actual distance','Only the weather','The age of a map','The colour of rivers'],0,'Scale shows the relationship between distances on a map and on the ground.'),
    q('ss1g3','Physical Geography','Which is a natural feature?',['River','Road','Bridge','Railway'],0,'A river is a natural physical feature.')
  ],medium:[
    q('ss1g4','Map Reading','If a map scale is 1:100,000, what ground distance does 1 cm represent?',['100 m','1 km','10 km','100 km'],1,'1 cm at 1:100,000 represents 100,000 cm, which equals 1 km.')
  ]});

  add('ss1|term1|Government',{easy:[
    q('ss1gov1','Introduction to Government','What is government?',['The system or process through which a state is governed','Only a school club','A type of business','A weather system'],0,'Government refers to the system or process through which a state is governed.'),
    q('ss1gov2','State','Which is an essential element of a state?',['Defined territory','A football team','A market stall','A classroom'],0,'Defined territory is one of the essential elements of a state.'),
    q('ss1gov3','Citizenship','A citizen is best described as a person who',['has legal membership of a state','owns a shop','travels every day','works only for government'],0,'Citizenship involves legal membership of a state.')
  ],medium:[
    q('ss1gov4','Democracy','Which principle is associated with democracy?',['Participation of citizens','Rule by one person without limits','No elections ever','No laws'],0,'Citizen participation is a central democratic principle.')
  ]});

  window.QUIZY_ACADEMY_EXPANSION='1.0';
})();

})();