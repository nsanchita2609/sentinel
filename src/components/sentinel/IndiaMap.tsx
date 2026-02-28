import { useState } from 'react';
import type { ATMNode } from '@/hooks/useSentinelData';
import { motion, AnimatePresence } from 'framer-motion';

interface IndiaMapProps {
  atms: ATMNode[];
  onSelectATM?: (atm: ATMNode) => void;
}

// Simplified India outline as SVG path
const INDIA_PATH = "M 200,30 L 220,25 240,30 255,45 270,40 285,50 290,65 280,80 290,95 300,100 310,115 305,130 310,145 320,155 325,170 320,185 325,200 330,215 335,230 340,250 335,270 325,285 315,300 320,320 310,340 300,355 290,370 280,380 265,390 250,395 240,400 230,410 220,420 210,430 200,435 190,430 175,420 160,410 150,400 140,390 130,380 120,375 110,365 105,350 100,335 95,320 90,305 85,290 80,275 75,260 80,245 85,230 90,215 95,200 90,185 95,170 105,155 115,145 120,130 115,115 110,100 115,85 125,70 140,60 155,50 170,40 185,35 Z";

// Map lat/lng to SVG coordinates (approximate projection for India)
function projectToSVG(lat: number, lng: number): { x: number; y: number } {
  // India bounds: lat 8-35, lng 68-97
  const x = 60 + ((lng - 68) / (97 - 68)) * 300;
  const y = 420 - ((lat - 8) / (35 - 8)) * 410;
  return { x, y };
}

const IndiaMap = ({ atms, onSelectATM }: IndiaMapProps) => {
  const [hoveredATM, setHoveredATM] = useState<ATMNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const statusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'hsl(var(--success))';
      case 'at-risk': return 'hsl(var(--warning))';
      case 'failed': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div className="sentinel-panel h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          Network Topology — India
        </h2>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-4">
        <svg viewBox="40 10 360 440" className="w-full h-full max-h-[400px]" style={{ filter: 'drop-shadow(0 0 8px hsl(155 30% 20% / 0.5))' }}>
          {/* India outline */}
          <path
            d={INDIA_PATH}
            fill="hsl(155, 25%, 12%)"
            stroke="hsl(155, 20%, 25%)"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* Grid lines */}
          {[100, 200, 300].map(y => (
            <line key={`h${y}`} x1="60" y1={y} x2="360" y2={y} stroke="hsl(155,15%,18%)" strokeWidth="0.3" strokeDasharray="4,4" />
          ))}
          {[120, 200, 280].map(x => (
            <line key={`v${x}`} x1={x} y1="20" x2={x} y2="430" stroke="hsl(155,15%,18%)" strokeWidth="0.3" strokeDasharray="4,4" />
          ))}

          {/* ATM dots */}
          {atms.map((atm) => {
            const { x, y } = projectToSVG(atm.lat, atm.lng);
            const color = statusColor(atm.status);
            return (
              <g key={atm.atmId}>
                {atm.status === 'failed' && (
                  <circle cx={x} cy={y} r="8" fill={color} opacity="0.2">
                    <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={color}
                  stroke="hsl(155, 30%, 8%)"
                  strokeWidth="1.5"
                  className="cursor-pointer"
                  onMouseEnter={() => { setHoveredATM(atm); setTooltipPos({ x, y }); }}
                  onMouseLeave={() => setHoveredATM(null)}
                  onClick={() => onSelectATM?.(atm)}
                  style={{ filter: atm.status === 'failed' ? `drop-shadow(0 0 4px ${color})` : undefined }}
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredATM && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bg-popover border border-border rounded-lg p-3 shadow-xl pointer-events-none z-10"
              style={{
                left: '50%',
                top: '20%',
                transform: 'translate(-50%, 0)',
              }}
            >
              <p className="text-xs font-mono text-primary font-bold">ATM {hoveredATM.atmId}</p>
              <p className="text-[10px] text-muted-foreground">{hoveredATM.city}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-medium ${
                  hoveredATM.status === 'healthy' ? 'text-success' :
                  hoveredATM.status === 'at-risk' ? 'text-warning' :
                  'text-destructive'
                }`}>
                  {hoveredATM.status.toUpperCase()}
                </span>
                <span className="text-[10px] text-muted-foreground">Score: {hoveredATM.healthScore}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IndiaMap;
