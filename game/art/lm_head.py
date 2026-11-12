import math,random
exec(open('kit.py').read().split('# ---- LEG')[0])
c2=open('creatures.py').read();exec(c2[c2.index("for n,c,r in[('skin'"):c2.index("# ===== SAUROPOD")])
_box=box
def box(mat,loc,size,bevel=.02,sub=0,rot=(0,0,0)):return _box(mat,loc,(size[0],size[2],size[1]),bevel,sub,rot)
a6=open('anc.py').read()
exec(a6[a6.index("def strip"):a6.index("# ===== ROMAN COLUMN")])
def MM(rows):
    for n,c,r,m in rows:M(n,H(c),r,m)
def rock(mat,pos,size,seed=1,disp=.22,sub=2,rot=0):
    rnd=random.Random(seed)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub,radius=.5,location=g(*pos));o=bpy.context.object
    for v in o.data.vertices:
        k=1+(rnd.random()-.5)*2*disp;v.co*=k
    o.scale=(size[0],size[2],size[1]);o.rotation_euler=(0,0,rot)
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
    o.data.materials.clear();o.data.materials.append(M(mat,0))
    for p in o.data.polygons:p.use_smooth=False
    o.select_set(False);return o
def ell(mat,pos,r,seg=14):return sph(mat,g(*pos),(r[0],r[2],r[1]),seg)
def cylh(mat,pos,r,L,axis='x',seg=12):
    rot={'x':(0,math.pi/2,0),'z':(math.pi/2,0,0),'y':(0,0,0)}[axis]
    return frus(mat,g(*pos),r,r,L,seg=seg,rot=rot)
def cyl2(mat,pos,r0,r1,h,seg=14):return frus(mat,g(pos[0],pos[1],pos[2]),r0,r1,h,seg=seg)
def cylv(mat,x,y,z,r,h,seg=14):return frus(mat,g(x,y,z),r,r,h,seg=seg)
def rod(mat,p0,p1,r,n=6):return seg(mat,p0,p1,r,r,False,n)
def pyr4(mat,cx,cz,y0,w,d,h,w2=.001,d2=.001):
    # square frustum, half sizes w/2,d/2 bottom to top
    me=bpy.data.meshes.new('p');bm=bmesh.new()
    def v(x,y,z):return bm.verts.new(g(cx+x,y0+y,cz+z))
    b=[v(-w/2,0,-d/2),v(w/2,0,-d/2),v(w/2,0,d/2),v(-w/2,0,d/2)];t=[v(-w2/2,h,-d2/2),v(w2/2,h,-d2/2),v(w2/2,h,d2/2),v(-w2/2,h,d2/2)]
    for i in range(4):
        j=(i+1)%4
        bm.faces.new((b[i],b[j],t[j],t[i]))
    bm.faces.new(t);bm.faces.new(b[::-1])
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    bm.to_mesh(me);bm.free();o=bpy.data.objects.new('p',me);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o
    me.materials.append(M(mat,0))
    for p in me.polygons:p.use_smooth=False
    return o
def export(name):
    pass
_join=join
def join(objs,name):
    fl=[]
    for o in objs:
        if isinstance(o,(list,tuple)):fl+=list(o)
        else:fl.append(o)
    return _join(fl,name)
