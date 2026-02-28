import { useState, useEffect, useRef } from 'react';
import type { ATMEvent } from '@/hooks/useSentinelData';
import { getActionPlan } from '@/hooks/useSentinelData';
import { Bot, CheckCircle2 } from 'lucide-react';

interface AIResolutionBoxProps {
  events: ATMEvent[];
}

const AIResolutionBox = ({ events }: AIResolutionBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentEvent, setCurrentEvent] = useState<ATMEvent | null>(null);
  const [isHealed, setIsHealed] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Pick the latest failed event
  useEffect(() => {
    const latestFailed = events.find(e => e.status === 'failed' || e.status === 'healing');
    if (latestFailed && latestFailed.id !== currentEvent?.id) {
      setCurrentEvent(latestFailed);
      setIsHealed(false);
      setDisplayedText('');

      const fullText = getActionPlan(latestFailed);
      let i = 0;

      if (typingRef.current) clearInterval(typingRef.current);

      typingRef.current = setInterval(() => {
        i++;
        setDisplayedText(fullText.slice(0, i));
        if (i >= fullText.length) {
          if (typingRef.current) clearInterval(typingRef.current);
        }
      }, 15);

      // Mark healed after 10 seconds
      const healTimeout = setTimeout(() => setIsHealed(true), 10000);
      return () => {
        clearTimeout(healTimeout);
        if (typingRef.current) clearInterval(typingRef.current);
      };
    }
  }, [events]);

  return (
    <div className="sentinel-panel flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
            RESOLVER — GenAI Action Plan
          </h2>
        </div>
        {isHealed && (
          <span className="flex items-center gap-1.5 text-[10px] bg-success/20 text-success px-2.5 py-1 rounded-full font-semibold glow-success">
            <CheckCircle2 className="w-3 h-3" />
            SELF-HEALED
          </span>
        )}
      </div>
      <div className="p-4 flex-1">
        {currentEvent ? (
          <div className="bg-secondary/30 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-primary font-bold">ATM {currentEvent.atmId}</span>
              <span className="text-[10px] text-muted-foreground">{currentEvent.city}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                currentEvent.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                currentEvent.severity === 'warning' ? 'bg-warning/20 text-warning' :
                'bg-muted text-muted-foreground'
              }`}>{currentEvent.failureType}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{currentEvent.confidence}% confidence</span>
            </div>
            <pre className="font-mono text-[11px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {displayedText}
              <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5 align-middle" />
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            Awaiting failure events...
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResolutionBox;
