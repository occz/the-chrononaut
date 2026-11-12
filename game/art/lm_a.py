MM([('stone','#e0c080',1,0),('stone2','#d0b070',1,0),('stone3','#c4a460',1,0),('sand','#d8bc78',1,0),('wood','#8a6a42',.9,0),('wood2','#5a4028',.95,0),('rope','#b89a5a',1,0),
 ('rock','#6a625a',1,0),('rock2','#7a7268',1,0),('snow','#f4f8ff',.7,0),('dark','#040302',1,0),('wall','#c8a070',1,0),('paint','#c8421a',.8,0),('ivory','#e8dcb8',.5,0),('bone','#d8ccae',.7,0),('hide','#8a5a38',.95,0),('ember','#5a5650',1,0),('log','#4a3220',.95,0),
 ('earth','#5a4430',1,0),('earth2','#6a5238',1,0),('stonegrey','#7a7468',1,0),('fern','#3f8a3a',.85,0),('fern2','#5aa044',.85,0),('trunk','#6a5238',.95,0),('shell','#efe6cc',.7,0),('fur','#8a7a68',.9,0),('furd','#5e5246',.9,0),('nose','#c8908a',.6,0),('eye','#0a0806',.3,0),('gold','#d8a830',.25,.9)])
R=random.Random(11)
# ===== PYRAMID BACKGROUND (Khafre-style: stripped core below, casing above), base 60 h 44 =====
P=[]
B=60;Hh=44;N=16;ch=24/N
for i in range(N):
    y0=i*ch;wt=B*(1-(y0+ch)/Hh)+.4
    P.append(box(['stone2','stone3','stone'][i%3],g(0,y0+ch/2,0),(wt,ch,wt),0,0))
cw=B*(1-24/Hh)
P.append(pyr4('stone',0,0,24,cw+.2,cw+.2,Hh-24,3.2,3.2))
# casing joint bands
for k in range(1,5):
    y=24+k*3.6;w=B*(1-y/Hh)
    P.append(box('stone3',g(0,y,0),(w+.1,.12,w+.1),0))
join(P,'pyrbg')
# ===== PYRSITE: unfinished stepped pyramid 15x13 h7.2 + ramp + blocks =====
P=[]
N=12;ch=7.2/N
for i in range(N):
    f0=i/N;w=15-(15-2.6)*(i+1)/N;d=13-(13-2.4)*(i+1)/N
    P.append(box(['stone','stone2','stone3'][i%3],g(0,i*ch+ch/2,-5),(w,ch,d),.04))
    # block joints (vertical seams) along front
    nb=max(2,int(w/1.4))
    for k in range(1,nb):
        P.append(box('stone3',g(-w/2+k*w/nb+(.3 if i%2 else -.3),i*ch+ch/2,-5+d/2+.01),(.05,ch*.95,.04),0))
# smooth casing wedge on right-front corner (partially finished)
P.append(pyr4('stone',3.2,-3.2,0,4.2,3.6,4.8,.3,.3))
# capstone platform
P.append(box('stone2',g(0,7.3,-5),(2.8,.2,2.6),.03))
# wooden ramp (zigzag scaffold) left side
for i in range(7):
    P.append(box('wood',g(-8.7+i*.12,.35+i*1.0,-.3-i*.5),(1.6,.12,1.1),.01))
    for sx in(-1,1):P.append(box('wood2',g(-8.7+i*.12+sx*.7,(.35+i*1.0)/2,-.3-i*.5),(.14,.35+i*1.0,.14),0))
for sx in(-1,1):P.append(rod('wood2',(-9.5+sx*.0,.2,.6+sx*.0),(-8.0,7.4,-3.6),.12))
P.append(rod('rope',(-9.4,.5,.4),(-7.9,7.6,-3.5),.05))
# sled with block + rollers
P.append(box('stone2',g(-6.8,.95,1.6),(1.6,.9,1.3),.04));P.append(box('wood2',g(-6.8,.38,1.6),(2.2,.15,1.5),.02))
for k in range(3):P.append(cylh('wood',(-7.5+k*.7,.15,1.6),.12,1.6,'z',8))
P.append(rod('rope',(-5.9,.5,1.6),(-3.9,.2,2.3),.05))
# construction blocks pile + cut blocks right
for x,z,w,h,d in[(5,-.6,1.3,.9,1.1),(6.4,-.4,1.2,.9,1.0),(7.6,-.8,1.3,.9,1.1),(5.7,-.5,1.1,.8,1.0),(6.9,-.6,1.2,.8,1.0)]:
    yy=.45 if x!=5.7 and x!=6.9 else 1.3
    P.append(box(['stone','stone2'][int(x*3)%2],g(x,yy,z),(w,h,d),.05))
# mallet + chisels, water jar
P.append(cyl2('mud' if False else 'wood',(3.2,.5,1.7),.28,.22,.8) if False else cylv('sand',3.2,.5,1.7,.32,1.0,12))
P.append(rod('wood2',(4.3,.2,1.9),(4.8,.2,2.5),.04))
join(P,'pyrsite')
# ===== ICE AGE CAVE =====
C=[]
C+=[rock('rock',(0,5.2,-4.6),(12.5,7.4,7.6),1,.18,2),rock('rock2',(-5,2.6,-2.9),(5.6,5.4,5.2),2,.2),rock('rock',(5.4,2.3,-2.8),(5,4.8,4.8),3,.2),
    rock('rock2',(-2.9,4.9,-2.3),(4,3.8,3.6),4,.2),rock('rock2',(3.2,4.7,-2.2),(4.2,3.6,3.6),5,.2),rock('rock',(0,4.4,-1.7),(6.0,1.9,2.6),6,.14),
    rock('rock',(-2.7,1.8,-1.4),(2.0,3.8,2.4),7,.16),rock('rock2',(2.7,1.8,-1.4),(2.0,3.8,2.4),8,.16),
    rock('rock2',(-7.6,.9,-.8),(2.6,1.8,2.2),9,.22),rock('rock',(7.8,.8,-.6),(2.4,1.6,2.0),10,.22),rock('rock2',(-8,.5,-4),(3,1.2,3),12),rock('rock',(-0.5,7.2,-6),(7,4,4),13,.2)]
C.append(box('dark',g(0,1.7,-3.2),(3.4,3.4,3.4),0))
C.append(box('wall',g(0,1.75,-1.6),(3.4,3.0,.2),.02))
for i in range(3):C.append(rock('rock2',(-1.4+i*1.4,.12,.3-i%2*.2),(1.2,.3,.9),20+i,.25,1))
# cave painting: mammoth + hunters
def pt(x,y,rx,ry):C.append(ell('paint',(x,y,-1.47),(rx,ry,.03),10))
pt(-.55,2.05,.62,.34);pt(-.82,2.38,.3,.24);pt(.08,2.05,.3,.3);pt(.18,2.34,.2,.17)
for lx in(-.9,-.55,-.1,.15):C.append(rod('paint',(lx,1.85,-1.47),(lx+.02,1.25,-1.47),.05,6))
C.append(rod('paint',(.25,2.3,-1.47),(.48,2.0,-1.47),.05,6));C.append(rod('paint',(.4,2.17,-1.47),(.62,1.85,-1.47),.04,6))
C.append(rod('paint',(-.1,2.55,-1.47),(-.3,2.75,-1.47),.03,6))
for hx,hy in[(-1.35,1.3),(-1.05,1.0),(.9,1.55),(1.25,1.2)]:
    C+=[rod('paint',(hx,hy,-1.47),(hx,hy+.4,-1.47),.035,6),rod('paint',(hx-.12,hy-.3,-1.47),(hx,hy,-1.47),.03,6),rod('paint',(hx+.12,hy-.3,-1.47),(hx,hy,-1.47),.03,6),
        rod('paint',(hx,hy+.35,-1.47),(hx+.35,hy+.9,-1.47),.025,6),ell('paint',(hx,hy+.47,-1.47),(.07,.07,.03),8)]
for hx,hy in[(-1.4,2.45),(-1.15,2.65),(1.2,2.5),(1.1,2.2)]:   # hand prints
    C+=[ell('paint',(hx,hy,-1.47),(.11,.13,.03),8)]+[rod('paint',(hx+(k-1.5)*.05,hy+.1,-1.47),(hx+(k-1.5)*.07,hy+.27,-1.47),.018,5) for k in range(4)]
# tusk arch (mammoth)
for s in(-1,1):
    pts=[(s*2.9,0,.4),(s*3.35,1.5,.6),(s*3.1,3.0,.7),(s*2.3,4.3,.8),(s*1.2,4.9,.9),(s*.2,4.85,.9)]
    C+=chain('ivory',pts,[.26,.23,.19,.14,.09,.03])
# snow
C+=[rock('snow',(0,8.6,-4.8),(8.4,1.5,5.6),30,.15),rock('snow',(-5.1,5.1,-2.9),(3.8,1.0,3.6),31),rock('snow',(5.4,4.4,-2.8),(3.4,.9,3.4),32),rock('snow',(-3,6.7,-2.4),(2.6,.8,2.4),33),rock('snow',(3.2,6.5,-2.4),(2.8,.8,2.4),34),
    rock('snow',(-8.4,.35,.8),(3.4,.7,2.6),35),rock('snow',(8.6,.3,1.0),(3.0,.6,2.4),36),rock('snow',(-1.8,.1,1.6),(3.6,.25,1.8),37,.1)]
# firepit stones + logs
for a in range(7):
    ang=a/7*math.pi*2;C.append(rock('ember',(-3.4+math.cos(ang)*.85,.2,.9+math.sin(ang)*.85),(.5,.38,.5),40+a,.25,1))
for k in range(3):
    a=k*2.1;C.append(rod('log',(-3.4+math.cos(a)*.7,.2,.9+math.sin(a)*.7),(-3.4-math.cos(a)*.7,.32,.9-math.sin(a)*.7),.09,7))
# hide drying rack
for x in(3.3,5.1):C.append(rod('wood2',(x,0,1.7),(x,2.5,1.7),.07));C.append(rod('wood2',(x,2.1,1.7),(x+.35*(1 if x>4 else -1),2.7,1.7),.05))
C.append(rod('wood',(3.3,2.45,1.7),(5.1,2.45,1.7),.06))
C.append(box('hide',g(4.2,1.7,1.72),(1.6,1.5,.04),.01))
C.append(rod('hide',(3.45,.9,1.74),(3.5,.55,1.74),.03));C.append(rod('hide',(4.9,.9,1.74),(4.95,.6,1.74),.03))
# spear, bone pile
C.append(rod('wood',(2.2,0,2.4),(2.9,3.0,2.2),.04));C.append(spike('rock2',(2.9,3.0,2.2),.07,.4))
for k in range(5):C.append(rod('bone',(5.6+k*.12,.12,2.2-k*.1),(6.4-k*.1,.12,2.8-k*.18),.05,6))
C.append(ell('bone',(6.1,.2,2.5),(.2,.2,.2),8))
join(C,'cave')
# ===== BURROW (dinosaur era) =====
U=[rock('earth',(0,.2,-3.4),(10.4,5.4,7.4),1,.12,2),rock('earth2',(-3.2,-.2,-2.3),(4.2,3.0,3.6),2,.2),rock('earth2',(3.4,-.2,-2.3),(4.4,2.8,3.4),3,.2),rock('earth',(0,.5,-6.2),(6,3.6,3.4),4,.2)]
U.append(ell('dark',(0,1.25,.05),(1.75,1.3,.6),16))
# rim of excavated earth
for k in range(9):
    a=math.pi*(k/8);U.append(rock('earth2',(math.cos(a)*2.0,1.0+math.sin(a)*1.5,.12),(.85,.8,.85),50+k,.3,1))
for s in(-1,1):U.append(rock('earth',(s*2.0,.15,.35),(1.6,.45,1.2),60+(s>0),.25,1))
# roots dangling at entrance
for k in range(6):
    x=-1.5+k*.6;U.append(rod('trunk',(x,2.75+0.1*(k%2),.2),(x+.15*((k%3)-1),2.0-0.3*(k%2),.3),.04,5))
# flat stones
for x,s2 in[(-3.8,1.5),(3.5,1.3),(-2.3,.9),(4.6,.8)]:U.append(rock('stonegrey',(x,.4,-.3),(s2,s2*.75,s2),70+int(x*3),.28,2))
# dino footprint (3 toes) + egg shell bits
for ang,L in((0,1.6),(.55,1.4),(-.55,1.4)):
    U.append(rod('earth2',(-6.2,.06,1.6),(-6.2+math.sin(ang)*L,.06,1.6+math.cos(ang)*L),.28,7))
U.append(ell('earth',(-6.2,.08,1.4),(.65,.7,.14),10))
for x,z,r in[(1.8,1.8,.34),(2.5,2.1,.26),(3.2,1.6,.3)]:
    U.append(ell('shell',(x,.12,z),(r,r*.8,r*.45),10))
# ferns + cycads + horsetails
def blade(mat,x,y,z,a,L,wmax,droop=.5,rise=1.0,n=7):
    sx,sz=-math.sin(a),math.cos(a);rows=[]
    for i in range(n):
        t=i/(n-1);d=t*L;h=y+rise*math.sin(t*math.pi*.8)-droop*t*t*1.2
        w=wmax*(math.sin(min(t*1.1,1)*math.pi)**.6+.04)
        px,pz=x+math.cos(a)*d,z+math.sin(a)*d
        rows.append([g(px-sx*w,h,pz-sz*w),g(px+sx*w,h,pz+sz*w)])
    return strip(mat,rows,True,.012)
def pchain(mat,pts,rs):
    o=[]
    for i in range(len(pts)-1):o+=seg(mat,pts[i],pts[i+1],rs[i],rs[i+1],False,5)
    return o
def fern(x,z,s,n=9,mat='fern'):
    return [blade('fern' if k%2 else 'fern2',x,.1,z,k/n*math.pi*2+x,1.9*s,.22*s,.7*s,.85*s) for k in range(n)]
for x,z,s in[(-5.0,-.2,1.0),(-4.3,.5,.8),(-5.6,-.8,.9),(5.0,-.6,1.0),(5.9,.1,.8),(7.0,-.8,.9)]:U+=fern(x,z,s)
def cycad(x,z,s):
    out=chain('trunk',[(x,0,z),(x+.05,.7*s,z),(x,1.4*s,z)],[.3*s,.26*s,.22*s])
    for k in range(11):
        out.append(blade('fern' if k%2 else 'fern2',x,1.4*s,z,k/11*math.pi*2,2.2*s,.2*s,1.0*s,.9*s))
    return out
U+=cycad(-6.8,-2.2,1.1)+cycad(7.2,-2.6,1.3)
for x,z in[(-3.6,1.8),(-3.2,2.1),(-2.9,1.6),(4.0,2.3)]:
    for k in range(3):
        h=1.6+k*.5;ox=x+k*.12
        U.append(rod('fern2',(ox,0,z),(ox,h,z),.035,6))
        for j in range(1,5):U.append(frus('fern',g(ox,h*j/5,z),.2-.02*j,.01,.1,seg=6))
join(U,'burrow')
# ===== SHREW (local coords, nose toward +x) =====
S_=[ell('fur',(0,.17,0),(.27,.17,.15),12),ell('fur',(.26,.2,0),(.13,.11,.1),10),ell('furd',(0,.28,0),(.2,.07,.1),8),
    frus('nose',g(.5,.2,0)+Vector((0,0,0)),.05,.01,.22,seg=8,rot=(0,math.pi/2,0)),ell('nose',(.56,.2,0),(.025,.025,.025),6),
    ell('eye',(.36,.25,.07),(.025,.025,.025),6),ell('eye',(.36,.25,-.07),(.025,.025,.025),6),ell('fur',(.22,.3,.06),(.05,.03,.04),6),ell('fur',(.22,.3,-.06),(.05,.03,.04),6)]
S_+=chain('nose',[(-.24,.14,0),(-.45,.1,.04),(-.65,.05,.12),(-.8,.04,.2)],[.025,.02,.015,.008])
for x,z in[(.12,.08),(.12,-.08),(-.14,.09),(-.14,-.09)]:S_.append(rod('furd',(x,.1,z),(x+.03,0,z),.025,6))
for sgn in(-1,1):S_.append(rod('nose',(.52,.2,sgn*.015),(.62,.22,sgn*.12),.006,4));S_.append(rod('nose',(.52,.2,sgn*.015),(.64,.18,sgn*.1),.006,4))
join(S_,'shrew')
