/* ============================================================================
 *  数据集：人工智能作为新质生产力
 *  ---------------------------------------------------------------------------
 *  口径（caliber）标记规则 —— 站内所有图表沿用同一套标记，避免把估算当官方：
 *    reported      公开报告 / 官方表述的已公布数据
 *    target        国家规划或政策文件设定的目标值
 *    forecast      研究机构发布的预测值
 *    estimated     基于公开数据推算的估算值
 *    illustrative  示意值（用于表达量级与方向，非统计数据）
 *  每个数据集必带 sources 字段，指向 SOURCES 中的键。
 * ==========================================================================*/

const SOURCES = {
  plan2017: {
    label: '国务院《新一代人工智能发展规划》（2017）',
    detail: '提出到 2020 年人工智能核心产业规模超过 1500 亿元、2025 年超过 4000 亿元、2030 年超过 1 万亿元，并带动相关产业规模超过 10 万亿元。'
  },
  caict: {
    label: '中国信息通信研究院 人工智能 / 数字经济相关报告',
    detail: '历年《人工智能发展报告》《中国数字经济发展研究报告》等公开成果。'
  },
  miit: {
    label: '工业和信息化部 公开表述与新闻发布会',
    detail: '工信部在新闻发布会、算力大会等场合披露的人工智能产业规模、企业数量、算力水平等口径。'
  },
  idc: {
    label: 'IDC《中国人工智能计算力发展评估报告》',
    detail: '中国智能算力规模（EFLOPS，以 FP16 为主口径）历年公布值与预测值。'
  },
  wipo: {
    label: '世界知识产权组织（WIPO）生成式人工智能专利态势报告（2024）',
    detail: '统计 2014—2023 年十年间全球生成式人工智能相关发明专利家族数量与国别分布。'
  },
  cnipa: {
    label: '国家知识产权局 公开数据',
    detail: '我国人工智能领域有效发明专利数量等知识产权统计数据。'
  },
  pwc: {
    label: '普华永道（PwC）《人工智能对全球经济的影响》',
    detail: '预测到 2030 年人工智能将给全球 GDP 带来约 15.7 万亿美元增量，其中中国约 7 万亿美元。'
  },
  mckinsey: {
    label: '麦肯锡 生成式人工智能经济潜力研究',
    detail: '测算生成式人工智能每年可为全球经济贡献约 2.6 万亿—4.4 万亿美元价值。'
  },
  wef: {
    label: '世界经济论坛《未来就业报告 2025》',
    detail: '预测到 2030 年全球就业结构变化：新增岗位、流失岗位、技能重构比例等。'
  },
  cac: {
    label: '国家互联网信息办公室 生成式人工智能服务备案信息',
    detail: '公开披露的已备案生成式人工智能服务数量。'
  },
  cases: {
    label: '行业公开案例与媒体报道整理',
    detail: '由各类行业报告、企业公开案例、媒体测评报道汇总整理，用于表达应用量级，非统一口径统计。'
  }
};

const CALIBERS = {
  reported: { label: '公开数据', color: '#38bdf8', desc: '研究机构或官方已公布的数据' },
  target: { label: '规划目标', color: '#a78bfa', desc: '政策文件设定的目标值' },
  forecast: { label: '机构预测', color: '#fbbf24', desc: '研究机构发布的预测值' },
  estimated: { label: '估算', color: '#fb923c', desc: '基于公开数据推算，仅供趋势参考' },
  illustrative: { label: '示意值', color: '#94a3b8', desc: '表达量级与方向的示意数据，非统计值' }
};

/* ---------------------------- 1. 核心产业规模 ---------------------------- */
const AI_INDUSTRY_SCALE = {
  title: '中国人工智能核心产业规模',
  unit: '亿元',
  sources: ['miit', 'caict', 'plan2017'],
  insight: '实际增长持续跑在规划目标前面：2024 年核心产业规模已接近 6000 亿元，提前越过 2017 年规划为 2025 年设定的 4000 亿元门槛。',
  actual: [
    { year: 2020, value: 1500, caliber: 'reported', note: '达成 2017 年规划“超 1500 亿元”目标' },
    { year: 2021, value: 4000, caliber: 'reported', note: '工信部表述“核心产业规模超过 4000 亿元”' },
    { year: 2022, value: 5080, caliber: 'reported', note: '中国信通院口径' },
    { year: 2023, value: 5787, caliber: 'reported', note: '工信部口径 5787 亿元，信通院口径 5784 亿元' },
    { year: 2024, value: 6000, caliber: 'reported', note: '工信部表述“接近 6000 亿元”' }
  ],
  forecast: [
    { year: 2025, value: 7200, caliber: 'estimated', note: '按约 20% 年均复合增速推算' },
    { year: 2026, value: 8600, caliber: 'estimated' },
    { year: 2027, value: 10400, caliber: 'estimated' },
    { year: 2028, value: 12500, caliber: 'estimated' },
    { year: 2029, value: 15000, caliber: 'estimated' },
    { year: 2030, value: 18000, caliber: 'estimated', note: '多家机构判断 2025 年前后核心产业规模有望突破 1 万亿元' }
  ],
  targets: [
    { year: 2020, value: 1500, caliber: 'target', note: '规划目标 1500 亿元' },
    { year: 2025, value: 4000, caliber: 'target', note: '规划目标 4000 亿元' },
    { year: 2030, value: 10000, caliber: 'target', note: '规划目标 1 万亿元' }
  ]
};

/* ---------------------------- 2. 智能算力规模 ---------------------------- */
const COMPUTE_SCALE = {
  title: '中国智能算力规模',
  unit: 'EFLOPS',
  sources: ['idc', 'miit'],
  insight: '智能算力规模在三年内从百亿亿次级别跃升近 7 倍，算力已经从“配套资源”变成新质生产力的核心生产资料。',
  series: [
    { year: 2022, value: 104.8, caliber: 'reported' },
    { year: 2023, value: 414.1, caliber: 'reported' },
    { year: 2024, value: 725.3, caliber: 'reported' },
    { year: 2025, value: 1037.3, caliber: 'forecast', note: 'IDC 预测' },
    { year: 2027, value: 2117.5, caliber: 'forecast', note: 'IDC 预测' },
    { year: 2028, value: 2781.9, caliber: 'forecast', note: 'IDC 预测' }
  ]
};

const COMPUTE_MIX = {
  title: '算力结构：智能算力占比',
  unit: '%',
  sources: ['idc', 'caict'],
  insight: '通用算力负责“稳”，智能算力负责“增”。智能算力占比快速抬升，说明新增算力投资几乎全部涌向人工智能。',
  categories: ['2022', '2024', '2025E', '2028E'],
  general: [
    { value: 75, caliber: 'estimated' },
    { value: 45, caliber: 'estimated' },
    { value: 38, caliber: 'estimated' },
    { value: 25, caliber: 'forecast' }
  ],
  intelligent: [
    { value: 25, caliber: 'estimated' },
    { value: 55, caliber: 'estimated' },
    { value: 62, caliber: 'estimated' },
    { value: 75, caliber: 'forecast' }
  ]
};

/* ---------------------------- 3. 数字经济与要素 ---------------------------- */
const DIGITAL_ECONOMY = {
  title: '中国数字经济规模',
  unit: '万亿元',
  sources: ['caict'],
  insight: '数字经济已成为国民经济的主要形态之一（2023 年占 GDP 比重约 42.8%），人工智能是其中增速最快的增量部分。',
  series: [
    { year: 2019, value: 35.8, caliber: 'reported' },
    { year: 2020, value: 39.2, caliber: 'reported' },
    { year: 2021, value: 45.5, caliber: 'reported' },
    { year: 2022, value: 50.2, caliber: 'reported' },
    { year: 2023, value: 53.9, caliber: 'reported', note: '占 GDP 比重约 42.8%' }
  ]
};

/* 要素流动桑基图：从要素投入到价值产出 */
const VALUE_FLOW = {
  title: '从要素投入到价值产出：人工智能的作用链',
  sources: ['caict', 'cases'],
  insight: '人工智能改变了生产要素的组合方式：数据被“喂养”成模型，模型被“注入”到行业场景，最终体现为效率、质量与新业态。',
  nodes: [
    '数据要素', '智能算力', '算法与人才',
    '基础大模型', '行业模型',
    '智能制造', '医疗健康', '金融科技', '交通物流', '教育科研', '能源电力', '政务民生',
    '效率提升', '质量跃迁', '新产品新业态'
  ],
  links: [
    { source: '数据要素', target: '基础大模型', value: 34 },
    { source: '智能算力', target: '基础大模型', value: 40 },
    { source: '算法与人才', target: '基础大模型', value: 26 },
    { source: '基础大模型', target: '行业模型', value: 62 },
    { source: '基础大模型', target: '智能制造', value: 14 },
    { source: '基础大模型', target: '教育科研', value: 12 },
    { source: '行业模型', target: '智能制造', value: 22 },
    { source: '行业模型', target: '医疗健康', value: 16 },
    { source: '行业模型', target: '金融科技', value: 15 },
    { source: '行业模型', target: '交通物流', value: 13 },
    { source: '行业模型', target: '能源电力', value: 9 },
    { source: '行业模型', target: '政务民生', value: 8 },
    { source: '智能制造', target: '效率提升', value: 20 },
    { source: '智能制造', target: '质量跃迁', value: 10 },
    { source: '智能制造', target: '新产品新业态', value: 6 },
    { source: '医疗健康', target: '效率提升', value: 9 },
    { source: '医疗健康', target: '质量跃迁', value: 7 },
    { source: '金融科技', target: '效率提升', value: 12 },
    { source: '金融科技', target: '新产品新业态', value: 3 },
    { source: '交通物流', target: '效率提升', value: 11 },
    { source: '教育科研', target: '效率提升', value: 8 },
    { source: '教育科研', target: '新产品新业态', value: 4 },
    { source: '能源电力', target: '效率提升', value: 6 },
    { source: '能源电力', target: '质量跃迁', value: 3 },
    { source: '政务民生', target: '效率提升', value: 6 },
    { source: '政务民生', target: '新产品新业态', value: 2 }
  ]
};

/* ---------------------------- 4. 行业赋能 ---------------------------- */
const INDUSTRY_EMPOWER = {
  title: '人工智能对重点行业的效率提升与渗透水平',
  sources: ['cases'],
  insight: '同一个技术在行业间的落地深度差别很大：数字化基础越好、数据越密集的行业，人工智能渗透得越快。',
  /** 效率提升：相对人工/传统方式的提升幅度（示意值）
   *  渗透率：该行业中使用人工智能业务环节的大致比例（示意值）
   *  规模：相对市场规模权重（示意值） */
  industries: [
    { name: '智能制造', efficiency: 300, penetration: 35, scale: 100, stage: '质检·排产·预测性维护' },
    { name: '金融科技', efficiency: 60, penetration: 45, scale: 88, stage: '风控·投研·客服' },
    { name: '医疗健康', efficiency: 45, penetration: 30, scale: 74, stage: '影像辅助·病历·新药发现' },
    { name: '交通物流', efficiency: 250, penetration: 25, scale: 66, stage: '分拣调度·自动驾驶' },
    { name: '能源电力', efficiency: 200, penetration: 18, scale: 58, stage: '智能巡检·负荷预测' },
    { name: '教育科研', efficiency: 55, penetration: 20, scale: 52, stage: '个性化学习·科研辅助' },
    { name: '政务民生', efficiency: 70, penetration: 30, scale: 48, stage: '一网通办·城市治理' },
    { name: '农业', efficiency: 80, penetration: 12, scale: 40, stage: '病虫害识别·精准种植' }
  ]
};

/* 行业 × 业务环节 渗透率热力图（示意值） */
const PENETRATION_HEATMAP = {
  title: '人工智能在各行业业务环节的渗透程度',
  sources: ['cases'],
  insight: '渗透最深的往往不是“最先进”的环节，而是重复度高、数据留存好的环节——这正是人工智能替代人工比较优势的着力点。',
  stages: ['研发设计', '生产制造', '营销销售', '客户服务', '经营管理'],
  data: [
    { name: '智能制造', values: [32, 46, 28, 30, 34] },
    { name: '金融科技', values: [26, 22, 48, 62, 44] },
    { name: '医疗健康', values: [34, 18, 20, 36, 28] },
    { name: '交通物流', values: [16, 42, 30, 34, 38] },
    { name: '能源电力', values: [20, 38, 16, 22, 30] },
    { name: '教育科研', values: [28, 14, 24, 42, 26] },
    { name: '政务民生', values: [12, 10, 18, 52, 40] },
    { name: '农业', values: [18, 24, 14, 12, 16] }
  ]
};

/* ---------------------------- 5. 创新产出 ---------------------------- */
const GEN_AI_PATENTS = {
  title: '生成式人工智能专利家族全球分布（2014—2023）',
  unit: '项',
  sources: ['wipo'],
  insight: '十年间全球约 5.4 万项生成式人工智能专利家族中，来自中国的占七成（70.6%）——创新的“数量底座”已经形成。',
  series: [
    { name: '中国', value: 38210, caliber: 'reported' },
    { name: '美国', value: 6276, caliber: 'reported' },
    { name: '韩国', value: 4155, caliber: 'reported' },
    { name: '日本', value: 3405, caliber: 'reported' },
    { name: '印度', value: 1350, caliber: 'reported' },
    { name: '英国', value: 714, caliber: 'reported' }
  ],
  /* 报告原文表述为“约 5.4 万项”；此处总量取已披露国别数值之和，便于占比自洽 */
  total: 54110,
  totalNote: '世界知识产权组织报告表述为“约 5.4 万项”，此处总量取已披露国别数值之和'
};

const AI_PATENT_STOCK = {
  title: '我国人工智能领域有效发明专利与备案大模型',
  sources: ['cnipa', 'cac'],
  insight: '专利是“存量创新”，备案大模型是“交付到用户手上的产品”。两条曲线一起抬升，说明创新正在从纸面走向应用。',
  patents: [
    { year: 2023, value: 37.8, caliber: 'reported', note: '有效发明专利约 37.8 万件，居全球前列' },
    { year: 2024, value: 45.0, caliber: 'estimated', note: '按公开增速推算' }
  ],
  models: [
    { year: 2023, value: 100, caliber: 'estimated', note: '首批备案通过 117 款前后的量级' },
    { year: 2024, value: 190, caliber: 'reported', note: '国家网信办公开信息：备案生成式人工智能服务超过 190 款' }
  ]
};

/* 技术方向热度（示意：词频/关注度综合排序） */
const TECH_TREND = {
  title: '人工智能技术方向关注热度',
  sources: ['cases'],
  insight: '从“感知”到“生成”再到“智能体”：技术热点的迁移方向，就是产业价值迁移的方向。',
  items: [
    { name: '大语言模型', weight: 100, era: '生成式' },
    { name: '多模态', weight: 92, era: '生成式' },
    { name: '智能体', weight: 90, era: '自主智能' },
    { name: '具身智能', weight: 82, era: '自主智能' },
    { name: '算力集群', weight: 80, era: '基础设施' },
    { name: '开源模型', weight: 74, era: '生成式' },
    { name: '检索增强', weight: 70, era: '生成式' },
    { name: '推理优化', weight: 66, era: '基础设施' },
    { name: '数据治理', weight: 62, era: '基础设施' },
    { name: '计算机视觉', weight: 60, era: '感知智能' },
    { name: '语音识别', weight: 52, era: '感知智能' },
    { name: '知识图谱', weight: 44, era: '感知智能' },
    { name: '类脑计算', weight: 38, era: '前沿探索' },
    { name: '可解释性', weight: 36, era: '前沿探索' },
    { name: '隐私计算', weight: 34, era: '基础设施' },
    { name: '科学智能', weight: 32, era: '前沿探索' }
  ]
};

/* ---------------------------- 6. 全球经济贡献 ---------------------------- */
const GDP_IMPACT = {
  title: '人工智能对 GDP 的增量贡献（2030 年预测）',
  unit: '万亿美元',
  sources: ['pwc', 'mckinsey'],
  insight: '普华永道预计 2030 年人工智能带来的全球 GDP 增量约 15.7 万亿美元，其中约 7 万亿美元来自中国——接近全球增量的 45%。',
  global: 15.7,
  china: 7,
  mckinseyLow: 2.6,
  mckinseyHigh: 4.4,
  breakdown: [
    { name: '中国', value: 7.0, caliber: 'forecast' },
    { name: '北美', value: 3.7, caliber: 'forecast' },
    { name: '其他地区', value: 5.0, caliber: 'estimated', note: '按全球总量减中、北美倒算' }
  ]
};

/* ---------------------------- 7. 全球格局（示意） ---------------------------- */
const GLOBAL_RADAR = {
  title: '主要经济体人工智能综合竞争力（示意）',
  sources: ['cases'],
  insight: '把算力、专利、论文、企业、投资、人才六个维度放在一起看，中美构成第一梯队，中国的优势集中在专利与论文等创新产出侧。',
  indicators: [
    { name: '智能算力', max: 100 },
    { name: 'AI 专利', max: 100 },
    { name: 'AI 论文', max: 100 },
    { name: 'AI 企业', max: 100 },
    { name: 'AI 投资', max: 100 },
    { name: 'AI 人才', max: 100 }
  ],
  series: [
    { name: '中国', values: [70, 95, 92, 88, 62, 68], caliber: 'illustrative' },
    { name: '美国', values: [98, 62, 72, 70, 95, 90], caliber: 'illustrative' },
    { name: '欧盟', values: [40, 30, 52, 42, 40, 50], caliber: 'illustrative' }
  ]
};

/* AI 产业链图谱 */
const CHAIN_GRAPH = {
  title: '人工智能产业链图谱：上游算力底座、中游模型能力、下游千行百业',
  sources: ['cases'],
  insight: '链条越长，乘数效应越大。上游每提升一分算力效率，都会沿着模型与场景逐级放大。',
  nodes: [
    { id: 'AI 芯片', group: 0, size: 46 },
    { id: '服务器与整机', group: 0, size: 34 },
    { id: '智算中心', group: 0, size: 40 },
    { id: '深度学习框架', group: 0, size: 30 },
    { id: '数据采集与标注', group: 0, size: 32 },
    { id: '数据要素市场', group: 0, size: 26 },
    { id: '基础大模型', group: 1, size: 52 },
    { id: '多模态模型', group: 1, size: 40 },
    { id: '行业模型', group: 1, size: 44 },
    { id: '智能体平台', group: 1, size: 38 },
    { id: '模型即服务', group: 1, size: 34 },
    { id: '智能制造', group: 2, size: 40 },
    { id: '医疗健康', group: 2, size: 34 },
    { id: '金融科技', group: 2, size: 36 },
    { id: '交通物流', group: 2, size: 30 },
    { id: '教育科研', group: 2, size: 28 },
    { id: '能源电力', group: 2, size: 26 },
    { id: '政务民生', group: 2, size: 26 },
    { id: '智能终端', group: 2, size: 32 }
  ],
  links: [
    ['AI 芯片', '服务器与整机'], ['AI 芯片', '智算中心'], ['服务器与整机', '智算中心'],
    ['智算中心', '基础大模型'], ['深度学习框架', '基础大模型'], ['深度学习框架', '行业模型'],
    ['数据采集与标注', '基础大模型'], ['数据采集与标注', '行业模型'], ['数据要素市场', '数据采集与标注'],
    ['基础大模型', '多模态模型'], ['基础大模型', '行业模型'], ['基础大模型', '智能体平台'],
    ['基础大模型', '模型即服务'], ['多模态模型', '智能体平台'], ['模型即服务', '智能终端'],
    ['行业模型', '智能制造'], ['行业模型', '医疗健康'], ['行业模型', '金融科技'],
    ['行业模型', '交通物流'], ['行业模型', '教育科研'], ['行业模型', '能源电力'],
    ['行业模型', '政务民生'], ['智能体平台', '智能制造'], ['智能体平台', '政务民生'],
    ['智能体平台', '金融科技'], ['模型即服务', '教育科研'], ['多模态模型', '医疗健康'],
    ['模型即服务', '交通物流'], ['基础大模型', '智能终端']
  ]
};

/* ---------------------------- 8. 就业结构 ---------------------------- */
const JOBS = {
  title: '人工智能驱动的全球就业结构变化（至 2030 年）',
  unit: '万人',
  sources: ['wef'],
  insight: '技术替代的岗位数约为 9200 万，而新创造的岗位数约为 1.7 亿——净增 7800 万，但“被替代的人”与“新增的岗”之间存在技能鸿沟。',
  created: 17000,
  displaced: 9200,
  net: 7800,
  skillShift: 39,
  employersReducing: 41,
  /** 行业拆分：按世界经济论坛公布的全球总量（新增 1.7 亿 / 替代 0.92 亿）
   *  结合行业结构的示意性拆分，两者合计分别等于 17000 与 9200 万人。 */
  byIndustry: [
    { name: '农业与一线生产', created: 3700, displaced: 1800 },
    { name: '建筑与工程', created: 1300, displaced: 600 },
    { name: '制造与供应链', created: 2000, displaced: 1600 },
    { name: '零售与批发', created: 1600, displaced: 900 },
    { name: '金融与专业服务', created: 1300, displaced: 500 },
    { name: '信息技术与数据', created: 2500, displaced: 300 },
    { name: '医疗与社会照护', created: 2200, displaced: 200 },
    { name: '教育', created: 1400, displaced: 300 },
    { name: '行政与文秘', created: 300, displaced: 1700 },
    { name: '客服与销售', created: 700, displaced: 1300 }
  ],
  talentGap: 500,
  talentGapNote: '我国人工智能领域人才缺口常被引用为约 500 万人量级（人社部、工信部相关公开表述）'
};

/* ---------------------------- 9. 未来展望 ---------------------------- */
const FUTURE_TIMELINE = {
  title: '人工智能作为新质生产力的演进路线（展望）',
  sources: ['plan2017', 'caict', 'cases'],
  insight: '从“技术可用”到“产业可用”再到“社会可用”，每跨一个台阶，衡量标准都会从参数规模转向实际产出。',
  milestones: [
    { year: '2020', title: '技术可用', desc: '感知智能成熟落地，核心产业规模跨过千亿元', caliber: 'reported' },
    { year: '2023', title: '生成式突破', desc: '大模型走向通用，算力、数据、模型三要素形成闭环', caliber: 'reported' },
    { year: '2025', title: '规模应用', desc: '行业模型规模化落地，核心产业规模向万亿元迈进', caliber: 'forecast' },
    { year: '2027', title: '智能体协同', desc: '智能体进入生产流程，人机协同成为常态组织形态', caliber: 'forecast' },
    { year: '2030', title: '全要素渗透', desc: '人工智能成为通用目的技术，全面嵌入生产与治理体系', caliber: 'forecast' },
    { year: '2035', title: '新质生产力成熟', desc: '智能化成为经济增长的主导来源之一', caliber: 'forecast' }
  ]
};

/* 新质生产力指数（示意：以 2020 年为 100） */
const NQP_INDEX = {
  title: '智能化驱动的“新质生产力指数”（示意）',
  sources: ['cases'],
  insight: '该指数为示意性构造：把算力、专利、产业规模、渗透率等指标归一化后合成，用来直观表达“质”的跃升而不是单一规模的增长。',
  series: [
    { year: 2020, value: 100, caliber: 'illustrative' },
    { year: 2021, value: 138, caliber: 'illustrative' },
    { year: 2022, value: 186, caliber: 'illustrative' },
    { year: 2023, value: 265, caliber: 'illustrative' },
    { year: 2024, value: 342, caliber: 'illustrative' },
    { year: 2025, value: 428, caliber: 'illustrative' },
    { year: 2027, value: 640, caliber: 'illustrative' },
    { year: 2030, value: 1002, caliber: 'illustrative' }
  ]
};

/* ---------------------------- 10. 三要素跃迁 ---------------------------- */
const FACTORS = {
  title: '生产力三要素的智能化跃迁',
  sources: ['cases'],
  items: [
    {
      key: 'laborer',
      name: '劳动者',
      icon: '👤',
      before: '以体力与经验为主的操作者',
      after: '驾驭智能工具、定义问题的决策者',
      shift: '从“会做”到“会问”',
      detail: '人工智能接走了重复性劳动，人的价值集中到提出好问题、判断结果、承担责任。自然语言成为新的生产技能入口。'
    },
    {
      key: 'means',
      name: '劳动资料',
      icon: '⚙️',
      before: '机器设备、流水线、软件系统',
      after: '算力集群、基础模型、智能体',
      shift: '从“工具体系”到“能力体系”',
      detail: '劳动资料第一次具备了“通用”属性：同一套模型能力可以被复制到千万个场景，边际成本远低于传统设备。'
    },
    {
      key: 'object',
      name: '劳动对象',
      icon: '🗂️',
      before: '原材料、土地、能源',
      after: '数据、知识、场景与算力资源',
      shift: '从“物质”到“数据”',
      detail: '数据在使用中不仅不损耗，还会增值与复用。这打破了传统要素的稀缺性假设，是“新质”的关键来源。'
    }
  ]
};

/* ---------------------------- 11. 通用目的技术比较 ---------------------------- */
/* 说明：六个维度均为示意打分（0—100），用于横向比较四代通用目的技术的“通用性” */
const GPT_RADAR = {
  title: '四代通用目的技术的“通用性”比较（示意）',
  sources: ['cases'],
  insight: '人工智能与前三代技术最大的不同在最后一维：它具备自我进化能力。这意味着它的能力上限不是固定的，而是随时间自己抬升。',
  indicators: [
    { name: '渗透广度', max: 100 },
    { name: '渗透深度', max: 100 },
    { name: '扩散速度', max: 100 },
    { name: '要素替代性', max: 100 },
    { name: '乘数效应', max: 100 },
    { name: '自我进化', max: 100 }
  ],
  series: [
    { name: '蒸汽机', values: [55, 70, 25, 80, 60, 10], caliber: 'illustrative' },
    { name: '电力', values: [85, 80, 45, 75, 75, 15], caliber: 'illustrative' },
    { name: '互联网', values: [95, 60, 70, 55, 85, 35], caliber: 'illustrative' },
    { name: '人工智能', values: [98, 90, 88, 85, 95, 92], caliber: 'illustrative' }
  ]
};

/* ---------------------------- 12. 新质生产力结构 ---------------------------- */
const SUNBURST = {
  title: '新质生产力的构成：新技术、新要素、新产业',
  sources: ['plan2017', 'cases'],
  insight: '三块结构互相咬合：新技术提供可能，新要素提供条件，新产业提供出口。人工智能是唯一同时出现在三块里的变量。',
  children: [
    {
      name: '新技术',
      children: [
        { name: '人工智能', value: 40 },
        { name: '量子信息', value: 12 },
        { name: '生物制造', value: 12 },
        { name: '新能源技术', value: 14 },
        { name: '空天与深海', value: 9 }
      ]
    },
    {
      name: '新要素',
      children: [
        { name: '数据要素', value: 30 },
        { name: '智能算力', value: 28 },
        { name: '新型人才', value: 22 },
        { name: '耐心资本', value: 16 }
      ]
    },
    {
      name: '新产业',
      children: [
        { name: '智能制造', value: 32 },
        { name: '数字服务', value: 26 },
        { name: '未来产业', value: 20 },
        { name: '绿色低碳', value: 18 }
      ]
    }
  ]
};

const EXPORTS = {
  SOURCES, CALIBERS, GPT_RADAR, SUNBURST,
  AI_INDUSTRY_SCALE, COMPUTE_SCALE, COMPUTE_MIX, DIGITAL_ECONOMY, VALUE_FLOW,
  INDUSTRY_EMPOWER, PENETRATION_HEATMAP, GEN_AI_PATENTS, AI_PATENT_STOCK,
  TECH_TREND, GDP_IMPACT, GLOBAL_RADAR, CHAIN_GRAPH, JOBS, FUTURE_TIMELINE,
  NQP_INDEX, FACTORS
};

if (typeof window !== 'undefined') window.DATASET = EXPORTS;
if (typeof module !== 'undefined') module.exports = EXPORTS;
