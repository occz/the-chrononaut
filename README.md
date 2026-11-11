# The Chrononaut

History has holes, and you are the patch. A time-travel action game that runs in the browser (Three.js).

- `index.html`: landing page
- `play.html`: the game (single self-contained file, loads Three.js from jsDelivr)
- `game/src/`: game source (`head.html`, `core.js`, `world.js`, `actors.js`, `gear.js`, `game.js`)

To rebuild `play.html` from the source: concatenate `head.html`, `<script type="module">`, `core.js world.js actors.js gear.js game.js`, `</script>`.

Deploy as a static site (Cloudflare Pages: no build command, output directory `/`).
