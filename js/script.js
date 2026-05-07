'use strict';

const sounds = [
    { name: "Vögel", icon: "🐦", sound: "sounds/birds.mp3" },
    { name: "Café", icon: "☕", sound: "sounds/cafe.mp3" },
    { name: "Altes Haus", icon: "🏚️", sound: "sounds/old-house.mp3" },
    { name: "Starkregen", icon: "🌧️", sound: "sounds/rain-hard.mp3" },
    { name: "Sanfter Regen", icon: "🌦️", sound: "sounds/rain-soft.mp3" },
    { name: "Fluss", icon: "💧", sound: "sounds/river.mp3" },
    { name: "Sumpf", icon: "🐸", sound: "sounds/swamp.mp3" },
    { name: "Gewitter", icon: "⚡", sound: "sounds/thunder.mp3" },
    { name: "Unter Wasser", icon: "🌊", sound: "sounds/underwater.mp3" },
    { name: "Starker Wind", icon: "💨", sound: "sounds/wind-hard.mp3" },
    { name: "Sanfter Wind", icon: "🍃", sound: "sounds/wind-soft.mp3" },
    { name: "Unterwegs im Zug", icon: "🚂", sound: "sounds/train.mp3" },
    { name: "Verkehr", icon: "🚗", sound: "sounds/traffic.mp3" },
    { name: "Ozean", icon: "🐚", sound: "sounds/ocean.mp3" },
    { name: "Lagerfeuer", icon: "🔥", sound: "sounds/fire.mp3" },
];

const W = 120, H = 120, R = 10, PAD = 16;
const P = perim(W, H, R);

function perim(w, h, r) {
    return 2*(w-2*r) + 2*(h-2*r) + 2*Math.PI*r;
}

function pointOnPerim(t, w, h, r) {
    const P = perim(w, h, r);
    let d = Math.max(0, Math.min(1, t)) * P;
    const segs = [
        { len: w - 2*r, x: s => r + s, y: () => 0 },
        { len: Math.PI*r/2, x: s => w-r + Math.sin(s/r)*r, y: s => r - Math.cos(s/r)*r },
        { len: h - 2*r, x: () => w, y: s => r + s },
        { len: Math.PI*r/2, x: s => w-r + Math.cos(s/r)*r, y: s => h-r + Math.sin(s/r)*r },
        { len: w - 2*r, x: s => w-r-s, y: () => h },
        { len: Math.PI*r/2, x: s => r - Math.sin(s/r)*r, y: s => h-r + Math.cos(s/r)*r },
        { len: h - 2*r, x: () => 0, y: s => h-r-s },
        { len: Math.PI*r/2, x: s => r - Math.cos(s/r)*r, y: s => r - Math.sin(s/r)*r },
    ];
    for (const seg of segs) {
        if (d <= seg.len) return { x: seg.x(d), y: seg.y(d) };
        d -= seg.len;
    }
    return { x: r, y: 0 };
}

function closestT(mx, my, w, h, r) {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const p = pointOnPerim(t, w, h, r);
        const dist = (p.x - mx)**2 + (p.y - my)**2;
        if (dist < bestDist) { bestDist = dist; best = t; }
    }
    return best;
}

const grid = document.getElementById("grid");

sounds.forEach((sound) => {

    const ambientSound = new Audio(sound.sound);
    ambientSound.loop = true;

    const card = document.createElement('div');
    card.classList.add('card-wrap');
    grid.appendChild(card);

    const cardBox = document.createElement('div');
    cardBox.classList.add('card-box');
    card.appendChild(cardBox);

    const cardIcon = document.createElement('div');
    cardIcon.classList.add('card-inner');
    cardIcon.textContent = sound.icon;
    cardBox.appendChild(cardIcon);

    const cardVolume = document.createElement('p');
    cardVolume.classList.add('card-volume');
    cardVolume.textContent = '0%';
    cardBox.appendChild(cardVolume);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('card-svg');
    svg.setAttribute('width', W + PAD * 2);
    svg.setAttribute('height', H + PAD * 2);
    svg.setAttribute('viewBox', `0 0 ${W + PAD * 2} ${H + PAD * 2}`);

    const trackPath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    trackPath.setAttribute('x', PAD); trackPath.setAttribute('y', PAD);
    trackPath.setAttribute('width', W); trackPath.setAttribute('height', H);
    trackPath.setAttribute('rx', R);
    trackPath.setAttribute('fill', 'none');
    trackPath.setAttribute('stroke', 'var(--card-border)');
    trackPath.setAttribute('stroke-width', '3');

    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fillPath.setAttribute('x', PAD); fillPath.setAttribute('y', PAD);
    fillPath.setAttribute('width', W); fillPath.setAttribute('height', H);
    fillPath.setAttribute('rx', R);
    fillPath.setAttribute('fill', 'none');
    fillPath.setAttribute('stroke', '#7F77DD');
    fillPath.setAttribute('stroke-width', '3');
    fillPath.setAttribute('stroke-linecap', 'round');
    fillPath.setAttribute('stroke-dasharray', `0 ${P}`);
    fillPath.setAttribute('stroke-dashoffset', '0');

    const startP = pointOnPerim(0, W, H, R);
    const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    handle.setAttribute('cx', startP.x + PAD); handle.setAttribute('cy', startP.y + PAD);
    handle.setAttribute('r', '7');
    handle.setAttribute('fill', 'white');
    handle.setAttribute('stroke', '#7F77DD');
    handle.setAttribute('stroke-width', '2');
    handle.style.cursor = 'grab';

    svg.append(trackPath, fillPath, handle);
    cardBox.appendChild(svg);

    let dragging = false;
    let lastT = 0;

    function update(t) {
        if (Math.abs(t - lastT) > 0.5) return;
        lastT = t;
        const clamped = Math.max(0, Math.min(0.98, t));
        ambientSound.volume = clamped;
        if (clamped > 0) {
            ambientSound.play();
        } else {
            ambientSound.pause();
        }
        const filled = clamped * P;
        fillPath.setAttribute('stroke-dasharray', `${filled} ${P - filled}`);
        const p = pointOnPerim(clamped, W, H, R);
        handle.setAttribute('cx', p.x + PAD);
        handle.setAttribute('cy', p.y + PAD);
        cardVolume.textContent = Math.round(clamped * 100) + '%';
        cardVolume.style.opacity = Math.max(0.5, clamped);
    }

    handle.addEventListener('mousedown', e => { dragging = true; handle.style.cursor = 'grabbing'; e.preventDefault(); });
    svg.addEventListener('mousedown', e => {
        const rect = svg.getBoundingClientRect();
        const mx = e.clientX - rect.left - PAD;
        const my = e.clientY - rect.top - PAD;
        const t = closestT(mx, my, W, H, R);
        dragging = true;
        update(t);
        e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        const rect = svg.getBoundingClientRect();
        const mx = e.clientX - rect.left - PAD;
        const my = e.clientY - rect.top - PAD;
        const t = closestT(mx, my, W, H, R);
        update(t);
    });
    window.addEventListener('mouseup', () => { dragging = false; handle.style.cursor = 'grab'; });

    const cardName = document.createElement('p');
    cardName.classList.add('card-name');
    cardName.textContent = sound.name;
    card.appendChild(cardName);

});