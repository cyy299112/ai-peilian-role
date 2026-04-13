import React from 'react';
import { motion } from 'motion/react';
import { Target, Library, Wrench } from 'lucide-react';
import type { SkinConfig } from '../types/game';

export type MainTab = 'training' | 'knowledge' | 'workshop';

interface LeftNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  config: SkinConfig;
}

const navItems = [
  { id: 'training' as MainTab, icon: <Target size={18} />, label: '训练中心', desc: '场景陪练与实战' },
  { id: 'knowledge' as MainTab, icon: <Library size={18} />, label: '知识中心', desc: 'Wiki·课程·问答' },
  { id: 'workshop' as MainTab, icon: <Wrench size={18} />, label: 'AI工具', desc: '资源加工与生成' },
];

export default function LeftNav({ activeTab, onTabChange, config }: LeftNavProps) {
  return (
    <div style={{
      width: 72,
      height: '100vh',
      background: config.panelBg,
      borderRight: `1px solid ${config.panelBorder}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 16,
      gap: 4,
      flexShrink: 0,
      backdropFilter: 'blur(16px)',
      zIndex: 10,
    }}>
      {/* Logo area */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        marginBottom: 20,
        boxShadow: `0 0 12px rgba(${config.accentRgb},0.3)`,
      }}>
        🎯
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {navItems.map(item => (
          <motion.button
            key={item.id}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(item.id)}
            style={{
              width: 52,
              padding: '10px 4px',
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid transparent',
              color: activeTab === item.id ? config.accent : config.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            {item.icon}
            <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", lineHeight: 1 }}>{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                layoutId="leftNavIndicator"
                style={{
                  position: 'absolute',
                  left: -5,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 24,
                  borderRadius: 2,
                  background: config.accent,
                  boxShadow: `0 0 8px ${config.accent}`,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom indicator */}
      <div style={{
        width: 32,
        height: 3,
        borderRadius: 2,
        background: `rgba(${config.accentRgb},0.2)`,
      }} />
    </div>
  );
}
