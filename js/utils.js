/* ============================================================================
 *  工具层：主题色板 / 图表注册与懒加载 / 通用 ECharts 配置 / 数字滚动
 * ==========================================================================*/
(function (global) {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ------------------------------------------------ 主题色板 ---------------- */
  const PALETTE = {
    dark: {
      bg: 'transparent',
      ink0: '#f2f6ff', ink1: '#c8d4ec', ink2: '#8b9ac0', ink3: '#5d6b91',
      line: 'rgba(120,150,220,0.16)',
      split: 'rgba(120,150,220,0.13)',
      axis: 'rgba(120,150,220,0.28)',
      tooltipBg: 'rgba(8,13,28,0.94)',
      tooltipBorder: 'rgba(120,150,220,0.3)',
      label: '#c8d4ec',
      area0: 'rgba(34,211,238,0.02)'
    },
    light: {
      bg: 'transparent',
      ink0: '#0c1730', ink1: '#26324f', ink2: '#5a6a8c', ink3: '#8895b3',
      line: 'rgba(30,60,120,0.14)',
      split: 'rgba(30,60,120,0.12)',
      axis: 'rgba(30,60,120,0.26)',
      tooltipBg: 'rgba(255,255,255,0.97)',
      tooltipBorder: 'rgba(30,60,120,0.22)',
      label: '#26324f',
      area0: 'rgba(8,145,178,0.04)'
    }
  };

  const SERIES = ['#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#fb7185',
    '#38bdf8', '#fb923c', '#2dd4bf', '#818cf8', '#f472b6', '#a3e635', '#94a3b8'];

  const CALIBER_COLOR = {
    reported: '#38bdf8', target: '#a78bfa', forecast: '#fbbf24',
    estimated: '#fb923c', illustrative: '#94a3b8'
  };

  function themeName() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function T() { return PALETTE[themeName()]; }

  const FONT = '"PingFang SC","HarmonyOS Sans SC","Microsoft YaHei","Source Han Sans SC",-apple-system,"Segoe UI",sans-serif';

  /* ------------------------------------------------ 数字格式化 ------------ */
  function fmt(n, dec) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    const d = dec === undefined ? (Math.abs(n) >= 100 ? 0 : 1) : dec;
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  /* 千分位但不带小数（用于坐标轴） */
  function fmtAxis(n) {
    if (Math.abs(n) >= 10000) return (n / 10000) + '万';
    return Number(n).toLocaleString('zh-CN');
  }

  /* ------------------------------------------------ ECharts 通用片段 ------ */
  function grid(o) {
    return Object.assign({ left: 12, right: 18, top: 34, bottom: 8, containLabel: true }, o || {});
  }

  function tooltip(extra) {
    const t = T();
    return Object.assign({
      trigger: 'item',
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      borderWidth: 1,
      padding: [10, 13],
      textStyle: { color: t.ink0, fontSize: 13, fontFamily: FONT },
      extraCssText: 'border-radius:10px;box-shadow:0 18px 40px -20px rgba(0,0,0,.85);backdrop-filter:blur(6px);'
    }, extra || {});
  }

  function axisLabel(extra) {
    const t = T();
    return Object.assign({ color: t.ink2, fontSize: 12, fontFamily: FONT }, extra || {});
  }

  function catAxis(data, extra) {
    const t = T();
    return Object.assign({
      type: 'category',
      data: data,
      axisLine: { lineStyle: { color: t.axis } },
      axisTick: { show: false },
      axisLabel: axisLabel(),
      splitLine: { show: false }
    }, extra || {});
  }

  function valAxis(extra) {
    const t = T();
    return Object.assign({
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: axisLabel(),
      splitLine: { lineStyle: { color: t.split, type: 'dashed' } }
    }, extra || {});
  }

  /* 线性渐变 */
  function linGrad(from, to, vertical) {
    return vertical
      ? { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: from }, { offset: 1, color: to }] }
      : { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: from }, { offset: 1, color: to }] };
  }
  function alpha(hex, a) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  /* 口径标记 DOM */
  function caliberBadge(c) {
    return `<span class="caliber" data-c="${c}">${(global.DATASET.CALIBERS[c] || {}).label || c}</span>`;
  }

  /* ------------------------------------------------ 图表注册表 ------------ */
  const registry = [];
  /**
   * 注册一个 ECharts 图表
   * @param {string} id      容器 id
   * @param {Function} build (echarts, helpers) => option ｜ (echarts, helpers, el) => void
   * @param {Object} opts    { renderer, onInit }
   */
  function register(id, build, opts) {
    registry.push({ id, build, opts: opts || {} });
  }

  function buildAll(only) {
    registry.forEach(item => {
      if (only && item.id !== only) return;
      const el = document.getElementById(item.id);
      if (!el) { console.warn('[chart] 容器不存在:', item.id); return; }
      if (item.instance) { item.instance.dispose(); item.instance = null; }
      const inst = echarts.init(el, null, { renderer: (item.opts.renderer || 'canvas') });
      const out = item.build(echarts, { T, themeName, SERIES, FONT, CALIBER_COLOR, grid, tooltip, catAxis, valAxis, axisLabel, linGrad, alpha, fmt, fmtAxis });
      if (out) inst.setOption(out, true);
      item.instance = inst;
    });
  }

  function resizeAll() {
    registry.forEach(item => { if (item.instance) item.instance.resize(); });
  }

  /** 容器进入视口后再渲染，避免首屏一次性初始化十个图表 */
  const inited = new Set();
  function lazyInit() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const cands = registry.filter(r => el.contains(document.getElementById(r.id)) || el.id === r.id);
        cands.forEach(r => {
          if (inited.has(r.id)) return;
          inited.add(r.id);
          buildAll(r.id);
        });
        if (cands.length) io.unobserve(el);
      });
    }, { rootMargin: '220px 0px' });
    $$('section.chapter').forEach(s => io.observe(s));

    // 兜底：若 IntersectionObserver 未触发（例如被截图工具直接渲染），2.2s 后强制初始化
    setTimeout(() => {
      registry.forEach(r => {
        if (inited.has(r.id)) return;
        const el = document.getElementById(r.id);
        if (el) { inited.add(r.id); buildAll(r.id); }
      });
    }, 2200);
  }

  /* ------------------------------------------------ 数字滚动 -------------- */
  function countUp() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting || en.target.dataset.done) return;
        en.target.dataset.done = '1';
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.decimals || '0', 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const dur = 1300;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmt(target * eased, dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + fmt(target, dec) + suffix;
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    nodes.forEach(n => io.observe(n));
    setTimeout(() => nodes.forEach(n => {
      if (!n.dataset.done) { n.dataset.done = '1'; n.textContent = (n.dataset.prefix || '') + fmt(parseFloat(n.dataset.count), parseInt(n.dataset.decimals || '0', 10)) + (n.dataset.suffix || ''); }
    }), 3000);
  }

  /* ------------------------------------------------ 滚动入场 ------------ */
  function revealOnScroll() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
    // 兜底
    setTimeout(() => $$('.reveal').forEach(el => el.classList.add('in')), 2600);
  }

  global.VZ = {
    $, $$, T, themeName, PALETTE, SERIES, FONT, CALIBER_COLOR,
    fmt, fmtAxis, grid, tooltip, catAxis, valAxis, axisLabel, linGrad, alpha,
    caliberBadge, register, buildAll, resizeAll, lazyInit, countUp, revealOnScroll, inited
  };
})(window);
