/* ============================================================================
 *  Chapter 03 · 要素流动
 *  1) 桑基图：从要素投入到价值产出
 *  2) 数字经济规模面积图
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt } = window.VZ;
  const D = window.DATASET;

  /* 按角色给节点配色，让“投入—转化—产出”三段一眼可分 */
  const ROLE = {
    '数据要素': '#22d3ee', '智能算力': '#38bdf8', '算法与人才': '#2dd4bf',
    '基础大模型': '#a78bfa', '行业模型': '#818cf8',
    '生产效率': '#34d399',
    '效率提升': '#fbbf24', '质量跃迁': '#fb923c', '新产品新业态': '#f472b6'
  };
  const INDUSTRY = ['智能制造', '医疗健康', '金融科技', '交通物流', '教育科研', '能源电力', '政务民生'];

  register('chartSankey', (echarts, H) => {
    const t = H.T();

    const nodes = D.VALUE_FLOW.nodes.map((name, i) => {
      const isInput = ['数据要素', '智能算力', '算法与人才'].includes(name);
      const isMid = ['基础大模型', '行业模型'].includes(name);
      const isOut = ['效率提升', '质量跃迁', '新产品新业态'].includes(name);
      const color = ROLE[name] || (INDUSTRY.includes(name)
        ? ['#34d399', '#2dd4bf', '#4ade80', '#22d3ee', '#38bdf8', '#a3e635', '#5eead4'][INDUSTRY.indexOf(name)]
        : '#94a3b8');

      /* 中游是细高的单一节点，用竖排文字避免与连线重叠 */
      const vertical = isMid ? name.split('').join('\n') : name;

      return {
        name,
        itemStyle: { color, borderWidth: 0 },
        label: isMid
          ? { position: 'inside', formatter: vertical, color: '#04070f', fontSize: 13, fontWeight: 700, lineHeight: 15, fontFamily: H.FONT }
          : {
            position: isOut ? 'right' : isInput ? 'left' : 'right',
            formatter: name,
            color: t.ink1,
            fontSize: 12.5,
            fontFamily: H.FONT,
            distance: 8
          },
        emphasis: { itemStyle: { shadowBlur: 16, shadowColor: color } }
      };
    });

    const links = D.VALUE_FLOW.links.map(l => ({
      source: l.source,
      target: l.target,
      value: l.value,
      lineStyle: { color: 'gradient', opacity: 0.34, curveness: 0.5 }
    }));

    return {
      textStyle: { fontFamily: H.FONT },
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => p.dataType === 'edge'
          ? `${p.data.source} <b style="color:#22d3ee">→</b> ${p.data.target}<br/>相对流量：<b>${p.data.value}</b>`
          : `<b>${p.name}</b>`
      }),
      series: [{
        type: 'sankey',
        /* 左右留出文字空间，否则首列节点名称会被画布边缘裁掉 */
        left: 104, right: 128, top: 16, bottom: 12,
        nodeWidth: 20,
        nodeGap: 9,
        layoutIterations: 40,
        draggable: false,
        emphasis: { focus: 'adjacency' },
        data: nodes,
        links: links,
        lineStyle: { color: 'gradient', opacity: 0.32, curveness: 0.5 },
        label: { color: t.ink1, fontSize: 12.5, fontFamily: H.FONT }
      }]
    };
  });

  register('chartDigital', (echarts, H) => {
    const t = H.T();
    const s = D.DIGITAL_ECONOMY.series;
    const halo = H.themeName() === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(9,14,28,0.92)';
    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 46, bottom: 10, left: 18, right: 30 }),
      tooltip: H.tooltip({
        trigger: 'axis',
        formatter: p => {
          const v = p[0];
          return `<b>${v.axisValue} 年</b><br/>数字经济规模：<b>${fmt(v.value, 1)}</b> 万亿元`;
        }
      }),
      xAxis: H.catAxis(s.map(d => d.year + ''), {
        boundaryGap: false,
        axisLabel: H.axisLabel({ formatter: v => v })
      }),
      yAxis: H.valAxis({ name: '万亿元', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT }, max: 60 }),
      series: [{
        type: 'line',
        data: s.map(d => d.value),
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 9,
        itemStyle: { color: '#22d3ee', borderColor: 'rgba(34,211,238,0.35)', borderWidth: 6 },
        lineStyle: { width: 3, color: H.linGrad('#38bdf8', '#a78bfa') },
        areaStyle: { color: H.linGrad('rgba(34,211,238,0.42)', 'rgba(34,211,238,0.02)', true) },
        label: {
          show: true,
          /* 首个数据点紧贴纵轴，标签会与刻度数字粘连，故从第二点开始标注 */
          position: 'top',
          distance: 9,
          formatter: p => (p.dataIndex === 0 ? '' : fmt(p.value, 1)),
          color: t.ink1, fontSize: 11.5, fontFamily: H.FONT,
          /* 描边保证标签压在折线上时依然清晰 */
          textBorderColor: halo, textBorderWidth: 3.5
        },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: 'rgba(167,139,250,0.45)', type: 'dashed' },
          label: {
            color: t.ink3, fontSize: 11, fontFamily: H.FONT,
            formatter: '2023 年占 GDP 比重 42.8%', position: 'insideMiddleTop'
          },
          data: [{ yAxis: 53.9 }]
        }
      }]
    };
  });
})();
