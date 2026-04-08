import type { Building, TaskCard, EventAlert, LeaderboardEntry, SkinConfig } from '../types/game';

export const skinConfigs: Record<'finance' | 'energy', SkinConfig> = {
  finance: {
    bg: '#050c1a',
    bgSecondary: '#091428',
    accent: '#00d4ff',
    accentRgb: '0,212,255',
    accentDim: '#005577',
    panelBg: 'rgba(5,16,35,0.88)',
    panelBorder: 'rgba(0,212,255,0.22)',
    textPrimary: '#e2f4ff',
    textSecondary: '#6da8c8',
    mapName: '数字金融港',
    metricLabel: '连续合规零事故',
    metricValue: 47,
    gradientFrom: '#00d4ff',
    gradientTo: '#0066ff',
    buildingColors: ['#0a2a45','#0d2e50','#0a2540','#07203a','#091e38','#071830'],
    completedGlow: 'rgba(0,212,255,0.5)',
    pathColor: '#00d4ff',
  },
  energy: {
    bg: '#060e04',
    bgSecondary: '#0b1a08',
    accent: '#ff8c00',
    accentRgb: '255,140,0',
    accentDim: '#7a4200',
    panelBg: 'rgba(8,16,5,0.88)',
    panelBorder: 'rgba(255,140,0,0.22)',
    textPrimary: '#fff3e0',
    textSecondary: '#c8986a',
    mapName: '智慧能源城',
    metricLabel: '安全运行零违章',
    metricValue: 128,
    gradientFrom: '#ff8c00',
    gradientTo: '#ffcc00',
    buildingColors: ['#2a1800','#301c00','#281600','#221200','#1e1000','#1a0e00'],
    completedGlow: 'rgba(255,140,0,0.5)',
    pathColor: '#ff8c00',
  }
};

export const financeBuildings: Building[] = [
  {
    id: 1, name: '零售支行', subtitle: 'Retail Branch', emoji: '🏦',
    position: { x: 11, y: 63 }, status: 'completed', stars: 3, level: 1, size: 'md',
    script: '《标准开户服务流程》',
    tags: { emotion: '中性', emotionType: 'neutral', riskLevel: 'low' },
    goals: ['标准化服务', '客户满意度', '合规操作'],
    radar: [70, 45, 90, 85, 78],
  },
  {
    id: 2, name: '合规中心', subtitle: 'Compliance Hub', emoji: '⚖️',
    position: { x: 28, y: 70 }, status: 'completed', stars: 2, level: 2, size: 'md',
    script: '《反洗钱合规审查演练》',
    tags: { emotion: '紧张', emotionType: 'anxious', riskLevel: 'high' },
    goals: ['合规操作', '风险识别', '规范话术'],
    radar: [50, 80, 95, 60, 70],
  },
  {
    id: 3, name: '风控岛', subtitle: 'Risk Control', emoji: '🛡️',
    position: { x: 20, y: 37 }, status: 'inprogress', stars: 0, level: 3, size: 'lg',
    script: '《高风险客户投资评估》',
    tags: { emotion: '愤怒', emotionType: 'angry', riskLevel: 'high' },
    goals: ['风险控制', '客户教育', '合规底线'],
    radar: [40, 95, 85, 55, 65],
    unlockReq: '需完成合规中心',
  },
  {
    id: 4, name: '财富塔', subtitle: 'Wealth Tower', emoji: '💎',
    position: { x: 48, y: 27 }, status: 'locked', stars: 0, level: 4, size: 'lg',
    script: '《高净值客户异议处理》',
    tags: { emotion: '焦虑', emotionType: 'anxious', riskLevel: 'high' },
    goals: ['收益最大化', '关系维护', '产品匹配'],
    radar: [95, 70, 80, 90, 75],
    unlockReq: '需完成风控岛',
  },
  {
    id: 5, name: 'VIP贵宾厅', subtitle: 'VIP Lounge', emoji: '👑',
    position: { x: 66, y: 53 }, status: 'locked', stars: 0, level: 5, size: 'md',
    script: '《超高净值私行服务》',
    tags: { emotion: '傲慢', emotionType: 'angry', riskLevel: 'medium' },
    goals: ['高端服务', '情绪管理', '专属方案'],
    radar: [90, 60, 75, 95, 82],
    unlockReq: '需完成财富塔',
  },
  {
    id: 6, name: '投资研究所', subtitle: 'Investment Lab', emoji: '📊',
    position: { x: 80, y: 31 }, status: 'locked', stars: 0, level: 6, size: 'md',
    script: '《量化策略客户讲解》',
    tags: { emotion: '质疑', emotionType: 'anxious', riskLevel: 'medium' },
    goals: ['专业输出', '逻辑清晰', '产品推荐'],
    radar: [85, 65, 70, 80, 92],
    unlockReq: '需完成VIP贵宾厅',
  },
];

export const energyBuildings: Building[] = [
  {
    id: 1, name: '分布式电站', subtitle: 'Distributed Power', emoji: '⚡',
    position: { x: 11, y: 63 }, status: 'completed', stars: 3, level: 1, size: 'md',
    script: '《电站设备巡检规程》',
    tags: { emotion: '中性', emotionType: 'neutral', riskLevel: 'low' },
    goals: ['安全操作', '规范检查', '故障预防'],
    radar: [65, 85, 90, 70, 80],
  },
  {
    id: 2, name: '智能变电站', subtitle: 'Smart Substation', emoji: '🔌',
    position: { x: 28, y: 70 }, status: 'completed', stars: 2, level: 2, size: 'md',
    script: '《变电设备操作规范》',
    tags: { emotion: '紧张', emotionType: 'anxious', riskLevel: 'high' },
    goals: ['安全操作', '规范流程', '事故预防'],
    radar: [55, 90, 85, 65, 70],
  },
  {
    id: 3, name: '安全监控塔', subtitle: 'Safety Tower', emoji: '🗼',
    position: { x: 20, y: 37 }, status: 'inprogress', stars: 0, level: 3, size: 'lg',
    script: '《突发停电应急处置》',
    tags: { emotion: '紧急', emotionType: 'angry', riskLevel: 'high' },
    goals: ['应急响应', '安全保障', '协调调度'],
    radar: [45, 95, 90, 60, 75],
    unlockReq: '需完成智能变电站',
  },
  {
    id: 4, name: '调度中心', subtitle: 'Dispatch Center', emoji: '🎛️',
    position: { x: 48, y: 27 }, status: 'locked', stars: 0, level: 4, size: 'lg',
    script: '《电网调度优化决策》',
    tags: { emotion: '压力', emotionType: 'anxious', riskLevel: 'high' },
    goals: ['调度优化', '负荷平衡', '效率提升'],
    radar: [80, 85, 75, 70, 95],
    unlockReq: '需完成安全监控塔',
  },
  {
    id: 5, name: '储能基地', subtitle: 'Energy Storage', emoji: '🔋',
    position: { x: 66, y: 53 }, status: 'locked', stars: 0, level: 5, size: 'md',
    script: '《储能系统运营管理》',
    tags: { emotion: '焦虑', emotionType: 'anxious', riskLevel: 'medium' },
    goals: ['能源管理', '容量优化', '成本控制'],
    radar: [85, 70, 80, 75, 90],
    unlockReq: '需完成调度中心',
  },
  {
    id: 6, name: '电力交易大厅', subtitle: 'Power Trading Hall', emoji: '📈',
    position: { x: 80, y: 31 }, status: 'locked', stars: 0, level: 6, size: 'md',
    script: '《电力市场竞价策略》',
    tags: { emotion: '博弈', emotionType: 'anxious', riskLevel: 'medium' },
    goals: ['交易策略', '市场分析', '收益优化'],
    radar: [95, 65, 70, 80, 88],
    unlockReq: '需完成储能基地',
  },
];

export const financeEvents: EventAlert[] = [
  {
    id: 1, position: { x: 53, y: 46 }, title: '监管新规', type: 'regulatory',
    description: '银保监发布理财产品信息披露新规，话术需即时更新',
    deadline: '2小时后截止',
  },
  {
    id: 2, position: { x: 37, y: 53 }, title: '突发投诉', type: 'emergency',
    description: '高净值客户对产品亏损提出强烈投诉，需紧急介入',
    deadline: '立即处理',
  },
];

export const energyEvents: EventAlert[] = [
  {
    id: 1, position: { x: 42, y: 47 }, title: '大面积停电', type: 'emergency',
    description: '某区域突发停电，需启动应急预案演练，掌握处置流程',
    deadline: '2小时后截止',
  },
  {
    id: 2, position: { x: 60, y: 41 }, title: '设备故障警报', type: 'emergency',
    description: '主变压器异常报警，需立即掌握故障隔离处置规程',
    deadline: '立即处理',
  },
];

export const financeTaskCards: TaskCard[] = [
  {
    id: 1, type: 'revenue', title: '收益优先卡', tag: '💰 收益最大化',
    subtitle: '高净值客户资产配置推荐话术', difficulty: 3, xp: 120, duration: '15分钟',
  },
  {
    id: 2, type: 'compliance', title: '合规防守卡', tag: '⚖️ 合规加固',
    subtitle: '反洗钱可疑交易特征识别演练', difficulty: 2, xp: 80, duration: '10分钟',
  },
  {
    id: 3, type: 'pressure', title: '高压抗压卡', tag: '🔥 极限挑战',
    subtitle: '极度愤怒客户投诉处理模拟', difficulty: 5, xp: 200, duration: '20分钟',
  },
];

export const energyTaskCards: TaskCard[] = [
  {
    id: 1, type: 'revenue', title: '效率优先卡', tag: '⚡ 收益提升',
    subtitle: '电力交易竞价策略优化演练', difficulty: 3, xp: 120, duration: '15分钟',
  },
  {
    id: 2, type: 'compliance', title: '安全防守卡', tag: '🛡️ 安全合规',
    subtitle: '违章操作识别与安全制止演练', difficulty: 2, xp: 80, duration: '10分钟',
  },
  {
    id: 3, type: 'pressure', title: '应急抗压卡', tag: '🚨 极限应急',
    subtitle: '大面积停电应急调度指挥模拟', difficulty: 5, xp: 200, duration: '20分钟',
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: '张志远', level: '金牌顾问', score: 9850, trend: 'same' },
  { rank: 2, name: '李晓菲', level: '资深经理', score: 9240, trend: 'up' },
  { rank: 3, name: '王建国', level: '资深经理', score: 8890, trend: 'down' },
  { rank: 4, name: '陈美琳', level: '中级经理', score: 8320, isMe: true, trend: 'up' },
  { rank: 5, name: '刘天宇', level: '中级经理', score: 7980, trend: 'same' },
  { rank: 6, name: '赵小明', level: '初级客户', score: 7650, trend: 'down' },
];

export const wikiItems = [
  { id: 1, icon: '📋', title: '客户接待SOP', category: '话术库', tags: ['标准流程', '合规'] },
  { id: 2, icon: '🛡️', title: '反洗钱核查流程', category: '合规手册', tags: ['高优先级', '必学'] },
  { id: 3, icon: '💬', title: '异议处理话术集', category: '话术库', tags: ['情绪管理', '进阶'] },
  { id: 4, icon: '📊', title: '产品推荐话术库', category: '话术库', tags: ['收益', '推荐'] },
  { id: 5, icon: '⚠️', title: '红线合规条款', category: '合规手册', tags: ['必读', '红线'] },
];

export const aiPrescription = [
  { day: '周一', task: '风控岛第二关复训', reason: '上次情绪管理评分偏低', priority: 'high' },
  { day: '周三', task: '异议处理专项训练', reason: '连续2次触发合规红线', priority: 'high' },
  { day: '周五', task: '财富塔解锁挑战', reason: '达到解锁前置条件', priority: 'medium' },
];
