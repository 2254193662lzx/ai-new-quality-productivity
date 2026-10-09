/* ============================================================================
 *  Chapter 01 · 概念
 *  1) 三要素跃迁交互（DOM 切换）
 *  2) 四代通用目的技术“通用性”雷达图
 * ==========================================================================*/
(function () {
  'use strict';
  const { $, register, tooltip, T, FONT, SERIES, fmt } = window.VZ;
  const D = window.DATASET;

  /* ---------------------------------------------- 1. 三要素跃迁 ----------- */
  function buildFactors() {
    const sw = $('#factorSwitch'), panel = $('#factorPanel'), note = $('#factorNote');
    const grid = $('.factor-grid');
    if (!sw || !panel) return;
    const items = D.FACTORS.items;
    let cur = 0;

    sw.innerHTML = items.map((it, i) =>
      `<button data-i="${i}" class="${i === 0 ? 'on' : ''}"><span class="ic">${it.icon}</span>${it.name}</button>`
    ).join('');

    function render(i) {
      cur = i;
      const it = items[i];
      panel.innerHTML = `
        <div class="side">
          <div class="role">传统生产力中的${it.name}</div>
          <div class="txt">${it.before}</div>
        </div>
        <div class="arrow">
          <span class="shift">${it.shift}</span>
          <span class="glyph">→</span>
        </div>
        <div class="side after">
          <div class="role">人工智能时代的${it.name}</div>
          <div class="txt">${it.after}</div>
        </div>`;
      note.innerHTML = it.detail;
      Array.from(sw.children).forEach((b, k) => b.classList.toggle('on', k === i));
      if (grid) Array.from(grid.children).forEach((c, k) => c.classList.toggle('on', k === i));
    }

    sw.addEventListener('click', e => {
      const b = e.target.closest('button[data-i]');
      if (b) render(+b.dataset.i);
    });
    if (grid) grid.addEventListener('click', e => {
      const c = e.target.closest('.factor-mini');
      if (c) render(Array.from(grid.children).indexOf(c));
    });
    render(0);
    // 自动轮播，让三要素的对照关系不需要点击也能被看到
    setInterval(() => { if (!document.hidden) render((cur + 1) % items.length); }, 5200);
  }

  /* ---------------------------------------------- 2. 通用目的技术雷达 ----- */
  const GPT_COLOR = { '蒸汽机': '#94a3b8', '电力': '#f59e0b', '互联网': '#34d399', '人工智能': '#22d3ee' };

  register('chartGpt', (echarts, H) => {
    const t = H.T();
    const g = D.GPT_RADAR;
    const el = document.getElementById('chartGpt');
    /* 容器通常是“宽而扁”的卡片，用固定像素半径才能让雷达图不被高度压缩 */
    const h = el ? el.clientHeight : 460;
    const radius = Math.max(110, Math.min(178, h / 2 - 52));

    return {
      textStyle: { fontFamily: FONT },
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => {
          const rows = g.indicators.map((ind, i) =>
            `<div style="display:flex;justify-content:space-between;gap:20px">
               <span style="color:${p.color}">${ind.name}</span><b>${p.value[i]}</b></div>`).join('');
          return `<b>${p.name}</b><br/>${rows}`;
        }
      }),
      legend: {
        bottom: 0, itemGap: 16, icon: 'roundRect', itemWidth: 14, itemHeight: 9,
        textStyle: { color: t.ink2, fontSize: 12.5, fontFamily: FONT },
        data: g.series.map(s => s.name)
      },
      radar: {
        center: ['50%', '47%'],
        radius: radius,
        indicator: g.indicators,
        splitNumber: 4,
        axisName: { color: t.ink1, fontSize: 12.5, fontFamily: FONT },
        splitLine: { lineStyle: { color: t.split } },
        splitArea: { areaStyle: { color: ['rgba(34,211,238,0.03)', 'rgba(167,139,250,0.045)'] } },
        axisLine: { lineStyle: { color: t.split } }
      },
      series: [{
        type: 'radar',
        symbolSize: 5,
        emphasis: { focus: 'series', lineStyle: { width: 3.4 } },
        data: g.series.map(s => {
          const isAI = s.name === '人工智能';
          const c = GPT_COLOR[s.name];
          return {
            name: s.name,
            value: s.values,
            symbol: isAI ? 'circle' : 'emptyCircle',
            lineStyle: { width: isAI ? 3 : 1.8, type: isAI ? 'solid' : 'dashed', color: c },
            itemStyle: { color: c, borderWidth: 0 },
            areaStyle: { color: H.alpha(c, isAI ? 0.28 : 0.07) },
            z: isAI ? 5 : 2
          };
        })
      }]
    };
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFactors);
  else buildFactors();
})();
