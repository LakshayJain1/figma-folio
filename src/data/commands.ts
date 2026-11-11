export interface CmdLine { t: 'accent' | 'dim' | 'success' | ''; s: string }

export const CMD_RESPONSES: Record<string, CmdLine[]> = {
  whoami: [
    { t: 'accent', s: '> Lakshay Jain' },
    { t: '', s: '   Role      Product Builder (Design → Code → Shipped)' },
    { t: '', s: '   Location  Jaipur, Rajasthan, India' },
    { t: '', s: '   Stack     Next.js · TypeScript · Python · LangChain' },
    { t: '', s: '   Current   Autovyn Consultancy (May 2026 – present)' },
    { t: 'dim', s: '   2+ years shipping production AI systems and products.' },
  ],
  skills: [
    { t: 'accent', s: '> skills --list' },
    { t: '', s: '   AI/LLM    RAG · Agentic AI · LangChain · LangGraph · OpenAI · Claude' },
    { t: '', s: '   Frontend  React · Next.js · TypeScript · Tailwind · Framer' },
    { t: '', s: '   Backend   Node.js · Python · PostgreSQL · Neo4j · Pinecone' },
    { t: '', s: '   Design    Figma · FigJam · Design Systems · Brand Identity' },
    { t: '', s: '   DevOps    Vercel · n8n · Make · Zapier' },
    { t: 'dim', s: '   Certifications: 3x Google Cloud (Oct–Nov 2026)' },
  ],
  contact: [
    { t: 'accent', s: '> contact --info' },
    { t: '', s: '   Email   lakshayjain326@gmail.com' },
    { t: '', s: '   Phone   +91-6378146202' },
    { t: '', s: '   GitHub  github.com/LakshayJain1' },
    { t: 'success', s: '   ✓ Currently open to freelance, full-time & collabs' },
  ],
  hire: [
    { t: 'accent', s: '> hire lakshay --start-process' },
    { t: 'dim', s: '   Initialising...' },
    { t: '', s: '   ✦ Checking availability............ OPEN' },
    { t: '', s: '   ✦ Verifying skills................. VERIFIED' },
    { t: '', s: '   ✦ Calculating culture fit.......... HIGH' },
    { t: 'success', s: '   ✓ Ready to hire. Send an email to get started.' },
    { t: 'dim', s: '   lakshayjain326@gmail.com' },
  ],
  secret: [
    { t: 'accent', s: '> ls secret/' },
    { t: 'dim', s: '   drwxr-xr-x  ./' },
    { t: '', s: '   -rw-r--r--  fun_fact.txt' },
    { t: '', s: '   -rw-r--r--  currently_reading.txt' },
    { t: '', s: '   -rw-r--r--  weird_project.txt' },
    { t: 'dim', s: '────────────────────────────────────────────' },
    { t: '', s: '   fun_fact     : Was Club Captain of a racing team. Yes, actual cars.' },
    { t: '', s: '   reading      : Building a Second Brain by Tiago Forte' },
    { t: '', s: '   weird_project: Once built a WhatsApp bot that replies for me' },
  ],
};

export const CMD_HINTS = ['whoami', 'skills', 'contact', 'hire', 'secret'];
