
/* ================= eras: story + look ================= */
const NX=0,TH=-1;
const fy=y=>y===NX?'∞':y===TH?'END':y<=-1e6?Math.round(-y/1e6)+' MYA':y<0?(-y)+' BC':y<1000?y+' AD':String(y);
const fyS=y=>y<=-1e6?Math.round(-y/1e6)+'MYA':y<0?(-y)+'BC':y<1000?y+'AD':String(y);
const ERA={
 [-66000000]:{name:"Age of Dinosaurs",film:'none',land:'burrow',
  mission:{date:"66 million years ago",must:"An asteroid ends the age of the dinosaurs, and a tiny shrew-like mammal survives in its burrow. Every mammal alive today descends from it.",task:"The burrow is blocked. Bring the <em>digging claw</em> to the <em>burrow</em> and dig before the sky burns.",item:"digging claw",label:"burrow",time:85,
   mini:{type:'timing',skin:'dig',act:'DIG',title:"DIG THE BURROW",hint:"Tap DIG when the marker is inside the gold zone. Three clean digs reach safety."}},
  npc:{coats:['#7a5a3a','#5a6a3a','#8a6a48','#4a5a3a','#a07a50'],pants:['#4a3a28','#3a3a28'],hats:['none','none','cap'],hatCs:['#5a4a2a','#6a5a3a']},
  talk:["Rawr!","Hrrrm.","Skreee!","*sniff sniff*"],
  look:{sky:['#3a6a4a','#9ab870','#f0d890'],fog:'#a8c080',fogD:.012,sun:['#fff0c0',2.6],sunPos:[20,40,20],hemi:['#d0e8b0','#4a5a2a',1],exp:1,bloom:[.3,.8],
   ground:['dirt','#6a6a3a',.95,0],bld:null,far:{kind:'hills',cols:['#3a6a3a','#4a7a3a']},lamps:null,wx:['motes','#ffb060',120],clouds:'#e8e0c0',disc:'sun',extra:['ferns','dinos','volcano']}},
 [-15000]:{name:"The Ice Age",film:'none',land:'cave',
  mission:{date:"About 15,000 years ago",must:"Painters in a cave at Lascaux record a great hunt on the wall. It becomes some of the oldest art ever found.",task:"The painters' <em>ochre</em> was lost in the snow. Bring it to the <em>painted cave</em> and repeat the ritual pattern.",item:"ochre pigment",label:"painted cave",time:80,
   mini:{type:'simon',skin:'ochre',title:"PAINT THE WALL",hint:"Watch the four handprints glow, then repeat the pattern. Keys 1–4 work too."}},
  npc:{coats:['#6a4a30','#8a6a48','#5a4030','#a08060'],pants:['#4a3a2a','#3a2a1e'],hats:['none','none','cap'],hatCs:['#5a4030','#7a5a3a']},
  talk:["Fire is the best thing ever.", "Have you seen the mammoths?", "Cold today. Cold yesterday too.", "That paint is red. Wow."],
  look:{sky:['#7a9ac0','#c8dcec','#f4f8ff'],fog:'#d8e8f4',fogD:.013,sun:['#fff8f0',2.2],sunPos:[-20,35,25],hemi:['#d8ecff','#8a9aa8',1.05],exp:1,bloom:[.3,.85],
   ground:['snow','#eef4fa',.7,0],bld:null,far:{kind:'hills',cols:['#c8d8e8','#b8cade']},lamps:null,wx:['snow','#ffffff',500],clouds:'#ffffff',disc:'sun',extra:['pines','mammoths']}},
 [-2560]:{name:"The Pyramid Builders",film:'sepia',land:'pyrsite',
  mission:{date:"About 2560 BC",must:"The last casing stone is set on the Great Pyramid of Giza. It stays the tallest structure on Earth for nearly four thousand years.",task:"The master builder's <em>copper chisel</em> is missing. Bring it to the <em>building site</em> and lower the capstone into place.",item:"copper chisel",label:"building site",time:80,
   mini:{type:'timing',skin:'stone',act:'LOWER',title:"LOWER THE CAPSTONE",hint:"Tap LOWER when the marker is inside the gold zone. Three clean drops set the stone."}},
  npc:{coats:['#f0e8d0','#e8dcc0','#d8c8a0','#ffffff'],pants:['#e8dcc0','#d8c8a0'],hats:['none','none','none'],hatCs:['#c9a24a']},
  talk:["The Pharaoh wants it finished.", "Mind the sledges!", "Water, please. So much sand.", "Our pyramid will stand forever."],
  look:{sky:['#5a9ad0','#b8d8e8','#fff0cc'],fog:'#f0e0b8',fogD:.011,sun:['#fff4d0',3],sunPos:[30,50,20],hemi:['#fff0d0','#b09060',1],exp:1,bloom:[.25,.85],
   ground:['sand','#e8d098',1,0],bld:null,
   far:{kind:'dunes',cols:['#e8d098','#d8c088']},lamps:null,wx:['dust','#f0e0b0',240],clouds:'#fff8e8',disc:'sun',extra:['pyramids','palms','mudhuts','blocks']}},
 80:{name:"Imperial Rome",film:'kodak',land:'colosseum',
  mission:{date:"AD 80",must:"The Colosseum opens with a hundred days of games. It is the largest arena ever built.",task:"The arena's <em>bronze key</em> is lost in the forum. Bring it to the <em>Colosseum</em> and open the gates in the right order.",item:"bronze key",label:"Colosseum",time:80,
   mini:{type:'simon',skin:'mosaic',title:"OPEN THE GATES",hint:"Watch the four gates light up, then repeat the order. Keys 1–4 work too."}},
  npc:{coats:['#f4f0e8','#c8383a','#e8dcc0','#6a4a8a','#d8c8a8'],pants:['#e8dcc0','#c8b898'],hats:['none','none','none'],hatCs:['#4a8a4a']},
  talk:["Bread and circuses!", "All roads lead here.", "Have you seen the new arena?", "Mind the chariots!"],
  look:{sky:['#4a8ad0','#9ac8e8','#f8ecd0'],fog:'#e8dcc0',fogD:.01,sun:['#fff4dc',3],sunPos:[25,50,25],hemi:['#fff0d8','#a08868',1],exp:1,bloom:[.3,.85],
   ground:['cobbles','#b8a890',.8,0],bld:{style:'flat',cols:['#e8dcc0','#d8c8a8','#e0b890','#f0e8d0'],win:'#3a2a1a',litC:'#ffd890',lit:.05,h:[4,8],w:[5,8],d:[5,7],roof:'gable',roofC:'#b8603a'},
   far:{kind:'hills',cols:['#7a9a6a','#8aa070']},lamps:null,wx:['leaves','#8aa05a',40],clouds:'#ffffff',disc:'sun',extra:['trees','columns']}},
 1000:{name:"The Viking Age",film:'oil',land:'longship',
  mission:{date:"About the year 1000",must:"Leif Erikson's crew lands in North America, almost five hundred years before Columbus.",task:"The navigator's <em>sunstone</em> is gone. Bring it to the <em>longship</em> and find the way across the sea.",item:"sunstone",label:"longship",time:80,
   mini:{type:'tune',skin:'sunstone',title:"FIND THE SUN",hint:"Drag (or use ← →) until the light is clean, then hold it steady."}},
  npc:{coats:['#6a4a30','#4a5a6a','#8a3a2a','#5a4a3a'],pants:['#3a2a20','#4a3a2a'],hats:['none','cap','none'],hatCs:['#8a8a90','#5a5a60']},
  talk:["West! Always west!", "The sea is calm today.", "Odin watches the brave.", "Bring mead for the voyage."],
  look:{sky:['#5a7a98','#a8bccc','#e0e4e0'],fog:'#b8c8d0',fogD:.013,sun:['#f4f0e8',2],sunPos:[-25,30,25],hemi:['#c8d8e8','#6a6a5a',.95],exp:1,bloom:[.3,.85],
   ground:['dirt','#6a7a4a',.95,0],bld:null,
   far:{kind:'hills',cols:['#5a7a6a','#4a6a5a']},lamps:null,wx:['dust','#c8d4d8',100],clouds:'#e8eef0',disc:'sun',extra:['pines','longhouses']}},
 1610:{name:"The Renaissance",film:'oil',land:'observatory',
  mission:{date:"January 7, 1610",must:"An astronomer in Padua spots the moons of Jupiter through a telescope.",task:"The telescope's <em>lens</em> was dropped in the market. Bring it to the <em>observatory</em>, then find the moons.",item:"lens",label:"observatory",time:85,
   mini:{type:'targets',skin:'moons',title:"FIND THE MOONS",hint:"Tap the 4 moons lined up beside Jupiter. The other dots are stars."}},
  npc:{coats:['#6a2a2a','#2a3a5a','#5a4a2a','#3a3a3a','#7a5a3a'],pants:['#2a2420','#3a2a2a'],hats:['none','cap','none'],hatCs:['#4a1a1a','#1a2a4a']},
  talk:["The heavens never change, they say.", "Have you seen the new spyglass?", "Mind the canal!", "Buonasera!"],
  look:{sky:['#060d22','#1c2a50','#4a4466'],fog:'#1a1e36',fogD:.016,sun:['#9fb4ff',.55],sunPos:[-30,40,20],night:1,hemi:['#3a4a80','#2a1a10',.45],exp:1.05,bloom:[.85,.6],
   ground:['cobbles','#7a5a44',.85,0],bld:{style:'gable',cols:['#8a4a2a','#9a5a34','#7a4026','#a0683e'],win:'#22160e',litC:['#ffcf7a','#ffb050'],lit:.38,h:[5,9],w:[4,7],d:[5,7],roof:'gable',roofC:'#5a2a18'},
   far:{kind:'city',cols:['#1e1c38','#25224a'],h:[6,14],roof:'gable'},lamps:'#ffb050',wx:['motes','#ffb050',160],stars:900,disc:'moon',extra:['bell']}},
 1869:{name:"The Iron Horse",film:'tintype',land:'junction',
  mission:{date:"May 10, 1869",must:"The first transcontinental railroad in the United States is completed with a golden spike.",task:"The ceremonial <em>golden spike</em> fell off a wagon. Bring it to the <em>rail junction</em> and drive it in.",item:"golden spike",label:"rail junction",time:80,
   mini:{type:'timing',skin:'hammer',title:"DRIVE THE SPIKE",hint:"Tap STRIKE when the marker is inside the gold zone. Three clean hits. Three misses and you start over."}},
  npc:{coats:['#5a4636','#3a3530','#6b5a48','#4a3a2e'],pants:['#2b2420','#3a322a','#4a4030'],hats:['top','fedora','fedora'],hatCs:['#1d1a18','#6a5038','#3a2c20']},
  talk:["Coast to coast by rail, imagine that!", "The telegraph will tell the whole country.", "Dusty day for a ceremony.", "Mind the tracks!"],
  look:{sky:['#7e9cb0','#c8c8b8','#efe0c0'],fog:'#d8c8a8',fogD:.012,sun:['#fff0d0',2.8],sunPos:[30,45,25],hemi:['#c8d8e8','#8a6a40',.9],exp:1,bloom:[.25,.85],
   ground:['dirt','#b89a70',.95,0],bld:{style:'wood',cols:['#7a5a3a','#8a6a48','#5a4636','#9a7a50'],win:'#2a2016',litC:'#ffd890',lit:.08,h:[4,6.5],w:[5,8],d:[5,7],roof:'false'},
   far:{kind:'mesa',cols:['#b07a50','#a06a44'],h:[10,22]},lamps:null,wx:['dust','#e0c890',220],clouds:'#fff6e0',disc:'sun',extra:['rails','poles']}},
 1903:{name:"Dawn of Flight",film:'sepia',land:'hangar',
  mission:{date:"December 17, 1903",must:"The first powered airplane flight takes off.",task:"The flyer is missing its spare <em>propeller</em>. Bring it to the <em>hangar</em>, then keep the flyer in the air.",item:"propeller",label:"hangar",time:80,
   mini:{type:'hold',skin:'plane',title:"KEEP IT FLYING",hint:"Hold to climb, release to sink. Stay inside the green band for 6 seconds. The wind will push you around.",crash:"The flyer hit the sand. Again!"}},
  npc:{coats:['#4a4038','#6a5a48','#2a2a2a','#5a4a3a'],pants:['#2a2420','#3a3028'],hats:['fedora','cap','none'],hatCs:['#3a2a20','#5a4a3a']},
  talk:["Have you seen those flying machines?", "The wind is perfect today.", "Mind the horses!", "Mark my words: it will never fly."],
  look:{sky:['#7aa8cc','#bcd4e0','#f4e8d0'],fog:'#e8e0cc',fogD:.011,sun:['#fff4e0',2.6],sunPos:[-20,35,30],hemi:['#d0e0f0','#a08a60',1],exp:1,bloom:[.22,.85],
   ground:['sand','#e0cfa0',1,0],bld:{style:'wood',cols:['#8a7a62','#7a6a52','#9a8a70'],win:'#2a2418',litC:'#ffe0a0',lit:.05,h:[3,5],w:[5,8],d:[4,6],roof:'gable',roofC:'#5a4a3a',sparse:1},
   far:{kind:'dunes',cols:['#d8c090','#c8b080']},lamps:null,wx:['dust','#f0e0b8',260],clouds:'#ffffff',disc:'sun',extra:['poles','sea']}},
 1927:{name:"The Roaring Twenties",film:'bw',land:'palace',
  mission:{date:"October 6, 1927",must:"The first feature film with synchronized dialogue premieres.",task:"The <em>sound discs</em> for the premiere went missing. Bring them to the <em>movie palace</em>, then sync them to the film.",item:"sound discs",label:"movie palace",time:75,
   mini:{type:'timing',skin:'reel',title:"SYNC THE SOUND",hint:"Tap SYNC when the needle crosses the gold zone, so the voices match the lips. Three hits in a row."}},
  npc:{coats:['#3a3a3a','#2a2a30','#5a5050','#4a4038'],pants:['#1a1a1a','#2a2a2a'],hats:['fedora','fedora','top'],hatCs:['#1a1a1a','#3a3a3a']},
  talk:["Talking pictures? Never!", "The tram is late again.", "Swell evening, isn't it?", "I hear they'll sing on screen!"],
  look:{sky:['#1a1c22','#3a3e48','#6a6e78'],fog:'#3a3e46',fogD:.02,sun:['#c8d0e0',.9],sunPos:[20,40,10],night:1,hemi:['#606878','#202020',.5],exp:1.1,bloom:[.8,.55],
   ground:['asphalt','#3a3a3e',.25,.2],bld:{style:'deco',cols:['#4a4a50','#5a5658','#3e3e44','#62605e'],win:'#141418',litC:['#ffd890','#fff0c0'],lit:.42,h:[10,18],w:[5,8],d:[6,8],roof:'deco'},
   far:{kind:'city',cols:['#2a2c34','#32343c'],h:[16,30],roof:'deco'},lamps:'#ffe0a0',wx:['rain','#c8d0dc',900],gloss:1,extra:['tram']}},
 1957:{name:"The Fifties",film:'kodak',land:'radio',
  mission:{date:"October 4, 1957",must:"Radio amateurs pick up the beep of the first artificial satellite.",task:"The radio club needs a spare <em>vacuum tube</em>. Bring it to the <em>radio club</em> and tune in the satellite.",item:"vacuum tube",label:"radio club",time:75,
   mini:{type:'tune',skin:'radio',title:"CATCH THE BEEP",hint:"Drag across the dial (or use ← →) until the signal is clean, then hold it there."}},
  npc:{coats:['#d86a6a','#6aa8c8','#e8c86a','#8ac88a','#c88ad8'],pants:['#2a3a5a','#3a2a2a','#2a2a2a'],hats:['none','cap','fedora'],hatCs:['#c83a3a','#3a3a8a']},
  talk:["Did you hear about the satellite?", "Milkshake, anyone?", "My radio picks up everything!", "Daddy-o, that's a cool coat."],
  look:{sky:['#3a8ad8','#8ac0ec','#e8f4ff'],fog:'#d0e4f4',fogD:.01,sun:['#fff8e8',3],sunPos:[25,50,30],hemi:['#c0dcff','#8a7a6a',1],exp:1,bloom:[.3,.85],
   ground:['asphalt','#5a5a60',.6,0],bld:{style:'flat',cols:['#e8a8b8','#a8d8d0','#f0e0a0','#f4f0e4','#c8e0a8'],win:'#3a4a5a',litC:'#ffe8b0',lit:.06,h:[3.5,6],w:[5,8],d:[5,7],roof:'cornice',roofC:'#ffffff'},
   far:{kind:'hills',cols:['#6a9a6a','#5a8a6a']},lamps:null,clouds:'#ffffff',disc:'sun',extra:['cars','trees']}},
 1969:{name:"Summer of '69",film:'faded',land:'tvshop',
  mission:{date:"July 20, 1969",must:"The whole town watches the first Moon landing on live TV.",task:"The TV shop's <em>antenna</em> blew away. Bring it back to the <em>TV shop</em> and aim it until the picture clears.",item:"antenna",label:"TV shop",time:75,
   mini:{type:'tune',skin:'tv',title:"AIM THE ANTENNA",hint:"Drag left and right (or use ← →) to turn the antenna. Hold it where the picture is clear."}},
  npc:{coats:['#c86a3a','#e8b84a','#6a8a3a','#8a4a8a','#3a8aa8'],pants:['#4a5a8a','#6a4a2a','#3a3a5a'],hats:['none','none','cap'],hatCs:['#e8c84a','#c83a3a']},
  talk:["Men on the Moon, can you dig it?", "Far out!", "My TV's on the fritz.", "Peace, friend."],
  look:{sky:['#5a6aa8','#e8905a','#ffd8a0'],fog:'#f0b888',fogD:.012,sun:['#ffb070',2.6],sunPos:[-40,14,10],hemi:['#ffc8a0','#6a4a3a',.85],exp:1.05,bloom:[.4,.75],
   ground:['asphalt','#7a6a58',.7,0],bld:{style:'brick',cols:['#a0603a','#8a5a3a','#c08048','#6a4a38'],win:'#2a2a3a',litC:'#ffd080',lit:.18,h:[4,8],w:[5,8],d:[5,7],roof:'cornice',roofC:'#4a3020'},
   far:{kind:'hills',cols:['#8a6a6a','#7a5a6a']},lamps:'#ffc070',wx:['motes','#ffe090',120],clouds:'#ffd8b0',disc:'sun',extra:['cars','poles']}},
 1985:{name:"Neon Eighties",film:'vhs',land:'stage',
  mission:{date:"July 13, 1985",must:"The Live Aid benefit concert goes on the air.",task:"The stage crew blew a fuse. Bring the spare <em>fuse</em> to the <em>stage</em>, then light the mixing board in the right order.",item:"fuse",label:"stage",time:75,
   mini:{type:'simon',skin:'board',title:"LIGHT THE BOARD",hint:"Watch the four channels light up, then repeat the pattern. Keys 1–4 work too."}},
  npc:{coats:['#ff3a8a','#3ae8ff','#ffe83a','#8a3aff','#2a2a2a'],pants:['#1a1a3a','#2a2a2a','#3a1a3a'],hats:['none','cap','none'],hatCs:['#ff3a8a','#3ae8ff']},
  talk:["Did you set your VCR?", "Totally rad!", "The concert is on every channel.", "Got any spare quarters?"],
  look:{sky:['#05030f','#2a0a4a','#ff3a8a'],fog:'#2a0a3a',fogD:.018,sun:['#ff7ac8',.6],sunPos:[0,20,-60],night:1,hemi:['#6a3aa8','#1a0a2a',.45],exp:1.1,bloom:[1.1,.45],
   ground:['grid','#0e0a1a',.18,.4],neon:'#ff3ac8',bld:{style:'flat',cols:['#1a1428','#221a34','#140f20'],win:'#0a0814',litC:['#ff3ac8','#3ae8ff','#ffe83a'],lit:.22,h:[8,16],w:[5,8],d:[6,8],roof:'flat',band:['#ff3ac8','#3ae8ff']},
   far:{kind:'city',cols:['#140a24','#1a0c2e'],h:[18,34]},lamps:'#3ae8ff',wx:['motes','#ff7ae0',180],stars:400,disc:'synth',gloss:1}},
 1999:{name:"End of the Millennium",film:'crt',land:'bank',
  mission:{date:"December 31, 1999",must:"The bank's computers roll over to the year 2000 without crashing.",task:"Find the <em>floppy disk</em> with the Y2K patch, bring it to the <em>server room</em> and type the fix before midnight.",item:"floppy disk",label:"server room",time:75,
   mini:{type:'sequence',skin:'code',code:'Y2KFIX',title:"INSTALL THE PATCH",hint:"Type the command shown on the screen, letter by letter. One typo and you start the line again."}},
  npc:{coats:['#2a3a5a','#5a5a6a','#8a2a2a','#2a2a2a','#4a6a4a'],pants:['#2a2a3a','#1a1a1a','#3a3a4a'],hats:['none','none','cap'],hatCs:['#2a2a5a','#8a2a2a']},
  talk:["Did you back up your files?", "My modem is still dialing...", "See you next millennium!", "Is the world ending at midnight?"],
  look:{sky:['#0e1630','#2a3a64','#6a7aa0'],fog:'#5a6a8a',fogD:.016,sun:['#b8c8ff',.7],sunPos:[20,40,20],night:1,hemi:['#6a7ab0','#c0c8d8',.55],exp:1.1,bloom:[.7,.6],
   ground:['snow','#dce4ee',.6,0],bld:{style:'glass',cols:['#4a5a70','#3a4a60','#5a6a80'],win:'#1a2030',litC:['#e0f0ff','#ffffff','#c0e0ff'],lit:.35,h:[10,20],w:[6,9],d:[6,8],roof:'flat'},
   far:{kind:'city',cols:['#2a3450','#323c5a'],h:[18,36]},lamps:'#e8f0ff',wx:['snow','#ffffff',700],stars:200}},
 2026:{name:"Present Day",film:'none',
  npc:{coats:['#3a5a8a','#8a3a3a','#e8e8e8','#2a2a2a','#5a8a5a','#c8a050'],pants:['#2a3a5a','#1a1a1a','#5a5a5a'],hats:['none','cap','none'],hatCs:['#1a1a1a','#c83a3a']},
  talk:["My phone says it will rain.", "Is that a costume?", "Have you tried the new transit line?", "Nice goggles!"],
  look:{sky:['#3a7ad0','#8ab8e8','#e8f2ff'],fog:'#c8dcf0',fogD:.01,sun:['#fffaf0',3],sunPos:[30,50,30],hemi:['#c8e0ff','#6a6a5a',1],exp:1,bloom:[.3,.85],
   ground:['pavement','#7e7e7a',.8,0],bld:{style:'glass',cols:['#6a8aa8','#8a9aa8','#5a7a98','#a8b0b8'],win:'#2a3a4a',litC:'#ffffff',lit:.08,h:[8,20],w:[6,9],d:[6,8],roof:'flat'},
   far:{kind:'city',cols:['#8aa0b8','#98acc0'],h:[20,45]},lamps:null,wx:['leaves','#7aaa5a',60],clouds:'#ffffff',disc:'sun',extra:['trees','cars']}},
 2088:{name:"Garden Cities",film:'future',land:'dome',
  mission:{date:"According to the archives",must:"The first vertical forest city opens its gardens.",task:"Bring the <em>seed capsule</em> to the <em>greenhouse</em>, then catch the runaway pollinator drones.",item:"seed capsule",label:"greenhouse",time:75,
   mini:{type:'targets',skin:'drones',title:"CATCH THE DRONES",hint:"Tap the 4 blinking pollinator drones. Leaves don't count."}},
  npc:{coats:['#e8f0e8','#8ac8a8','#c8e8d8','#5a8a7a'],pants:['#3a5a4a','#e8e8e0'],hats:['none','none','visor'],hatCs:['#5ae8b8','#ffffff']},
  talk:["Remember when cars drove on roads?", "The rooftop farms are in bloom.", "Your suit looks vintage.", "Mind the drones."],
  look:{sky:['#2a7a8a','#7ac8c0','#e0fff0'],fog:'#a8e0d0',fogD:.012,sun:['#f0fff0',2.4],sunPos:[-25,45,25],hemi:['#c0fff0','#3a6a4a',1],exp:1,bloom:[.5,.7],
   ground:['tiles','#c8d8d0',.5,.1],bld:{style:'glass',cols:['#d8e8e0','#c0d8d0','#e8f0e8'],win:'#4a6a6a',litC:['#a0ffe0','#ffffff'],lit:.2,h:[10,22],w:[6,9],d:[6,8],roof:'terrace'},
   far:{kind:'city',cols:['#6aa898','#78b4a4'],h:[24,50],roof:'terrace'},lamps:'#a0ffe0',wx:['motes','#a0ffd0',160],clouds:'#ffffff',disc:'sun',extra:['trees','drones']}},
 2150:{name:"Orbital Age",film:'future',land:'pad',
  mission:{date:"According to the archives",must:"The first passenger shuttle docks with the orbital ring.",task:"Bring the <em>docking key</em> to the <em>launch pad</em>, then time the three docking burns.",item:"docking key",label:"launch pad",time:75,
   mini:{type:'timing',skin:'dock',title:"DOCK THE SHUTTLE",hint:"Tap BURN when the marker is inside the gold zone. Three clean burns and you're docked."}},
  npc:{coats:['#2a2a4a','#e8e8f8','#5a3a8a','#3a5a8a'],pants:['#1a1a2a','#e0e0f0'],hats:['visor','none','none'],hatCs:['#ff7ac8','#7ae8ff']},
  talk:["The shuttle to the ring leaves at noon.", "Gravity feels heavy today.", "Earth looks so small from up there.", "Is that... fabric?"],
  look:{sky:['#04020c','#1e1240','#c05a90'],fog:'#2a1a40',fogD:.014,sun:['#ffb0d8',.9],sunPos:[-40,30,-40],night:1,hemi:['#7a5aa8','#1a1020',.5],exp:1.1,bloom:[.95,.5],
   ground:['tiles','#2a2838',.22,.5],bld:{style:'glass',cols:['#2a2a40','#34344c','#222236'],win:'#101020',litC:['#ff9ad8','#9ae8ff','#ffffff'],lit:.3,h:[14,28],w:[5,8],d:[6,8],roof:'needle',band:['#ff7ac8','#7ae8ff']},
   far:{kind:'city',cols:['#1c1430','#22183a'],h:[30,60],roof:'needle'},lamps:'#ff9ad8',wx:['motes','#ffc0f0',150],stars:1200,extra:['ring','traffic']}},
 2240:{name:"The Great Archive",film:'none',land:'archive',
  mission:{date:"According to the archives",must:"The Great Archive stores all of human history in one place.",task:"Bring the <em>memory crystal</em> to the <em>Great Archive</em> and repeat the storage pattern.",item:"memory crystal",label:"Great Archive",time:75,
   mini:{type:'simon',skin:'archive',title:"STORE THE MEMORY",hint:"Watch the four vaults pulse, then repeat the pattern. Keys 1–4 work too."}},
  npc:{coats:['#f4f0e8','#e8dcc0','#d8c8a8','#ffffff'],pants:['#c8b898','#e8e0d0'],hats:['none','none','none'],hatCs:['#ffd890']},
  talk:["Time travel? That's so 2088.", "The archive remembers everything.", "We stopped counting years, mostly.", "You look... historical."],
  look:{sky:['#e0b870','#f4dca8','#fff8ec'],fog:'#f4e4c8',fogD:.012,sun:['#fff0d0',2.8],sunPos:[20,40,30],hemi:['#fff0d8','#a08a60',1.1],exp:.95,bloom:[.35,.8],
   ground:['tiles','#f0e8d8',.35,.1],bld:{style:'flat',cols:['#f4f0e8','#ece4d4','#faf6ee'],win:'#c8b898',litC:'#ffd890',lit:.1,h:[8,16],w:[5,8],d:[6,8],roof:'round'},
   far:{kind:'city',cols:['#e8d4b0','#f0dcb8'],h:[20,40],roof:'round'},lamps:null,wx:['motes','#ffd080',140],clouds:'#ffffff',disc:'sun',extra:['floaters']}},
 2400:{name:"First Contact",film:'deep',land:'array',
  mission:{date:"According to the archives",must:"Humanity receives its first reply from another star.",task:"Bring the <em>decoder chip</em> to the <em>deep space array</em> and lock onto the signal.",item:"decoder chip",label:"deep space array",time:75,
   mini:{type:'tune',skin:'signal',title:"LOCK THE SIGNAL",hint:"Drag (or use ← →) until the wave turns clean, then hold it steady."}},
  npc:{coats:['#2a2a5a','#4a3a8a','#1a1a3a','#6a5aa8'],pants:['#1a1a2a','#2a2a4a'],hats:['none','visor','none'],hatCs:['#aa8aff','#ffffff']},
  talk:["Did you hear the sky last night?", "The array never sleeps.", "Do you think they can hear us?", "Old-timer, nice goggles."],
  look:{sky:['#010108','#0c0a2a','#2a2268'],fog:'#100c2a',fogD:.014,sun:['#a8a0ff',.8],sunPos:[30,50,-20],night:1,hemi:['#5a4aa8','#0a0818',.45],exp:1.15,bloom:[1,.45],
   ground:['tiles','#14122a',.15,.6],bld:{style:'glass',cols:['#1a1838','#22204a','#141230'],win:'#0a0a1a',litC:['#aa9aff','#7ae8ff'],lit:.25,h:[6,14],w:[6,9],d:[6,8],roof:'round',band:['#9a8aff']},
   far:{kind:'hills',cols:['#100c24','#140f2c']},lamps:'#aa9aff',wx:['motes','#b0a0ff',180],stars:1600,extra:['aurora','dishes']}},
 2600:{name:"The Origin",film:'none',land:'lab',
  mission:{date:"According to the archives",must:"The first time machine is switched on. This one. No machine, no you.",task:"Bring the <em>chronon core</em> to the <em>Origin Lab</em> and keep it stable while it powers up.",item:"chronon core",label:"Origin Lab",time:80,
   mini:{type:'hold',skin:'core',title:"STABILIZE THE CORE",hint:"Hold to raise the energy, release to drop it. Keep it inside the gold band for 6 seconds.",crash:"Core overload! Again."}},
  npc:{coats:['#2a1a0a','#c89a4a','#f0e0c0','#5a3a1a'],pants:['#1a1008','#3a2a18'],hats:['none','visor','none'],hatCs:['#ffd27a','#ffffff']},
  talk:["So you're the one from the stories.", "Everything starts here.", "Careful: this is where time begins.", "We've been expecting you."],
  look:{sky:['#0a0402','#4a1e08','#d8823a'],fog:'#3a1a0a',fogD:.014,sun:['#ffb060',1.8],sunPos:[-30,18,-30],hemi:['#ffb070','#2a1408',.6],exp:1.05,bloom:[.9,.55],
   ground:['tiles','#2a1e16',.25,.5],bld:{style:'glass',cols:['#3a2a1e','#2a2018','#4a3628'],win:'#140c06',litC:['#ffc070','#ffe0a0'],lit:.3,h:[10,22],w:[5,8],d:[6,8],roof:'needle',band:['#ffb050']},
   far:{kind:'city',cols:['#2a140a','#341a0e'],h:[24,50],roof:'needle'},lamps:'#ffc070',wx:['motes','#ffd080',220],stars:300,extra:['floaters','ring']}},
 [NX]:{name:"The Nexus",film:'deep',land:'shop',
  npc:{coats:['#5a2a7a'],pants:['#2a1440'],hats:['none'],hatCs:['#2a1440']},
  talk:["Coins for power, traveler.", "Every relic has a story.", "The Time Lord shops here too, you know.", "No Hunters past this door. House rules."],
  look:{sky:['#020310','#0a1230','#1c2a5a'],fog:'#0a1028',fogD:.012,sun:['#c0c8ff',.7],sunPos:[0,40,20],night:1,hemi:['#4a5aa8','#100818',.5],exp:1.1,bloom:[1,.45],
   ground:['grid','#0c1228',.2,.5],neon:'#c9a24a',bld:null,far:{kind:'none'},lamps:'#ffd27a',wx:['motes','#ffd890',200],stars:2000,extra:['clockrings','pillars']}},
 [TH]:{name:"The Throne of Time",film:'deep',land:'throne',
  npc:{coats:['#000000'],pants:['#000000'],hats:['none'],hatCs:['#000000']},talk:['…'],
  look:{sky:['#040002','#2a0610','#8a1a24'],fog:'#2a0610',fogD:.016,sun:['#ff7a6a',1],sunPos:[0,30,-40],night:1,hemi:['#8a2a3a','#100204',.5],exp:1.1,bloom:[1.05,.45],
   ground:['grid','#14040a',.18,.5],neon:'#ff3a4a',bld:null,far:{kind:'none'},lamps:'#ff3a4a',wx:['motes','#ff6a5a',200],stars:600,extra:['clockrings','pillars','shards']}}
};
const YEARS=[-66000000,-15000,-2560,80,1000,1610,1869,1903,1927,1957,1969,1985,1999,2026,2088,2150,2240,2400,2600];
const RELIC={[-66000000]:['Amber Fossil','+25 max mana'],[-15000]:['Ochre Handprint','+15 max health'],[-2560]:['Scarab Amulet','+20% coins'],80:['Gladiator Helm','-8% damage taken'],1000:['Runestone','+6% speed'],1610:["Astronomer's Lens",'+25% coins'],1869:['Railroad Watch','+6 s on missions'],1903:['Aviator Goggles','+6% speed'],1927:['Jazz Record','heat cools 40% faster'],1957:['Tube Amplifier','+5 damage'],1969:['Moon Rock','+20 max health'],
 1985:['Walkman','dash recharges 15% faster'],1999:['Y2K Survival Kit','-10% damage taken'],2026:['Lucky Coin','+25% coins'],2088:['Seed of Life','health regenerates twice as fast'],2150:['Mag Boots','+6% speed'],2240:['Memory Shard','+6 s on missions'],2400:['Alien Alloy','-12% damage taken'],2600:['Chronon Spark','+8 damage']};
const WARES=[{k:'hp',n:'Reinforced Suit',d:'+25 max health',max:5,base:40},{k:'dmg',n:'Chrono Gauntlet',d:'+6 damage per hit',max:5,base:50},{k:'spd',n:'Flux Boots',d:'+8% walking speed',max:4,base:45},
 {k:'time',n:'Pocket Watch',d:'+10 seconds on every mission',max:4,base:60},{k:'mana',n:'Mana Vessel',d:'+25 max mana',max:4,base:45},
 {k:'dash',n:'Phase Coil',d:'Dash recharges 15% faster',max:3,base:55},{k:'heal',n:'Med Gel',d:'Restore all health now',base:25,use:1},{k:'cool',n:'Coolant',d:'Drop the heat to zero now',base:30,use:1}];
const TIERS=[[-66000000,80,1969,1985,1999,2026,2088],[1000,1927,1957,2150],[-15000,-2560,1903,2240],[1869,2400],[1610,2600]];
const hasM=y=>!!(ERA[y]&&ERA[y].mission);

/* ================= world constants ================= */
const L=52,ZMIN=-2.4,ZMAX=14,FRONT=-6.6;
let WD=null;          // current world
let LK=null;          // current look
const sun=new THREE.DirectionalLight('#ffffff',2);sun.castShadow=true;sun.shadow.mapSize.set(TOUCH?1024:2048,TOUCH?1024:2048);
{const c=sun.shadow.camera;c.left=-26;c.right=26;c.top=20;c.bottom=-16;c.near=1;c.far=140;sun.shadow.bias=-.0004;sun.shadow.normalBias=.03}
const hemi=new THREE.HemisphereLight('#ffffff','#444444',1);
scene.add(sun,sun.target,hemi);

/* ---------- small shared geometries ---------- */
const PRISM=()=>geo('prism',()=>{const s=new THREE.Shape();s.moveTo(-.5,0);s.lineTo(.5,0);s.lineTo(0,1);s.lineTo(-.5,0);const g=new THREE.ExtrudeGeometry(s,{depth:1,bevelEnabled:false});g.translate(0,0,-.5);g.rotateY(Math.PI/2);return g});
const HALFCYL=()=>geo('halfcyl',()=>{const g=new THREE.CylinderGeometry(.5,.5,1,28,1,false,-Math.PI/2,Math.PI);g.rotateX(-Math.PI/2);return g});
const CONE=()=>geo('cone',()=>new THREE.ConeGeometry(.5,1,20));
const DOME=()=>geo('dome',()=>new THREE.SphereGeometry(.5,32,16,0,Math.PI*2,0,Math.PI/2));
const TOR=(r,t)=>geo('tor'+r+t,()=>new THREE.TorusGeometry(r,t,10,72));
const ICO=()=>geo('ico',()=>new THREE.IcosahedronGeometry(.5,1));
const OCTA=()=>geo('octa',()=>new THREE.OctahedronGeometry(.5,0));

function textTex(txt,{w=512,h=128,font='700 80px "Chakra Petch",sans-serif',color='#ffffff',bg='#000000',glowC=null}={}){
  return canvasTex(w,h,(o)=>{o.fillStyle=bg;o.fillRect(0,0,w,h);o.font=font;o.textAlign='center';o.textBaseline='middle';if(glowC){o.shadowColor=glowC;o.shadowBlur=18}o.fillStyle=color;o.fillText(txt,w/2,h/2+4)},{repeat:false});
}
function sign(txt,w,h,c,opts={}){const t=textTex(txt,{color:c,glowC:c,...opts});const m=new THREE.MeshStandardMaterial({color:'#000',emissive:'#ffffff',emissiveMap:t,emissiveIntensity:opts.i||2.2,roughness:.5});return box(m,0,0,0,w,h,.12,false)}

/* ================= sky ================= */
function buildSky(g,lk,r,cg){
  const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:true,
    uniforms:{c0:{value:col(lk.sky[0])},c1:{value:col(lk.sky[1])},c2:{value:col(lk.sky[2])},sunDir:{value:new THREE.Vector3(...lk.sunPos).normalize()},sunC:{value:col(lk.sun[0])},glowK:{value:lk.night?.25:.6}},
    vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform vec3 c0,c1,c2,sunDir,sunC;uniform float glowK;varying vec3 vP;void main(){float h=vP.y;vec3 c=h>.18?mix(c1,c0,smoothstep(.18,.75,h)):mix(c2,c1,smoothstep(-.02,.18,h));
      float s=max(dot(vP,sunDir),0.);c+=sunC*(pow(s,8.)*.35+pow(s,64.)*.6)*glowK;gl_FragColor=vec4(c,1.);}`});
  WD.skyMat=skyMat;const sky=new THREE.Mesh(new THREE.SphereGeometry(420,32,20),skyMat);sky.renderOrder=-10;g.add(sky);
  if(lk.stars){const n=lk.stars,p=new Float32Array(n*3),c=new Float32Array(n*3);for(let i=0;i<n;i++){const th=r()*Math.PI*2,ph=Math.acos(1-r()*.95),R=400;p[i*3]=Math.sin(ph)*Math.cos(th)*R;p[i*3+1]=Math.cos(ph)*R;p[i*3+2]=Math.sin(ph)*Math.sin(th)*R;const k=.5+r()*.9;c[i*3]=k;c[i*3+1]=k*.96;c[i*3+2]=k*(.9+r()*.2)}
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(p,3));sg.setAttribute('color',new THREE.BufferAttribute(c,3));
    const st=new THREE.Points(sg,new THREE.PointsMaterial({size:2.2,sizeAttenuation:false,vertexColors:true,map:softTex,transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));g.add(st)}
  const sd=new THREE.Vector3(...lk.sunPos).normalize().multiplyScalar(380);
  if(lk.disc==='moon'){const m=sph(new THREE.MeshBasicMaterial({color:'#fff6dc',fog:false,toneMapped:false}),sd.x,sd.y,sd.z,9,false);g.add(m)}
  if(lk.disc==='sun'){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:lk.sun[0],fog:false,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.copy(sd);m.scale.setScalar(80);g.add(m)}
  if(lk.disc==='synth'){const t=canvasTex(256,256,(o,w,h)=>{const gr=o.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ffe83a');gr.addColorStop(.6,'#ff3a8a');gr.addColorStop(1,'#a01aff');o.fillStyle=gr;o.beginPath();o.arc(w/2,h/2,w/2-2,0,7);o.fill();o.globalCompositeOperation='destination-out';for(let y=h*.55,k=3;y<h;y+=k*3.2,k+=1.6)o.fillRect(0,y,w,k)},{repeat:false});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshBasicMaterial({map:t,transparent:true,fog:false,toneMapped:false,depthWrite:false}));m.position.set(0,22,-300);g.add(m)}
  if(lk.clouds){for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTex,color:lk.clouds,transparent:true,opacity:.55+r()*.35,fog:false,depthWrite:false}));s.position.set((r()-.5)*360,30+r()*50,-120-r()*120);s.scale.set(70+r()*80,28+r()*26,1);s.userData.drift=.6+r()*1.2;cg.add(s);WD.clouds.push(s)}}
}

/* ================= buildings ================= */
function makeFacades(lk,seed){const b=lk.bld,ei=lk.night?.85:.3;
  return b.cols.map((c,i)=>{const f=facade(b.style,c,b.win,b.litC,b.lit,seed+i*31);
    const m=new THREE.MeshStandardMaterial({map:f.map,emissiveMap:f.em,emissive:'#ffffff',emissiveIntensity:ei,roughness:b.style==='glass'?.25:.85,metalness:b.style==='glass'?.4:0});
    WD.shared.add(m);WD.shared.add(f.map);WD.shared.add(f.em);return m})}
function building(lk,fac,x,z,w,h,d,r,front){
  const b=lk.bld,g=new THREE.Group();g.position.set(x,0,z);
  const fm=pick(r,fac);
  const bg=new THREE.BoxGeometry(w,h,d);bg.translate(0,h/2,0);
  const uv=bg.attributes.uv,rxF=Math.max(1,Math.round(w/4)),rxS=Math.max(1,Math.round(d/4)),ry=Math.max(1,Math.round(h/4)/2);
  for(let f=0;f<6;f++){const sx=f<2?rxS:f<4?1:rxF;for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*sx,uv.getY(i)*ry)}}
  const roofM=mat(b.roofC||shadeHex(b.cols[0],.6),{roughness:.9});
  const body=new THREE.Mesh(bg,[fm,fm,roofM,roofM,fm,fm]);body.castShadow=body.receiveShadow=true;g.add(body);
  const trim=mat(shadeHex(b.cols[0],.7));
  switch(b.roof){
    case'gable':{const p=mesh(PRISM(),roofM,0,h,0,w+.4,w*.45,d+.4);g.add(p);if(r()<.5)g.add(box(trim,w*.25,h+w*.3,0,.5,1.2,.5));break}
    case'cornice':g.add(box(roofM,0,h+.15,0,w+.4,.3,d+.4));g.add(box(trim,0,h-.25,0,w+.2,.2,d+.2));break;
    case'deco':{g.add(box(mat(shadeHex(b.cols[0],.9)),0,h+.9,0,w*.7,1.8,d*.7));g.add(box(mat(shadeHex(b.cols[0],.8)),0,h+2.4,0,w*.4,1.2,d*.4));g.add(box(trim,0,h+3.6,0,.15,1.6,.15));break}
    case'false':{g.add(box(mat(shadeHex(b.cols[0],.85)),0,h+.8,d/2-.06,w,1.6,.12));g.add(box(trim,0,h+1.65,d/2,w+.2,.15,.3));g.add(box(trim,0,2.6,d/2+.6,w,.12,1.4));
      for(const sx of[-1,1])g.add(box(trim,sx*(w/2-.2),1.3,d/2+1.2,.12,2.6,.12));break}
    case'round':g.add(mesh(HALFCYL(),roofM,0,h,0,w,w*.5,d));break;
    case'needle':{g.add(box(mat(shadeHex(b.cols[0],.9),{metalness:.5,roughness:.3}),0,h+1.5,0,w*.5,3,d*.5));g.add(mesh(CONE(),mat('#c8c8d8',{metalness:.8,roughness:.25}),0,h+5,0,.6,4,.6));g.add(sph(glow('#ff3a5a',4),0,h+7.1,0,.12,false));break}
    case'terrace':{const gr=mat('#4a8a4a',{roughness:.95});g.add(box(gr,0,h+.25,0,w-.2,.5,d-.2));for(let i=0;i<3;i++){const tx=(r()-.5)*(w-2),tz=(r()-.5)*(d-2);g.add(cyl(mat('#5a4030'),tx,h+.9,tz,.08,1));g.add(mesh(ICO(),mat(pick(r,['#3a8a4a','#5aa84a','#2a7a3a']),{roughness:.9,flatShading:true}),tx,h+1.8,tz,1.4,1.4,1.4))}
      for(let k=1;k<4;k++){const y=h*k/4;g.add(box(gr,0,y,d/2+.3,w,.3,.6));for(let i=0;i<Math.floor(w/1.4);i++)g.add(mesh(ICO(),mat('#4a9a4a',{roughness:.9,flatShading:true}),-w/2+.7+i*1.4,y+.35,d/2+.35,.6,.5,.6))}break}
    default:if(r()<.4)g.add(box(mat('#3a3a3e'),(r()-.5)*w*.5,h+.4,(r()-.5)*d*.4,1.2,.8,1));
  }
  if(PK&&front&&WD.year>=1890){
    if(w>=5&&b.roof!=='terrace'&&r()<.55){const e=prPart('entrance',{stone:b.style==='glass'?'#3a4048':shadeHex(b.cols[0],.55),wood:pick(r,['#6a4a2a','#3a2a20','#2a3a4a']),glass:'#a8c8e0',belt:'#c9a24a',iron:'#26221e',awn:pick(r,['#8a2a2a','#2a5a3a','#3a3a6a','#7a5a2a'])});e.position.set((r()-.5)*(w-5),0,d/2);e.scale.setScalar(1.35);g.add(e)}
    if(b.style!=='glass'&&h>11&&w>=6&&r()<.4){const nb=h>20?2:1;for(let k=0;k<nb;k++){const bl=prPart('balcony',{stone:shadeHex(b.cols[0],.6),iron:'#26221e'});bl.position.set((r()-.5)*(w-4),5.5+k*5,d/2);g.add(bl)}}
    if((!b.roof||b.roof==='flat'||b.roof==='cornice')&&w>=7&&r()<.15){const wt=prPart('watertank',{wood:'#6a4a2a',iron:'#26221e'});wt.position.set((r()-.5)*(w-4),h,(r()-.5)*(d-4));wt.scale.setScalar(.6);g.add(wt)}}
  if(b.band&&front){const bc=pick(r,b.band),bm=glow(bc,3.2);for(let y=3;y<h-1;y+=r()<.5?4:6)g.add(box(bm,0,y,d/2+.03,w+.06,.14,.06,false));g.add(box(bm,w/2+.03,h/2,d/2,.08,h,.08,false))}
  if(front&&lk.night&&r()<.35&&b.style!=='glass'){const awn=mat(pick(r,['#8a2a2a','#2a5a3a','#3a3a6a','#7a5a2a']));g.add(box(awn,0,2.7,d/2+.55,w*.7,.1,1.1))}
  return g;
}
function farRow(g,lk,r,x0,x1){
  const f=lk.far;if(!f||f.kind==='none')return;
  if(f.kind==='city'){for(let x=x0;x<x1;){const w=6+r()*10,h=f.h[0]+r()*(f.h[1]-f.h[0]),z=-34-r()*30;const m=mat(pick(r,f.cols),{roughness:1});const bx=box(m,x+w/2,h/2,z,w,h,6+r()*6,false);g.add(bx);const cx=x+w/2;
      if(f.roof==='needle'&&r()<.5)g.add(mesh(CONE(),m,cx,h+3,z,1,6,1,false));if(f.roof==='round')g.add(mesh(HALFCYL(),m,cx,h,z,w,w*.5,6,false));if(f.roof==='gable')g.add(mesh(PRISM(),m,cx,h,z,w,w*.4,6,false));if(f.roof==='terrace')g.add(box(mat('#4a8a5a'),cx,h+.4,z,w,.8,6,false));
      if(lk.night){const wm=glow(pick(r,Array.isArray(lk.bld?.litC)?lk.bld.litC:[lk.bld?.litC||'#ffd890']),.9);for(let k=0;k<8;k++)if(r()<.5)g.add(box(wm,cx+(r()-.5)*w*.8,2+r()*(h-3),z+3.2,.5,.7,.05,false))}
      x+=w+r()*4}}
  if(f.kind==='mesa'){for(let x=x0+r()*20;x<x1;x+=28+r()*14){const w=14+r()*22,h=f.h[0]+r()*(f.h[1]-f.h[0]),z=-70-r()*40;const m=mat(pick(r,f.cols),{roughness:1,flatShading:true});
      const o=new THREE.Mesh(new THREE.CylinderGeometry(w*.42,w*.55,h,7),m);o.position.set(x,h/2,z);g.add(o)}}
  if(f.kind==='dunes'||f.kind==='hills'){for(let x=x0+r()*10;x<x1;x+=18+r()*8){const R=14+r()*20,z=-50-r()*50;g.add(mesh(SPH(),mat(pick(r,f.cols),{roughness:1}),x,-R*.55,z,R*2.2,R*(f.kind==='dunes'?.9:1.4),R*1.4,false))}}
}
function lamp(g,lk,x,z,withLight){
  const pm=mat('#26221e',{metalness:.6,roughness:.4});if(PK){const o=prPart('lamp',{iron:'#26221e'});o.position.set(x,0,z);g.add(o)}else{g.add(cyl(pm,x,1.9,z,.07,3.8));g.add(box(pm,x,3.85,z+.25,.08,.08,.6))}
  g.add(sph(glow(lk.lamps,4),x,3.7,z+.5,.16,false));
  const h=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:lk.lamps,transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false}));h.position.set(x,3.7,z+.5);h.scale.setScalar(1.8);g.add(h);
  if(withLight){const p=new THREE.PointLight(lk.lamps,22,15,1.6);p.position.set(x,3.5,z+.6);g.add(p)}
}
function tree(g,x,z,r,k=1){if(PK){const o=prPart('tree',{bark:'#5a4030',leaf:pick(r,['#3a7a3a','#4a8a3a','#2f6a34','#4a9a40'])});o.position.set(x,0,z);o.scale.setScalar(k*.95);o.rotation.y=r()*6.28;g.add(o);return}g.add(cyl(mat('#5a4030'),x,1.1*k,z,.14*k,2.2*k));const fm=mat(pick(r,['#3a7a3a','#4a8a3a','#2f6a34']),{roughness:.9,flatShading:true});g.add(mesh(ICO(),fm,x,2.8*k,z,2.4*k,2.2*k,2.4*k));g.add(mesh(ICO(),fm,x+.5*k,3.4*k,z+.2,1.5*k,1.4*k,1.5*k))}
function car(g,x,z,c,r){if(PK){const o=prPart('car',{paint:c,glass:'#a8c8e0',tire:'#111111',rim:'#b8b8c0',red:'#aa1a1a',lamp:'#fff2c0',trim:'#14100c',belt:'#c9a24a'});o.position.set(x,0,z);o.rotation.y=r()<.5?0:Math.PI;g.add(o);return}const cg=new THREE.Group();cg.position.set(x,0,z);cg.rotation.y=r()<.5?0:Math.PI;const bm=mat(c,{metalness:.5,roughness:.3});
  cg.add(box(bm,0,.55,0,3.6,.6,1.6));cg.add(box(bm,-.2,1.05,0,1.9,.5,1.45));cg.add(box(mat('#a8c8e0',{metalness:.8,roughness:.1}),-.2,1.05,0,1.95,.38,1.47,false));
  for(const sx of[-1.15,1.15])for(const sz of[-.75,.75]){const w=cyl(mat('#111'),sx,.32,sz,.32,.25);w.rotation.x=Math.PI/2;cg.add(w)}
  cg.add(sph(glow('#fff2c0',2),1.8,.6,.55,.1,false));cg.add(sph(glow('#fff2c0',2),1.8,.6,-.55,.1,false));g.add(cg)}

/* ================= extras ================= */
const CW=32,CR=3;
const STATIC_EX=new Set(['sea','ring','traffic','aurora']);
const nearFix=(x,pad=8)=>Math.abs(x-WD.land.x)<pad||Math.abs(x-WD.mx)<pad*.7;
const EXTRA={
  rails(g,lk,r,x0,x1){const rm=mat('#5a5a5a',{metalness:.8,roughness:.4}),sm=mat('#4a3424');for(const z of[-4.1,-3.0])g.add(box(rm,(x0+x1)/2,.08,z,CW+.2,.1,.1));for(let x=x0;x<x1;x+=1.1)g.add(box(sm,x,.03,-3.55,.35,.07,1.7,false))},
  poles(g,lk,r,x0,x1){const pm=mat('#4a3424');const pts=[];for(let x=Math.ceil(x0/16)*16;x<x1;x+=16){g.add(cyl(pm,x,3.5,-5.6,.1,7));g.add(box(pm,x,6.6,-5.6,1.6,.1,.1));
      for(const dx of[-.7,.7])for(let k=0;k<=8;k++){const t=k/8;pts.push(new THREE.Vector3(x+dx+t*16,6.6-Math.sin(t*Math.PI)*.5,-5.6));if(k&&k<8)pts.push(pts[pts.length-1].clone())}}
    if(pts.length)g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#2a2018'})))},
  sea(g){const m=new THREE.Mesh(new THREE.PlaneGeometry(600,200),new THREE.MeshStandardMaterial({color:'#6a8aa0',roughness:.15,metalness:.3}));m.rotation.x=-Math.PI/2;m.position.set(0,.02,-140);g.add(m)},
  bell(g,lk,r,x0,x1){if(r()<.4){const x=x0+8+r()*16;if(nearFix(x,10))return;const tm=mat('#5a3a2a');g.add(box(tm,x,8,-15,3,16,3));g.add(mesh(PRISM(),mat('#4a2414'),x,16,-15,3.4,2.4,3.4));g.add(box(glow('#ffb050',1.6),x,13,-13.45,1,1.6,.05,false))}},
  tram(g,lk,r,x0,x1){g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x0,5.3,-5.3),new THREE.Vector3(x1,5.3,-5.3)]),new THREE.LineBasicMaterial({color:'#111'})));
    if(r()<.35){const x=x0+8+r()*16;if(nearFix(x,8))return;const tg=new THREE.Group();tg.position.set(x,0,-5.3);const m=mat('#5a5a5a',{metalness:.3,roughness:.5});tg.add(box(m,0,1.6,0,8,2.6,2.2));tg.add(box(mat('#2a2a2a'),0,3,0,8.2,.2,2.3));
      for(let i=0;i<6;i++)tg.add(box(glow('#ffe0a0',1.4),-3.2+i*1.3,1.9,1.12,.9,.9,.02,false));tg.add(cyl(mat('#222'),0,4.2,0,.03,2.2));g.add(tg)}},
  cars(g,lk,r,x0,x1){for(let x=x0+2+r()*6;x<x1;x+=9+r()*12){if(nearFix(x,9))continue;car(g,x,-4.4,pick(r,['#c83a3a','#3a8ac8','#e8d8a0','#8ac8b8','#f0a0c0','#2a2a2a','#e8e8e8']),r)}},
  trees(g,lk,r,x0,x1){for(let x=x0+1+r()*4;x<x1;x+=7+r()*8){if(nearFix(x,8))continue;tree(g,x,-5.6+r()*.4,r,.9+r()*.3)}},
  drones(g,lk,r,x0,x1){for(let i=0;i<3;i++){const d=new THREE.Group();d.position.set(x0+r()*CW,7+r()*8,-8-r()*10);d.add(box(mat('#e8f0e8',{metalness:.4}),0,0,0,.5,.15,.5));d.add(sph(glow('#5affb8',4),0,-.1,0,.08,false));g.add(d);const p=d.position.clone(),ph=r()*6;WD.anim.push(t=>{d.position.x=p.x+Math.sin(t*.4+ph)*3;d.position.y=p.y+Math.sin(t*1.3+ph)*.4})}},
  ring(g,lk){const rg=new THREE.Group();rg.position.set(20,90,-260);rg.rotation.set(1.2,.2,.25);const t=new THREE.Mesh(new THREE.TorusGeometry(160,3.2,12,160),new THREE.MeshStandardMaterial({color:'#8a8aa0',metalness:.8,roughness:.3,emissive:'#ff9ad8',emissiveIntensity:.25,fog:false}));rg.add(t);
    const lm=new THREE.Mesh(new THREE.TorusGeometry(160,.6,6,160),new THREE.MeshBasicMaterial({color:lk.bld?.band?.[0]||'#ffb050',fog:false,toneMapped:false}));lm.position.z=2.6;rg.add(lm);g.add(rg);WD.anim.push(t2=>{rg.rotation.z=.25+t2*.01})},
  traffic(g,lk,r){for(let i=0;i<14;i++){const lane=i%3,s=new THREE.Mesh(BOX(),glow(i%2?'#ff9ad8':'#9ae8ff',4));s.scale.set(1.4,.25,.4);const y=14+lane*5,z=-16-lane*6,sp=(8+r()*10)*(lane%2?1:-1),x0=(r()-.5)*160;g.add(s);WD.anim.push(t=>{s.position.set(((x0+t*sp)%160+240)%160-80,y,z)})}},
  aurora(g){const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,uniforms:{t:{value:0}},
      vertexShader:`varying vec2 vUv;uniform float t;void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*.02+t*.3)*12.;p.y+=sin(p.x*.05+t*.5)*3.;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`varying vec2 vUv;uniform float t;void main(){float a=smoothstep(0.,.3,vUv.y)*smoothstep(1.,.4,vUv.y);float s=.5+.5*sin(vUv.x*40.+t*.8)*sin(vUv.x*13.-t*.4);vec3 c=mix(vec3(.2,1.,.6),vec3(.6,.3,1.),vUv.y);gl_FragColor=vec4(c*a*s*.55,1.);}`});
    for(let i=0;i<2;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(420,50,80,1),m);p.position.set(0,70+i*22,-200-i*40);g.add(p)}WD.anim.push(t=>m.uniforms.t.value=t)},
  dishes(g,lk,r,x0,x1){for(let i=0;i<2;i++){const x=x0+4+i*14+r()*6;if(nearFix(x,10))continue;const d=new THREE.Group();d.position.set(x,0,-16-r()*6);d.add(cyl(mat('#5a5a7a',{metalness:.6}),0,1.5,0,.2,3));const dm=mesh(DOME(),mat('#c8c8e0',{metalness:.5,roughness:.35,side:THREE.DoubleSide}),0,3.4,0,3.2,1,3.2);dm.rotation.x=Math.PI*.8;d.add(dm);g.add(d)}},
  floaters(g,lk,r,x0,x1){for(let i=0;i<6;i++){const o=mesh(OCTA(),mat('#f4e4b8',{metalness:.7,roughness:.25,emissive:lk.wx[1],emissiveIntensity:.35}),x0+r()*CW,10+r()*22,-14-r()*30,1+r()*2.5,1.6+r()*3,1+r()*2.5,false);g.add(o);const y0=o.position.y,ph=r()*6;WD.anim.push(t=>{o.rotation.y=t*.3+ph;o.position.y=y0+Math.sin(t*.5+ph)})}},
  clockrings(g,lk,r,x0,x1){const c=lk===ERA[TH].look?'#ff5a4a':'#c9a24a';for(let i=0;i<3;i++){const R=4+r()*7,rg=new THREE.Group();rg.position.set(x0+i*11+r()*8,10+r()*16,-18-r()*22);rg.add(new THREE.Mesh(TOR(1,.025),glow(c,2.4)));rg.scale.setScalar(R);
      for(let k=0;k<12;k++){const a=k/12*Math.PI*2,tk=new THREE.Mesh(BOX(),glow(c,2));tk.scale.set(.02,.12,.02);tk.position.set(Math.cos(a)*.88,Math.sin(a)*.88,0);tk.rotation.z=a+Math.PI/2;rg.add(tk)}
      const h1=new THREE.Mesh(BOX(),glow(c,2.4));h1.scale.set(.02,.6,.02);const hand=new THREE.Group();h1.position.y=.3;hand.add(h1);rg.add(hand);const h2=h1.clone();h2.scale.set(.02,.4,.02);h2.position.y=.2;const hand2=new THREE.Group();hand2.add(h2);rg.add(hand2);
      rg.rotation.set((r()-.5)*.6,(r()-.5)*.8,0);g.add(rg);const sp=(r()<.5?-1:1)*(.3+r());WD.anim.push(t=>{hand.rotation.z=-t*sp;hand2.rotation.z=-t*sp/12})}},
  pillars(g,lk,r,x0,x1){const c=lk===ERA[TH].look?'#22080e':'#1c2848',gc=lk===ERA[TH].look?'#ff3a4a':'#c9a24a';for(let x=Math.ceil(x0/9)*9;x<x1;x+=9){if(Math.abs(x-WD.land.x)<8)continue;const h=8+r()*6;g.add(box(mat(c,{roughness:.4,metalness:.3}),x,h/2,-9,1.6,h,1.6));g.add(box(glow(gc,2),x,h+.15,-9,2,.3,2));g.add(box(glow(gc,2),x,.15,-9,2,.3,2))}},
  shards(g,lk,r,x0,x1){for(let i=0;i<9;i++){const o=new THREE.Mesh(geo('tet',()=>new THREE.TetrahedronGeometry(.5)),glow('#ff3a4a',1.8+r()*2));o.scale.setScalar(.5+r()*1.8);o.position.set(x0+r()*CW,3+r()*20,-10-r()*30);g.add(o);const ph=r()*6,y0=o.position.y;WD.anim.push(t=>{o.rotation.set(t*.5+ph,t*.3,0);o.position.y=y0+Math.sin(t+ph)*.6})}},

  ferns(g,lk,r,x0,x1){for(let x=x0+1+r()*3;x<x1;x+=4+r()*6){if(nearFix(x,7))continue;const z=-5.4+r()*.6,k=.8+r()*.7;
      if(r()<.45){g.add(cyl(mat('#6a5030'),x,1.6*k,z,.16*k,3.2*k));for(let a=0;a<6;a++){const l=box(mat('#3f8a3a',{flatShading:true}),x+Math.cos(a)*.9*k,3.3*k,z+Math.sin(a)*.9*k,1.8*k,.06,.35,true);l.rotation.y=-a;l.rotation.z=.4;g.add(l)}}
      else for(let a=0;a<7;a++){const l=box(mat(pick(r,['#3f8a3a','#4a9a3a','#2f7a34'])),x+Math.cos(a)*.5*k,.7*k,z+Math.sin(a)*.5*k,1.3*k,.05,.3,true);l.rotation.y=-a;l.rotation.z=.8;g.add(l)}}},
  dinos(g,lk,r,x0,x1){const n=r()<.6?1:2;for(let i=0;i<n;i++){const big=r()<.55,d=makeDino(big?'#6a8a5a':'#8a7a4a',big),x=x0+6+r()*(CW-12),z=-20-r()*20,dir=r()<.5?-1:1;d.position.set(x,0,z);d.scale.setScalar(big?1.5+r()*.8:1);d.rotation.y=dir>0?0:Math.PI;g.add(d);
      const ph=r()*6,sp=.5+r()*.4;WD.anim.push(t=>{d.position.x=x+Math.sin(t*.05*sp+ph)*10*dir;d.userData.legs.forEach((l,k)=>l.rotation.z=Math.sin(t*sp*2.4+k*Math.PI)*.35);d.userData.neck&&(d.userData.neck.rotation.z=Math.sin(t*.6+ph)*.08)})}},
  volcano(g,lk,r,x0,x1){if(Math.abs(Math.floor(x0/CW))%3!==0)return;const x=x0+CW/2,vm=mat('#3a2a24',{roughness:1,flatShading:true});g.add(mesh(CONE(),vm,x,14,-95,70,28,50));g.add(mesh(CONE(),glow('#ff6a1a',2.6),x,27,-95,10,3,10));
    const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:'#ff7a2a',transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));gl.position.set(x,32,-92);gl.scale.set(60,34,1);g.add(gl);WD.anim.push(t=>gl.material.opacity=.45+Math.sin(t*1.7+x)*.12)},
  pines(g,lk,r,x0,x1){if(AK){for(let x=x0+1+r()*4;x<x1;x+=6+r()*8){if(nearFix(x,8))continue;const k=.9+r()*.6,z=-5.6+r()*.5,o=akPart('pine',{trunk:'#4a3424',needle:pick(r,['#2f5a3a','#2a5034','#365e3e']),snow:'#f4f8ff'});o.position.set(x,0,z);o.scale.setScalar(k*1.1);o.rotation.y=r()*6.28;g.add(o)}return}for(let x=x0+1+r()*4;x<x1;x+=6+r()*8){if(nearFix(x,8))continue;const k=.9+r()*.6,z=-5.6+r()*.5;g.add(cyl(mat('#4a3424'),x,.8*k,z,.12*k,1.6*k));const gm=mat('#2f5a3a',{flatShading:true}),sm=mat('#f4f8ff',{flatShading:true});
      for(let j=0;j<3;j++){g.add(mesh(CONE(),gm,x,(2+j*1.1)*k,z,(2.6-j*.7)*k,1.7*k,(2.6-j*.7)*k));g.add(mesh(CONE(),sm,x,(2.35+j*1.1)*k,z,(1.9-j*.55)*k,.9*k,(1.9-j*.55)*k))}}},
  mammoths(g,lk,r,x0,x1){if(r()<.55)return;const m=makeMammoth(),x=x0+6+r()*(CW-12),z=-22-r()*16;m.position.set(x,0,z);m.scale.setScalar(1.6);m.rotation.y=r()<.5?0:Math.PI;g.add(m);const ph=r()*6;WD.anim.push(t=>{m.position.x=x+Math.sin(t*.04+ph)*6;m.userData.legs.forEach((l,k)=>l.rotation.z=Math.sin(t*1.2+k*Math.PI)*.18)})},
  pyramids(g,lk,r,x0,x1){const pm=mat('#e0c080',{roughness:1,flatShading:true}),sm=mat('#c8a668',{roughness:1,flatShading:true});
    for(let x=Math.ceil(x0/90)*90;x<x1;x+=90){const k=1+((x/90|0)%3+3)%3*.3;g.add(mesh(PYR(),pm,x,22*k,-110,60*k,44*k,60*k));g.add(mesh(PYR(),sm,x+52,13*k,-125,36*k,26*k,36*k))}},
  palms(g,lk,r,x0,x1){if(AK){for(let x=x0+2+r()*4;x<x1;x+=9+r()*10){if(nearFix(x,8))continue;const k=.9+r()*.4,z=-5.6+r()*.4,o=akPart('palm',{trunk:'#7a5a3a',wood2:'#4a3220',frond:pick(r,['#4a8a3a','#5a9a40','#3a7a34'])});o.position.set(x,0,z);o.scale.setScalar(k);o.rotation.y=r()*6.28;g.add(o)}return}for(let x=x0+2+r()*4;x<x1;x+=9+r()*10){if(nearFix(x,8))continue;const k=.9+r()*.4,z=-5.6+r()*.4,tm=mat('#7a5a3a');g.add(cyl(tm,x,2.2*k,z,.14*k,4.4*k));for(let a=0;a<7;a++){const l=box(mat('#4a8a3a'),x+Math.cos(a*.9)*1.1*k,4.5*k,z+Math.sin(a*.9)*1.1*k,2.4*k,.06,.4,true);l.rotation.y=-a*.9;l.rotation.z=.35;g.add(l)}}},
  mudhuts(g,lk,r,x0,x1){if(AK){for(let x=x0+3+r()*5;x<x1;x+=14+r()*10){if(nearFix(x,10))continue;const w=3.4+r()*1.6,h=2+r()*.6,z=-9.5-r()*2,o=akPart('mudhut',{mud:pick(r,['#c8a46c','#d0aa72','#bf9a62']),mud2:'#b89458',wood:'#6a4a2a',wood2:'#4a3220',dark:'#1a120a',red:pick(r,['#c83a2a','#3a5a8a','#c89a2a']),cream:'#f0e8d8'});o.position.set(x,0,z);o.scale.set(w/4,h/2.3,1);g.add(o)}return}const mm=mat('#c8a46c',{roughness:1,flatShading:true}),dm=mat('#1a120a'),bm=mat('#6a4a2a');for(let x=x0+3+r()*5;x<x1;x+=14+r()*10){if(nearFix(x,10))continue;const w=3.4+r()*1.6,d=3,h=2+r()*.6,z=-9.5-r()*2;
      g.add(box(mm,x,h/2,z,w,h,d));g.add(box(mat('#b89458',{roughness:1}),x,h+.12,z,w+.3,.25,d+.3));g.add(box(dm,x,.8,z+d/2+.01,.8,1.6,.05,false));
      for(let i=0;i<4;i++){const bq=cyl(bm,x-w/2+.5+i*(w-1)/3,h-.1,z+d/2+.2,.07,.9);bq.rotation.x=Math.PI/2;g.add(bq)}}},
  blocks(g,lk,r,x0,x1){const sm=mat('#d8bc84',{roughness:1,flatShading:true});for(let x=x0+2+r()*6;x<x1;x+=16+r()*12){if(nearFix(x,8))continue;const z=-6+r()*.8,n=2+(r()*3|0);for(let i=0;i<n;i++)for(let j=0;j<n-i;j++)g.add(box(sm,x+j*1.05+i*.5,.35+i*.7,z,1,.7,1.1))}},
  longhouses(g,lk,r,x0,x1){if(AK){for(let x=x0+4+r()*5;x<x1;x+=16+r()*10){if(nearFix(x,11))continue;const w=7+r()*3,z=-10-r()*2,o=akPart('longhouse',{wood:'#5a3e26',wood2:'#4a321e',thatch:'#5a7a3a',dark:'#120a05',iron:'#3a3a42',red:'#c83a2a',yellow:'#e8c84a',blue:'#3a5a8a',fire:'#ff9a2a'});o.position.set(x,0,z);o.scale.set(w/8,1,1);g.add(o)}return}const wm=mat('#5a3e26',{roughness:1}),tm=mat('#4a6a34',{roughness:1,flatShading:true}),dm=mat('#120a05');for(let x=x0+4+r()*5;x<x1;x+=16+r()*10){if(nearFix(x,11))continue;const w=7+r()*3,z=-10-r()*2;
      g.add(box(wm,x,1.1,z,w,2.2,4.2));g.add(mesh(PRISM(),tm,x,2.2,z,w+.6,2,5.2));g.add(box(dm,x,.9,z+2.11,.9,1.8,.05,false));
      for(let i=0;i<3;i++){const sh=cyl(mat(['#c83a2a','#e8c84a','#3a5a8a'][i]),x-1.4+i*1.4,1.5,z+2.14,.4,.08);sh.rotation.x=Math.PI/2;g.add(sh)}
      const tl=mesh(CONE(),glow('#ff9a2a',3),x+1.4,2.1,z+2.3,.18,.4,.18);g.add(tl)}},
  columns(g,lk,r,x0,x1){if(AK){const mp={marble:'#f0e8d8',marble2:'#d8cfb8'};for(let x=Math.ceil(x0/18)*18;x<x1;x+=18){if(nearFix(x,9))continue;const h=5+r()*3,n=r()<.5?2:3;for(let i=0;i<n;i++){const c=akPart('column',mp);c.position.set(x+i*2.2,0,-9);c.scale.y=h/6;g.add(c)}if(r()<.5){const e=akPart('entab',mp);e.position.set(x+1.1,h+.02,-9);g.add(e)}}return}const cm=mat('#f0e8d8',{roughness:.7});for(let x=Math.ceil(x0/18)*18;x<x1;x+=18){if(nearFix(x,9))continue;const h=5+r()*3;for(let i=0;i<(r()<.5?2:3);i++){g.add(cyl(cm,x+i*2.2,h/2,-9,.45,h));g.add(box(cm,x+i*2.2,h+.15,-9,1.2,.3,1.2));g.add(box(cm,x+i*2.2,.15,-9,1.2,.3,1.2))}if(r()<.5)g.add(box(cm,x+1.1,h+.6,-9,4.8,.6,1.4))}}
};


const PYR=()=>geo('pyr',()=>{const g=new THREE.ConeGeometry(.5*Math.SQRT2,1,4);g.rotateY(Math.PI/4);return g});
function makeDino(col,big){if(CK){const g=new THREE.Group();g.userData.legs=[];const mp={skin:col,dark:'#46583a',belly:mixCol(col,'#e8e0b0',.55),horn:'#efe6cc',eye:big?'#111111':'#d8c860'};
  const nk=new THREE.Group();g.userData.neck=nk;
  if(big){g.add(crPart('sauro_body',mp));nk.position.set(2.3,4.1,0);nk.add(crPart('sauro_neck',mp));g.add(nk);for(const[x,z]of[[1.7,.85],[1.7,-.85],[-1.7,.85],[-1.7,-.85]]){const lg=new THREE.Group();lg.position.set(x,2.2,z);lg.add(crPart('sauro_leg',mp));g.add(lg);g.userData.legs.push(lg)}}
  else{g.add(crPart('dino_body',mp));nk.position.set(1.2,2.4,0);nk.add(crPart('dino_neck',mp));g.add(nk);for(const z of[.4,-.4]){const lg=new THREE.Group();lg.position.set(0,1.4,z);lg.add(crPart('dino_leg',mp));g.add(lg);g.userData.legs.push(lg)}}
  return g}
  const g=new THREE.Group(),m=mat(col,{roughness:.9,flatShading:true}),dk=mat('#46583a',{roughness:1,flatShading:true});g.userData.legs=[];
  if(big){g.add(box(m,0,3.3,0,5,2.2,2.2));const tail=mesh(CONE(),m,-4.4,3.1,0,1.6,4.6,1.6);tail.rotation.z=Math.PI/2;g.add(tail);
    const nk=new THREE.Group();nk.position.set(2.3,4.1,0);const nb=box(m,1.2,1.5,0,.8,3.6,.8);nb.rotation.z=-.5;nk.add(nb);nk.add(box(m,3.1,3.1,0,1.1,.7,.8));nk.add(box(mat('#111'),3.4,3.3,.42,.12,.12,.02,false));g.add(nk);g.userData.neck=nk;
    for(const[x,z]of[[1.7,.85],[1.7,-.85],[-1.7,.85],[-1.7,-.85]]){const lg=new THREE.Group();lg.position.set(x,2.2,z);lg.add(box(dk,0,-1,0,.8,2.2,.8));g.add(lg);g.userData.legs.push(lg)}}
  else{const b=box(m,0,1.9,0,2.6,1.2,1);b.rotation.z=.12;g.add(b);const tail=mesh(CONE(),m,-2.6,1.9,0,.8,3,.8);tail.rotation.z=Math.PI/2;g.add(tail);
    const nk=new THREE.Group();nk.position.set(1.2,2.4,0);nk.add(box(m,.3,.6,0,.5,1.2,.5));nk.add(box(m,.8,1.3,0,1.2,.6,.6));nk.add(box(mat('#d8c860'),1,1.4,.31,.12,.12,.02,false));g.add(nk);g.userData.neck=nk;
    for(const z of[.4,-.4]){const lg=new THREE.Group();lg.position.set(0,1.4,z);lg.add(box(dk,0,-.7,0,.4,1.5,.4));g.add(lg);g.userData.legs.push(lg)}}
  return g}
function makeMammoth(){if(CK){const g=new THREE.Group();g.userData.legs=[];const mp={skin:'#5a3e2a',dark:'#3a281c',horn:'#efe6cc',eye:'#111111'};g.add(crPart('mam_body',mp));
  for(const[x,z]of[[1.2,.8],[1.2,-.8],[-1.2,.8],[-1.2,-.8]]){const lg=new THREE.Group();lg.position.set(x,1.3,z);lg.add(crPart('mam_leg',mp));g.add(lg);g.userData.legs.push(lg)}return g}
  const g=new THREE.Group(),f=mat('#5a3e2a',{roughness:1,flatShading:true}),dk=mat('#3a281c',{roughness:1});g.userData.legs=[];
  g.add(mesh(ICO(),f,0,2.4,0,4,3,2.6));g.add(mesh(ICO(),f,2.1,2.8,0,2.2,2.4,2));g.add(mesh(ICO(),f,.2,3.9,0,1.8,1.2,1.8));
  const tr=cyl(f,3.2,1.7,0,.28,2.6);tr.rotation.z=.25;g.add(tr);for(const z of[.55,-.55]){const t=mesh(CONE(),mat('#efe6cc'),3,1.9,z,.2,2.4,.2);t.rotation.z=-1.1;g.add(t)}
  for(const[x,z]of[[1.2,.8],[1.2,-.8],[-1.2,.8],[-1.2,-.8]]){const lg=new THREE.Group();lg.position.set(x,1.3,z);lg.add(box(dk,0,-.6,0,.7,1.4,.7));g.add(lg);g.userData.legs.push(lg)}
  return g}

/* ================= landmarks (front face at z=0, built backward) ================= */
const LANDM={
  burrow(g,lk){const dm=mat('#5a4430',{roughness:1,flatShading:true});g.add(mesh(SPH(),dm,0,.2,-3.4,10,5.6,7.4));g.add(mesh(SPH(),mat('#050302'),0,1.4,-.2,3.4,2.6,1.2));
    for(const[x,s2]of[[-3.6,1.6],[3.4,1.3],[-2.2,.9],[4.4,.8]])g.add(mesh(ICO(),mat('#7a7468',{roughness:1,flatShading:true}),x,.5,-.4,s2,s2*.8,s2));
    const sh=new THREE.Group();sh.position.set(-.6,.2,.9);sh.add(mesh(SPH(),mat('#8a7a68'),0,.18,0,.5,.32,.3));sh.add(sph(mat('#8a7a68'),.28,.22,0,.12,false));sh.add(sph(glow('#ffffff',1),.36,.26,.05,.025,false));g.add(sh);
    for(let i=0;i<5;i++)g.add(mesh(CONE(),mat('#3f8a3a'),-4.8+i*.3,.5,-.2,.18,1+i%2*.4,.18));},
  cave(g,lk){const rm=mat('#6a625a',{roughness:1,flatShading:true});g.add(mesh(ICO(),rm,0,3.6,-4,12,9,8));g.add(mesh(ICO(),rm,-5,2.4,-2.6,5,5,5));g.add(mesh(ICO(),rm,5.2,2,-2.4,4.4,4.2,4.4));g.add(mesh(SPH(),mat('#040302'),0,1.7,-.2,4.2,3.4,1.6));
    const wall=mat('#d8b078',{roughness:1});g.add(box(wall,0,1.8,-.8,3.4,2.8,.1));
    const pm=glow('#c8421a',1.6);for(const[x,y]of[[-1.1,2.4],[-.4,2.8],[.4,2.6],[1.1,2.2],[-.2,1.6]]){g.add(box(pm,x,y,-.72,.2,.5,.03,false));g.add(box(pm,x-.18,y+.18,-.72,.1,.2,.03,false))}
    g.add(mesh(CONE(),glow('#ff7a1a',3.2),-3.4,.7,.9,.9,1.5,.9));const fl=mesh(CONE(),glow('#ffd24a',4),-3.4,.6,.9,.55,1,.55);g.add(fl);WD.anim.push(t=>{fl.scale.set(.55,1+Math.sin(t*14)*.18,.55)});
    for(let a=0;a<6;a++)g.add(mesh(ICO(),mat('#5a5650',{flatShading:true}),-3.4+Math.cos(a)*.8,.2,.9+Math.sin(a)*.8,.35,.3,.35));},
  pyrsite(g,lk){const st=mat('#e0c080',{roughness:1,flatShading:true});g.add(mesh(PYR(),st,0,3.6,-5,15,7.2,13));g.add(box(mat('#d0b070',{flatShading:true}),0,7.15,-5,2.6,.3,2.4));
    const cap=mesh(PYR(),mat('#d8a830',{metalness:.9,roughness:.25,emissive:'#c8921a',emissiveIntensity:.5}),0,9.3,-5,2.4,1.9,2.2);g.add(cap);WD.anim.push(t=>cap.position.y=9.1+Math.sin(t*1.4)*.25);
    const wm=mat('#8a6a42');for(let i=0;i<6;i++)g.add(box(wm,-8.6+i*.15,.6+i*1.1,-.5-i*.4,.2,.3,1,false));const rp=box(wm,-9,3,-3,.2,.25,5,false);rp.rotation.z=.5;g.add(rp);
    for(const[x,z]of[[5,-.6],[6.4,-.4],[7.6,-.8]])g.add(box(mat('#d0b070',{flatShading:true}),x,.45,z,1.3,.9,1.1));},
  colosseum(g,lk){if(AK){const o=akPart('colosseum',{marble:'#e8dcc0',marble2:'#d8c8a4',dark:'#2a2018'});g.add(o);for(const x of[-2,2])g.add(mesh(CONE(),glow('#ff9a2a',3),x,9.7,-.1,.4,.9,.4));return}const cm=mat('#e8dcc0',{roughness:.9}),dm=mat('#2a2018'),am=mat('#d8c8a4');g.add(box(cm,0,4.4,-3,14,8.8,5.4));
    for(let row=0;row<3;row++)for(let i=0;i<7;i++){const x=-5.4+i*1.8,y=1.2+row*2.7;g.add(box(dm,x,y,-.28,1.1,1.7,.1,false));g.add(mesh(HALFCYL(),dm,x,y+.85,-.28,1.1,1.1,.1));g.add(box(am,x+.9,y+.2,-.2,.3,2.6,.3))}
    g.add(box(am,0,8.95,-3,14.4,.4,5.8));for(let i=0;i<14;i++)g.add(box(am,-6.6+i,9.4,-.2,.55,.6,.3));
    for(const x of[-2,2]){g.add(mesh(CONE(),glow('#ff9a2a',3),x,9.7,-.1,.4,.9,.4))}},
  longship(g,lk){if(AK){const o=akPart('longship',{wood:'#6a4428',wood2:'#3a2414',sail:'#f0e8d8',red:'#c83a2a',yellow:'#e8c84a',blue:'#3a5a8a',cream:'#f0e8d8'});o.position.set(0,0,-3);g.add(o);for(let i=0;i<5;i++)g.add(mesh(ICO(),mat('#8a8478',{flatShading:true}),-6+i*3,.2,.2+(i%2)*.6,.9,.5,.9));return}const wm=mat('#6a4428',{roughness:.9}),dk=mat('#3a2414',{roughness:1});
    g.add(box(wm,0,1.2,-3,11,1.2,3.2));g.add(box(dk,0,.55,-3,9.6,.6,2.4));for(const sx of[-1,1]){const pr=box(wm,sx*5.7,2.4,-3,.5,3,.5);pr.rotation.z=-sx*.35;g.add(pr);g.add(sph(mat('#c89a4a'),sx*6.2,3.9,-3,.4))}
    g.add(cyl(dk,0,5,-3,.14,9));const sail=box(mat('#f0e8d8'),0,6.4,-3,4.8,4,.08);g.add(sail);for(let i=0;i<4;i++)g.add(box(mat(i%2?'#c83a2a':'#f0e8d8'),-1.8+i*1.2,6.4,-2.95,.6,4,.02,false));
    for(let i=0;i<7;i++){const sh=cyl(mat(['#c83a2a','#e8c84a','#3a5a8a','#f0e8d8'][i%4]),-4.2+i*1.4,1.5,-1.38,.5,.1);sh.rotation.x=Math.PI/2;g.add(sh)}
    for(const x of[-3,0,3]){const o=box(wm,x,.9,.4,.1,.1,3.4,false);o.rotation.x=.5;g.add(o)}
    for(let i=0;i<5;i++)g.add(mesh(ICO(),mat('#8a8478',{flatShading:true}),-6+i*3,.2,.2+(i%2)*.6,.9,.5,.9));},
  observatory(g,lk){const st=mat('#8a7a68',{roughness:.95});g.add(cyl(st,0,5,-3.5,2.6,10));g.add(cyl(mat('#6a5a4a'),0,10.2,-3.5,2.8,.4));
    g.add(mesh(DOME(),mat('#5a8a7a',{metalness:.6,roughness:.4}),0,10.4,-3.5,5,4.4,5));
    const tel=cyl(mat('#c9a24a',{metalness:.9,roughness:.25}),.8,12.4,-2.3,.28,4.2);tel.rotation.x=-.9;tel.rotation.z=-.3;g.add(tel);
    g.add(box(glow('#ffb050',2),0,1.4,-.88,1.4,2.6,.06,false));for(const a of[-1,1])g.add(box(glow('#ffcf7a',1.6),a*1.2,6,-1.05,.5,1.2,.05,false));
    g.add(box(st,0,.3,-1,6,.6,3))},
  junction(g,lk){const lg=new THREE.Group();lg.position.set(-1,0,1.2);const bm=mat('#1a1a1a',{metalness:.6,roughness:.35}),gold=mat('#c9a24a',{metalness:.9,roughness:.25}),red=mat('#8a1a1a');
    const boiler=cyl(bm,0,1.9,0,.85,5.2);boiler.rotation.z=Math.PI/2;lg.add(boiler);for(const x of[-1.5,0,1.5]){const b=cyl(gold,x,1.9,0,.88,.12);b.rotation.z=Math.PI/2;lg.add(b)}
    lg.add(box(red,-3.5,2.2,0,2,2.6,2));lg.add(box(bm,-3.5,3.6,0,2.4,.2,2.4));lg.add(mesh(CONE(),bm,1.6,3.6,0,.8,1.4,.8));lg.add(cyl(bm,1.6,3,0,.25,1));
    lg.add(mesh(CONE(),red,3,.7,0,1.4,1.2,1.4));lg.add(sph(glow('#ffe0a0',3),2.7,2.3,0,.25,false));
    for(const x of[-2.8,-1,.8,2.2])for(const z of[-.85,.85]){const w=cyl(red,x,.75,z,.7,.12);w.rotation.x=Math.PI/2;lg.add(w)}g.add(lg);
    const wm=mat('#6a4a2a');g.add(box(wm,-5.5,3,-1,.3,6,.3));g.add(box(wm,5.5,3,-1,.3,6,.3));g.add(box(wm,0,5.8,-1,11.4,.4,.3));},
  hangar(g,lk){const wm=mat('#8a7a62',{roughness:.95});g.add(mesh(HALFCYL(),wm,0,0,-4,10,6,8));g.add(box(mat('#1a140e'),0,1.8,-.05,6,3.6,.1,false));
    const fg=new THREE.Group();fg.position.set(2,1.6,2.2);const cl=mat('#e8dcc0',{roughness:.9}),wd=mat('#6a4a2a');
    for(const y of[0,1])fg.add(box(cl,0,y,0,1.3,.05,8));for(const z of[-3.5,-1.8,0,1.8,3.5])fg.add(box(wd,0,.5,z,.05,1,.05));fg.add(box(cl,2.4,.5,0,.5,.05,2));fg.add(box(wd,1.2,.5,0,2.4,.05,.05));
    for(const z of[-1,1]){const p=box(wd,-.7,.5,z,.06,1.6,.12);fg.add(p);WD.anim.push(t=>p.rotation.x=t*14)}g.add(fg)},
  palace(g,lk){const fm=mat('#5a5658',{roughness:.6});g.add(box(fm,0,7,-4,10,14,8));g.add(box(mat('#4a4648'),0,15,-4,6,2,6));
    const marq=box(mat('#2a2a2a'),0,4.2,.6,9,.6,2.4);g.add(marq);const s=sign('PREMIERE',8,1,'#fff0c0',{bg:'#111',i:2.6});s.position.set(0,4.9,1.8);g.add(s);
    const v=sign('MOVIES',4,1,'#ffe8a0',{bg:'#111',i:3});v.rotation.z=Math.PI/2;v.scale.set(.25,1,1);v.position.set(3.6,10,.4);v.scale.set(8,1.6,.2);v.rotation.z=Math.PI/2;g.add(v);
    const bulbs=[];for(let i=0;i<22;i++){const b=sph(glow('#fff0c0',3),-4.4+i*.42,3.85,1.82,.07,false);g.add(b);bulbs.push(b)}WD.anim.push(t=>bulbs.forEach((b,i)=>b.material=((i+Math.floor(t*8))%3===0)?glow('#fff0c0',5):glow('#fff0c0',1)));
    g.add(box(glow('#ffe0a0',1.2),0,1.6,-.02,4,3.2,.05,false))},
  radio(g,lk){g.add(box(mat('#f0d8a0'),0,2.2,-3,8,4.4,6));g.add(box(mat('#ffffff'),0,4.55,-3,8.4,.3,6.4));{const s1=sign('RADIO CLUB',6,1,'#ff5a5a',{bg:'#f8f0e0',color:'#c82a2a',i:1});s1.position.set(0,3.6,.08);g.add(s1)}
    g.add(box(glow('#ffe0a0',1.2),-2,1.6,.01,2,2,.05,false));const mm=mat('#c83a3a',{metalness:.5});
    for(let y=0;y<16;y+=2){const s=1-y/22;for(const a of[0,1,2]){const p=cyl(mm,Math.cos(a*2.1)*s*.8+2,4.6+y+1,Math.sin(a*2.1)*s*.8-3,.05,2);g.add(p)}}
    const bl=sph(glow('#ff2a2a',5),2,21,-3,.25,false);g.add(bl);WD.anim.push(t=>bl.visible=Math.sin(t*4)>0)},
  tvshop(g,lk){g.add(box(mat('#b07048'),0,3,-3.5,9,6,7));g.add(box(mat('#4a3020'),0,6.2,-3.5,9.4,.4,7.4));const s=sign('TELEVISIONS',6.5,1,'#ffd080',{bg:'#2a1a10',i:1.8});s.position.set(0,5,.06);g.add(s);
    g.add(box(mat('#202630',{metalness:.6,roughness:.1}),0,2,.02,7,3,.05));for(let i=0;i<4;i++){const tv=new THREE.Group();tv.position.set(-2.4+i*1.6,1.6,.4);tv.add(box(mat('#6a4a2a'),0,0,0,1.2,1,.8));const sc=box(glow('#a8c8ff',2.4),0,.05,.41,.85,.65,.02,false);tv.add(sc);g.add(tv);WD.anim.push(t=>sc.material.emissiveIntensity=1.8+Math.sin(t*20+i)*.4)}
    const am=mat('#aaa',{metalness:.8});g.add(cyl(am,2.5,7.6,-3,.05,2.4));for(let k=0;k<4;k++)g.add(box(am,2.5,8.2+k*.25,-3,1.6-k*.3,.04,.04))},
  stage(g,lk){g.add(box(mat('#1a1a1e'),0,.7,-2,14,1.4,7));const tm=mat('#8a8a90',{metalness:.9,roughness:.3});for(const x of[-6.5,6.5]){g.add(box(tm,x,4.5,-1,.3,8,.3));g.add(box(tm,x,4.5,-4.5,.3,8,.3))}g.add(box(tm,0,8.5,-1,13.3,.3,.3));g.add(box(tm,0,8.5,-4.5,13.3,.3,.3));
    for(const x of[-5,5]){g.add(box(mat('#111'),x,2.6,-2,1.8,2.4,1.4));g.add(box(mat('#111'),x,4.5,-2,1.6,1.4,1.2))}
    const s=sign('LIVE',5,1.2,'#ff3ac8',{bg:'#000',i:4});s.position.set(0,7.2,-1);g.add(s);
    const cols=['#ff3ac8','#3ae8ff','#ffe83a','#8a3aff'];const beams=[];for(let i=0;i<4;i++){const c=new THREE.Mesh(geo('beam',()=>{const gg=new THREE.ConeGeometry(1.4,9,24,1,true);gg.translate(0,-4.5,0);return gg}),addMat(cols[i],.16));c.position.set(-4.5+i*3,8.3,-1);g.add(c);beams.push(c);g.add(sph(glow(cols[i],5),-4.5+i*3,8.3,-1,.22,false))}
    WD.anim.push(t=>beams.forEach((b,i)=>{b.rotation.z=Math.sin(t*1.2+i)*.5;b.rotation.x=.3+Math.cos(t*.9+i)*.25}))},
  bank(g,lk){const sm=mat('#d8d4cc',{roughness:.7});g.add(box(sm,0,4,-4,12,8,7));g.add(box(sm,0,.3,-.2,12.6,.6,1.6));g.add(mesh(PRISM(),sm,0,8,-0.6,12.6,2.4,1.6));
    for(let i=0;i<6;i++)g.add(cyl(sm,-5+i*2,4,-.3,.35,7.4));const s=sign('BANK',5,.9,'#304060',{bg:'#d8d4cc',color:'#203050',i:.2});s.position.set(0,8.9,.25);g.add(s);
    const cd=sign('23:59:59',4,.9,'#ff3a3a',{bg:'#000',i:3});cd.position.set(0,6,.4);g.add(cd);WD.cdSign=cd;g.add(box(glow('#c8e0ff',1.2),0,2.2,-.55,2.4,3.8,.05,false))},
  dome(g,lk){g.add(cyl(mat('#e8f0e8'),0,.3,-5,6,.6));const d=mesh(DOME(),new THREE.MeshPhysicalMaterial({color:'#c8fff0',roughness:.05,metalness:0,transmission:.6,thickness:.5,transparent:true,opacity:.45}),0,.6,-5,12,10,12,false);g.add(d);
    const fr=new THREE.Mesh(new THREE.SphereGeometry(6.05,16,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:'#e8fff8',wireframe:true,transparent:true,opacity:.35}));fr.position.set(0,.6,-5);fr.scale.y=10/12;g.add(fr);
    const r=rng(5);for(let i=0;i<9;i++)tree(g,(r()-.5)*7,-5+(r()-.5)*6,r,.7+r()*.4);g.add(sph(glow('#5affb8',3),0,5.4,-5,.4,false))},
  pad(g,lk){g.add(cyl(mat('#3a3a4a',{metalness:.6,roughness:.3}),0,.35,-4,5.5,.7));{const t1=new THREE.Mesh(TOR(5.2,.08),glow('#ff9ad8',3));t1.position.set(0,.72,-4);t1.rotation.x=Math.PI/2;g.add(t1)}
    const sh=new THREE.Group();sh.position.set(0,.7,-4);const wm=mat('#f0f0f8',{metalness:.3,roughness:.35});sh.add(cyl(wm,0,5,0,1.2,8));sh.add(mesh(CONE(),wm,0,10.5,0,2.4,3,2.4));
    for(let a=0;a<3;a++){const f=box(mat('#2a2a3a'),Math.cos(a*2.1)*1.4,1.4,Math.sin(a*2.1)*1.4,.1,2.4,1.4);f.rotation.y=-a*2.1;sh.add(f)}sh.add(box(glow('#9ae8ff',2),0,7,1.2,.6,.4,.05,false));g.add(sh);
    const gm=mat('#c83a3a',{metalness:.6});g.add(box(gm,4,7,-4,.8,14,.8));for(let y=2;y<14;y+=3)g.add(box(gm,2.6,y,-4,2.4,.2,.3));const fl=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:'#9ae8ff',blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));fl.position.set(0,1,-4);fl.scale.setScalar(4);g.add(fl);
    WD.anim.push(t=>fl.material.opacity=.5+Math.sin(t*12)*.2)},
  archive(g,lk){const wm=mat('#faf6ee',{roughness:.5});g.add(box(wm,0,8,-5,8,16,8));g.add(mesh(HALFCYL(),wm,0,16,-5,8,4,8));const lines=glow('#ffc060',2.6);for(let y=2;y<16;y+=1.6)g.add(box(lines,0,y,-.97,6,.08,.05,false));
    const cr=mesh(OCTA(),mat('#ffe8a0',{emissive:'#ffb040',emissiveIntensity:2.4,metalness:.3,roughness:.1}),0,22,-5,2.4,4,2.4,false);g.add(cr);WD.anim.push(t=>{cr.rotation.y=t*.6;cr.position.y=22+Math.sin(t)*.5});g.add(box(glow('#ffd890',1.4),0,1.8,-.95,2.6,3.4,.05,false))},
  array(g,lk){g.add(cyl(mat('#3a3a5a',{metalness:.6}),0,3,-6,.8,6));const d=new THREE.Group();d.position.set(0,6.5,-6);d.rotation.x=-1.0;
    d.add(mesh(DOME(),mat('#d8d8f0',{metalness:.5,roughness:.3,side:THREE.DoubleSide}),0,0,0,13,3.5,13));d.children[0].rotation.x=Math.PI;d.add(cyl(mat('#5a5a7a'),0,2.5,0,.12,5));const em=sph(glow('#aa9aff',6),0,5,0,.4,false);d.add(em);g.add(d);
    WD.anim.push(t=>{d.rotation.y=Math.sin(t*.2)*.3;em.scale.setScalar(1+Math.sin(t*6)*.3)});g.add(box(mat('#22204a'),0,1.5,-1,6,3,2));g.add(box(glow('#7ae8ff',2),0,1.5,.02,4,1,.05,false))},
  lab(g,lk){g.add(box(mat('#2a2018',{metalness:.5,roughness:.4}),0,3,-6,12,6,6));const ring=new THREE.Mesh(TOR(4.4,.45),mat('#c9a24a',{metalness:.9,roughness:.2,emissive:'#ff8a2a',emissiveIntensity:.5}));ring.position.set(0,6.5,-1.8);g.add(ring);
    const ring2=new THREE.Mesh(TOR(3.6,.12),glow('#ffc070',3));ring2.position.copy(ring.position);g.add(ring2);const core=sph(glow('#ffd080',4),0,6.5,-1.8,1,false);g.add(core);
    WD.anim.push(t=>{ring2.rotation.y=t*1.6;ring2.rotation.x=t*.7;core.scale.setScalar(1+Math.sin(t*5)*.08)});for(const x of[-4.6,4.6])g.add(box(mat('#3a2a1e',{metalness:.6}),x,3.2,-1.8,.8,6.4,.8))},
  shop(g,lk){const st=new THREE.Mesh(geo('tentc',()=>new THREE.ConeGeometry(4.6,3.4,12,1,true)),mat('#5a2a7a',{side:THREE.DoubleSide,roughness:.8}));st.position.set(0,6.2,-3);g.add(st);
    {const t1=new THREE.Mesh(geo('tentb',()=>new THREE.CylinderGeometry(4.6,4.6,4.5,12,1,true,Math.PI*1.3,Math.PI*1.4)),mat('#3a1a5a',{side:THREE.DoubleSide}));t1.position.set(0,2.25,-3);g.add(t1)}
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.add(box(mat('#c9a24a',{metalness:.8}),Math.cos(a)*4.6,4.5,-3+Math.sin(a)*4.6,.12,.3,.12))}
    g.add(box(mat('#4a2a14'),0,.6,-.4,4.4,1.2,1));g.add(box(mat('#c9a24a',{metalness:.8,roughness:.3}),0,1.25,-.4,4.6,.1,1.1));
    for(const x of[-3,3]){const l=sph(glow('#ffd27a',3.5),x,3.6,.2,.28,false);g.add(l)}const pl=new THREE.PointLight('#ffd27a',30,14,1.6);pl.position.set(0,3.4,1);g.add(pl);
    const s=sign('BAZAAR',4,.9,'#ffd27a',{bg:'#1a0a2a',i:2.6});s.position.set(0,4.9,.9);g.add(s);
    const r=rng(3);for(let i=0;i<5;i++){const o=mesh(i%2?OCTA():ICO(),mat(pick(r,['#b44aff','#5ff5d6','#ffd24a']),{emissive:pick(r,['#b44aff','#5ff5d6','#ffd24a']),emissiveIntensity:1.6}),-1.6+i*.8,1.55,-.4,.3,.3,.3,false);g.add(o);WD.anim.push(t=>o.rotation.y=t+i)}},
  throne(g,lk){const dm=mat('#1a0408',{roughness:.3,metalness:.5});g.add(box(dm,0,.35,-2,12,.7,8));g.add(box(dm,0,1,-3,8,.6,6));g.add(box(dm,0,1.6,-4,5,.6,4));
    const tm=mat('#2a0810',{roughness:.35,metalness:.4});g.add(box(tm,0,5.5,-5,3.2,7.2,1));g.add(mesh(PRISM(),tm,0,9.1,-5,3.2,2.4,1));g.add(box(mat('#8a1a2a'),0,3.4,-4.3,2.6,1,2));
    const gold=mat('#ffd24a',{metalness:.9,roughness:.25,emissive:'#a86a10',emissiveIntensity:.4});for(const x of[-1.65,1.65])g.add(box(gold,x,5.5,-4.45,.18,7.2,.18));
    const gem=mesh(OCTA(),glow('#ff2a4a',5),0,10.6,-5,.8,1.2,.8,false);g.add(gem);WD.anim.push(t=>gem.rotation.y=t);const pl=new THREE.PointLight('#ff3a4a',40,20,1.4);pl.position.set(0,6,-2);g.add(pl)}
};

/* ================= the Crono·Cabina (time machine) ================= */
function nixieTex(txt){return textTex(txt,{w:256,h:96,font:`400 ${txt.length>4?58:78}px "Nixie One",monospace`,color:'#ffc27a',glowC:'#ff6a00',bg:'#1a0c06'})}
function buildMachine(g,x){
  const m=new THREE.Group();m.position.set(x,0,-4.2);
  const brass=mat('#c9a24a',{metalness:.95,roughness:.22}),bak=mat('#1d1712',{roughness:.45,metalness:.15}),dark=mat('#0e0a08',{roughness:.6});
  m.add(cyl(brass,0,.12,0,1.25,.24));m.add(cyl(bak,0,.3,0,1.1,.16));
  m.add(box(bak,0,1.75,0,1.5,2.7,1.5));
  for(const sx of[-1,1])for(const sz of[-1,1])m.add(box(brass,sx*.76,1.75,sz*.76,.1,2.8,.1));
  for(const y of[.42,3.08])m.add(box(brass,0,y,0,1.62,.1,1.62));
  const glass=new THREE.MeshStandardMaterial({color:'#2a1408',emissive:'#ff8a2a',emissiveIntensity:1.4,roughness:.15,metalness:.2,
    emissiveMap:canvasTex(64,128,(o,w,h)=>{o.fillStyle='#000';o.fillRect(0,0,w,h);const gr=o.createRadialGradient(32,70,4,32,70,60);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#552200');o.fillStyle=gr;o.fillRect(4,4,w-8,h-8);o.fillStyle='#000';for(let x=10;x<w;x+=11)o.fillRect(x,4,2,h-8);o.fillRect(4,40,w-8,3);o.fillRect(4,84,w-8,3)},{repeat:false})});
  m.add(box(glass,0,1.85,.76,1.1,2.1,.04,false));for(const sx of[-1,1]){const s=box(glass,sx*.76,1.85,0,.04,2.1,1.1,false);m.add(s)}
  m.add(box(brass,.45,1.7,.8,.08,.3,.08));
  m.add(box(bak,0,3.35,0,1.3,.45,1.3));
  const disp=new THREE.MeshStandardMaterial({color:'#000',emissive:'#ffffff',emissiveIntensity:2.4,emissiveMap:nixieTex('2026')});
  const dsp=box(disp,0,3.35,.66,1.05,.34,.02,false);m.add(dsp);m.userData.disp=disp;
  m.add(cyl(brass,0,3.7,0,.3,.25));const bulb=sph(glow('#ffb35c',5),0,3.95,0,.18,false);m.add(bulb);
  const rings=[];for(let i=0;i<2;i++){const rg=new THREE.Mesh(TOR(1.45+i*.18,.035),mat('#c9a24a',{metalness:.95,roughness:.2,emissive:'#ff8a2a',emissiveIntensity:.6}));rg.position.y=1.8;m.add(rg);rings.push(rg)}
  const light=new THREE.PointLight('#ff9a3a',18,9,1.6);light.position.set(0,2,1.4);m.add(light);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:'#ff8a2a',transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));halo.position.set(0,1.9,.9);halo.scale.set(3,4,1);m.add(halo);
  const pad=new THREE.Mesh(geo('padring',()=>new THREE.RingGeometry(1.5,1.7,48)),addMat('#ff8a2a',.5));pad.rotation.x=-Math.PI/2;pad.position.y=.03;m.add(pad);
  WD.anim.push(t=>{rings[0].rotation.set(Math.PI/2+Math.sin(t*.7)*.25,t*.8,0);rings[1].rotation.set(Math.PI/2+Math.cos(t*.5)*.3,-t*.6,.4);bulb.material.emissiveIntensity=4+Math.sin(t*3)*1.2;pad.material.opacity=.3+Math.sin(t*2)*.15});
  g.add(m);return m;
}
function setMachineYear(y){if(!WD||!WD.machine)return;const d=WD.machine.userData.disp;if(d.emissiveMap)d.emissiveMap.dispose();d.emissiveMap=nixieTex(y===NX?'∞':y===TH?'END':fyS(y));d.needsUpdate=true}

/* ================= weather ================= */
function buildWeather(g,lk){
  if(!lk.wx)return;const[type,c,n0]=lk.wx;const n=TOUCH?n0*.6|0:n0;
  if(type==='rain'){const p=new Float32Array(n*6);for(let i=0;i<n;i++){const x=(Math.random()-.5)*60,y=Math.random()*16,z=-12+Math.random()*24;p.set([x,y,z,x-.05,y-.7,z],i*6)}
    const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(p,3));const ls=new THREE.LineSegments(gg,new THREE.LineBasicMaterial({color:c,transparent:true,opacity:.35}));ls.frustumCulled=false;g.add(ls);WD.wx={type,o:ls,n};return}
  const p=new Float32Array(n*3),v=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*60;p[i*3+1]=Math.random()*14;p[i*3+2]=-12+Math.random()*24;v[i*3]=(Math.random()-.5);v[i*3+1]=Math.random();v[i*3+2]=Math.random()*6.28}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(p,3));
  const add=type==='motes';const pm=new THREE.PointsMaterial({color:c,size:type==='snow'?.16:type==='leaves'?.22:add?.14:.08,map:softTex,transparent:true,opacity:add?.9:.7,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending});
  const pts=new THREE.Points(gg,pm);pts.frustumCulled=false;g.add(pts);WD.wx={type,o:pts,n,v};
}
function updateWeather(dt,t,cx){
  const w=WD.wx;if(!w)return;const a=w.o.geometry.attributes.position,p=a.array;
  if(w.type==='rain'){for(let i=0;i<w.n;i++){const k=i*6;p[k+1]-=22*dt;p[k+4]-=22*dt;p[k]-=1.5*dt;p[k+3]-=1.5*dt;if(p[k+4]<0){const x=cx+(Math.random()-.5)*60,y=14+Math.random()*3;p[k]=x;p[k+1]=y;p[k+3]=x-.05;p[k+4]=y-.7}
      if(p[k]<cx-32){p[k]+=60;p[k+3]+=60}else if(p[k]>cx+32){p[k]-=60;p[k+3]-=60}}a.needsUpdate=true;return}
  const v=w.v;
  for(let i=0;i<w.n;i++){const k=i*3;
    if(w.type==='snow'){p[k+1]-=(.8+v[k+1])*dt;p[k]+=Math.sin(t+v[k+2])*.4*dt}
    else if(w.type==='dust'){p[k]+=(3+v[k+1]*4)*dt;p[k+1]+=Math.sin(t*2+v[k+2])*.3*dt}
    else if(w.type==='leaves'){p[k]+=(1+v[k]*.6)*dt;p[k+1]-=(.6+v[k+1]*.4)*dt;p[k+2]+=Math.cos(t+v[k+2])*.3*dt}
    else{p[k]+=Math.sin(t*.4+v[k+2])*.25*dt;p[k+1]+=(.15+v[k+1]*.25)*dt}
    if(p[k+1]<0)p[k+1]=14;if(p[k+1]>14)p[k+1]=0;if(p[k]<cx-30)p[k]+=60;else if(p[k]>cx+30)p[k]-=60}
  a.needsUpdate=true;
}

/* ================= world generation (infinite, streamed in chunks) ================= */
function buildChunk(i){
  const x0=i*CW,x1=x0+CW,e=ERA[WD.year],lk=LK,r=rng(WD.seed*31+i*7919+13);
  const g=new THREE.Group(),c={g,anim:[],i};const saved=WD.anim;WD.anim=c.anim;
  if(lk.bld){const b=lk.bld,fac=WD.fac,lx=WD.land.x;
    let x=x0+.3;
    while(x<x1-.5){let w=b.w[0]+r()*(b.w[1]-b.w[0]);if(x1-(x+w)<b.w[0])w=x1-x;const cx=x+w/2;
      if(e.land&&Math.abs(cx-lx)<w/2+6.5){x+=w+.3;continue}
      if(b.sparse&&r()<.45){x+=w+r()*6;continue}
      const h=b.h[0]+r()*(b.h[1]-b.h[0]),d=b.d[0]+r()*(b.d[1]-b.d[0]);g.add(building(lk,fac,cx,FRONT-d/2,w,h,d,r,true));x+=w+(b.sparse?2+r()*5:.25+r()*.6)}
    let xb=x0;
    while(xb<x1-.5){let w=b.w[0]*1.2+r()*(b.w[1]-b.w[0])*1.4;if(x1-(xb+w)<b.w[0]*1.2)w=x1-xb;const h=(b.h[0]+r()*(b.h[1]-b.h[0]))*1.5,d=7;
      if(!b.sparse||r()<.4)g.add(building(lk,fac,xb+w/2,FRONT-12-d/2-r()*4,w,h,d,r,false));xb+=w+1+r()*3}}
  farRow(g,lk,r,x0,x1);
  (lk.extra||[]).forEach(k=>{if(!STATIC_EX.has(k)&&EXTRA[k])EXTRA[k](g,lk,r,x0,x1)});
  if(lk.lamps)for(let x=Math.ceil(x0/14)*14;x<x1;x+=14){if(Math.abs(x-WD.land.x)<5||Math.abs(x-WD.mx)<3)continue;lamp(g,lk,x,FRONT+2.6,false)}
  WD.anim=saved;WD.group.add(g);WD.chunks.set(i,c);
}
function streamChunks(max=1){
  if(!WD)return;const ci=Math.floor(camX/CW);let built=0;
  for(let d=0;d<=CR&&built<max;d++){for(const i of(d?[ci-d,ci+d]:[ci])){if(!WD.chunks.has(i)){buildChunk(i);built++;if(built>=max)break}}}
  for(const[i,c]of[...WD.chunks]){if(Math.abs(i-ci)>CR+1){WD.group.remove(c.g);disposeTree(c.g,WD.shared);WD.chunks.delete(i)}}
}
function updateWorldStream(dt){
  if(!WD||!WD.sky)return;
  const sx=Math.round(camX/6)*6;for(const o of WD.follow)o.position.x=sx;
  WD.sky.position.x=camX;WD.cloudG.position.x=camX*.85;
  streamChunks(1);
  if(WD.lampPool.length){const lk=LK,pos=[];const b0=Math.round(camX/14);for(let k=b0-4;k<=b0+4;k++){const x=k*14;if(Math.abs(x-WD.land.x)<5||Math.abs(x-WD.mx)<3)continue;pos.push(x)}
    pos.sort((a,b)=>Math.abs(a-camX)-Math.abs(b-camX));WD.lampPool.forEach((p,i)=>{const x=pos[i];if(x==null){p.intensity=0;return}p.intensity=22;p.position.set(x,3.5,FRONT+3.2)})}
  if(mode==='play'||mode==='title'||mode==='over')streamCitizens(dt);
}
function genWorld(year){
  if(typeof clearMagic==='function')clearMagic();
  if(WD&&WD.group){scene.remove(WD.group);disposeTree(WD.group)}
  const e=ERA[year],lk=e.look;LK=lk;const seed=(year+3000)*7919+(typeof G!=='undefined'&&G?G.seed:0),r=rng(seed);
  WD={year,seed,group:new THREE.Group(),items:[],npcs:[],coins:[],shots:[],rings:[],portal:null,huntT:8,stab:null,delivered:0,anim:[],clouds:[],wx:null,cdSign:null,mx:0,land:null,machine:null,relic:null,
    chunks:new Map(),shared:new Set(),follow:[],sky:null,cloudG:null,lampPool:[],fac:null,citT:0};
  const g=WD.group;scene.add(g);
  const lx=e.land?(year===NX||year===TH?12:(r()<.5?-1:1)*(24+r()*30)):null;
  WD.land=lx!=null?{x:lx,anchor:new THREE.Vector3(lx,0,ZMIN+.2),key:e.land}:{x:9999,anchor:null};
  scene.fog=new THREE.FogExp2(lk.fog,lk.fogD);
  sun.color.set(lk.sun[0]);sun.intensity=lk.sun[1]*(lk.night?1:.78);WD.sunOff=new THREE.Vector3(...lk.sunPos).normalize().multiplyScalar(60);
  hemi.color.set(lk.hemi[0]);hemi.groundColor.set(lk.hemi[1]);hemi.intensity=lk.hemi[2]*(lk.night?1:.72);
  renderer.toneMappingExposure=lk.exp;bloom.strength=lk.bloom[0]*(RM?.45:.6);bloom.threshold=Math.max(lk.bloom[1],.62);bloom.radius=.42;
  setFilm(e.film);
  const sky=new THREE.Group(),cloudG=new THREE.Group();g.add(sky,cloudG);WD.sky=sky;WD.cloudG=cloudG;
  buildSky(sky,lk,r,cloudG);
  // ground (follows the camera in 6-unit steps so the texture never slides)
  const[gk,gc,gr,gm]=lk.ground;const gt=groundTex(gk,gc,seed);gt.repeat.set(220/6,90/6);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,90),new THREE.MeshStandardMaterial({map:gt,roughness:gr,metalness:gm||0}));ground.rotation.x=-Math.PI/2;ground.position.z=-20;ground.receiveShadow=true;g.add(ground);WD.follow.push(ground);
  if(lk.neon){const lt=lineTex(lk.neon,true);lt.repeat.set(220/3,90/3);const nm=new THREE.Mesh(new THREE.PlaneGeometry(220,90),new THREE.MeshBasicMaterial({map:lt,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.55}));nm.rotation.x=-Math.PI/2;nm.position.set(0,.01,-20);g.add(nm);WD.follow.push(nm)}
  if(lk.bld){const sw=mat(shadeHex(gc,1.12),{roughness:Math.min(1,gr+.1),metalness:gm||0});
    const swk=box(sw,0,.07,FRONT+1.6,2*L+60,.14,3.2,false);swk.receiveShadow=true;g.add(swk);WD.follow.push(swk);
    const cb=box(mat(shadeHex(gc,.8)),0,.09,FRONT+3.2,2*L+60,.18,.12,false);g.add(cb);WD.follow.push(cb);
    WD.fac=makeFacades(lk,seed)}
  (lk.extra||[]).forEach(k=>{if(STATIC_EX.has(k)&&EXTRA[k])EXTRA[k](sky,lk,r,0,0)});
  if(e.land){const lg=new THREE.Group();lg.position.set(lx,0,FRONT);LANDM[e.land](lg,lk);lg.traverse(o=>{if(o.isMesh&&!o.material.blending){o.castShadow=true;o.receiveShadow=true}});g.add(lg);WD.landGroup=lg;
    const ring=new THREE.Mesh(geo('lring',()=>new THREE.RingGeometry(1.05,1.3,48)),addMat('#ff8a2a',.7));ring.rotation.x=-Math.PI/2;ring.position.set(lx,.04,ZMIN+.2);g.add(ring);WD.landRing=ring;
    const beam=new THREE.Mesh(geo('lbeam',()=>new THREE.CylinderGeometry(1.1,1.1,14,32,1,true)),addMat('#ff8a2a',.06));beam.position.set(lx,7,ZMIN+.2);g.add(beam);WD.landBeam=beam}
  if(lk.lamps&&lk.night){for(let i=0;i<(TOUCH?3:4);i++){const p=new THREE.PointLight(lk.lamps,22,15,1.6);p.position.set(0,3.5,FRONT+3.2);g.add(p);WD.lampPool.push(p)}}
  WD.machine=buildMachine(g,WD.mx);
  if(year===NX)WD.fountain=buildFountain(g,lx+10);
  buildWeather(g,lk);
  const envScene=new THREE.Scene();envScene.add(new THREE.Mesh(new THREE.SphereGeometry(10,24,12),WD.skyMat));
  if(scene.environment)scene.environment.dispose();scene.environment=pmrem.fromScene(envScene,.02).texture;
  scene.background=null;
  spawnCitizens(r);
  if(typeof G!=='undefined'&&G){
    if(missionOpen(year))placeItem(r);
    if(RELIC[year]&&!G.relics[year])placeRelic(r);
    if(activeRepair())placeRepair(r);
    placeSeeds();
    placeGuardian(year);
    if(year===NX)spawnMerchant();
  }
  setMachineYear(year);
}
