# ===== HANGAR (1915 barrel-vault, tin roof, a=5 b=6 depth 8 at z-4) =====
Hn=[]
def arch(a_,b_,z,n=30,sc=1.0):return [(a_*sc*math.cos(math.pi*k/n),b_*sc*math.sin(math.pi*k/n),z) for k in range(n+1)]
# corrugated roof shell
rows=[]
for z in(0,-8):
    row=[]
    for k in range(0,121):
        t=math.pi*k/120;rr=1+.012*math.sin(k*1.6)
        row.append(g(5.0*math.cos(t)*rr,6.0*math.sin(t)*rr,z))
    rows.append(row)
Hn.append(strip('tin',rows,True,.06))
# front/back plate with door opening
prof=[(-5,0),(-3,0),(-3,3.6),(3,3.6),(3,0),(5,0)]+[(5*math.cos(math.pi*k/40),6*math.sin(math.pi*k/40)) for k in range(1,40)]
Hn.append(plate('tin2',prof,0,.25))
# arch ribs inside + front frame
for z in(-.1,-2.6,-5.2,-7.8):
    pts=arch(5,6,z,16,.99)
    for i in range(16):Hn+=rod('bwood',pts[i],pts[i+1],.1,5)
for sx in(-1,1):Hn+=[bx('bwood',(sx*5.0,.0+.1,-4),(.2,.2,8))]
for sx in(-1,1):Hn+=[bx('bwood',(sx*3.1,1.8,.12),(.25,3.6,.2)),bx('brick',(sx*4.4,.4,.2),(1.2,.8,.4))]
Hn+=[bx('bwood',(0,3.7,.12),(6.4,.25,.22))]
# door leaves open to the right + rail
Hn+=[bx('tin2',(4.6,1.8,.4),(3.2,3.6,.12)),bx('tin2',(6.0,1.8,.55),(3.0,3.6,.12))]
for sx,zz in((4.6,.5),(6.0,.65)):
    Hn+=[bx('bwood',(sx,3.45,zz),(3.2,.14,.08)),bx('bwood',(sx,.15,zz),(3.2,.14,.08)),rod('bwood',(sx-1.5,.2,zz),(sx+1.5,3.4,zz),.05,4)]
Hn.append(bx('iron',(4.9,3.9,.5),(7.6,.12,.14)))
# upper windows
for k in range(5):
    x=-3.2+k*1.6;Hn+=[bx('bwood',(x,4.7,.15),(.9,.9,.1)),bx('glowwin',(x,4.7,.2),(.74,.74,.04)),bx('bwood',(x,4.7,.22),(.74,.06,.04)),bx('bwood',(x,4.7,.22),(.06,.74,.04))]
# ridge vent, weathervane, windsock
Hn+=[bx('tin2',(0,6.12,-4),(.5,.25,7.5))]
Hn+=[rod('iron',(0,6.2,-1),(0,7.4,-1),.04,5),rod('iron',(-.5,6.9,-1),(.5,6.9,-1),.03,5),ell('iron',(.5,6.9,-1),(.1,.1,.1),6),rod('iron',(-.4,7.4,-1),(.6,7.4,-1),.03,5)]
Hn+=[rod('iron',(7.8,0,-.8),(7.8,5.0,-.8),.06,6)]
for k in range(5):Hn.append(frus('orange' if k%2==0 else 'white',g(8.2+k*.4,4.9-k*.05,-.8),.28-k*.04,.24-k*.04,.4,seg=10,rot=(0,math.pi/2,0)))
# drums, crates, bench, chocks, fuel pump
for k,(x,z) in enumerate([(-7.0,.7),(-6.3,.4),(-6.8,-.4)]):Hn+=[cylv('red' if k!=1 else 'iron',x,.5,z,.34,1.0,12),cylv('steel',x,1.0,z,.35,.06,12)]
Hn+=[bx('wood',(-5.9,.4,2.0),(.9,.8,.9)),bx('wood2',(-5.7,1.1,2.0),(.7,.6,.7)),bx('wood',(-8.0,.35,1.5),(.9,.7,.9))]
Hn+=[bx('bwood',(-6.5,.55,-1.6),(2.0,.1,.7)),bx('bwood',(-7.3,.28,-1.6),(.1,.56,.6)),bx('bwood',(-5.7,.28,-1.6),(.1,.56,.6)),bx('iron',(-6.5,.7,-1.6),(.4,.22,.3))]
Hn+=[cylv('red',-4.4,1.0,1.6,.28,2.0,10),bx('iron',(-4.4,2.1,1.6),(.6,.3,.5)),ell('glowlamp',(-4.4,2.1,1.9),(.1,.1,.02),6)]
for k in range(2):Hn+=[bx('wood2',(.2+k*3.2,.1,3.3),(.7,.2,.4),0,(0,0,.4))]
join(Hn,'hangar')
# ===== PALACE (cinema, art deco) =====
Pl=[]
Pl+=[bx('deco',(0,7,-4),(10,14,8),.02),bx('deco2',(0,15,-4),(6.4,2.2,6.4)),bx('deco',(0,16.6,-4),(3.8,1.2,3.8)),bx('deco2',(0,17.4,-4),(4.2,.3,4.2))]
Pl+=[bx('brass',(0,18.2,-4),(.5,1.4,.5)),rod('brass',(0,18.9,-4),(0,23.0,-4),.07,6),rod('brass',(0,21.5,-4),(.0,21.5,-3),.04,4)]
for sx in(-1,1):
    Pl+=[bx('deco2',(sx*4.7,7,.15),(.9,14,.4)),bx('deco2',(sx*4.7,14.2,.1),(1.1,.5,.7)),bx('brass',(sx*4.7,3.6,.38),(.5,.1,.1))]
    for k in range(4):Pl.append(bx('dark',(sx*4.7+(-.28+k*.186),9,.36),(.05,9,.04)))
    Pl+=[bx('brass',(sx*4.7,14.55,.1),(.8,.2,.5)),bx('deco2',(sx*3.0,15,-.1),(1.0,2.1,.5))]
for y in(12.2,13.0,13.7):Pl.append(bx('brass',(0,y,.1),(10.2,.1,.2)))
for k in range(20):Pl.append(bx('deco2',(-4.75+k*.5,14.15,.3),(.3,.28,.3)))
for k in range(5):
    x=-3.8+k*1.45
    Pl+=[bx('gold',(x,6.7,.04),(1.2,1.8,.1)),bx(['poster1','poster2','poster3'][k%3],(x,6.7,.1),(1.0,1.6,.04))]
# marquee
Pl+=[bx('dark',(0,4.2,.6),(9,.6,2.4)),bx('gold',(0,4.53,.6),(9.2,.1,2.6)),bx('gold',(0,3.88,.6),(9.2,.08,2.6))]
for sx in(-3.8,3.8):Pl.append(rod('iron',(sx,4.0,-.3),(sx,5.6,-.3),.05,5))
for sx in(-4.2,4.2):Pl.append(rod('iron',(sx,3.9,1.6),(sx,6.2,-.2),.05,5))
# entrance
for sx in(-1,1):Pl+=[bx('brass',(sx*2.1,1.7,.1),(.25,3.4,.3)),bx('deco2',(sx*3.0,1.6,.08),(1.1,3.2,.2))]
Pl+=[bx('brass',(0,3.45,.1),(4.7,.3,.32)),bx('deco2',(0,.05,.5),(5.0,.1,1.4))]
Pl+=[bx('carpet',(0,.04,1.8),(3.2,.05,2.6))]
for z in(1.0,1.9,2.8):
    for sx in(-1.9,1.9):Pl+=[cylv('brass',sx,.45,z,.05,.9,8),ell('brass',(sx,.95,z),(.09,.09,.09),8)]
for z in(1.0,1.9):
    for sx in(-1.9,1.9):Pl.append(rod('red',(sx,.88,z),(sx,.88,z+.9),.03,4))
# ticket booth + lightbox
Pl+=[bx('deco2',(-4.0,.9,1.3),(1.6,1.8,1.2)),bx('brass',(-4.0,1.85,1.3),(1.8,.12,1.4)),bx('glass',(-4.0,1.1,1.92),(1.0,.7,.04)),bx('brass',(-4.0,.75,1.95),(1.1,.06,.1))]
Pl+=[bx('iron',(4.1,1.2,1.0),(1.3,2.4,.18)),bx('poster2',(4.1,1.3,1.1),(1.1,2.1,.04)),cylv('iron',3.5,.1,1.0,.07,.2,6)]
join(Pl,'palace')
# ===== RADIO station building + tower =====
Rd=[]
Rd+=[bx('plaster',(0,2.2,-3),(8,4.4,6)),bx('trimwhite',(0,4.55,-3),(8.5,.3,6.5)),bx('trimwhite',(0,4.9,-3),(7.6,.4,5.6)),bx('plaster2',(0,.12,-3),(8.2,.24,6.2))]
Rd+=[bx('plaster2',(0,3.6,-.02),(6.5,1.25,.1))]
for k in range(5):Rd.append(bx('red',(-3.2+k*1.6,4.3,.1),(.7,.1,.14)))
# window frame around glow (-2,1.6, 2x2)
Rd+=[bx('trimwhite',(-2,2.7,.04),(2.4,.2,.14)),bx('trimwhite',(-2,.55,.04),(2.4,.2,.14)),bx('trimwhite',(-3.1,1.6,.04),(.2,2.2,.14)),bx('trimwhite',(-.9,1.6,.04),(.2,2.2,.14)),bx('trimwhite',(-2,1.6,.05),(.08,2.0,.06)),bx('trimwhite',(-2,1.6,.05),(2.0,.08,.06))]
# door + canopy
Rd+=[bx('wood2',(2.4,1.3,.0),(1.4,2.6,.1)),bx('trimwhite',(2.4,2.7,.1),(1.8,.22,.3)),bx('red',(2.4,2.95,.5),(2.0,.12,1.0)),bx('glowwin',(2.4,1.5,.07),(.8,1.4,.03))]
Rd+=[rod('iron',(1.5,2.9,.9),(1.5,2.3,0),.04,4),rod('iron',(3.3,2.9,.9),(3.3,2.3,0),.04,4)]
# steps + corner posts
Rd+=[bx('conc',(2.4,.1,.7),(2.0,.2,1.0)),bx('conc',(2.4,.25,.45),(1.8,.1,.6))]
# roof gear: guy anchors, vents, small dish
Rd+=[bx('iron',(-2.6,5.3,-1.5),(.6,.4,.6)),bx('iron',(-2.6,5.65,-1.5),(.3,.3,.3)),cylv('steel',-2.6,5.9,-1.5,.04,.5,5),bx('iron',(3.0,5.25,-4.6),(1.0,.3,.8))]
join(Rd,'radio')
TW=[]
base=(2,-3)
def leg(i,y):
    s=.9*(1-y/24.0)+.12;a=i*2.094+.5;return (base[0]+math.cos(a)*s,y,base[1]+math.sin(a)*s)
for i in range(3):
    for k in range(0,10):
        y0=4.8+k*1.7;y1=4.8+(k+1)*1.7
        TW+=rod('red' if k%2==0 else 'white',leg(i,y0),leg(i,y1),.07,5)
for k in range(0,10):
    y0=4.8+k*1.7;y1=4.8+(k+1)*1.7
    for i in range(3):
        j=(i+1)%3
        TW+=rod('steel',leg(i,y0),leg(j,y1),.03,4)
        if k%2==0:TW+=rod('steel',leg(i,y1),leg(j,y1),.03,4)
TW+=[bx('iron',(2,4.75,-3),(1.6,.2,1.6))]
for k,y in enumerate((9.4,15.2)):
    for i in range(3):
        TW+=rod('steel',leg(i,y),(base[0]+math.cos(i*2.094+.5)*7,4.75,base[1]+math.sin(i*2.094+.5)*5.5),.015,3)
TW+=[rod('steel',(2,21.8,-3),(2,24.4,-3),.05,5),bx('steel',(2,22.9,-3),(1.4,.05,.05)),bx('steel',(2,23.6,-3),(.9,.05,.05))]
join(TW,'radiotower')
# ===== TV SHOP (1950s) =====
Tv=[]
Tv+=[bx('brick',(0,3,-3.5),(9,6,7)),bx('wood2',(0,6.2,-3.5),(9.4,.4,7.4)),bx('wood2',(0,6.5,-3.5),(8.6,.25,6.6)),bx('wood2',(-3,7.1,-5),(1.0,1.4,1.0))]
for k in range(10):Tv.append(bx('brick2',(-4.0+k*.9,5.7,.04),(.7,.14,.06)))
for sx in(-1,1):Tv+=[bx('wood2',(sx*3.65,2.0,.08),(.3,3.2,.2)),bx('brick2',(sx*4.2,1.0,.06),(.8,2.0,.1))]
Tv+=[bx('wood2',(0,3.65,.08),(7.6,.3,.2)),bx('wood2',(0,.4,.08),(7.4,.8,.2)),bx('wood2',(0,.82,.15),(7.6,.08,.34))]
Tv+=[bx('glass',(0,2.2,.02),(7,2.6,.04)),bx('wood2',(0,2.2,.06),(.1,2.6,.06))]
# awning
for k in range(9):
    x0=-4.3+k*.96;m='awn1' if k%2==0 else 'awn2'
    Tv.append(strip(m,[[g(x0,4.5,.05),g(x0+.96,4.5,.05)],[g(x0,3.75,1.7),g(x0+.96,3.75,1.7)]],True,.03))
    Tv.append(bx(m,(x0+.48,3.6,1.72),(.96,.3,.04)))
for sx in(-4.3,4.3):Tv+=[rod('iron',(sx,3.6,1.7),(sx,4.4,.05),.04,4)]
# crates/stand
Tv+=[bx('wood',(-4.6,.35,1.2),(.8,.7,.8)),bx('wood2',(-4.55,.9,1.2),(.7,.4,.7)),bx('iron',(4.6,.5,1.0),(.2,1.0,.2)),bx('white',(4.6,1.2,1.0),(.9,.5,.06))]
# antennas
Tv+=[rod('steel',(2.5,6.6,-3),(2.5,9.2,-3),.045,5)]
for k,(y,L) in enumerate([(7.0,1.9),(7.55,1.7),(8.0,1.5),(8.4,1.2),(8.75,.9)]):Tv.append(bx('steel',(2.5,y,-3),(L,.04,.04)))
Tv+=[rod('steel',(-2.2,6.6,-5),(-2.2,8.4,-5),.04,5),bx('steel',(-2.2,8.0,-5),(1.2,.04,.04)),bx('steel',(-2.2,8.3,-5),(.9,.04,.04))]
join(Tv,'tvshop')
