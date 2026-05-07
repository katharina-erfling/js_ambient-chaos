# 🎧 Ambient Chaos

Ein interaktiver Ambient-Sound-Mixer – mehrere Umgebungsgeräusche können gleichzeitig abgespielt und unabhängig voneinander in der Lautstärke gesteuert werden.

---

## 📁 Projektstruktur

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── sounds/
    ├── birds.mp3
    ├── cafe.mp3
    ├── fire.mp3
    ├── ocean.mp3
    ├── old-house.mp3
    ├── rain-hard.mp3
    ├── rain-soft.mp3
    ├── river.mp3
    ├── swamp.mp3
    ├── thunder.mp3
    ├── traffic.mp3
    ├── train.mp3
    ├── underwater.mp3
    ├── wind-hard.mp3
    └── wind-soft.mp3
```

---

## 🧩 Features

> 🎛️ **Rahmen als Slider** – der Kartenrahmen ist gleichzeitig der Lautstärkeregler. Ein Punkt bewegt sich entlang des abgerundeten Rechtecks und füllt den Rahmen per `stroke-dasharray` / `stroke-dashoffset` – kein klassischer HTML-Slider.

> 🔁 **Drag-to-Play** – Sounds starten automatisch beim Draggen des Punktes und pausieren wenn die Lautstärke auf 0 gezogen wird – kein separater Play-Button nötig.

> 🧮 **SVG-Perimeter-Berechnung** – der Umfang des abgerundeten Rechtecks wird mathematisch berechnet (gerade Kanten + Kreisbögen an den Ecken), damit der Punkt präzise entlang des Rahmens läuft.

- 15 Umgebungsgeräusche gleichzeitig mischbar
- Dynamisch generierte Karten per `Array` + `forEach` + `createElement`
- Lautstärkeanzeige in Prozent mit Opacity-Feedback
- Loop-Wiedergabe aller Sounds
- Sprung-Schutz beim Draggen (verhindert dass der Punkt von fast-100% zu 0% springt)

---

## 🛠️ Technologien

- **HTML5** – semantisches Markup
- **CSS3** – Custom Properties, Grid, `position: absolute`, `inset`
- **JavaScript (ES6+)** – `Array`, `forEach`, `createElement`, `appendChild`, `createElementNS`, SVG-Manipulation, Web Audio API (`new Audio()`, `volume`, `play()`, `pause()`, `loop`), Drag-Events (`mousedown`, `mousemove`, `mouseup`), `Math.abs`, Arrow Functions, Template Literals
- **SVG** – `rect`, `circle`, `stroke-dasharray`, `stroke-dashoffset`, `viewBox`
- **Google Fonts** – Space Mono

---

## 📚 Kontext

Teil der **Softwareentwicklerin Frontend Javascript Zertifizierung** bei GFN (extern zertifiziert durch WPI), März – Juni 2026.
