/* ============================================================
   JUNGLE WAVE — Portfolio Scripts
   main.js
   ============================================================ */


/* ─── YEAR ─── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ─── CUSTOM CURSOR ─── */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  dot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
})();


/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
const btt    = document.getElementById('btt');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });


/* ─── BACK TO TOP ─── */
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ─── HAMBURGER / MOBILE NAV ─── */
const ham = document.querySelector('.hamburger');
const mob = document.getElementById('mobile-nav');
let menuOpen = false;

ham.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mob.classList.toggle('open', menuOpen);
  ham.setAttribute('aria-expanded', menuOpen);
});

mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuOpen = false;
  mob.classList.remove('open');
  ham.setAttribute('aria-expanded', false);
}));


/* ─── REVEAL ON SCROLL ─── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));


/* ─── KEYBOARD NAV — work cards ─── */
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') card.click();
  });
});


/* ============================================================
   CANVAS ANIMATIONS
   ============================================================ */

/* ─── WORK CARD CANVASES — animated geometric loops ─── */
const palettes = [
  ['#62ccf0', '#FFB800', '#1a1a1a'],
  ['#FFB800', '#62ccf0', '#0a0a0a'],
  ['#62ccf0', '#f5f2ed', '#1a1a1a'],
  ['#FFB800', '#f5f2ed', '#0a0a0a'],
];

document.querySelectorAll('.work-card-canvas').forEach(cv => {
  const idx = +cv.dataset.card;
  const pal = palettes[idx];
  const ctx = cv.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = cv.width  = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = pal[2];
    ctx.fillRect(0, 0, W, H);

    /* animated floating circles */
    for (let i = 0; i < 6; i++) {
      const x = W * (0.1 + 0.15*i + 0.04 * Math.sin(t*0.015 + i));
      const y = H * (0.3 + 0.2 * Math.sin(t*0.01 + i*1.3));
      const r = 30 + 20 * Math.sin(t*0.02 + i*0.7);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2);
      ctx.fillStyle = i%2===0 ? pal[0]+'55' : pal[1]+'44';
      ctx.fill();
    }

    /* subtle grid overlay */
    ctx.strokeStyle = pal[0] + '22';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); ctx.moveTo(W/8*i, 0); ctx.lineTo(W/8*i, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, H/6*i); ctx.lineTo(W, H/6*i); ctx.stroke();
    }

    t++;
    requestAnimationFrame(draw);
  }

  new ResizeObserver(() => resize()).observe(cv);
  resize();
  draw();
});


/* ─── BIO CANVAS — abstract generative portrait ─── */
(function bioCanvas() {
  const cv = document.getElementById('bio-canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, t = 0;

  function resize() {
    W = cv.width  = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);

    const cx = W*0.5, cy = H*0.42;

    /* background radial glow */
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W*0.6);
    g.addColorStop(0,   'rgba(98,204,240,0.18)');
    g.addColorStop(0.5, 'rgba(255,184,0,0.07)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* breathing concentric ellipses */
    for (let i = 0; i < 8; i++) {
      const off = i * 0.35;
      ctx.beginPath();
      ctx.ellipse(
        cx + 15 * Math.sin(t*0.008 + off),
        cy + 10 * Math.cos(t*0.01  + off),
        W*0.28 + i*12 + 8 * Math.sin(t*0.012 + off),
        H*0.32 + i*8  + 6 * Math.cos(t*0.009 + off),
        t*0.002 + off*0.3, 0, Math.PI*2
      );
      const alpha = 0.08 - i*0.007;
      ctx.strokeStyle = i%2===0
        ? `rgba(98,204,240,${alpha})`
        : `rgba(255,184,0,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* scan line sweep */
    const scanY = H * ((t*0.5 % H) / H);
    const sg = ctx.createLinearGradient(0, scanY-4, 0, scanY+4);
    sg.addColorStop(0,   'rgba(98,204,240,0)');
    sg.addColorStop(0.5, 'rgba(98,204,240,0.25)');
    sg.addColorStop(1,   'rgba(98,204,240,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, scanY-4, W, 8);

    /* dot grid texture */
    ctx.fillStyle = 'rgba(245,242,237,0.07)';
    for (let x = 20; x < W; x += 28) {
      for (let y = 20; y < H; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI*2);
        ctx.fill();
      }
    }

    t++;
    requestAnimationFrame(draw);
  }

  new ResizeObserver(() => resize()).observe(cv);
  resize();
  draw();
})();
