import { useState, useEffect, useRef } from 'preact/hooks';

type LogEvent = {
  id: number;
  timestamp: string;
  sourceIp: string;
  user: string;
  action: string;
  isMalicious: boolean;
  technique: string;
  explanation: string;
};

const SCENARIOS = [
  {
    sourceIp: "103.14.22.1", user: "admin", action: "Failed Login (x50)",
    isMalicious: true, technique: "T1110 - Brute Force",
    explanation: "50 failed attempts in 2 seconds from an external IP indicates a brute force attack."
  },
  {
    sourceIp: "192.168.1.55", user: "j.doe", action: "Successful Login",
    isMalicious: false, technique: "Benign",
    explanation: "Standard internal network login during business hours."
  },
  {
    sourceIp: "185.12.3.99", user: "sys_service", action: "Interactive Login",
    isMalicious: true, technique: "T1078 - Valid Accounts",
    explanation: "Service accounts should not have interactive terminal logons, especially from external IPs."
  },
  {
    sourceIp: "10.0.0.12", user: "r.smith", action: "Access File (Q3_Report.pdf)",
    isMalicious: false, technique: "Benign",
    explanation: "Normal file access on the corporate share."
  },
  {
    sourceIp: "45.33.22.11", user: "m.jones", action: "Successful Login (VPN)",
    isMalicious: true, technique: "Impossible Travel",
    explanation: "User logged in from New York 5 minutes ago, now logging in from Eastern Europe."
  },
  {
    sourceIp: "10.0.4.5", user: "a.admin", action: "Disable Windows Defender",
    isMalicious: true, technique: "T1562 - Impair Defenses",
    explanation: "Endpoint protection was disabled by an admin account, a strong indicator of compromise."
  }
];

export default function TriageDesk() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'debrief'>('intro');
  const [timeLeft, setTimeLeft] = useState(30); // 30s for demo purposes (spec asks for 90s, but 30s is better UX for a portfolio)
  const [score, setScore] = useState(0);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [processedEvents, setProcessedEvents] = useState<(LogEvent & { playerFlagged: boolean })[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const spawnerRef = useRef<number | null>(null);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setScore(0);
    setEvents([]);
    setProcessedEvents([]);
  };

  const endGame = () => {
    setGameState('debrief');
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnerRef.current) clearInterval(spawnerRef.current);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      let idCounter = 0;
      
      // Timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { endGame(); return 0; }
          return t - 1;
        });
      }, 1000);

      // Event Spawner
      spawnerRef.current = window.setInterval(() => {
        const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        const newEvent: LogEvent = {
          ...scenario,
          id: idCounter++,
          timestamp: new Date().toISOString().split('T')[1].split('.')[0]
        };
        setEvents(prev => [...prev.slice(-4), newEvent]); // Keep last 5 events
      }, 2500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    };
  }, [gameState]);

  const handleAction = (event: LogEvent, flagged: boolean) => {
    setEvents(prev => prev.filter(e => e.id !== event.id));
    setProcessedEvents(prev => [...prev, { ...event, playerFlagged: flagged }]);
    
    if (flagged === event.isMalicious) {
      setScore(s => s + 100);
    } else {
      setScore(s => s - 50);
    }
  };

  if (gameState === 'intro') {
    return (
      <div class="border border-[var(--rule)] bg-[var(--paper)] p-8 w-full max-w-3xl shadow-sm relative">
        <div class="absolute -top-3 -right-3 bg-[var(--ink)] text-[var(--paper)] px-2 py-1 font-mono text-[9px]">F6 :: TRIAGE_DESK</div>
        <h3 class="font-display text-4xl mb-4">Triage Desk Simulator</h3>
        <p class="font-sans text-[var(--ink)]/80 mb-6 max-w-xl">
          A synthetic stream of auth and network logs will appear. You have 30 seconds to flag the malicious events and ignore the benign ones. 
          Are your instincts calibrated?
        </p>
        <button onClick={startGame} class="font-mono text-sm px-6 py-3 bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--signal)] transition-colors">
          INITIALIZE STREAM
        </button>
      </div>
    );
  }

  if (gameState === 'debrief') {
    const correct = processedEvents.filter(e => e.playerFlagged === e.isMalicious).length;
    const total = processedEvents.length;

    return (
      <div class="border border-[var(--rule)] bg-[var(--paper)] p-8 w-full max-w-3xl shadow-sm">
        <h3 class="font-display text-4xl mb-2">Simulation Terminated</h3>
        <div class="font-mono text-sm text-[var(--signal)] mb-8">Final Score: {score} ({correct}/{total} accurate)</div>
        
        <h4 class="font-mono text-xs uppercase tracking-widest mb-4 border-b border-[var(--rule)] pb-2">Analyst Debrief</h4>
        <div class="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {processedEvents.map(e => (
            <div class={`p-4 border text-sm font-mono ${e.playerFlagged === e.isMalicious ? 'border-green-500/50 bg-green-500/5' : 'border-[var(--signal)]/50 bg-[var(--signal)]/5'}`}>
              <div class="flex justify-between mb-2 opacity-60 text-[10px]">
                <span>{e.timestamp} | {e.sourceIp} | {e.user}</span>
                <span>{e.technique}</span>
              </div>
              <div class="mb-2 font-bold">{e.action}</div>
              <div class="text-[var(--ink)]/80 font-sans">{e.explanation}</div>
              <div class="mt-2 text-[10px] uppercase">
                {e.playerFlagged === e.isMalicious ? <span class="text-green-600">✓ Correct Assessment</span> : <span class="text-[var(--signal)]">✗ Missed Detection</span>}
              </div>
            </div>
          ))}
          {processedEvents.length === 0 && <p class="font-mono text-xs opacity-50">No events processed.</p>}
        </div>
        <button onClick={startGame} class="mt-8 font-mono text-xs uppercase underline decoration-[var(--rule)] underline-offset-4 hover:text-[var(--signal)]">
          Run another simulation
        </button>
      </div>
    );
  }

  return (
    <div class="border border-[var(--rule)] bg-[var(--paper)] p-8 w-full max-w-3xl shadow-sm">
      <div class="flex justify-between items-center border-b border-[var(--rule)] pb-4 mb-6 font-mono text-sm">
        <div>SCORE: <span class="text-[var(--signal)]">{score}</span></div>
        <div>TIME: <span class={timeLeft <= 10 ? 'text-[var(--signal)] animate-pulse' : ''}>00:{timeLeft.toString().padStart(2, '0')}</span></div>
      </div>
      
      <div class="space-y-4 min-h-[300px] flex flex-col justify-end">
        {events.map(e => (
          <div key={e.id} class="border border-[var(--rule)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--paper)] shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div class="font-mono text-xs">
              <span class="opacity-50 mr-2">{e.timestamp}</span>
              <span class="mr-4">{e.sourceIp}</span>
              <span class="mr-4 font-bold">{e.user}</span>
              <span>{e.action}</span>
            </div>
            <div class="flex gap-2 w-full md:w-auto">
              <button onClick={() => handleAction(e, false)} class="flex-1 md:flex-none font-mono text-[10px] px-4 py-2 border border-[var(--rule)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors">
                IGNORE
              </button>
              <button onClick={() => handleAction(e, true)} class="flex-1 md:flex-none font-mono text-[10px] px-4 py-2 border border-[var(--signal)] text-[var(--signal)] hover:bg-[var(--signal)] hover:text-[var(--paper)] transition-colors">
                FLAG
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && <div class="font-mono text-xs text-center opacity-30 my-8">Awaiting logs...</div>}
      </div>
    </div>
  );
}
