'use client';
import { useState } from 'react';

type ReportType = 'incident' | 'caselaw' | 'criminal' | 'gang' | 'court' | 'legal';

interface QField { id: string; label: string; type: 'input' | 'textarea'; ph: string }

const REPORT_TYPES: { id: ReportType; label: string }[] = [
  { id: 'incident', label: 'Incident Report' },
  { id: 'caselaw', label: 'Case Law' },
  { id: 'criminal', label: 'Criminal Report' },
  { id: 'gang', label: 'Gang Intel Brief' },
  { id: 'court', label: 'Court Testimony Prep' },
  { id: 'legal', label: 'Legal Query' },
];

const QUESTIONS: Record<ReportType, QField[]> = {
  incident: [
    { id: 'date', label: 'Date & Time', type: 'input', ph: '2025-11-12 14:30' },
    { id: 'location', label: 'Location', type: 'input', ph: 'Address or landmark' },
    { id: 'desc', label: 'What occurred', type: 'textarea', ph: 'Describe the incident…' },
    { id: 'suspect', label: 'Suspect description', type: 'input', ph: 'Physical description or ID' },
  ],
  caselaw: [
    { id: 'charge', label: 'Charge / Offense', type: 'input', ph: 'e.g. 18 U.S.C. § 113' },
    { id: 'jurisdiction', label: 'Jurisdiction', type: 'input', ph: 'State / Federal' },
    { id: 'facts', label: 'Key facts', type: 'textarea', ph: 'Summarise relevant facts…' },
    { id: 'query', label: 'Legal question', type: 'input', ph: 'What precedent are you seeking?' },
  ],
  criminal: [
    { id: 'name', label: 'Subject name', type: 'input', ph: 'Full name / aliases' },
    { id: 'dob', label: 'Date of birth', type: 'input', ph: 'MM/DD/YYYY' },
    { id: 'charges', label: 'Charges / history', type: 'textarea', ph: 'List charges…' },
    { id: 'evidence', label: 'Evidence summary', type: 'input', ph: 'Physical evidence, witnesses…' },
  ],
  gang: [
    { id: 'gang', label: 'Gang / affiliation', type: 'input', ph: 'e.g. MS-13, local crew' },
    { id: 'territory', label: 'Territory / locations', type: 'input', ph: 'Streets, areas of operation' },
    { id: 'activity', label: 'Recent activity', type: 'textarea', ph: 'Describe intel…' },
    { id: 'members', label: 'Known members', type: 'input', ph: 'Count / names' },
  ],
  court: [
    { id: 'case_no', label: 'Case number', type: 'input', ph: 'CR-2025-00482' },
    { id: 'role', label: 'Officer role', type: 'input', ph: 'Arresting, witness, expert…' },
    { id: 'testimony', label: 'Key testimony points', type: 'textarea', ph: 'Main statements…' },
    { id: 'defense', label: 'Expected defense', type: 'input', ph: 'Anticipated challenges' },
  ],
  legal: [
    { id: 'query', label: 'Legal question', type: 'textarea', ph: 'State your question clearly…' },
    { id: 'context', label: 'Context', type: 'input', ph: 'Jurisdiction, statute…' },
    { id: 'urgency', label: 'Urgency / deadline', type: 'input', ph: 'Court date, 48h hold expiry…' },
  ],
};

function buildReport(type: ReportType, a: Record<string, string>): string {
  const line = '─'.repeat(42);
  switch (type) {
    case 'incident': return `INCIDENT REPORT\n${line}\nDate/Time:  ${a.date||'N/A'}\nLocation:   ${a.location||'N/A'}\nReport No.: IR-${Date.now().toString().slice(-6)}\n\nNARRATIVE\n${a.desc||'No description provided.'}\n\nSUSPECT\n${a.suspect||'No suspect identified.'}\n\nSTATUS: Open — Pending investigation\nReporting Officer: [Name]  Badge: [####]`;
    case 'caselaw': return `CASE LAW RESEARCH REPORT\n${line}\nCharge:       ${a.charge||'N/A'}\nJurisdiction: ${a.jurisdiction||'N/A'}\nQuery:        ${a.query||'N/A'}\n\nCASE FACTS\n${a.facts||'None provided.'}\n\nPRELIMINARY FINDINGS\nRelevant precedents identified. Consult DA before formal proceedings.`;
    case 'criminal': return `CRIMINAL HISTORY REPORT\n${line}\nSubject:    ${a.name||'Unknown'}\nDOB:        ${a.dob||'N/A'}\nReport No.: CHR-${Date.now().toString().slice(-6)}\n\nCHARGES & HISTORY\n${a.charges||'No prior record.'}\n\nEVIDENCE\n${a.evidence||'None noted.'}\n\nCLASSIFICATION: CONFIDENTIAL`;
    case 'gang': return `GANG INTELLIGENCE BRIEF\n${line}\nGang:        ${a.gang||'Unknown'}\nTerritory:   ${a.territory||'N/A'}\nMembership:  ${a.members||'Unknown'}\n\nINTEL SUMMARY\n${a.activity||'No activity recorded.'}\n\nTHREAT LEVEL: Elevated\nRECOMMENDATION: Increase patrol. Coordinate with Gang Task Force.`;
    case 'court': return `COURT TESTIMONY PREPARATION\n${line}\nCase No.:  ${a.case_no||'N/A'}\nRole:      ${a.role||'N/A'}\n\nKEY TESTIMONY POINTS\n${a.testimony||'None provided.'}\n\nANTICIPATED DEFENSE\n${a.defense||'None specified.'}\n\nNOTE: Review body-cam footage and chain-of-custody docs before court.`;
    case 'legal': return `LEGAL QUERY RESPONSE\n${line}\nQuery:    ${a.query||'N/A'}\nContext:  ${a.context||'N/A'}\nUrgency:  ${a.urgency||'N/A'}\n\nAI PRELIMINARY GUIDANCE\nFourth Amendment protections and Miranda obligations may apply depending on the stage of proceedings. All determinations must be reviewed by department legal counsel before action.\n\nDISCLAIMER: AI-generated reference only.`;
  }
}

const ARCH_STEPS = [
  { label: 'Officer UI', sub: 'Guided Q&A' },
  { label: 'n8n Webhook', sub: '🔒 Recv+Decrypt' },
  { label: 'AI Agent', sub: 'Generate' },
  { label: 'n8n Webhook', sub: '🔒 Encrypt+Return' },
  { label: 'Report Output', sub: 'Edit·Copy·Save' },
];

export default function PoliceAIDemo() {
  const [type, setType] = useState<ReportType>('incident');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [archStep, setArchStep] = useState(-1);
  const [statusMsg, setStatusMsg] = useState('');
  const [report, setReport] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  function setAnswer(id: string, val: string) {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }

  function generate() {
    if (running) return;
    setRunning(true); setReport(''); setArchStep(-1);
    const steps = [
      [0, 100, 'Encrypting payload…'],
      [1, 400, 'n8n webhook: received + decrypted…'],
      [2, 700, 'AI agent drafting report…'],
      [3, 1050, 'Encrypting response for return…'],
      [4, 1450, ''],
    ];
    steps.forEach(([step, delay, msg]) => {
      setTimeout(() => {
        setArchStep(step as number);
        if (msg) setStatusMsg(msg as string);
      }, delay as number);
    });
    setTimeout(() => {
      const text = buildReport(type, answers);
      setReport(text);
      setStatusMsg('✓ Report ready — edit, copy or download');
      setRunning(false);
    }, 1600);
  }

  function copy() {
    navigator.clipboard.writeText(report).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([report], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `police_${type}_${Date.now()}.txt`;
    a.click();
  }

  const qs = QUESTIONS[type];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Demo — Police AI Report Generator</span>
      </div>

      <div className="bg-[#111] p-4 space-y-4">
        {/* Architecture strip */}
        <div className="flex items-center gap-0 overflow-x-auto pb-1">
          {ARCH_STEPS.map((step, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg border transition-all duration-400 min-w-[72px] ${
                archStep > i ? 'border-green-700 bg-green-950/40'
                : archStep === i ? 'border-violet-500 bg-violet-950/40 animate-pulse'
                : 'border-gray-800 bg-transparent'
              }`}>
                <span className={`text-[10px] font-semibold font-mono text-center leading-tight ${
                  archStep > i ? 'text-green-400' : archStep === i ? 'text-violet-400' : 'text-gray-600'
                }`}>{step.label}</span>
                <span className="text-[8px] text-gray-600 text-center">{step.sub}</span>
              </div>
              {i < ARCH_STEPS.length - 1 && (
                <div className={`w-6 flex-shrink-0 h-px mx-0.5 transition-colors ${archStep > i ? 'bg-green-700' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Two columns: left = type + questions, right = output */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left */}
          <div className="space-y-3">
            {/* Report type */}
            <div className="flex flex-wrap gap-1.5">
              {REPORT_TYPES.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => { setType(rt.id); setAnswers({}); setReport(''); setArchStep(-1); setStatusMsg(''); }}
                  className={`text-[9px] px-2 py-1 rounded border font-mono transition-all ${
                    type === rt.id
                      ? 'border-red-500 text-red-400 bg-red-950/40'
                      : 'border-gray-700 text-gray-500 hover:border-gray-500'
                  }`}
                >{rt.label}</button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-2">
              {qs.map(q => (
                <div key={q.id}>
                  <label className="text-[9px] text-gray-500 block mb-1">{q.label}</label>
                  {q.type === 'textarea' ? (
                    <textarea
                      value={answers[q.id] || ''}
                      onChange={e => setAnswer(q.id, e.target.value)}
                      placeholder={q.ph}
                      rows={2}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[10px] text-gray-300 placeholder:text-gray-700 outline-none focus:border-violet-500 font-mono resize-none"
                    />
                  ) : (
                    <input
                      value={answers[q.id] || ''}
                      onChange={e => setAnswer(q.id, e.target.value)}
                      placeholder={q.ph}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[10px] text-gray-300 placeholder:text-gray-700 outline-none focus:border-violet-500 font-mono"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={generate}
              disabled={running}
              className="w-full py-2 bg-red-950/60 border border-red-800 text-red-400 rounded-md text-xs font-bold font-mono hover:bg-red-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors tracking-wider"
            >
              {running ? 'Generating…' : 'Generate Report →'}
            </button>
          </div>

          {/* Right: output */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Output</span>
              {report && (
                <div className="flex gap-1.5">
                  <button onClick={copy} className="text-[9px] px-2 py-1 border border-gray-700 rounded text-gray-400 hover:border-violet-500 hover:text-violet-400 font-mono transition-colors">
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button onClick={download} className="text-[9px] px-2 py-1 border border-green-800 rounded text-green-400 hover:bg-green-950/40 font-mono transition-colors">
                    ↓ Save
                  </button>
                </div>
              )}
            </div>

            <textarea
              value={report}
              onChange={e => setReport(e.target.value)}
              placeholder={running ? '' : 'Fill the questions and hit Generate…'}
              className="flex-1 min-h-[200px] w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-[10px] text-gray-300 placeholder:text-gray-700 outline-none focus:border-violet-500 font-mono resize-none leading-relaxed"
            />

            {statusMsg && (
              <p className={`text-[9px] font-mono flex items-center gap-1.5 ${
                statusMsg.startsWith('✓') ? 'text-green-500' : 'text-violet-400'
              }`}>
                {running && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />}
                {statusMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
