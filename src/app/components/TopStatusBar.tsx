import React, { useState } from 'react';
import { Bell, Trophy, Star, Zap, ChevronDown, AlertTriangle } from 'lucide-react';
import type { Skin, SkinConfig } from '../types/game';

interface TopStatusBarProps {
  skin: Skin;
  config: SkinConfig;
  onSkinChange: (skin: Skin) => void;
}

const violations = [
  { id: 1, text: '本周触发合规红线 2 次', scenario: '反洗钱识别' },
  { id: 2, text: '话术偏差预警 1 条', scenario: '产品推荐' },
];

export default function TopStatusBar({ skin, config, onSkinChange }: TopStatusBarProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const xpPercent = 68;

  return (
    <>
      <style>{`
        .hud-bar {
          background: ${config.panelBg};
          border-bottom: 1px solid ${config.panelBorder};
          backdrop-filter: blur(16px);
        }
        .xp-fill {
          background: linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo});
          box-shadow: 0 0 8px rgba(${config.accentRgb},0.6);
        }
        .accent-btn {
          border: 1px solid ${config.panelBorder};
          background: rgba(${config.accentRgb},0.1);
          color: ${config.accent};
          transition: all 0.2s;
        }
        .accent-btn:hover {
          background: rgba(${config.accentRgb},0.2);
          box-shadow: 0 0 12px rgba(${config.accentRgb},0.3);
        }
        .metric-glow {
          color: ${config.accent};
          text-shadow: 0 0 12px rgba(${config.accentRgb},0.8);
        }
        .skin-badge {
          background: linear-gradient(135deg, ${config.gradientFrom}22, ${config.gradientTo}22);
          border: 1px solid ${config.panelBorder};
          color: ${config.accent};
        }
        .alert-panel {
          background: ${config.panelBg};
          border: 1px solid ${config.panelBorder};
          backdrop-filter: blur(20px);
        }
        .top-text { color: ${config.textPrimary}; }
        .sub-text { color: ${config.textSecondary}; }
      `}</style>

      <div className="hud-bar w-full h-16 flex items-center px-4 gap-4 z-50 relative shrink-0" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        
        {/* Left: Avatar + Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
              style={{
                background: `linear-gradient(135deg, ${config.gradientFrom}40, ${config.gradientTo}40)`,
                border: `2px solid ${config.accent}`,
                boxShadow: `0 0 12px rgba(${config.accentRgb},0.4)`,
                color: config.accent,
                fontFamily: "'Orbitron', sans-serif",
              }}>
              陈
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
              style={{ background: config.accent, color: config.bg }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif" }}>IV</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="top-text text-sm" style={{ fontWeight: 600 }}>陈美琳</span>
              <span className="text-xs px-1.5 py-0.5 rounded skin-badge" style={{ fontSize: 10 }}>资深理财经理</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="sub-text text-xs">Lv.28</span>
              <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="xp-fill h-full rounded-full" style={{ width: `${xpPercent}%` }} />
              </div>
              <span className="sub-text text-xs">{xpPercent}%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px shrink-0" style={{ background: config.panelBorder }} />

        {/* Center: Core Metric */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <div className="sub-text text-xs">{config.metricLabel}</div>
            <div className="flex items-baseline gap-1">
              <span className="metric-glow text-2xl" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900 }}>
                {config.metricValue}
              </span>
              <span className="sub-text text-xs">天</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontSize: 10 }}>运行正常</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={10} style={{ color: config.accent }} />
              <span className="sub-text" style={{ fontSize: 10 }}>本月最佳：{config.metricValue + 12}天</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px shrink-0" style={{ background: config.panelBorder }} />

        {/* Resources */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <Zap size={14} style={{ color: config.accent }} />
            <span className="top-text text-sm" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>8,320</span>
            <span className="sub-text text-xs">积分</span>
          </div>
          <div className="relative">
            <button className="flex items-center gap-1.5 accent-btn px-2 py-1 rounded-md text-xs"
              onClick={() => setShowBadges(!showBadges)}>
              <Trophy size={12} />
              <span style={{ fontFamily: "'Orbitron', sans-serif" }}>12</span>
              <span className="sub-text">勋章</span>
            </button>
            {showBadges && (
              <div className="alert-panel absolute top-8 left-0 w-56 rounded-lg p-3 z-50">
                <div className="top-text text-xs mb-2" style={{ fontWeight: 600 }}>已解锁勋章</div>
                <div className="flex flex-wrap gap-2">
                  {['🏆','⭐','🛡️','💎','🔥','⚡','🎯','🌟','🏅','💪','🧠','🎖️'].map((b, i) => (
                    <span key={i} className="text-base" title={`勋章 ${i + 1}`}>{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Map Name */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: config.accent, boxShadow: `0 0 6px ${config.accent}` }} />
          <span className="sub-text text-xs" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: '0.1em' }}>
            {config.mapName}
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px shrink-0" style={{ background: config.panelBorder }} />

        {/* Whistle Alert */}
        <div className="relative shrink-0">
          <button
            className="relative flex items-center gap-2 accent-btn px-3 py-1.5 rounded-md text-xs"
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <Bell size={13} />
            <span>哨声预警</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center"
              style={{ background: '#ef4444', color: '#fff', fontFamily: "'Orbitron',sans-serif" }}>
              2
            </span>
          </button>
          {showAlerts && (
            <div className="alert-panel absolute top-9 right-0 w-72 rounded-xl p-4 z-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                <span className="top-text text-xs" style={{ fontWeight: 700 }}>最近违规哨声统计</span>
              </div>
              <div className="space-y-2">
                {violations.map(v => (
                  <div key={v.id} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div className="text-xs" style={{ color: '#fca5a5' }}>{v.text}</div>
                    <button className="text-xs mt-1" style={{ color: config.accent }}>
                      → 进入《{v.scenario}》复仇训练
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skin Toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => onSkinChange('finance')}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all"
            style={{
              background: skin === 'finance' ? `rgba(0,212,255,0.15)` : 'transparent',
              color: skin === 'finance' ? '#00d4ff' : '#6b7280',
              border: skin === 'finance' ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              fontWeight: 600,
            }}>
            🏦 金融
          </button>
          <button
            onClick={() => onSkinChange('energy')}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all"
            style={{
              background: skin === 'energy' ? `rgba(255,140,0,0.15)` : 'transparent',
              color: skin === 'energy' ? '#ff8c00' : '#6b7280',
              border: skin === 'energy' ? '1px solid rgba(255,140,0,0.3)' : '1px solid transparent',
              fontWeight: 600,
            }}>
            ⚡ 能源
          </button>
        </div>
      </div>
    </>
  );
}
