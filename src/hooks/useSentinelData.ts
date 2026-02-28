import { useState, useEffect, useCallback, useRef } from 'react';

export interface ATMEvent {
  id: string;
  atmId: string;
  city: string;
  failureType: string;
  confidence: number;
  healthScore: number;
  timestamp: Date;
  status: 'failed' | 'healing' | 'healed';
  severity: 'critical' | 'warning' | 'info';
}

export interface ATMNode {
  atmId: string;
  city: string;
  lat: number;
  lng: number;
  status: 'healthy' | 'at-risk' | 'failed';
  healthScore: number;
  lastEvent?: ATMEvent;
}

const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: 'Chennai', lat: 13.08, lng: 80.27 },
  { name: 'Mumbai', lat: 19.07, lng: 72.87 },
  { name: 'Delhi', lat: 28.61, lng: 77.2 },
  { name: 'Bangalore', lat: 12.97, lng: 77.59 },
  { name: 'Hyderabad', lat: 17.38, lng: 78.49 },
  { name: 'Kolkata', lat: 22.57, lng: 88.36 },
  { name: 'Pune', lat: 18.52, lng: 73.85 },
  { name: 'Ahmedabad', lat: 23.02, lng: 72.57 },
  { name: 'Jaipur', lat: 26.91, lng: 75.78 },
  { name: 'Lucknow', lat: 26.85, lng: 80.95 },
];

const FAILURE_TYPES = [
  'Network Timeout',
  'Hardware Fault',
  'Software Crash',
  'Cash Depletion',
  'Server Overload',
];

const SEVERITY_MAP: Record<string, 'critical' | 'warning' | 'info'> = {
  'Network Timeout': 'warning',
  'Hardware Fault': 'critical',
  'Software Crash': 'critical',
  'Cash Depletion': 'info',
  'Server Overload': 'warning',
};

const ACTION_PLANS: Record<string, (atmId: string, city: string, confidence: number) => string> = {
  'Network Timeout': (atmId, city, conf) =>
    `ATM ${atmId} ${city} — Network Timeout detected (${conf}% confidence).\n\nStep 1: Auto-trigger remote router reset via API.\nStep 2: Monitor response time for 15 minutes.\nStep 3: If unresolved, dispatch Network Engineer (ETA: 45 min).\n\nCurrent Status: AUTO-HEALING IN PROGRESS...`,
  'Hardware Fault': (atmId, city, conf) =>
    `ATM ${atmId} ${city} — Hardware Fault detected (${conf}% confidence).\n\nStep 1: Alert dispatched to Hardware team via WhatsApp.\nStep 2: ATM switched to maintenance mode.\nStep 3: Nearest engineer notified — Rajesh Kumar, 2.3km away.\n\nCurrent Status: ENGINEER DISPATCHED...`,
  'Software Crash': (atmId, city, conf) =>
    `ATM ${atmId} ${city} — Software Crash detected (${conf}% confidence).\n\nStep 1: Auto-restart of ATM software service initiated.\nStep 2: Transaction logs backed up.\nStep 3: System health check running.\n\nCurrent Status: AUTO-HEALING IN PROGRESS...`,
  'Cash Depletion': (atmId, city, conf) =>
    `ATM ${atmId} ${city} — Cash Depletion detected (${conf}% confidence).\n\nStep 1: Cash replenishment request auto-generated.\nStep 2: Nearest CIT vehicle notified — ETA: 90 min.\nStep 3: ATM display updated with status message.\n\nCurrent Status: REPLENISHMENT SCHEDULED...`,
  'Server Overload': (atmId, city, conf) =>
    `ATM ${atmId} ${city} — Server Overload detected (${conf}% confidence).\n\nStep 1: Load balancer reconfigured to redirect traffic.\nStep 2: Secondary server activated.\nStep 3: Performance monitoring intensified for 30 min.\n\nCurrent Status: AUTO-HEALING IN PROGRESS...`,
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAtmId(): string {
  return `#${randomInt(1000, 9999)}`;
}

function generateInitialATMs(): ATMNode[] {
  const atms: ATMNode[] = [];
  for (let i = 0; i < 20; i++) {
    const city = CITIES[i % CITIES.length];
    const jitterLat = (Math.random() - 0.5) * 2;
    const jitterLng = (Math.random() - 0.5) * 2;
    atms.push({
      atmId: `#${(1000 + i * 200 + randomInt(0, 199)).toString()}`,
      city: city.name,
      lat: city.lat + jitterLat,
      lng: city.lng + jitterLng,
      status: Math.random() > 0.15 ? 'healthy' : Math.random() > 0.5 ? 'at-risk' : 'failed',
      healthScore: randomInt(40, 100),
    });
  }
  return atms;
}

export function getActionPlan(event: ATMEvent): string {
  const fn = ACTION_PLANS[event.failureType];
  return fn ? fn(event.atmId, event.city, event.confidence) : '';
}

export function useSentinelData() {
  const [events, setEvents] = useState<ATMEvent[]>([]);
  const [atms, setAtms] = useState<ATMNode[]>(() => generateInitialATMs());
  const [healedCount, setHealedCount] = useState(12);
  const [complaintsBlocked, setComplaintsBlocked] = useState(847);
  const eventIdCounter = useRef(0);

  const generateEvent = useCallback((): ATMEvent => {
    const city = CITIES[randomInt(0, CITIES.length - 1)];
    const failureType = FAILURE_TYPES[randomInt(0, FAILURE_TYPES.length - 1)];
    eventIdCounter.current++;
    return {
      id: `evt-${eventIdCounter.current}-${Date.now()}`,
      atmId: generateAtmId(),
      city: city.name,
      failureType,
      confidence: randomInt(78, 99),
      healthScore: randomInt(5, 35),
      timestamp: new Date(),
      status: 'failed',
      severity: SEVERITY_MAP[failureType] || 'warning',
    };
  }, []);

  useEffect(() => {
    // Generate events every 4 seconds
    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev].slice(0, 50));

      // Update a random ATM to reflect failure
      setAtms(prev => {
        const updated = [...prev];
        const idx = randomInt(0, updated.length - 1);
        updated[idx] = {
          ...updated[idx],
          status: 'failed',
          healthScore: newEvent.healthScore,
          lastEvent: newEvent,
        };
        return updated;
      });

      // Heal after 15 seconds
      setTimeout(() => {
        setEvents(prev =>
          prev.map(e => (e.id === newEvent.id ? { ...e, status: 'healed' } : e))
        );
        setAtms(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(a => a.lastEvent?.id === newEvent.id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], status: 'healthy', healthScore: randomInt(75, 98) };
          }
          return updated;
        });
        setHealedCount(prev => prev + 1);
        setComplaintsBlocked(prev => prev + randomInt(1, 5));
      }, 15000);
    }, 4000);

    return () => clearInterval(interval);
  }, [generateEvent]);

  const healthyCount = atms.filter(a => a.status === 'healthy').length;
  const atRiskCount = atms.filter(a => a.status === 'at-risk').length;
  const failedCount = atms.filter(a => a.status === 'failed').length;

  return {
    events,
    atms,
    healedCount,
    complaintsBlocked,
    healthyCount,
    atRiskCount,
    failedCount,
    totalATMs: 134,
  };
}
