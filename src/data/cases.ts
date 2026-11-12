export interface Case {
  id: string;
  num: string;
  img: string;
  tags: string[];
  accentTags: string[];
  title: string;
  meta: string;
  problem: string;
  bullets: string[];
  outcome: string;
  metrics: { num: string; label: string }[];
  link?: string;
}

export const CASES: Case[] = [
  {
    id: 'case-01',
    num: '01 / 05',
    img: '/images/case-01-cover.svg',
    tags: ['RAG', 'LLM', 'Neo4j', 'Pinecone', 'Python', 'LangChain'],
    accentTags: ['RAG', 'LLM'],
    title: 'Canopy AI: Regulatory Intelligence System',
    meta: 'Tectome · UK Financial Services Client · 2025–2026 · Full-Stack AI Engineer',
    problem: 'A UK financial-services firm needed real-time monitoring and interpretation of FCA regulatory updates, a process consuming significant manual compliance-review effort.',
    bullets: [
      'Built a production RAG system with document ingestion, chunking, and embedding pipelines',
      'Designed dual storage across Pinecone (vector) and Neo4j (knowledge graph) for hybrid retrieval',
      'Implemented vector similarity + graph traversal for relational context retrieval',
      'Set up multi-provider LLM routing (OpenAI + Claude) to reduce hallucinated responses',
    ],
    outcome: 'Cut estimated manual compliance-review effort by ~60%. Reduced hallucinated responses by ~40% vs single-pass RAG.',
    metrics: [
      { num: '60%', label: 'Compliance effort reduced' },
      { num: '40%', label: 'Fewer hallucinations' },
    ],
  },
  {
    id: 'case-02',
    num: '02 / 05',
    img: '/images/case-02-cover.svg',
    tags: ['Agentic AI', 'Multi-Agent', 'LLM Orchestration', 'QA Loops', 'Task Automation'],
    accentTags: ['Agentic AI', 'Multi-Agent'],
    title: 'Agent Corp: Multi-Agent AI Company',
    meta: 'Personal Project · 2026 · Solo designer + engineer',
    problem: 'Complex tasks require multiple specialist skills. No single AI agent handles research, engineering, finance, and QA at once.',
    bullets: [
      'Designed a central orchestration system with specialist AI teams (Engineering, Research, Sales, Finance, Operations)',
      'Built a PM agent that analyses requests and routes to the right specialist team',
      'Implemented a QA agent loop that iterates until output meets a confidence threshold above 8/10',
      'Architected the full multi-agent communication protocol from scratch',
    ],
    outcome: 'A virtual AI company that executes user-defined tasks end-to-end with built-in quality assurance.',
    metrics: [
      { num: '5', label: 'Specialist AI teams' },
      { num: '8/10', label: 'QA confidence gate' },
    ],
    link: 'https://github.com/LakshayJain1/AgentCorp',
  },
  {
    id: 'case-03',
    num: '03 / 05',
    img: '/images/case-03-cover.svg',
    tags: ['AI Agents', 'n8n', 'Webhooks', 'Encryption', 'Next.js', 'Report Generation'],
    accentTags: ['AI Agents', 'n8n'],
    title: 'Police AI Report Assistant',
    meta: 'Tectome · US Law Enforcement Client · 2025–2026 · Full-Stack AI Engineer',
    problem: 'US police officers spent hours drafting reports manually. The department needed a secure, AI-driven system to generate legally compliant case law reports, criminal reports, incident reports, gang intel briefs, court testimony preps, and more from officer-provided inputs.',
    bullets: [
      'Built a guided questionnaire UI — officers answer structured questions per report type (incident, case law, gang intel, court prep, etc.)',
      'All form submissions encrypted end-to-end before transit; decrypted inside a secure n8n webhook pipeline',
      'n8n routes each report type to a specialist AI agent that structures, formats, and validates the output',
      'Encrypted response returned to the web UI where officers can edit, copy, or download the final report',
    ],
    outcome: 'Officers go from blank page to a compliant, editable draft report in under 2 minutes. Secure E2E encryption on all data in transit.',
    metrics: [
      { num: '<2 min', label: 'Draft report generation' },
      { num: 'E2E', label: 'Encrypted data pipeline' },
    ],
  },
  {
    id: 'case-04',
    num: '04 / 05',
    img: '/images/case-04-cover.svg',
    tags: ['React.js', 'Next.js', 'RBAC', 'Real-time', 'Dashboards', 'TypeScript'],
    accentTags: [],
    title: 'Inventory Management App at Modulobytes',
    meta: 'Modulobytes Softwares Pvt. Ltd. · Dec 2024 – Mar 2025 · Associate Software Engineer',
    problem: 'The client needed a web-based inventory system with real-time stock tracking, multi-role access control, and analytics dashboards.',
    bullets: [
      'Built the full application in React.js and Next.js with real-time stock tracking',
      'Implemented role-based access control (RBAC) for Admin, Manager, and Viewer roles',
      'Designed and built analytics dashboards with operational reporting',
      'Created reusable component libraries to accelerate future feature development',
    ],
    outcome: 'Production-ready inventory platform with multi-role access, live stock visibility, and analytics.',
    metrics: [
      { num: 'Real-time', label: 'Stock tracking' },
      { num: 'RBAC', label: 'Multi-role access' },
    ],
  },
  {
    id: 'case-05',
    num: '05 / 05',
    img: '/images/case-05-cover.svg',
    tags: ['UI/UX', 'Branding', 'Framer', 'Spline 3D', 'Design Systems', 'Wix'],
    accentTags: ['Framer'],
    title: 'Brand + Web Design at Integrated Byte',
    meta: 'Integrated Byte · Mar 2025 – Jul 2025 · UI/UX Designer & Frontend Developer',
    problem: 'Local clients needed end-to-end brand identity and production websites, from zero brand presence to fully shipped interactive sites.',
    bullets: [
      'Delivered end-to-end UI/UX design and web development across multiple client projects',
      'Built interactive, 3D-enhanced interfaces using Framer and Spline 3D',
      'Produced brand assets (logos, color systems, typography) ensuring visual consistency',
      'Handled full design-to-deployment workflow from wireframes through final handoff',
    ],
    outcome: 'Multiple production sites shipped with cohesive brand identities.',
    metrics: [
      { num: 'End-to-end', label: 'Design → deployment' },
      { num: '3D', label: 'Interactive Spline interfaces' },
    ],
  },
];

export const FRAME_META: Record<string, { w: number; h: number; x: number; y: number; name: string }> = {
  hero:      { w: 680, h: 420, x: 80,   y: 100,  name: 'Hero' },
  'case-01': { w: 500, h: 580, x: 840,  y: 100,  name: 'Case 01: Canopy AI' },
  'case-02': { w: 500, h: 580, x: 1400, y: 100,  name: 'Case 02: Agent Corp' },
  'case-03': { w: 500, h: 580, x: 840,  y: 740,  name: 'Case 03: AI Chat' },
  'case-04': { w: 500, h: 580, x: 1400, y: 740,  name: 'Case 04: Inventory App' },
  'case-05': { w: 500, h: 580, x: 1120, y: 1380, name: 'Case 05: Brand + Web' },
  skills:    { w: 360, h: 440, x: 80,   y: 740,  name: 'Skills' },
  certs:     { w: 360, h: 360, x: 80,   y: 1380, name: 'Certifications' },
  contact:   { w: 320, h: 280, x: 500,  y: 1380, name: 'Contact' },
};
