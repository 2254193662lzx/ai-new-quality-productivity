/* ============================================================================
 *  Chapter 08 · 全球格局
 *  1) 六大维度竞争力雷达（中 / 美 / 欧盟，示意）
 *  2) 2030 年 AI 带来的 GDP 增量（环形图）
 *  3) 产业链图谱（D3 力导向，可拖拽）
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt, $, T } = window.VZ;
  const D = window.DATASET;

  /* ---------------------------------------------- 1. 综合竞争力雷达 ------- */
  register('chartGlobalRadar', (echarts, H) => {
    const t = H.T();
    const g = D.GLOBAL_RADAR;
    const COLORS = { '中国': '#22d3ee', '美国': '#a78bfa', '欧盟': '#34d399' };

    return {
      textStyle: { fontFamily: H.FONT },
      tooltip: H.tooltip({ trigger: 'item' }),
      legend: {
        bottom: 0, itemGap: 20, icon: 'roundRect', itemWidth: 12, itemHeight: 8,
        textStyle: { color: t.ink2, fontSize: 12.5, fontFamily: H.FONT }
      },
      radar: {
        center: ['50%', '46%'], radius: '64%',
        indicator: g.indicators,
        splitNumber: 4,
        axisName: { color: t.ink1, fontSize: 12.5, fontFamily: H.FONT },
        splitLine: { lineStyle: { color: t.split } },
        splitArea: { areaStyle: { color: ['rgba(34,211,238,0.03)', 'rgba(167,139,250,0.045)'] } },
        axisLine: { lineStyle: { color: t.split } }
      },
      series: [{
        type: 'radar',
        symbolSize: 4.5,
        emphasis: { focus: 'series', lineStyle: { width: 3.2 } },
        data: g.series.map(s => ({
          name: s.name,
          value: s.values,
          /* 用线型区分：中国实线、美国虚线、欧盟点线，避免大面积填充互相糊在一起 */
          lineStyle: {
            width: s.name === '中国' ? 2.6 : 2,
            type: s.name === '中国' ? 'solid' : (s.name === '美国' ? 'dashed' : 'dotted'),
            color: COLORS[s.name]
          },
          itemStyle: { color: COLORS[s.name] },
          areaStyle: { color: H.alpha(COLORS[s.name], s.name === '中国' ? 0.2 : 0.07) }
        }))
      }]
    };
  });

  /* ---------------------------------------------- 2. GDP 增量环形图 ------- */
  register('chartGdp', (echarts, H) => {
    const t = H.T();
    const g = D.GDP_IMPACT;
    const COLORS = ['#22d3ee', '#a78bfa', '#94a3b8'];

    return {
      textStyle: { fontFamily: H.FONT },
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => `<b>${p.name}</b><br/>GDP 增量：<b>${fmt(p.value, 1)}</b> 万亿美元<br/>占全球：<b>${p.percent}%</b>`
      }),
      legend: {
        bottom: 0, itemGap: 18, icon: 'circle', itemWidth: 9, itemHeight: 9,
        textStyle: { color: t.ink2, fontSize: 12.5, fontFamily: H.FONT }
      },
      series: [{
        type: 'pie',
        radius: ['46%', '74%'],
        center: ['50%', '47%'],
        padAngle: 2,
        itemStyle: { borderRadius: 8, borderColor: 'rgba(4,7,15,0.6)', borderWidth: 2 },
        data: g.breakdown.map((d, i) => ({
          name: d.name, value: d.value,
          itemStyle: { color: COLORS[i] }
        })),
        label: {
          color: t.ink1, fontSize: 12, fontFamily: H.FONT, lineHeight: 18,
          formatter: p => `{n|${p.name}}\n{v|${fmt(p.value, 1)} 万亿 · ${p.percent}%}`,
          rich: {
            n: { color: t.ink0, fontSize: 12.5, fontWeight: 600, fontFamily: H.FONT },
            v: { color: t.ink2, fontSize: 11, fontFamily: H.FONT }
          }
        },
        labelLine: { length: 10, length2: 12, lineStyle: { color: t.axis } },
        emphasis: { scale: true, scaleSize: 7, itemStyle: { shadowBlur: 24, shadowColor: 'rgba(34,211,238,0.7)' } }
      }],
      graphic: [{
        type: 'text', left: 'center', top: '40%',
        style: { text: fmt(g.global, 1), fill: t.ink0, fontSize: 30, fontWeight: 700, fontFamily: H.FONT, textAlign: 'center' }
      }, {
        type: 'text', left: 'center', top: '52%',
        style: { text: '万亿美元 · 全球增量\n2030 年预测', fill: t.ink3, fontSize: 11, lineHeight: 15, fontFamily: H.FONT, textAlign: 'center' }
      }]
    };
  });

  /* ---------------------------------------------- 3. 产业链图谱 ----------- */
  const GROUP = [
    { name: '上游 · 算力底座', color: '#22d3ee' },
    { name: '中游 · 模型能力', color: '#a78bfa' },
    { name: '下游 · 千行百业', color: '#34d399' }
  ];

  let chainBuilt = false;
  function buildChainGraph() {
    const host = $('#chartChain');
    if (!host || chainBuilt) return;
    chainBuilt = true;

    const legend = document.createElement('div');
    legend.className = 'chain-legend';
    legend.innerHTML = GROUP.map(g =>
      `<span class="it"><i class="sw" style="background:${g.color}"></i>${g.name}</span>`
    ).join('') + `<span class="it" style="color:var(--ink-3)">拖拽任意节点可重新布局 · 悬停高亮其关联路径</span>`;
    host.parentElement.insertBefore(legend, host.nextSibling);

    const W = 1000, H0 = 580;
    const svg = d3.select(host).append('svg')
      .attr('viewBox', `0 0 ${W} ${H0}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%').style('height', '100%')
      /* 允许拖拽到初始视口之外的节点仍然可见 */
      .style('overflow', 'visible');

    const gLink = svg.append('g').attr('class', 'links');
    const gNode = svg.append('g').attr('class', 'nodes');

    const nodes = D.CHAIN_GRAPH.nodes.map(d => Object.assign({}, d));
    const nodeById = {};
    nodes.forEach(n => nodeById[n.id] = n);
    const links = D.CHAIN_GRAPH.links.map(l => ({ source: l[0], target: l[1] }));

    const xBy = { 0: 175, 1: 500, 2: 830 };
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
        const s = nodeById[d.source.id || d.source], t2 = nodeById[d.target.id || d.target];
        return s.group === t2.group ? 92 : 130;
      }).strength(0.35))
      .force('charge', d3.forceManyBody().strength(-430))
      .force('collide', d3.forceCollide().radius(d => d.size * 0.62 + 15))
      .force('x', d3.forceX(d => xBy[d.group]).strength(0.42))
      .force('y', d3.forceY(H0 / 2).strength(0.045));

    /* 预跑收敛再渲染：保证每次打开（以及录屏、截图）得到稳定一致的布局 */
    sim.stop();
    for (let i = 0; i < 460; i++) sim.tick();

    const theme = window.VZ.T();
    const link = gLink.selectAll('line').data(links).join('line')
      .attr('stroke', 'rgba(140,170,240,0.28)')
      .attr('stroke-width', 1.1);

    const node = gNode.selectAll('g').data(nodes).join('g')
      .style('cursor', 'grab');

    node.append('circle')
      .attr('r', d => d.size * 0.42)
      .attr('fill', d => GROUP[d.group].color)
      .attr('fill-opacity', 0.22)
      .attr('stroke', d => GROUP[d.group].color)
      .attr('stroke-width', 1.6);

    node.append('circle')
      .attr('r', d => d.size * 0.19)
      .attr('fill', d => GROUP[d.group].color);

    node.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size * 0.42 + 16)
      .attr('font-size', 12.5)
      .attr('font-family', window.VZ.FONT)
      .attr('fill', theme.ink1)
      .attr('stroke', window.VZ.themeName() === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(4,7,15,0.85)')
      .attr('stroke-width', 3)
      .style('paint-order', 'stroke');

    function ticked() {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    }
    sim.on('tick', ticked);
    ticked();

    /* 按实际节点范围收紧画布，避免四周留下大片空白；
       同时把视口补成与容器一致的宽高比，避免出现上下或左右留边 */
    (function fitViewBox() {
      const pad = 46;
      const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
      let minX = Math.min.apply(null, xs) - pad;
      let maxX = Math.max.apply(null, xs) + pad;
      let minY = Math.min.apply(null, ys) - pad;
      let maxY = Math.max.apply(null, ys) + pad;
      const target = (host.clientWidth || W) / (host.clientHeight || H0);
      let w = maxX - minX, h = maxY - minY;
      if (w / h < target) {          // 图谱偏“高”，向两侧扩宽
        const nw = h * target;
        minX -= (nw - w) / 2; w = nw;
      } else {                       // 图谱偏“宽”，向上下扩高
        const nh = w / target;
        minY -= (nh - h) / 2; h = nh;
      }
      svg.attr('viewBox', `${minX} ${minY} ${w} ${h}`);
    })();

    /* 悬停高亮邻接路径 */
    function highlight(d) {
      const nb = new Set([d.id]);
      links.forEach(l => {
        if (l.source.id === d.id) nb.add(l.target.id);
        if (l.target.id === d.id) nb.add(l.source.id);
      });
      node.selectAll('circle').attr('opacity', n => nb.has(n.id) ? 1 : 0.16);
      node.selectAll('text').attr('opacity', n => nb.has(n.id) ? 1 : 0.18);
      link.attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? GROUP[d.group].color : 'rgba(140,170,240,0.12)')
        .attr('stroke-width', l => (l.source.id === d.id || l.target.id === d.id) ? 1.9 : 0.8);
    }
    function clear() {
      node.selectAll('circle').attr('opacity', 1);
      node.selectAll('text').attr('opacity', 1);
      link.attr('stroke', 'rgba(140,170,240,0.28)').attr('stroke-width', 1.1);
    }
    node.on('mouseenter', (e, d) => highlight(d)).on('mouseleave', clear);

    node.call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.28).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    /* 主题切换后重绘文字颜色 */
    window.addEventListener('vz:theme', () => {
      const t2 = window.VZ.T();
      node.selectAll('text')
        .attr('fill', t2.ink1)
        .attr('stroke', window.VZ.themeName() === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(4,7,15,0.85)');
      clear();
    });
  }

  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { buildChainGraph(); io.disconnect(); } });
  }, { rootMargin: '240px 0px' });
  const el = $('#chartChain');
  if (el) io.observe(el);
  /* 兜底：截图或直接定位到该章节时 */
  setTimeout(() => { if ($('#chartChain') && !$('#chartChain').querySelector('svg')) buildChainGraph(); }, 3000);
})();
