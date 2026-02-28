import type { ATMNode } from '@/hooks/useSentinelData';
import { Shield, Activity, AlertTriangle, XCircle } from 'lucide-react';
import type { ATMEvent } from '@/hooks/useSentinelData';

interface SidebarProps {
  totalATMs: number;
  healthyCount: number;
  atRiskCount: number;
  failedCount: number;
  events: ATMEvent[];
}

const SentinelSidebar = ({ totalATMs, healthyCount, atRiskCount, failedCount, events }: SidebarProps) => {
  const recentAlerts = events.filter(e => e.status === 'failed').slice(0, 5);

  return (
    <div className="w-[260px] min-w-[260px] bg-sidebar border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-primary tracking-tight">SENTINEL AI</h1>
        </div>
        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
          Never Sleeps. Always Watching.
        </p>
      </div>

      {/* System Status */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-xs font-medium text-success">SYSTEM OPERATIONAL</span>
        </div>
      </div>

      {/* Count Cards */}
      <div className="p-4 space-y-2 border-b border-border">
        <CountCard label="Total ATMs Monitored" value={totalATMs} icon={<Activity className="w-3.5 h-3.5" />} color="text-foreground" />
        <CountCard label="Healthy" value={healthyCount} icon={<Activity className="w-3.5 h-3.5" />} color="text-success" />
        <CountCard label="At Risk" value={atRiskCount} icon={<AlertTriangle className="w-3.5 h-3.5" />} color="text-warning" />
        <CountCard label="Failed" value={failedCount} icon={<XCircle className="w-3.5 h-3.5" />} color="text-destructive" />
      </div>

      {/* Recent Alerts */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3">
          <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">Recent Alerts</h3>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4 space-y-2">
          {recentAlerts.length === 0 && (
            <p className="text-xs text-muted-foreground">No recent alerts</p>
          )}
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="bg-secondary/50 rounded-md p-2.5 border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-primary">ATM {alert.atmId}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                  alert.severity === 'warning' ? 'bg-warning/20 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>{alert.severity.toUpperCase()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{alert.city} — {alert.failureType}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {alert.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function CountCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-secondary/40 rounded-md p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-lg font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}

export default SentinelSidebar;
