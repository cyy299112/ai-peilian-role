import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Shield, Target, Clock, Star, Zap, AlertTriangle, CheckCircle2,
  TrendingUp, Brain, RotateCcw, Map as MapIcon, ChevronRight, Flame, BadgeCheck,
  MessageSquare, User, Volume2, Play
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { Skin, SkinConfig } from '../types/game';
import { skinConfigs } from '../data/gameData';

// ─── Types ─────────────────────────────────────────────────
interface ResponseOption {
  id: string;
  text: string;
  scores: [number, number, number, number, number]; // revenue,risk,compliance,experience,efficiency
  isRedLine: boolean;
  feedback: string;
}
interface Act {
  title: string;
  aiMessage: string;
  emotionAfter: number; // 0-100
  options: ResponseOption[];
}
interface ScenarioData {
  scriptTitle: string;
  aiCharacter: { name: string; role: string; age: number; emotionLabel: string; avatar: string; initialMood: number; backstory: string };
  userRole: string;
  costumes: string[];
  objectives: string[];
  acts: Act[];
}

// ─── Mock Scenario Data ────────────────────────────────────
const financeScenarios: Record<string, ScenarioData> = {
  default: {
    scriptTitle: '《高净值客户异议处理》',
    aiCharacter: { name: '李建国', role: '高净值个人客户', age: 52, emotionLabel: '愤怒', avatar: '😤', initialMood: 20, backstory: '从事制造业20年，资产雄厚，对投资损失极度敏感，曾多次向银行投诉' },
    userRole: '资深理财经理', costumes: ['👔 商务套装', '💼 正式西装', '🤝 亲和便装'],
    objectives: ['平息客户情绪', '合规处理异议', '维护长期关系'],
    acts: [
      { title: '情绪爆发阶段', aiMessage: '你们这家银行太不负责任了！上个月推荐我买的基金，现在已经亏了20万！你们到底负不负责？！', emotionAfter: 35,
        options: [
          { id: 'a', text: '李先生，我完全理解您此刻的心情，20万的亏损确实令人难以接受。感谢您第一时间来找我，我们一起来看看具体情况，我一定认真对待。', scores: [70,85,95,92,82], isRedLine: false, feedback: '✅ 优秀！共情接纳，未辩解，成功建立初步信任' },
          { id: 'b', text: '这个亏损是市场行为，您签了风险揭示书的，银行不承担责任。', scores: [30,70,65,18,55], isRedLine: false, feedback: '⚠️ 事实正确但话术生硬，严重激化客户情绪' },
          { id: 'c', text: '对不起！我们一定会全额赔偿您的损失！', scores: [55,25,15,62,45], isRedLine: true, feedback: '❌ 触发红线！擅自承诺赔偿属严重越权违规' },
          { id: 'd', text: '请您先冷静一下，我们来核实一下您的账户情况。', scores: [60,72,80,65,70], isRedLine: false, feedback: '⚠️ 尚可，但缺少情感共鸣，客户感受不被重视' },
        ],
      },
      { title: '问题核实阶段', aiMessage: '（情绪稍缓）我当初说了不能承受太大风险，你们为什么推荐这么激进的产品？', emotionAfter: 55,
        options: [
          { id: 'a', text: '李先生，您提的这个问题非常重要。能否允许我调取一下您当时的风险评估记录？我想和您一起确认当时的完整情况，确保后续处理公平合理。', scores: [78,92,96,90,88], isRedLine: false, feedback: '✅ 专业！正视问题，合规调查，展现处理能力' },
          { id: 'b', text: '我们当时是完全按照您的风险评估结果推荐的，您可能记错了。', scores: [45,68,72,32,58], isRedLine: false, feedback: '⚠️ 暗示客户记错，大概率激化矛盾' },
          { id: 'c', text: '这款产品长期来看一定会涨回来的，您再等一段时间。', scores: [55,45,30,55,58], isRedLine: true, feedback: '❌ 预测未来市场走势属违规承诺，严格禁止' },
          { id: 'd', text: '这个问题需要我们合规部门介入，请您先留下联系方式。', scores: [68,85,90,58,65], isRedLine: false, feedback: '✅ 合规处理方向正确，但缺少人文关怀' },
        ],
      },
      { title: '方案提出阶段', aiMessage: '（情绪平稳）好吧，那你们具体打算怎么处理这件事？', emotionAfter: 75,
        options: [
          { id: 'a', text: '李先生，我建议这样处理：1.今天帮您提交正式复核申请；2.重新为您做风险评估，调整组合；3.我亲自跟进，3个工作日内给您书面回复。', scores: [90,90,96,96,92], isRedLine: false, feedback: '✅ 完美！清晰方案，承担责任，专业度满分' },
          { id: 'b', text: '我会上报给领导，请您等待处理结果。', scores: [52,72,82,55,60], isRedLine: false, feedback: '⚠️ 推诿领导，缺乏主动担当，客户满意度低' },
          { id: 'c', text: '我们会帮您把亏损部分全额补偿。', scores: [65,28,12,72,62], isRedLine: true, feedback: '❌ 承诺全额赔偿严重违规，可能引发法律风险' },
          { id: 'd', text: '我先帮您分析一下当前市场状况，看看有没有补救的投资方案。', scores: [75,68,78,80,72], isRedLine: false, feedback: '✅ 有建设性，但缺乏明确时间节点和责任承担' },
        ],
      },
    ],
  },
  'building-1': {
    scriptTitle: '《标准开户服务流程》',
    aiCharacter: { name: '王小明', role: '普通储蓄客户', age: 28, emotionLabel: '中性', avatar: '🧑‍💼', initialMood: 72, backstory: '首次来网点办理业务，不了解流程，但态度友好' },
    userRole: '零售柜员', costumes: ['👔 标准制服', '💼 商务装', '🎯 营业装'],
    objectives: ['标准流程开户', '合规核实身份', '主动介绍服务'],
    acts: [
      { title: '客户接待', aiMessage: '你好，我想开一个储蓄账户，不知道需要什么手续？', emotionAfter: 78,
        options: [
          { id: 'a', text: '您好！欢迎光临，开储蓄账户需要身份证原件，填写申请表，整个过程约10分钟，请问您方便吗？', scores: [82,42,93,92,87], isRedLine: false, feedback: '✅ 专业接待，流程清晰，客户体验优秀' },
          { id: 'b', text: '需要身份证，填表，等着。', scores: [62,40,77,45,72], isRedLine: false, feedback: '⚠️ 信息准确但服务态度生硬，影响客户感受' },
          { id: 'c', text: '不用证件也可以的，我帮你操作。', scores: [48,30,10,58,55], isRedLine: true, feedback: '❌ 无证件开户严重违规，涉嫌洗钱风险' },
          { id: 'd', text: '请稍等，我先帮您查一下需要什么材料。', scores: [68,40,82,72,56], isRedLine: false, feedback: '⚠️ 态度好但流程不熟，效率略低' },
        ],
      },
      { title: '信息核实', aiMessage: '好的，我身份证带了。对了，你们存款利率是多少？', emotionAfter: 85,
        options: [
          { id: 'a', text: '活期年利率0.35%，我们也有多种定期和理财产品，收益各有不同。先核实下您的身份信息，稍后可详细介绍。', scores: [88,52,90,93,89], isRedLine: false, feedback: '✅ 专业回答，顺势引导理财，优秀表现' },
          { id: 'b', text: '利率很低，直接买理财吧，收益能达到5%以上！', scores: [72,28,30,68,73], isRedLine: true, feedback: '❌ 承诺保证收益，属于误导性销售' },
          { id: 'c', text: '活期利率0.35%，先把证件给我看。', scores: [65,45,82,60,74], isRedLine: false, feedback: '⚠️ 信息正确但主动服务意识不足' },
          { id: 'd', text: '利率每天变动，您可以参看产品说明书。', scores: [70,46,87,70,65], isRedLine: false, feedback: '⚠️ 谨慎合规，但缺乏主动服务意识' },
        ],
      },
      { title: '开户完成', aiMessage: '表都填好了，感觉你们服务不错！我还想了解一下你们的理财产品。', emotionAfter: 92,
        options: [
          { id: 'a', text: '感谢您的认可！我们有多种产品，风险和收益各异。先了解您的风险承受能力，再为您推荐最合适的，好吗？', scores: [93,67,96,96,90], isRedLine: false, feedback: '✅ 完美！合规询问风险承受能力，专业度满分' },
          { id: 'b', text: '我们有一款年化8%的产品特别适合您！', scores: [70,22,18,73,73], isRedLine: true, feedback: '❌ 承诺年化收益违规，须严格规避' },
          { id: 'c', text: '好的，我们有很多产品，我帮您介绍几款主流的。', scores: [78,52,72,82,78], isRedLine: false, feedback: '⚠️ 可以，但未先评估风险承受能力' },
          { id: 'd', text: '您先回去考虑，有需要随时来。', scores: [60,72,90,65,60], isRedLine: false, feedback: '⚠️ 合规但过于保守，未抓住服务机会' },
        ],
      },
    ],
  },
};

const energyScenarios: Record<string, ScenarioData> = {
  default: {
    scriptTitle: '《突发停电应急处置》',
    aiCharacter: { name: '调度指挥中心', role: '区域电网调度员', age: 38, emotionLabel: '紧急', avatar: '🚨', initialMood: 22, backstory: '负责区域配电网调度，本次大面积停电已引发政府和媒体关注，压力极大' },
    userRole: '应急处置工程师', costumes: ['🦺 应急背心', '👷 工程制服', '🔧 技术装备'],
    objectives: ['快速确认停电范围', '启动应急预案', '协调关键负荷保障'],
    acts: [
      { title: '接报与确认', aiMessage: '紧急情况！区域A3主变压器突然跳闸，1.2万户停电！请立即报告处置方案！', emotionAfter: 42,
        options: [
          { id: 'a', text: '明确收到！立即执行：1.触发橙色应急预案；2.派驻现场勘查组；3.启动备用电源切换。请问跳闸准确时间和是否有明显外部原因？', scores: [78,94,92,88,94], isRedLine: false, feedback: '✅ 专业！快速响应，流程规范，信息确认到位' },
          { id: 'b', text: '我现在去看看是什么问题。', scores: [45,58,62,52,42], isRedLine: false, feedback: '⚠️ 行动迟缓，未触发应急预案，延误抢修时机' },
          { id: 'c', text: '这种情况不严重，等值班主任来了再处理。', scores: [18,22,28,22,18], isRedLine: true, feedback: '❌ 严重失职！大面积停电属紧急事件，不可推诿' },
          { id: 'd', text: '收到，先确认停电区域内医院和交通设施是否受影响。', scores: [72,90,90,85,82], isRedLine: false, feedback: '✅ 优先考虑重要负荷，思路正确但稍慢启动预案' },
        ],
      },
      { title: '资源协调阶段', aiMessage: '现场报告：电缆故障，预计修复4小时。区域内有一家医院和两所学校！', emotionAfter: 60,
        options: [
          { id: 'a', text: '立即执行：1.医院优先，调移动发电车30分钟内到位；2.联系两所学校暂停相关设备；3.发布停电公告含预计恢复时间；4.两小时后提交进度报告。', scores: [82,94,96,92,97], isRedLine: false, feedback: '✅ 完美调度！优先级正确，措施全面，节点清晰' },
          { id: 'b', text: '医院有自备发电机，应该没问题。', scores: [42,56,52,45,50], isRedLine: false, feedback: '⚠️ 不可假设，须主动确认医院备电状态' },
          { id: 'c', text: '先通知居民注意安全，其他等现场确认后再说。', scores: [55,62,68,58,55], isRedLine: false, feedback: '⚠️ 方向正确但不够主动，未预先协调医院电源' },
          { id: 'd', text: '这超出我的权限，需要请示领导再安排。', scores: [28,38,42,32,28], isRedLine: true, feedback: '❌ 应急情况下以权限推诿，延误救援，严重失职' },
        ],
      },
      { title: '对外通报阶段', aiMessage: '修复进展顺利，预计1小时后恢复供电，如何向公众通报？', emotionAfter: 85,
        options: [
          { id: 'a', text: '按规程发布《停电故障通报》：包含原因、受影响范围、预计恢复时间、应急措施及联系热线，同时向政府应急部门正式通报。', scores: [88,87,96,94,92], isRedLine: false, feedback: '✅ 规范的信息发布流程，透明公开，有效维护公信力' },
          { id: 'b', text: '在官微发一条简短说明就行了。', scores: [55,60,62,60,65], isRedLine: false, feedback: '⚠️ 信息不完整，未通报政府，可能违反报告规定' },
          { id: 'c', text: '现在不要公布，免得引起不必要的恐慌。', scores: [38,48,28,42,42], isRedLine: true, feedback: '❌ 刻意隐瞒停电信息，违反信息公开规定' },
          { id: 'd', text: '通知媒体发布恢复供电消息，具体原因不用说明。', scores: [60,58,55,62,60], isRedLine: false, feedback: '⚠️ 积极但不够透明，公众需了解事件原因' },
        ],
      },
    ],
  },
  'building-1': {
    scriptTitle: '《电站设备巡检规程》',
    aiCharacter: { name: '新员工张磊', role: '运维实习生', age: 24, emotionLabel: '困惑', avatar: '🤔', initialMood: 65, backstory: '刚参加工作，积极主动但对规程不熟悉，需要专业指导' },
    userRole: '资深运维工程师', costumes: ['🦺 安全背心', '👷 工程制服', '🔧 作业装备'],
    objectives: ['传授标准巡检流程', '强调安全规范', '培养规程意识'],
    acts: [
      { title: '巡检前准备', aiMessage: '师傅，今天我第一次独立巡检，我想直接去看设备状态就好了吧？', emotionAfter: 75,
        options: [
          { id: 'a', text: '先别急。巡检前必须：1.填写作业票；2.穿戴绝缘手套和安全帽；3.带好检测仪表；4.确认巡检范围清单。安全规程是首要原则，不能省略。', scores: [68,96,95,90,85], isRedLine: false, feedback: '✅ 规范指导，安全第一，培养良好习惯' },
          { id: 'b', text: '工具随便带几样就行，主要看看外观有没有问题。', scores: [52,45,50,55,58], isRedLine: false, feedback: '⚠️ 指导不规范，可能留下安全隐患' },
          { id: 'c', text: '不用填作业票，我以前都这么做，效率高。', scores: [40,25,18,45,55], isRedLine: true, feedback: '❌ 省略作业票属于违规操作，可能引发安全事故' },
          { id: 'd', text: '先去看看吧，遇到问题再说。', scores: [45,38,42,50,52], isRedLine: false, feedback: '⚠️ 过于随意，未强调规程重要性' },
        ],
      },
      { title: '现场发现异常', aiMessage: '师傅！我发现一台变压器温度指示灯是红色的，我直接去摸一下看看温度？', emotionAfter: 82,
        options: [
          { id: 'a', text: '停！千万不能直接触摸！红色报警需立即：1.保持安全距离；2.记录设备编号和时间；3.报告班组长；4.等待处置指令。这是安全规程第一条。', scores: [72,98,97,88,87], isRedLine: false, feedback: '✅ 完美！第一时间制止危险行为，规程意识强' },
          { id: 'b', text: '没事，轻轻摸一下应该没问题。', scores: [30,12,15,42,40], isRedLine: true, feedback: '❌ 严重违章！带电设备禁止徒手触摸，可能致命' },
          { id: 'c', text: '先记录下来，等巡检完再统一上报。', scores: [55,68,72,62,58], isRedLine: false, feedback: '⚠️ 方向对但处理不够紧急，温度异常应立即上报' },
          { id: 'd', text: '你先拍个照片，我来看看是不是真的报警。', scores: [68,78,80,72,72], isRedLine: false, feedback: '⚠️ 比较合理，但应更强调保持安全距离' },
        ],
      },
      { title: '巡检总结', aiMessage: '巡检完成，我发现了2处异常，填完记录表就算完成了吗？', emotionAfter: 90,
        options: [
          { id: 'a', text: '还差最后一步！完整巡检闭环：1.填写记录表（含异常项目）；2.向班组长口头汇报异常；3.跟踪异常处理结果；4.归档记录。这样才算合格。', scores: [75,90,95,93,90], isRedLine: false, feedback: '✅ 规范完整，培养闭环意识，优秀指导' },
          { id: 'b', text: '填完表交给我就行，其他的我来处理。', scores: [55,65,72,65,60], isRedLine: false, feedback: '⚠️ 可以，但未培养员工的完整责任意识' },
          { id: 'c', text: '你自己去向主任汇报吧，我还有其他事。', scores: [48,58,65,52,55], isRedLine: false, feedback: '⚠️ 指导责任不到位，新员工独自汇报易出错' },
          { id: 'd', text: '差不多了，异常问题我帮你处理好了。', scores: [50,62,68,60,58], isRedLine: false, feedback: '⚠️ 替代处理不利于培养独立工作能力' },
        ],
      },
    ],
  },
};

function getScenario(trainingId: string, skin: Skin): ScenarioData {
  const map = skin === 'finance' ? financeScenarios : energyScenarios;
  if (trainingId.startsWith('card-')) {
    const cardId = parseInt(trainingId.split('-')[1]);
    const base = map['default'];
    const titles: Record<string, Record<number, string>> = {
      finance: { 1: '《高净值资产配置推荐》', 2: '《反洗钱可疑交易识别》', 3: '《极端客户投诉应对》' },
      energy: { 1: '《电力交易竞价策略》', 2: '《违章操作识别制止》', 3: '《大面积停电应急指挥》' },
    };
    return { ...base, scriptTitle: titles[skin]?.[cardId] ?? base.scriptTitle };
  }
  return map[trainingId] ?? map['default'];
}

const dimensionLabels = ['收益', '风险', '合规', '体验', '效率'];
const dimensionColors = ['#84cc16', '#f97316', '#38bdf8', '#a78bfa', '#fbbf24'];

// ─── Character Select Screen ────────────────────────────────
function CharacterSelectScreen({ scenario, config, onStart }: { scenario: ScenarioData; config: SkinConfig; onStart: (costume: number) => void }) {
  const [costume, setCostume] = useState(0);
  const ac = scenario.aiCharacter;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', borderBottom: `1px solid ${config.panelBorder}`, background: config.panelBg, backdropFilter: 'blur(16px)' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: config.textSecondary, letterSpacing: '0.2em', marginBottom: 4 }}>MISSION BRIEFING · ACT Ⅰ</div>
        <div style={{ color: config.textPrimary, fontWeight: 700, fontSize: 20 }}>{scenario.scriptTitle}</div>
        <div style={{ color: config.textSecondary, fontSize: 12, marginTop: 2 }}>确认角色与任务，准备进入训练场景</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', gap: 20, padding: 24, overflow: 'hidden' }}>
        {/* User character */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ flex: 1, background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: config.accent, letterSpacing: '0.15em' }}>YOUR CHARACTER</div>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{['🧑‍💼', '👨‍💼', '👩‍💼'][costume]}</div>
            <div style={{ color: config.textPrimary, fontWeight: 700, fontSize: 18 }}>{scenario.userRole}</div>
            <div style={{ color: config.textSecondary, fontSize: 12, marginTop: 4 }}>您的扮演角色</div>
          </div>
          <div>
            <div style={{ color: config.textSecondary, fontSize: 11, marginBottom: 10 }}>选择装束：</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {scenario.costumes.map((c, i) => (
                <button key={i} onClick={() => setCostume(i)} style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10, border: `1px solid ${i === costume ? config.accent : config.panelBorder}`,
                  background: i === costume ? `rgba(${config.accentRgb},0.15)` : 'transparent',
                  color: i === costume ? config.accent : config.textSecondary,
                  fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif",
                  boxShadow: i === costume ? `0 0 10px rgba(${config.accentRgb},0.2)` : 'none',
                }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* VS divider */}
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          <div style={{ width: 1, flex: 1, background: config.panelBorder }} />
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `rgba(${config.accentRgb},0.15)`, border: `1px solid ${config.panelBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: config.accent }}>VS</div>
          <div style={{ width: 1, flex: 1, background: config.panelBorder }} />
        </div>

        {/* AI character */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ flex: 1, background: config.panelBg, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: '#ef4444', letterSpacing: '0.15em' }}>AI OPPONENT</div>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{ac.avatar}</div>
            <div style={{ color: '#fca5a5', fontWeight: 700, fontSize: 18 }}>{ac.name}</div>
            <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{ac.role} · {ac.age}岁</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, padding: '3px 10px', borderRadius: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 600 }}>😤 情绪状态：{ac.emotionLabel}</span>
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', fontSize: 11, color: '#d1d5db', lineHeight: 1.6 }}>
            <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 10 }}>背景档案：</span><br />{ac.backstory}
          </div>
        </motion.div>

        {/* Mission objectives */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ width: 220, background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: config.accent, letterSpacing: '0.15em' }}>OBJECTIVES</div>
          <div>
            <div style={{ color: config.textSecondary, fontSize: 11, marginBottom: 10 }}>任务目标</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {scenario.objectives.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: `rgba(${config.accentRgb},0.06)`, border: `1px solid ${config.panelBorder}` }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: `rgba(${config.accentRgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: config.accent, fontFamily: "'Orbitron', sans-serif", flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ color: config.textPrimary, fontSize: 11 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ color: config.textSecondary, fontSize: 10, marginBottom: 8 }}>剧本共 {scenario.acts.length} 幕对话</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {scenario.acts.map((a, i) => (
                <div key={i} style={{ flex: 1, padding: '4px 2px', borderRadius: 4, background: `rgba(${config.accentRgb},0.12)`, border: `1px solid ${config.panelBorder}`, textAlign: 'center', fontSize: 9, color: config.accent }}>
                  第{i + 1}幕
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Start button */}
      <div style={{ padding: '16px 32px', borderTop: `1px solid ${config.panelBorder}`, background: config.panelBg, backdropFilter: 'blur(16px)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={14} style={{ color: config.textSecondary }} />
          <span style={{ color: config.textSecondary, fontSize: 11 }}>训练过程中注意合规红线，触发红线将扣减综合评分</span>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => onStart(costume)}
          style={{ padding: '12px 36px', borderRadius: 12, background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`, border: 'none', color: '#000', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 0 24px rgba(${config.accentRgb},0.5)` }}>
          <Play size={16} fill="black" />
          进入训练场景
          <ChevronRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Training Dialogue Screen ────────────────────────────────
interface TrainingScreenProps {
  scenario: ScenarioData; config: SkinConfig; skin: Skin; costume: number;
  onComplete: (scores: number[], redLines: number) => void; onBack: () => void;
}

interface Message { id: number; role: 'ai' | 'user'; text: string; isRedLine?: boolean }

function TrainingScreen({ scenario, config, skin, costume, onComplete, onBack }: TrainingScreenProps) {
  const [currentAct, setCurrentAct] = useState(0);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'ai', text: scenario.acts[0].aiMessage }]);
  const [scores, setScores] = useState([70, 65, 78, 74, 70]);
  const [aiMood, setAiMood] = useState(scenario.aiCharacter.initialMood);
  const [phase, setPhase] = useState<'choosing' | 'feedback'>('choosing');
  const [lastOption, setLastOption] = useState<ResponseOption | null>(null);
  const [redLineCount, setRedLineCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const msgEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { timerRef.current = setInterval(() => setTimer(t => t + 1), 1000); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSelect = (opt: ResponseOption) => {
    const newScores = scores.map((s, i) => Math.round(s * 0.35 + opt.scores[i] * 0.65));
    setScores(newScores);
    setAiMood(scenario.acts[currentAct].emotionAfter);
    setLastOption(opt);
    if (opt.isRedLine) setRedLineCount(c => c + 1);
    setMessages(prev => [...prev, { id: prev.length, role: 'user', text: opt.text, isRedLine: opt.isRedLine }]);
    setPhase('feedback');
  };

  const handleNext = () => {
    if (currentAct < scenario.acts.length - 1) {
      const nextAct = currentAct + 1;
      setCurrentAct(nextAct);
      setMessages(prev => [...prev, { id: prev.length, role: 'ai', text: scenario.acts[nextAct].aiMessage }]);
      setPhase('choosing');
      setLastOption(null);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(scores, redLineCount + (lastOption?.isRedLine ? 0 : 0));
    }
  };

  const act = scenario.acts[currentAct];
  const ac = scenario.aiCharacter;
  const moodColor = aiMood < 30 ? '#ef4444' : aiMood < 60 ? '#f59e0b' : '#22c55e';
  const moodLabel = aiMood < 30 ? '激动' : aiMood < 50 ? '焦虑' : aiMood < 70 ? '平静' : '满意';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Top bar */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', background: config.panelBg, borderBottom: `1px solid ${config.panelBorder}`, backdropFilter: 'blur(16px)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, color: config.textSecondary, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontSize: 12 }}>
          <ArrowLeft size={14} /><span>返回地图</span>
        </button>
        <div style={{ width: 1, height: 20, background: config.panelBorder }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {scenario.acts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: i < currentAct ? `rgba(${config.accentRgb},0.2)` : i === currentAct ? `rgba(${config.accentRgb},0.12)` : 'transparent', border: `1px solid ${i <= currentAct ? config.panelBorder : 'transparent'}` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: i < currentAct ? config.accent : i === currentAct ? config.accent : '#374151', boxShadow: i === currentAct ? `0 0 6px ${config.accent}` : 'none' }} />
              <span style={{ fontSize: 10, color: i <= currentAct ? config.accent : '#6b7280' }}>第{i + 1}幕</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: config.textSecondary, fontSize: 11 }}>{scenario.scriptTitle}</span>
        </div>
        {redLineCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertTriangle size={11} style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444', fontSize: 11, fontFamily: "'Orbitron', sans-serif" }}>红线 ×{redLineCount}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: config.textSecondary, fontSize: 12 }}>
          <Clock size={12} />
          <span style={{ fontFamily: "'Orbitron', sans-serif" }}>{fmtTime(timer)}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Left: Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${config.panelBorder}` }}>
          {/* AI character card */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${config.panelBorder}`, background: `rgba(${config.accentRgb},0.03)`, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))`, border: '2px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 0 16px rgba(239,68,68,0.25)' }}>
              {ac.avatar}
            </motion.div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fca5a5', fontWeight: 700, fontSize: 14 }}>{ac.name}</span>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>{ac.role}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ color: '#6b7280', fontSize: 10 }}>情绪状态：</span>
                <div style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${aiMood}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: `linear-gradient(90deg, #ef4444, ${moodColor})`, borderRadius: 2 }} />
                </div>
                <span style={{ color: moodColor, fontSize: 10, fontWeight: 600 }}>{moodLabel} {aiMood}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary }}>ACT {currentAct + 1}/{scenario.acts.length}</div>
              <div style={{ color: config.accent, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{act.title}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: msg.role === 'ai' ? 'flex-start' : 'flex-end', alignItems: 'flex-start', gap: 8 }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{ac.avatar}</div>
                )}
                <div style={{ maxWidth: '68%', padding: '10px 14px', borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: msg.role === 'ai' ? 'rgba(239,68,68,0.1)' : msg.isRedLine ? 'rgba(239,68,68,0.2)' : `rgba(${config.accentRgb},0.15)`, border: `1px solid ${msg.role === 'ai' ? 'rgba(239,68,68,0.25)' : msg.isRedLine ? 'rgba(239,68,68,0.4)' : `rgba(${config.accentRgb},0.3)`}`, fontSize: 12, color: config.textPrimary, lineHeight: 1.6 }}>
                  {msg.isRedLine && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#ef4444', fontSize: 10 }}><AlertTriangle size={10} />合规红线触发</div>}
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `rgba(${config.accentRgb},0.2)`, border: `1px solid rgba(${config.accentRgb},0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {['🧑‍💼', '👨‍💼', '👩‍💼'][costume]}
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={msgEndRef} />
          </div>

          {/* Response options / feedback */}
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${config.panelBorder}`, background: `rgba(${config.accentRgb},0.02)`, flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              {phase === 'choosing' ? (
                <motion.div key="choosing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <MessageSquare size={12} style={{ color: config.textSecondary }} />
                    <span style={{ color: config.textSecondary, fontSize: 11 }}>选择您的回应方式：</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {act.options.map((opt, i) => (
                      <motion.button key={opt.id} whileHover={{ x: 4, backgroundColor: `rgba(${config.accentRgb},0.12)` }}
                        onClick={() => handleSelect(opt)}
                        style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 10, background: `rgba(${config.accentRgb},0.05)`, border: `1px solid ${config.panelBorder}`, color: config.textPrimary, fontSize: 12, cursor: 'pointer', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: "'Rajdhani', sans-serif" }}>
                        <span style={{ minWidth: 20, height: 20, borderRadius: 6, background: `rgba(${config.accentRgb},0.2)`, border: `1px solid rgba(${config.accentRgb},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: config.accent, fontFamily: "'Orbitron', sans-serif", flexShrink: 0 }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="feedback" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  {lastOption && (
                    <div style={{ padding: '12px 16px', borderRadius: 12, background: lastOption.isRedLine ? 'rgba(239,68,68,0.1)' : `rgba(${config.accentRgb},0.1)`, border: `1px solid ${lastOption.isRedLine ? 'rgba(239,68,68,0.4)' : `rgba(${config.accentRgb},0.3)`}`, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        {lastOption.isRedLine ? <AlertTriangle size={13} style={{ color: '#ef4444' }} /> : <CheckCircle2 size={13} style={{ color: config.accent }} />}
                        <span style={{ fontSize: 11, fontWeight: 700, color: lastOption.isRedLine ? '#ef4444' : config.accent }}>AI教练点评</span>
                      </div>
                      <div style={{ fontSize: 12, color: config.textPrimary, lineHeight: 1.5 }}>{lastOption.feedback}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
                      style={{ padding: '9px 24px', borderRadius: 10, background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`, border: 'none', color: '#000', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                      {currentAct < scenario.acts.length - 1 ? <><span>下一幕</span><ChevronRight size={13} /></> : <><span>查看复盘报告</span><TrendingUp size={13} /></>}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Meta panel */}
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: 16, gap: 14 }}>
          {/* Act progress */}
          <div style={{ padding: 12, borderRadius: 12, background: config.panelBg, border: `1px solid ${config.panelBorder}` }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.1em', marginBottom: 8 }}>剧本进度</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {scenario.acts.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: i < currentAct ? config.accent : i === currentAct ? `rgba(${config.accentRgb},0.4)` : 'rgba(107,114,128,0.2)', border: i === currentAct ? `2px solid ${config.accent}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i < currentAct && <div style={{ width: 6, height: 6, borderRadius: '50%', background: config.bg }} />}
                  </div>
                  <span style={{ fontSize: 10, color: i <= currentAct ? config.textPrimary : '#6b7280', fontWeight: i === currentAct ? 700 : 400 }}>{a.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current objective */}
          <div style={{ padding: 12, borderRadius: 12, background: config.panelBg, border: `1px solid ${config.panelBorder}` }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.1em', marginBottom: 8 }}>当前目标</div>
            {scenario.objectives.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <CheckCircle2 size={11} style={{ color: i <= currentAct ? config.accent : '#374151', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: i <= currentAct ? config.textPrimary : '#6b7280' }}>{o}</span>
              </div>
            ))}
          </div>

          {/* Real-time scores */}
          <div style={{ padding: 12, borderRadius: 12, background: config.panelBg, border: `1px solid ${config.panelBorder}` }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.1em', marginBottom: 10 }}>实时战绩</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dimensionLabels.map((label, i) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: config.textSecondary }}>{label}</span>
                    <span style={{ fontSize: 10, fontFamily: "'Orbitron', sans-serif", color: dimensionColors[i] }}>{scores[i]}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${scores[i]}%` }} transition={{ duration: 0.6 }}
                      style={{ height: '100%', background: dimensionColors[i], borderRadius: 2, boxShadow: `0 0 6px ${dimensionColors[i]}60` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance hint */}
          <div style={{ padding: 12, borderRadius: 12, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Shield size={11} style={{ color: '#f59e0b' }} />
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: '#f59e0b', letterSpacing: '0.1em' }}>合规提示</span>
            </div>
            <div style={{ fontSize: 10, color: '#d1d5db', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {skin === 'finance' ? '⚠️ 禁止承诺保本或预测收益\n⚠️ 须评估客户风险承受能力\n⚠️ 异议处理须留存记录' : '⚠️ 紧急情况须立即触发预案\n⚠️ 禁止独自操作带电设备\n⚠️ 信息发布须走官方渠道'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Results Screen ────────────────────────────────────────
function ResultsScreen({ scores, redLineCount, scenario, config, skin, trainingId, onRestart, onBack }: {
  scores: number[]; redLineCount: number; scenario: ScenarioData; config: SkinConfig; skin: Skin;
  trainingId: string; onRestart: () => void; onBack: () => void;
}) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const baseStars = avg >= 85 ? 3 : avg >= 72 ? 2 : avg >= 55 ? 1 : 0;
  const finalStars = Math.max(0, baseStars - redLineCount);
  const [showStars, setShowStars] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => { let i = 0; const iv = setInterval(() => { i++; setShowStars(i); if (i >= finalStars) clearInterval(iv); }, 400); }, 600);
    return () => clearTimeout(t);
  }, [finalStars]);

  const radarData = dimensionLabels.map((label, i) => ({ subject: label, value: scores[i], fullMark: 100 }));
  const xpEarned = Math.round(avg * finalStars * 0.8 + (redLineCount === 0 ? 50 : 0));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center gap-0"
      style={{ fontFamily: "'Rajdhani', sans-serif", overflow: 'auto' }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(${config.accentRgb},0.08), transparent)`, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 860, padding: '24px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: config.textSecondary, letterSpacing: '0.2em', marginBottom: 8 }}>MISSION COMPLETE</div>
          <div style={{ color: config.textPrimary, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>{scenario.scriptTitle}</div>
          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
            {[1, 2, 3].map(s => (
              <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: showStars >= s ? 1 : 0.3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: s * 0.1 }}>
                <Star size={42} style={{ color: showStars >= s ? '#fbbf24' : '#374151', fill: showStars >= s ? '#fbbf24' : 'none', filter: showStars >= s ? '0 0 16px #fbbf2480' : 'none' }} />
              </motion.div>
            ))}
          </div>
          {redLineCount > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, padding: '4px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 11 }}>
              <AlertTriangle size={12} />触发合规红线 {redLineCount} 次，综合评分已扣减
            </div>
          )}
        </div>

        {/* Content grid */}
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Radar */}
          <div style={{ width: 220, background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.1em', marginBottom: 8 }}>五维战绩</div>
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <PolarGrid stroke={`rgba(${config.accentRgb},0.2)`} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: config.textSecondary, fontFamily: "'Rajdhani',sans-serif" }} />
                <Radar dataKey="value" stroke={config.accent} fill={config.accent} fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {dimensionLabels.map((label, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: dimensionColors[i] }} />
                  <span style={{ fontSize: 10, color: config.textSecondary }}>{label}</span>
                  <span style={{ fontSize: 10, fontFamily: "'Orbitron', sans-serif", color: dimensionColors[i] }}>{scores[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scores list */}
          <div style={{ flex: 1, background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 16, padding: 16 }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.1em', marginBottom: 12 }}>评分详情</div>
            {dimensionLabels.map((label, i) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: config.textPrimary }}>{label}</span>
                  <span style={{ fontSize: 11, fontFamily: "'Orbitron', sans-serif", color: dimensionColors[i], fontWeight: 700 }}>{scores[i]} / 100</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${scores[i]}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${dimensionColors[i]}aa, ${dimensionColors[i]})`, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* XP & rewards */}
          <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 16, padding: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, marginBottom: 8 }}>本次获得</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                <Zap size={20} style={{ color: config.accent }} />
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 900, color: config.accent }}>{xpEarned}</span>
              </div>
              <div style={{ color: config.textSecondary, fontSize: 10 }}>XP 经验值</div>
            </div>
            <div style={{ background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 16, padding: 14 }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, marginBottom: 8 }}>综合评级</div>
              <div style={{ fontSize: finalStars >= 3 ? 26 : 20, textAlign: 'center', marginBottom: 4 }}>
                {finalStars === 3 ? '🥇 完美通关' : finalStars === 2 ? '🥈 良好表现' : finalStars === 1 ? '🥉 初次通关' : '💪 继续努力'}
              </div>
              <div style={{ fontSize: 10, color: config.textSecondary, textAlign: 'center', lineHeight: 1.5 }}>
                {finalStars >= 3 ? '所有目标达成，合规零违规' : finalStars >= 2 ? '大部分目标完成，有提升空间' : finalStars >= 1 ? '基本完成训练，建议复训' : '需要强化练习，建议重新挑战'}
              </div>
            </div>
            {redLineCount === 0 && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BadgeCheck size={14} style={{ color: '#22c55e' }} />
                <span style={{ fontSize: 10, color: '#22c55e' }}>合规零违规 +50XP</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRestart}
            style={{ padding: '11px 24px', borderRadius: 10, background: `rgba(${config.accentRgb},0.1)`, border: `1px solid rgba(${config.accentRgb},0.3)`, color: config.accent, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} />再次挑战
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack}
            style={{ padding: '11px 24px', borderRadius: 10, background: `rgba(${config.accentRgb},0.1)`, border: `1px solid rgba(${config.accentRgb},0.3)`, color: config.accent, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapIcon size={13} />返回训练地图
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              const nextId = trainingId.startsWith('building-')
                ? `building-${Math.min(parseInt(trainingId.split('-')[1]) + 1, 6)}`
                : trainingId;
              navigate(`/training/${nextId}?skin=${skin}`);
            }}
            style={{ padding: '11px 28px', borderRadius: 10, background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`, border: 'none', color: '#000', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 0 20px rgba(${config.accentRgb},0.4)` }}>
            <ChevronRight size={13} />挑战下一关
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function TrainingSession() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const skin = (searchParams.get('skin') || 'finance') as Skin;
  const config = skinConfigs[skin];
  const scenario = getScenario(trainingId || 'building-1', skin);

  const [step, setStep] = useState<'select' | 'train' | 'results'>('select');
  const [costume, setCostume] = useState(0);
  const [finalScores, setFinalScores] = useState([70, 65, 78, 74, 70]);
  const [redLineCount, setRedLineCount] = useState(0);

  const handleStart = (c: number) => { setCostume(c); setStep('train'); };
  const handleComplete = (scores: number[], rl: number) => { setFinalScores(scores); setRedLineCount(rl); setStep('results'); };
  const handleBack = () => navigate(`/?skin=${skin}`);
  const handleRestart = () => { setStep('select'); setFinalScores([70, 65, 78, 74, 70]); setRedLineCount(0); };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(${config.accentRgb},0.3); border-radius: 2px; }
      `}</style>
      <div style={{ width: '100vw', height: '100vh', background: config.bg, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${config.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${config.accentRgb},0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <CharacterSelectScreen key="select" scenario={scenario} config={config} onStart={handleStart} />
            )}
            {step === 'train' && (
              <TrainingScreen key="train" scenario={scenario} config={config} skin={skin} costume={costume} onComplete={handleComplete} onBack={handleBack} />
            )}
            {step === 'results' && (
              <ResultsScreen key="results" scores={finalScores} redLineCount={redLineCount} scenario={scenario} config={config} skin={skin} trainingId={trainingId || 'building-1'} onRestart={handleRestart} onBack={handleBack} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
