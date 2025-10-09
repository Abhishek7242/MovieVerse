# 🎬 MovieVerse

**MovieVerse** is a sleek and responsive web app that displays a curated list of the best movies of all time — complete with posters, rankings, and smooth animations.  
Built using only **HTML, CSS, and JavaScript**, it’s lightweight, modern, and fully customizable.

---

## 🌟 Features

- 🏆 **Ranked Movie List:** Movies are sorted automatically by rank (1 = top movie).  
- 🎥 **Dynamic Poster Loading:** Each movie poster loads smoothly with a loader animation.  
- 💡 **Fallback System:** If a poster fails to load, a stylish initials-based placeholder appears.  
- 🖥 **Responsive Grid Layout:** Adapts seamlessly to any screen size.  
- 🎨 **Modern Cinematic Design:** Inspired by streaming platforms — clean typography, gradients, and depth effects.  
- ⚡ **No Dependencies:** Pure front-end (HTML, CSS, JS) — no frameworks or API keys required.

---

## 🧩 Tech Stack

- **HTML5** — Structure  
- **CSS3** — Styling and animations  
- **Vanilla JavaScript (ES6)** — Logic, ranking, and dynamic rendering  

---

## 🧠 How It Works

1. The movie data is stored in a JavaScript array with the following structure:
   ```js
   const movies = [
     { name: "Inception", url: "https://...", rank: 1 },
     { name: "Interstellar", url: "https://...", rank: 2 },
     ...
   ];
