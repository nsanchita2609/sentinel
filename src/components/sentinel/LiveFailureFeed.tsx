import { useEffect, useRef } from 'react';
import type { ATMEvent } from '@/hooks/useSentinelData';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveFeedProps {
  events: ATMEvent[];
}

const LiveFailureFeed = ({ events }: LiveFeedProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  const severityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-destructive text-destructive';
      case 'warning': return 'border-l-warning text-warning';
      default: return 'border-l-muted-foreground text-muted-foreground';
    }
  };

  return (
    <div className="sentinel-panel h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
          Live Failure Feed
        </h2>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {events.slice(0, 20).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-l-2 pl-3 py-2 bg-secondary/30 rounded-r-md ${severityStyle(event.severity)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-primary">ATM {event.atmId}</span>
                <div className="flex items-center gap-2">
                  {event.status === 'healed' && (
                    <span className="text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded-full font-medium">HEALED</span>
                  )}
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {event.confidence}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{event.city}</span>
                <span className="text-[10px]">·</span>
                <span className="text-[10px] text-foreground/70">{event.failureType}</span>
              </div>
              <span className="text-[9px] text-muted-foreground/60 font-mono">
                {event.timestamp.toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveFailureFeed;
