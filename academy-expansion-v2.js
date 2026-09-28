/* QUIZY ACADEMY EXPANSION PACK V2
   Built from the supplied 2025 NERDC scheme PDFs.
   This pack adds more curriculum-backed coverage without touching the main question bank.
*/
(function(){
  'use strict';
  const bank=window.ACADEMY_BANK;
  if(!bank)return;
  const add=(key,set)=>{bank[key]=Object.assign(bank[key]||{},set);};
  const q=(id,topic,text,opts,a,exp,extra)=>Object.assign({id,topic,q:text,opts,a,exp},extra||{});

  // PRIMARY 4–6: richer English comprehension + core subjects
  add('primary5|term1|English Language',{easy:[
    q('p5eng1','Comprehension I','Read the passage and answer the question. During the school environmental day, Aisha and her classmates cleaned the garden, planted two trees and labelled the waste bins. Their teacher explained that keeping the school clean helps everyone learn in a healthy environment. What did the pupils plant?',['Flowers','Two trees','Vegetables','Grass'],1,'The passage says they planted two trees.',{passage:'During the school environmental day, Aisha and her classmates cleaned the garden, planted two trees and labelled the waste bins. Their teacher explained that keeping the school clean helps everyone learn in a healthy environment.'}),
    q('p5eng2','Comprehension I','Why did the teacher say keeping the school clean was important?',['It helps everyone learn in a healthy environment','It makes lessons shorter','It stops pupils from reading','It removes all school rules'],0,'The passage links cleanliness with a healthy learning environment.',{passage:'During the school environmental day, Aisha and her classmates cleaned the garden, planted two trees and labelled the waste bins. Their teacher explained that keeping the school clean helps everyone learn in a healthy environment.'})
  ],medium:[
    q('p5eng3','Comprehension II','What can be inferred about Aisha and her classmates?',['They took part in caring for their school','They refused to work together','They were preparing for a football match','They were travelling during school hours'],0,'Their cleaning, planting and labelling activities show that they participated in caring for the school.',{passage:'During the school environmental day, Aisha and her classmates cleaned the garden, planted two trees and labelled the waste bins. Their teacher explained that keeping the school clean helps everyone learn in a healthy environment.'})
  ]});

  add('primary4|term1|Mathematics',{easy:[
    q('p4m1','Whole Numbers','Which number is greater: 4,305 or 4,350?',['4,305','4,350','They are equal','4,035'],1,'4,350 is greater because the tens digit is 5 rather than 0.'), 
    q('p4m2','Place Value','What is the value of 7 in 5,742?',['7','70','700','7,000'],2,'The 7 is in the hundreds place, so its value is 700.'),
    q('p4m3','Fractions','Which fraction is equivalent to 1/2?',['1/3','2/4','3/5','2/3'],1,'2/4 simplifies to 1/2.')
  ],medium:[
    q('p4m4','Data Presentation','Study the chart. Which class recorded the highest number of books read?',['Year 4','Year 5','Year 6','They are equal'],2,'Year 6 has the tallest bar.',{media:{type:'chart',label:'Books read by class',svg:'<svg viewBox="0 0 520 300" role="img" aria-label="Bar chart: Year 4 12 books, Year 5 18 books, Year 6 24 books"><rect width="520" height="300" rx="18" fill="#f8fbff"/><line x1="70" y1="245" x2="480" y2="245" stroke="#64748b" stroke-width="2"/><line x1="70" y1="35" x2="70" y2="245" stroke="#64748b" stroke-width="2"/><g fill="#635bff"><rect x="110" y="145" width="75" height="100" rx="8"/><rect x="225" y="95" width="75" height="150" rx="8"/><rect x="340" y="45" width="75" height="200" rx="8"/></g><g font-family="Arial" font-size="17" font-weight="700" fill="#18233a" text-anchor="middle"><text x="147" y="270">Year 4</text><text x="262" y="270">Year 5</text><text x="377" y="270">Year 6</text><text x="147" y="136">12</text><text x="262" y="86">18</text><text x="377" y="36">24</text></g></svg>'}})
  ]});

  add('primary6|term1|Basic Science & Technology',{easy:[
    q('p6s1','Science and Technology','Which statement best describes science?',['The systematic study of nature through observation and investigation','A collection of guesses','Only the study of computers','A type of sport'],0,'The supplied scheme describes science as systematic study through observation, questioning, experiments and reasoning.'),
    q('p6s2','Branches of Science','Which branch of science studies living things?',['Physics','Chemistry','Biology','Geology'],2,'Biology studies living things such as plants, animals and humans.'),
    q('p6s3','Scientific Method','What normally comes after forming a hypothesis in the scientific method?',['Experimentation','Closing the school','Guessing the result','Drawing a map'],0,'The scheme lists experimentation as the next major step after forming a hypothesis.')
  ],medium:[
    q('p6s4','Scientific Method','Why do scientists carry out experiments?',['To test a hypothesis with evidence','To avoid observations','To replace all measurements','To make a story more interesting'],0,'Experimentation tests a possible explanation using evidence.')
  ]});

  // JSS2–3 mathematics: directly tied to supplied scheme topics
  add('jss3|term1|Mathematics',{easy:[
    q('j3m1','Binary Number System','What is 101₂ in base 10?',['3','4','5','6'],2,'101₂ = 4 + 1 = 5.'),
    q('j3m2','Direct and Inverse Proportion','If y varies directly as x and y = 12 when x = 3, what is y when x = 5?',['15','20','24','60'],1,'The constant of variation is 4, so y = 4 × 5 = 20.'),
    q('j3m3','Rational and Non-Rational Numbers','Which number is rational?',['√2','π','3/4','√5'],2,'3/4 is a ratio of two integers with a non-zero denominator.')
  ],medium:[
    q('j3m4','Factorization','Factorise x² − 9.',['(x−3)(x+3)','(x−9)(x+1)','x(x−9)','(x−3)²'],0,'x² − 9 is a difference of two squares: (x−3)(x+3).'),
    q('j3m5','Simple Equations Involving Fractions','Solve x/3 = 5.',['8','10','15','18'],2,'Multiply both sides by 3: x = 15.')
  ]});

  add('jss3|term3|Mathematics',{easy:[
    q('j3m6','Measures of Central Tendency','What is the mean of 2, 4 and 6?',['3','4','5','6'],1,'Mean = (2+4+6)/3 = 4.'),
    q('j3m7','Measures of Central Tendency','What is the median of 2, 5, 7, 9 and 12?',['5','7','8','9'],1,'The middle value in the ordered list is 7.'),
    q('j3m8','Measures of Central Tendency','What is the range of 4, 9, 2 and 7?',['5','6','7','11'],2,'Range = highest − lowest = 9 − 2 = 7.')
  ],medium:[
    q('j3m9','Data Presentation','Which type of chart is specifically listed for JSS3 data presentation?',['Pie chart','Flow chart','Pictogram only','Timeline'],0,'The supplied JSS3 third-term scheme includes data presentation using pie charts.')
  ]});

  // SS2 physics: supplied scheme topics
  add('ss2|term1|Physics',{easy:[
    q('ss2p1','Light Waves','Which law describes the relationship between the angle of incidence and angle of reflection?',['They are equal','Incidence is always zero','Reflection is always double incidence','They have no relationship'],0,'The law of reflection states that the angle of incidence equals the angle of reflection.'),
    q('ss2p2','Sound Waves','Which characteristic of sound is mainly associated with frequency?',['Pitch','Mass','Density','Weight'],0,'Frequency is associated with pitch.'),
    q('ss2p3','Human Eye','Which eye defect makes distant objects difficult to see clearly?',['Short sight','Long sight','Perfect vision','Colour naming'],0,'Short sight (myopia) makes distant objects appear unclear.')
  ],medium:[
    q('ss2p4','Gravitational Field','Which statement distinguishes mass from weight?',['Mass is amount of matter; weight is the force due to gravity','They are always identical','Weight is measured in kilograms only','Mass depends directly on gravity'],0,'Mass measures amount of matter, while weight is a gravitational force.'),
    q('ss2p5','Electric Charges','Which method of charging involves rubbing two different materials together?',['Friction','Induction only','Radiation','Condensation'],0,'Charging by friction involves rubbing materials together.')
  ]});

  add('ss2|term2|Physics',{easy:[
    q('ss2p6','Electromagnetic Induction','Which scientist is associated with the law of electromagnetic induction?',['Michael Faraday','Isaac Newton','Charles Darwin','Louis Pasteur'],0,'Faraday is associated with electromagnetic induction.'),
    q('ss2p7','Alternating Current','Which abbreviation is commonly used for alternating current?',['AC','DC','LED','GPS'],0,'AC means alternating current.')
  ],medium:[
    q('ss2p8','Transformers','A transformer is an application of what phenomenon?',['Electromagnetic induction','Photosynthesis','Evaporation','Sound absorption'],0,'Transformers operate through electromagnetic induction.')
  ]});

  // SS2 Nigerian History: supplied first-term scheme
  add('ss2|term1|Nigerian History',{easy:[
    q('ss2h1','Rise of Nationalism','Which newspaper is named in the supplied SS2 nationalism scheme?',['Lagos Daily News','Daily Planet','London Gazette','Morning Star'],0,'Lagos Daily News is listed among the newspapers connected with nationalist activity.'),
    q('ss2h2','Nationalist Movements','Which organisation is associated with Nnamdi Azikiwe in the scheme?',['NCNC','NPC only','Action Group only','NNDP only'],0,'The scheme associates Nnamdi Azikiwe with the NCNC.'),
    q('ss2h3','Towards Independence','In what year did Nigeria gain independence?',['1954','1957','1960','1963'],2,'Nigeria gained independence in 1960.')
  ],medium:[
    q('ss2h4','Colonial Constitutional Developments','Which constitution is listed for 1954?',['Lyttleton Constitution','Clifford Constitution','Richards Constitution','Macpherson Constitution'],0,'The supplied scheme lists the Lyttleton Constitution under 1954.')
  ]});

  // SS3 Further Mathematics: graphs/data concepts explicitly present in supplied scheme
  add('ss3|term1|Further Mathematics',{easy:[
    q('ss3fm1','Correlation','What does correlation describe?',['A measure of relationship between variables','A type of triangle','A method of cooking','A unit of mass'],0,'The supplied SS3 scheme defines correlation as a measure of relationship.'),
    q('ss3fm2','Probability Distributions','Which distribution is explicitly listed in the SS3 scheme?',['Binomial distribution','Only uniform colour distribution','Only rainfall distribution','Only map distribution'],0,'Binomial distribution is one of the listed probability distributions.')
  ],medium:[
    q('ss3fm3','Scatter Diagrams','Which visual is used to examine the relationship between paired data values?',['Scatter diagram','Pie chart only','Photograph','Floor plan'],0,'Scatter diagrams are used to examine relationships between paired data values.')
  ]});

  window.QUIZY_ACADEMY_EXPANSION_V2='1.0';
})();