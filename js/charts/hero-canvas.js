/* ============================================================================
 *  封面：Canvas 神经网络粒子场
 *  ---------------------------------------------------------------------------
 *  隐喻：每一个节点都是一个“数据/知识单元”，连线是模型学习到的关系。
 *  节点越密、连得越多，整体能力越强——这也是“网络效应”的视觉表达。
 * ==========================================================================*/
(function () {
  'use strict';

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, dpr = 1, nodes = [], raf = null;
  const mouse = { x: -9999, y: -9999 };
  const LINK_DIST = 148;

  const COLORS = ['#22d3ee', '#a78bfa', '#38bdf8'];

  function resize() {
    const host = canvas.parentElement;
    W = host.clientWidth;
    H = host.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(W * dpr));
    canvas.height = Math.max(1, Math.floor(H * dpr));
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const density = Math.round(Math.min(96, Math.max(34, (W * H) / 17000)));
    nodes = [];
    for (let i = 0; i < density; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.7 + 0.9,
        c: COLORS[i % COLORS.length],
        ph: Math.random() * Math.PI * 2
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    // 连线
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_DIST * LINK_DIST) continue;
        const d = Math.sqrt(d2);
        const o = (1 - d / LINK_DIST) * 0.34;
        ctx.strokeStyle = `rgba(120,190,240,${o.toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // 节点
    nodes.forEach(n => {
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 19000 && d2 > 0.01) {
        const f = (1 - d2 / 19000) * 0.55;
        const d = Math.sqrt(d2);
        n.vx += (dx / d) * f * 0.5;
        n.vy += (dy / d) * f * 0.5;
      }
      if (!reduce) {
        n.x += n.vx; n.y += n.vy;
        n.vx *= 0.988; n.vy *= 0.988;
        // 维持缓慢漂移，避免全部静止
        n.vx += (Math.random() - 0.5) * 0.012;
        n.vy += (Math.random() - 0.5) * 0.012;
      }
      if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;

      const tw = reduce ? 1 : 0.72 + 0.28 * Math.sin(performance.now() / 900 + n.ph);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.c;
      ctx.globalAlpha = 0.55 * tw;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    raf = requestAnimationFrame(step);
  }

  // 鼠标交互（不阻塞滚动）
  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });

  let rt = null;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 180); });

  resize();
  step();

  // 页面隐藏时暂停，节省资源
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(step);
  });

  window.HERO_CANVAS = { resize, pause() { cancelAnimationFrame(raf); raf = null; }, resume() { if (!raf) raf = requestAnimationFrame(step); } };
})();
