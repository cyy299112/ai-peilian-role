import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import type { Skin } from '../types/game';
import { skinConfigs, financeBuildings, energyBuildings, financeEvents, energyEvents, financeTaskCards, energyTaskCards } from '../data/gameData';
import TopStatusBar from '../components/TopStatusBar';
import TrainingMap from '../components/TrainingMap';
import BottomDock from '../components/BottomDock';
import Sidebar from '../components/Sidebar';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [skin, setSkin] = useState<Skin>((searchParams.get('skin') || 'finance') as Skin);
  const [ready, setReady] = useState(false);

  const config = skinConfigs[skin];
  const buildings = skin === 'finance' ? financeBuildings : energyBuildings;
  const events = skin === 'finance' ? financeEvents : energyEvents;
  const taskCards = skin === 'finance' ? financeTaskCards : energyTaskCards;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

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
          style={{ width: '100vw', height: '100vh', background: config.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(${config.accentRgb},0.04), transparent)`, pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <TopStatusBar skin={skin} config={config} onSkinChange={setSkin} />
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
            <BottomDock taskCards={taskCards} config={config} skin={skin} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
