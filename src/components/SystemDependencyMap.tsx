import type { CityData } from "../types";

const nodes = [
  { id: "climate", label: "Climate", x: 18, y: 20 },
  { id: "water", label: "Water", x: 50, y: 12 },
  { id: "air", label: "Air", x: 79, y: 22 },
  { id: "energy", label: "Energy", x: 83, y: 50 },
  { id: "mobility", label: "Mobility", x: 67, y: 80 },
  { id: "waste", label: "Waste", x: 34, y: 82 },
  { id: "biodiversity", label: "Biodiversity", x: 14, y: 56 },
] as const;

const connections: Array<[NodeId, NodeId]> = [
  ["climate", "water"],
  ["climate", "air"],
  ["climate", "energy"],
  ["water", "energy"],
  ["water", "biodiversity"],
  ["water", "waste"],
  ["air", "mobility"],
  ["energy", "mobility"],
  ["energy", "waste"],
  ["mobility", "waste"],
  ["mobility", "biodiversity"],
  ["waste", "biodiversity"],
];

type NodeId = (typeof nodes)[number]["id"];

const nodeExplanations: Record<NodeId, string> = {
  climate: "Climate changes heat, cold, rain, and comfort across the whole city.",
  water: "Water pressure decides survival, health, cooling, and how resilient daily life feels.",
  air: "Air quality and ventilation shape indoor comfort, street exposure, and recovery.",
  energy: "Energy can reduce pressure when it powers cooling, heating, pumping, and cleaner services.",
  mobility: "Mobility reveals whether people can actually reach school, work, and shelter safely.",
  waste: "Waste tells you whether the city is keeping materials in a loop or leaking pressure into other systems.",
  biodiversity: "Biodiversity protects shade, water cycles, habitat, and long-term urban balance.",
};

interface SystemDependencyMapProps {
  city: CityData;
  activeNodeId: string;
  onNodeChange: (nodeId: string) => void;
}

export function SystemDependencyMap({ city, activeNodeId, onNodeChange }: SystemDependencyMapProps) {
  const activeNode = nodes.find((node) => node.id === activeNodeId) ?? nodes[0];
  const connectedNodes = connections
    .filter(([from, to]) => from === activeNode.id || to === activeNode.id)
    .map(([from, to]) => (from === activeNode.id ? to : from));

  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">System Snapshot</p>
            <h3 className="mt-2 text-2xl text-white">How pressure travels through the city</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">
            Hover or click
          </span>
        </div>

        <div className="relative h-[360px] rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_65%)]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map(([from, to]) => {
              const fromNode = nodes.find((node) => node.id === from)!;
              const toNode = nodes.find((node) => node.id === to)!;
              const active = from === activeNode.id || to === activeNode.id;

              return (
                <line
                  key={`${from}-${to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={active ? city.themeColor : "rgba(148,163,184,0.15)"}
                  strokeWidth={active ? "1.6" : "0.7"}
                  strokeDasharray={active ? "3 1.5" : "2 2.5"}
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const active = node.id === activeNode.id;
            const connected = connectedNodes.includes(node.id);

            return (
              <button
                key={node.id}
                type="button"
                onMouseEnter={() => onNodeChange(node.id)}
                onFocus={() => onNodeChange(node.id)}
                onClick={() => onNodeChange(node.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-3 text-[10px] uppercase tracking-[0.24em] transition"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  color: "#fff",
                  borderColor: active ? city.accentSoft : connected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)",
                  background: active ? city.themeColor : connected ? "rgba(255,255,255,0.08)" : "rgba(2,6,23,0.82)",
                  boxShadow: active ? `0 0 30px ${city.glowColor}` : "none",
                }}
              >
                {node.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Active Node</p>
          <h3 className="mt-2 text-2xl text-white">{activeNode.label}</h3>
          <p className="mt-3 text-sm text-slate-300">{nodeExplanations[activeNode.id]}</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Impact Chain</p>
          <div className="mt-4 grid gap-3">
            {connectedNodes.map((id) => (
              <div key={id} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm text-white">{activeNode.label} affects {nodes.find((node) => node.id === id)?.label}</p>
                <p className="mt-1 text-sm text-slate-400">A change here will push pressure or relief into that system next.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Why This Matters</p>
          <p className="mt-3 text-sm text-slate-300">
            Students can use this map to explain why a city problem is never isolated and why one intervention can create several consequences.
          </p>
        </div>
      </div>
    </div>
  );
}
