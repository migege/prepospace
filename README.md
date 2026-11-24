# PrepoSpace — Interactive 3D English Prepositions Course

An interactive web application built with **React, TypeScript, Tailwind CSS, and Three.js** that teaches English prepositions through 3D spatial intuition instead of rote memorization.

Includes **two complete experiences**:
- **Adult / Intermediate Edition (B1–B2)** at `/` — 6 modules, 18 lessons, 60+ interactive Three.js dioramas, minimal pairs, 3D click-to-place challenges, spaced repetition (SRS), active typing mode, and spoken audio.
- **Kids Edition — Pip’s 3D World (iPad-First)** at `/kids` — 4 playful 3D toy worlds with an animated puppy character (*Pip*), 14 core prepositions, tap-in-3D hide-and-seek, spoken audio, gentle chimes, and a star sticker book.

---

## Features

### Intermediate Course (B1–B2)
1. **The Big Three (`in`, `on`, `at`)** — 3D/2D/0D spatial geometry, transport cabins vs. decks, institutions, digital media, and abstract states
2. **Motion, Paths & Boundaries** — `into`, `onto`, `out of`, `off`, `through`, `across`, `along`, `past`, `to` vs. `toward`, `over` vs. `above`, `under` vs. `below`
3. **Time & 3D Timelines** — Clock/day/month geometry + zero-preposition triggers (`next/last/this/every`), `for` vs. `since` vs. `during`, `by` vs. `until`, `within`, `in` vs. `after`
4. **High-Confusion Pairs & Nuance** — `to` vs. `for`, `of` vs. `from`, `with` vs. `by`, `between` vs. `among`, `about` vs. `on`, `like` vs. `as`
5. **Collocation Chunks & Ghost Prepositions** — Verb/adjective + preposition families, zero-preposition traps (`discuss`, `marry`, `enter`), and required-preposition circuits (`explain to me`)
6. **Particle Logic (Phrasal Verbs)** — Spatial forces of `up`, `down`, `out`, `in`, `off`, `on`, `over`, and `through`

### Interactive 3D & Learning Tools
- **60+ Procedural Three.js Scenes** with orbit/zoom, Play/Pause, and timeline scrubbing
- **3D Click-to-Place Arena (`THREE.Raycaster`)** for kinesthetic spatial practice
- **Spaced Repetition (SRS) & Active Typing Mode** persisted in `localStorage`
- **Spoken Audio Pronunciation** via the browser Web Speech API
- **Self-Hosted Fonts** (`@fontsource/fraunces`, `@fontsource/inter`, `@fontsource/jetbrains-mono`) — works completely offline / on private networks
- **iPad-Friendly PWA Support** — add `/kids` or `/` directly to an iPad Home Screen

---

## Run Locally

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## Run with Docker

```bash
docker compose up -d --build
```

The container serves the app on `http://localhost:8080` as a hardened, non-root, read-only Nginx container with a `/healthz` endpoint. See [deploy/nginx.example.conf](deploy/nginx.example.conf) for an example HTTPS reverse-proxy configuration.

## License

MIT
