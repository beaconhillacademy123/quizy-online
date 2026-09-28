/* QUIZY ACADEMY EXPANSION PACK V3
   Built from the supplied 2025 NERDC scheme-of-work PDFs.
   Adds broader Year 2-12 coverage, comprehension, charts and curriculum-specific drills.
*/
(function(){
'use strict';
const bank=window.ACADEMY_BANK;if(!bank)return;
const add=(key,set)=>{bank[key]=Object.assign(bank[key]||{},set);};
const q=(id,topic,text,opts,a,exp,extra)=>Object.assign({id,topic,q:text,opts,a,exp},extra||{});

add('primary2|term2|Basic Science',{easy:[
 q('p2s21','Materials','Which material is commonly used to make a cooking pot?',['Metal','Paper','Cotton wool','Leaves'],0,'Metal is commonly used for cooking pots because it can withstand heat.'),
 q('p2s22','Plants','Which part of a plant usually holds it firmly in the soil?',['Flower','Root','Fruit','Leaf'],1,'Roots anchor the plant in the soil.'),
 q('p2s23','Health and Safety','Which action helps to keep food safe?',['Leaving food uncovered','Washing hands before handling food','Putting food on the floor','Using dirty utensils'],1,'Washing hands helps prevent contamination.')
],medium:[
 q('p2s24','Materials','Why is glass useful for some windows?',['It allows light to pass through','It grows like a plant','It is a type of food','It produces rain'],0,'Glass can allow light to pass through while separating inside from outside.')
]});

add('primary3|term1|Mathematics',{easy:[
 q('p3m11','Whole Numbers','What is 245 + 30?',['265','275','285','295'],1,'245 + 30 = 275.'),
 q('p3m12','Multiplication','What is 6 × 4?',['10','20','24','28'],2,'6 groups of 4 make 24.'),
 q('p3m13','Fractions','Which fraction shows one quarter?',['1/2','1/3','1/4','2/4'],2,'One quarter is written as 1/4.')
],medium:[
 q('p3m14','Data Presentation','The chart shows books read by three pupils. Who read the most?', ['Amina','Bola','Chika','They read the same'],1,'Bola has the tallest bar.',{media:{type:'chart',label:'Books read',html:'<svg viewBox="0 0 440 250" role="img" aria-label="Bar chart showing Amina 4 books, Bola 8 books and Chika 6 books"><line x1="55" y1="205" x2="410" y2="205" stroke="#334155" stroke-width="3"/><line x1="55" y1="25" x2="55" y2="205" stroke="#334155" stroke-width="3"/><rect x="90" y="125" width="65" height="80" fill="#635bff"/><rect x="195" y="45" width="65" height="160" fill="#8b5cf6"/><rect x="300" y="85" width="65" height="120" fill="#16a34a"/><g font-size="15" text-anchor="middle" fill="#172033"><text x="122" y="228">Amina</text><text x="227" y="228">Bola</text><text x="332" y="228">Chika</text></g><g font-size="14" fill="#172033"><text x="118" y="118">4</text><text x="223" y="38">8</text><text x="328" y="78">6</text></g></svg>'}}),
]});

add('primary4|term2|Social and Citizenship Studies',{easy:[
 q('p4sc21','Citizenship','Which action shows good citizenship in school?',['Destroying school property','Respecting school rules','Bullying classmates','Ignoring everyone'],1,'Respecting school rules is an example of responsible citizenship.'),
 q('p4sc22','Community','Who can help keep a community safe?',['Community members and responsible authorities','Only children','Nobody','Only shopkeepers'],0,'Safety is a shared responsibility involving citizens and appropriate authorities.'),
 q('p4sc23','National Values','Which value encourages people to treat others fairly?',['Fairness','Dishonesty','Violence','Disrespect'],0,'Fairness means treating people justly.')
],medium:[
 q('p4sc24','Civic Responsibility','Why is cooperation important in a community?',['People can work together to solve shared problems','It prevents communication','It stops people from helping','It removes all responsibilities'],0,'Cooperation helps people work together on common needs.')
]});

add('primary5|term2|Prevocational Studies',{easy:[
 q('p5pv21','Agriculture','Which activity is part of crop production?',['Planting seeds','Repairing a television','Typing a letter','Drawing a map'],0,'Planting seeds is a basic crop-production activity.'),
 q('p5pv22','Home Economics','Which practice helps keep a kitchen hygienic?',['Washing utensils properly','Leaving rubbish on the floor','Using dirty water','Keeping food uncovered'],0,'Properly washing utensils supports kitchen hygiene.'),
 q('p5pv23','Safety','Why should tools be handled carefully?',['To prevent injury','To make them disappear','To change their colour','To stop learning'],0,'Careful handling reduces the risk of injury.')
],medium:[
 q('p5pv24','Agriculture','Which practice can help protect soil from erosion?',['Planting vegetation','Removing every plant','Leaving soil bare everywhere','Pouring waste on farmland'],0,'Vegetation helps protect soil from erosion.')
]});

add('primary6|term2|Social and Citizenship Studies',{easy:[
 q('p6sc21','Citizenship','What is one responsibility of a good citizen?',['Respecting laws and other people','Damaging public property','Spreading false information','Refusing every community duty'],0,'Responsible citizens respect laws and other people.'),
 q('p6sc22','Human Rights','Which is an example of a right?',['The right to education','The right to bully others','The right to destroy property','The right to steal'],0,'Access to education is a recognised right.')
],medium:[
 q('p6sc23','Civic Participation','Why should citizens take part in community activities?',['To contribute to the development of their community','To prevent cooperation','To avoid responsibility','To stop other people from speaking'],0,'Participation allows citizens to contribute to community development.')
]});

add('jss2|term1|Mathematics',{easy:[
 q('j2m1','Approximation','Round 4,768 to the nearest hundred.',['4,700','4,800','4,760','5,000'],1,'The tens digit is 6, so 4,768 rounds to 4,800.'),
 q('j2m2','LCM and HCF','What is the HCF of 12 and 18?',['3','6','9','12'],1,'The highest common factor of 12 and 18 is 6.'),
 q('j2m3','Percentages','What is 25% of 80?',['10','20','25','40'],1,'25% of 80 = 0.25 × 80 = 20.')
],medium:[
 q('j2m4','Algebraic Expressions','Simplify 3x + 4x − 2x.',['3x','5x','7x','9x'],1,'3x + 4x − 2x = 5x.')
]});

add('jss2|term1|English Studies',{easy:[
 q('j2eng1','Reading & Comprehension','Read the passage and answer the question. The community library opened a new reading room. Students began visiting after school because they could find storybooks and reference materials there. Why did students visit the library?', ['To find books and reference materials','To play football','To sell food','To repair cars'],0,'The passage says they visited to use storybooks and reference materials.',{passage:'The community library opened a new reading room. Students began visiting after school because they could find storybooks and reference materials there.'}),
 q('j2eng2','Grammar','Which sentence uses the passive voice?',['The boy kicked the ball.','The ball was kicked by the boy.','The boy kicks the ball.','The boy is kicking.'],1,'“The ball was kicked by the boy” is in the passive voice.')
],medium:[
 q('j2eng3','Critical Reading','What is the main reason a reader should identify an author’s purpose?',['It helps the reader understand why the text was written','It makes every word longer','It removes the need to read','It changes the title'],0,'Identifying purpose helps the reader understand the writer’s intention.')
]});

add('jss3|term1|English Studies',{easy:[
 q('j3eng1','Comprehension','Read the passage and answer the question. Chika planned her study timetable before the new term began. She divided her time between Mathematics, English and Science and left space for rest. What did Chika prepare?', ['A study timetable','A football pitch','A shopping list only','A travel ticket'],0,'The passage says she prepared a study timetable.',{passage:'Chika planned her study timetable before the new term began. She divided her time between Mathematics, English and Science and left space for rest.'}),
 q('j3eng2','Grammar','Which word is an adverb of frequency?',['Always','Book','Green','Teacher'],0,'Always tells how frequently something happens.')
],medium:[
 q('j3eng3','Reading Skills','Which reading skill is useful when looking quickly for a specific fact?',['Scanning','Painting','Singing','Guessing'],0,'Scanning is used to locate specific information quickly.')
]});

add('ss2|term1|Biology',{easy:[
 q('ss2b1','Digestive System','Where does most absorption of digested nutrients occur?',['Small intestine','Large intestine only','Mouth only','Oesophagus'],0,'The small intestine is the main site of absorption of digested nutrients.'),
 q('ss2b2','Transportation','Which blood component mainly carries oxygen?',['Red blood cells','Platelets','Plasma only','White blood cells'],0,'Red blood cells carry oxygen using haemoglobin.'),
 q('ss2b3','Respiration','Which type of respiration can occur without oxygen?',['Anaerobic respiration','Only photosynthesis','Only aerobic respiration','Digestion'],0,'Anaerobic respiration occurs without oxygen.')
],medium:[
 q('ss2b4','Excretion','Which organ removes urea from the blood to form urine?',['Kidney','Heart','Lung only','Stomach'],0,'The kidneys filter the blood and help form urine containing urea.')
]});

add('ss2|term1|Economics',{easy:[
 q('ss2eco1','Fiscal Policy','Which is a tool of fiscal policy?',['Taxation','Photosynthesis','Weather forecasting','Road signs'],0,'Taxation is a fiscal-policy tool.'),
 q('ss2eco2','National Income','What does GDP measure broadly?',['The value of final goods and services produced within an economy','Only imports','Only government salaries','Only household savings'],0,'GDP measures the value of final goods and services produced within an economy over a period.'),
 q('ss2eco3','Inflation','What is inflation?',['A sustained rise in the general price level','A fall in every price','A type of rainfall','A government building'],0,'Inflation is a sustained increase in the general price level.')
],medium:[
 q('ss2eco4','Money','Which motive for holding money is named in the scheme?',['Transactionary motive','Sleeping motive','Rainfall motive','Transport motive'],0,'The scheme identifies transactionary, precautionary and speculative motives.')
]});

add('ss2|term1|Geography',{easy:[
 q('ss2geo1','GIS','What does GIS stand for?',['Geographic Information System','General Internet Service','Global Industry Standard','Geology Image Scale'],0,'GIS stands for Geographic Information System.'),
 q('ss2geo2','Industry','Which is a type of industry listed in the scheme?',['Primary industry','Invisible industry','Moon industry','Dream industry'],0,'Primary industry is one of the listed types.'),
 q('ss2geo3','Climate','Which statement distinguishes weather from climate?',['Weather describes short-term atmospheric conditions; climate describes longer-term patterns','They are exactly the same','Climate changes every minute only','Weather is measured only once'],0,'Weather is short-term; climate concerns longer-term patterns.')
],medium:[
 q('ss2geo4','External Processes','Which process can wear away and transport soil or rock?',['Erosion','Photosynthesis','Condensation only','Digestion'],0,'Erosion involves wearing away and transporting earth materials.')
]});

add('ss3|term1|Biology',{easy:[
 q('ss3b1','Genetics','What is an allele?',['An alternative form of a gene','A type of tissue','A digestive enzyme only','A blood vessel'],0,'An allele is an alternative form of a gene.'),
 q('ss3b2','Genetics','Which scientist is associated with the classic experiments that established Mendelian inheritance principles?',['Gregor Mendel','Isaac Newton','Michael Faraday','Louis Pasteur'],0,'Gregor Mendel conducted the classic pea-plant experiments.'),
 q('ss3b3','Evolution','Which process is central to Darwin’s explanation of evolution?',['Natural selection','Boiling','Filtration','Distillation'],0,'Natural selection is central to Darwinian evolution.')
],medium:[
 q('ss3b4','Genetics','In a simple monohybrid cross, what does a Punnett square help predict?',['Possible offspring genotypes and phenotypes','The weather','The mass of a planet','The boiling point of water'],0,'Punnett squares help organise possible genetic combinations in offspring.')
]});

add('ss3|term1|Mathematics',{easy:[
 q('ss3m1','Binary Numbers','What is 1101₂ in base 10?',['11','12','13','14'],2,'1101₂ = 8 + 4 + 1 = 13.'),
 q('ss3m2','Compound Interest','If ₦10,000 grows by 10% for one year, what is the amount?',['₦10,100','₦11,000','₦12,000','₦9,000'],1,'10% of ₦10,000 is ₦1,000, so the amount is ₦11,000.'),
 q('ss3m3','Rational Numbers','Which is irrational?',['1/2','0.25','√2','3'],2,'√2 is irrational; it cannot be expressed as a ratio of two integers.')
],medium:[
 q('ss3m4','Factorization','Factorise x² − 16.',['(x−4)(x+4)','(x−16)(x+1)','x(x−16)','(x−8)²'],0,'x² − 16 is a difference of squares: (x−4)(x+4).')
]});

add('ss3|term1|English Language',{easy:[
 q('ss3eng1','Comprehension','Read the passage and answer the question. A school introduced a reading hour twice a week. Teachers noticed that students began borrowing more books and discussing new ideas during lessons. What change did teachers notice?', ['Students borrowed more books and discussed ideas more','Students stopped attending school','Students stopped reading','The library was closed'],0,'The passage says students began borrowing more books and discussing new ideas.',{passage:'A school introduced a reading hour twice a week. Teachers noticed that students began borrowing more books and discussing new ideas during lessons.'}),
 q('ss3eng2','Grammar','Which sentence contains a modal verb?',['She can solve the problem.','She solved the problem.','She solves problems.','She is solving the problem.'],0,'“Can” is a modal verb.')
],medium:[
 q('ss3eng3','Reading Skills','Which technique is most directly used to locate a specific name or date in a long passage?',['Scanning','Skimming only','Guessing','Copying'],0,'Scanning helps locate specific details such as names and dates.')
]});

window.QUIZY_ACADEMY_EXPANSION_V3='1.0';
})();