import type { Building, EventAlert, SkinConfig, Skin } from '../types/game';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import BuildingModal from './BuildingModal';

interface TrainingMapProps {
  buildings: Building[];
  events: EventAlert[];
  config: SkinConfig;
  skin: Skin;
}

function StarRating({ count, total = 3 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <Star key={i} size={8} style={{ color: i < count ? '#fbbf24' : '#374151', fill: i < count ? '#fbbf24' : 'none' }} />
      ))}
    </div>
  );
}

interface BuildingNodeProps {
  building: Building;
  config: SkinConfig;
  onClick: () => void;
}

function BuildingNode({ building, config, onClick }: BuildingNodeProps) {
  const [hovered, setHovered] = useState(false);

  const isCompleted = building.status === 'completed';
  const isInProgress = building.status === 'inprogress';
  const isLocked = building.status === 'locked';

  const sizeMap = { sm: 72, md: 84, lg: 100 };
  const nodeSize = sizeMap[building.size];

  const baseColor = isLocked ? '#1a1f2e' : config.buildingColors[building.id - 1] || config.buildingColors[0];
  const borderColor = isLocked
    ? 'rgba(107,114,128,0.3)'
    : isCompleted
    ? config.accent
    : `rgba(${config.accentRgb},0.6)`;
  const glowColor = isLocked ? 'none' : `0 0 ${hovered ? 24 : 12}px rgba(${config.accentRgb},${isCompleted ? 0.5 : 0.3})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${building.position.x}%`,
        top: `${building.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: hovered ? 20 : 10,
      }}
    >
      {/* Breathing ring for in-progress */}
      {isInProgress && (
        <>
          <div style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            border: `2px solid rgba(${config.accentRgb},0.6)`,
            animation: 'breathe-ring 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            inset: -16,
            borderRadius: '50%',
            border: `1px solid rgba(${config.accentRgb},0.3)`,
            animation: 'breathe-ring 2s ease-in-out infinite 0.5s',
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Ground glow */}
      {!isLocked && (
        <div style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: nodeSize * 0.8,
          height: 12,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(${config.accentRgb},0.4), transparent)`,
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }} />
      )}

      <motion.div
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={!isLocked ? onClick : undefined}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          width: nodeSize,
          height: nodeSize + 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          cursor: isLocked ? 'default' : 'pointer',
        }}
      >
        {/* Building body */}
        <div style={{
          width: nodeSize,
          height: nodeSize,
          borderRadius: 14,
          background: `linear-gradient(145deg, ${baseColor}f0, ${baseColor}cc)`,
          border: `1.5px solid ${borderColor}`,
          boxShadow: glowColor,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          position: 'relative',
          overflow: 'hidden',
          filter: isLocked ? 'grayscale(0.7) brightness(0.7)' : 'none',
          transition: 'box-shadow 0.3s',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: isLocked
              ? 'rgba(107,114,128,0.5)'
              : `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`,
            borderRadius: '14px 14px 0 0',
          }} />

          {/* Grid pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(${config.accentRgb},0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${config.accentRgb},0.03) 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
            borderRadius: 14,
          }} />

          {/* Icon */}
          <div style={{ fontSize: building.size === 'lg' ? 32 : 26, lineHeight: 1, zIndex: 1 }}>
            {isLocked ? '🔒' : building.emoji}
          </div>

          {/* Building name */}
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: isLocked ? '#6b7280' : config.textPrimary,
            textAlign: 'center',
            lineHeight: 1.2,
            zIndex: 1,
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: '0.02em',
          }}>
            {building.name}
          </div>

          {/* Level badge */}
          <div style={{
            fontSize: 9,
            color: isLocked ? '#6b7280' : config.accent,
            fontFamily: "'Orbitron', sans-serif",
            zIndex: 1,
          }}>
            LV.{building.level}
          </div>

          {/* Stars for completed */}
          {isCompleted && (
            <div style={{ zIndex: 1 }}>
              <StarRating count={building.stars} />
            </div>
          )}

          {/* Scan line animation for completed */}
          {isCompleted && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, rgba(${config.accentRgb},0.8), transparent)`,
              animation: 'scan-line 3s linear infinite',
              opacity: 0.5,
            }} />
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface EventMarkerProps {
  event: EventAlert;
  config: SkinConfig;
  skin: Skin;
  onEnterTraining: () => void;
}

function EventMarker({ event, config, skin, onEnterTraining }: EventMarkerProps) {
  const [expanded, setExpanded] = useState(false);
  const isUrgent = event.deadline === '立即处理';

  return (
    <div style={{
      position: 'absolute',
      left: `${event.position.x}%`,
      top: `${event.position.y}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 30,
    }}>
      {/* Pulsing ring */}
      <div style={{
        position: 'absolute',
        inset: -8,
        borderRadius: '50%',
        background: 'rgba(239,68,68,0.15)',
        animation: 'event-pulse 1.5s ease-in-out infinite',
      }} />

      <motion.div
        whileHover={{ scale: 1.1 }}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #dc2626, #ef4444)',
          border: '2px solid #fca5a5',
          boxShadow: '0 0 16px rgba(239,68,68,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          animation: isUrgent ? 'blink-icon 0.8s ease-in-out infinite' : 'none',
          fontSize: 16,
        }}>
        ⚠️
      </motion.div>

      {/* Tooltip */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 42,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            background: config.panelBg,
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 10,
            padding: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            fontFamily: "'Rajdhani', sans-serif",
          }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>{event.title}</div>
          <div style={{ color: '#d1d5db', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{event.description}</div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'event-pulse 1s infinite' }} />
            <span style={{ color: '#fca5a5', fontSize: 10 }}>{event.deadline}</span>
          </div>
          <button onClick={() => { setExpanded(false); onEnterTraining(); }} style={{
            marginTop: 8,
            width: '100%',
            padding: '4px 0',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5',
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
          }}>
            立即进入限时突发件训练 →
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default function TrainingMap({ buildings, events, config, skin }: TrainingMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  const handleEventTraining = () => {
    const eventId = skin === 'finance' ? 'card-3' : 'card-3';
    navigate(`/training/${eventId}?skin=${skin}`);
  };

  // Generate SVG path connections
  const connections = buildings.slice(0, -1).map((b, i) => {
    const next = buildings[i + 1];
    const isActiveConn = b.status !== 'locked';
    return { from: b.position, to: next.position, active: isActiveConn, id: b.id };
  });

  return (
    <>
      <style>{`
        @keyframes breathe-ring {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes event-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes blink-icon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px) scale(1.2); opacity: 0.8; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
        }
        @keyframes dash-flow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="relative w-full h-full overflow-hidden select-none" style={{ background: config.bg }}>
        
        {/* Background grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(${config.accentRgb},0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${config.accentRgb},0.04) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />

        {/* Radial fog of war overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at 45% 50%, transparent 40%, ${config.bg}99 80%, ${config.bg} 100%)`,
          pointerEvents: 'none',
          zIndex: 5,
        }} />

        {/* Ambient glow center */}
        <div style={{
          position: 'absolute',
          left: '40%',
          top: '40%',
          width: 400,
          height: 300,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse, rgba(${config.accentRgb},0.06), transparent)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: i % 2 === 0 ? 3 : 2,
            height: i % 2 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: config.accent,
            opacity: 0.3,
            animation: `float-particle ${3 + i * 0.7}s ease-in-out infinite ${i * 0.4}s`,
          }} />
        ))}

        {/* SVG connections */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 8 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`pathGrad-${config.accent}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.gradientFrom} stopOpacity="0.8" />
              <stop offset="100%" stopColor={config.gradientTo} stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {connections.map(conn => {
            const midX = (conn.from.x + conn.to.x) / 2;
            const midY = (conn.from.y + conn.to.y) / 2 - 6;
            return (
              <g key={conn.id}>
                {/* Shadow path */}
                <path
                  d={`M ${conn.from.x} ${conn.from.y} Q ${midX} ${midY} ${conn.to.x} ${conn.to.y}`}
                  stroke={`rgba(${config.accentRgb},0.08)`}
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Main path */}
                <path
                  d={`M ${conn.from.x} ${conn.from.y} Q ${midX} ${midY} ${conn.to.x} ${conn.to.y}`}
                  stroke={conn.active ? `url(#pathGrad-${config.accent})` : 'rgba(107,114,128,0.25)'}
                  strokeWidth={conn.active ? 0.5 : 0.3}
                  strokeDasharray={conn.active ? 'none' : '1.5,1.5'}
                  fill="none"
                  style={conn.active ? { animation: 'dash-flow 2s linear infinite' } : {}}
                />
                {/* Path glow for active */}
                {conn.active && (
                  <path
                    d={`M ${conn.from.x} ${conn.from.y} Q ${midX} ${midY} ${conn.to.x} ${conn.to.y}`}
                    stroke={`rgba(${config.accentRgb},0.15)`}
                    strokeWidth="1.5"
                    fill="none"
                    style={{ filter: 'blur(1px)' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Zoomable map content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease',
          zIndex: 9,
        }}>
          {/* Building nodes */}
          {buildings.map(building => (
            <BuildingNode
              key={building.id}
              building={building}
              config={config}
              onClick={() => setSelectedBuilding(building)}
            />
          ))}

          {/* Event markers */}
          {events.map(event => (
            <EventMarker key={event.id} event={event} config={config} skin={skin} onEnterTraining={handleEventTraining} />
          ))}
        </div>

        {/* Map label */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 16,
          zIndex: 15,
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 10,
          color: `rgba(${config.accentRgb},0.5)`,
          letterSpacing: '0.15em',
          fontWeight: 700,
        }}>
          {config.mapName.toUpperCase()} · TRAINING MAP
        </div>

        {/* Zoom controls */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {[
            { icon: <ZoomIn size={13} />, action: () => setZoom(z => Math.min(z + 0.1, 1.5)) },
            { icon: <Maximize2 size={13} />, action: () => setZoom(1) },
            { icon: <ZoomOut size={13} />, action: () => setZoom(z => Math.max(z - 0.1, 0.7)) },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: config.panelBg,
              border: `1px solid ${config.panelBorder}`,
              color: config.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}>
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Progress path labels */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 16,
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          <div style={{
            padding: '3px 10px',
            borderRadius: 20,
            background: config.panelBg,
            border: `1px solid ${config.panelBorder}`,
            backdropFilter: 'blur(8px)',
            fontSize: 11,
            color: config.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{ width: 20, height: 2, background: `linear-gradient(90deg, ${config.gradientFrom}, ${config.gradientTo})`, borderRadius: 1 }} />
            已解锁路径
            <svg width="20" height="2" style={{ display: 'block' }}>
              <line x1="0" y1="1" x2="20" y2="1" stroke="rgba(107,114,128,0.5)" strokeWidth="1.5" strokeDasharray="3,2" />
            </svg>
            锁定路径
          </div>
        </div>

        {/* Building modal */}
        <AnimatePresence>
          {selectedBuilding && (
            <BuildingModal
              key="modal"
              building={selectedBuilding}
              config={config}
              skin={skin}
              onClose={() => setSelectedBuilding(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}