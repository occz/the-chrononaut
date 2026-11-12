# ===== STAGE (concert) =====
St=[]
St+=[bx('black',(0,.7,-2),(14,1.4,7)),bx('stagetop',(0,1.43,-2),(14.1,.06,7.1)),bx('led',(0,.7,1.52),(13.6,1.0,.06))]
for k in range(8):St.append(bx('steel',(-6.3+k*1.8,.7,1.56),(.08,1.0,.04)))
for sx in(-1,1):
    for k in range(4):St.append(bx('conc2',(sx*(7.6+0),.2+k*.35,.3-k*.0),(.9,.35,1.4+0)) if False else bx('black',(sx*(7.5),.17+k*.0,2.1-k*.55),(1.0,.34+k*.3,.5)))
# crowd barrier
for k in range(8):St+=[bx('steel',(-7.5+k*2.1,.55,3.3),(2.0,.07,.06)),bx('steel',(-7.5+k*2.1,1.0,3.3),(2.0,.07,.06)),bx('steel',(-8.5+k*2.1,.55,3.3),(.07,1.1,.07))]
# trusses
def truss(p0,p1,w=.5,n=8):
    out=[]
    ax=[p1[i]-p0[i] for i in range(3)]
    # triangular truss: 3 chords
    off=[(0,w*.5,0),(-w*.5,-w*.5,0),(w*.5,-w*.5,0)] if abs(ax[1])<1e-6 else [(w*.5,0,w*.5),(-w*.5,0,w*.5),(0,0,-w*.5)]
    for o in off:out+=rod('steel',tuple(p0[i]+o[i] for i in range(3)),tuple(p1[i]+o[i] for i in range(3)),.06,5)
    for k in range(n):
        a=[p0[i]+ax[i]*k/n for i in range(3)];b=[p0[i]+ax[i]*(k+1)/n for i in range(3)]
        for j in range(3):
            o1=off[j];o2=off[(j+1)%3]
            out+=rod('steel',tuple(a[i]+o1[i] for i in range(3)),tuple(b[i]+o2[i] for i in range(3)),.025,4)
    return out
for x in(-6.5,6.5):
    for z in(-1,-4.5):St+=truss((x,1.4,z),(x,8.5,z),.5,7)+[bx('iron',(x,1.5,z),(.9,.2,.9))]
for z in(-1,-4.5):St+=truss((-6.5,8.5,z),(6.5,8.5,z),.5,13)
for k in range(3):St+=rod('steel',(-6.5,8.5,-1-k*1.2),(-6.5,8.5,-1-(k+1)*1.2),.05,4) if False else []
for xx in(-6.5,6.5):St+=rod('steel',(xx,8.5,-1),(xx,8.5,-4.5),.06,5)
for k in range(7):St+=rod('steel',(-6.0+k*2.0,8.5,-1),(-6.0+k*2.0,8.5,-4.5),.04,4)
# par cans
for k in range(10):St+=[bx('black',(-5.85+k*1.3,8.05,-4.5),(.35,.4,.35)),ell('glowlamp',(-5.85+k*1.3,7.82,-4.5),(.14,.14,.14),6)]
for k in range(8):St.append(bx('black',(-5.1+k*1.45,8.05,-1),(.3,.35,.3)))
# LED wall
St+=[bx('led',(0,4.6,-5.3),(11.6,6.2,.2))]
for k in range(1,6):St.append(bx('steel',(-5.8+k*1.93,4.6,-5.18),(.05,6.2,.04)))
for k in range(1,4):St.append(bx('steel',(0,1.5+k*1.55,-5.18),(11.6,.05,.04)))
# speaker stacks
for sx in(-5,5):
    St+=[bx('black',(sx,2.6,-2),(1.8,2.4,1.4)),bx('black',(sx,4.55,-2),(1.6,1.5,1.2)),cylh('steel',(sx,2.2,-1.28),.55,.12,'z',16),cylh('black',(sx,2.2,-1.22),.4,.08,'z',16),frus('steel',g(sx,2.2,-1.1),.1,.1,.1,seg=8,rot=(math.pi/2,0,0))]
    St+=[bx('steel',(sx,4.55,-1.38),(1.3,.9,.05)),cylh('steel',(sx,4.75,-1.35),.18,.08,'z',10),cylh('steel',(sx,4.3,-1.35),.18,.08,'z',10)]
# monitors, mic stands, drum riser + kit
for k in range(4):St+=[bx('black',(-3.6+k*2.4,1.65,.6),(.9,.4,.6),0,(0,0,0))]
for x in(-2.4,0.0,2.4):St+=[rod('steel',(x,1.45,.9),(x,3.0,.9),.025,4),rod('steel',(x,3.0,.9),(x+.2,3.15,.7),.02,4)]
St+=[bx('black',(0,1.8,-3.5),(4,.7,2.4)),cylh('white',(0,2.5,-3.3),.55,.45,'z',16),cylh('red',(-.9,2.45,-3.8),.28,.2,'z',12),cylh('red',(.9,2.45,-3.8),.28,.2,'z',12),cylh('brass',(-1.6,3.05,-3.9),.5,.02,'y',16),cylh('brass',(1.6,3.15,-3.9),.5,.02,'y',16)]
for x in(-1.6,1.6):St.append(rod('steel',(x,2.15,-3.9),(x,3.1,-3.9),.02,4))
St+=[bx('black',(-3.2,1.9,-3.6),(1.0,1.0,.7)),bx('black',(3.2,1.9,-3.6),(1.0,1.0,.7))]
join(St,'stage')
# ===== BANK (neoclassical) =====
Bk=[]
for i,(w,d,y) in enumerate([(13.4,2.8,.12),(12.9,2.2,.37),(12.5,1.8,.62)]):Bk.append(bx('marble2',(0,y,.5-i*.2),(w,.26,d)))
Bk+=[bx('marble',(0,4.35,-4.2),(12,8.7,6.6)),bx('marble2',(0,.15,-4.2),(12.4,.3,6.9))]
Bk+=[bx('marble2',(0,8.15,-.6),(12.8,.55,1.9)),bx('marble',(0,8.65,-.6),(12.9,.25,2.0))]
Bk.append(plate('marble',[(-6.3,8.8),(6.3,8.8),(0,10.7)],.15,1.3))
Bk.append(plate('marble2',[(-5.3,9.0),(5.3,9.0),(0,10.25)],.18,1.2))
for k in range(9):Bk.append(bx('marble2',(-6.2+k*1.55,8.55,.4),(.4,.2,.25)))
for i in range(6):
    x=-5+i*2
    Bk+=[bx('marble2',(x,.45,-.3),(1.0,.3,1.0)),cylv('marble',x,4.0,-.3,.42,7.0,16),bx('marble2',(x,7.55,-.3),(1.1,.28,1.1)),bx('marble',(x,7.8,-.3),(1.25,.14,1.25))]
    for s in(-1,1):Bk+=[ell('marble',(x+s*.4,7.6,-.3),(.15,.15,.2),8)]
    for k in range(6):
        a=k/6*math.pi*2+.3;Bk.append(rod('marble2',(x+math.cos(a)*.41,.8,-.3+math.sin(a)*.41),(x+math.cos(a)*.41,7.3,-.3+math.sin(a)*.41),.025,4))
for sx in(-1,1):Bk+=[bx('bronze',(sx*1.35,2.1,-.74),(.3,4.2,.5)),bx('marble2',(sx*1.8,2.1,-.8),(.7,4.4,.3))]
Bk+=[bx('bronze',(0,4.35,-.74),(3.0,.35,.55)),bx('marble2',(0,4.7,-.76),(3.8,.3,.4))]
Bk+=[bx('bronze',(sx,.3,.3),(.5,.6,.5)) for sx in(-7,7)]
for sx in(-7,7):Bk+=[ell('bronze',(sx,.85,.3),(.3,.3,.3),10)] 
for sx in(-3.9,3.9):
    Bk+=[bx('marble2',(sx,3.0,-.85),(1.5,2.4,.1)),bx('glass',(sx,3.0,-.78),(1.1,2.0,.04)),bx('bronze',(sx,3.0,-.74),(1.2,.06,.04)),bx('bronze',(sx,3.0,-.74),(.06,2.1,.04))]
join(Bk,'bank')
# ===== BIODOME (ribs + base + airlock + solar) =====
Dm=[]
cz=-5
Dm+=[cylv('conc',0,.35,cz,6.4,.7,40),cylv('steel',0,.75,cz,6.15,.14,40)]
for k in range(12):
    a=k/12*math.pi*2
    pts=[(6.05*math.cos(ph)*math.cos(a),.6+10.05*math.sin(ph),cz+6.05*math.cos(ph)*math.sin(a)) for ph in(0,.2,.4,.6,.8,1.0,1.2,1.4,1.52)]
    for i in range(8):Dm+=rod('domeribs',pts[i],pts[i+1],.07,4)
for hh in(.25,.5,.75,1.0,1.25):
    rr=6.05*math.cos(hh);Dm+=ring('domeribs',0,.6+10.05*math.sin(hh),cz,rr,.05,28)
Dm+=[ell('steel',(0,10.65,cz),(.5,.5,.5),10),frus('steel',g(0,11.1,cz),.08,.03,1.2,seg=6)]
# airlock
Dm+=[cylh('white',(0,1.9,1.6),1.45,3.4,'z',20),cylh('steel',(0,1.9,3.3),1.55,.2,'z',20),bx('glowwin',(0,1.7,3.42),(1.5,2.2,.04)),bx('steel',(0,.15,2.3),(3.4,.3,4.0)),bx('conc2',(0,.1,4.3),(4.4,.2,1.8))]
Dm+=[bx('steel',(-1.55,2.0,3.35),(.14,3.2,.2)),bx('steel',(1.55,2.0,3.35),(.14,3.2,.2))]
for sx in(-1,1):Dm+=[cylv('steel',sx*2.3,1.3,3.0,.08,2.6,6),ell('glowlamp',(sx*2.3,2.7,3.0),(.2,.2,.2),8)]
# solar arrays
for sx in(-1,1):
    for k in range(4):
        x=sx*(8.6+k*1.8)
        Dm+=[bx('solar',(x,1.6,-3.2),(1.6,.06,2.2),0,(math.radians(-28),0,0)),bx('steel',(x,.8,-3.1),(.08,1.6,.08)),bx('steel',(x,.55,-4.0),(.08,1.1,.08))]
# tanks + pipes + mast
Dm+=[cylv('white',8.8,2.2,-9.0,1.1,4.4,18),ell('white',(8.8,4.4,-9.0),(1.1,.6,1.1),14),cylv('white',11.0,1.8,-9.0,.9,3.6,18),ell('white',(11.0,3.6,-9.0),(.9,.5,.9),14)]
Dm+=[cylh('steel',(6.5,.7,-8.0),.12,5,'x',8),rod('steel',(6.5,.7,-8.0),(6.5,.3,-6.5),.12,6),rod('steel',(-7.0,3.0,-8),(-7.0,10,-8),.08,6),ell('glowlamp',(-7.0,10.2,-8),(.2,.2,.2),8)]
join(Dm,'dome')
