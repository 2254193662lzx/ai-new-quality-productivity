/* ============================================================================
 *  Chapter 06 · 全要素生产率
 *  1) 雷达图：八行业效率提升幅度
 *  2) 气泡图：渗透率 × 提升幅度 × 市场规模（含象限引导）
 *  3) 热力图：行业 × 业务环节渗透程度
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt } = window.VZ;
  const D = window.DATASET;

  /* ---------------------------------------------- 1. 效率提升雷达 --------- */
  register('chartEmpowerRadar', (echarts, H) => {
    const t = H.T();
    const items = D.INDUSTRY_EMPOWER.industries;
    /* 效率提升幅度跨度很大（45%—300%），用对数感的“压缩尺度”让各行业都可读 */
    const scale = v => Math.round(Math.sqrt(v) * 10) / 10;

    return {
      textStyle: { fontFamily: H.FONT },
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => {
          const rows = items.map((it, i) =>
            `<div style="display:flex;justify-content:space-between;gap:18px">
               <span style="color:${p.color}">${it.name}</span>
               <b>+${it.efficiency}%</b>
             </div>`).join('');
          return `<b>效率提升幅度</b><br/>${rows}`;
        }
      }),
      radar: {
        center: ['50%', '52%'],
        radius: '66%',
        indicator: items.map(it => ({ name: it.name, max: 20 })),
        axisName: { color: t.ink1, fontSize: 12, fontFamily: H.FONT },
        splitNumber: 4,
        splitLine: { lineStyle: { color: t.split } },
        splitArea: { areaStyle: { color: ['rgba(34,211,238,0.035)', 'rgba(167,139,250,0.045)'] } },
        axisLine: { lineStyle: { color: t.split } }
      },
      series: [{
        type: 'radar',
        symbolSize: 5,
        data: [{
          name: '效率提升',
          value: items.map(it => scale(it.efficiency)),
          lineStyle: { width: 2.6, color: '#22d3ee' },
          itemStyle: { color: '#22d3ee' },
          areaStyle: { color: H.linGrad('rgba(34,211,238,0.45)', 'rgba(124,58,237,0.25)') }
        }],
        emphasis: { lineStyle: { width: 3.4 } }
      }],
      /* 右上角图例说明刻度含义，避免误读为原始百分比 */
      graphic: [{
        type: 'text', right: 6, top: 2,
        style: { text: '坐标经平方根压缩，两侧数值为真实值', fill: t.ink3, fontSize: 11, fontFamily: H.FONT }
      }]
    };
  });

  /* ---------------------------------------------- 2. 渗透率气泡图 --------- */
  register('chartEmpowerBubble', (echarts, H) => {
    const t = H.T();
    const items = D.INDUSTRY_EMPOWER.industries;

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 30, bottom: 22, left: 12, right: 34 }),
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => {
          const d = p.data;
          return `<b>${d.name}</b><br/>
            渗透率：<b>${d.value[0]}%</b><br/>
            效率提升：<b>+${d.value[1]}%</b><br/>
            <span style="color:#8b9ac0">典型环节：${d.stage}</span>`;
        }
      }),
      xAxis: H.valAxis({
        name: '行业渗透率 %', nameLocation: 'middle', nameGap: 26,
        nameTextStyle: { color: t.ink3, fontSize: 11.5, fontFamily: H.FONT },
        min: 0, max: 55, splitLine: { lineStyle: { color: t.split, type: 'dashed' } }
      }),
      yAxis: H.valAxis({
        name: '效率提升 %', nameTextStyle: { color: t.ink3, fontSize: 11.5, fontFamily: H.FONT },
        min: 0, max: 350, interval: 50
      }),
      series: [{
        type: 'scatter',
        data: items.map((it, i) => ({
          name: it.name,
          value: [it.penetration, it.efficiency],
          stage: it.stage,
          symbolSize: 26 + Math.sqrt(it.scale) * 3.4,
          itemStyle: {
            color: H.linGrad('rgba(34,211,238,0.85)', 'rgba(124,58,237,0.75)'),
            borderColor: 'rgba(34,211,238,0.55)', borderWidth: 1
          }
        })),
        label: {
          show: true, position: 'inside', color: '#04121c',
          fontSize: 11, fontWeight: 700, fontFamily: H.FONT,
          /* 行业名统一为 2—4 字，折行成两行后可完整落在气泡内 */
          formatter: p => {
            const n = p.data.name;
            return n.length > 2 ? n.slice(0, 2) + '\n' + n.slice(2) : n;
          },
          lineHeight: 12
        },
        labelLayout: { hideOverlap: false },
        emphasis: { scale: 1.08, itemStyle: { shadowBlur: 24, shadowColor: 'rgba(34,211,238,0.8)' } },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: 'rgba(148,163,184,0.45)', type: 'dashed' },
          label: { show: false },
          data: [{ xAxis: 28 }, { yAxis: 150 }]
        },
        markArea: {
          silent: true,
          itemStyle: { color: 'rgba(34,211,238,0.05)' },
          label: {
            show: true, position: 'insideTopLeft', color: t.ink3,
            fontSize: 11.5, fontFamily: H.FONT, distance: 8,
            formatter: '存量空间：提升幅度大 · 渗透率低'
          },
          data: [[{ xAxis: 0, yAxis: 150 }, { xAxis: 28, yAxis: 340 }]]
        }
      }]
    };
  });

  /* ---------------------------------------------- 3. 渗透热力图 ----------- */
  register('chartHeatmap', (echarts, H) => {
    const t = H.T();
    const h = D.PENETRATION_HEATMAP;
    const data = [];
    h.data.forEach((row, y) => {
      row.values.forEach((v, x) => data.push([x, y, v]));
    });
    const maxV = Math.max.apply(null, data.map(d => d[2]));

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 16, bottom: 16, left: 6, right: 82 }),
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => {
          const row = h.data[p.value[1]];
          return `<b>${row.name}</b> · ${h.stages[p.value[0]]}<br/>渗透程度：<b>${p.value[2]}%</b>`;
        }
      }),
      xAxis: {
        type: 'category', data: h.stages,
        splitArea: { show: true, areaStyle: { color: ['transparent', 'rgba(120,150,220,0.03)'] } },
        axisLine: { lineStyle: { color: t.axis } },
        axisTick: { show: false },
        axisLabel: H.axisLabel({ fontSize: 12.5 })
      },
      yAxis: {
        type: 'category', data: h.data.map(d => d.name),
        splitArea: { show: true, areaStyle: { color: ['transparent', 'rgba(120,150,220,0.03)'] } },
        axisLine: { lineStyle: { color: t.axis } },
        axisTick: { show: false },
        /* 行标签与色带垂直居中 */
        axisLabel: H.axisLabel({ fontSize: 12.5, verticalAlign: 'middle', align: 'right' })
      },
      /* 注意：ECharts 在 orient:'horizontal' 下会把该长条旋转 90° 绘制，
         故此处使用竖向图例，置于绘图区右侧 */
      visualMap: {
        min: 0, max: maxV, calculable: false,
        orient: 'vertical', right: 6, top: 'middle',
        itemWidth: 12, itemHeight: 170,
        text: ['渗透高', '渗透低'],
        textGap: 8,
        textStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
        inRange: { color: ['#0a1a33', '#0e4b6b', '#0891b2', '#22d3ee', '#a78bfa', '#fbbf24'] }
      },
      series: [{
        type: 'heatmap',
        data: data,
        label: {
          show: true, color: '#eaf2ff', fontSize: 11.5, fontFamily: H.FONT,
          formatter: p => p.value[2]
        },
        itemStyle: { borderColor: 'rgba(4,7,15,0.65)', borderWidth: 2, borderRadius: 4 },
        emphasis: { itemStyle: { shadowBlur: 16, shadowColor: 'rgba(34,211,238,0.8)', borderColor: '#22d3ee' } }
      }]
    };
  });
  /* ---------------------------------------------- 4. 结论由数据算出 ------- */
  /* 结论数字直接由热力图数据计算，避免手写结论与图面不一致 */
  function buildHeatInsight() {
    const host = document.getElementById('heatInsight');
    if (!host) return;
    const h = D.PENETRATION_HEATMAP;
    const means = h.stages.map((s, i) => ({
      stage: s,
      mean: h.data.reduce((a, r) => a + r.values[i], 0) / h.data.length
    })).sort((a, b) => b.mean - a.mean);
    const top = means[0], second = means[1], last = means[means.length - 1];
    const f = v => v.toFixed(1);
    host.innerHTML =
      `渗透最深的是<strong>${top.stage}（均值 ${f(top.mean)}%）</strong>与` +
      `<strong>${second.stage}（${f(second.mean)}%）</strong>` +
      `——共同点是「重复度高 + 数据留存好」；而` +
      `<strong>${last.stage}（${f(last.mean)}%）</strong>` +
      `这类依赖判断与创造的环节渗透最低。人工智能的替代优势不取决于环节是否先进，` +
      `而取决于<em>该环节能否被数据完整描述</em>。`;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildHeatInsight);
  else buildHeatInsight();
})();
