import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, User, BookOpen, Clock, TrendingUp, Target,
  Award, Zap, Star, Calendar, Trophy, AlertTriangle, CheckCircle2,
  ChevronRight, Flame, Brain, X
} from 'lucide-react';
import type { Skin } from '../types/game';
import { skinConfigs } from '../data/gameData';

// 个人数据
const personalData = {
  name: '陈美琳',
  level: 28,
  title: '资深理财经理',
  department: '零售银行部',
  joinDate: '2023-06-15',
  xp: 8320,
  nextLevelXp: 9000,
  avatar: '陈',
  streak: 12,
};

// 统计数据
const statsData = {
  completedTrainings: 47,
  totalHours: 38.5,
  averageScore: 82,
  redLines: 3,
  perfectScores: 15,
  teamBattles: 8,
};

// 五维能力数据（用于雷达图）
const radarData = [
  { subject: '客户接待', value: 88, fullMark: 100 },
  { subject: '产品讲解', value: 85, fullMark: 100 },
  { subject: '异议处理', value: 75, fullMark: 100 },
  { subject: '情绪对抗', value: 68, fullMark: 100 },
  { subject: '合规意识', value: 91, fullMark: 100 },
];

// 计算总分
const totalScore = Math.round(radarData.reduce((sum, item) => sum + item.value, 0) / radarData.length);

// 能力详情
const abilityDetails = [
  { name: '客户接待', score: 88, trend: 'up', trendValue: 5 },
  { name: '产品讲解', score: 85, trend: 'up', trendValue: 3 },
  { name: '异议处理', score: 75, trend: 'up', trendValue: 8 },
  { name: '情绪对抗', score: 68, trend: 'down', trendValue: 2 },
  { name: '合规意识', score: 91, trend: 'same', trendValue: 0 },
];

// 初始错题本数据
const initialWrongAnswers = [
  {
    id: 1,
    scenario: '高净值客户异议处理',
    question: '客户质疑产品亏损该如何回应？',
    myAnswer: '承诺会帮助客户挽回损失',
    correctAnswer: '表示理解，承诺合规调查处理',
    reason: '擅自承诺赔偿属严重越权违规',
    date: '2026-04-05',
    type: '合规红线',
  },
  {
    id: 2,
    scenario: '反洗钱识别',
    question: '发现可疑交易特征应如何处理？',
    myAnswer: '直接告知客户需要调查',
    correctAnswer: '立即上报合规部门，不透露信息',
    reason: '不得向客户透露监测信息',
    date: '2026-04-03',
    type: '违规操作',
  },
  {
    id: 3,
    scenario: '产品推荐',
    question: '如何向客户介绍产品收益？',
    myAnswer: '强调预期收益可达8%',
    correctAnswer: '说明历史收益，仅供参考',
    reason: '承诺预期收益属于误导性销售',
    date: '2026-04-01',
    type: '销售误导',
  },
];

// 训练记录
const trainingHistory = [
  { date: '2026-04-08', scenario: '高净值客户异议处理', score: 85, stars: 3, time: '15分钟', trainingId: 'building-3' },
  { date: '2026-04-07', scenario: '反洗钱可疑交易识别', score: 72, stars: 2, time: '12分钟', trainingId: 'building-2' },
  { date: '2026-04-06', scenario: '标准开户服务流程', score: 90, stars: 3, time: '10分钟', trainingId: 'building-1' },
  { date: '2026-04-05', scenario: '产品推荐话术训练', score: 65, stars: 1, time: '14分钟', trainingId: 'building-4' },
  { date: '2026-04-03', scenario: '客户接待SOP', score: 88, stars: 3, time: '11分钟', trainingId: 'building-1' },
  { date: '2026-04-02', scenario: '3人协作训练', score: 92, stars: 3, time: '25分钟', trainingId: 'team-battle' },
];

// 勋章数据
const badges = [
  { id: 1, name: '初出茅庐', icon: '🌱', desc: '完成首次训练', earned: true },
  { id: 2, name: '完美通关', icon: '💎', desc: '获得3星评价10次', earned: true },
  { id: 3, name: '合规达人', icon: '🛡️', desc: '连续10次无红线', earned: true },
  { id: 4, name: '团队协作者', icon: '🤝', desc: '参与5次团队训练', earned: true },
  { id: 5, name: '坚持不懈', icon: '🔥', desc: '连续训练7天', earned: true },
  { id: 6, name: '异议处理专家', icon: '🎯', desc: '异议处理评分90+', earned: false },
  { id: 7, name: '金牌讲师', icon: '🏆', desc: '帮助3位新人完成训练', earned: false },
  { id: 8, name: '百炼成钢', icon: '⚔️', desc: '完成100次训练', earned: false },
];

// 简化的雷达图组件
function SimpleRadarChart({ data, config }: { data: typeof radarData; config: any }) {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const angleStep = (Math.PI * 2) / data.length;

  // 计算多边形点
  const points = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (item.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // 计算标签位置
  const labels = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = radius + 25;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      text: item.subject,
      value: item.value,
    };
  });

  return (
    <svg width={size} height={size} style={{ margin: '0 auto' }}>
      {/* 背景网格 */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
        <polygon
          key={i}
          points={data.map((_, j) => {
            const angle = j * angleStep - Math.PI / 2;
            const r = radius * scale;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ')}
          fill="none"
          stroke={`rgba(${config.accentRgb},0.1)`}
          strokeWidth={1}
        />
      ))}
      {/* 轴线 */}
      {data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke={`rgba(${config.accentRgb},0.2)`}
            strokeWidth={1}
          />
        );
      })}
      {/* 数据区域 */}
      <polygon
        points={polygonPoints}
        fill={`rgba(${config.accentRgb},0.25)`}
        stroke={config.accent}
        strokeWidth={2}
      />
      {/* 数据点 */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={config.accent} />
      ))}
      {/* 标签 */}
      {labels.map((label, i) => (
        <text
          key={i}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill={config.textSecondary}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}

// 错题详情弹窗组件
function WrongAnswerModal({
  item,
  config,
  onClose,
  onMastered,
}: {
  item: typeof initialWrongAnswers[0];
  config: any;
  onClose: () => void;
  onMastered: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const options = [
    { id: 'wrong', text: item.myAnswer, isCorrect: false },
    { id: 'correct', text: item.correctAnswer, isCorrect: true },
  ];

  const handleSubmit = () => {
    if (selectedOption) {
      setShowResult(true);
    }
  };

  const handleMastered = () => {
    onMastered();
    onClose();
  };

  return (
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
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '85vh',
          background: config.panelBg,
          border: `1px solid ${config.panelBorder}`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: `0 0 60px rgba(${config.accentRgb},0.2)`,
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
            <div style={{ fontSize: 11, color: config.accent }}>{item.scenario}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: config.textPrimary, marginTop: 4 }}>
              错题重做
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
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
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 24, overflow: 'auto', maxHeight: 'calc(85vh - 160px)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: config.textPrimary, marginBottom: 20 }}>
            {item.question}
          </div>

          {!showResult ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: selectedOption === option.id
                        ? `rgba(${config.accentRgb},0.15)`
                        : `rgba(${config.accentRgb},0.05)`,
                      border: selectedOption === option.id
                        ? `2px solid ${config.accent}`
                        : `1px solid ${config.panelBorder}`,
                      textAlign: 'left',
                      fontSize: 14,
                      color: config.textPrimary,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {option.text}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  borderRadius: 10,
                  background: selectedOption
                    ? `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`
                    : 'rgba(107,114,128,0.2)',
                  border: 'none',
                  color: selectedOption ? '#000' : config.textSecondary,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: selectedOption ? 'pointer' : 'not-allowed',
                }}
              >
                提交答案
              </button>
            </>
          ) : (
            <>
              <div style={{
                padding: 20,
                borderRadius: 12,
                background: selectedOption === 'correct'
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(239,68,68,0.1)',
                border: `1px solid ${selectedOption === 'correct' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                marginBottom: 20,
              }}>
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: selectedOption === 'correct' ? '#22c55e' : '#ef4444',
                  marginBottom: 8,
                }}>
                  {selectedOption === 'correct' ? '🎉 回答正确！' : '❌ 回答错误'}
                </div>
                <div style={{ fontSize: 13, color: config.textPrimary }}>
                  {item.reason}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 10,
                    background: 'transparent',
                    border: `1px solid ${config.panelBorder}`,
                    color: config.textSecondary,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  关闭
                </button>
                <button
                  onClick={handleMastered}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                    border: 'none',
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  标记已掌握
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skin = (searchParams.get('skin') || 'finance') as Skin;
  const config = skinConfigs[skin];
  const [activeTab, setActiveTab] = useState<'overview' | 'wrongbook' | 'history' | 'achievements'>('overview');
  const [wrongAnswers, setWrongAnswers] = useState(initialWrongAnswers);
  const [selectedWrongItem, setSelectedWrongItem] = useState<typeof initialWrongAnswers[0] | null>(null);

  const xpPercent = (personalData.xp / personalData.nextLevelXp) * 100;

  // 标记错题已掌握
  const handleMastered = (id: number) => {
    setWrongAnswers(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: config.bg, fontFamily: "'Rajdhani', sans-serif", overflow: 'auto' }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(${config.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${config.accentRgb},0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: config.panelBg,
          borderBottom: `1px solid ${config.panelBorder}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate(`/?skin=${skin}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: config.textSecondary,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                padding: '8px 12px',
                borderRadius: 8,
              }}
            >
              <ArrowLeft size={18} />
              返回地图
            </button>
            <div style={{ width: 1, height: 24, background: config.panelBorder }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={20} style={{ color: config.accent }} />
              <span style={{ color: config.textPrimary, fontWeight: 700, fontSize: 18 }}>个人中心</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
          {/* 个人信息卡片 - 改为上下布局 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              marginBottom: 32,
            }}
          >
            {/* 第一行：头像和基本信息 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: 24,
              borderRadius: 20,
              background: config.panelBg,
              border: `1px solid ${config.panelBorder}`,
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${config.gradientFrom}40, ${config.gradientTo}40)`,
                border: `3px solid ${config.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                color: config.accent,
                fontFamily: "'Orbitron', sans-serif",
                flexShrink: 0,
              }}>
                {personalData.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: config.textPrimary, marginBottom: 4 }}>
                  {personalData.name}
                </div>
                <div style={{ fontSize: 14, color: config.accent, marginBottom: 4 }}>
                  {personalData.title}
                </div>
                <div style={{ fontSize: 12, color: config.textSecondary }}>
                  {personalData.department} · 入职 {personalData.joinDate}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
              }}>
                <Flame size={16} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>
                  连续训练 {personalData.streak} 天
                </span>
              </div>
            </div>

            {/* 第二行：等级进度和统计数据 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: 24,
            }}>
              {/* 等级进度 */}
              <div style={{
                padding: 24,
                borderRadius: 20,
                background: config.panelBg,
                border: `1px solid ${config.panelBorder}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: config.textPrimary, fontWeight: 600 }}>等级 {personalData.level}</span>
                  <span style={{ fontSize: 14, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
                    {personalData.xp}/{personalData.nextLevelXp} XP
                  </span>
                </div>
                <div style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{
                      height: '100%',
                      borderRadius: 6,
                      background: `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`,
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: config.textSecondary, marginTop: 8 }}>
                  还需 {personalData.nextLevelXp - personalData.xp} XP 升级
                </div>
              </div>

              {/* 统计数据 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
              }}>
                {[
                  { label: '完成训练', value: statsData.completedTrainings, unit: '次', icon: <CheckCircle2 size={18} />, color: config.accent },
                  { label: '累计时长', value: statsData.totalHours, unit: '小时', icon: <Clock size={18} />, color: '#22c55e' },
                  { label: '平均评分', value: statsData.averageScore, unit: '分', icon: <Star size={18} />, color: '#fbbf24' },
                  { label: '触发红线', value: statsData.redLines, unit: '次', icon: <AlertTriangle size={18} />, color: '#ef4444' },
                  { label: '满分通关', value: statsData.perfectScores, unit: '次', icon: <Trophy size={18} />, color: '#a78bfa' },
                  { label: '团队作战', value: statsData.teamBattles, unit: '次', icon: <User size={18} />, color: '#38bdf8' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: 18,
                      borderRadius: 16,
                      background: config.panelBg,
                      border: `1px solid ${config.panelBorder}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                      <span style={{ fontSize: 11, color: config.textSecondary }}>{stat.label}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, fontFamily: "'Orbitron', sans-serif" }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 10, color: config.textSecondary }}>{stat.unit}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tab 导航 */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            padding: '4px',
            borderRadius: 12,
            background: config.panelBg,
            border: `1px solid ${config.panelBorder}`,
            width: 'fit-content',
          }}>
            {[
              { id: 'overview' as const, label: '个人画像', icon: <User size={16} /> },
              { id: 'wrongbook' as const, label: `错题集 (${wrongAnswers.length})`, icon: <BookOpen size={16} /> },
              { id: 'history' as const, label: '训练记录', icon: <Clock size={16} /> },
              { id: 'achievements' as const, label: '成就勋章', icon: <Award size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: activeTab === tab.id ? `rgba(${config.accentRgb},0.15)` : 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? config.accent : config.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 内容 */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 个人画像 - 带雷达图和总分 */}
            {activeTab === 'overview' && (
              <div style={{
                padding: 28,
                borderRadius: 20,
                background: config.panelBg,
                border: `1px solid ${config.panelBorder}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <Brain size={20} style={{ color: config.accent }} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: config.textPrimary }}>能力详情分析</span>
                </div>

                {/* 雷达图和总分区域 */}
                <div style={{
                  display: 'flex',
                  gap: 40,
                  marginBottom: 32,
                  padding: 24,
                  borderRadius: 16,
                  background: `rgba(${config.accentRgb},0.05)`,
                }}>
                  {/* 雷达图 */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <SimpleRadarChart data={radarData} config={config} />
                  </div>

                  {/* 总分 */}
                  <div style={{
                    width: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: `1px solid ${config.panelBorder}`,
                    paddingLeft: 40,
                  }}>
                    <div style={{ fontSize: 14, color: config.textSecondary, marginBottom: 8 }}>综合能力评分</div>
                    <div style={{
                      fontSize: 64,
                      fontWeight: 900,
                      color: config.accent,
                      fontFamily: "'Orbitron', sans-serif",
                      textShadow: `0 0 30px rgba(${config.accentRgb},0.5)`,
                    }}>
                      {totalScore}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: totalScore >= 80 ? '#22c55e' : totalScore >= 60 ? '#f59e0b' : '#ef4444',
                      marginTop: 8,
                    }}>
                      {totalScore >= 80 ? '优秀' : totalScore >= 60 ? '良好' : '待提升'}
                    </div>
                  </div>
                </div>

                {/* 能力详情列表 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {abilityDetails.map((ability, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, color: config.textPrimary }}>{ability.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: ability.score >= 80 ? '#22c55e' : ability.score >= 60 ? '#f59e0b' : '#ef4444',
                            fontFamily: "'Orbitron', sans-serif",
                          }}>
                            {ability.score}分
                          </span>
                          {ability.trend === 'up' && (
                            <span style={{ fontSize: 11, color: '#22c55e' }}>+{ability.trendValue}</span>
                          )}
                          {ability.trend === 'down' && (
                            <span style={{ fontSize: 11, color: '#ef4444' }}>-{ability.trendValue}</span>
                          )}
                        </div>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${ability.score}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{
                            height: '100%',
                            borderRadius: 4,
                            background: ability.score >= 80
                              ? '#22c55e'
                              : ability.score >= 60
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI建议 */}
                <div style={{
                  marginTop: 28,
                  padding: 18,
                  borderRadius: 12,
                  background: `rgba(${config.accentRgb},0.08)`,
                  border: `1px solid ${config.panelBorder}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Zap size={16} style={{ color: config.accent }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: config.accent }}>AI 智能训练建议</span>
                  </div>
                  <div style={{ fontSize: 13, color: config.textPrimary, lineHeight: 1.8 }}>
                    <p style={{ marginBottom: 8 }}>• 情绪对抗能力得分偏低（68分），建议优先完成「高压抗压卡」专项训练</p>
                    <p style={{ marginBottom: 8 }}>• 异议处理能力有提升趋势（+8分），继续保持当前训练强度</p>
                    <p>• 合规意识表现优秀（91分），可作为团队标杆分享经验</p>
                  </div>
                </div>
              </div>
            )}

            {/* 错题集 */}
            {activeTab === 'wrongbook' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {wrongAnswers.length === 0 ? (
                  <div style={{
                    padding: 60,
                    borderRadius: 20,
                    background: config.panelBg,
                    border: `1px solid ${config.panelBorder}`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: config.textPrimary, marginBottom: 8 }}>
                      太棒了！
                    </div>
                    <div style={{ fontSize: 14, color: config.textSecondary }}>
                      你已经掌握了所有错题，继续保持！
                    </div>
                  </div>
                ) : (
                  wrongAnswers.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        padding: 24,
                        borderRadius: 16,
                        background: config.panelBg,
                        border: `1px solid ${config.panelBorder}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: 20,
                              background: 'rgba(239,68,68,0.15)',
                              color: '#ef4444',
                              fontSize: 11,
                              fontWeight: 600,
                            }}>
                              {item.type}
                            </span>
                            <span style={{ fontSize: 12, color: config.accent }}>{item.scenario}</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: config.textPrimary }}>
                            {item.question}
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: config.textSecondary }}>{item.date}</span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 16,
                        marginBottom: 16,
                      }}>
                        <div style={{
                          padding: 14,
                          borderRadius: 12,
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                        }}>
                          <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 6 }}>❌ 我的回答</div>
                          <div style={{ fontSize: 13, color: '#fca5a5' }}>{item.myAnswer}</div>
                        </div>
                        <div style={{
                          padding: 14,
                          borderRadius: 12,
                          background: 'rgba(34,197,94,0.08)',
                          border: '1px solid rgba(34,197,94,0.2)',
                        }}>
                          <div style={{ fontSize: 11, color: '#22c55e', marginBottom: 6 }}>✅ 正确答案</div>
                          <div style={{ fontSize: 13, color: '#86efac' }}>{item.correctAnswer}</div>
                        </div>
                      </div>

                      <div style={{
                        padding: 12,
                        borderRadius: 8,
                        background: `rgba(${config.accentRgb},0.05)`,
                        border: `1px solid ${config.panelBorder}`,
                        fontSize: 13,
                        color: config.textPrimary,
                        marginBottom: 16,
                      }}>
                        <span style={{ color: config.accent, fontWeight: 600 }}>💡 解析：</span>
                        {item.reason}
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          onClick={() => setSelectedWrongItem(item)}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 8,
                            background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                            border: 'none',
                            color: '#000',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          重新训练
                        </button>
                        <button
                          onClick={() => handleMastered(item.id)}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 8,
                            background: 'transparent',
                            border: `1px solid ${config.panelBorder}`,
                            color: config.textSecondary,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          标记已掌握
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* 训练记录 */}
            {activeTab === 'history' && (
              <div style={{
                padding: 24,
                borderRadius: 20,
                background: config.panelBg,
                border: `1px solid ${config.panelBorder}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <Calendar size={20} style={{ color: config.accent }} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: config.textPrimary }}>历史训练记录</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {trainingHistory.map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        padding: 18,
                        borderRadius: 12,
                        background: `rgba(${config.accentRgb},0.03)`,
                        border: `1px solid ${config.panelBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `rgba(${config.accentRgb},0.1)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}>
                        📋
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: config.textPrimary, marginBottom: 4 }}>
                          {record.scenario}
                        </div>
                        <div style={{ fontSize: 12, color: config.textSecondary }}>
                          {record.date} · {record.time}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: record.score >= 80 ? '#22c55e' : record.score >= 60 ? '#f59e0b' : '#ef4444',
                          fontFamily: "'Orbitron', sans-serif",
                        }}>
                          {record.score}
                        </div>
                        <div style={{ fontSize: 12, color: config.textSecondary }}>
                          {'⭐'.repeat(record.stars)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (record.trainingId === 'team-battle') {
                            navigate(`/training/team-battle?skin=${skin}`);
                          } else {
                            navigate(`/training/${record.trainingId}?skin=${skin}`);
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          background: `rgba(${config.accentRgb},0.1)`,
                          border: `1px solid ${config.panelBorder}`,
                          color: config.accent,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        再次挑战
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 成就勋章 */}
            {activeTab === 'achievements' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 20,
              }}>
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      background: badge.earned ? config.panelBg : 'rgba(107,114,128,0.1)',
                      border: `1px solid ${badge.earned ? config.panelBorder : 'rgba(107,114,128,0.2)'}`,
                      textAlign: 'center',
                      opacity: badge.earned ? 1 : 0.6,
                    }}
                  >
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: badge.earned
                        ? `linear-gradient(135deg, ${config.gradientFrom}30, ${config.gradientTo}30)`
                        : 'rgba(107,114,128,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      margin: '0 auto 14px',
                      border: badge.earned ? `2px solid ${config.accent}` : '2px solid rgba(107,114,128,0.3)',
                    }}>
                      {badge.icon}
                    </div>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: badge.earned ? config.textPrimary : config.textSecondary,
                      marginBottom: 4,
                    }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 12, color: config.textSecondary }}>
                      {badge.desc}
                    </div>
                    {badge.earned && (
                      <div style={{
                        marginTop: 12,
                        padding: '4px 12px',
                        borderRadius: 12,
                        background: `rgba(${config.accentRgb},0.15)`,
                        color: config.accent,
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'inline-block',
                      }}>
                        ✓ 已获得
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 错题详情弹窗 */}
      <AnimatePresence>
        {selectedWrongItem && (
          <WrongAnswerModal
            item={selectedWrongItem}
            config={config}
            onClose={() => setSelectedWrongItem(null)}
            onMastered={() => handleMastered(selectedWrongItem.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
