'use client';
import { useState } from 'react';

type Role = 'admin' | 'manager' | 'viewer';
type Branch = 'all' | 'jaipur' | 'delhi' | 'mumbai';
type StockStatus = 'in' | 'low' | 'out' | 'transit';

interface Product { name: string; sku: string; stock: number; max: number; branch: Branch; status: StockStatus }

const PRODUCTS: Product[] = [
  { name: 'Wireless Earbuds Pro', sku: 'WEP-001', stock: 142, max: 200, branch: 'jaipur', status: 'in' },
  { name: 'USB-C Hub 7-in-1', sku: 'UCH-004', stock: 18, max: 100, branch: 'delhi', status: 'low' },
  { name: 'Mechanical Keyboard', sku: 'MKB-012', stock: 0, max: 50, branch: 'mumbai', status: 'out' },
  { name: '27" Monitor 4K', sku: 'MON-027', stock: 9, max: 30, branch: 'jaipur', status: 'low' },
  { name: 'Laptop Stand Aluminium', sku: 'LSA-003', stock: 67, max: 80, branch: 'delhi', status: 'in' },
  { name: 'Webcam 1080p', sku: 'WCM-009', stock: 34, max: 60, branch: 'mumbai', status: 'in' },
  { name: 'Desk Lamp LED', sku: 'DLP-021', stock: 5, max: 40, branch: 'jaipur', status: 'low' },
  { name: 'Cable Management Kit', sku: 'CMK-007', stock: 0, max: 120, branch: 'delhi', status: 'transit' },
  { name: 'Ergonomic Mouse', sku: 'EMO-015', stock: 88, max: 100, branch: 'mumbai', status: 'in' },
  { name: 'Portable SSD 1TB', sku: 'SSD-033', stock: 11, max: 50, branch: 'jaipur', status: 'low' },
];

const BRANCH_STATS: Record<Branch, { total: number; low: number; transit: number; partners: number }> = {
  all:    { total: 48, low: 7, transit: 3, partners: 12 },
  jaipur: { total: 16, low: 3, transit: 1, partners: 5 },
  delhi:  { total: 18, low: 2, transit: 1, partners: 4 },
  mumbai: { total: 14, low: 2, transit: 1, partners: 3 },
};

const BRANCH_LABELS: Record<Branch, string> = { all: 'All Branches', jaipur: 'Jaipur HQ', delhi: 'Delhi Store', mumbai: 'Mumbai Hub' };
const STATUS_BADGE: Record<StockStatus, { label: string; cls: string }> = {
  in:      { label: 'In Stock',      cls: 'bg-green-900/60 text-green-400 border-green-800' },
  low:     { label: 'Low Stock',     cls: 'bg-amber-900/60 text-amber-400 border-amber-800' },
  out:     { label: 'Out of Stock',  cls: 'bg-red-900/60 text-red-400 border-red-800' },
  transit: { label: 'In Transit',    cls: 'bg-blue-900/60 text-blue-400 border-blue-800' },
};
const BAR_COLOR: Record<StockStatus, string> = { in: '#4ade80', low: '#fbbf24', out: '#f87171', transit: '#60a5fa' };

const RBAC_NOTES: Record<Role, { color: string; text: string }> = {
  admin:   { color: 'text-red-400',   text: 'Full access — view, edit, delete, reorder across all branches.' },
  manager: { color: 'text-amber-400', text: 'Can edit stock and reorder — cannot delete products or manage partners.' },
  viewer:  { color: 'text-blue-400',  text: 'Read-only access — no edits, no deletes, delivery status visible.' },
};

export default function IMSDemo() {
  const [role, setRole] = useState<Role>('admin');
  const [branch, setBranch] = useState<Branch>('all');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 1600);
  }

  const stats = BRANCH_STATS[branch];
  const rows = branch === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.branch === branch);
  const note = RBAC_NOTES[role];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Demo — Inventory Management System</span>
      </div>

      <div className="bg-[#111] p-4 space-y-3">
        {/* Role switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] text-gray-500 font-mono">Role:</span>
          {(['admin', 'manager', 'viewer'] as Role[]).map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`text-[10px] px-3 py-1 rounded border font-mono font-semibold capitalize transition-all ${
                role === r
                  ? r === 'admin' ? 'border-red-700 text-red-400 bg-red-950/40'
                  : r === 'manager' ? 'border-amber-700 text-amber-400 bg-amber-950/40'
                  : 'border-blue-700 text-blue-400 bg-blue-950/40'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}>{r}</button>
          ))}
          <span className={`ml-auto text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
            role === 'admin' ? 'border-red-800 text-red-400 bg-red-950/40'
            : role === 'manager' ? 'border-amber-800 text-amber-400 bg-amber-950/40'
            : 'border-blue-800 text-blue-400 bg-blue-950/40'
          }`}>{role}</span>
        </div>

        {/* Branch + stats */}
        <div className="flex items-center gap-4 border border-gray-800 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <label className="text-[9px] text-gray-500">Branch</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value as Branch)}
              className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] text-gray-300 outline-none font-mono"
            >
              {(Object.keys(BRANCH_LABELS) as Branch[]).map(b => (
                <option key={b} value={b}>{BRANCH_LABELS[b]}</option>
              ))}
            </select>
          </div>
          <div className="h-6 w-px bg-gray-800" />
          <div className="flex gap-4">
            {[
              { num: stats.total, lbl: 'SKUs', cls: 'text-green-400' },
              { num: stats.low, lbl: 'Low', cls: 'text-amber-400' },
              { num: stats.transit, lbl: 'Transit', cls: 'text-blue-400' },
              { num: stats.partners, lbl: 'Partners', cls: 'text-violet-400' },
            ].map(s => (
              <div key={s.lbl} className="flex flex-col items-center">
                <span className={`text-sm font-bold font-display leading-none ${s.cls}`}>{s.num}</span>
                <span className="text-[8px] text-gray-600">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-52 rounded-lg border border-gray-800">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                {['Product', 'SKU', 'Stock', 'Status', 'Branch', role === 'viewer' ? 'Access' : 'Actions'].map(h => (
                  <th key={h} className="px-2.5 py-2 text-left text-[8px] font-bold tracking-widest uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(p => {
                const pct = Math.round(p.stock / p.max * 100);
                const badge = STATUS_BADGE[p.status];
                const branchLabel = BRANCH_LABELS[p.branch];
                return (
                  <tr key={p.sku} className="border-b border-gray-800/50 hover:bg-gray-900/40 transition-colors">
                    <td className="px-2.5 py-2 text-gray-200 font-medium">{p.name}</td>
                    <td className="px-2.5 py-2 text-gray-500 font-mono text-[9px]">{p.sku}</td>
                    <td className="px-2.5 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 font-mono w-6 text-right">{p.stock}</span>
                        <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: BAR_COLOR[p.status] }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-2.5 py-2">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border font-mono font-semibold ${badge.cls}`}>{badge.label}</span>
                    </td>
                    <td className="px-2.5 py-2 text-gray-500 text-[9px]">{branchLabel}</td>
                    <td className="px-2.5 py-2">
                      {role === 'viewer' ? (
                        <span className="text-gray-600 italic text-[9px]">view only</span>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => showToast('Stock updated')} className="text-[8px] px-1.5 py-0.5 border border-gray-700 rounded text-gray-400 hover:border-violet-500 hover:text-violet-400 font-mono transition-colors">Edit</button>
                          <button onClick={() => showToast('Reorder placed')} className="text-[8px] px-1.5 py-0.5 border border-amber-800 rounded text-amber-400 hover:bg-amber-950/40 font-mono transition-colors">Reorder</button>
                          {role === 'admin' && (
                            <button onClick={() => showToast('Deleted')} className="text-[8px] px-1.5 py-0.5 border border-red-800 rounded text-red-400 hover:bg-red-950/40 font-mono transition-colors">Del</button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2">
            {[
              { lbl: '↑ 3 in transit', cls: 'bg-blue-950/40 text-blue-400 border-blue-800' },
              { lbl: '✓ 18 delivered', cls: 'bg-green-950/40 text-green-400 border-green-800' },
              { lbl: '⏳ 2 pending', cls: 'bg-amber-950/40 text-amber-400 border-amber-800' },
            ].map(d => (
              <span key={d.lbl} className={`text-[9px] px-2 py-0.5 rounded border font-mono ${d.cls}`}>{d.lbl}</span>
            ))}
          </div>
          <span className={`text-[9px] font-mono ${note.color}`}>
            <span className="font-bold capitalize">{role}:</span> {note.text}
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-[10px] font-mono text-green-400 shadow-xl">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
