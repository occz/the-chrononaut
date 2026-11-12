# ===== OBSERVATORY (round stone tower r2.6 at z-3.5, copper dome) =====
O=[]
cz=-3.5
O+=[bx('bstone',(0,.2,-1.3),(6.4,.4,3.4)),bx('bstone2',(0,.55,-1.15),(4.6,.3,2.7))]
O.append(cylv('bstone',0,5,cz,2.6,10,28))
for y in(2.2,4.6,7.0,9.3):O.append(cylv('bstone2',0,y,cz,2.68,.2,28))
for y in(.9,1.5,2.1,2.7,3.3,3.9,5.3,5.9,6.5,7.7,8.3,8.9):O.append(cylv('bstone2',0,y,cz,2.62,.05,28))
for a in(-1.35,-.95,.95,1.35):
    px,pz=2.62*math.sin(a),cz+2.62*math.cos(a)
    O+=[cylv('bstone2',px,4.6,pz,.3,9.2,10),cylv('bstone',px,9.3,pz,.38,.3,10),cylv('bstone',px,.15,pz,.4,.3,10)]
for x in(-1.2,1.2):
    O+=[bx('bstone2',(x,6.0,-1.15),(.85,1.7,.12)),bx('bstone',(x,5.12,-1.1),(1.0,.14,.2)),bx('bstone',(x,6.95,-1.12),(.95,.14,.16))]
for sx in(-1,1):O+=[bx('bstone2',(sx*.82,1.45,-.84),(.28,2.9,.2)),bx('bstone',(sx*.82,.2,-.84),(.4,.3,.3))]
O+=[bx('bstone2',(0,2.95,-.84),(2.0,.3,.22)),bx('bstone',(0,3.2,-.86),(.5,.3,.2)),bx('wood2',(0,.1,-.6),(1.8,.2,.5))]
# balcony + rail
O.append(cylv('bstone2',0,10.05,cz,3.1,.3,28));O.append(cylv('bstone',0,10.25,cz,3.0,.12,28))
for k in range(20):
    a=k/20*math.pi*2;O.append(cylv('brass',3.0*math.cos(a)*.97,10.6,cz+3.0*math.sin(a)*.97,.05,.7,6))
O+=ring('brass',0,10.95,cz,2.9,.05,20)
# dome
O.append(ell('verdigris',(0,10.5,cz),(2.5,2.2,2.5),32))
for k in range(8):
    a=k/8*math.pi*2
    pts=[(math.cos(a)*2.54*math.cos(ph),10.5+2.24*math.sin(ph),cz+math.sin(a)*2.54*math.cos(ph)) for ph in(0,.3,.6,.9,1.2,1.45)]
    O+=chain('brass',pts,[.07]*6) if False else [seg('brass',pts[i],pts[i+1],.06,.06,False,5)[0] for i in range(5)]
O+=ring('brass',0,10.6,cz,2.55,.07,24);O+=ring('brass',0,11.7,cz,2.2,.05,20);O+=ring('brass',0,12.4,cz,1.3,.05,16)
# observing slit
rows=[]
for ph in(.1,.3,.55,.8,1.05,1.3,1.5):
    rr=2.5*math.cos(ph)+.07;rows.append([g(-.28*(1-ph/1.7),10.5+2.2*math.sin(ph),cz+rr),g(.28*(1-ph/1.7),10.5+2.2*math.sin(ph),cz+rr)])
O.append(strip('dark',rows,True,.03))
O+=[ell('gold',(0,12.78,cz),(.22,.22,.22),10),frus('gold',g(0,13.1,cz),.07,0,.6,seg=6)]
join(O,'observatory')
# ===== LOCOMOTIVE (local to lg: origin at loco centre, nose +x) =====
L=[]
L.append(cylh('iron',(-.1,1.95,0),.85,4.6,'x',24))
L.append(cylh('iron',(2.55,1.95,0),.92,.9,'x',24));L.append(cylh('brass',(3.02,1.95,0),.95,.1,'x',24));L.append(cylh('white',(3.07,1.95,0),.7,.06,'x',20))
for x in(-1.9,-.9,.1,1.1,2.0):L.append(cylh('brass',(x,1.95,0),.88,.1,'x',24))
L+=[cylv('iron',.3,2.95,0,.42,.45,16),ell('brass',(.3,3.18,0),(.4,.28,.4),12),cylv('iron',-.9,2.9,0,.3,.35,12),ell('red',(-.9,3.12,0),(.28,.2,.28),10)]
L+=[frus('iron',g(2.55,3.7,0),.24,.4,1.5,seg=14),frus('brass',g(2.55,4.5,0),.46,.46,.12,seg=14),cylv('brass',-.2,3.15,0,.06,.4,6),cylv('brass',-.6,3.15,0,.06,.4,6)]
L.append(bx('iron',(0,.95,0),(7.4,.35,1.5)))
L+=[bx('red',(-3.3,2.45,0),(2.2,2.9,2.0)),bx('black',(-3.3,3.98,0),(2.7,.16,2.6)),bx('red',(-3.3,.75,0),(2.1,.2,2.1))]
for sz in(-1,1):L+=[bx('glass',(-3.3,3.0,sz*1.01),(1.0,.9,.04)),bx('brass',(-3.3,3.0,sz*1.03),(1.15,.1,.04)),bx('brass',(-3.3,2.5,sz*1.03),(1.15,.08,.04))]
L+=[bx('glass',(-4.42,3.0,0),(.04,.9,1.0)),bx('brass',(-3.3,1.4,1.02),(1.4,.08,.04)),bx('brass',(-3.3,1.4,-1.02),(1.4,.08,.04))]
# front beam + buffers + cowcatcher
L+=[bx('red',(3.7,.85,0),(.3,.55,2.1))]
for sz in(-.7,.7):L+=[cylh('steel',(3.95,.9,sz),.14,.4,'x',10),cylh('steel',(4.15,.9,sz),.24,.08,'x',10)]
for k in range(7):
    zz=-.75+k*.25;L.append(rod('steel',(3.75,.65,zz*.7),(4.45,.12,zz*1.5),.03,5))
L+=[rod('steel',(3.75,.65,-.5),(4.45,.12,-1.1),.04,5),rod('steel',(3.75,.65,.5),(4.45,.12,1.1),.04,5),rod('steel',(4.45,.12,-1.1),(4.45,.12,1.1),.04,5)]
# wheels
for x in(-2.8,-1.0,.8,2.2):
    r_=.78 if x<2 else .6
    for sz in(-.95,.95):
        L+=[cylh('red',(x,r_+.05,sz),r_,.14,'z',20),cylh('black',(x,r_+.05,sz+.07*(1 if sz>0 else -1)),r_*.96,.04,'z',20),cylh('brass',(x,r_+.05,sz),.2,.2,'z',10)]
        for k in range(6):
            a=k/6*math.pi;L.append(rod('red',(x+math.cos(a)*r_*.9,r_+.05+math.sin(a)*r_*.9,sz),(x-math.cos(a)*r_*.9,r_+.05-math.sin(a)*r_*.9,sz),.05,5))
for sz in(-1.05,1.05):L+=[rod('steel',(-2.8,.9,sz),(.8,.9,sz),.07,6),rod('steel',(.8,.9,sz),(2.2,.6,sz),.06,6)]
for sz in(-.95,.95):L+=[cylh('iron',(1.7,1.1,sz*1.05),.28,1.2,'x',12),rod('steel',(2.3,1.1,sz*1.05),(2.6,.7,sz*1.05),.06,6)]
L+=[cylv('steel',2.9,2.9,0,.0,.0) if False else ell('glowlamp',(3.12,2.35,0),(.25,.25,.25),10)]
L+=[rod('steel',(2.3,2.75,.9),(3.0,2.75,.9),.03,5),rod('steel',(2.3,2.75,-.9),(3.0,2.75,-.9),.03,5)]
join(L,'loco')
# ===== STATION canopy + track + platform (landmark coords) =====
T=[]
for sx in(-1,1):
    x=sx*5.5
    T+=[bx('wood',(x,3.0,-1),(.34,6,.34)),bx('iron',(x,.15,-1),(.7,.3,.7)),bx('iron',(x,.45,-1),(.5,.3,.5))]
    T+=[rod('iron',(x,4.8,-1),(x-sx*1.5,5.7,-1),.1,6),rod('iron',(x,3.9,-1),(x-sx*1.0,4.9,-1),.08,6),ell('brass',(x,6.2,-1),(.25,.25,.25),10)]
T+=[bx('wood',(0,5.8,-1),(11.5,.4,.34)),bx('wood2',(0,6.12,-1),(11.9,.25,.5))]
for i in range(22):T.append(bx('wood2',(-5.5+i*.5,5.45,-1),(.3,.34,.16)))
for k in range(8):T.append(bx('wood2',(0,6.35+k*.02,-1.7-k*.55),(11.9-.0,.12,.6)))  # sloped planks stepped
T+=[bx('wood',(0,6.0,-1.15),(6,.1,.5))]
# lantern
T+=[rod('iron',(0,5.6,-.5),(0,4.8,-.5),.03,4),ell('glowlamp',(0,4.55,-.5),(.22,.3,.22),10),bx('iron',(0,4.9,-.5),(.4,.1,.4)),bx('iron',(0,4.2,-.5),(.34,.08,.34))]
# platform + track
T+=[bx('conc',(0,.16,-2.0),(13,.32,2.4)),bx('conc2',(0,.34,-.78),(13,.06,.2))]
for i in range(18):T.append(bx('wood2',(-7.2+i*.85,.05,1.2),(.32,.1,2.3)))
for sz in(.35,2.05):T+=[bx('steel',(0,.14,sz),(14.8,.08,.1))]
T+=[bx('wood',(-3,.8,-2.8),(2.4,.12,.7)),bx('wood',(-3,.52,-2.8),(.1,.5,.6)),bx('wood',(3,.8,-2.8),(2.4,.12,.7))]
T+=[bx('wood2',(7.0,.45,.3),(.9,.9,.9)),bx('wood2',(7.1,1.1,.4),(.8,.4,.8)),bx('iron',(-7.2,.5,1.2),(.3,1.0,.3)),bx('red',(-7.2,1.1,1.2),(1.0,.6,.1))]
# signal post
T+=[bx('iron',(6.8,2.2,-.4),(.14,4.4,.14)),bx('red',(6.8,4.3,-.3),(.7,.14,.1)),ell('glowlamp',(6.8,4.0,-.2),(.14,.14,.14),8)]
join(T,'station')
