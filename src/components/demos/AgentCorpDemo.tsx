'use client';
import { useRef, useState } from 'react';

const TASK_ROUTES: Record<string, string[]> = {
  pitch: ['research', 'sales'], market: ['research', 'sales'],
  finance: ['finance', 'research'], code: ['engineering'],
  build: ['engineering'], api: ['engineering'],
  design: ['engineering', 'operations'], report: ['research', 'operations'],
  strategy: ['research', 'sales', 'finance'], email: ['sales', 'operations'],
  analyse: ['research', 'finance'], analyze: ['research', 'finance'],
};
const RESULTS: Record<string, string> = {
  engineering: 'Spec drafted · architecture diagram ready · 3 implementation options ranked.',
  research: 'Market analysis complete · 12 sources cited · key insights extracted.',
  sales: 'Pitch structure ready · value props identified · objection handlers included.',
  finance: 'Cost model built · ROI at 3 growth scenarios · assumptions documented.',
  operations: 'Process flow mapped · dependencies identified · timeline estimate attached.',
};
const ALL_TEAMS = ['Engineering', 'Research', 'Sales', 'Finance', 'Operations'];
const TEAM_IDS = ['engineering', 'research', 'sales', 'finance', 'operations'];

type Stage = 'idle' | 'analysing' | 'routing' | 'qa' | 'done';

export default function AgentCorpDemo() {
  const [task, setTask] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [teams, setTeams] = useState<string[]>([]);
  const [litTeams, setLitTeams] = useState<Set<string>>(new Set());
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [pmDone, setPmDone] = useState(false);
  const [qa, setQa] = useState(0);
  const [result, setResult] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function run() {
    if (stage !== 'idle' && stage !== 'done') return;
    if (!task.trim()) return;
    const lower = task.toLowerCase();
    const matched = Object.entries(TASK_ROUTES).find(([k]) => lower.includes(k));
    const routedTeams = matched ? matched[1] : ['engineering'];

    setStage('analysing'); setTeams([]); setLitTeams(new Set()); setSelectedTeams(new Set());
    setPmDone(false); setQa(0); setResult('');

    setTimeout(() => {
      setStage('routing'); setTeams(routedTeams);
      let delay = 0;
      routedTeams.forEach(tid => {
        setTimeout(() => setLitTeams(prev => new Set([...prev, tid])), delay);
        setTimeout(() => {
          setLitTeams(prev => { const n = new Set(prev); n.delete(tid); return n; });
          setSelectedTeams(prev => new Set([...prev, tid]));
        }, delay + 300);
        delay += 300;
      });
      setTimeout(() => {
        setPmDone(true); setStage('qa');
        let val = 0;
        timerRef.current = setInterval(() => {
          val += Math.random() * 1.8 + 0.5;
          if (val >= 8) {
            val = 8.3;
            clearInterval(timerRef.current!);
            setResult(RESULTS[routedTeams[0]] || RESULTS.engineering);
            setStage('done');
          }
          setQa(val);
        }, 280);
      }, delay + 200);
    }, 900);
  }

  const teamColor = (tid: string) =>
    selectedTeams.has(tid) ? 'bg-indigo-600 border-indigo-600 text-white'
    : litTeams.has(tid) ? 'border-violet-400 text-violet-400 bg-violet-400/10'
    : 'border-gray-700 text-gray-500 bg-transparent';

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-violet-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Demo — AgentCorp Router</span>
      </div>

      <div className="p-4 space-y-4 bg-[#111]">
        {/* Input */}
        <div className="flex gap-2">
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="Type any task… e.g. 'write a pitch deck'"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-violet-500 font-mono"
          />
          <button
            onClick={run}
            disabled={stage === 'analysing' || stage === 'routing' || stage === 'qa'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Route →
          </button>
        </div>

        {/* Flow */}
        {stage === 'idle' && (
          <div className="text-center text-gray-600 text-xs font-mono py-6">
            $ awaiting task<span className="animate-pulse">▮</span>
            <div className="text-[10px] text-gray-700 mt-1">PM agent analyses → routes to specialist team</div>
          </div>
        )}

        {stage !== 'idle' && (
          <div className="space-y-3">
            {/* PM node */}
            <div className="flex justify-center">
              <div className={`px-4 py-2 rounded-lg border text-xs font-semibold text-center min-w-[120px] transition-all ${
                pmDone ? 'border-green-500 text-green-400 bg-green-500/10'
                : 'border-amber-500 text-amber-400 bg-amber-500/10 animate-pulse'
              }`}>
                PM Agent
                <div className="text-[9px] font-normal mt-0.5 text-gray-500">
                  {pmDone ? '✓ routed' : stage === 'analysing' ? 'analysing…' : 'routing…'}
                </div>
              </div>
            </div>

            <div className="text-center text-gray-600 text-sm">↓</div>

            {/* Team nodes */}
            {teams.length > 0 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {ALL_TEAMS.map((name, i) => {
                  const tid = TEAM_IDS[i];
                  const isActive = teams.includes(tid);
                  return (
                    <div key={tid} className={`px-3 py-1.5 rounded-md border text-[10px] font-mono transition-all duration-300 ${
                      isActive ? teamColor(tid) : 'border-gray-800 text-gray-700'
                    }`}>{name}</div>
                  );
                })}
              </div>
            )}

            {/* QA bar */}
            {(stage === 'qa' || stage === 'done') && (
              <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">QA Loop</span>
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(qa / 10 * 100, 100)}%` }} />
                </div>
                <span className="text-[10px] font-mono text-green-400 min-w-[36px] text-right">{qa.toFixed(1)}/10</span>
              </div>
            )}

            {/* Result */}
            {stage === 'done' && result && (
              <div className="bg-green-950/40 border border-green-800/50 rounded-lg px-3 py-2.5">
                <div className="text-[9px] text-green-500 font-bold tracking-widest uppercase mb-1">✓ Output ready</div>
                <div className="text-[11px] text-green-300 font-mono leading-relaxed">{result}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
