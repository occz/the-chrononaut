import math,random
exec(open('kit.py').read().split('# ---- LEG')[0])
c2=open('creatures.py').read();exec(c2[c2.index("for n,c,r in[('skin'"):c2.index("# ===== SAUROPOD")])
_box=box
def box(mat,loc,size,bevel=.02,sub=0,rot=(0,0,0)):return _box(mat,loc,(size[0],size[2],size[1]),bevel,sub,rot)
for n,c,r,m in[('marble','#f0e8d8',.6,0),('marble2','#d8cfb8',.8,0),('mud','#c8a46c',1,0),('mud2','#b89458',1,0),('wood','#6a4a2a',.85,0),('wood2','#4a3220',.9,0),('thatch','#7a8a3a',1,0),('trunk','#7a5a3a',.9,0),('frond','#4a8a3a',.8,0),('needle','#2f5a3a',.95,0),('snow','#f4f8ff',.7,0),('gold','#c89a4a',.4,.8),('fire','#ff9a2a',.5,0),('sail','#f0e8d8',.9,0),('red','#c83a2a',.8,0),('cream','#f0e8d8',.8,0),('blue','#3a5a8a',.8,0),('yellow','#e8c84a',.8,0),('dark','#14100c',1,0),('iron','#3a3a42',.5,.7)]:M(n,H(c),r,m)
def strip(mat,rows,double=True,thick=0):
    me=bpy.data.meshes.new('s');bm=bmesh.new();vs=[[bm.verts.new(p) for p in row] for row in rows]
    for i in range(len(vs)-1):
        for j in range(len(vs[i])-1):
            try:bm.faces.new((vs[i][j],vs[i][j+1],vs[i+1][j+1],vs[i+1][j]))
            except ValueError:pass
    bm.to_mesh(me);bm.free();o=bpy.data.objects.new('s',me);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True)
    if thick:
        sd=o.modifiers.new('sol','SOLIDIFY');sd.thickness=thick
    me.materials.append(M(mat,0));bpy.ops.object.convert(target='MESH')
    try:bpy.ops.object.shade_auto_smooth(angle=math.radians(60))
    except Exception:bpy.ops.object.shade_smooth()
    o.select_set(False);return o
def cutter(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();return bpy.context.object
def cut(o,cu):
    md=o.modifiers.new('b','BOOLEAN');md.operation='DIFFERENCE';md.object=cu;md.solver='EXACT'
    bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH');bpy.data.objects.remove(cu)
# ===== ROMAN COLUMN (height 6) & ENTABLATURE =====
c=[box('marble2',g(0,.12,0),(1.3,.24,1.3),.03),box('marble',g(0,.34,0),(1.05,.2,1.05),.03),frus('marble',g(0,.5,0),.5,.5,.12,seg=20),
   frus('marble',g(0,2.9,0),.46,.37,5.0,seg=24),frus('marble',g(0,5.4,0),.4,.4,.12,seg=20),box('marble2',g(0,5.62,0),(1.0,.2,1.0),.03),box('marble',g(0,5.88,0),(1.35,.22,1.2),.03)]
for s in(-1,1):c+=[sph('marble',g(s*.52,5.5,0),(.17,.17,.17)),frus('marble',g(s*.52,5.5,0),.17,.17,1.1,seg=14,rot=(math.pi/2,0,0))]
for i in range(12):
    a=i/12*math.pi*2;c.append(frus('marble2',g(math.cos(a)*.42,2.9,math.sin(a)*.42),.03,.03,4.8,seg=6))
join(c,'column')
e=[box('marble2',g(0,.3,0),(4.8,.6,1.3),.04),box('marble',g(0,.72,0),(4.9,.24,1.4),.03),box('marble',g(0,.98,0),(5.0,.2,1.5),.03)]
for i in range(20):e.append(box('marble2',g(-2.3+i*.24,.55,.68),(.1,.14,.08),0))
join(e,'entab')
# ===== PALM =====
random.seed(7)
p=chain('trunk',[(0,0,0),(.2,1.6,0),(.5,3.2,0),(.4,4.6,0)],[.22,.17,.14,.12])
for i in range(9):p.append(frus('wood2',g(.15+i*.03+(.35 if i>5 else 0)*0,.4+i*.45,0),.19-i*.008,.19-i*.008,.05,seg=10))
for k in range(9):
    a=k/9*math.pi*2;L=2.4+random.random()*.4;pts=[];ws=[.0,.14,.3,.26,.14,.01]
    pts=[]
    for t in [0,.2,.45,.7,.88,1.0]:
        d=t*L;h=.55*math.sin(t*math.pi*.9)-t*t*1.1
        pts.append((.4+math.cos(a)*d,4.6+h,math.sin(a)*d))
    rows=[]
    for q,w in zip(pts,ws):
        sx,sz=-math.sin(a),math.cos(a);rows.append([g(q[0]-sx*w,q[1],q[2]-sz*w),g(q[0],q[1]+.03,q[2]),g(q[0]+sx*w,q[1],q[2]+sz*w)])
    p.append(strip('frond',rows,True,.01))
p+=[sph('wood2',g(.4+math.cos(a)*.18,4.45,math.sin(a)*.18),(.12,.12,.12)) for a in(0,2.1,4.2)]
join(p,'palm')
# ===== PINE =====
t=seg('trunk',(0,0,0),(0,1.4,0),.18,.12)
tiers=[(1.05,1.9,1.6),(1.6,1.7,2.0),(2.2,1.45,2.4),(2.9,1.15,2.5),(3.6,.8,2.3)]
for y,r,h in tiers[::-1]:
    t.append(frus('needle',g(0,y+h/2-.2,0),r,.03,h,seg=12));t.append(frus('snow',g(0,y+h*.62-.2,0),r*.62,.03,h*.62,seg=12))
join(t,'pine')
# ===== EGYPTIAN MUD HOUSE (4 x 3, h 2.3) =====
m=[box('mud',g(0,1.1,0),(4,2.2,3),.12,1),box('mud2',g(0,2.3,0),(4.2,.2,3.2),.05)]
for sx in(-1,1):m.append(box('mud2',g(sx*2.0,2.55,0),(.2,.4,3.2),.05))
m+=[box('mud2',g(0,2.55,1.5),(4.2,.4,.2),.05),box('mud2',g(0,2.55,-1.5),(4.2,.4,.2),.05),box('dark',g(0,.8,1.52),(.9,1.6,.08),.01),box('wood',g(0,1.7,1.58),(1.3,.14,.2),.02),box('mud2',g(0,.04,1.7),(1.4,.1,.5),.02)]
for sx in(-1,1):m+=[box('dark',g(sx*1.3,1.5,1.52),(.4,.5,.06),.01),box('wood',g(sx*1.3,1.8,1.55),(.55,.07,.1),.01)]
for i in range(5):m.append(frus('wood2',g(-1.6+i*.8,2.05,1.65),.09,.09,.6,seg=8,rot=(math.pi/2,0,0)))
m+=[frus('mud2',g(1.3,2.7,.3),.3,.22,.5,seg=12),sph('mud2',g(1.3,3.0,.3),(.3,.3,.18)),box('red',g(-.9,2.45,-.2),(1.0,.04,.8),0),box('cream',g(-.9,2.46,-.2),(.12,.04,.8),0)]
join(m,'mudhut')
# ===== VIKING LONGHOUSE (8 x 4.2, wall 2.2) =====
v=[]
for i in range(32):v.append(box('wood' if i%2 else 'wood2',g(-3.95+i*.255,1.1,2.1),(.25,2.2,.08),.01))
v+=[box('wood2',g(0,1.1,0),(8,2.2,4.1),.03),box('dark',g(0,.9,2.14),(1.0,1.8,.06),.01),box('wood2',g(0,1.9,2.16),(1.3,.18,.12),.02),box('iron',g(0,1.1,2.18),(.05,1.7,.04),0),box('iron',g(-.3,1.3,2.18),(.5,.05,.04),0),box('iron',g(.3,.9,2.18),(.5,.05,.04),0)]
bpy.ops.object.select_all(action='DESELECT')
# sloped roof as prism via bmesh
bm=bmesh.new();vs=[bm.verts.new(p) for p in [g(-4.3,2.2,2.6),g(4.3,2.2,2.6),g(4.3,2.2,-2.6),g(-4.3,2.2,-2.6),g(-4.3,3.9,0),g(4.3,3.9,0)]]
for f in[(0,1,5,4),(2,3,4,5),(0,4,3),(1,2,5),(0,1,2,3)]:
    try:bm.faces.new([vs[i] for i in f])
    except ValueError:pass
me=bpy.data.meshes.new('roof');bm.to_mesh(me);bm.free();ro=bpy.data.objects.new('roof',me);bpy.context.collection.objects.link(ro);me.materials.append(M('thatch',0))
bpy.context.view_layer.objects.active=ro;ro.select_set(True);sd=ro.modifiers.new('sol','SOLIDIFY');sd.thickness=.12;bpy.ops.object.convert(target='MESH');ro.select_set(False)
v.append(ro)
v+=[box('wood2',g(0,3.95,0),(8.9,.14,.14),.03)]
for sx in(-1,1):
    v+=seg('wood2',(sx*4.4,3.85,0),(sx*4.55,4.5,0),.08,.05)+[S('wood2',(sx*4.58,4.55,0),(.14,.14,.2)),spike('wood2',(sx*4.58,4.65,0),.04,.25)]
    for sg in(-1,1):v+=seg('wood2',(sx*4.35,2.4,sg*2.5),(sx*4.2,3.7,0),.07,.06,False)
for i,cn in enumerate(['red','yellow','blue']):v.append(frus(cn,g(-1.4+i*1.4,1.5,2.18),.4,.4,.08,seg=16,rot=(math.pi/2,0,0)));v.append(S('iron',(-1.4+i*1.4,1.5,2.23),(.09,.09,.04)))
v+=[frus('iron',g(1.4,1.7,2.3),.04,.04,.7,seg=6),S('fire',(1.4,2.15,2.3),(.12,.2,.12))]
join(v,'longhouse')
# ===== COLOSSEUM FACADE (14 x 8.8, front face at z=0, back z=-5.4) =====
wall=box('marble2',g(0,4.4,-2.7),(14,8.8,5.4),.05)
ar=[]
for row in range(3):
    for i in range(7):
        x=-5.4+i*1.8;y=1.2+row*2.7
        ar.append(box('dark',g(x,y-.275,.03),(1.1,1.15,.12),0))
        ar.append(frus('dark',g(x,y+.3,.03),.55,.55,.12,seg=24,rot=(math.pi/2,0,0)))
        ar.append(box('marble',g(x,y+.88,.07),(.22,.16,.16),.02))
        ar.append(box('marble',g(x,y-.9,.08),(1.3,.1,.2),.02))
col=[wall]+ar
for row in range(3):
    y=1.2+row*2.7
    for i in range(8):col.append(frus('marble',g(-6.3+i*1.8,y+.2,.12),.2,.2,2.6,seg=14))
    col.append(box('marble',g(0,y+1.65,.1),(14.3,.22,.5),.03))
col+=[box('marble',g(0,8.95,-2.7),(14.4,.4,5.8),.04),box('marble',g(0,.1,-.1),(14.4,.2,.6),.03)]
for i in range(14):col.append(box('marble',g(-6.5+i,9.4,-.2),(.55,.6,.3),.03))
join(col,'colosseum')
# ===== LONGSHIP (length 11 along x, centred) =====
def hull():
    rows=[];N=24
    for k in range(N+1):
        x=-5.6+11.2*k/N;u=abs(x)/5.6;b=max(.04,1.5*(1-u**2)**.55);hr=1.25+1.15*u**3;kl=.1+.9*u**2.2
        pts=[(-b,hr),(-.88*b,hr*.55+kl*.45),(-.5*b,kl+.18),(0,kl),(.5*b,kl+.18),(.88*b,hr*.55+kl*.45),(b,hr)]
        rows.append([g(x,z,y) for y,z in pts])
    return rows
rows=hull();h=[strip('wood',rows,True,.1)]
rr=[[r[0],r[1]] for r in rows];h.append(strip('wood2',[[r[0],r[1]] for r in rows],True,.12));h.append(strip('wood2',[[r[5],r[6]] for r in rows],True,.12))
for sx in(-1,1):
    h+=chain('wood2',[(sx*5.5,2.2,0),(sx*5.8,3.2,0),(sx*5.55,4.2,0),(sx*5.1,4.7,0)],[.17,.14,.11,.09])
    h+=[S('wood2',(sx*5.0,4.75,0),(.22,.2,.18)),spike('wood2',(sx*4.95,4.9,0),.05,.3)]
h+=chain('wood2',[(0,.4,0),(0,4.5,0),(0,9.5,0)],[.17,.14,.1])+[box('wood2',g(0,8.3,0),(.1,.1,5.4),.02),box('sail',g(0,6.3,0),(.08,3.6,5.0),.02)]
for i in range(5):h.append(box('red',g(.06,6.3,-2.0+i*1.0),(.04,3.6,.5),0))
for i in range(8):
    x=-4.0+i*1.15
    for sg in(-1,1):h+=[frus(['red','yellow','blue','cream'][i%4],g(x,1.5,sg*1.28*(1-(abs(x)/5.6)**2)**.55),.5,.5,.1,seg=16,rot=(0,0,0)) if False else frus(['red','yellow','blue','cream'][i%4],g(x,1.6,sg*(1.5*(1-(abs(x)/5.6)**2)**.55+.02)),.48,.48,.08,seg=16,rot=(math.pi/2,0,0))]
for x in(-3,0,3):
    for sg in(-1,1):h+=seg('wood',(x,1.2,sg*1.0),(x,.2,sg*3.2),.05,.05,False)
h.append(box('wood',g(0,.9,0),(9.0,.06,.9),.01))
join(h,'longship')
bpy.ops.export_scene.gltf(filepath='anc.glb',export_format='GLB',export_yup=True)
print('OK',[(o.name,len(o.data.vertices)) for o in bpy.data.objects])
