def bx(m,p,s,b=0,rot=(0,0,0)):return box(m,g(*p),s,b,0,rot)
def plate(mat,pts,z,th):
    me=bpy.data.meshes.new('pl');bm=bmesh.new()
    f=[bm.verts.new(g(x,y,z)) for x,y in pts];b=[bm.verts.new(g(x,y,z-th)) for x,y in pts];n=len(pts)
    bm.faces.new(f);bm.faces.new(b[::-1])
    for i in range(n):
        j=(i+1)%n;bm.faces.new((f[i],b[i],b[j],f[j]))
    bmesh.ops.recalc_face_normals(bm,faces=bm.faces)
    bm.to_mesh(me);bm.free();o=bpy.data.objects.new('pl',me);bpy.context.collection.objects.link(o);me.materials.append(M(mat,0))
    for p in me.polygons:p.use_smooth=False
    return o
def lathe(mat,prof,cx,cz,seg=28,th=.02,y0=0):
    rows=[]
    for r,y in prof:
        rows.append([g(cx+r*math.cos(k/seg*math.pi*2),y0+y,cz+r*math.sin(k/seg*math.pi*2)) for k in range(seg+1)])
    return strip(mat,rows,True,th)
def ring(mat,cx,y,cz,r,rr,n=16,plane='y'):
    out=[]
    for k in range(n):
        a0=k/n*math.pi*2;a1=(k+1)/n*math.pi*2
        if plane=='y':p0=(cx+r*math.cos(a0),y,cz+r*math.sin(a0));p1=(cx+r*math.cos(a1),y,cz+r*math.sin(a1))
        else:p0=(cx+r*math.cos(a0),y+r*math.sin(a0),cz);p1=(cx+r*math.cos(a1),y+r*math.sin(a1),cz)
        out+=seg(mat,p0,p1,rr,rr,False,5)
    return out
def lat(mat,p0,p1,w,n,r=.04):
    # lattice: zigzag between two parallel chords at distance w along y (game), p0->p1 axis
    out=[]
    for i in range(n):
        t0=i/n;t1=(i+1)/n
        a=[p0[k]+(p1[k]-p0[k])*t0 for k in range(3)];b=[p0[k]+(p1[k]-p0[k])*t1 for k in range(3)]
        out+=rod(mat,(a[0],a[1]+(w if i%2 else 0),a[2]),(b[0],b[1]+(0 if i%2 else w),b[2]),r,4)
    return out
MM([('brick','#b07048',.95,0),('brick2','#8a5232',.95,0),('plaster','#d8d0c0',.9,0),('plaster2','#b8b0a0',.9,0),('trimwhite','#f0eee6',.6,0),('slate','#4a4e58',.8,0),('roof','#6a4a3a',.9,0),('glass','#9ac0d8',.1,0),('glowwin','#ffd890',.4,0),('glowlamp','#ffe8b0',.4,0),
 ('steel','#9a9ea6',.4,.7),('iron','#2a2a2e',.5,.5),('brass','#c9a24a',.3,.85),('copper','#b87040',.35,.8),('verdigris','#5a9a8a',.5,.6),('conc','#a8a8a4',.95,0),('conc2','#8a8a86',.95,0),('dark','#040302',1,0),('red','#a82a24',.6,0),('cream','#e8dcc0',.9,0),('wood','#6a4a2a',.9,0),('wood2','#4a3220',.95,0),('rope','#b89a5a',1,0),
 ('bstone','#8a7a68',.95,0),('bstone2','#6a5a4a',.95,0),('white','#f0f0f4',.35,.1),('black','#16161a',.5,.2),('orange','#e8741a',.6,0),('marble','#d8d4cc',.7,0),('marble2','#b8b4ac',.8,0),('carpet','#8a1a1e',1,0),('gold','#e8c04a',.3,.9),('tin','#8a8c90',.5,.5),('tin2','#6e7076',.6,.4),('bwood','#6a5236',.9,0),('deco','#6a6466',.6,0),('deco2','#8a8486',.55,0),('poster1','#c8421a',.6,0),('poster2','#2a5a8a',.6,0),('poster3','#d8b040',.6,0),('awn1','#c83a2a',.9,0),('awn2','#f0e8d8',.9,0),('stagetop','#2a2a30',.5,.1),('led','#0c0c14',.3,.3),('bronze','#7a5a32',.4,.7),('domeribs','#dce8e4',.5,.3),('solar','#1c2c4a',.25,.5)])
