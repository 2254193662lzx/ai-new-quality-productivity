/* ============================================================================
 *  Chapter 04 · 算力
 *  1) 智能算力规模：已公布值（实线面积）+ 机构预测（虚线）
 *  2) 算力结构：通用算力 / 智能算力 占比
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt } = window.VZ;
  const D = window.DATASET;

  register('chartCompute', (echarts, H) => {
    const t = H.T();
    const s = D.COMPUTE_SCALE.series;
    const rep = s.filter(d => d.caliber === 'reported');
    const fc = s.filter(d => d.caliber === 'forecast');

    /* 预测段从最后一个已公布点起笔，两条线自然衔接 */
    const fcPairs = [[rep[rep.length - 1].year, rep[rep.length - 1].value]]
      .concat(fc.map(d => [d.year, d.value]));

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 48, bottom: 12, left: 8, right: 26 }),
      tooltip: H.tooltip({
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: 'rgba(34,211,238,0.5)', type: 'dashed' } },
        formatter: p => {
          if (!p.length) return '';
          const yr = p[0].value[0];
          const rows = p.map(x => {
            const d = s.find(v => v.year === yr && Math.abs(v.value - x.value[1]) < 0.01);
            const tag = d && d.caliber === 'forecast' ? '<span style="color:#fbbf24">（预测）</span>' : '';
            return `${x.marker}${x.seriesName}：<b>${fmt(x.value[1], 1)}</b> EFLOPS ${tag}`;
          });
          const d = s.find(v => v.year === yr);
          return `<b>${yr} 年</b><br/>${rows.join('<br/>')}${d && d.note ? `<br/><span style="color:#8b9ac0">${d.note}</span>` : ''}`;
        }
      }),
      legend: {
        top: 4, right: 4, itemWidth: 16, itemHeight: 8, icon: 'roundRect',
        textStyle: { color: t.ink2, fontSize: 12, fontFamily: H.FONT }
      },
      xAxis: H.valAxis({
        min: 2022, max: 2028, interval: 1,
        axisLabel: H.axisLabel({ formatter: v => Math.round(v) }),
        splitLine: { show: false }
      }),
      yAxis: H.valAxis({
        name: 'EFLOPS', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
        axisLabel: H.axisLabel({ formatter: v => v >= 1000 ? (v / 1000) + 'k' : v })
      }),
      series: [
        {
          name: '已公布值', type: 'line', z: 3,
          data: rep.map(d => [d.year, d.value]),
          smooth: 0.28, symbol: 'circle', symbolSize: 10,
          itemStyle: { color: '#22d3ee', borderColor: 'rgba(34,211,238,0.3)', borderWidth: 6 },
          lineStyle: { width: 3.4, color: H.linGrad('#38bdf8', '#22d3ee') },
          areaStyle: { color: H.linGrad('rgba(34,211,238,0.38)', 'rgba(34,211,238,0.01)', true) },
          clip: false,
          label: {
            show: true, position: 'top', distance: 10, color: t.ink1,
            fontSize: 12, fontFamily: H.FONT, formatter: p => fmt(p.value[1], 1)
          }
        },
        {
          name: '机构预测值', type: 'line', z: 2,
          data: fcPairs,
          smooth: 0.28, symbol: 'emptyCircle', symbolSize: 9,
          itemStyle: { color: '#fbbf24', borderColor: 'rgba(251,191,36,0.28)', borderWidth: 5 },
          lineStyle: { width: 2.6, type: 'dashed', color: '#fbbf24' },
          areaStyle: { color: H.linGrad('rgba(251,191,36,0.2)', 'rgba(251,191,36,0.01)', true) },
          clip: false,
          label: {
            show: true, position: 'top', distance: 10, color: '#fbbf24',
            fontSize: 11.5, fontFamily: H.FONT, formatter: p => fmt(p.value[1], 1)
          }
        }
      ]
    };
  });

  register('chartComputeMix', (echarts, H) => {
    const t = H.T();
    const m = D.COMPUTE_MIX;
    const mk = (name, arr, color) => ({
      name, type: 'bar', stack: 'mix', barWidth: '46%',
      data: arr.map(d => ({ value: d.value, itemStyle: { color } })),
      itemStyle: { color, borderColor: 'rgba(4,7,15,0.5)', borderWidth: 1 },
      label: {
        show: true, position: 'inside', color: '#04070f', fontSize: 13, fontWeight: 700,
        fontFamily: H.FONT, formatter: p => p.value + '%'
      },
      emphasis: { itemStyle: { shadowBlur: 14, shadowColor: color } }
    });

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 44, bottom: 8, left: 8, right: 20 }),
      tooltip: H.tooltip({
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => `<b>${p[0].axisValue}</b><br/>` +
          p.map(x => `${x.marker}${x.seriesName}：<b>${x.value}%</b>`).join('<br/>')
      }),
      legend: {
        top: 4, right: 4, itemWidth: 16, itemHeight: 8, icon: 'roundRect',
        textStyle: { color: t.ink2, fontSize: 12, fontFamily: H.FONT }
      },
      xAxis: H.catAxis(m.categories, { axisLabel: H.axisLabel({ fontSize: 12.5 }) }),
      yAxis: H.valAxis({
        max: 100, name: '%', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
        splitLine: { show: false }, axisLabel: H.axisLabel({ formatter: '{value}%' })
      }),
      series: [
        mk('通用算力', m.general, 'rgba(148,163,184,0.65)'),
        mk('智能算力', m.intelligent, '#22d3ee')
      ]
    };
  });
})();
