import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Brain, TrendingUp, TrendingDown, Minus, ChevronRight, Tag, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { SkinConfig, LeaderboardEntry } from '../types/game';
import { wikiItems, aiPrescription, leaderboard } from '../data/gameData';

interface SidebarProps {
  config: SkinConfig;
}

type SidebarTab = 'wiki' | 'leaderboard' | 'ai';

const tabs = [
  { id: 'wiki' as SidebarTab, icon: <BookOpen size={14} />, label: '作战手册' },
  { id: 'leaderboard' as SidebarTab, icon: <Trophy size={14} />, label: '排行榜' },
  { id: 'ai' as SidebarTab, icon: <Brain size={14} />, label: 'AI处方' },
];

function WikiPanel({ config }: { config: SkinConfig }) {
  const [search, setSearch] = useState('');
  const filtered = wikiItems.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) || w.category.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="搜索话术、SOP..."
        style={{
          background: `rgba(${config.accentRgb},0.06)`,
          border: `1px solid ${config.panelBorder}`,
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 11,
          color: config.textPrimary,
          outline: 'none',
          width: '100%',
          fontFamily: "'Rajdhani', sans-serif",
        }}
      />

      {/* Categories */}
      <div style={{ display: 'flex', gap: 4 }}>
        {['全部', '话术库', '合规手册'].map(cat => (
          <button key={cat} style={{
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 12,
            border: `1px solid ${config.panelBorder}`,
            background: cat === '全部' ? `rgba(${config.accentRgb},0.15)` : 'transparent',
            color: cat === '全部' ? config.accent : config.textSecondary,
            cursor: 'pointer',
            fontFamily: "'Rajdhani', sans-serif",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(item => (
          <motion.div key={item.id} whileHover={{ x: 4 }}
            style={{
              padding: '8px 10px',
              borderRadius: 10,
              background: `rgba(${config.accentRgb},0.04)`,
              border: `1px solid ${config.panelBorder}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: config.textPrimary, lineHeight: 1.3 }}>{item.title}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 9,
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: `rgba(${config.accentRgb},0.1)`,
                    color: config.accent,
                    border: `1px solid rgba(${config.accentRgb},0.2)`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ChevronRight size={12} style={{ color: config.textSecondary }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: 14 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 14 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 14 }}>🥉</span>;
  return (
    <span style={{
      fontFamily: "'Orbitron', sans-serif",
      fontSize: 10,
      color: '#6b7280',
      width: 20,
      textAlign: 'center',
    }}>
      {rank}
    </span>
  );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'same' }) {
  if (trend === 'up') return <TrendingUp size={10} style={{ color: '#22c55e' }} />;
  if (trend === 'down') return <TrendingDown size={10} style={{ color: '#ef4444' }} />;
  return <Minus size={10} style={{ color: '#6b7280' }} />;
}

function LeaderboardPanel({ config }: { config: SkinConfig }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: config.textSecondary }}>本周积分榜</span>
        <span style={{ fontSize: 9, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>TOP 100</span>
      </div>

      {leaderboard.map((entry, i) => (
        <motion.div
          key={entry.rank}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          style={{
            padding: '7px 10px',
            borderRadius: 10,
            background: entry.isMe
              ? `rgba(${config.accentRgb},0.1)`
              : `rgba(${config.accentRgb},0.03)`,
            border: entry.isMe
              ? `1px solid rgba(${config.accentRgb},0.4)`
              : `1px solid ${config.panelBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: entry.isMe ? `0 0 10px rgba(${config.accentRgb},0.15)` : 'none',
          }}>
          <RankBadge rank={entry.rank} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: entry.isMe ? config.accent : config.textPrimary }}>
                {entry.name}
              </span>
              {entry.isMe && (
                <span style={{
                  fontSize: 8,
                  padding: '1px 4px',
                  borderRadius: 4,
                  background: `rgba(${config.accentRgb},0.2)`,
                  color: config.accent,
                }}>
                  我
                </span>
              )}
            </div>
            <div style={{ fontSize: 9, color: config.textSecondary }}>{entry.level}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Orbitron', sans-serif",
              color: entry.isMe ? config.accent : config.textPrimary,
            }}>
              {entry.score.toLocaleString()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TrendIcon trend={entry.trend} />
            </div>
          </div>
        </motion.div>
      ))}

      {/* My rank summary */}
      <div style={{
        marginTop: 4,
        padding: '8px 10px',
        borderRadius: 10,
        background: 'rgba(107,114,128,0.06)',
        border: '1px solid rgba(107,114,128,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: '#6b7280' }}>距离上一名还差</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>340 分</span>
      </div>
    </div>
  );
}

const priorityColors = {
  high: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#ef4444', label: '高优先' },
  medium: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b', label: '建议' },
  low: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#22c55e', label: '选修' },
};

function AIPrescriptionPanel({ config }: { config: SkinConfig }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'Rajdhani', sans-serif" }}>
      {/* AI Analysis Header */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 12,
        background: `rgba(${config.accentRgb},0.08)`,
        border: `1px solid ${config.panelBorder}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Brain size={13} style={{ color: config.accent }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: config.textPrimary }}>AI 能力诊断报告</span>
          <span style={{
            fontSize: 8,
            padding: '1px 6px',
            borderRadius: 8,
            background: `rgba(${config.accentRgb},0.2)`,
            color: config.accent,
            fontFamily: "'Orbitron', sans-serif",
          }}>本周</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: '综合评分', value: '82', unit: '分' },
            { label: '合规得分', value: '91', unit: '分' },
            { label: '情绪控制', value: '74', unit: '分' },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
                {item.value}
              </div>
              <div style={{ fontSize: 9, color: config.textSecondary, lineHeight: 1.2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly prescription */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <Calendar size={11} style={{ color: config.textSecondary }} />
          <span style={{ fontSize: 10, color: config.textSecondary }}>下周训练处方计划</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {aiPrescription.map((item, i) => {
            const p = priorityColors[item.priority as keyof typeof priorityColors];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: `${p.color}20`,
                  border: `1px solid ${p.color}40`,
                  fontSize: 9,
                  color: p.color,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  marginTop: 2,
                }}>
                  {item.day}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: config.textPrimary, lineHeight: 1.3 }}>
                    {item.task}
                  </div>
                  <div style={{ fontSize: 9, color: config.textSecondary, marginTop: 2, lineHeight: 1.4 }}>
                    📌 {item.reason}
                  </div>
                </div>
                <span style={{
                  fontSize: 9,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: p.bg,
                  color: p.color,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                }}>
                  {p.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weak spots */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 12,
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <AlertCircle size={11} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>重点关注弱点</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['情绪对抗能力 — 面对愤怒客户得分偏低', '合规红线认知 — 触发频率高于平均 23%'].map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, color: '#fca5a5', lineHeight: 1.4 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444', marginTop: 4, shrink: 0 }} />
              {w}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: 10,
          background: `linear-gradient(135deg, ${config.gradientFrom}33, ${config.gradientTo}22)`,
          border: `1px solid ${config.panelBorder}`,
          color: config.accent,
          fontSize: 11,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontFamily: "'Rajdhani', sans-serif",
        }}>
        <CheckCircle2 size={12} />
        一键按处方开始本周训练
      </motion.button>
    </div>
  );
}

export default function Sidebar({ config }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('wiki');

  return (
    <>
      <style>{`
        .sidebar-panel {
          background: ${config.panelBg};
          border-left: 1px solid ${config.panelBorder};
          backdrop-filter: blur(16px);
        }
        .sidebar-tab-active {
          background: rgba(${config.accentRgb},0.12);
          color: ${config.accent};
          border-bottom: 2px solid ${config.accent};
        }
        .sidebar-tab-inactive {
          color: ${config.textSecondary};
          border-bottom: 2px solid transparent;
        }
        .sidebar-tab-inactive:hover {
          color: ${config.textPrimary};
          background: rgba(255,255,255,0.03);
        }
      `}</style>

      <div className="sidebar-panel flex flex-col shrink-0 overflow-hidden" style={{ width: 260, fontFamily: "'Rajdhani', sans-serif" }}>
        
        {/* Tabs */}
        <div className="flex shrink-0" style={{ borderBottom: `1px solid ${config.panelBorder}` }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs transition-all ${activeTab === tab.id ? 'sidebar-tab-active' : 'sidebar-tab-inactive'}`}
              style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}
            >
              {tab.icon}
              <span style={{ fontSize: 9 }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'thin', scrollbarColor: `rgba(${config.accentRgb},0.2) transparent` }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'wiki' && <WikiPanel config={config} />}
              {activeTab === 'leaderboard' && <LeaderboardPanel config={config} />}
              {activeTab === 'ai' && <AIPrescriptionPanel config={config} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
