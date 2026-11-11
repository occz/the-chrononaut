import math,random
exec(open('kit.py').read().split('# ---- LEG')[0])
c2=open('creatures.py').read();exec(c2[c2.index("for n,c,r in[('skin'"):c2.index("# ===== SAUROPOD")])
_box=box
def box(mat,loc,size,bevel=.02,sub=0,rot=(0,0,0)):return _box(mat,loc,(size[0],size[2],size[1]),bevel,sub,rot)
for n,c,r,m in[('paint','#c0392b',.3,.5),('glass','#a8c8e0',.1,.8),('tire','#111111',.9,0),('rim','#b8b8c0',.3,.9),('red','#aa1a1a',.4,0),('lamp','#fff2c0',.4,0),('bark','#5a4030',.95,0),('leaf','#3a7a3a',.9,0),('iron','#26221e',.45,.6),('stone','#8a8478',.9,0),('wood','#6a4a2a',.8,0),('awn','#8a2a2a',.9,0),('tank','#7a6a50',.9,0)]:M(n,H(c),r,m)
def tbox(mat,c,size,tx,ty,bevel=.03,sub=0):
    bpy.ops.mesh.primitive_cube_add(location=g(*c));o=bpy.context.object;o.scale=(size[0]/2,size[2]/2,size[1]/2);bpy.ops.object.transform_apply(scale=True)
    bm=bmesh.new();bm.from_mesh(o.data)
    for v in bm.verts:
        if v.co.z>0:v.co.x*=tx;v.co.y*=ty
    bm.to_mesh(o.data);bm.free();return fin(o,mat,bevel,sub)
def wheel(x,z):
    t=frus('tire',g(x,.33,z),.33,.33,.26,seg=20,rot=(math.pi/2,0,0));r=frus('rim',g(x,.33,z+(.14 if z>0 else -.14)),.2,.2,.04,seg=12,rot=(math.pi/2,0,0));return[t,r]
# ===== CAR =====
c=[tbox('paint',(0,.58,0),(3.7,.62,1.62),.97,.97,.07,1),tbox('glass',(-.15,1.07,0),(1.95,.5,1.45),.78,.82,.04),box('paint',g(-.15,1.34,0),(1.5,.06,1.3),.03),
   box('trim',g(1.86,.38,0),(.12,.2,1.5),.04),box('trim',g(-1.86,.38,0),(.12,.2,1.5),.04),tbox('paint',(1.2,.9,0),(1.1,.1,1.5),.9,.9,.03)]
for s in(-1,1):
    c+=[S('lamp',(1.84,.62,s*.55),(.1,.1,.17)),S('red',(-1.84,.62,s*.55),(.06,.1,.17))]
for x in(-1.15,1.15):
    for z in(-.78,.78):c+=wheel(x,z)
join(c,'car')
# ===== TREE =====
random.seed(3)
t=seg('bark',(0,0,0),(0,1.6,0),.2,.12)+seg('bark',(0,1.2,0),(.5,2.2,.2),.08,.04)+seg('bark',(0,1.4,0),(-.4,2.4,-.2),.07,.04)
for p,r in[((0,3.0,0),1.5),((.9,2.6,.3),1.0),((-.9,2.7,-.2),1.05),((.2,3.8,-.2),1.0),((-.2,2.4,.9),.9)]:
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=r,location=g(*p));o=bpy.context.object;o.scale=(1,1,.88)
    bm=bmesh.new();bm.from_mesh(o.data)
    for v in bm.verts:v.co*=1+(random.random()-.5)*.22
    bm.to_mesh(o.data);bm.free();t.append(fin(o,'leaf',0))
join(t,'tree')
# ===== LAMP POST =====
l=[frus('iron',g(0,.25,0),.2,.14,.5,seg=10),frus('iron',g(0,.55,0),.17,.17,.08,seg=10)]+seg('iron',(0,.55,0),(0,3.7,0),.09,.06,n=10)
l+=[frus('iron',g(0,1.0,0),.12,.12,.06,seg=10),frus('iron',g(0,2.9,0),.12,.12,.06,seg=10)]
l+=seg('iron',(0,3.7,0),(0,3.95,.2),.06,.05,n=8)+seg('iron',(0,3.95,.2),(0,3.9,.5),.05,.04,n=8)
l+=[frus('iron',g(0,3.92,.5),.2,.1,.12,seg=8),frus('iron',g(0,3.4,.5),.1,.2,.1,seg=8)]
l+=[box('iron',g(sx*.17,3.62,.5),(.025,.4,.025),0) for sx in(-1,1)]+[box('iron',g(0,3.62,.5+sz*.17),(.025,.4,.025),0) for sz in(-1,1)]
join(l,'lamp')
# ===== WATER TOWER =====
w=[frus('wood',g(0,3.3,0),1.3,1.3,2.6,seg=18),frus('iron',g(0,2.2,0),1.34,1.34,.1,seg=18),frus('iron',g(0,3.4,0),1.34,1.34,.1,seg=18),frus('wood',g(0,4.9,0),1.45,.05,.9,seg=18)]
for a in range(4):
    x=math.cos(a*math.pi/2+math.pi/4)*1.0;z=math.sin(a*math.pi/2+math.pi/4)*1.0;w.append(box('iron',g(x,1.05,z),(.14,2.2,.14),.02))
w+=[box('iron',g(0,1.3,0),(2.0,.08,.08),.01),box('iron',g(0,1.3,0),(.08,.08,2.0),.01)]
join(w,'watertank')
# ===== ENTRANCE (front, faces +z) =====
e=[box('stone',g(0,.08,.9),(3.0,.16,1.8),.03),box('stone',g(0,.2,.65),(2.6,.12,1.3),.03),
   box('stone',g(-.95,1.3,.12),(.3,2.4,.24),.02),box('stone',g(.95,1.3,.12),(.3,2.4,.24),.02),box('stone',g(0,2.6,.14),(2.2,.28,.28),.03),
   box('wood',g(0,1.25,.06),(1.45,2.2,.1),.02),box('glass',g(0,1.5,.12),(.9,1.1,.04),.01),box('belt',g(.5,1.1,.16),(.06,.3,.05),.01),
   box('awn',g(0,2.9,.7),(2.8,.1,1.4),.02,0,(math.radians(-8),0,0))]
for s in(-1,1):e.append(box('iron',g(s*1.35,1.1,1.35),(.05,1.0,.05),.01))
e.append(box('iron',g(-1.35,1.55,1.35),(.05,.05,.8),0));e.append(box('iron',g(1.35,1.55,1.35),(.05,.05,.8),0))
join(e,'entrance')
# ===== BALCONY =====
b=[box('stone',g(0,0,.5),(2.4,.14,1.0),.02)]+[box('iron',g(0,.55,1.0),(2.4,.05,.05),0)]+[box('iron',g(x,.28,1.0),(.04,.55,.04),0) for x in[-1.15+i*.23 for i in range(11)]]+[box('iron',g(s*1.18,.28,.5),(.05,.55,.05),0) for s in(-1,1)]
join(b,'balcony')
bpy.ops.export_scene.gltf(filepath='props.glb',export_format='GLB',export_yup=True)
print('OK',[(o.name,len(o.data.vertices)) for o in bpy.data.objects])
