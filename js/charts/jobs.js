/* ============================================================================
 *  Chapter 09 · 就业结构
 *  蝴蝶图（背靠背条形图）：各行业岗位的创造与替代
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt } = window.VZ;
  const D = window.DATASET;

  register('chartJobs', (echarts, H) => {
    const t = H.T();
    const rows = D.JOBS.byIndustry.slice().reverse(); // 从上到下：客服销售 → 农业一线

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 46, bottom: 10, left: 10, right: 24 }),
      tooltip: H.tooltip({
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(34,211,238,0.06)' } },
        formatter: p => {
          const name = p[0].axisValue;
          const row = rows.find(r => r.name === name) || {};
          const net = (row.created || 0) - (row.displaced || 0);
          return `<b>${name}</b><br/>
            <span style="color:#34d399">●</span> 新增岗位：<b>${fmt(row.created)}</b> 万人<br/>
            <span style="color:#fb7185">●</span> 被替代岗位：<b>${fmt(row.displaced)}</b> 万人<br/>
            <span style="color:${net >= 0 ? '#34d399' : '#fb7185'}">●</span> 净变化：<b>${net >= 0 ? '+' : ''}${fmt(net)}</b> 万人`;
        }
      }),
      legend: {
        top: 4, right: 4, itemWidth: 16, itemHeight: 8, icon: 'roundRect',
        textStyle: { color: t.ink2, fontSize: 12, fontFamily: H.FONT },
        data: ['被替代岗位', '新增岗位']
      },
      xAxis: H.valAxis({
        name: '万人', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
        axisLabel: H.axisLabel({ formatter: v => Math.abs(v) }),
        splitLine: { lineStyle: { color: t.split, type: 'dashed' } },
        min: -2200, max: 4200, interval: 1000
      }),
      yAxis: H.catAxis(rows.map(r => r.name), {
        axisLabel: H.axisLabel({ fontSize: 12.5 }),
        axisLine: { lineStyle: { color: t.axis } }
      }),
      series: [
        {
          name: '被替代岗位', type: 'bar', stack: 'job', barWidth: '52%',
          data: rows.map(r => -r.displaced),
          itemStyle: {
            borderRadius: [4, 0, 0, 4],
            color: H.linGrad('rgba(251,113,133,0.35)', '#fb7185'),
            borderColor: 'rgba(251,113,133,0.5)', borderWidth: 1
          },
          label: {
            show: true, position: 'left', distance: 6, color: '#fb7185',
            fontSize: 11, fontFamily: H.FONT, formatter: p => fmt(Math.abs(p.value))
          }
        },
        {
          name: '新增岗位', type: 'bar', stack: 'job', barWidth: '52%',
          data: rows.map(r => r.created),
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: H.linGrad('#34d399', 'rgba(52,211,153,0.3)'),
            borderColor: 'rgba(52,211,153,0.5)', borderWidth: 1
          },
          label: {
            show: true, position: 'right', distance: 6, color: '#34d399',
            fontSize: 11, fontFamily: H.FONT, formatter: p => fmt(p.value)
          },
          markLine: {
            silent: true, symbol: 'none',
            lineStyle: { color: 'rgba(148,163,184,0.55)', type: 'solid', width: 1.4 },
            label: { show: true, position: 'end', color: t.ink3, fontSize: 11, fontFamily: H.FONT, formatter: '岗位替代 / 创造分界' },
            data: [{ xAxis: 0 }]
          }
        }
      ]
    };
  });
})();
