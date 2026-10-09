/* ============================================================================
 *  Chapter 07 · 创新产出
 *  1) 生成式 AI 专利家族全球分布（玫瑰环形图）
 *  2) 有效发明专利与备案大模型（双轴对比）
 *  3) 技术方向关注热度标签场（DOM）
 * ==========================================================================*/
(function () {
  'use strict';
  const { register, fmt, $ } = window.VZ;
  const D = window.DATASET;

  /* ---------------------------------------------- 1. 专利环形图 ----------- */
  const PATENT_COLOR = {
    '中国': '#22d3ee', '美国': '#a78bfa', '韩国': '#38bdf8',
    '日本': '#34d399', '印度': '#fbbf24', '英国': '#fb923c'
  };

  register('chartPatentsRose', (echarts, H) => {
    const t = H.T();
    const g = D.GEN_AI_PATENTS;
    const halo = H.themeName() === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(4,7,15,0.85)';

    return {
      textStyle: { fontFamily: H.FONT },
      tooltip: H.tooltip({
        trigger: 'item',
        formatter: p => `<b>${p.name}</b><br/>专利家族：<b>${fmt(p.value)}</b> 项<br/>占全球：<b>${p.percent}%</b>`
      }),
      series: [{
        type: 'pie',
        /* 用圆心角表示占比：小份额之间的差别比玫瑰图更易读，
           具体数值由卡片右侧的图例列表承担 */
        radius: ['46%', '76%'],
        center: ['50%', '50%'],
        padAngle: 1.5,
        data: g.series.map(s => ({
          name: s.name,
          value: s.value,
          itemStyle: { color: PATENT_COLOR[s.name] }
        })),
        itemStyle: { borderRadius: 6, borderColor: 'rgba(4,7,15,0.55)', borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: true, scaleSize: 7,
          itemStyle: { shadowBlur: 26, shadowColor: 'rgba(34,211,238,0.75)' },
          label: {
            show: true, position: 'center',
            formatter: p => `{v|${p.percent}%}\n{n|${p.name}}`,
            rich: {
              v: { color: t.ink0, fontSize: 22, fontWeight: 700, fontFamily: H.FONT, lineHeight: 28 },
              n: { color: t.ink2, fontSize: 12, fontFamily: H.FONT }
            }
          }
        }
      }],
      graphic: [{
        type: 'text', left: 'center', top: '44%',
        style: {
          text: fmt(g.total), fill: t.ink0, fontSize: 24, fontWeight: 700,
          fontFamily: H.FONT, textAlign: 'center',
          textStroke: halo, lineWidth: 4
        }
      }, {
        type: 'text', left: 'center', top: '55%',
        style: {
          text: '项专利家族\n2014—2023', fill: t.ink3, fontSize: 11,
          lineHeight: 15, fontFamily: H.FONT, textAlign: 'center',
          textStroke: halo, lineWidth: 4
        }
      }]
    };
  });

  /* 右侧数值列表：保证每个国家的项数与占比都能被读到，不受扇形大小影响 */
  function buildPatentLegend() {
    const host = document.getElementById('roseLegend');
    if (!host) return;
    const g = D.GEN_AI_PATENTS;
    host.innerHTML = g.series.map(s => {
      const pct = (s.value / g.total * 100);
      return `<div class="rl-item">
        <i class="rl-dot" style="background:${PATENT_COLOR[s.name]}"></i>
        <span class="rl-name">${s.name}</span>
        <span class="rl-val">${fmt(s.value)}</span>
        <span class="rl-pct">${pct.toFixed(2)}%</span>
      </div>`;
    }).join('') + `<div class="rl-note">总量 ${fmt(g.total)} 项 · ${g.totalNote}</div>`;
  }

  /* 结论数字由数据算出，避免与图面占比不一致 */
  function buildPatentInsight() {
    const host = document.getElementById('patentInsight');
    if (!host) return;
    const g = D.GEN_AI_PATENTS;
    const cn = g.series[0];
    const pct = (cn.value / g.total * 100).toFixed(1);
    host.innerHTML =
      `十年间全球 <strong>${fmt(g.total)}</strong> 项生成式人工智能专利家族中，` +
      `<strong>${fmt(cn.value)}</strong> 项来自中国，占<strong>${pct}%</strong>。` +
      `中国在专利与论文上的产出规模，已经构成人工智能创新的数量底座。`;
  }

  /* ---------------------------------------------- 2. 专利与备案模型 ------- */
  register('chartPatentStock', (echarts, H) => {
    const t = H.T();
    const p = D.AI_PATENT_STOCK.patents.map(d => d.value);
    const m = D.AI_PATENT_STOCK.models.map(d => d.value);
    const cats = D.AI_PATENT_STOCK.patents.map(d => d.year + ' 年');

    return {
      textStyle: { fontFamily: H.FONT },
      grid: H.grid({ top: 52, bottom: 10, left: 10, right: 12 }),
      tooltip: H.tooltip({
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: p => {
          const y = parseInt(p[0].axisValue);
          const pt = D.AI_PATENT_STOCK.patents.find(d => d.year === y);
          const md = D.AI_PATENT_STOCK.models.find(d => d.year === y);
          return `<b>${y} 年</b><br/>` +
            `<span style="color:#22d3ee">●</span> 有效发明专利：<b>${fmt(pt.value, 1)}</b> 万件<br/>` +
            `<span style="color:#a78bfa">●</span> 备案生成式 AI 服务：<b>${fmt(md.value)}</b> 款` +
            `<br/><span style="color:#8b9ac0">${pt.note || ''}${md.note ? ' / ' + md.note : ''}</span>`;
        }
      }),
      legend: {
        top: 4, right: 4, itemWidth: 16, itemHeight: 8, icon: 'roundRect',
        textStyle: { color: t.ink2, fontSize: 12, fontFamily: H.FONT }
      },
      xAxis: H.catAxis(cats, { axisLabel: H.axisLabel({ fontSize: 13 }) }),
      yAxis: [
        H.valAxis({
          name: '万件', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
          max: 50, interval: 10, splitLine: { lineStyle: { color: t.split, type: 'dashed' } }
        }),
        H.valAxis({
          name: '款', nameTextStyle: { color: t.ink3, fontSize: 11, fontFamily: H.FONT },
          max: 200, interval: 50, splitLine: { show: false }
        })
      ],
      series: [
        {
          name: '人工智能有效发明专利（万件）', type: 'bar', yAxisIndex: 0,
          barWidth: '26%', data: p,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: H.linGrad('#22d3ee', 'rgba(34,211,238,0.2)', true),
            borderColor: 'rgba(34,211,238,0.5)', borderWidth: 1
          },
          label: { show: true, position: 'top', color: t.ink1, fontSize: 12, fontFamily: H.FONT, formatter: p => fmt(p.value, 1) }
        },
        {
          name: '备案生成式 AI 服务（款）', type: 'bar', yAxisIndex: 1,
          barWidth: '26%', data: m,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: H.linGrad('#a78bfa', 'rgba(124,58,237,0.2)', true),
            borderColor: 'rgba(167,139,250,0.5)', borderWidth: 1
          },
          label: { show: true, position: 'top', color: '#a78bfa', fontSize: 12, fontFamily: H.FONT, formatter: p => fmt(p.value) }
        }
      ]
    };
  });

  /* ---------------------------------------------- 3. 技术热度标签场 -------- */
  function buildTagField() {
    const host = $('#tagField');
    if (!host) return;
    const items = D.TECH_TREND.items;
    const max = Math.max.apply(null, items.map(i => i.weight));
    host.innerHTML = items.map(it => {
      const size = 12.5 + (it.weight / max) * 12;         // 12.5—24.5px
      const op = 0.55 + (it.weight / max) * 0.45;
      return `<span class="t" data-era="${it.era}" title="${it.era} · 相对热度 ${it.weight}"
        style="font-size:${size.toFixed(1)}px;font-weight:${it.weight > 70 ? 600 : 400};opacity:${op.toFixed(2)}">
        ${it.name}<span class="w">${it.weight}</span></span>`;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildTagField(); buildPatentLegend(); buildPatentInsight();
    });
  } else {
    buildTagField(); buildPatentLegend(); buildPatentInsight();
  }
})();
