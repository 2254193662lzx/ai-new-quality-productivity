/* ============================================================================
 *  Chapter 05 · 产业规模
 *  1) 核心产业规模：已公布柱 + 推算虚线 + 规划目标点线
 *  2) “从 1500 亿到 1 万亿”进度条（DOM 组件）
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt, $ } = window.VZ;
  const D = window.DATASET;

  const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  register('chartIndustry', (echarts, H) => {
    const t = H.T();
    const A = D.AI_INDUSTRY_SCALE;

    const actualMap = {}; A.actual.forEach(d => actualMap[d.year] = d);
    const fcMap = {}; A.forecast.forEach(d => fcMap[d.year] = d);
    const tgMap = {}; A.targets.forEach(d => tgMap[d.year] = d);

    const barData = YEARS.map(y => {
      const d = actualMap[y];
      return d ? { value: d.value, note: d.note } : null;
    });

    /* 推算段与规划目标段都从 2024 年已公布值起笔，保证三段曲线视觉连贯 */
    const fcData = YEARS.map(y => fcMap[y] ? fcMap[y].value : (y === 2024 ? actualMap[2024].value : null));
    const tgData = YEARS.map(y => tgMap[y] ? tgMap[y].value : null);

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 54, bottom: 14, left: 10, right: 26 }),
      tooltip: H.tooltip({
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(34,211,238,0.06)' } },
        formatter: p => {
          const y = +p[0].axisValue;
          const out = [`<b>${y} 年</b>`];
          if (actualMap[y]) out.push(`<span style="color:#22d3ee">●</span> 已公布规模：<b>${fmt(actualMap[y].value)}</b> 亿元`);
          if (fcMap[y]) out.push(`<span style="color:#fbbf24">●</span> 趋势推算：<b>${fmt(fcMap[y].value)}</b> 亿元 <span style="color:#8b9ac0">（估算）</span>`);
          if (tgMap[y]) out.push(`<span style="color:#a78bfa">●</span> 国家规划目标：<b>${fmt(tgMap[y].value)}</b> 亿元`);
          const n = actualMap[y] || fcMap[y] || tgMap[y];
          if (n && n.note) out.push(`<span style="color:#8b9ac0">${n.note}</span>`);
          return out.join('<br/>');
        }
      }),
      legend: {
        top: 4, right: 4, itemWidth: 16, itemHeight: 8, icon: 'roundRect',
        textStyle: { color: t.ink2, fontSize: 12, fontFamily: H.FONT },
        data: ['已公布规模', '趋势推算（估算）', '国家规划目标']
      },
      xAxis: H.catAxis(YEARS.map(String), {
        axisLabel: H.axisLabel({ fontSize: 11.5, formatter: v => v.slice(2) + '年' })
      }),
      yAxis: H.valAxis({
        name: '亿元', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
        max: 20000, interval: 4000,
        axisLabel: H.axisLabel({ formatter: v => v === 0 ? '0' : (v / 10000) + '万' })
      }),
      series: [
        {
          name: '已公布规模', type: 'bar', z: 2,
          barWidth: '42%',
          data: barData,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: H.linGrad('#22d3ee', 'rgba(34,211,238,0.22)', true),
            borderColor: 'rgba(34,211,238,0.55)', borderWidth: 1
          },
          label: {
            show: true, position: 'top', distance: 7, color: t.ink1,
            fontSize: 11.5, fontFamily: H.FONT, formatter: p => fmt(p.value)
          },
          markPoint: {
            symbol: 'pin', symbolSize: 0,
            label: { show: false }, data: []
          }
        },
        {
          name: '趋势推算（估算）', type: 'line', z: 4, smooth: 0.25,
          symbol: 'emptyCircle', symbolSize: 7,
          data: fcData,
          itemStyle: { color: '#fbbf24' },
          lineStyle: { width: 2.4, type: 'dashed', color: '#fbbf24' },
          label: {
            show: true, position: 'top', distance: 8, color: '#fbbf24',
            fontSize: 10.5, fontFamily: H.FONT,
            /* 2024 年这个点与柱状图重合，避免两个标签叠在一起 */
            formatter: p => (p.dataIndex === 4 ? '' : fmt(p.value))
          }
        },
        {
          name: '国家规划目标', type: 'line', z: 5,
          symbol: 'diamond', symbolSize: 11,
          data: tgData,
          itemStyle: { color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', borderWidth: 5 },
          lineStyle: { width: 2, type: 'dotted', color: '#a78bfa' },
          label: {
            show: true, position: 'bottom', distance: 8, color: '#a78bfa',
            fontSize: 11, fontFamily: H.FONT,
            /* 2020 年目标值与实际值同为 1500，只保留柱状图标签，避免重叠 */
            formatter: p => (p.dataIndex === 0 ? '' : '目标 ' + fmt(p.value))
          }
        }
      ]
    };
  });

  /* ------------------------------------------- “从 1500 亿到 1 万亿” ------- */
  function buildMillionBar() {
    const host = $('#millionBar');
    if (!host) return;
    const A = D.AI_INDUSTRY_SCALE;
    const FULL = 10000; // 2030 年规划目标，作为满刻度

    const rows = [
      { label: '2020 年实际', value: 1500, kind: 'reported', note: '达成规划“超 1500 亿元”' },
      { label: '2024 年实际', value: 6000, kind: 'reported', note: '工信部：接近 6000 亿元' },
      { label: '2025 年目标', value: 4000, kind: 'target', note: '2017 年规划设定，已被实际值越过' },
      { label: '2030 年目标', value: FULL, kind: 'target', note: '规划目标 1 万亿元（满刻度）' }
    ];

    host.innerHTML = rows.map((r, i) => {
      const pct = Math.min(100, r.value / FULL * 100);
      const cls = r.kind === 'target' ? 'target' : 'reported';
      return `<div class="mbar-row ${cls}" data-i="${i}">
        <div class="lb">${r.label}</div>
        <div class="mbar-track"><i class="mbar-fill" data-pct="${pct}"></i></div>
        <div class="vl">${fmt(r.value)} <span>亿元</span></div>
        <div class="nt">${r.note}</div>
      </div>`;
    }).join('');

    const animate = () => {
      host.querySelectorAll('.mbar-fill').forEach((el, i) => {
        setTimeout(() => { el.style.width = el.dataset.pct + '%'; }, 120 + i * 130);
      });
    };
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { animate(); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(host);
    setTimeout(animate, 3200); // 兜底（截图/无滚动场景）
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildMillionBar);
  else buildMillionBar();
})();
