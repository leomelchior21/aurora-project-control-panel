import type { CityData } from "../types";

export interface DependencyNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

const dependencyNodes: DependencyNode[] = [
  { id: "water", label: "Water", x: 18, y: 34 },
  { id: "energy", label: "Energy", x: 48, y: 16 },
  { id: "food", label: "Food", x: 80, y: 32 },
  { id: "mobility", label: "Mobility", x: 76, y: 72 },
  { id: "housing", label: "Housing", x: 46, y: 84 },
  { id: "biodiversity", label: "Biodiversity", x: 16, y: 70 },
];

const connections: Array<[string, string]> = [
  ["water", "housing"],
  ["water", "food"],
  ["energy", "housing"],
  ["energy", "mobility"],
  ["mobility", "housing"],
  ["biodiversity", "water"],
  ["biodiversity", "food"],
  ["food", "mobility"],
];

const labelForNode = (nodeId: string) => dependencyNodes.find((node) => node.id === nodeId)?.label ?? nodeId;

const strengthForNode = (city: CityData, nodeId: string) => {
  const dependencyLabels = city.activeSystem.dependencies.map((entry) => entry.toLowerCase());
  const nodeLabel = labelForNode(nodeId).toLowerCase();

  if (city.activeSystem.name.toLowerCase() === nodeLabel || dependencyLabels.includes(nodeLabel)) {
    return "High";
  }

  if (["water", "housing", "mobility"].includes(nodeId)) {
    return city.raw.cityPressureIndex >= 75 ? "Medium" : "Watch";
  }

  return "Medium";
};

const explanationForNode = (city: CityData, nodeId: string) => {
  const label = labelForNode(nodeId);
  const dependencyLabels = city.activeSystem.dependencies;

  if (city.activeSystem.name.toLowerCase() === label.toLowerCase()) {
    return `${label} stays central because ${city.activeSystem.constraint.toLowerCase()}.`;
  }

  if (dependencyLabels.includes(label)) {
    return `${label} affects ${city.activeSystem.name.toLowerCase()} because these systems work together.`;
  }

  return `${label} still matters because city systems do not work alone.`;
};

interface SystemDependencyMapProps {
  city: CityData;
  activeNodeId: string;
  onNodeChange: (nodeId: string) => void;
}

export function dependencyNodesForCity() {
  return dependencyNodes;
}

export function SystemDependencyMap({ city, activeNodeId, onNodeChange }: SystemDependencyMapProps) {
  const activeNode = dependencyNodes.find((node) => node.id === activeNodeId) ?? dependencyNodes[0];
  const connectedSystems = connections
    .filter(([from, to]) => from === activeNode.id || to === activeNode.id)
    .map(([from, to]) => (from === activeNode.id ? labelForNode(to) : labelForNode(from)));

  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[1fr_240px]">
      <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Dependency network</p>
            <h3 className="text-lg font-semibold text-white">Connected systems</h3>
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{activeNode.label}</span>
        </div>

        <div className="relative h-[280px] rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04),_transparent_60%)]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {connections.map(([from, to]) => {
              const fromNode = dependencyNodes.find((node) => node.id === from)!;
              const toNode = dependencyNodes.find((node) => node.id === to)!;
              const linked = from === activeNode.id || to === activeNode.id;

              return (
                <line
                  key={`${from}-${to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={linked ? city.themeColor : "rgba(148,163,184,0.22)"}
                  strokeWidth={linked ? "0.8" : "0.35"}
                  strokeDasharray="2 1.5"
                />
              );
            })}
          </svg>

          {dependencyNodes.map((node) => {
            const active = node.id === activeNode.id;

            return (
              <button
                key={node.id}
                type="button"
                onMouseEnter={() => onNodeChange(node.id)}
                onFocus={() => onNodeChange(node.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.24em] transition ${
                  active
                    ? "text-white shadow-[0_0_30px_rgba(255,255,255,0.08)]"
                    : "border-white/10 bg-slate-950/85 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  backgroundColor: active ? city.themeColor : undefined,
                  borderColor: active ? city.accentSoft : undefined,
                }}
              >
                {node.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4">
        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Hover details</p>
        <h4 className="mt-2 text-xl font-semibold text-white">{activeNode.label}</h4>
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Connected systems</p>
            <p className="mt-2 text-sm text-white">{connectedSystems.join(", ")}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Pressure strength</p>
            <p className="mt-2 text-2xl font-semibold text-white">{strengthForNode(city, activeNode.id)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Reason</p>
            <p className="mt-2 text-sm text-slate-300">{explanationForNode(city, activeNode.id)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
