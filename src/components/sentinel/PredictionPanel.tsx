import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ATMNode } from '@/hooks/useSentinelData';

interface PredictionPanelProps {
  failedCount: number;
  atRiskCount: number;
}

const FAILURE_DATA = [
  { name: 'Network Timeout', value: 35, color: 'hsl(var(--warning))' },
  { name: 'Hardware Fault', value: 25, color: 'hsl(var(--destructive))' },
  { name: 'Software Crash', value: 20, color: 'hsl(var(--primary))' },
  { name: 'Cash Depletion', value: 12, color: 'hsl(var(--muted-foreground))' },
  { name: 'Server Overload', value: 8, color: 'hsl(var(--success))' },
];

const PredictionPanel = ({ failedCount, atRiskCount }: PredictionPanelProps) => {
  const flagged = failedCount + atRiskCount;

  return (
    <div className="sentinel-panel h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          Predictive Analytics
        </h2>
      </div>
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="text-center mb-3">
          <span className="text-3xl font-bold font-mono text-primary">{flagged}</span>
          <p className="text-[10px] text-muted-foreground mt-1">
            ATMs flagged for intervention in next 4 hours
          </p>
        </div>
        <div className="w-full max-w-[200px] h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={FAILURE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {FAILURE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(155, 30%, 14%)',
                  border: '1px solid hsl(155, 20%, 20%)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: 'hsl(0, 0%, 94%)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full space-y-1 mt-2">
          {FAILURE_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-mono text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;
