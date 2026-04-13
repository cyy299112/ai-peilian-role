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

export interface WikiItem {
  id: number;
  icon: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
}

export const wikiItems: WikiItem[] = [
  {
    id: 1,
    icon: '📋',
    title: '客户接待SOP',
    category: '话术库',
    tags: ['标准流程', '合规'],
    content: `## 客户接待标准流程

### 一、迎接客户
1. 微笑问候："您好，欢迎光临！请问有什么可以帮您？"
2. 目光接触，保持适当距离
3. 引导客户至服务区域

### 二、需求了解
1. 主动询问客户需求
2. 认真倾听，不打断客户
3. 复述确认："您是想办理...对吗？"

### 三、业务办理
1. 清晰说明办理流程
2. 告知所需时间和材料
3. 办理过程中适时沟通进度

### 四、服务结束
1. 确认业务办理完成
2. 询问是否还有其他需求
3. 礼貌送别："感谢您的光临，请慢走！"

### 五、注意事项
- 全程保持专业形象
- 遇到投诉及时上报
- 保护客户隐私信息`
  },
  {
    id: 2,
    icon: '🛡️',
    title: '反洗钱核查流程',
    category: '合规手册',
    tags: ['高优先级', '必学'],
    content: `## 反洗钱核查标准流程

### 一、客户身份识别
1. 核对身份证件真伪
2. 确认人证一致性
3. 登记客户基本信息

### 二、交易监测
1. 关注大额交易（单笔5万以上）
2. 识别可疑交易特征：
   - 频繁小额转账
   - 与客户身份不符的交易
   - 规避监管的交易行为

### 三、风险等级划分
- 低风险：正常客户
- 中风险：需关注客户
- 高风险：重点监控客户

### 四、报告义务
1. 发现可疑交易立即报告
2. 填写可疑交易报告表
3. 配合反洗钱调查

### 五、禁止行为
❌ 不得向客户透露监测信息
❌ 不得擅自简化核查流程
❌ 不得拖延或隐瞒可疑交易`
  },
  {
    id: 3,
    icon: '💬',
    title: '异议处理话术集',
    category: '话术库',
    tags: ['情绪管理', '进阶'],
    content: `## 客户异议处理话术指南

### 一、情绪安抚话术

**客户愤怒时：**
- "我完全理解您现在的心情，换做是我也会很着急。"
- "非常抱歉给您带来了不好的体验，我一定认真对待。"
- "感谢您直接告诉我们，这给了我们改进的机会。"

### 二、问题解决话术

**需要核实情况时：**
- "这个问题我需要核实一下，请给我X分钟时间。"
- "为了确保给您准确的答复，我需要查询相关记录。"

**无法立即解决时：**
- "这个问题需要转交专业部门处理，我会在X个工作日内给您答复。"
- "我已经记录了您的问题，会有专人跟进处理。"

### 三、拒绝话术（委婉但坚定）

- "我理解您的需求，但根据规定目前无法办理，希望您能理解。"
- "这个要求超出了我的权限范围，建议您..."

### 四、注意事项
1. 不与客户争辩对错
2. 不推诿责任
3. 不承诺无法兑现的事项`
  },
  {
    id: 4,
    icon: '📊',
    title: '产品推荐话术库',
    category: '话术库',
    tags: ['收益', '推荐'],
    content: `## 产品推荐标准话术

### 一、开场白
"根据您的需求，我为您推荐几款适合的产品..."

### 二、产品介绍话术

**结构性存款：**
"这款产品本金有保障，收益与XX挂钩，适合风险承受能力较低但希望获得较高收益的客户。"

**基金产品：**
"这款基金主要投资于XX领域，历史业绩...但过往业绩不代表未来表现，投资有风险。"

**保险产品：**
"这份保险主要提供XX保障，缴费期为XX，保障期为XX..."

### 三、风险提示话术（必须）
⚠️ "投资有风险，入市需谨慎。"
⚠️ "过往业绩不代表未来表现。"
⚠️ "请您仔细阅读产品说明书和风险揭示书。"

### 四、合规红线
❌ 禁止承诺保本保收益
❌ 禁止夸大产品收益
❌ 禁止隐瞒产品风险
❌ 禁止代客户做决定`
  },
  {
    id: 5,
    icon: '⚠️',
    title: '红线合规条款',
    category: '合规手册',
    tags: ['必读', '红线'],
    content: `## 合规红线条款

### 🚨 绝对禁止行为

**一、销售误导**
1. 承诺保本保收益
2. 夸大产品收益或隐瞒风险
3. 将保险产品说成存款
4. 代客户签署文件

**二、违规操作**
1. 无证件办理业务
2. 泄露客户信息
3. 私自代客理财
4. 参与民间融资

**三、服务违规**
1. 与客户发生肢体冲突
2. 使用侮辱性语言
3. 拒绝办理合规业务
4. 擅自离岗导致客户长时间等待

### ⚠️ 高风险行为

- 代客户保管重要物品
- 私下接受客户礼品
- 与客户发生资金往来
- 在非工作场所办理业务

### 📋 合规要求

1. 严格执行双录（录音录像）
2. 充分揭示产品风险
3. 核实客户真实意愿
4. 妥善保管业务资料

违反红线条款将面临：
- 绩效考核扣分
- 纪律处分
- 法律责任追究`
  },
];

export const aiPrescription = [
  { day: '周一', task: '风控岛第二关复训', reason: '上次情绪管理评分偏低', priority: 'high' },
  { day: '周三', task: '异议处理专项训练', reason: '连续2次触发合规红线', priority: 'high' },
  { day: '周五', task: '财富塔解锁挑战', reason: '达到解锁前置条件', priority: 'medium' },
];
