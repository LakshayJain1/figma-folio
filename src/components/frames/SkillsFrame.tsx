const GROUPS = [
  { label: 'AI & LLM', chips: ['LangChain', 'LangGraph', 'RAG Architecture', 'Agentic AI', 'OpenAI API', 'Claude API', 'Vercel AI SDK', 'Google ADK'] },
  { label: 'Frontend', chips: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer', 'Spline 3D'] },
  { label: 'Backend & Data', chips: ['Python', 'Node.js', 'PostgreSQL', 'Neo4j', 'Pinecone', 'Supabase'] },
  { label: 'Design', chips: ['Figma', 'FigJam', 'Design Systems', 'Brand Identity'] },
  { label: 'Automation', chips: ['n8n', 'Make', 'Zapier', 'Vercel'] },
];

export default function SkillsFrame({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="p-7 select-none" onClick={onSelect}>
      <h2 className="font-display text-lg font-bold text-gray-900 dark:text-gray-50 mb-5">Tools & Skills</h2>
      {GROUPS.map(g => (
        <div key={g.label} className="mb-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">{g.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {g.chips.map(c => (
              <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
