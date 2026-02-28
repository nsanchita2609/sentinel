import { useSentinelData } from '@/hooks/useSentinelData';
import StatsTicker from '@/components/sentinel/StatsTicker';
import SentinelSidebar from '@/components/sentinel/SentinelSidebar';
import IndiaMap from '@/components/sentinel/IndiaMap';
import LiveFailureFeed from '@/components/sentinel/LiveFailureFeed';
import HealthScorePanel from '@/components/sentinel/HealthScorePanel';
import PredictionPanel from '@/components/sentinel/PredictionPanel';
import AIResolutionBox from '@/components/sentinel/AIResolutionBox';

const Index = () => {
  const data = useSentinelData();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Stats Ticker */}
      <StatsTicker healedCount={data.healedCount} complaintsBlocked={data.complaintsBlocked} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SentinelSidebar
          totalATMs={data.totalATMs}
          healthyCount={data.healthyCount}
          atRiskCount={data.atRiskCount}
          failedCount={data.failedCount}
          events={data.events}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-3 gap-3">
          {/* Top Row */}
          <div className="flex gap-3 flex-1 min-h-0" style={{ flex: '5 1 0' }}>
            <div className="flex-[3] min-w-0">
              <IndiaMap atms={data.atms} />
            </div>
            <div className="flex-[2] min-w-0">
              <LiveFailureFeed events={data.events} />
            </div>
          </div>

          {/* Middle Row */}
          <div className="flex gap-3 flex-1 min-h-0" style={{ flex: '4 1 0' }}>
            <div className="flex-[3] min-w-0">
              <HealthScorePanel atms={data.atms} />
            </div>
            <div className="flex-[2] min-w-0">
              <PredictionPanel failedCount={data.failedCount} atRiskCount={data.atRiskCount} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="min-h-0" style={{ flex: '3 1 0' }}>
            <AIResolutionBox events={data.events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
