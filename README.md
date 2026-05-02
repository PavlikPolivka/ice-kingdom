# Ledové dobrodružství 🩵

Malá hra ve stylu Ledového království pro Pavla a jeho dceru.
A small Frozen-style browser parkour game built together.

## How to run

You need any tiny static file server (the game uses ES modules, so it
won't run from `file://`).

```sh
cd elogame
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

For iPad testing, open the same URL from an iPad on the same Wi-Fi
(replace `localhost` with the Mac's IP, e.g. `http://192.168.1.50:8000`).

## Controls

- **Keyboard:** ← / → / A / D to move, **Space** / ↑ / W to jump.
- **Touch (iPad):** on-screen left, right, jump buttons appear automatically.
- **Mouse:** click menus.

## Debug shortcut

Add `?scene=Parkour` (or `Title` / `CharacterSelect` / `Forest` / `Win`)
to the URL to jump straight to a scene. Handy when tweaking just one
scene without clicking through the menus.

## Where the interesting code lives

| File | What it does |
|------|--------------|
| `index.html`, `css/style.css` | Page shell + on-screen touch buttons |
| `js/main.js` | Phaser config, scene registration, FIT scaling |
| `js/locale.js` | All Czech strings (edit here to change text) |
| `js/controls.js` | Unified keyboard + touch input → `controls.left/right/jump` |
| `js/particles.js` | Snow + sparkle particles |
| `js/sfx.js` | Sound effects (synthesized at runtime, no files) |
| `js/scenes/BootScene.js` | Loading screen, preloads sprites |
| `js/scenes/TitleScene.js` | Title + Play button |
| `js/scenes/CharacterSelectScene.js` | Pick Anna / Líza / Eliška |
| `js/scenes/ForestScene.js` | Walk to princess, dialogue |
| `js/scenes/ParkourScene.js` | The platforming level itself — platforms, jumps, snowflakes |
| `js/scenes/WinScene.js` | Victory screen with sparkle burst |

## Tweaking the parkour level

Open `js/scenes/ParkourScene.js`. Near the top, edit the `PLATFORMS`
array (`{ x, y, w }` — left edge, top, width in tiles) and the
`SNOWFLAKES` array (`{ x, y }` — center positions).

`TILE` is 70 px. Each platform tile is 70×70.

## Deploy to Vercel

This is a plain static site — no build step. Two options:

**A. From the web UI (easiest):**
1. Push the repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Click *Deploy*. Vercel auto-detects "Other" / static and ships it.

**B. From the CLI:**
```sh
npx vercel       # first time: log in + link the project
npx vercel --prod  # ship to production
```

`vercel.json` is committed and sets long cache headers on `/assets/*`.

## Assets

Art is from [Kenney.nl](https://kenney.nl/) under
[Creative Commons Zero](https://creativecommons.org/publicdomain/zero/1.0/)
— specifically from *Platformer Art Deluxe*. See `assets/KENNEY_LICENSE.txt`.
Sound effects are synthesized in code (Web Audio API), no audio files
needed.
