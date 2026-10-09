/* ============================================================================
 *  应用层：导航 / 主题切换 / 阅读进度 / 数字滚动 / 数据来源索引
 * ==========================================================================*/
(function () {
  'use strict';
  const VZ = window.VZ;
  const { $, $$, fmt } = VZ;
  const D = window.DATASET;

  /* ============================ 1. 主题 ============================ */
  function initTheme() {
    const saved = (() => { try { return localStorage.getItem('vz-theme'); } catch (e) { return null; } })();
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    $('#btnTheme').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('vz-theme', next); } catch (e) { }
      /* 图表需要按新主题重建（ECharts 的颜色在 option 里写死，重建最稳） */
      VZ.inited.forEach(id => VZ.buildAll(id));
      window.dispatchEvent(new Event('vz:theme'));
    });
  }

  /* ============================ 2. 进度与导航 ============================ */
  function initNav() {
    const sections = $$('section.chapter');
    const side = $('#sidenav');

    side.innerHTML = sections.map((s, i) =>
      `<button data-t="${s.id}" title="${s.dataset.chapter}">
         <span class="lbl">${s.dataset.chapter}</span><span class="dot"></span>
       </button>`).join('');

    const dots = Array.from(side.children);
    const topLinks = Array.from($$('#topnav a'));

    dots.forEach(b => b.addEventListener('click', () => {
      const el = document.getElementById(b.dataset.t);
      window.scrollTo({ top: el.offsetTop - 62, behavior: 'smooth' });
    }));

    const setActive = (id) => {
      dots.forEach(b => b.classList.toggle('active', b.dataset.t === id));
      topLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    const io = new IntersectionObserver(es => {
      /* 视口内最靠上的章节即为当前章节 */
      const vis = es.filter(e => e.isIntersecting)
        .sort((a, b) => a.target.offsetTop - b.target.offsetTop);
      if (vis.length) setActive(vis[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));

    /* 滚动进度条 + 首屏后顶栏加深 */
    const bar = $('#progressBar');
    let raf = null;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        raf = null;
      });
    }, { passive: true });
  }

  /* ============================ 3. 数据来源 / 口径图例 ============================ */
  function initSources() {
    const key = $('#caliberKey');
    if (key) {
      const ORDER = ['reported', 'target', 'forecast', 'estimated', 'illustrative'];
      key.innerHTML = ORDER.map(k => {
        const c = D.CALIBERS[k];
        return `<div class="ck">
          <span class="caliber" data-c="${k}">${c.label}</span>
          <div class="d">${c.desc}</div>
        </div>`;
      }).join('');
    }

    const list = $('#srcList');
    if (!list) return;
    /* 反向索引：每个来源被哪些数据集引用，方便核对 */
    const used = {};
    Object.keys(D).forEach(k => {
      const v = D[k];
      if (!v || !v.sources || !v.title) return;
      v.sources.forEach(s => { (used[s] = used[s] || []).push(v.title); });
    });

    list.innerHTML = Object.keys(D.SOURCES).map(k => {
      const s = D.SOURCES[k];
      const u = used[k] || [];
      return `<div class="src-item">
        <div class="nm">${s.label}</div>
        <div class="dt">${s.detail}</div>
        ${u.length ? `<div class="used">用于：${u.join(' · ')}</div>` : ''}
      </div>`;
    }).join('');
  }

  /* ============================ 5. 启动 ============================ */
  function boot() {
    initTheme();
    initNav();
    initSources();

    VZ.revealOnScroll();
    VZ.countUp();
    VZ.lazyInit();

    /* 首屏内的图表立即构建，避免等待懒加载 */
    window.requestAnimationFrame(() => {
      ['chartGpt', 'chartSunburst'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { VZ.inited.add(id); VZ.buildAll(id); }
      });
    });

    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => VZ.resizeAll(), 200);
    });

    console.log('%c人工智能 · 新质生产力', 'background:linear-gradient(90deg,#22d3ee,#a78bfa);color:#04070f;padding:2px 8px;border-radius:4px;font-weight:700',
      '\n图表已注册：' + VZ.inited.size + ' 个\n点击顶栏“主题”按钮可切换深 / 浅配色。');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
