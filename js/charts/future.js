/* ============================================================================
 *  Chapter 10 · 未来
 *  1) 演进路线时间轴（DOM）
 *  2) 新质生产力指数（示意）折线图
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt, $ } = window.VZ;
  const D = window.DATASET;

  /* ---------------------------------------------- 1. 时间轴 -------------- */
  function buildTimeline() {
    const host = $('#timeline');
    if (!host) return;
    host.innerHTML = D.FUTURE_TIMELINE.milestones.map(m => `
      <div class="tl-item" data-c="${m.caliber}">
        <div class="yr">${m.year}</div>
        <div class="tt">${m.title}</div>
        <div class="td">${m.desc}</div>
      </div>`).join('');
  }

  /* ---------------------------------------------- 2. 指数曲线 ------------ */
  register('chartIndex', (echarts, H) => {
    const t = H.T();
    const s = D.NQP_INDEX.series;
    /* 用类目轴：年份等距，且不会出现重复的 2030 刻度。
       类目轴上 x 必须是类目「索引」，因此这里把年份映射为下标 */
    const years = [];
    for (let y = 2020; y <= 2030; y++) years.push(y);
    const seriesData = s.map(d => [years.indexOf(d.year), d.value]);

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 40, bottom: 8, left: 8, right: 30 }),
      tooltip: H.tooltip({
        trigger: 'axis',
        formatter: p => `<b>${years[p[0].value[0]]} 年</b><br/>新质生产力指数：<b>${fmt(p[0].value[1])}</b><br/><span style="color:#8b9ac0">以 2020 年 = 100 为基准（示意）</span>`
      }),
      xAxis: H.catAxis(years.map(String), {
        boundaryGap: false,
        axisLabel: H.axisLabel({ interval: 1, fontSize: 12 })
      }),
      yAxis: H.valAxis({
        name: '指数', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
        max: 1200, interval: 200
      }),
      series: [
        {
          type: 'line',
          data: seriesData,
          smooth: 0.3,
          symbol: 'circle', symbolSize: 7,
          itemStyle: { color: '#a78bfa', borderColor: 'rgba(167,139,250,0.28)', borderWidth: 5 },
          lineStyle: { width: 3, color: H.linGrad('#22d3ee', '#a78bfa') },
          areaStyle: { color: H.linGrad('rgba(167,139,250,0.35)', 'rgba(34,211,238,0.02)', true) },
          clip: false,
          label: {
            show: true, position: 'top', distance: 8, color: t.ink1,
            fontSize: 11, fontFamily: H.FONT, formatter: p => fmt(p.value[1]),
            /* 描边避免左下角首个数值标签与纵轴刻度粘连 */
            textBorderColor: H.themeName() === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(9,14,28,0.92)',
            textBorderWidth: 3.5
          },
          markLine: {
            silent: true, symbol: 'none',
            lineStyle: { color: 'rgba(148,163,184,0.5)', type: 'dashed' },
            label: {
              color: t.ink3, fontSize: 11, fontFamily: H.FONT,
              /* 基准说明放在右端空白处，避免压住起点附近的数据点 */
              formatter: '2020 基准 = 100', position: 'insideEndTop'
            },
            data: [{ yAxis: 100 }]
          }
        }
      ]
    };
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildTimeline);
  else buildTimeline();
})();
