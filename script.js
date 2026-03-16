/* ══════════════════════════════════════
   LEITE CAMPOS CONSULTORIA — script.js
   ══════════════════════════════════════ */

// ─────────────────────────────────────
// 1. PARTICLES BACKGROUND
// ─────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('ptc');
  const ctx    = canvas.getContext('2d');
  let pts      = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeParticles() {
    pts = [];
    for (let i = 0; i < 55; i++) {
      pts.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.3 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.body.classList.contains('dark');
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(82,183,136,0.32)' : 'rgba(45,106,79,0.22)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); makeParticles(); });
  resize();
  makeParticles();
  draw();
})();


// ─────────────────────────────────────
// 2. NETWORK CANVAS (hero right)
// ─────────────────────────────────────
(function initNetwork() {
  const canvas = document.getElementById('netC');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let nW, nH, nodes = [], mouse = { x: -999, y: -999 };

  function resize() {
    const parent = canvas.parentElement;
    nW = canvas.width  = parent.offsetWidth;
    nH = canvas.height = parent.offsetHeight;
  }

  function makeNodes() {
    nodes = [];
    const count = Math.max(12, Math.floor(nW * nH / 8000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x:  Math.random() * nW,
        y:  Math.random() * nH,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 1.8 + 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, nW, nH);
    const isDark = document.body.classList.contains('dark');
    const col    = isDark ? 'rgba(82,183,136,' : 'rgba(45,106,79,';

    nodes.forEach((n, i) => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > nW) n.vx *= -1;
      if (n.y < 0 || n.y > nH) n.vy *= -1;

      // draw node
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = col + '0.55)';
      ctx.fill();

      // connect nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = col + ((1 - d / 120) * 0.18) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // connect to mouse
      const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (dm < 100) {
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = col + ((1 - dm / 100) * 0.4) + ')';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  }

  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', () => { resize(); makeNodes(); });
  resize();
  makeNodes();
  draw();
})();


// ─────────────────────────────────────
// 3. THEME TOGGLE (ripple curtain)
// ─────────────────────────────────────
(function initTheme() {
  let dark = false;
  const btn     = document.getElementById('tgl');
  const curtain = document.getElementById('curtain');

  btn.addEventListener('click', function (e) {
    curtain.style.setProperty('--x', e.clientX + 'px');
    curtain.style.setProperty('--y', e.clientY + 'px');
    curtain.style.background = dark ? '#FAFAF8' : '#090D13';
    curtain.classList.add('open');

    setTimeout(() => {
      dark = !dark;
      document.body.classList.toggle('dark', dark);
      // reset curtain without animation, then re-enable
      curtain.style.transition = 'none';
      curtain.classList.remove('open');
      void curtain.offsetWidth; // force reflow
      curtain.style.transition = 'clip-path 0.7s cubic-bezier(0.77,0,0.18,1)';
    }, 350);
  });
})();


// ─────────────────────────────────────
// 4. SCROLL PROGRESS BAR
// ─────────────────────────────────────
(function initProgress() {
  const bar = document.getElementById('prog');
  window.addEventListener('scroll', () => {
    const s   = document.documentElement;
    const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


// ─────────────────────────────────────
// 5. SCROLL REVEAL
// ─────────────────────────────────────
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('on');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.sr, .sr-l, .sr-r').forEach(el => io.observe(el));
})();


// ─────────────────────────────────────
// 6. COUNTER ANIMATION
// ─────────────────────────────────────
(function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target._done) {
        e.target._done = true;
        e.target.querySelectorAll('.ctr-n').forEach(el => {
          const target = +el.dataset.to;
          const suffix = el.dataset.s || '';
          const dur    = 1600;
          const start  = Date.now();

          (function tick() {
            const p = Math.min(1, (Date.now() - start) / dur);
            el.textContent = Math.round(p * p * target) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })();
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.counters').forEach(el => io.observe(el));
})();


// ─────────────────────────────────────
// 7. STAGGER CARD ENTRANCE
// ─────────────────────────────────────
(function initStagger() {
  const targets = ['.ps-side', '.pricing-grid'];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(wrap => {
      const cards = wrap.querySelectorAll('.ps-row, .pcard');
      cards.forEach(c => {
        c.style.opacity   = '0';
        c.style.transform = 'translateY(18px)';
        c.style.transition = 'opacity 0.55s ease, transform 0.55s ease, background 0.7s, border-color 0.7s, box-shadow 0.25s';
      });

      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            cards.forEach((c, i) => {
              setTimeout(() => {
                c.style.opacity   = '1';
                c.style.transform = 'translateY(0)';
              }, i * 80);
            });
            io.disconnect();
          }
        });
      }, { threshold: 0.08 });

      io.observe(wrap);
    });
  });
})();


// ─────────────────────────────────────
// 8. SOCIAL PROOF TOAST
// ─────────────────────────────────────
(function initToasts() {
  const toasts = [
    { av: 'MF', name: 'Marcos F.',  msg: 'solicitou diagnóstico gratuito' },
    { av: 'AC', name: 'Ana C.',     msg: 'agendou uma consultoria'        },
    { av: 'RB', name: 'Rafael B.',  msg: 'fechou o plano Profissional'    },
    { av: 'JL', name: 'Juliana L.', msg: 'solicitou diagnóstico gratuito' },
    { av: 'PT', name: 'Paulo T.',   msg: 'entrou em contato agora'        },
  ];

  let index = 0;
  const toast   = document.getElementById('toast');
  const elAv    = document.getElementById('t-av');
  const elName  = document.getElementById('t-name');
  const elMsg   = document.getElementById('t-msg');

  function show() {
    const d      = toasts[index++ % toasts.length];
    elAv.textContent   = d.av;
    elName.textContent = d.name;
    elMsg.textContent  = d.msg;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
    setTimeout(show, 7000 + Math.random() * 4000);
  }

  setTimeout(show, 3500);
})();


// ─────────────────────────────────────
// 9. URGENCY COUNTDOWN
// ─────────────────────────────────────
(function initUrgency() {
  let count = 5;
  const el  = document.getElementById('urg-n');

  setInterval(() => {
    if (count > 1) {
      count--;
      if (el) el.textContent = count;
    }
  }, 20000);
})();


// ─────────────────────────────────────
// 10. CTA FORM VALIDATION
// ─────────────────────────────────────
(function initCta() {
  const btn = document.getElementById('cta-btn');
  const inp = document.getElementById('cta-email');
  if (!btn || !inp) return;

  btn.addEventListener('click', () => {
    if (!inp.value || !inp.value.includes('@')) {
      inp.style.borderColor = '#E53935';
      inp.focus();
      return;
    }
    inp.style.borderColor = 'var(--gl)';
    btn.textContent       = '✓ Enviado! Retornaremos em breve.';
    btn.style.background  = 'var(--g)';

    setTimeout(() => {
      btn.textContent      = 'Quero o diagnóstico grátis →';
      btn.style.background = '';
      inp.style.borderColor = '';
      inp.value            = '';
    }, 4000);
  });
})();


// ─────────────────────────────────────
// 11. CARLOS — INTERACTIVE MASCOT
// ─────────────────────────────────────
(function initCarlos() {
  const carlos  = document.getElementById('carlos');
  const bubble  = document.getElementById('bubble');
  const bubbleTxt = document.getElementById('bubble-txt');
  if (!carlos || !bubble) return;

  // Speech lines that Carlos says
  const speeches = [
    'Sua rede está ótima! 👍',
    'Nenhuma falha detectada ✅',
    'Monitorando em tempo real 📊',
    'Infovista ativo e operante 📡',
    'Uptime: 99.8% — perfeito! 🚀',
    'Segurança garantida 🛡️',
    'Olá! Posso te ajudar? 😄',
    'Detectando gargalos... 🔍',
    'Latência: 2ms — excelente! ⚡',
  ];

  let speechIdx = 0;

  function triggerSpeech(text) {
    bubbleTxt.textContent = text;
    // Re-trigger animation
    bubble.style.animation = 'none';
    void bubble.offsetWidth;
    bubble.style.animation = 'bubblePop 0.4s cubic-bezier(0.77,0,0.18,1) both';
  }

  // Hover: show random speech
  carlos.addEventListener('mouseenter', () => {
    const line = speeches[speechIdx++ % speeches.length];
    triggerSpeech(line);
  });

  // Click: wave animation + special message
  carlos.addEventListener('click', () => {
    triggerSpeech('Precisando de suporte? Me chama! 😄');

    // Make the arms wave
    const armL = document.getElementById('arm-l');
    const armR = document.getElementById('arm-r');
    if (armL && armR) {
      armL.style.animation = 'waveArm 0.6s ease-in-out 3';
      armR.style.animation = 'waveArmR 0.6s ease-in-out 3';
      setTimeout(() => {
        armL.style.animation = '';
        armR.style.animation = '';
      }, 1800);
    }
  });

  // Auto speech cycle every 5 seconds
  setInterval(() => {
    const line = speeches[speechIdx++ % speeches.length];
    triggerSpeech(line);
  }, 5000);

  // Mouse tracking — Carlos looks at cursor
  document.addEventListener('mousemove', (e) => {
    const rect  = carlos.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const dist  = Math.min(3, Math.hypot(e.clientX - cx, e.clientY - cy) / 80);

    const eyeL = document.getElementById('eye-l');
    const eyeR = document.getElementById('eye-r');
    if (!eyeL || !eyeR) return;

    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    eyeL.style.transform = `translate(${dx}px, ${dy}px)`;
    eyeR.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  // Inject keyframes for arm waving dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes waveArm {
      0%   { transform: rotate(0deg);   transform-origin: right center; }
      30%  { transform: rotate(-20deg); transform-origin: right center; }
      70%  { transform: rotate(15deg);  transform-origin: right center; }
      100% { transform: rotate(0deg);   transform-origin: right center; }
    }
    @keyframes waveArmR {
      0%   { transform: rotate(0deg);  transform-origin: left center; }
      30%  { transform: rotate(20deg); transform-origin: left center; }
      70%  { transform: rotate(-15deg);transform-origin: left center; }
      100% { transform: rotate(0deg);  transform-origin: left center; }
    }
  `;
  document.head.appendChild(style);
})();