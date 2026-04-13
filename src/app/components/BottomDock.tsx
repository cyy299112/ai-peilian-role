import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Users, Swords, Play, ChevronRight, Zap, Clock, BarChart2, RefreshCw, X, CheckCircle2, User } from 'lucide-react';
import type { TaskCard, SkinConfig, Skin } from '../types/game';

interface BottomDockProps {
  taskCards: TaskCard[];
  config: SkinConfig;
  skin: Skin;
}

const allFinanceCards: TaskCard[] = [
  { id: 1, type: 'revenue', title: '收益优先卡', tag: '💰 收益最大化', subtitle: '高净值客户资产配置推荐话术', difficulty: 3, xp: 120, duration: '15分钟' },
  { id: 2, type: 'compliance', title: '合规防守卡', tag: '⚖️ 合规加固', subtitle: '反洗钱可疑交易特征识别演练', difficulty: 2, xp: 80, duration: '10分钟' },
  { id: 3, type: 'pressure', title: '高压抗压卡', tag: '🔥 极限挑战', subtitle: '极度愤怒客户投诉处理模拟', difficulty: 5, xp: 200, duration: '20分钟' },
  { id: 4, type: 'revenue', title: '产品推介卡', tag: '💰 营销突破', subtitle: '复杂结构化存款产品介绍演练', difficulty: 3, xp: 100, duration: '12分钟' },
  { id: 5, type: 'compliance', title: '风险揭示卡', tag: '⚖️ 合规底线', subtitle: '理财产品风险提示规范话术训练', difficulty: 2, xp: 70, duration: '10分钟' },
  { id: 6, type: 'pressure', title: '情绪急救卡', tag: '🔥 危机应对', subtitle: '客户当场翻脸的紧急处置演练', difficulty: 4, xp: 160, duration: '18分钟' },
];

const allEnergyCards: TaskCard[] = [
  { id: 1, type: 'revenue', title: '效率优先卡', tag: '⚡ 收益提升', subtitle: '电力交易竞价策略优化演练', difficulty: 3, xp: 120, duration: '15分钟' },
  { id: 2, type: 'compliance', title: '安全防守卡', tag: '🛡️ 安全合规', subtitle: '违章操作识别与安全制止演练', difficulty: 2, xp: 80, duration: '10分钟' },
  { id: 3, type: 'pressure', title: '应急抗压卡', tag: '🚨 极限应急', subtitle: '大面积停电应急调度指挥模拟', difficulty: 5, xp: 200, duration: '20分钟' },
  { id: 4, type: 'revenue', title: '调度优化卡', tag: '⚡ 效率提升', subtitle: '电网负荷平衡优化决策演练', difficulty: 3, xp: 110, duration: '14分钟' },
  { id: 5, type: 'compliance', title: '巡检规范卡', tag: '🛡️ 操作标准', subtitle: '变电站设备巡检SOP完整流程训练', difficulty: 2, xp: 75, duration: '10分钟' },
  { id: 6, type: 'pressure', title: '故障抢修卡', tag: '🚨 紧急处置', subtitle: '主变压器跳闸事故快速响应演练', difficulty: 4, xp: 150, duration: '16分钟' },
];

function pickRandomCards(pool: TaskCard[], count: number): TaskCard[] {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const cardStyleMap = {
  revenue: {
    gradient: 'linear-gradient(135deg, #1a2a0a 0%, #0d1f05 100%)',
    accent: '#84cc16',
    accentRgb: '132,204,22',
    icon: '💰',
    borderColor: 'rgba(132,204,22,0.3)',
    tagBg: 'rgba(132,204,22,0.15)',
  },
  compliance: {
    gradient: 'linear-gradient(135deg, #0a1a2a 0%, #051220 100%)',
    accent: '#38bdf8',
    accentRgb: '56,189,248',
    icon: '⚖️',
    borderColor: 'rgba(56,189,248,0.3)',
    tagBg: 'rgba(56,189,248,0.15)',
  },
  pressure: {
    gradient: 'linear-gradient(135deg, #2a0a0a 0%, #1f0505 100%)',
    accent: '#f97316',
    accentRgb: '249,115,22',
    icon: '🔥',
    borderColor: 'rgba(249,115,22,0.3)',
    tagBg: 'rgba(249,115,22,0.15)',
  },
};

function DifficultyDots({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: i <= level ? color : 'rgba(107,114,128,0.3)',
          boxShadow: i <= level ? `0 0 4px ${color}80` : 'none',
        }} />
      ))}
    </div>
  );
}

interface TaskCardProps {
  card: TaskCard;
  config: SkinConfig;
  skin: Skin;
  index: number;
}

function TaskCardComponent({ card, config, skin, index }: TaskCardProps) {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const style = cardStyleMap[card.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="relative flex-1"
      style={{ perspective: 600 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', height: '100%' }}
      >
        {/* Front */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: style.gradient,
            border: `1px solid ${style.borderColor}`,
            borderRadius: 16,
            padding: 14,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            cursor: 'pointer',
            boxShadow: `0 0 16px rgba(${style.accentRgb},0.15), inset 0 1px 0 rgba(255,255,255,0.05)`,
            fontFamily: "'Rajdhani', sans-serif",
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={() => setFlipped(!flipped)}
        >
          {/* Corner decoration */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 60,
            height: 60,
            background: `radial-gradient(circle at top right, rgba(${style.accentRgb},0.15), transparent)`,
            borderRadius: '0 16px 0 0',
          }} />

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 16 }}>{style.icon}</span>
                <span style={{ color: style.accent, fontWeight: 700, fontSize: 14 }}>{card.title}</span>
              </div>
              <span style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 6,
                background: style.tagBg,
                color: style.accent,
                border: `1px solid ${style.borderColor}`,
              }}>
                {card.tag}
              </span>
            </div>
            <div style={{
              background: `rgba(${style.accentRgb},0.15)`,
              border: `1px solid ${style.borderColor}`,
              borderRadius: 8,
              padding: '4px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 9, color: `${style.accent}90` }}>XP奖励</div>
              <div style={{ color: style.accent, fontWeight: 800, fontSize: 13, fontFamily: "'Orbitron', sans-serif" }}>
                +{card.xp}
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.4, flex: 1 }}>
            {card.subtitle}
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 3 }}>难度</div>
              <DifficultyDots level={card.difficulty} color={style.accent} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#6b7280' }}>
              <Clock size={10} />
              {card.duration}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: `linear-gradient(135deg, ${style.accent}dd, ${style.accent}bb)`,
                border: 'none',
                borderRadius: 8,
                padding: '5px 12px',
                color: '#000',
                fontWeight: 800,
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: "'Rajdhani', sans-serif",
                boxShadow: `0 0 10px rgba(${style.accentRgb},0.4)`,
              }}
              onClick={(e) => { e.stopPropagation(); navigate(`/training/card-${card.id}?skin=${skin}`); }}
            >
              <Play size={9} fill="black" />
              抽牌训练
            </motion.button>
          </div>
        </motion.div>

        {/* Back */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          rotateY: '180deg',
          transform: 'rotateY(180deg)',
          background: style.gradient,
          border: `1px solid ${style.borderColor}`,
          borderRadius: 16,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          fontFamily: "'Rajdhani', sans-serif",
        }}
          onClick={() => setFlipped(!flipped)}
        >
          <BarChart2 size={24} style={{ color: style.accent }} />
          <div style={{ color: style.accent, fontWeight: 700, fontSize: 13 }}>训练说明</div>
          <div style={{ color: '#9ca3af', fontSize: 10, textAlign: 'center', lineHeight: 1.6 }}>
            AI将根据您的历史表现智能<br />调整对话剧本难度与情绪强度，<br />帮助您突破训练瓶颈。
          </div>
          <div style={{ color: '#6b7280', fontSize: 10 }}>点击返回 →</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 模拟队友数据
const mockTeammates = [
  { id: 1, name: '张志强', level: '资深经理', avatar: '👨‍💼' },
  { id: 2, name: '李雪梅', level: '金牌顾问', avatar: '👩‍💼' },
  { id: 3, name: '王建国', level: '中级经理', avatar: '🧑‍💼' },
  { id: 4, name: '陈晓燕', level: '高级顾问', avatar: '👩‍💻' },
  { id: 5, name: '刘大伟', level: '资深经理', avatar: '👨‍💻' },
];

interface Teammate {
  id: number;
  name: string;
  level: string;
  avatar: string;
}

export default function BottomDock({ config, skin }: BottomDockProps) {
  const navigate = useNavigate();
  const cardPool = skin === 'finance' ? allFinanceCards : allEnergyCards;
  const [displayCards, setDisplayCards] = useState<TaskCard[]>(() => pickRandomCards(cardPool, 3));
  const [teamCount] = useState(7);
  const [isMatching, setIsMatching] = useState(false);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchedTeammates, setMatchedTeammates] = useState<Teammate[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);

  const handleRefreshCards = () => {
    setDisplayCards(pickRandomCards(cardPool, 3));
  };

  // 模拟匹配过程
  useEffect(() => {
    if (isMatching) {
      const interval = setInterval(() => {
        setMatchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // 随机选择2个队友
            const shuffled = [...mockTeammates].sort(() => 0.5 - Math.random());
            setMatchedTeammates(shuffled.slice(0, 2));
            setMatchComplete(true);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isMatching]);

  const handleStartTeam = () => {
    setIsMatching(true);
    setShowMatchModal(true);
    setMatchProgress(0);
    setMatchComplete(false);
    setMatchedTeammates([]);
  };

  const handleCloseModal = () => {
    setShowMatchModal(false);
    setIsMatching(false);
    setMatchProgress(0);
    setMatchComplete(false);
  };

  const handleStartBattle = () => {
    // 跳转到组队训练页面
    handleCloseModal();
    navigate(`/training/team-battle?skin=${skin}`);
  };

  return (
    <>
      <style>{`
        .dock-panel {
          background: ${config.panelBg};
          border-top: 1px solid ${config.panelBorder};
          backdrop-filter: blur(16px);
        }
      `}</style>
      <div className="dock-panel w-full shrink-0" style={{ height: 160, fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="h-full flex items-stretch gap-3 px-4 py-3">

          {/* Section label */}
          <div className="flex flex-col justify-between shrink-0 w-24">
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.15em', marginBottom: 4 }}>
                DAILY DECK
              </div>
              <div style={{ color: config.textPrimary, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                每日任务牌组
              </div>
              <div style={{ color: config.textSecondary, fontSize: 10, marginTop: 3 }}>
                AI 智能推荐 · 今日三练
              </div>
            </div>
            <button onClick={handleRefreshCards} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              color: config.accent,
              background: `rgba(${config.accentRgb},0.1)`,
              border: `1px solid rgba(${config.accentRgb},0.2)`,
              borderRadius: 6,
              padding: '4px 8px',
              cursor: 'pointer',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
            }}>
              <RefreshCw size={9} />
              换一批
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: config.panelBorder, alignSelf: 'stretch' }} />

          {/* Task cards */}
          <div className="flex gap-3 flex-1">
            {displayCards.map((card, i) => (
              <TaskCardComponent key={card.id + '-' + i} card={card} config={config} skin={skin} index={i} />
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: config.panelBorder, alignSelf: 'stretch' }} />

          {/* Team Battle */}
          <div className="flex flex-col justify-between shrink-0 w-36">
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: config.textSecondary, letterSpacing: '0.15em', marginBottom: 4 }}>
                SQUAD MODE
              </div>
              <div style={{ color: config.textPrimary, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                3人协作局
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'event-pulse 1.5s infinite' }} />
                <span style={{ color: '#22c55e', fontSize: 10 }}>在线匹配中</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                <Users size={11} style={{ color: config.textSecondary }} />
                <span style={{ color: config.textSecondary, fontSize: 10 }}>当前 </span>
                <span style={{ color: config.accent, fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700 }}>{teamCount}</span>
                <span style={{ color: config.textSecondary, fontSize: 10 }}> 支战队候战</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartTeam}
                disabled={isMatching}
                style={{
                  background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                  border: 'none',
                  borderRadius: 8,
                  padding: '5px 10px',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: 11,
                  cursor: isMatching ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontFamily: "'Rajdhani', sans-serif",
                  boxShadow: `0 0 12px rgba(${config.accentRgb},0.35)`,
                  opacity: isMatching ? 0.7 : 1,
                }}
              >
                <Swords size={10} />
                {isMatching ? '匹配中...' : '发起组队'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: `rgba(${config.accentRgb},0.1)`,
                  border: `1px solid rgba(${config.accentRgb},0.25)`,
                  borderRadius: 8,
                  padding: '5px 10px',
                  color: config.accent,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                <ChevronRight size={10} />
                加入战局
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* 匹配弹窗 */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: 420,
                background: config.panelBg,
                border: `1px solid ${config.panelBorder}`,
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: `0 0 40px rgba(${config.accentRgb},0.2)`,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${config.panelBorder}`,
                background: `linear-gradient(135deg, rgba(${config.accentRgb},0.15), rgba(${config.accentRgb},0.05))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: config.textPrimary }}>
                    {matchComplete ? '✅ 匹配成功！' : '🎮 正在匹配队友...'}
                  </div>
                  <div style={{ fontSize: 11, color: config.textSecondary, marginTop: 4 }}>
                    {matchComplete ? '已为您找到合适的队友' : '系统正在为您寻找合适的队友'}
                  </div>
                </div>
                {!isMatching && (
                  <button
                    onClick={handleCloseModal}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'transparent',
                      border: `1px solid ${config.panelBorder}`,
                      color: config.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 24 }}>
                {/* 进度条 */}
                {!matchComplete && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      height: 6,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          borderRadius: 3,
                          background: `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`,
                        }}
                        animate={{ width: `${matchProgress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 8,
                      fontSize: 11,
                      color: config.textSecondary,
                    }}>
                      <span>正在搜索...</span>
                      <span style={{ color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>{matchProgress}%</span>
                    </div>
                  </div>
                )}

                {/* 队友列表 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* 自己 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: `rgba(${config.accentRgb},0.1)`,
                    border: `1px solid ${config.panelBorder}`,
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${config.gradientFrom}40, ${config.gradientTo}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      border: `2px solid ${config.accent}`,
                    }}>
                      🧑‍💼
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: config.textPrimary }}>陈美琳 (我)</div>
                      <div style={{ fontSize: 10, color: config.accent }}>中级经理 · Lv.12</div>
                    </div>
                    <div style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: `rgba(${config.accentRgb},0.2)`,
                      color: config.accent,
                      fontSize: 10,
                      fontWeight: 700,
                    }}>
                      队长
                    </div>
                  </div>

                  {/* 匹配的队友 */}
                  {matchedTeammates.map((teammate, index) => (
                    <motion.div
                      key={teammate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: `rgba(${config.accentRgb},0.05)`,
                        border: `1px solid ${config.panelBorder}`,
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: `rgba(${config.accentRgb},0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        border: `1px solid ${config.panelBorder}`,
                      }}>
                        {teammate.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: config.textPrimary }}>{teammate.name}</div>
                        <div style={{ fontSize: 10, color: config.textSecondary }}>{teammate.level}</div>
                      </div>
                      <div style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <CheckCircle2 size={10} />
                        已就绪
                      </div>
                    </motion.div>
                  ))}

                  {/* 占位符 */}
                  {!matchComplete && [1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'rgba(107,114,128,0.05)',
                        border: `1px dashed ${config.panelBorder}`,
                        opacity: 0.5,
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(107,114,128,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <User size={20} style={{ color: config.textSecondary }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: config.textSecondary }}>等待加入...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: `1px solid ${config.panelBorder}`,
                display: 'flex',
                gap: 12,
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    borderRadius: 10,
                    background: 'transparent',
                    border: `1px solid ${config.panelBorder}`,
                    color: config.textSecondary,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: matchComplete ? 1.02 : 1 }}
                  whileTap={{ scale: matchComplete ? 0.98 : 1 }}
                  onClick={handleStartBattle}
                  disabled={!matchComplete}
                  style={{
                    flex: 2,
                    padding: '10px 20px',
                    borderRadius: 10,
                    background: matchComplete
                      ? `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`
                      : 'rgba(107,114,128,0.2)',
                    border: 'none',
                    color: matchComplete ? '#000' : config.textSecondary,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: matchComplete ? 'pointer' : 'not-allowed',
                    fontFamily: "'Rajdhani', sans-serif",
                    boxShadow: matchComplete ? `0 0 16px rgba(${config.accentRgb},0.4)` : 'none',
                  }}
                >
                  {matchComplete ? '开始组队训练 →' : '等待匹配完成...'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}