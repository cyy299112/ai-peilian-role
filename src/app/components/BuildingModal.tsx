import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { X, Star, Lock, Play, Target, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import type { Building, SkinConfig, Skin } from '../types/game';

interface BuildingModalProps {
  building: Building | null;
  config: SkinConfig;
  skin: Skin;
  onClose: () => void;
}

const emotionColors: Record<string, string> = {
  angry: '#ef4444',
  anxious: '#f59e0b',
  neutral: '#22c55e',
};

const riskColors: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const radarLabels = ['收益', '风险', '合规', '体验', '效率'];

export default function BuildingModal({ building, config, skin, onClose }: BuildingModalProps) {
  if (!building) return null;
  const navigate = useNavigate();

  const radarData = radarLabels.map((label, i) => ({
    subject: label,
    value: building.radar[i],
    fullMark: 100,
  }));

  const isLocked = building.status === 'locked';
  const isCompleted = building.status === 'completed';

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[480px] max-w-[90vw] rounded-2xl overflow-hidden"
        style={{
          background: config.panelBg,
          border: `1px solid ${config.panelBorder}`,
          boxShadow: `0 0 40px rgba(${config.accentRgb},0.15), 0 25px 50px rgba(0,0,0,0.5)`,
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        {/* Header */}
        <div className="relative p-5 pb-4"
          style={{ background: `linear-gradient(135deg, rgba(${config.accentRgb},0.12), rgba(${config.accentRgb},0.04))`, borderBottom: `1px solid ${config.panelBorder}` }}>
          
          {/* Level badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{
                  background: `rgba(${config.accentRgb},0.12)`,
                  border: `1px solid ${config.panelBorder}`,
                  boxShadow: isLocked ? 'none' : `0 0 16px rgba(${config.accentRgb},0.3)`,
                  filter: isLocked ? 'grayscale(0.8)' : 'none',
                }}>
                {isLocked ? '🔒' : building.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl" style={{ fontWeight: 700, color: isLocked ? '#6b7280' : config.textPrimary }}>
                    {building.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: `rgba(${config.accentRgb},0.15)`,
                    border: `1px solid ${config.panelBorder}`,
                    color: config.accent,
                    fontFamily: "'Orbitron', sans-serif",
                  }}>
                    Lv.{building.level}
                  </span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: config.textSecondary }}>
                  {building.subtitle}
                </div>
                {/* Stars */}
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3].map(s => (
                    <Star key={s} size={12} style={{
                      color: s <= building.stars ? '#fbbf24' : '#374151',
                      fill: s <= building.stars ? '#fbbf24' : 'none',
                    }} />
                  ))}
                  {isCompleted && <span className="text-xs ml-1" style={{ color: '#22c55e' }}>已通关</span>}
                  {building.status === 'inprogress' && (
                    <span className="text-xs ml-1 flex items-center gap-1" style={{ color: config.accent }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: config.accent }} />
                      训练中
                    </span>
                  )}
                  {isLocked && <span className="text-xs ml-1" style={{ color: '#6b7280' }}>🔒 未解锁</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{ color: config.textSecondary }}>
              <X size={16} />
            </button>
          </div>

          {/* Script title */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: `rgba(${config.accentRgb},0.08)`, border: `1px solid ${config.panelBorder}` }}>
            <div className="text-xs mb-1" style={{ color: config.textSecondary }}>剧本任务</div>
            <div className="text-sm" style={{ fontWeight: 700, color: config.textPrimary }}>{building.script}</div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Tags Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs" style={{ color: config.textSecondary }}>特征：</span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${emotionColors[building.tags.emotionType]}20`,
                border: `1px solid ${emotionColors[building.tags.emotionType]}50`,
                color: emotionColors[building.tags.emotionType],
              }}>
              😤 {building.tags.emotion}情绪
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${riskColors[building.tags.riskLevel]}20`,
                border: `1px solid ${riskColors[building.tags.riskLevel]}50`,
                color: riskColors[building.tags.riskLevel],
              }}>
              <AlertTriangle size={10} className="inline mr-0.5" />
              红线强度·{building.tags.riskLevel === 'high' ? '高' : building.tags.riskLevel === 'medium' ? '中' : '低'}
            </span>
          </div>

          {/* Two columns: Goals + Radar */}
          <div className="flex gap-4">
            {/* Goals */}
            <div className="flex-1">
              <div className="text-xs mb-2 flex items-center gap-1" style={{ color: config.textSecondary }}>
                <Target size={11} />
                预期目标
              </div>
              <div className="space-y-1.5">
                {building.goals.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: config.accent }} />
                    <span style={{ color: config.textPrimary }}>{g}</span>
                  </div>
                ))}
              </div>

              {/* Unlock req */}
              {building.unlockReq && (
                <div className="mt-3 p-2 rounded-lg text-xs flex items-center gap-2" style={{
                  background: 'rgba(107,114,128,0.1)',
                  border: '1px solid rgba(107,114,128,0.2)',
                  color: '#9ca3af',
                }}>
                  <Lock size={11} />
                  {building.unlockReq}
                </div>
              )}
            </div>

            {/* Radar Chart */}
            <div className="w-44 shrink-0">
              <div className="text-xs mb-1 flex items-center gap-1" style={{ color: config.textSecondary }}>
                <TrendingUp size={11} />
                五维训练侧重
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <RadarChart data={radarData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <PolarGrid stroke={`rgba(${config.accentRgb},0.2)`} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 9, fill: config.textSecondary, fontFamily: "'Rajdhani', sans-serif" }}
                  />
                  <Radar
                    dataKey="value"
                    stroke={config.accent}
                    fill={config.accent}
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action button */}
          {isLocked ? (
            <button className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              style={{
                background: 'rgba(107,114,128,0.1)',
                border: '1px solid rgba(107,114,128,0.2)',
                color: '#6b7280',
                fontWeight: 700,
              }}>
              <Lock size={14} />
              {building.unlockReq || '暂未解锁'}
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onClose(); navigate(`/training/building-${building.id}?skin=${skin}`); }}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                boxShadow: `0 0 20px rgba(${config.accentRgb},0.4)`,
                color: '#000',
                fontWeight: 800,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.05em',
                cursor: 'pointer',
              }}>
              <Play size={14} fill="black" />
              {isCompleted ? '重新挑战 · 提升星级' : '进入陪练训练'}
              <Zap size={14} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}