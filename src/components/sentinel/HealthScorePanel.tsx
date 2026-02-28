import type { ATMNode } from '@/hooks/useSentinelData';
import { motion } from 'framer-motion';

interface HealthScorePanelProps {
  atms: ATMNode[];
}

const HealthScorePanel = ({ atms }: HealthScorePanelProps) => {
  const sorted = [...atms].sort((a, b) => a.healthScore - b.healthScore).slice(0, 10);

  const scoreColor = (score: number) => {
    if (score < 30) return 'bg-destructive';
    if (score < 60) return 'bg-warning';
    return 'bg-success';
  };

  const scoreTextColor = (score: number) => {
    if (score < 30) return 'text-destructive';
    if (score < 60) return 'text-warning';
    return 'text-success';
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <span className="text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded-full">HEALTHY</span>;
      case 'at-risk': return <span className="text-[9px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full">AT RISK</span>;
      case 'failed': return <span className="text-[9px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full">FAILED</span>;
      default: return null;
    }
  };

  return (
    <div className="sentinel-panel h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          Health Scores — Lowest 10
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1.5">
        {sorted.map((atm, i) => (
          <div key={atm.atmId + i} className="flex items-center gap-3 py-1.5 px-2 bg-secondary/20 rounded-md">
            <span className="font-mono text-[10px] text-primary w-14 shrink-0">ATM {atm.atmId}</span>
            <span className="text-[10px] text-muted-foreground w-16 shrink-0">{atm.city}</span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${scoreColor(atm.healthScore)}`}
                initial={{ width: 0 }}
                animate={{ width: `${atm.healthScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className={`font-mono text-[10px] w-8 text-right ${scoreTextColor(atm.healthScore)}`}>
              {atm.healthScore}
            </span>
            {statusBadge(atm.status)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthScorePanel;
