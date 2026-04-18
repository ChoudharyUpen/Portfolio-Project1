// ── CURSOR GLOW ──────────────────────────────────────────────────────────────
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ── PARTICLE CANVAS ───────────────────────────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.6 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.a  = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() < 0.5 ? 195 : 260; // cyan or purple
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.a})`;
    ctx.fill();
  }
}

const PARTICLE_COUNT = 90;
particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist/110)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ── TYPING ANIMATION ─────────────────────────────────────────────────────────
const roles  = ['Full Stack Developer', 'MERN Stack Dev', 'WebRTC Engineer', 'Open Source Fan', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  const current = roles[ri];
  if (!deleting) {
    typingEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typingEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 50 : 80);
}
type();

// ── NAV PILL ─────────────────────────────────────────────────────────────────
function updatePill(btn) {
  const pill    = document.getElementById('nav-pill');
  const navbar  = document.getElementById('navbar');
  const navRect = navbar.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  pill.style.left  = (btnRect.left - navRect.left) + 'px';
  pill.style.width = btnRect.width + 'px';
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────
function navigate(route) {
  // Update buttons
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.route === route);
    if (b.dataset.route === route) updatePill(b);
  });

  // Switch sections
  document.querySelectorAll('.page-section').forEach(s => {
    s.classList.remove('active');
  });
  const target = document.getElementById('sec-' + route);
  if (target) {
    target.classList.add('active');
    // Trigger skill bars on resume
    if (route === 'resume') animateSkillBars();
  }
}

// ── SKILL BAR ANIMATION ──────────────────────────────────────────────────────
function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.width = '0%';
    const w = bar.dataset.w;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { bar.style.width = w + '%'; });
    });
  });
}

// Subtle magnetic tilt on cards for a unique, tactile feel
function setupCardTilt() {
  const cards = document.querySelectorAll('.project-card, .service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;
      const rotateY = px * 6;
      const rotateX = py * -6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const firstBtn = document.querySelector('.nav-btn.active');
  if (firstBtn) updatePill(firstBtn);
  setupCardTilt();
});

window.addEventListener('resize', () => {
  const activeBtn = document.querySelector('.nav-btn.active');
  if (activeBtn) updatePill(activeBtn);
});
