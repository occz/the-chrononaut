import bpy,math,bmesh
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
MATS={}
def M(n,c,r=.7,m=0):
    if n in MATS:return MATS[n]
    x=bpy.data.materials.new(n);x.use_nodes=True;b=x.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=c;b.inputs['Roughness'].default_value=r;b.inputs['Metallic'].default_value=m;MATS[n]=x;return x
H=lambda h:tuple(int(h[i:i+2],16)/255 for i in(1,3,5))+(1,)
for n,c,r,m in[('coat','#334152',.75,0),('pants','#1e2530',.85,0),('skin','#e2b48c',.55,0),('hair','#3a2618',.9,0),('boots','#2a1a10',.5,0),('belt','#c9a24a',.3,.85),('trim','#14100c',.6,.2),('shirt','#e8e0d0',.8,0)]:M(n,H(c),r,m)
def fin(o,mat,bevel=0,sub=0):
    bpy.context.view_layer.objects.active=o;o.select_set(True)
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
    if bevel:
        md=o.modifiers.new('b','BEVEL');md.width=bevel;md.segments=3;md.limit_method='ANGLE'
    if sub:
        o.modifiers.new('s','SUBSURF').levels=sub
    o.data.materials.clear();o.data.materials.append(M(mat,0))
    bpy.ops.object.convert(target='MESH')
    try:bpy.ops.object.shade_auto_smooth(angle=math.radians(50))
    except Exception:bpy.ops.object.shade_smooth()
    o.select_set(False);return o
def box(mat,loc,size,bevel=.02,sub=0,rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(location=loc,rotation=rot);o=bpy.context.object;o.scale=(size[0]/2,size[1]/2,size[2]/2);return fin(o,mat,bevel,sub)
def frus(mat,loc,r1,r2,d,seg=18,rot=(0,0,0),sx=1,sy=1,bevel=0):
    bpy.ops.mesh.primitive_cone_add(vertices=seg,radius1=r1,radius2=r2,depth=d,location=loc,rotation=rot);o=bpy.context.object;o.scale=(sx,sy,1);return fin(o,mat,bevel)
def sph(mat,loc,s,seg=20,sub=0):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=seg//2,location=loc);o=bpy.context.object;o.scale=s;return fin(o,mat,0)
def join(objs,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=bpy.context.object;o.name=name
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR');return o
# ---- LEG (hip pivot at origin, hangs down -Z, foot toward -Y) ----
L=[]
L.append(frus('pants',(0,0,-.21),.118,.098,.44,sx=1,sy=1.02))
L.append(frus('pants',(0,0,-.55),.098,.082,.34))
L.append(sph('pants',(0,-.02,-.42),(.1,.1,.09)))
L.append(frus('boots',(0,0,-.72),.088,.104,.3))
L.append(frus('trim',(0,0,-.585),.108,.108,.05))
L.append(box('boots',(0,-.075,-.885),(.19,.36,.13),.035,1))
L.append(box('trim',(0,-.075,-.935),(.2,.38,.035),.012))
L.append(sph('boots',(0,-.22,-.87),(.095,.085,.06)))
leg=join(L,'leg')
# ---- ARM (shoulder pivot, hangs down -Z) ----
A=[]
A.append(sph('coat',(0,0,0),(.115,.11,.115)))
A.append(frus('coat',(0,0,-.19),.095,.078,.38))
A.append(frus('coat',(0,0,-.5),.078,.066,.28))
A.append(sph('coat',(0,.02,-.35),(.085,.085,.07)))
A.append(frus('trim',(0,0,-.63),.074,.074,.05))
A.append(sph('skin',(0,-.005,-.715),(.068,.062,.08)))
A.append(box('skin',(0,-.04,-.745),(.07,.05,.05),.012))
arm=join(A,'arm')
# ---- TORSO (waist pivot at origin, up +Z) ----
T=[]
T.append(box('coat',(0,0,.52),(.56,.33,.56),.08,1))
T.append(box('coat',(0,0,.1),(.52,.32,.3),.06,1))
T.append(box('shirt',(0,-.172,.64),(.16,.03,.4),.01))
for s in(-1,1):
    T.append(box('coat',(s*.1,-.18,.66),(.1,.03,.36),.01,0,(0,0,math.radians(-s*8))))
    T.append(sph('coat',(s*.355,0,.76),(.115,.12,.1)))
    T.append(box('trim',(s*.17,-.175,.26),(.13,.03,.11),.01))
    T.append(box('coat',(s*.2,.0,-.14),(.2,.34,.34),.05,0,(math.radians(0),0,0)))
T.append(box('coat',(0,.12,-.12),(.46,.1,.38),.04))
T.append(box('belt',(0,0,.04),(.585,.36,.075),.012))
T.append(box('trim',(0,-.188,.04),(.1,.03,.07),.01))
T.append(frus('coat',(0,0,.855),.17,.15,.1))
T.append(frus('skin',(0,0,.93),.075,.075,.14))
torso=join(T,'torso')
# ---- HEAD (neck pivot; head center ~ z=.06) ----
D=[]
D.append(sph('skin',(0,0,.06),(.225,.23,.255)))
D.append(sph('skin',(0,-.06,-.1),(.15,.15,.12)))
D.append(sph('skin',(0,-.215,.03),(.032,.05,.05)))
for s in(-1,1):D.append(sph('skin',(s*.225,0,.05),(.032,.055,.07)))
D.append(box('skin',(0,-.18,.13),(.34,.08,.05),.02,1))
bpy.ops.mesh.primitive_uv_sphere_add(segments=28,ring_count=14,location=(0,.02,.075));hair=bpy.context.object;hair.scale=(.245,.25,.275)
bpy.ops.object.transform_apply(scale=True)
bm=bmesh.new();bm.from_mesh(hair.data)
bm.faces.ensure_lookup_table()
kill=[f for f in bm.faces if (f.calc_center_median().y<-.06 and f.calc_center_median().z<.2) or f.calc_center_median().z<-.02]
bmesh.ops.delete(bm,geom=kill,context='FACES');bm.to_mesh(hair.data);bm.free()
sd=hair.modifiers.new('sol','SOLIDIFY');sd.thickness=.012
D.append(fin(hair,'hair',0))
for i,(x,y,z,s) in enumerate([(0,.2,.2,1),(.1,.2,.14,.8),(-.1,.2,.14,.8),(0,.12,.3,.8)]):
    D.append(frus('hair',(x,y,z),.06*s,.0,.16*s,seg=10,rot=(math.radians(-60),0,0)))
head=join(D,'head')
bpy.ops.export_scene.gltf(filepath='hero_kit.glb',export_format='GLB',export_apply=False,export_materials='EXPORT',use_selection=False,export_yup=True)
print('OK',[ (o.name,len(o.data.vertices)) for o in bpy.data.objects])
