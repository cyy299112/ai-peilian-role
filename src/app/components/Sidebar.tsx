import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Brain, TrendingUp, TrendingDown, Minus, ChevronRight, Tag, Calendar, AlertCircle, CheckCircle2, X, FileText, Search, Library, Wrench, GraduationCap, MessageCircle, Upload, FileQuestion, GitBranch, Mic, BarChart3, ClipboardList, Sparkles, PlayCircle } from 'lucide-react';
import type { SkinConfig, LeaderboardEntry } from '../types/game';
import type { WikiItem } from '../data/gameData';
import { wikiItems, aiPrescription, leaderboard } from '../data/gameData';

// Wiki详情面板组件 - 在地图右侧悬浮显示
interface WikiDetailPanelProps {
  wiki: WikiItem;
  config: SkinConfig;
  onClose: () => void;
}

function WikiDetailPanel({ wiki, config, onClose }: WikiDetailPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        right: 260, // 在右侧边栏左侧
        top: 80,
        width: 320,
        maxHeight: 'calc(100vh - 240px)',
        background: config.panelBg,
        border: `1px solid ${config.panelBorder}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(${config.accentRgb},0.1)`,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${config.panelBorder}`,
        background: `linear-gradient(135deg, rgba(${config.accentRgb},0.15), rgba(${config.accentRgb},0.05))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{wiki.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: config.textPrimary }}>{wiki.title}</div>
            <div style={{ fontSize: 11, color: config.accent }}>{wiki.category}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'transparent',
            border: `1px solid ${config.panelBorder}`,
            color: config.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: 20,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 240px)',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 16,
        }}>
          {wiki.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10,
              padding: '3px 10px',
              borderRadius: 12,
              background: `rgba(${config.accentRgb},0.1)`,
              color: config.accent,
              border: `1px solid rgba(${config.accentRgb},0.2)`,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{
          fontSize: 12,
          color: config.textPrimary,
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
        }}>
          {wiki.content}
        </div>
      </div>
    </motion.div>
  );
}

interface SidebarProps {
  config: SkinConfig;
}

type SidebarTab = 'wiki' | 'leaderboard' | 'ai';

const tabs = [
  { id: 'wiki' as SidebarTab, icon: <BookOpen size={14} />, label: '作战手册' },
  { id: 'leaderboard' as SidebarTab, icon: <Trophy size={14} />, label: '排行榜' },
  { id: 'ai' as SidebarTab, icon: <Brain size={14} />, label: 'AI处方' },
];

interface WikiPanelProps {
  config: SkinConfig;
  selectedWiki: WikiItem | null;
  onSelectWiki: (wiki: WikiItem | null) => void;
}

function WikiPanel({ config, selectedWiki, onSelectWiki }: WikiPanelProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const filtered = wikiItems.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.category.includes(search);
    const matchesCategory = activeCategory === '全部' || w.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 12,
              border: `1px solid ${config.panelBorder}`,
              background: cat === activeCategory ? `rgba(${config.accentRgb},0.15)` : 'transparent',
              color: cat === activeCategory ? config.accent : config.textSecondary,
              cursor: 'pointer',
              fontFamily: "'Rajdhani', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ x: 4, backgroundColor: `rgba(${config.accentRgb},0.08)` }}
            onClick={() => onSelectWiki(item)}
            style={{
              padding: '8px 10px',
              borderRadius: 10,
              background: selectedWiki?.id === item.id
                ? `rgba(${config.accentRgb},0.12)`
                : `rgba(${config.accentRgb},0.04)`,
              border: selectedWiki?.id === item.id
                ? `1px solid ${config.accent}`
                : `1px solid ${config.panelBorder}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
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

      {filtered.length === 0 && (
        <div style={{
          padding: 24,
          textAlign: 'center',
          color: config.textSecondary,
          fontSize: 12,
        }}>
          <FileText size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
          <div>未找到相关内容</div>
        </div>
      )}
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

// ==================== 知识中心面板 ====================
interface KnowledgeItem {
  id: string;
  title: string;
  type: 'course' | 'article' | 'video' | 'qa';
  icon: string;
  category: string;
  duration?: string;
  views: number;
  tags: string[];
}

const knowledgeItems: KnowledgeItem[] = [
  { id: 'k1', title: '理财产品合规销售全流程SOP', type: 'article', icon: '📋', category: '合规手册', views: 1243, tags: ['SOP', '合规', '必读'] },
  { id: 'k2', title: '高净值客户沟通技巧精讲', type: 'video', icon: '🎬', category: '话术库', duration: '25分钟', views: 892, tags: ['沟通', '高净值'] },
  { id: 'k3', title: '反洗钱可疑交易识别实操', type: 'course', icon: '🎓', category: '公共课室', duration: '40分钟', views: 2341, tags: ['AML', '实操'] },
  { id: 'k4', title: '如何应对"我需要考虑一下"', type: 'article', icon: '💡', category: '话术库', views: 3102, tags: ['异议处理', '高频'] },
  { id: 'k5', title: '客户情绪管理：从愤怒到满意', type: 'video', icon: '🎥', category: '公共课室', duration: '18分钟', views: 1567, tags: ['情绪管理', '投诉'] },
  { id: 'k6', title: 'Q：三年期贷款利率是多少？', type: 'qa', icon: '❓', category: '问答社区', views: 890, tags: ['利率', '常见问题'] },
  { id: 'k7', title: '数字人民币业务知识速查', type: 'article', icon: '📖', category: '知识检索', views: 4521, tags: ['DCEP', '新产品'] },
  { id: 'k8', title: '信用卡分期话术模板集', type: 'article', icon: '📝', category: '话术库', views: 2789, tags: ['信用卡', '分期'] },
];

// 知识详情弹窗组件
interface KnowledgeDetailModalProps {
  item: KnowledgeItem;
  config: SkinConfig;
  onClose: () => void;
}

function KnowledgeDetailModal({ item, config, onClose }: KnowledgeDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // 模拟播放进度
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsCompleted(true);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted]);

  const getContent = () => {
    switch (item.type) {
      case 'course':
        return {
          intro: '本课程将系统讲解相关知识点，帮助您掌握核心技能。课程包含理论讲解、案例分析和实操演练三个部分。',
          sections: [
            { title: '第一章：基础概念', duration: '8分钟', completed: true },
            { title: '第二章：实操演练', duration: '15分钟', completed: true },
            { title: '第三章：案例分析', duration: '12分钟', completed: false },
            { title: '第四章：进阶技巧', duration: '5分钟', completed: false },
          ],
        };
      case 'article':
        return {
          intro: '本文详细介绍了相关业务的操作规范和注意事项，建议结合实际工作场景进行学习。',
          content: `一、基本概念与定义
\n本文所述业务流程是指...\n\n二、操作规范与要求\n\n1. 首先需要进行客户身份核实\n2. 其次要详细了解客户需求\n3. 最后提供专业的解决方案\n\n三、常见问题与解答\n\nQ: 如何处理特殊情况？\nA: 建议按照标准流程操作，如有疑问及时向上级汇报。\n\n四、注意事项\n\n• 严格遵守合规要求\n• 保护客户隐私信息\n• 及时更新业务知识`,
        };
      case 'video':
        return {
          intro: '本视频通过真实场景演示，帮助您快速掌握关键技能。建议在安静环境下观看。',
        };
      case 'qa':
        return {
          intro: '这里汇集了常见问题及专业解答，帮助您快速解决工作中的疑惑。',
          qas: [
            { q: item.question || item.title, a: '根据相关规定，建议按照标准流程处理。具体操作步骤如下：\n\n1. 核实客户身份信息\n2. 了解具体需求\n3. 提供合规的解决方案\n\n如有特殊情况，请及时向上级汇报。' },
            { q: '相关业务的办理时限是多久？', a: '一般情况下，业务办理时限为3-5个工作日。如遇特殊情况，可能需要延长办理时间，我们会及时通知您。' },
            { q: '需要准备哪些材料？', a: '通常需要准备：\n• 有效身份证件\n• 相关申请表格\n• 辅助证明材料\n\n具体材料清单请以实际要求为准。' },
          ],
        };
      default:
        return { intro: '', content: '' };
    }
  };

  const content = getContent();

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
          maxWidth: 600,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: config.textPrimary }}>{item.title}</div>
              <div style={{ fontSize: 11, color: config.accent, marginTop: 2 }}>{item.category} · {item.views}次浏览</div>
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
          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                padding: '4px 10px',
                borderRadius: 12,
                background: `rgba(${config.accentRgb},0.1)`,
                color: config.accent,
                fontSize: 11,
              }}>
                {tag}
              </span>
            ))}
            {item.duration && (
              <span style={{
                padding: '4px 10px',
                borderRadius: 12,
                background: 'rgba(34,197,94,0.1)',
                color: '#22c55e',
                fontSize: 11,
              }}>
                <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                {item.duration}
              </span>
            )}
          </div>

          {/* Intro */}
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: `rgba(${config.accentRgb},0.05)`,
            border: `1px solid ${config.panelBorder}`,
            marginBottom: 20,
            fontSize: 13,
            color: config.textPrimary,
            lineHeight: 1.6,
          }}>
            {content.intro}
          </div>

          {/* Course Content */}
          {item.type === 'course' && content.sections && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: config.textPrimary, marginBottom: 12 }}>课程章节</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {content.sections.map((section, i) => (
                  <div key={i} style={{
                    padding: 12,
                    borderRadius: 10,
                    background: section.completed ? 'rgba(34,197,94,0.08)' : `rgba(${config.accentRgb},0.05)`,
                    border: `1px solid ${section.completed ? 'rgba(34,197,94,0.2)' : config.panelBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {section.completed ? (
                        <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                      ) : (
                        <PlayCircle size={16} style={{ color: config.accent }} />
                      )}
                      <span style={{ fontSize: 13, color: config.textPrimary }}>{section.title}</span>
                    </div>
                    <span style={{ fontSize: 11, color: config.textSecondary }}>{section.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          {item.type === 'article' && content.content && (
            <div style={{
              padding: 16,
              borderRadius: 12,
              background: `rgba(${config.accentRgb},0.03)`,
              border: `1px solid ${config.panelBorder}`,
              fontSize: 13,
              color: config.textPrimary,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              marginBottom: 20,
            }}>
              {content.content}
            </div>
          )}

          {/* Video Player */}
          {item.type === 'video' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                aspectRatio: '16/9',
                borderRadius: 12,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {!isPlaying && progress === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <PlayCircle size={28} style={{ color: '#000', marginLeft: 2 }} />
                  </motion.button>
                )}
                {isPlaying && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'rgba(255,255,255,0.1)',
                  }}>
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      style={{
                        height: '100%',
                        background: config.accent,
                      }}
                    />
                  </div>
                )}
                {isCompleted && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={48} style={{ color: '#22c55e', marginBottom: 12 }} />
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e' }}>观看完成！</div>
                    <div style={{ fontSize: 12, color: config.textSecondary, marginTop: 4 }}>+50 XP</div>
                  </div>
                )}
              </div>
              {isPlaying && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                  <button
                    onClick={() => setIsPlaying(false)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 8,
                      background: `rgba(${config.accentRgb},0.1)`,
                      border: `1px solid ${config.panelBorder}`,
                      color: config.textSecondary,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    暂停播放
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Q&A Content */}
          {item.type === 'qa' && content.qas && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {content.qas.map((qa, i) => (
                <div key={i} style={{
                  padding: 14,
                  borderRadius: 10,
                  background: `rgba(${config.accentRgb},0.05)`,
                  border: `1px solid ${config.panelBorder}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: config.textPrimary, marginBottom: 8 }}>
                    Q: {qa.q}
                  </div>
                  <div style={{ fontSize: 12, color: config.textSecondary, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    A: {qa.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {item.type === 'video' && !isPlaying && progress === 0 && (
              <button
                onClick={() => setIsPlaying(true)}
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <PlayCircle size={18} />
                开始学习
              </button>
            )}
            {isCompleted && (
              <button
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: 10,
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={18} />
                已完成
              </button>
            )}
            <button
              onClick={onClose}
              style={{
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
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function KnowledgeCenterPanel({ config }: { config: SkinConfig }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'course' | 'article' | 'video' | 'qa'>('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const filtered = knowledgeItems.filter(k => {
    const matchSearch = k.title.toLowerCase().includes(search.toLowerCase()) || k.tags.some(t => t.includes(search));
    const matchFilter = activeFilter === 'all' || k.type === activeFilter;
    return matchSearch && matchFilter;
  });

  const typeIcons = {
    course: <GraduationCap size={12} />,
    article: <FileText size={12} />,
    video: <PlayCircle size={12} />,
    qa: <MessageCircle size={12} />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: config.textSecondary }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索知识、课程、问答..."
          style={{
            background: `rgba(${config.accentRgb},0.06)`,
            border: `1px solid ${config.panelBorder}`,
            borderRadius: 8,
            padding: '6px 10px 6px 30px',
            fontSize: 11,
            color: config.textPrimary,
            outline: 'none',
            width: '100%',
            fontFamily: "'Rajdhani', sans-serif",
          }}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: '全部' }, { id: 'course', label: '🎓 课程' },
          { id: 'article', label: '📋 文章' }, { id: 'video', label: '🎬 视频' }, { id: 'qa', label: '❓ 问答' },
        ].map(f => (
          <button key={f.id}
            onClick={() => setActiveFilter(f.id as typeof activeFilter)}
            style={{ fontSize: 9, padding: '3px 7px', borderRadius: 8, border: `1px solid ${activeFilter === f.id ? config.accent : config.panelBorder}`, background: activeFilter === f.id ? `rgba(${config.accentRgb},0.15)` : 'transparent', color: activeFilter === f.id ? config.accent : config.textSecondary, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", transition: 'all 0.2s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Quick access cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { icon: '🎓', label: '公共课室', count: '12门', color: '#22c55e' },
          { icon: '💬', label: '问答社区', count: '89条', color: '#3b82f6' },
          { icon: '🔍', label: '知识检索', count: '200+', color: '#f59e0b' },
          { icon: '📺', label: '专家直播', count: '进行中', color: '#ef4444' },
        ].map(card => (
          <motion.div key={card.label} whileHover={{ scale: 1.03 }} style={{ padding: '8px', borderRadius: 10, background: `rgba(${config.accentRgb},0.05)`, border: `1px solid ${config.panelBorder}`, textAlign: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>{card.icon}</span>
            <div style={{ fontSize: 10, fontWeight: 600, color: config.textPrimary, marginTop: 2 }}>{card.label}</div>
            <div style={{ fontSize: 9, color: card.color }}>{card.count}</div>
          </motion.div>
        ))}
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {filtered.map(item => (
          <motion.div key={item.id} whileHover={{ x: 3 }}
            onClick={() => setSelectedItem(item)}
            style={{ padding: '7px 9px', borderRadius: 9, background: `rgba(${config.accentRgb},0.04)`, border: `1px solid ${config.panelBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: config.textPrimary, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span style={{ fontSize: 8, color: config.textSecondary }}>{typeIcons[item.type]}</span>
                <span style={{ fontSize: 8, color: config.textSecondary }}>{item.category}</span>
                {item.duration && <span style={{ fontSize: 8, color: config.textSecondary }}>· {item.duration}</span>}
                <span style={{ fontSize: 8, color: '#6b7280' }}>· {item.views}次</span>
              </div>
            </div>
            <ChevronRight size={11} style={{ color: config.textSecondary, flexShrink: 0 }} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 20, textAlign: 'center', color: config.textSecondary, fontSize: 11 }}>
          <Library size={28} style={{ marginBottom: 6, opacity: 0.4 }} /><div>未找到相关知识</div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <KnowledgeDetailModal
            item={selectedItem}
            config={config}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== 资源工坊面板 ====================
interface WorkshopTask {
  id: string;
  name: string;
  type: 'ppt' | 'quiz' | 'mindmap' | 'transcript' | 'pptgen';
  status: 'ready' | 'processing' | 'done';
  fileName?: string;
  progress?: number;
  outputCount?: number;
}

const workshopTools = [
  { id: 'ppt', icon: <FileQuestion size={16} />, label: 'PPT试题抽取', desc: '上传PPT自动生成练习题', color: '#ef4444' },
  { id: 'quiz', icon: <ClipboardList size={16} />, label: '智能出题', desc: '文档→思维导图→试题', color: '#3b82f6' },
  { id: 'mindmap', icon: <GitBranch size={16} />, label: '思维导图生成', desc: '文档内容可视化结构化', color: '#22c55e' },
  { id: 'transcript', icon: <Mic size={16} />, label: '视频/音频转写', desc: '录音转文字+关键信息提取', color: '#f59e0b' },
  { id: 'pptgen', icon: <Sparkles size={16} />, label: 'PPT课件生成', desc: '大纲/文档→精美PPT', color: '#8b5cf6' },
];

// 资源工坊上传弹窗组件
interface UploadModalProps {
  tool: typeof workshopTools[0];
  config: SkinConfig;
  onClose: () => void;
  onUpload: (fileName: string) => void;
}

function UploadModal({ tool, config, onClose, onUpload }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = () => {
    // 模拟文件选择
    const mockFiles = ['培训材料.pptx', '产品手册.docx', '合规指南.pdf', '案例集.docx'];
    setSelectedFile(mockFiles[Math.floor(Math.random() * mockFiles.length)]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    }
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
          maxWidth: 480,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${tool.color}15`,
              border: `1px solid ${tool.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tool.color,
            }}>
              {tool.icon}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: config.textPrimary }}>{tool.label}</div>
              <div style={{ fontSize: 11, color: config.textSecondary }}>{tool.desc}</div>
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
        <div style={{ padding: 24 }}>
          {/* Upload Area */}
          <div
            onClick={handleFileSelect}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            style={{
              padding: 40,
              borderRadius: 16,
              border: `2px dashed ${isDragging ? config.accent : config.panelBorder}`,
              background: isDragging ? `rgba(${config.accentRgb},0.1)` : `rgba(${config.accentRgb},0.03)`,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Upload size={48} style={{ color: config.accent, marginBottom: 16 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: config.textPrimary, marginBottom: 8 }}>
              点击或拖拽文件到此处
            </div>
            <div style={{ fontSize: 12, color: config.textSecondary }}>
              支持 PPT、Word、PDF、视频等格式
            </div>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 10,
                background: `rgba(${config.accentRgb},0.1)`,
                border: `1px solid ${config.panelBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <FileText size={20} style={{ color: config.accent }} />
              <span style={{ flex: 1, fontSize: 13, color: config.textPrimary }}>{selectedFile}</span>
              <button
                onClick={() => setSelectedFile(null)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'transparent',
                  border: 'none',
                  color: config.textSecondary,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                移除
              </button>
            </motion.div>
          )}

          {/* Options */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: config.textPrimary, marginBottom: 12 }}>处理选项</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'auto', label: '自动识别内容类型', checked: true },
                { id: 'smart', label: '智能提取关键知识点', checked: true },
                { id: 'example', label: '生成配套案例', checked: false },
              ].map(option => (
                <label key={option.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={option.checked} style={{ accentColor: config.accent }} />
                  <span style={{ fontSize: 12, color: config.textPrimary }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
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
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: 10,
                background: selectedFile
                  ? `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`
                  : 'rgba(107,114,128,0.2)',
                border: 'none',
                color: selectedFile ? '#000' : config.textSecondary,
                fontSize: 14,
                fontWeight: 700,
                cursor: selectedFile ? 'pointer' : 'not-allowed',
              }}
            >
              开始处理
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 任务结果查看弹窗
interface TaskResultModalProps {
  task: WorkshopTask;
  config: SkinConfig;
  onClose: () => void;
}

function TaskResultModal({ task, config, onClose }: TaskResultModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'download'>('preview');

  // 模拟生成的题目
  const generatedQuestions = [
    { id: 1, type: '单选题', question: '客户质疑产品收益时，以下哪种回应是正确的？', difficulty: '中等' },
    { id: 2, type: '多选题', question: '反洗钱核查流程包括哪些步骤？', difficulty: '简单' },
    { id: 3, type: '判断题', question: '可以向客户透露可疑交易监测信息。', difficulty: '简单' },
    { id: 4, type: '案例分析', question: '某客户要求特殊优惠，作为客户经理应如何处理？', difficulty: '困难' },
    { id: 5, type: '情景模拟', question: '模拟处理客户投诉的完整流程。', difficulty: '困难' },
  ];

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
          background: 'rgba(34,197,94,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={28} style={{ color: '#22c55e' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e' }}>处理完成！</div>
              <div style={{ fontSize: 11, color: config.textSecondary }}>{task.name}</div>
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

        {/* Stats */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${config.panelBorder}`,
          display: 'flex',
          gap: 24,
        }}>
          {[
            { label: '生成题目', value: task.outputCount || 0, unit: '道' },
            { label: '处理时长', value: '2.5', unit: '分钟' },
            { label: '准确率', value: '98', unit: '%' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>
                {stat.value}<span style={{ fontSize: 12 }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: 11, color: config.textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${config.panelBorder}` }}>
          {[
            { id: 'preview', label: '预览题目' },
            { id: 'download', label: '下载资源' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === tab.id ? `rgba(${config.accentRgb},0.1)` : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${config.accent}` : '2px solid transparent',
                color: activeTab === tab.id ? config.accent : config.textSecondary,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: 20, overflow: 'auto', maxHeight: 'calc(85vh - 280px)' }}>
          {activeTab === 'preview' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {generatedQuestions.map((q, i) => (
                <div
                  key={q.id}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: `rgba(${config.accentRgb},0.05)`,
                    border: `1px solid ${config.panelBorder}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: `rgba(${config.accentRgb},0.15)`,
                      color: config.accent,
                      fontSize: 10,
                    }}>
                      {q.type}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: q.difficulty === '困难' ? 'rgba(239,68,68,0.15)' : q.difficulty === '中等' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                      color: q.difficulty === '困难' ? '#ef4444' : q.difficulty === '中等' ? '#f59e0b' : '#22c55e',
                      fontSize: 10,
                    }}>
                      {q.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: config.textPrimary }}>
                    {i + 1}. {q.question}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: '练习题集.pdf', size: '2.3 MB', icon: '📄' },
                { name: '配套案例.docx', size: '1.8 MB', icon: '📝' },
                { name: '知识点总结.pptx', size: '4.1 MB', icon: '📊' },
                { name: '导入题库.json', size: '156 KB', icon: '🔧' },
              ].map((file, i) => (
                <div
                  key={i}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    background: `rgba(${config.accentRgb},0.05)`,
                    border: `1px solid ${config.panelBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{file.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: config.textPrimary }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: config.textSecondary }}>{file.size}</div>
                  </div>
                  <button
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      background: `rgba(${config.accentRgb},0.1)`,
                      border: `1px solid ${config.panelBorder}`,
                      color: config.accent,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    下载
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${config.panelBorder}`, display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: 8,
              background: 'transparent',
              border: `1px solid ${config.panelBorder}`,
              color: config.textSecondary,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            关闭
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: 8,
              background: `linear-gradient(135deg, ${config.gradientFrom}, ${config.gradientTo})`,
              border: 'none',
              color: '#000',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            应用到训练
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ResourceWorkshopPanel({ config }: { config: SkinConfig }) {
  const [tasks, setTasks] = useState<WorkshopTask[]>([]);
  const [selectedTool, setSelectedTool] = useState<typeof workshopTools[0] | null>(null);
  const [selectedTask, setSelectedTask] = useState<WorkshopTask | null>(null);

  const handleUpload = (toolId: string, fileName: string) => {
    const tool = workshopTools.find(t => t.id === toolId);
    const newTask: WorkshopTask = {
      id: Date.now().toString(),
      name: `${tool?.label} - ${fileName}`,
      type: toolId as WorkshopTask['type'],
      status: 'processing',
      progress: 0,
      fileName: fileName,
    };
    setTasks(prev => [newTask, ...prev]);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'done' as const, progress: 100, outputCount: Math.floor(Math.random() * 10 + 5) } : t));
      } else {
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, progress: Math.min(p, 99) } : t));
      }
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {workshopTools.map(tool => (
          <motion.button key={tool.id} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTool(tool)}
            style={{ padding: '10px 8px', borderRadius: 10, background: `rgba(${config.accentRgb},0.05)`, border: `1px solid ${config.panelBorder}`, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${tool.color}15`, border: `1px solid ${tool.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tool.color }}>{tool.icon}</div>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: config.textPrimary }}>{tool.label}</span>
            </div>
            <span style={{ fontSize: 9, color: config.textSecondary }}>{tool.desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Processing Tasks */}
      {tasks.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: config.textPrimary }}>加工任务</span>
            <span style={{ fontSize: 9, color: config.textSecondary }}>{tasks.length}个任务</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {tasks.slice(0, 5).map(task => (
              <motion.div
                key={task.id}
                whileHover={{ x: 3 }}
                onClick={() => task.status === 'done' && setSelectedTask(task)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 9,
                  background: task.status === 'done' ? `rgba(34,197,94,0.06)` : `rgba(${config.accentRgb},0.05)`,
                  border: `1px solid ${task.status === 'done' ? 'rgba(34,197,94,0.2)' : config.panelBorder}`,
                  cursor: task.status === 'done' ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: config.textPrimary, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.name}</span>
                  {task.status === 'processing' && <span style={{ fontSize: 8, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>{Math.round(task.progress || 0)}%</span>}
                  {task.status === 'done' && <CheckCircle2 size={12} style={{ color: '#22c55e' }} />}
                </div>
                {task.status === 'processing' && (
                  <div style={{ width: '100%', height: 3, borderRadius: 2, background: `rgba(${config.accentRgb},0.1)`, overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${task.progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: config.accent, borderRadius: 2 }} />
                  </div>
                )}
                {task.status === 'done' && (
                  <div style={{ fontSize: 9, color: '#22c55e' }}>✅ 已生成 {task.outputCount} 道题目 · 点击查看</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
        {[
          { label: '已处理', value: '47', unit: '份' },
          { label: '生成试题', value: '312', unit: '道' },
          { label: '节省时间', value: '86', unit: 'h' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '6px 4px', borderRadius: 8, background: `rgba(${config.accentRgb},0.04)` }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: config.accent, fontFamily: "'Orbitron', sans-serif" }}>{s.value}<span style={{ fontSize: 9, color: config.textSecondary, marginLeft: 1 }}>{s.unit}</span></div>
            <div style={{ fontSize: 8, color: config.textSecondary }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {selectedTool && (
          <UploadModal
            tool={selectedTool}
            config={config}
            onClose={() => setSelectedTool(null)}
            onUpload={(fileName) => handleUpload(selectedTool.id, fileName)}
          />
        )}
      </AnimatePresence>

      {/* Task Result Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskResultModal
            task={selectedTask}
            config={config}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== 增强评估面板（考官评管） ====================
function EnhancedAssessmentPanel({ config }: { config: SkinConfig }) {
  const dimensions = [
    { name: '开场能力', score: 85, trend: 'up' as const },
    { name: '需求挖掘', score: 72, trend: 'down' as const },
    { name: '产品讲解', score: 88, trend: 'up' as const },
    { name: '异议处理', score: 61, trend: 'down' as const },
    { name: '成交推进', score: 78, trend: 'same' as const },
    { name: '情绪管理', score: 83, trend: 'up' as const },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Overall Score */}
      <div style={{ padding: '12px', borderRadius: 12, background: `linear-gradient(135deg, rgba(${config.accentRgb},0.12), rgba(${config.accentRgb},0.04))`, border: `1px solid rgba(${config.accentRgb},0.2)`, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: config.textSecondary, marginBottom: 2 }}>综合评分</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: config.accent, fontFamily: "'Orbitron', sans-serif", lineHeight: 1 }}>78<span style={{ fontSize: 14 }}>分</span></div>
        <div style={{ fontSize: 9, color: '#22c55e', marginTop: 2 }}>↑ 较上次提升 5 分</div>
      </div>

      {/* Dimension Scores */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <BarChart3 size={11} style={{ color: config.textSecondary }} />
          <span style={{ fontSize: 10, color: config.textSecondary, fontWeight: 600 }}>各维度得分</span>
        </div>
        {dimensions.map(d => (
          <div key={d.name} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 10, color: config.textPrimary }}>{d.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: d.score >= 80 ? '#22c55e' : d.score >= 60 ? '#f59e0b' : '#ef4444', fontFamily: "'Orbitron', sans-serif" }}>{d.score}</span>
            </div>
            <div style={{ width: '100%', height: 4, borderRadius: 2, background: `rgba(${config.accentRgb},0.1)` }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${d.score}%` }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ height: '100%', borderRadius: 2, background: d.score >= 80 ? '#22c55e' : d.score >= 60 ? '#f59e0b' : '#ef4444' }} />
            </div>
          </div>
        ))}
      </div>

      {/* AI Evaluation Report */}
      <div style={{ padding: '10px', borderRadius: 10, background: `rgba(${config.accentRgb},0.05)`, border: `1px solid ${config.panelBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <ClipboardList size={11} style={{ color: config.accent }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: config.textPrimary }}>AI教练评价</span>
        </div>
        <div style={{ fontSize: 10, color: config.textPrimary, lineHeight: 1.6 }}>
          本次训练整体表现<strong style={{ color: config.accent }}>良好</strong>。开场和产品讲解环节表现优秀，但
          <strong style={{ color: '#ef4444' }}>异议处理</strong>维度需加强——第3轮未有效回应价格异议，第7轮应对冗长。
          建议：重点训练「价格异议处理」标准话术。
        </div>
      </div>

      {/* Weakness Training CTA */}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        style={{ width: '100%', padding: '8px', borderRadius: 10, background: `linear-gradient(135deg, ${config.gradientFrom}33, ${config.gradientTo}22)`, border: `1px solid ${config.panelBorder}`, color: config.accent, fontSize: 10.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: "'Rajdhani', sans-serif" }}>
        <Sparkles size={11} /> 针对薄弱点开始专项训练
      </motion.button>
    </div>
  );
}

export default function Sidebar({ config }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('wiki');
  const [selectedWiki, setSelectedWiki] = useState<WikiItem | null>(null);

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

      {/* Wiki 详情悬浮面板 */}
      <AnimatePresence>
        {selectedWiki && (
          <WikiDetailPanel
            wiki={selectedWiki}
            config={config}
            onClose={() => setSelectedWiki(null)}
          />
        )}
      </AnimatePresence>

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
              {activeTab === 'wiki' && (
                <WikiPanel
                  config={config}
                  selectedWiki={selectedWiki}
                  onSelectWiki={setSelectedWiki}
                />
              )}
              {activeTab === 'leaderboard' && <LeaderboardPanel config={config} />}
              {activeTab === 'ai' && <EnhancedAssessmentPanel config={config} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
