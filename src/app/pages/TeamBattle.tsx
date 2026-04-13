import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Users, Trophy, Target, Clock, Zap, MessageSquare,
  ChevronRight, CheckCircle2, AlertTriangle, Star, Send,
  Shield
} from 'lucide-react';
import type { Skin, SkinConfig } from '../types/game';
import { skinConfigs } from '../data/gameData';

interface ResponseOption {
  id: string;
  text: string;
  isRedLine: boolean;
  feedback: string;
}
interface TrainingAct {
  title: string;
  aiMessage: string;
  options: ResponseOption[];
}
interface TrainingScenario {
  scriptTitle: string;
  aiCharacter: { name: string; role: string; avatar: string; initialMood: number; backstory: string };
  acts: TrainingAct[];
}

const financeScenario: TrainingScenario = {
  scriptTitle: '《高净值客户资产配置咨询》',
  aiCharacter: { name: '林雅琴', role: '企业高管', avatar: '👩‍💼', initialMood: 65, backstory: '45岁上市公司CFO，资产过亿，对投资专业度要求极高' },
  acts: [
    {
      title: '开场接待',
      aiMessage: '你好，我是林雅琴。听说你们银行最近有一些不错的理财产品？我平时工作很忙，没太多时间研究这些，你帮我介绍一下吧。',
      options: [
        { id: 'a', text: '林总您好！非常感谢您百忙之中抽出时间。我们确实有几款适合您这样高净值客户的产品，我先了解一下您的投资偏好和风险承受能力，再为您做精准推荐。', isRedLine: false, feedback: '✅ 专业开场，先了解客户需求再推荐，体现顾问式服务' },
        { id: 'b', text: '林总您好！我们有一款年化收益5%的理财产品特别适合您，很多像您这样的客户都买了，要不要看看？', isRedLine: false, feedback: '⚠️ 过早推销产品，未了解客户需求，容易引起反感' },
        { id: 'c', text: '您好，我们的理财产品收益都很高，保证您满意，我直接帮您办理吧。', isRedLine: true, feedback: '❌ 承诺收益违规！不得使用"保证满意"等绝对化表述' },
      ],
    },
    {
      title: '需求深挖',
      aiMessage: '我的风险承受能力应该算中等吧，不过最近市场波动挺大的，我还是有点担心本金安全。',
      options: [
        { id: 'a', text: '您的顾虑非常合理。其实我们可以做一个组合配置：一部分资金放在稳健型产品保本保息，另一部分配置一些有增长潜力的产品。这样既能控制风险，又有机会获得更好的回报。您觉得这个思路怎么样？', isRedLine: false, feedback: '✅ 完美回应！承认客户顾虑+提供解决方案+征求确认' },
        { id: 'b', text: '不用担心，我们的产品都是低风险的，不会亏本的。', isRedLine: true, feedback: '❌ "不会亏本"属违规承诺，严格禁止' },
        { id: 'c', text: '那您可以买我们的存款类产品，虽然收益低但最安全。', isRedLine: false, feedback: '⚠️ 过于保守，没有发挥专业顾问的价值' },
      ],
    },
    {
      title: '方案呈现',
      aiMessage: '听起来不错，那你具体给我推荐一个方案吧，我要看到具体的数字。',
      options: [
        { id: 'a', text: '好的林总，根据您的需求，我建议这样一个配置：100万放入结构性存款（年化2.8%），300万配置稳健型理财（预期3.5%），200万配置均衡型基金组合（长期看平均8-10%）。整体组合预期年化约4.5%，最大回撤控制在5%以内。我给您做个详细说明书。', isRedLine: false, feedback: '✅ 专业！具体数字+分层配置+风控说明，体现专业能力' },
        { id: 'b', text: '我给您推荐一款产品，年化收益6%，很稳的。', isRedLine: true, feedback: '❌ 承诺具体收益率且未充分揭示风险' },
        { id: 'c', text: '方案我回去整理好再发给您。', isRedLine: false, feedback: '⚠️ 错失当场成交机会，客户体验不佳' },
      ],
    },
  ],
};

const energyScenario: TrainingScenario = {
  scriptTitle: '《电网调度应急指挥》',
  aiCharacter: { name: '调度中心', role: '区域调度员', avatar: '🚨', initialMood: 40, backstory: '区域配电网调度员，本次大面积停电需快速响应' },
  acts: [
    {
      title: '接报与确认',
      aiMessage: '紧急情况！A3主变压器突然跳闸，1.2万户停电！请立即报告处置方案！',
      options: [
        { id: 'a', text: '明确收到！立即执行：1.触发橙色应急预案；2.派驻现场勘查组；3.启动备用电源切换。请问跳闸准确时间和是否有明显外部原因？', isRedLine: false, feedback: '✅ 专业！快速响应，流程规范，信息确认到位' },
        { id: 'b', text: '我现在去看看是什么问题。', isRedLine: false, feedback: '⚠️ 行动迟缓，未触发应急预案，延误抢修时机' },
        { id: 'c', text: '这种情况不严重，等值班主任来了再处理。', isRedLine: true, feedback: '❌ 严重失职！大面积停电属紧急事件，不可推诿' },
      ],
    },
    {
      title: '资源协调',
      aiMessage: '现场报告：电缆故障，预计修复4小时。区域内有一家医院和两所学校！',
      options: [
        { id: 'a', text: '立即执行：1.医院优先，调移动发电车30分钟内到位；2.联系两所学校暂停相关设备；3.发布停电公告含预计恢复时间；4.两小时后提交进度报告。', isRedLine: false, feedback: '✅ 完美调度！优先级正确，措施全面，节点清晰' },
        { id: 'b', text: '医院有自备发电机，应该没问题。', isRedLine: false, feedback: '⚠️ 不可假设，须主动确认医院备电状态' },
        { id: 'c', text: '这超出我的权限，需要请示领导再安排。', isRedLine: true, feedback: '❌ 应急情况下以权限推诿，延误救援，严重失职' },
      ],
    },
    {
      title: '对外通报',
      aiMessage: '修复进展顺利，预计1小时后恢复供电，如何向公众通报？',
      options: [
        { id: 'a', text: '按规程发布《停电故障通报》：包含原因、受影响范围、预计恢复时间、应急措施及联系热线，同时向政府应急部门正式通报。', isRedLine: false, feedback: '✅ 规范的信息发布流程，透明公开，有效维护公信力' },
        { id: 'b', text: '在官微发一条简短说明就行了。', isRedLine: false, feedback: '⚠️ 信息不完整，未通报政府，可能违反报告规定' },
        { id: 'c', text: '现在不要公布，免得引起不必要的恐慌。', isRedLine: true, feedback: '❌ 刻意隐瞒停电信息，违反信息公开规定' },
      ],
    },
  ],
};

// 队友信息
interface Teammate {
  id: number;
  name: string;
  level: string;
  avatar: string;
  status: 'online' | 'training' | 'completed';
}

// 聊天消息
interface ChatMessage {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  isMe: boolean;
  timestamp: string;
}

// 团队任务
interface TeamTask {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
}

export default function TeamBattle() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skin = (searchParams.get('skin') || 'finance') as Skin;
  const config = skinConfigs[skin];

  const [step, setStep] = useState<'lobby' | 'training' | 'results'>('lobby');
  const [countdown, setCountdown] = useState(3);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: '系统', avatar: '🤖', text: '欢迎进入3人协作训练模式！', isMe: false, timestamp: '10:00' },
    { id: 2, sender: '张志强', avatar: '👨‍💼', text: '大家好，我是主攻异议处理的', isMe: false, timestamp: '10:01' },
    { id: 3, sender: '李雪梅', avatar: '👩‍💼', text: '我负责产品推荐部分', isMe: false, timestamp: '10:01' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentTask, setCurrentTask] = useState(0);

  const scenario = skin === 'finance' ? financeScenario : energyScenario;
  const [trainingActIndex, setTrainingActIndex] = useState(0);
  const [trainingPhase, setTrainingPhase] = useState<'choosing' | 'feedback'>('choosing');
  const [trainingMessages, setTrainingMessages] = useState<{ id: number; role: 'ai' | 'user'; text: string; isRedLine?: boolean }[]>([]);
  const [aiMood, setAiMood] = useState(scenario.aiCharacter.initialMood);
  const [lastOption, setLastOption] = useState<ResponseOption | null>(null);
  const [redLineCount, setRedLineCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const teammates: Teammate[] = [
    { id: 1, name: '陈美琳 (我)', level: '中级经理', avatar: '🧑‍💼', status: 'online' },
    { id: 2, name: '张志强', level: '资深经理', avatar: '👨‍💼', status: 'online' },
    { id: 3, name: '李雪梅', level: '金牌顾问', avatar: '👩‍💼', status: 'online' },
  ];

  const tasks: TeamTask[] = [
    { id: 1, title: '客户接待', description: '完成开场白和需求挖掘', progress: 0, total: 3 },
    { id: 2, title: '产品介绍', description: '准确介绍产品特点和优势', progress: 0, total: 3 },
    { id: 3, title: '异议处理', description: '妥善处理客户异议', progress: 0, total: 3 },
    { id: 4, title: '成交推进', description: '引导客户达成行动共识', progress: 0, total: 3 },
  ];

  // 倒计时进入训练
  useEffect(() => {
    if (step === 'lobby' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 'lobby' && countdown === 0) {
      setStep('training');
    }
  }, [step, countdown]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: chatMessages.length + 1,
      sender: '陈美琳',
      avatar: '🧑‍💼',
      text: inputMessage,
      isMe: true,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([...chatMessages, newMsg]);
    setInputMessage('');
  };

  const handleCompleteTask = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(c => c + 1);
      setTrainingActIndex(0);
      setTrainingPhase('choosing');
      setTrainingMessages([]);
      setLastOption(null);
    } else {
      setStep('results');
    }
  };

  useEffect(() => {
    if (step === 'training' && trainingMessages.length === 0) {
      setTrainingMessages([{ id: 0, role: 'ai', text: scenario.acts[0].aiMessage }]);
    }
  }, [step, currentTask]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [trainingMessages]);

  const handleSelectResponse = (opt: ResponseOption) => {
    if (opt.isRedLine) setRedLineCount(c => c + 1);
    setTrainingMessages(prev => [...prev, { id: prev.length, role: 'user', text: opt.text, isRedLine: opt.isRedLine }]);
    setLastOption(opt);
    setAiMood(scenario.acts[trainingActIndex].options.indexOf(opt) === 0 ? 85 : 55);
    setTrainingPhase('feedback');
  };

  const handleNextAct = () => {
    if (trainingActIndex < scenario.acts.length - 1) {
      const nextIdx = trainingActIndex + 1;
      setTrainingActIndex(nextIdx);
      setTrainingMessages(prev => [...prev, { id: prev.length, role: 'ai', text: scenario.acts[nextIdx].aiMessage }]);
      setTrainingPhase('choosing');
      setLastOption(null);
    }
  };

  // 大厅界面
  if (step === 'lobby') {
    return (
      <div style={{ width: '100vw', height: '100vh', background: config.bg, fontFamily: "'Rajdhani', sans-serif" }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(${config.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${config.accentRgb},0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: config.panelBg,
            borderBottom: `1px solid ${config.panelBorder}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => navigate(`/?skin=${skin}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: config.textSecondary,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                <ArrowLeft size={16} />
                返回
              </button>
              <div style={{ width: 1, height: 20, background: config.panelBorder }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} style={{ color: config.accent }} />
                <span style={{ color: config.textPrimary, fontWeight: 700, fontSize: 16 }}>3人协作训练</span>
              </div>
            </div>
            <div style={{
              padding: '8px 20px',
              borderRadius: 20,
              background: `rgba(${config.accentRgb},0.1)`,
              border: `1px solid ${config.panelBorder}`,
              color: config.accent,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Orbitron', sans-serif",
            }}>
              训练开始倒计时: {countdown}s
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', padding: 24, gap: 24 }}>
            {/* 左侧：队友信息 */}
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                background: config.panelBg,
                border: `1px solid ${config.panelBorder}`,
                borderRadius: 16,
                padding: 20,
              }}>
                <div style={{ fontSize: 12, color: config.textSecondary, marginBottom: 16, fontFamily: "'Orbitron', sans-serif" }}>
                  TEAM MEMBERS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {teammates.map((mate, index) => (
                    <motion.div
                      key={mate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px',
                        borderRadius: 12,
                        background: mate.name.includes('我')
                          ? `rgba(${config.accentRgb},0.15)`
                          : `rgba(${config.accentRgb},0.05)`,
                        border: mate.name.includes('我')
                          ? `1px solid ${config.accent}`
                          : `1px solid ${config.panelBorder}`,
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${config.gradientFrom}40, ${config.gradientTo}40)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}>
                        {mate.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: config.textPrimary }}>{mate.name}</div>
                        <div style={{ fontSize: 11, color: config.accent }}>{mate.level}</div>
                      </div>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 8px #22c55e',
                      }} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 训练任务 */}
              <div style={{
                flex: 1,
                background: config.panelBg,
                border: `1px solid ${config.panelBorder}`,
                borderRadius: 16,
                padding: 20,
              }}>
                <div style={{ fontSize: 12, color: config.textSecondary, marginBottom: 16, fontFamily: "'Orbitron', sans-serif" }}>
                  TRAINING TASKS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      style={{
                        padding: '12px',
                        borderRadius: 10,
                        background: `rgba(${config.accentRgb},0.05)`,
                        border: `1px solid ${config.panelBorder}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: `rgba(${config.accentRgb},0.2)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: config.accent,
                          fontFamily: "'Orbitron', sans-serif",
                        }}>
                          {task.id}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: config.textPrimary }}>{task.title}</span>
                      </div>
                      <div style={{ fontSize: 11, color: config.textSecondary, paddingLeft: 28 }}>
                        {task.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：团队聊天 */}
            <div style={{
              flex: 1,
              background: config.panelBg,
              border: `1px solid ${config.panelBorder}`,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${config.panelBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <MessageSquare size={16} style={{ color: config.accent }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: config.textPrimary }}>团队频道</span>
                <span style={{ fontSize: 11, color: config.textSecondary }}>({teammates.length}人在线)</span>
              </div>

              <div style={{
                flex: 1,
                overflow: 'auto',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: msg.isMe
                        ? `linear-gradient(135deg, ${config.gradientFrom}40, ${config.gradientTo}40)`
                        : 'rgba(107,114,128,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}>
                      {msg.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: msg.isMe ? config.accent : config.textPrimary,
                        }}>
                          {msg.sender}
                        </span>
                        <span style={{ fontSize: 10, color: config.textSecondary }}>{msg.timestamp}</span>
                      </div>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: msg.isMe
                          ? `rgba(${config.accentRgb},0.15)`
                          : 'rgba(107,114,128,0.1)',
                        border: msg.isMe
                          ? `1px solid rgba(${config.accentRgb},0.3)`
                          : '1px solid rgba(107,114,128,0.2)',
                        color: config.textPrimary,
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{
                padding: '12px 20px',
                borderTop: `1px solid ${config.panelBorder}`,
                display: 'flex',
                gap: 10,
              }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="输入消息..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: `rgba(${config.accentRgb},0.05)`,
                    border: `1px solid ${config.panelBorder}`,
                    color: config.textPrimary,
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                    border: 'none',
                    color: '#000',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 训练界面
  if (step === 'training') {
    return (
      <div style={{ width: '100vw', height: '100vh', background: config.bg, fontFamily: "'Rajdhani', sans-serif" }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(${config.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${config.accentRgb},0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            background: config.panelBg,
            borderBottom: `1px solid ${config.panelBorder}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                padding: '6px 12px',
                borderRadius: 8,
                background: `rgba(${config.accentRgb},0.1)`,
                border: `1px solid ${config.panelBorder}`,
                color: config.accent,
                fontSize: 12,
                fontWeight: 700,
              }}>
                任务 {currentTask + 1}/{tasks.length}
              </div>
              <span style={{ color: config.textPrimary, fontSize: 14 }}>{tasks[currentTask].title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={14} style={{ color: config.textSecondary }} />
              <span style={{ color: config.textSecondary, fontSize: 13, fontFamily: "'Orbitron', sans-serif" }}>05:32</span>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, display: 'flex', padding: 24, gap: 24 }}>
            {/* 左侧：队友状态 */}
            <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {teammates.map((mate, index) => (
                <div
                  key={mate.id}
                  style={{
                    padding: '12px',
                    borderRadius: 12,
                    background: `rgba(${config.accentRgb},0.05)`,
                    border: `1px solid ${config.panelBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${config.gradientFrom}40, ${config.gradientTo}40)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    {mate.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: config.textPrimary }}>{mate.name}</div>
                    <div style={{ fontSize: 10, color: '#22c55e' }}>● 进行中</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 中间：训练场景 */}
            <div style={{
              flex: 1,
              background: config.panelBg,
              border: `1px solid ${config.panelBorder}`,
              borderRadius: 16,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                padding: '16px 20px',
                background: `rgba(${config.accentRgb},0.08)`,
                borderRadius: 12,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 48, height: 48, borderRadius: '50%', background: skin === 'finance' ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))' : `rgba(${config.accentRgb},0.15)`, border: `2px solid ${skin === 'finance' ? 'rgba(239,68,68,0.4)' : config.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 0 14px rgba(239,68,68,0.2)' }}>
                  {scenario.aiCharacter.avatar}
                </motion.div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: skin === 'finance' ? '#fca5a5' : config.textPrimary, fontWeight: 700, fontSize: 14 }}>{scenario.aiCharacter.name}</span>
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 6, background: skin === 'finance' ? 'rgba(239,68,68,0.15)' : `rgba(${config.accentRgb},0.15)`, border: `1px solid ${skin === 'finance' ? 'rgba(239,68,68,0.3)' : config.panelBorder}`, color: skin === 'finance' ? '#ef4444' : config.accent }}>{scenario.aiCharacter.role}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: '#6b7280' }}>情绪状态：</span>
                    <div style={{ width: 70, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <motion.div animate={{ width: `${aiMood}%` }} transition={{ duration: 0.8 }} style={{ height: '100%', background: aiMood > 60 ? '#22c55e' : aiMood > 40 ? '#f59e0b' : '#ef4444', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 10, color: aiMood > 60 ? '#22c55e' : aiMood > 40 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{aiMood > 60 ? '满意' : aiMood > 40 ? '平静' : '紧张'} {aiMood}%</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary }}>ACT {trainingActIndex + 1}/{scenario.acts.length}</div>
                  <div style={{ color: config.accent, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{scenario.acts[trainingActIndex].title}</div>
                </div>
              </div>

              {/* 对话消息区 */}
              <div style={{ flex: 1, overflow: 'auto', padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {trainingMessages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: msg.role === 'ai' ? 'flex-start' : 'flex-end', alignItems: 'flex-start', gap: 8 }}>
                    {msg.role === 'ai' && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: skin === 'finance' ? 'rgba(239,68,68,0.2)' : `rgba(${config.accentRgb},0.2)`, border: `1px solid ${skin === 'finance' ? 'rgba(239,68,68,0.4)' : `rgba(${config.accentRgb},0.4)`}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{scenario.aiCharacter.avatar}</div>
                    )}
                    <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', background: msg.role === 'ai' ? (skin === 'finance' ? 'rgba(239,68,68,0.1)' : `rgba(${config.accentRgb},0.1)`) : msg.isRedLine ? 'rgba(239,68,68,0.2)' : `rgba(${config.accentRgb},0.15)`, border: `1px solid ${msg.role === 'ai' ? (skin === 'finance' ? 'rgba(239,68,68,0.25)' : `rgba(${config.accentRgb},0.3)`) : msg.isRedLine ? 'rgba(239,68,68,0.4)' : `rgba(${config.accentRgb},0.3)`}`, fontSize: 12, color: config.textPrimary, lineHeight: 1.6 }}>
                      {msg.isRedLine && <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, color: '#ef4444', fontSize: 10 }}><AlertTriangle size={10} />合规红线触发</div>}
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `rgba(${config.accentRgb},0.2)`, border: `1px solid rgba(${config.accentRgb},0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🧑‍💼</div>
                    )}
                  </motion.div>
                ))}
                <div ref={msgEndRef} />
              </div>

              {/* 回复选项 / 反馈 */}
              <div style={{ padding: '12px 8px', borderTop: `1px solid ${config.panelBorder}`, background: `rgba(${config.accentRgb},0.02)`, flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  {trainingPhase === 'choosing' ? (
                    <motion.div key="choosing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <MessageSquare size={12} style={{ color: config.textSecondary }} />
                        <span style={{ color: config.textSecondary, fontSize: 11 }}>选择您的回应方式：</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {scenario.acts[trainingActIndex].options.map((opt, i) => (
                          <motion.button key={opt.id} whileHover={{ x: 4, backgroundColor: `rgba(${config.accentRgb},0.12)` }}
                            onClick={() => handleSelectResponse(opt)}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNextAct}
                          disabled={trainingActIndex >= scenario.acts.length - 1}
                          style={{ padding: '9px 24px', borderRadius: 10, background: trainingActIndex >= scenario.acts.length - 1 ? 'rgba(107,114,128,0.15)' : `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`, border: 'none', color: trainingActIndex >= scenario.acts.length - 1 ? '#6b7280' : '#000', fontSize: 12, fontWeight: 700, cursor: trainingActIndex >= scenario.acts.length - 1 ? 'not-allowed' : 'pointer', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>
                          {trainingActIndex >= scenario.acts.length - 1 ? '本任务已完成' : <><span>下一幕</span><ChevronRight size={13} /></>}
                        </motion.button>
                        {trainingActIndex >= scenario.acts.length - 1 && (
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCompleteTask}
                            style={{ padding: '9px 24px', borderRadius: 10, background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`, border: 'none', color: '#000', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 0 16px rgba(${config.accentRgb},0.4)` }}>
                            <CheckCircle2 size={14} /> 完成本任务 →
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 结果界面
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: config.bg,
      fontFamily: "'Rajdhani', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(${config.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${config.accentRgb},0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 600,
          background: config.panelBg,
          border: `1px solid ${config.panelBorder}`,
          borderRadius: 20,
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: config.textPrimary, marginBottom: 8 }}>
          协作训练完成！
        </div>
        <div style={{ fontSize: 14, color: config.textSecondary, marginBottom: 32 }}>
          恭喜你们团队成功完成了所有训练任务
        </div>

        {/* 团队得分 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginBottom: 32,
        }}>
          <div>
            <div style={{ fontSize: 12, color: config.textSecondary, marginBottom: 4 }}>团队总分</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
              2,850
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: config.textSecondary, marginBottom: 4 }}>获得经验</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
              +420
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: config.textSecondary, marginBottom: 4 }}>协作评级</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
              S
            </div>
          </div>
        </div>

        {/* 队友贡献 */}
        <div style={{
          background: `rgba(${config.accentRgb},0.05)`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 12, color: config.textSecondary, marginBottom: 16 }}>队友贡献</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {teammates.map((mate, index) => (
              <div key={mate.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{mate.avatar}</span>
                <span style={{ flex: 1, textAlign: 'left', fontSize: 13, color: config.textPrimary }}>{mate.name}</span>
                <div style={{
                  width: 120,
                  height: 8,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${85 - index * 10}%`,
                    height: '100%',
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`,
                  }} />
                </div>
                <span style={{ fontSize: 12, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
                  {850 - index * 100}分
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/?skin=${skin}`)}
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              background: 'transparent',
              border: `1px solid ${config.panelBorder}`,
              color: config.textSecondary,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            返回首页
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('lobby')}
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
              border: 'none',
              color: '#000',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 0 20px rgba(${config.accentRgb},0.4)`,
            }}
          >
            再次挑战
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
