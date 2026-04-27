# Notes App — React + Vite

> Built for **Node 24 / npm 11**

## Quick Start

```bash
npm install
npm run dev
```

Opens at → http://localhost:5173

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |

## Features
- ✦ Add notes with input + button or Enter key
- ✦ Click **Edit** → note text fills the input field
- ✦ "Add" button dynamically becomes a green **Update** button in edit mode
- ✦ Cancel edit restores original state
- ✦ Delete notes with one click
- ✦ Timestamps on each note
- ✦ Animated card entry, hover effects, pulsing edit indicator
- ✦ Fully responsive (mobile-friendly)

## React Concepts
- `useState` — notes array + editingId
- `useRef` — single inputRef for both add & edit input access
- Event handlers — handleAdd, handleEdit, handleUpdate, handleDelete, handleCancel

## Stack
- React 18 + Vite 6
- Nunito + Playfair Display (Google Fonts)
- Pure CSS — no UI libraries
