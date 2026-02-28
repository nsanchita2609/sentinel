import { useState, useEffect } from 'react';

interface TickerProps {
  healedCount: number;
  complaintsBlocked: number;
}

const StatsTicker = ({ healedCount, complaintsBlocked }: TickerProps) => {
  const [upiRate, setUpiRate] = useState(7000);

  useEffect(() => {
    const interval = setInterval(() => {
      setUpiRate(prev => prev + Math.floor(Math.random() * 20 - 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const text = `UPI Transactions Monitored: ${upiRate.toLocaleString()}/sec   ◆   ATMs Self-Healed Today: ${healedCount}   ◆   Avg Diagnosis Time: 2.3 seconds   ◆   Complaints Prevented: ${complaintsBlocked.toLocaleString()}`;

  return (
    <div className="ticker-bar border-b border-border h-9 flex items-center overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="font-mono text-xs tracking-wider text-primary mx-8">{text}</span>
        <span className="font-mono text-xs tracking-wider text-primary mx-8">{text}</span>
      </div>
    </div>
  );
};

export default StatsTicker;
