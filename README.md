# The Chrononaut

History has holes, and you are the patch. A time-travel action game that runs in the browser (Three.js).

- `public/index.html`: landing page
- `public/play.html`: the game (single self-contained file, loads Three.js from jsDelivr)
- `game/src/`: game source (`head.html`, `core.js`, `world.js`, `actors.js`, `gear.js`, `game.js`)

To rebuild `play.html` from the source: concatenate `head.html`, `<script type="module">`, `core.js world.js actors.js gear.js game.js`, `</script>`.

Deployed as static assets with Cloudflare (`wrangler.jsonc` serves `public/`).
