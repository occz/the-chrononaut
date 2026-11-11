import math,random
exec(open('kit.py').read().split('# ---- LEG')[0])
c2=open('creatures.py').read();exec(c2[c2.index("for n,c,r in[('skin'"):c2.index("# ===== SAUROPOD")])
_box=box
def box(mat,loc,size,bevel=.02,sub=0,rot=(0,0,0)):return _box(mat,loc,(size[0],size[2],size[1]),bevel,sub,rot)
for n,c,r,m in[('hull','#e8f0f0',.25,.6),('glass','#8ad8ff',.1,.8),('glow','#5affb8',.4,0),('iron','#2a2e3a',.4,.7),('dark','#12141c',.6,.2),('metal','#c8c8e0',.3,.8),('crys','#f4e4b8',.2,.7)]:M(n,H(c),r,m)
# ===== HOVER CAR (length ~3 along x) =====
h=[S('hull',(0,.4,0),(1.5,.32,.62)),S('glass',(.25,.62,0),(.65,.26,.42)),S('hull',(-1.0,.55,0),(.55,.1,.9)),box('glow',g(0,.12,0),(2.4,.04,.7),.01),
   S('dark',(1.4,.38,0),(.3,.08,.3)),spike('hull',(1.7,.4,0),.1,.5,(0,math.pi/2,0))]
for s in(-1,1):
    h+=[S('hull',(-.3,.38,s*.7),(.6,.07,.28)),S('glow',(-1.55,.42,s*.28),(.12,.1,.1))]
join(h,'hover')
# ===== DRONE =====
d=[S('hull',(0,0,0),(.32,.12,.32)),S('glass',(0,.1,.1),(.14,.1,.12)),S('glow',(0,-.1,0),(.1,.05,.1))]
for a in range(4):
    x=math.cos(a*math.pi/2+math.pi/4)*.5;z=math.sin(a*math.pi/2+math.pi/4)*.5
    d+=seg('iron',(0,0,0),(x,.02,z),.04,.035,False)
    d.append(frus('metal',g(x,.06,z),.2,.2,.02,seg=20));d.append(frus('dark',g(x,.04,z),.04,.04,.06,seg=8))
join(d,'drone')
# ===== DISH =====
bm=bmesh.new();bmesh.ops.create_uvsphere(bm,u_segments=32,v_segments=16,radius=1)
for v in bm.verts:v.co.z*=.45
bmesh.ops.delete(bm,geom=[f for f in bm.faces if f.calc_center_median().z<.25],context='FACES')
me=bpy.data.meshes.new('dish');bm.to_mesh(me);bm.free();dish=bpy.data.objects.new('dish',me);bpy.context.collection.objects.link(dish)
dish.rotation_euler=(math.radians(-35),0,0);dish.location=g(0,3.6,0);dish.scale=(1.7,1.7,1.7)
bpy.context.view_layer.objects.active=dish;dish.select_set(True);sd=dish.modifiers.new('s','SOLIDIFY');sd.thickness=.05;dish.data.materials.append(M('metal',0))
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);bpy.ops.object.convert(target='MESH');bpy.ops.object.shade_smooth();dish.select_set(False)
dd=[dish]+[frus('iron',g(0,.15,0),.8,.6,.3,seg=8),frus('iron',g(0,1.6,0),.2,.2,3.0,seg=12),frus('dark',g(0,3.35,0),.3,.3,.3,seg=12)]
dd+=seg('iron',(0,3.7,-.2),(0,4.7,-1.2),.04,.04,False)+[S('glow',(0,4.75,-1.25),(.14,.14,.14))]
for a in range(3):
    x=math.cos(a*2.1)*.9;z=math.sin(a*2.1)*.9;dd+=seg('iron',(x,.1,z),(0,1.4,0),.1,.07,False)
join(dd,'dish')
# ===== SENTINEL PILLAR (height 10, width 1.6) =====
p=[box('iron',g(0,.35,0),(1.9,.7,1.9),.06),box('iron',g(0,5,0),(1.5,9.2,1.5),.08)]
for s in(-1,1):
    for z in(-1,1):p.append(box('dark',g(s*.45,5,z*.77),(.12,9.0,.06),0));p.append(box('dark',g(s*.77,5,z*.45),(.06,9.0,.12),0))
p+=[box('iron',g(0,9.6,0),(1.9,.5,1.9),.06),box('metal',g(0,9.9,0),(1.5,.15,1.5),.03)]
for y in(2.2,4.4,6.6):p.append(box('glow',g(0,y,0),(1.56,.1,1.56),.01))
join(p,'pillar')
# ===== MONOLITH CRYSTAL (height ~3) =====
random.seed(5);c=[]
for (x,z,hh,r_,tilt) in[(0,0,3.2,.5,0),(.55,.2,2.0,.35,.25),(-.5,-.15,1.7,.3,-.3),(.1,-.5,1.3,.25,.15)]:
    top=(x+tilt*hh*.3,hh,z);c+=seg('crys',(x,.2,z),(x+tilt*hh*.15,hh*.55,z),.0,r_,False,6)+seg('crys',(x+tilt*hh*.15,hh*.55,z),top,r_,.0,False,6)
c.append(frus('glow',g(0,1.9,0),.9,.9,.03,seg=40))
join(c,'monolith')
# ===== SCI-FI DOOR (width 3, height 3, faces +z) =====
s=[box('iron',g(0,.12,.7),(3.6,.24,1.4),.04),box('glow',g(0,.26,1.42),(3.0,.04,.06),.005),
   box('iron',g(-1.35,1.6,.15),(.5,3.0,.3),.05),box('iron',g(1.35,1.6,.15),(.5,3.0,.3),.05),box('iron',g(0,3.2,.2),(3.2,.4,.4),.05),
   box('glass',g(-.45,1.55,.1),(.8,2.7,.06),.01),box('glass',g(.45,1.55,.1),(.8,2.7,.06),.01),box('dark',g(0,1.55,.05),(.1,2.7,.05),0),
   box('metal',g(0,3.6,.7),(3.4,.1,1.4),.03)]
for sx in(-1,1):s+=[box('glow',g(sx*1.12,1.6,.32),(.04,2.8,.04),0),box('glow',g(sx*1.58,1.6,.12),(.04,3.0,.04),0)]
s+=[box('glow',g(0,3.0,.42),(2.2,.05,.04),0),box('glow',g(0,3.52,1.38),(3.2,.04,.06),0)]
join(s,'sdoor')
bpy.ops.export_scene.gltf(filepath='fut.glb',export_format='GLB',export_yup=True)
print('OK',[(o.name,len(o.data.vertices)) for o in bpy.data.objects])
