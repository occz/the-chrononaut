#!/bin/bash
set -e
cd /home/claude/tl
echo "const KIT_B64='$(base64 -w0 art/hero_kit.glb)';" > src/kitdata.js
{ cat src/head.html; echo '<script type="module">'; cat src/core.js src/kitdata.js src/world.js src/actors.js src/gear.js src/magic.js src/forge.js src/duel.js src/game.js; echo '</script>'; } > dist/timelords.html
sed -e 's#https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js#/node_modules/three/build/three.module.js#' -e 's#https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/#/node_modules/three/examples/jsm/#' dist/timelords.html > test.html
# wrap with skeleton like the artifact host does
{ echo '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; cat test.html; echo '</body></html>'; } > test2.html && mv test2.html test.html
wc -c dist/timelords.html
