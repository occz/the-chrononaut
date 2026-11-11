import math
src=open('kit.py').read().split('# ---- LEG')[0]
exec(src)
for n,c,r in[('skin','#6a8f4a',.85),('belly','#d8cfa0',.9),('horn','#efe6cc',.5),('frill','#8a5a3a',.85),('dark','#46583a',.95),('tooth','#f4f0e0',.4),('eye','#111111',.3)]:M(n,H(c),r,0)
g=lambda x,y,z:Vector((x,-z,y))
def S(mat,pos,r):return sph(mat,g(*pos),(r[0],r[2],r[1]))
def seg(mat,p0,p1,r0,r1,joints=True,n=14):
    a=g(*p0);b=g(*p1);d=b-a;mid=(a+b)/2
    bpy.ops.mesh.primitive_cone_add(vertices=n,radius1=r0,radius2=r1,depth=d.length,location=mid,rotation=d.to_track_quat('Z','Y').to_euler())
    o=bpy.context.object;out=[fin(o,mat,0)]
    if joints:
        out.append(sph(mat,a,(r0,r0,r0),16))
        if r1>.03:out.append(sph(mat,b,(r1,r1,r1),16))
    return out
def chain(mat,pts,rs):
    o=[]
    for i in range(len(pts)-1):o+=seg(mat,pts[i],pts[i+1],rs[i],rs[i+1])
    return o
def spike(mat,pos,r,h,rot=(0,0,0)):return frus(mat,g(*pos)+Vector((0,0,h/2)),r,0,h,seg=8,rot=rot)
def fl(*xs):
    r=[]
    for x in xs:r+=x if isinstance(x,list) else [x]
    return r
# ===== SAUROPOD (big scenery dino) =====
b=[S('skin',(0,3.3,0),(2.6,1.15,1.15)),S('belly',(.1,2.85,0),(2.3,.75,.95)),S('skin',(1.6,3.0,0),(1.2,1.2,1.2)),S('skin',(-1.4,3.1,0),(1.3,1.1,1.15))]
b+=chain('skin',[(-2.4,3.2,0),(-4,2.9,0),(-6,2.4,0),(-8.4,1.8,0)],[1.0,.72,.4,.04])
for i in range(7):b.append(spike('dark',(-1.8+i*.6,4.2-abs(i-3)*.02,0),.14,.45))
join(b,'sauro_body')
n=chain('skin',[(0,0,0),(1.0,1.5,0),(2.0,2.5,0),(3.0,3.05,0)],[.65,.52,.4,.3])
n+=[S('skin',(3.4,3.2,0),(.68,.36,.38)),S('belly',(3.5,3.02,0),(.55,.14,.3))]+[S('eye',(3.55,3.36,s*.33),(.09,.09,.09)) for s in(-1,1)]
join(n,'sauro_neck')
l=seg('dark',(0,0,0),(0,-1.85,0),.52,.4)+[S('dark',(.15,-2.05,0),(.66,.3,.52))]+[spike('horn',(.7,-2.2,s*.26),.09,.2,(0,math.radians(90),0)) for s in(-1,0,1)]
join(l,'sauro_leg')
# ===== SMALL DINO =====
b=[S('skin',(0,1.9,0),(1.35,.62,.52)),S('belly',(.05,1.68,0),(1.2,.4,.45))]
b+=chain('skin',[(-1.2,1.95,0),(-2.6,1.8,0),(-4.0,1.5,0)],[.45,.3,.04])
b+=seg('skin',(.9,1.6,.3),(1.1,1.2,.3),.08,.04)+seg('skin',(.9,1.6,-.3),(1.1,1.2,-.3),.08,.04)
for i in range(5):b.append(spike('dark',(-.8+i*.45,2.45,0),.1,.3))
join(b,'dino_body')
n=chain('skin',[(0,0,0),(.3,.7,0),(.7,1.0,0)],[.3,.22,.2])+[S('skin',(1.0,1.1,0),(.52,.28,.29)),S('belly',(1.05,.95,0),(.4,.1,.22))]+[S('eye',(1.12,1.2,s*.27),(.07,.07,.07)) for s in(-1,1)]
join(n,'dino_neck')
l=seg('dark',(0,0,0),(.12,-.7,0),.26,.17)+seg('dark',(.12,-.7,0),(-.02,-1.25,0),.17,.1)+[S('dark',(.1,-1.38,0),(.32,.1,.22))]+[spike('horn',(.38,-1.42,s*.1),.04,.14,(0,math.radians(90),0)) for s in(-1,0,1)]
join(l,'dino_leg')
# ===== MAMMOTH =====
b=[S('skin',(0,2.4,0),(2.0,1.5,1.3)),S('skin',(2.1,2.8,0),(1.15,1.25,1.05)),S('skin',(.2,3.8,0),(1.0,.7,.95))]
import random;random.seed(4)
for i in range(18):
    a=i/18*math.pi*2;x=math.cos(a)*1.9;z=math.sin(a)*1.15
    b.append(frus('dark',g(x,1.65,z)+Vector((0,0,0)),.34,.05,1.0,seg=7,rot=(math.pi,0,0)))
b+=chain('skin',[(2.8,2.6,0),(3.2,1.8,0),(3.45,.9,0),(3.4,.35,0)],[.55,.4,.26,.16])
for s in(-1,1):
    b+=chain('tusk' if False else 'horn',[(2.7,2.0,s*.6),(3.5,1.4,s*.75),(4.4,1.2,s*.7),(5.0,1.7,s*.55)],[.15,.12,.08,.02])
    b.append(S('skin',(1.9,2.9,s*1.0),(.35,.6,.12)));b.append(S('eye',(2.8,3.05,s*.6),(.09,.09,.09)))
b+=chain('dark',[(-1.9,2.8,0),(-2.3,2.2,0),(-2.4,1.5,0)],[.2,.15,.1])
join(b,'mam_body')
l=seg('skin',(0,0,0),(0,-1.2,0),.45,.4)+[frus('dark',g(0,-1.15,0),.5,.55,.4,seg=10),S('dark',(0,-1.3,.05),(.58,.1,.6))]
join(l,'mam_leg')
# ===== RAPTOR (NPC) =====
b=[S('skin',(0,.05,.05),(.3,.33,.62)),S('belly',(0,-.13,.1),(.24,.15,.55))]
b+=chain('skin',[(0,.2,.45),(0,.45,.6),(0,.55,.68)],[.2,.15,.13])
b+=chain('skin',[(0,.1,-.5),(0,.08,-1.2),(0,-.05,-2.0),(0,-.12,-2.6)],[.27,.17,.07,.02])
for i in range(6):b.append(spike('dark',(0,.32-i*.03,.35-i*.28),.045,.15))
for s in(-1,1):b+=seg('skin',(s*.22,-.02,.5),(s*.24,-.2,.62),.05,.025)
join(b,'rap_torso')
h=[S('skin',(0,0,.15),(.16,.15,.3)),S('skin',(0,-.02,.42),(.11,.1,.2)),S('belly',(0,-.1,.32),(.09,.045,.24))]+[spike('tooth',(s*.06,-.08,.3+k*.1),.015,.05,(math.pi,0,0)) for s in(-1,1) for k in range(3)]
join(h,'rap_head')
l=seg('dark',(0,0,0),(0,-.3,.12),.14,.1)+seg('dark',(0,-.3,.12),(0,-.58,-.02),.1,.06)+seg('dark',(0,-.58,-.02),(0,-.72,.08),.06,.05)+[S('dark',(0,-.75,.16),(.07,.04,.17))]+[spike('horn',(s*.04,-.76,.3),.02,.08,(math.radians(90),0,0)) for s in(-1,0,1)]
l.append(frus('horn',g(0,-.62,.22),.035,0,.14,seg=8,rot=(math.radians(35),0,0)))
join(l,'rap_leg')
# ===== TRICERATOPS (NPC) =====
b=[S('skin',(0,.1,0),(.5,.42,.85)),S('belly',(0,-.12,0),(.42,.2,.78)),S('skin',(0,.28,.4),(.45,.3,.4))]
b+=chain('skin',[(0,.05,-.8),(0,0,-1.6),(0,-.1,-2.3)],[.3,.15,.03])
join(b,'tri_torso')
h=[S('skin',(0,0,.2),(.28,.25,.38)),S('horn',(0,-.05,.58),(.08,.1,.14))]+seg('horn',(0,.1,.55),(0,.3,.72),.07,.01)
for s in(-1,1):h+=seg('horn',(s*.18,.22,.3),(s*.24,.66,.52),.07,.012)
h.append(S('frill',(0,.32,-.1),(.56,.52,.07)))
for i in range(9):
    a=math.pi*(.1+.8*i/8);h.append(S('horn',(math.cos(a)*.56,.32+math.sin(a)*.52,-.1),(.05,.05,.05)))
join(h,'tri_head')
l=seg('skin',(0,0,0),(0,-.55,0),.17,.13)+[S('dark',(0,-.64,.05),(.18,.09,.21))]+[spike('horn',(s*.08,-.68,.24),.04,.1,(math.radians(90),0,0)) for s in(-1,0,1)]
join(l,'tri_leg')
bpy.ops.export_scene.gltf(filepath='creatures.glb',export_format='GLB',export_yup=True)
print('OK',[(o.name,len(o.data.vertices)) for o in bpy.data.objects])
