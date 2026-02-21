# GuitarBob 🎸

**AI guitar tutor** – Upload a song, get chords & tabs, and learn with **Bob** – your friendly Duolingo-style guitar buddy!

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What's inside

- **Landing** – Bob welcomes you; choose "Upload a song" or "Practice mode"
- **Upload** – Drag & drop or pick an audio file (MP3, WAV, etc.)
- **Processing** – Bob "listens" and shows a fun loading state
- **Results** – Chords and tabs (mock data for now; plug in your API)
- **Practice** – Step-by-step lesson with Bob guiding you through chords

## Front end stack

- **React 18** + **Vite** + **Tailwind CSS**
- **React Router** for navigation
- **Bob** – SVG mascot with poses: default (wave), happy, thinking, teaching, listening, sad
- Duolingo-like UI: Fredoka + Nunito, green/orange/blue palette, rounded buttons, speech bubbles, streak/hearts/XP bar

## Hardware note

Use your **electric guitar + audio interface** to play along during Practice. (Audio input/recognition can be wired in later.)

## Build

```bash
npm run build
npm run preview
```

Have fun and rock on! 🎸
