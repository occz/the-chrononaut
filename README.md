# The Chrononaut

History has holes, and you are the patch. A time-travel action game that runs in the browser (Three.js).

- `public/index.html`: landing page
- `public/play.html`: the game (single self-contained file, loads Three.js from jsDelivr)
- `game/src/`: game source (`head.html`, `core.js`, `world.js`, `actors.js`, `gear.js`, `magic.js`, `duel.js`, `game.js`)
- `worker/index.js`: Cloudflare Worker + Durable Object that relays the online duel (Chrononaut vs Time Hunter) over WebSockets at `/ws`

To rebuild `play.html` from the source: concatenate `head.html`, `<script type="module">`, `core.js world.js actors.js gear.js magic.js duel.js game.js`, `</script>`.

Deployed on Cloudflare Workers (`wrangler.jsonc`): `public/` as static assets plus the duel relay Worker.
