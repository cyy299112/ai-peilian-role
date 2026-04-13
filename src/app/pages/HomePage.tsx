import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import type { Skin, Building, SkinConfig } from '../types/game';
import { skinConfigs, financeBuildings, energyBuildings, financeEvents, energyEvents, financeTaskCards, energyTaskCards } from '../data/gameData';
import TopStatusBar from '../components/TopStatusBar';
import TrainingMap from '../components/TrainingMap';
import BottomDock from '../components/BottomDock';
import Sidebar from '../components/Sidebar';
import LeftNav, { MainTab } from '../components/LeftNav';
import { PPTExtractIcon, QuizGenIcon, MindMapIcon, TranscriptIcon, PPTGenIcon } from '../components/AIToolIcons';

// 加载状态组件
function LoadingState({ config, message }: { config: SkinConfig; message: string }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: config.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 20,
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: `3px solid rgba(${config.accentRgb},0.1)`,
          borderTop: `3px solid ${config.accent}`,
        }}
      />
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        color: config.accent,
        fontSize: 13,
        letterSpacing: '0.15em',
      }}>
        {message}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [skin, setSkin] = useState<Skin>((searchParams.get('skin') || 'finance') as Skin);
  const [ready, setReady] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>('training');
  const [isTabLoading, setIsTabLoading] = useState(false);

  const [buildingStatuses, setBuildingStatuses] = useState<Record<string, Building[]>>({
    finance: [...financeBuildings],
    energy: [...energyBuildings],
  });

  const config = skinConfigs[skin];
  const buildings = buildingStatuses[skin];
  const events = skin === 'finance' ? financeEvents : energyEvents;
  const taskCards = skin === 'finance' ? financeTaskCards : energyTaskCards;

  useEffect(() => {
    const checkUnlockStatus = () => {
      const lv3Completed = localStorage.getItem(`building-3-${skin}-completed`);
      if (lv3Completed === 'true') {
        setBuildingStatuses(prev => {
          const currentBuildings = [...prev[skin]];
          const lv4Index = currentBuildings.findIndex(b => b.level === 4);
          if (lv4Index !== -1 && currentBuildings[lv4Index].status === 'locked') {
            currentBuildings[lv4Index] = { ...currentBuildings[lv4Index], status: 'inprogress' };
            return { ...prev, [skin]: currentBuildings };
          }
          return prev;
        });
      }
    };

    checkUnlockStatus();
    window.addEventListener('storage', checkUnlockStatus);
    return () => window.removeEventListener('storage', checkUnlockStatus);
  }, [skin]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 处理Tab切换，添加加载状态
  const handleTabChange = (tab: MainTab) => {
    if (tab === mainTab) return;
    setIsTabLoading(true);
    setMainTab(tab);
    // 模拟加载延迟
    setTimeout(() => {
      setIsTabLoading(false);
    }, 400);
  };

  if (!ready) {
    return (
      <div style={{
        width: '100vw', height: '100vh', background: '#050c1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", color: '#00d4ff', fontSize: 14, letterSpacing: '0.2em' }}>
          LOADING TRAINING MAP...
        </div>
        <div style={{ width: 200, height: 2, background: 'rgba(0,212,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg,#00d4ff,#0066ff)', borderRadius: 1 }}
            initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; font-family: 'Rajdhani', 'Noto Sans SC', sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(${config.accentRgb},0.3); border-radius: 2px; }
      `}</style>
      <AnimatePresence mode="wait">
        <motion.div key={skin} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          style={{ width: '100vw', height: '100vh', background: config.bg, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(${config.accentRgb},0.04), transparent)`, pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none', zIndex: 1 }} />
          
          {/* Left Navigation */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <LeftNav activeTab={mainTab} onTabChange={handleTabChange} config={config} />
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', zIndex: 2 }}>
            <TopStatusBar skin={skin} config={config} onSkinChange={setSkin} />

            {isTabLoading ? (
              <LoadingState config={config} message={mainTab === 'training' ? 'LOADING TRAINING MAP...' : mainTab === 'knowledge' ? 'LOADING KNOWLEDGE CENTER...' : 'LOADING AI WORKSHOP...'} />
            ) : (
              <AnimatePresence mode="wait">
                {mainTab === 'training' && (
                  <motion.div key="training" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
                      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <AnimatePresence mode="wait">
                          <motion.div key={skin + '-map'} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5 }} style={{ width: '100%', height: '100%' }}>
                            <TrainingMap buildings={buildings} events={events} config={config} skin={skin} />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <Sidebar config={config} />
                    </div>
                    <BottomDock config={config} skin={skin} taskCards={taskCards} />
                  </motion.div>
                )}

                {mainTab === 'knowledge' && (
                  <motion.div key="knowledge" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                    style={{ flex: 1, display: 'flex', overflow: 'auto', padding: '24px 32px', scrollbarWidth: 'thin', scrollbarColor: `rgba(${config.accentRgb},0.2) transparent` }}>
                    <KnowledgePageContent config={config} />
                  </motion.div>
                )}

                {mainTab === 'workshop' && (
                  <motion.div key="workshop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                    style={{ flex: 1, display: 'flex', overflow: 'auto', padding: '24px 32px', scrollbarWidth: 'thin', scrollbarColor: `rgba(${config.accentRgb},0.2) transparent` }}>
                    <WorkshopPageContent config={config} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// 知识中心页面内容
function KnowledgePageContent({ config }: { config: SkinConfig }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'course' | 'article' | 'video' | 'qa'>('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const knowledgeItems: KnowledgeItem[] = [
    { id: 'k1', title: '理财产品合规销售全流程SOP', type: 'article' as const, icon: 'article', category: '合规手册', views: 1243, tags: ['SOP', '合规', '必读'] },
    { id: 'k2', title: '高净值客户沟通技巧精讲', type: 'video' as const, icon: 'video', category: '话术库', duration: '25分钟', views: 892, tags: ['沟通', '高净值'] },
    { id: 'k3', title: '反洗钱可疑交易识别实操', type: 'course' as const, icon: 'course', category: '公共课室', duration: '40分钟', views: 2341, tags: ['AML', '实操'] },
    { id: 'k4', title: '如何应对"我需要考虑一下"', type: 'article' as const, icon: 'lightbulb', category: '话术库', views: 3102, tags: ['异议处理', '高频'] },
    { id: 'k5', title: '客户情绪管理：从愤怒到满意', type: 'video' as const, icon: 'play', category: '公共课室', duration: '18分钟', views: 1567, tags: ['情绪管理', '投诉'] },
    { id: 'k6', title: 'Q：三年期贷款利率是多少？', type: 'qa' as const, icon: 'qa', category: '问答社区', views: 890, tags: ['利率', '常见问题'] },
    { id: 'k7', title: '数字人民币业务知识速查', type: 'article' as const, icon: 'book', category: '知识检索', views: 4521, tags: ['DCEP', '新产品'] },
    { id: 'k8', title: '信用卡分期话术模板集', type: 'article' as const, icon: 'doc', category: '话术库', views: 2789, tags: ['信用卡', '分期'] },
    { id: 'k9', title: '理财风险评估问卷填写指引', type: 'article' as const, icon: 'chart', category: '合规手册', views: 1876, tags: ['KYC', '风控'] },
    { id: 'k10', title: 'VIP客户维护与关系深化策略', type: 'course' as const, icon: 'target', category: '公共课室', duration: '30分钟', views: 3201, tags: ['VIP', '关系维护'] },
  ];

  const filtered = knowledgeItems.filter(k => {
    const matchSearch = k.title.toLowerCase().includes(search.toLowerCase()) || k.tags.some(t => t.includes(search));
    const matchFilter = activeFilter === 'all' || k.type === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', fontFamily: "'Rajdhani', sans-serif" }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 22, fontWeight: 800, color: config.textPrimary, marginBottom: 24 }}>
        知识中心
      </motion.h1>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索知识、课程、问答..."
          style={{ width: '100%', background: `rgba(${config.accentRgb},0.06)`, border: `1px solid ${config.panelBorder}`, borderRadius: 12, padding: '12px 16px 12px 42px', fontSize: 13, color: config.textPrimary, outline: 'none', fontFamily: "'Rajdhani', sans-serif" }} />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: config.textSecondary, fontSize: 15 }}>🔍</span>
      </div>

      {/* Quick access */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { icon: 'course', label: '公共课室', count: '12门课程', desc: '系统内置培训课件', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
          { icon: 'qa', label: '问答社区', count: '89条问答', desc: '员工经验共享交流', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
          { icon: 'search', label: '知识检索', count: '200+ 条目', desc: '全文+语义智能搜索', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
          { icon: 'live', label: '专家直播', count: '进行中', desc: '大规模精准培训', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
        ].map(card => (
          <motion.div key={card.label} whileHover={{ scale: 1.03, y: -2 }}
            style={{ padding: '16px', borderRadius: 14, background: `rgba(${config.accentRgb},0.05)`, border: `1px solid ${config.panelBorder}`, cursor: 'pointer', textAlign: 'center' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: card.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
            }}>
              {card.icon === 'course' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              )}
              {card.icon === 'qa' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              )}
              {card.icon === 'search' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
              {card.icon === 'live' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: config.textPrimary, marginTop: 10 }}>{card.label}</div>
            <div style={{ fontSize: 11, color: card.color, fontWeight: 600, marginTop: 2 }}>{card.count}</div>
            <div style={{ fontSize: 9, color: config.textSecondary, marginTop: 4 }}>{card.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: `1px solid ${config.panelBorder}`, paddingBottom: 10 }}>
        {[
          { id: 'all', label: '全部' },
          { id: 'course', label: '课程' },
          { id: 'article', label: '文章' },
          { id: 'video', label: '视频' },
          { id: 'qa', label: '问答' },
        ].map(f => (
          <button key={f.id}
            onClick={() => setActiveFilter(f.id as typeof activeFilter)}
            style={{ fontSize: 11, padding: '6px 14px', borderRadius: 20, border: `1px solid ${activeFilter === f.id ? config.accent : config.panelBorder}`, background: activeFilter === f.id ? `rgba(${config.accentRgb},0.12)` : 'transparent', color: activeFilter === f.id ? config.accent : config.textSecondary, cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, transition: 'all 0.2s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 12 }}>
        {filtered.map(item => (
          <motion.div key={item.id} whileHover={{ y: -2, boxShadow: `0 8px 24px rgba(0,0,0,0.2)` }}
            onClick={() => setSelectedItem(item)}
            style={{ padding: '16px', borderRadius: 14, background: `rgba(${config.accentRgb},0.04)`, border: `1px solid ${config.panelBorder}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <StyledIcon type={item.type} icon={item.icon} config={config} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: config.textPrimary, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, background: `rgba(${config.accentRgb},0.1)`, color: config.accent, border: `1px solid rgba(${config.accentRgb},0.2)` }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: config.textSecondary }}>
                  <span>{item.category}</span>
                  {item.duration && <>· <span>{item.duration}</span></>}
                  <>· <span>{item.views}次浏览</span></>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: config.textSecondary }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, rgba(${config.accentRgb},0.2), rgba(${config.accentRgb},0.05))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: `1px solid rgba(${config.accentRgb},0.2)`,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={config.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div style={{ fontSize: 14 }}>未找到相关知识内容</div>
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

// 知识详情弹窗组件
interface KnowledgeItem {
  id: string;
  title: string;
  type: 'course' | 'article' | 'video' | 'qa';
  icon: string;
  category: string;
  views: number;
  tags: string[];
  duration?: string;
}

// 风格化图标组件
function StyledIcon({ type, icon, config }: { type: string; icon: string; config: SkinConfig }) {
  const iconConfigs: Record<string, { gradient: string; icon: React.ReactNode }> = {
    article: {
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    video: {
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      ),
    },
    course: {
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    lightbulb: {
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2v1" />
          <path d="M12 7a5 5 0 0 1 5 5c0 2-1 3-2 4s-2 2-2 4h-2c0-2-1-3-2-4s-2-2-2-4a5 5 0 0 1 5-5z" />
        </svg>
      ),
    },
    play: {
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="white" />
        </svg>
      ),
    },
    qa: {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    book: {
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    doc: {
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    chart: {
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    target: {
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
  };

  const iconConfig = iconConfigs[icon] || iconConfigs.article;

  return (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: 12,
      background: iconConfig.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
      flexShrink: 0,
    }}>
      {iconConfig.icon}
    </div>
  );
}

function KnowledgeDetailModal({ item, config, onClose }: { item: KnowledgeItem; config: SkinConfig; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // 模拟播放进度
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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

本文所述业务流程是指...

二、操作规范与要求

1. 首先需要进行客户身份核实
2. 其次要详细了解客户需求
3. 最后提供专业的解决方案

三、常见问题与解答

Q: 如何处理特殊情况？
A: 建议按照标准流程操作，如有疑问及时向上级汇报。

四、注意事项

• 严格遵守合规要求
• 保护客户隐私信息
• 及时更新业务知识`,
        };
      case 'video':
        return {
          intro: '本视频通过真实场景演示，帮助您快速掌握关键技能。建议在安静环境下观看。',
        };
      case 'qa':
        return {
          intro: '这里汇集了常见问题及专业解答，帮助您快速解决工作中的疑惑。',
          qas: [
            { q: item.title.replace('Q：', ''), a: '根据相关规定，建议按照标准流程处理。具体操作步骤如下：\n\n1. 核实客户身份信息\n2. 了解具体需求\n3. 提供合规的解决方案\n\n如有特殊情况，请及时向上级汇报。' },
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
            <StyledIcon type={item.type} icon={item.icon} config={config} />
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
            ✕
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
                ⏱ {item.duration}
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
          {item.type === 'course' && 'sections' in content && content.sections && (
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
                        <span style={{ color: '#22c55e' }}>✓</span>
                      ) : (
                        <span style={{ color: config.accent }}>▶</span>
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
          {item.type === 'article' && 'content' in content && content.content && (
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
                      fontSize: 24,
                    }}
                  >
                    ▶
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
                    <span style={{ fontSize: 48, marginBottom: 12 }}>🎉</span>
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
          {item.type === 'qa' && 'qas' in content && content.qas && (
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
                ▶ 开始学习
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
                }}
              >
                ✓ 已完成
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

// AI工具/资源工坊页面内容
function WorkshopPageContent({ config }: { config: SkinConfig }) {
  const [tasks, setTasks] = useState<{ id: string; name: string; status: 'processing' | 'done'; progress?: number; outputCount?: number }[]>([]);
  const [selectedTool, setSelectedTool] = useState<typeof tools[0] | null>(null);
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);

  const tools = [
    { id: 'ppt', icon: <PPTExtractIcon size={28} />, label: 'PPT试题抽取', desc: '上传PPT文件，AI自动解析每页内容并生成练习题（选择题/判断题/填空题）', color: '#ef4444', features: ['自动解析页面结构', '智能生成试题选项', '支持手动编辑调整', '关联知识点标签'] },
    { id: 'quiz', icon: <QuizGenIcon size={28} />, label: '智能出题', desc: '输入主题或上传文档，AI生成思维导图并扩展为完整试题库', color: '#3b82f6', features: ['文档→思维导图可视化', '多题型自动生成', '难度分级（初/中/高）', '审核流程管理'] },
    { id: 'mindmap', icon: <MindMapIcon size={28} />, label: '思维导图生成', desc: '将复杂文档内容转化为清晰的知识结构图谱', color: '#22c55e', features: ['一键生成导图结构', '节点可编辑展开', '导出PNG/SVG/PDF', '知识点关联推荐'] },
    { id: 'transcript', icon: <TranscriptIcon size={28} />, label: '视频/音频转写', desc: '上传录音或视频文件，ASR转文字并提取关键信息', color: '#f59e0b', features: ['语音识别转文字', '说话人分离标注', '关键信息提取', '对话轮次拆分'] },
    { id: 'pptgen', icon: <PPTGenIcon size={28} />, label: 'PPT课件生成', desc: '基于大纲或文档自动生成精美培训课件', color: '#8b5cf6', features: ['自动排版配图', '多种风格模板', '数字人配音视频', '一键导出使用'] },
  ];

  const handleToolClick = (tool: typeof tools[0]) => {
    setSelectedTool(tool);
  };

  const handleStartProcessing = (fileName: string) => {
    if (!selectedTool) return;
    
    const newTask = { 
      id: Date.now().toString(), 
      name: `${selectedTool.label} - ${fileName}`, 
      status: 'processing' as const, 
      progress: 0 
    };
    setTasks(prev => [newTask, ...prev]);
    setSelectedTool(null);
    
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'done' as const, progress: 100, outputCount: Math.floor(Math.random() * 12 + 3) } : t));
      } else {
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, progress: Math.min(p, 99) } : t));
      }
    }, 350);
  };

  return (
    <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', fontFamily: "'Rajdhani', sans-serif" }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 22, fontWeight: 800, color: config.textPrimary, marginBottom: 24 }}>
        AI工具
      </motion.h1>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: '已处理文件', value: '47', unit: '份', icon: 'folder', color: '#3b82f6' },
          { label: '生成试题', value: '312', unit: '道', icon: 'quiz', color: '#22c55e' },
          { label: '思维导图', value: '23', unit: '张', icon: 'mindmap', color: '#f59e0b' },
          { label: '转写时长', value: '156', unit: 'h', icon: 'audio', color: '#ef4444' },
          { label: '节省时间', value: '86', unit: 'h', icon: 'time', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '14px 10px', borderRadius: 14, background: `linear-gradient(135deg, rgba(${config.accentRgb},0.08), rgba(${config.accentRgb},0.02))`, border: `1px solid ${config.panelBorder}` }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${s.color}20, ${s.color}10)`,
              border: `1px solid ${s.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}>
              {s.icon === 'folder' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              )}
              {s.icon === 'quiz' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              )}
              {s.icon === 'mindmap' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              {s.icon === 'audio' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M8 6v4M16 6v4M6 10v4M18 10v4M12 14v4M8 18v4M16 18v4" />
                </svg>
              )}
              {s.icon === 'time' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              )}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: config.accent, fontFamily: "'Orbitron', sans-serif", lineHeight: 1.2, marginTop: 8 }}>{s.value}<span style={{ fontSize: 10, color: config.textSecondary, marginLeft: 2 }}>{s.unit}</span></div>
            <div style={{ fontSize: 9, color: config.textSecondary, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>
        {tools.map(tool => (
          <motion.div key={tool.id} whileHover={{ y: -3, boxShadow: `0 12px 32px rgba(0,0,0,0.25)` }}
            onClick={() => handleToolClick(tool)}
            style={{ padding: '20px', borderRadius: 16, background: `rgba(${config.accentRgb},0.04)`, border: `1px solid ${config.panelBorder}`, cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tool.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: config.textPrimary }}>{tool.label}</div>
                <div style={{ fontSize: 10, color: tool.color, fontWeight: 600, marginTop: 2 }}>点击开始处理 →</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: config.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{tool.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tool.features.map(f => (
                <span key={f} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: `${tool.color}12`, color: tool.color, border: `1px solid ${tool.color}25` }}>{f}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Processing Tasks */}
      {tasks.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: config.textPrimary, margin: 0 }}>⚡ 加工任务队列</h3>
            <span style={{ fontSize: 10, color: config.textSecondary }}>{tasks.length} 个任务</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 10 }}>
            {tasks.slice(0, 6).map(task => (
              <motion.div 
                key={task.id} 
                whileHover={{ x: 3 }}
                onClick={() => task.status === 'done' && setSelectedTask(task)}
                style={{ 
                  padding: '14px 16px', 
                  borderRadius: 12, 
                  background: task.status === 'done' ? 'rgba(34,197,94,0.06)' : `rgba(${config.accentRgb},0.05)`, 
                  border: `1px solid ${task.status === 'done' ? 'rgba(34,197,94,0.2)' : config.panelBorder}`,
                  cursor: task.status === 'done' ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: config.textPrimary }}>{task.name}</span>
                  {task.status === 'processing'
                    ? <span style={{ fontSize: 11, color: config.accent, fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>{Math.round(task.progress || 0)}%</span>
                    : <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>✅ 完成</span>}
                </div>
                {task.status === 'processing' && (
                  <div style={{ width: '100%', height: 4, borderRadius: 2, background: `rgba(${config.accentRgb},0.1)`, overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${task.progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`, borderRadius: 2 }} />
                  </div>
                )}
                {task.status === 'done' && (
                  <div style={{ fontSize: 11, color: '#22c55e' }}>已生成 {task.outputCount} 道题目 · 点击查看详情</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Upload Modal */}
      <AnimatePresence>
        {selectedTool && (
          <ToolUploadModal
            tool={selectedTool}
            config={config}
            onClose={() => setSelectedTool(null)}
            onUpload={handleStartProcessing}
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

// 工具上传弹窗
function ToolUploadModal({ tool, config, onClose, onUpload }: { tool: { id: string; icon: React.ReactNode; label: string; desc: string; color: string; features: string[] }; config: SkinConfig; onClose: () => void; onUpload: (fileName: string) => void }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = () => {
    const mockFiles = ['培训材料.pptx', '产品手册.docx', '合规指南.pdf', '案例集.docx'];
    setSelectedFile(mockFiles[Math.floor(Math.random() * mockFiles.length)]);
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            ✕
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
            <div style={{ fontSize: 48, marginBottom: 16 }}>📤</div>
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
              <span style={{ fontSize: 20 }}>📄</span>
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
              onClick={() => selectedFile && onUpload(selectedFile)}
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

// 任务结果弹窗
function TaskResultModal({ task, config, onClose }: { task: { id: string; name: string; status: 'processing' | 'done'; progress?: number; outputCount?: number }; config: SkinConfig; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'download'>('preview');

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
            <span style={{ fontSize: 28, color: '#22c55e' }}>✓</span>
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
            ✕
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
