/* ============================================================================
 *  Chapter 02 · 结构：新质生产力构成旭日图
 * ==========================================================================*/
(function () {
  'use strict';
  const { register } = window.VZ;
  const D = window.DATASET;

  const GROUP_COLOR = { 新技术: '#22d3ee', 新要素: '#a78bfa', 新产业: '#34d399' };
  const LEAF_ALPHA = [1, 0.86, 0.74, 0.62, 0.52];

  register('chartSunburst', (echarts, H) => {
    const t = H.T();
    const data = D.SUNBURST.children.map(g => ({
      name: g.name,
      itemStyle: { color: GROUP_COLOR[g.name] },
      children: g.children.map((c, i) => ({
        name: c.name,
        value: c.value,
        itemStyle: { color: H.alpha(GROUP_COLOR[g.name], LEAF_ALPHA[i % LEAF_ALPHA.length]) }
      }))
    }));

    return {
      textStyle: { fontFamily: H.FONT },
      tooltip: H.tooltip({
        formatter: p => {
          const depth = p.treePathInfo.length - 1;
          return `<b>${p.name}</b>${depth > 1 ? `<br/>相对权重：${p.value}` : ''}`;
        }
      }),
      series: [{
        type: 'sunburst',
        data: data,
        radius: [0, '86%'],
        center: ['50%', '50%'],
        sort: null,
        nodeClick: false,
        emphasis: { focus: 'ancestor' },
        itemStyle: { borderColor: t.bg === 'transparent' ? 'rgba(4,7,15,0.55)' : 'rgba(255,255,255,0.7)', borderWidth: 1.5 },
        label: {
          color: '#04070f',
          fontSize: 12,
          fontFamily: H.FONT,
          minAngle: 6,
          fontWeight: 600
        },
        levels: [
          {},
          {
            r0: '18%', r: '44%',
            label: { rotate: 0, fontSize: 15, fontWeight: 700, color: t.ink0, position: 'inside' },
            itemStyle: { borderWidth: 2 }
          },
          {
            r0: '46%', r: '86%',
            /* 中文标签横排比沿弧线旋转更好读；底色深浅不一，用背景色描边保证可读 */
            label: {
              rotate: 0,
              fontSize: 11.5,
              color: t.ink0,
              textBorderColor: H.themeName() === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(4,7,15,0.88)',
              textBorderWidth: 2.6
            },
            itemStyle: { borderWidth: 1.2, opacity: 0.95 }
          }
        ]
      }]
    };
  });
})();
