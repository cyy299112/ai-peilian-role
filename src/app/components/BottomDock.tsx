import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Users, Swords, Play, ChevronRight, Zap, Clock, BarChart2, RefreshCw } from 'lucide-react';
import type { TaskCard, SkinConfig, Skin } from '../types/game';

interface BottomDockProps {
  taskCards: TaskCard[];
  config: SkinConfig;
  skin: Skin;
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

export default function BottomDock({ taskCards, config, skin }: BottomDockProps) {
  const [teamCount] = useState(7);

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
            <button style={{
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
            {taskCards.map((card, i) => (
              <TaskCardComponent key={card.id} card={card} config={config} skin={skin} index={i} />
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
                style={{
                  background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                  border: 'none',
                  borderRadius: 8,
                  padding: '5px 10px',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  fontFamily: "'Rajdhani', sans-serif",
                  boxShadow: `0 0 12px rgba(${config.accentRgb},0.35)`,
                }}
              >
                <Swords size={10} />
                发起组队
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
    </>
  );
}