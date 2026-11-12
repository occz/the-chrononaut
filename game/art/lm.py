exec(open('lm_head.py').read())
exec(open('lm_a.py').read())
import os
if os.path.exists('lm_b.py'):exec(open('lm_b.py').read())
bpy.ops.export_scene.gltf(filepath='lm.glb',export_format='GLB',export_yup=True)
print('OK',[(o.name,len(o.data.vertices)) for o in bpy.data.objects])
