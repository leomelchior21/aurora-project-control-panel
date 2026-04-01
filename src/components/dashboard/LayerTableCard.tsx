import type { LayerTable } from "../../types/city";

export function LayerTableCard({ table }: { table: LayerTable }) {
  return (
    <section className="aurora-card rounded-[26px] p-5">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{table.subtitle}</p>
        <h3 className="mt-2 text-lg text-white">{table.title}</h3>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-white/10">
        <div className="grid grid-cols-[1.2fr_0.8fr_1.6fr] border-b border-white/10 bg-white/[0.04] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span>{table.columns[0]}</span>
          <span>{table.columns[1]}</span>
          <span>{table.columns[2]}</span>
        </div>
        <div className="divide-y divide-white/8">
          {table.rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[1.2fr_0.8fr_1.6fr] gap-3 px-4 py-4">
              <p className="text-sm text-white">{row.label}</p>
              <p className="text-sm font-semibold text-amber-200">{row.value}</p>
              <p className="text-sm leading-6 text-slate-300">{row.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
