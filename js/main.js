/* ============================================================
   SANJEEB RAI — PORTFOLIO SCRIPTS
   File: js/main.js
   ============================================================ */

/* ============================================================
   1. CANVAS BUTTERFLY ANIMATION
   Works on all browsers and GitHub Pages — no CSS dependency
   ============================================================ */
(function () {
  var canvas = document.getElementById('butterflyCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  /* Resize canvas to match its CSS size */
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Detect accent color from CSS variable */
  function getAccent() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    return v || '#c8ff00';
  }

  /* 5 butterflies — different sizes, positions, speeds */
  var butterflies = [
    { x: 0.75, y: 0.28, size: 42, floatSpeed: 0.0007, flapSpeed: 0.08,  t: 0,   ft: 0   },
    { x: 0.85, y: 0.55, size: 26, floatSpeed: 0.0010, flapSpeed: 0.10,  t: 1.2, ft: 0.5 },
    { x: 0.65, y: 0.50, size: 55, floatSpeed: 0.0005, flapSpeed: 0.055, t: 2.5, ft: 1.0 },
    { x: 0.90, y: 0.20, size: 20, floatSpeed: 0.0013, flapSpeed: 0.13,  t: 0.8, ft: 1.8 },
    { x: 0.78, y: 0.72, size: 34, floatSpeed: 0.0009, flapSpeed: 0.09,  t: 3.0, ft: 2.4 }
  ];

  /* Draw one butterfly at position (cx, cy) with given size & flapAngle */
  function drawButterfly(cx, cy, size, flapAngle, color) {
    ctx.save();
    ctx.translate(cx, cy);

    /* glow */
    ctx.shadowColor = color;
    ctx.shadowBlur  = 14;

    var s  = size;
    var fw = Math.abs(Math.cos(flapAngle)); /* wing open factor 0–1 */

    /* ── LEFT WINGS ── */
    ctx.save();
    ctx.scale(-fw, 1); /* mirror/flap */

    /* upper left wing */
    ctx.beginPath();
    ctx.ellipse(-s * 0.3, -s * 0.25, s * 0.55, s * 0.38, -0.35, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.82;
    ctx.fill();

    /* lower left wing */
    ctx.beginPath();
    ctx.ellipse(-s * 0.28, s * 0.18, s * 0.38, s * 0.24, 0.26, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.65;
    ctx.fill();

    ctx.restore();

    /* ── RIGHT WINGS ── */
    ctx.save();
    ctx.scale(fw, 1);

    /* upper right wing */
    ctx.beginPath();
    ctx.ellipse(s * 0.3, -s * 0.25, s * 0.55, s * 0.38, 0.35, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.82;
    ctx.fill();

    /* lower right wing */
    ctx.beginPath();
    ctx.ellipse(s * 0.28, s * 0.18, s * 0.38, s * 0.24, -0.26, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.65;
    ctx.fill();

    ctx.restore();

    /* ── BODY ── */
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.06, s * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    /* ── ANTENNAE ── */
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.25);
    ctx.quadraticCurveTo(-s * 0.25, -s * 0.55, -s * 0.35, -s * 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.25);
    ctx.quadraticCurveTo(s * 0.25, -s * 0.55, s * 0.35, -s * 0.65);
    ctx.stroke();

    /* antenna tips */
    ctx.globalAlpha = 0.9;
    ctx.fillStyle   = color;
    ctx.beginPath(); ctx.arc(-s * 0.35, -s * 0.65, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc( s * 0.35, -s * 0.65, 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  var lastTime = 0;

  function animate(now) {
    requestAnimationFrame(animate);

    var dt = now - lastTime;
    lastTime = now;
    if (dt > 100) dt = 100; /* cap on tab switch */

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var color = getAccent();
    var W = canvas.width;
    var H = canvas.height;

    butterflies.forEach(function (b) {
      b.t  += b.floatSpeed * dt;
      b.ft += b.flapSpeed;

      /* gentle figure-8 float path */
      var ox = Math.sin(b.t * 1.3) * 28;
      var oy = Math.sin(b.t)       * 36;

      var cx = b.x * W + ox;
      var cy = b.y * H + oy;

      /* subtle body tilt following movement direction */
      drawButterfly(cx, cy, b.size, b.ft, color);
    });
  }

  requestAnimationFrame(animate);
})();

/* ============================================================
   2. HAMBURGER MENU
   ============================================================ */
var hamburger = document.getElementById('hamburger');
var navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', function () {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   3. TYPING WORD ROTATOR
   ============================================================ */
var words     = ['thoughtful', 'creative', 'elegant', 'precise', 'bold'];
var wordIndex = 0;
var typedEl   = document.getElementById('typedWord');

setInterval(function () {
  typedEl.style.cssText = 'opacity:0;transform:translateY(-8px);transition:opacity 0.3s,transform 0.3s';
  setTimeout(function () {
    wordIndex = (wordIndex + 1) % words.length;
    typedEl.textContent = words[wordIndex];
    typedEl.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity 0.3s,transform 0.3s';
  }, 320);
}, 2200);

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ============================================================
   5. SKILL TAGS STAGGER
   ============================================================ */
var skillsGrid = document.getElementById('skillsGrid');

new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    Array.from(skillsGrid.children).forEach(function (tag, i) {
      tag.style.transitionDelay = (i * 0.07) + 's';
    });
    skillsGrid.classList.add('skills-visible');
  }
}, { threshold: 0.2 }).observe(skillsGrid);

/* ============================================================
   6. SKILL BARS
   ============================================================ */
new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    entries[0].target.querySelectorAll('.skill-bar-fill').forEach(function (bar, i) {
      setTimeout(function () {
        bar.style.width = bar.dataset.width + '%';
      }, i * 120);
    });
  }
}, { threshold: 0.2 }).observe(document.getElementById('skillBars'));

/* ============================================================
   7. STAT COUNTERS
   ============================================================ */
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var el     = entry.target;
    var target = parseInt(el.dataset.target, 10);
    var dur    = 1600;
    var start  = null;

    function step(ts) {
      if (!start) start = ts;
      var p     = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) { requestAnimationFrame(step); }
      else        { el.textContent = target + '+'; }
    }

    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(function (el) {
  counterObserver.observe(el);
});

/* ============================================================
   8. PROJECT CARDS 3D TILT
   ============================================================ */
document.querySelectorAll('.project-card').forEach(function (card) {
  card.addEventListener('mousemove', function (e) {
    var rect = card.getBoundingClientRect();
    var x    = (e.clientX - rect.left) / rect.width  - 0.5;
    var y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform  = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
    card.style.transition = 'border-color 0.3s';
  });
  card.addEventListener('mouseleave', function () {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s ease, border-color 0.3s';
  });
});

/* ============================================================
   9. PARALLAX HERO BG TEXT
   ============================================================ */
var heroBgText = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', function () {
  if (heroBgText) {
    heroBgText.style.transform = 'translate(-50%, calc(-50% + ' + (window.scrollY * 0.28) + 'px))';
  }
}, { passive: true });

/* ============================================================
   10. STICKY NAVBAR
   ============================================================ */
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ============================================================
   11. ACTIVE NAV LINK
   ============================================================ */
var navSectionIds = ['hero', 'about', 'work', 'contact'];
var navAnchors    = {};

navSectionIds.forEach(function (id) {
  navAnchors[id] = document.querySelector('.nav-link[href="#' + id + '"]');
});

function updateActiveNav() {
  var current = 'hero';
  navSectionIds.forEach(function (id) {
    var section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 140) current = id;
  });
  navSectionIds.forEach(function (id) {
    navAnchors[id].classList.toggle('active', id === current);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ============================================================
   12. THEME TOGGLE
   ============================================================ */
var themeBtn   = document.getElementById('themeToggle');
var themeIcon  = document.getElementById('themeIcon');
var themeLabel = document.getElementById('themeLabel');

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeIcon.textContent  = '🌙';
  themeLabel.textContent = 'Dark';
}

themeBtn.addEventListener('click', function () {
  var isLight        = document.body.classList.toggle('light');
  themeIcon.textContent  = isLight ? '🌙' : '☀️';
  themeLabel.textContent = isLight ? 'Dark' : 'Light';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
