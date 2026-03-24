import { useMemo, useState } from "react";
import type { CityData, CitySlug, DashboardMetric } from "../types";
import { cityLogos, cityThemes } from "../data/logos";
import { cityLayerConfigs, type DashboardLayer } from "../data/cityLayerConfigs";
import { citySignals, type CityLeveragePoint, type CitySignal, type CityTension } from "../data/citySignals";
import { cityInterventions, type Intervention } from "../data/cityInterventions";
import { SystemDependencyMap } from "./SystemDependencyMap";

interface CityDashboardProps {
  city: CityData;
  cities: CityData[];
  onBack: () => void;
  onSelectCity: (slug: CitySlug) => void;
}

type SystemLayer = Extract<
  DashboardLayer,
  "climate" | "water" | "air" | "energy" | "mobility" | "waste" | "biodiversity"
>;

type SidebarEntry = {
  id: DashboardLayer | "explore_systems";
  label: string;
  icon: string;
  hint?: string;
};

type SignalTone = "critical" | "pressure" | "opportunity" | "stability";

const sidebarEntries: SidebarEntry[] = [
  { id: "mission_brief", label: "Mission Brief", icon: "brief", hint: "Start here" },
  { id: "key_signals", label: "Key Signals", icon: "signal", hint: "What matters most" },
  { id: "system_map", label: "System Map", icon: "network", hint: "See cause and effect" },
  { id: "explore_systems", label: "Explore Systems", icon: "layers", hint: "Open a city system" },
  { id: "interventions", label: "Interventions", icon: "wrench", hint: "Choose what to change" },
  { id: "impact_simulator", label: "Impact Simulator", icon: "sliders", hint: "See what happens next" },
];

const systemLayers: Array<{
  id: SystemLayer;
  label: string;
  shortLabel: string;
  icon: string;
  question: string;
  summary: string;
  linkedMetric: DashboardMetric["id"];
  tone: SignalTone;
}> = [
  {
    id: "climate",
    label: "Climate",
    shortLabel: "Climate",
    icon: "sun",
    question: "Can daily life stay safe under this climate?",
    summary: "Heat, cold, humidity, and wind decide whether the city feels survivable outdoors.",
    linkedMetric: "climate_stress",
    tone: "pressure",
  },
  {
    id: "water",
    label: "Water",
    shortLabel: "Water",
    icon: "drop",
    question: "Can the city keep water flowing when stress rises?",
    summary: "Water pressure shapes health, food, cooling, and the city's ability to endure shocks.",
    linkedMetric: "water_pressure",
    tone: "critical",
  },
  {
    id: "air",
    label: "Air",
    shortLabel: "Air",
    icon: "air",
    question: "Does the air help people recover or add more stress?",
    summary: "Air quality, moisture, and ventilation change comfort inside homes and across streets.",
    linkedMetric: "climate_stress",
    tone: "pressure",
  },
  {
    id: "energy",
    label: "Energy",
    shortLabel: "Energy",
    icon: "bolt",
    question: "Can energy become a city advantage instead of a burden?",
    summary: "Energy can power cooling, heating, water systems, and cleaner mobility if designed well.",
    linkedMetric: "energy_potential",
    tone: "opportunity",
  },
  {
    id: "mobility",
    label: "Mobility",
    shortLabel: "Mobility",
    icon: "route",
    question: "Can people move without fighting the environment?",
    summary: "Routes, shelter, and daily exposure decide whether the city stays connected.",
    linkedMetric: "mobility_complexity",
    tone: "pressure",
  },
  {
    id: "waste",
    label: "Waste",
    shortLabel: "Waste",
    icon: "waste",
    question: "Does waste stay in a safe loop or spill into other systems?",
    summary: "Waste can become a resource, or it can overload water, streets, and public health.",
    linkedMetric: "water_pressure",
    tone: "pressure",
  },
  {
    id: "biodiversity",
    label: "Biodiversity",
    shortLabel: "Biodiversity",
    icon: "leaf",
    question: "Can the city grow without breaking the living systems around it?",
    summary: "Biodiversity protects cooling, water cycles, soil, habitat, and long-term resilience.",
    linkedMetric: "ecosystem_sensitivity",
    tone: "critical",
  },
];

const signalStyles: Record<SignalTone, { label: string; color: string; border: string; bg: string }> = {
  critical: { label: "Critical", color: "#ff6b6b", border: "rgba(255,107,107,0.45)", bg: "rgba(255,107,107,0.12)" },
  pressure: { label: "Pressure", color: "#f6c85f", border: "rgba(246,200,95,0.35)", bg: "rgba(246,200,95,0.1)" },
  opportunity: { label: "Opportunity", color: "#51d88a", border: "rgba(81,216,138,0.35)", bg: "rgba(81,216,138,0.1)" },
  stability: { label: "Stable", color: "#5cc8ff", border: "rgba(92,200,255,0.35)", bg: "rgba(92,200,255,0.1)" },
};

const impactVectors: Record<string, Partial<Record<DashboardMetric["id"], number>>> = {
  Climate: { climate_stress: -14, mobility_complexity: -6 },
  Water: { water_pressure: -18, climate_stress: -4 },
  Air: { climate_stress: -7, mobility_complexity: -4 },
  Energy: { energy_potential: 18, climate_stress: -6, water_pressure: -5 },
  Mobility: { mobility_complexity: -18, climate_stress: -4 },
  Waste: { water_pressure: -7, ecosystem_sensitivity: -9 },
  Biodiversity: { ecosystem_sensitivity: -19, climate_stress: -6, water_pressure: -5 },
};

const readableEffort: Record<Intervention["effort"], string> = {
  low: "Quick build",
  medium: "City-scale shift",
  high: "Long mission",
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

const metricById = (city: CityData, id: DashboardMetric["id"]) =>
  city.dashboardMetrics.find((metric) => metric.id === id) ?? city.dashboardMetrics[0];

const formatDelta = (value: number) => `${value > 0 ? "+" : ""}${Math.round(value)}`;

function iconFor(icon: string, active: boolean) {
  const stroke = active ? "#f8fafc" : "#7b8aa5";
  const className = "h-5 w-5 shrink-0";

  switch (icon) {
    case "brief":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M7 4h10a2 2 0 0 1 2 2v12l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "signal":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M22 12h-4l-3 8-6-16-3 8H2" />
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M8 12h8M15.5 6.5 8 10.3M8 13.7l7.5 3.8" />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="m14.7 6.3 3 3a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-8 8l-7 7a2.1 2.1 0 1 1-3-3l7-7a6 6 0 0 1 8-8Z" />
        </svg>
      );
    case "sliders":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M4 21v-7M4 10V3M12 21v-3M12 14V3M20 21v-9M20 8V3" />
          <path d="M2 14h4M10 14h4M18 8h4" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
        </svg>
      );
    case "drop":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M12 3c3 4 5 6.6 5 9.4A5 5 0 1 1 7 12.4C7 9.6 9 7 12 3Z" />
        </svg>
      );
    case "air":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M4 9h10a3 3 0 1 0-3-3" />
          <path d="M2 13h15a2.5 2.5 0 1 1-2.5 2.5" />
          <path d="M5 17h9a2 2 0 1 1-2 2" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M13 2 6 13h5l-1 9 8-12h-5V2Z" />
        </svg>
      );
    case "route":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <path d="M8 18h4a4 4 0 0 0 4-4V8" />
        </svg>
      );
    case "waste":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M5 7h14M9 4h6M7 7l1 12h8l1-12M10 11v5M14 11v5" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <path d="M12 21v-8" />
          <path d="M7 13c0-4 4-7 10-8 0 6-3 10-7 10-1.7 0-3-.7-3-2Z" />
          <path d="M12 12c0-3-2-5-6-6 0 4 2 7 5 7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke={stroke} strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="3" />
        </svg>
      );
  }
}

function Panel({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`aurora-panel rounded-[28px] border border-white/10 ${className}`} style={style}>
      {children}
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] uppercase tracking-[0.34em] text-slate-500">{children}</p>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <SectionEyebrow>Insight Layer</SectionEyebrow>
        <h2 className="mt-2 font-headline text-[clamp(1.5rem,3vw,2.4rem)] leading-none text-white">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm text-slate-300">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function StatusPill({ tone, label }: { tone: SignalTone; label: string }) {
  const style = signalStyles[tone];

  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-white/90"
      style={{ borderColor: style.border, background: style.bg }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.color }} />
      <span className="uppercase tracking-[0.2em] text-[10px] text-slate-400">{style.label}</span>
      <span>{label}</span>
    </div>
  );
}

function ScoreDial({ value, label, tone }: { value: number; label: string; tone: SignalTone }) {
  const style = signalStyles[tone];
  const angle = 220;
  const dash = (value / 100) * angle;

  return (
    <div className="relative flex h-[160px] w-[160px] items-center justify-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-[160deg]">
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeDasharray={`${angle} 360`} />
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke={style.color}
          strokeLinecap="round"
          strokeWidth="12"
          strokeDasharray={`${dash} 360`}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-[3.25rem] leading-none text-white">{value}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function SidebarSection({
  entry,
  active,
  onClick,
}: {
  entry: SidebarEntry;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[22px] border border-transparent px-3 py-3 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
      style={active ? { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.14)" } : undefined}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        {iconFor(entry.icon, active)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${active ? "text-white" : "text-slate-200"}`}>{entry.label}</p>
        {entry.hint ? <p className="truncate text-xs text-slate-500">{entry.hint}</p> : null}
      </div>
    </button>
  );
}

function MiniSystemButton({
  system,
  active,
  onClick,
}: {
  system: (typeof systemLayers)[number];
  active: boolean;
  onClick: () => void;
}) {
  const tone = signalStyles[system.tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[18px] border px-3 py-3 text-left transition hover:-translate-y-0.5 hover:border-white/20"
      style={{
        borderColor: active ? tone.border : "rgba(255,255,255,0.08)",
        background: active ? tone.bg : "rgba(255,255,255,0.03)",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          {iconFor(system.icon, active)}
        </div>
        <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: tone.color }}>
          {signalStyles[system.tone].label}
        </span>
      </div>
      <p className="text-sm font-medium text-white">{system.shortLabel}</p>
    </button>
  );
}

function ActionPrompt({
  title,
  body,
  buttonLabel,
  onClick,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4 backdrop-blur-md">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <p className="mt-3 min-h-[72px] text-sm text-slate-200">{body}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/[0.1]"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function CompareRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-200">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }} />
      </div>
    </div>
  );
}

function SignalCard({ tone, signal, onClick }: { tone: SignalTone; signal: CitySignal; onClick: () => void }) {
  const style = signalStyles[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[26px] border p-5 text-left transition hover:-translate-y-1"
      style={{ borderColor: style.border, background: `linear-gradient(180deg, ${style.bg}, rgba(255,255,255,0.02))` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: style.color }}>
          {style.label}
        </span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
          {signal.system}
        </span>
      </div>
      <h3 className="mt-4 font-headline text-[clamp(1.4rem,2.2vw,1.9rem)] leading-none text-white">{signal.headline}</h3>
      <p className="mt-3 text-sm text-slate-300">{signal.detail}</p>
      <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-slate-400">Click to investigate this system</p>
    </button>
  );
}

function TensionCard({ tension }: { tension: CityTension }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-rose-400/35 bg-rose-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-rose-200">
          Tension
        </span>
        <h4 className="text-base text-white">
          {tension.a} vs {tension.b}
        </h4>
      </div>
      <p className="mt-3 text-sm text-slate-300">{tension.description}</p>
    </div>
  );
}

function LeverageCard({ point }: { point: CityLeveragePoint }) {
  return (
    <div className="rounded-[22px] border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-200/80">{point.system}</p>
          <h4 className="mt-2 text-lg text-white">{point.name}</h4>
        </div>
        <span className="font-display text-3xl text-emerald-200">{point.potential}</span>
      </div>
      <p className="mt-3 text-sm text-slate-300">{point.why}</p>
    </div>
  );
}

function PressureCompare({
  label,
  current,
  cities,
  city,
}: {
  label: string;
  current: number;
  cities: CityData[];
  city: CityData;
}) {
  const values = cities.map((entry) => ({
    label: entry.city,
    value:
      label === "Climate"
        ? metricById(entry, "climate_stress").value
        : label === "Water"
          ? metricById(entry, "water_pressure").value
          : label === "Mobility"
            ? metricById(entry, "mobility_complexity").value
            : metricById(entry, "ecosystem_sensitivity").value,
    color: entry.slug === city.slug ? entry.themeColor : "rgba(148,163,184,0.55)",
  }));

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white">{label}</p>
        <p className="text-sm text-slate-400">Current: {current}</p>
      </div>
      <div className="grid gap-3">
        {values.map((value) => (
          <CompareRow key={value.label} label={value.label} value={value.value} color={value.color} />
        ))}
      </div>
    </div>
  );
}

function RelationalChart({
  title,
  subtitle,
  items,
  color,
}: {
  title: string;
  subtitle: string;
  items: Array<{ label: string; value: number }>;
  color: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{subtitle}</p>
      <h3 className="mt-2 text-xl text-white">{title}</h3>
      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-200">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function MissionBriefLayer({
  city,
  cities,
  balanceScore,
  onNavigate,
}: {
  city: CityData;
  cities: CityData[];
  balanceScore: number;
  onNavigate: (layer: DashboardLayer) => void;
}) {
  const signals = citySignals[city.slug];
  const overview = cityLayerConfigs[city.slug].overview;
  const otherCities = cities.filter((entry) => entry.slug !== city.slug);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
      <Panel className="overflow-hidden">
        <div className="relative min-h-[420px] p-6 md:p-8">
          <img src={city.missionBriefHeroImage} alt={city.city} className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.9),rgba(2,6,23,0.45),rgba(2,6,23,0.9))]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <SectionEyebrow>Mission Brief</SectionEyebrow>
              <h2 className="mt-3 max-w-3xl font-headline text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.92] text-white">
                {city.investigativePrompt}
              </h2>
              <p className="mt-4 max-w-2xl text-base text-slate-200">{city.missionBriefText}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <ActionPrompt
                title="What is happening?"
                body={signals.critical.detail}
                buttonLabel="See key signals"
                onClick={() => onNavigate("key_signals")}
              />
              <ActionPrompt
                title="Why does it matter?"
                body={`${signals.pressure.detail} ${city.secondaryRisk}`}
                buttonLabel="Open system map"
                onClick={() => onNavigate("system_map")}
              />
              <ActionPrompt
                title="What should I do?"
                body={`Push ${signals.opportunity.headline.toLowerCase()} first and test the effect before scaling.`}
                buttonLabel="Try interventions"
                onClick={() => onNavigate("interventions")}
              />
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4">
        <Panel className="p-6">
          <SectionEyebrow>Current Read</SectionEyebrow>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <ScoreDial value={balanceScore} label="City Balance Score" tone={balanceScore >= 60 ? "stability" : balanceScore >= 40 ? "pressure" : "critical"} />
            <div className="min-w-[220px] flex-1">
              <p className="text-sm text-slate-300">
                This score answers one question: how hard is it for the city to stay in balance right now?
              </p>
              <div className="mt-4 grid gap-3">
                {overview.snapshot.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-base text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <SectionEyebrow>Compare The Cities</SectionEyebrow>
          <div className="mt-4 grid gap-4">
            <CompareRow label={city.city} value={balanceScore} color={city.themeColor} />
            {otherCities.map((entry) => (
              <CompareRow
                key={entry.slug}
                label={entry.city}
                value={citySignals[entry.slug].resilience_score}
                color={entry.themeColor}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KeySignalsLayer({
  city,
  cities,
  balanceScore,
  onNavigate,
}: {
  city: CityData;
  cities: CityData[];
  balanceScore: number;
  onNavigate: (layer: DashboardLayer) => void;
}) {
  const signals = citySignals[city.slug];
  const overview = cityLayerConfigs[city.slug].overview;

  return (
    <div className="grid gap-4">
      <Panel className="p-6">
        <SectionTitle
          title="The city is telling you where to look first."
          subtitle="Signals replace neutral metrics. Each one points to a tension, a reason, and a move you can test."
        />
        <div className="grid gap-4 xl:grid-cols-3">
          <SignalCard tone="critical" signal={signals.critical} onClick={() => onNavigate(signals.critical.system as DashboardLayer)} />
          <SignalCard tone="pressure" signal={signals.pressure} onClick={() => onNavigate(signals.pressure.system as DashboardLayer)} />
          <SignalCard tone="opportunity" signal={signals.opportunity} onClick={() => onNavigate(signals.opportunity.system as DashboardLayer)} />
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <SectionEyebrow>Top Tensions</SectionEyebrow>
              <h3 className="mt-2 font-headline text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-white">Where the city is pulling against itself</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Balance score {balanceScore}
            </span>
          </div>
          <div className="grid gap-3">
            {signals.tensions.map((tension) => (
              <TensionCard key={`${tension.a}-${tension.b}`} tension={tension} />
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <SectionEyebrow>Leverage Points</SectionEyebrow>
          <h3 className="mt-2 font-headline text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-white">Where one move can change many systems</h3>
          <div className="mt-5 grid gap-3">
            {signals.leverage_points.map((point) => (
              <LeverageCard key={point.name} point={point} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel className="p-6">
          <SectionEyebrow>Pressure Mix</SectionEyebrow>
          <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.4vw,2rem)] text-white">What this city struggles with compared with the others</h3>
          <div className="mt-5 grid gap-4">
            {overview.pressureMix.map((item) => (
              <PressureCompare key={item.label} label={item.label} current={item.value} cities={cities} city={city} />
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <SectionEyebrow>Best Next Step</SectionEyebrow>
          <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.4vw,2rem)] text-white">You do not need to fix everything at once.</h3>
          <p className="mt-3 text-sm text-slate-300">
            Start with the strongest leverage point, then check the system map to see what it touches before you simulate it.
          </p>
          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Recommended first move</p>
            <p className="mt-3 text-2xl text-white">{signals.leverage_points[0]?.name}</p>
            <p className="mt-2 text-sm text-slate-300">{signals.leverage_points[0]?.why}</p>
            <button
              type="button"
              onClick={() => onNavigate("impact_simulator")}
              className="mt-5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/[0.1]"
            >
              Simulate this move
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SystemNarrativeLayer({
  city,
  layer,
  onNavigate,
}: {
  city: CityData;
  layer: SystemLayer;
  onNavigate: (layer: DashboardLayer) => void;
}) {
  const meta = systemLayers.find((entry) => entry.id === layer) ?? systemLayers[0];
  const config = cityLayerConfigs[city.slug][layer];
  const metricValue = metricById(city, meta.linkedMetric).value;
  const tone = signalStyles[meta.tone];
  const primarySeries =
    "distribution" in config
      ? config.distribution
      : "storageVsDemand" in config
        ? config.storageVsDemand
        : "airQualityDrivers" in config
          ? config.airQualityDrivers
          : "generationVsDemand" in config
            ? config.generationVsDemand
            : "routeExposure" in config
              ? config.routeExposure
              : "wasteFlow" in config
                ? config.wasteFlow
                : config.habitatPressure;
  const secondarySeries =
    "comfort" in config
      ? config.comfort.map((item) => ({ label: item.label, value: item.value }))
      : "riskCards" in config
        ? config.riskCards.map((item) => ({ label: item.label, value: item.value }))
        : "watchpoints" in config
          ? config.watchpoints.map((item) => ({ label: item.label, value: item.value }))
          : "thermalLinks" in config
            ? config.thermalLinks.map((item) => ({ label: item.label, value: item.value }))
            : "routines" in config
              ? config.routines.map((item) => ({ label: item.label, value: item.value }))
              : "preservation" in config
                ? config.preservation.map((item) => ({ label: item.label, value: item.value }))
                : [];
  const linkedSystems = "linkedSystems" in config ? config.linkedSystems : [];

  return (
    <div className="grid gap-4">
      <Panel className="p-6">
        <SectionTitle title={meta.question} subtitle={meta.summary} />
        <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[24px] border p-5" style={{ borderColor: tone.border, background: tone.bg }}>
            <p className="text-[10px] uppercase tracking-[0.26em]" style={{ color: tone.color }}>
              System reading
            </p>
            <p className="mt-4 font-display text-[4rem] leading-none text-white">{metricValue}</p>
            <p className="mt-2 text-sm text-slate-300">
              {meta.tone === "opportunity"
                ? "Higher means this city has more room to turn this system into an advantage."
                : "Higher means this system is creating more pressure on everyday life."}
            </p>
            <button
              type="button"
              onClick={() => onNavigate("impact_simulator")}
              className="mt-5 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-black/30"
            >
              Test this in the simulator
            </button>
          </div>
          <RelationalChart
            title="What is driving this system?"
            subtitle="These forces pull the system toward pressure or possibility."
            items={primarySeries}
            color={tone.color}
          />
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel className="p-6">
          <SectionEyebrow>Why It Matters</SectionEyebrow>
          <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.3vw,2rem)] text-white">This system never acts alone.</h3>
          <div className="mt-5 grid gap-3">
            {secondarySeries.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-sm text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <SectionEyebrow>Cause And Effect</SectionEyebrow>
          <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.3vw,2rem)] text-white">If this system changes, these systems move with it.</h3>
          <div className="mt-5 grid gap-3">
            {linkedSystems.map((linked) => (
              <div key={linked} className="flex items-start justify-between gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-sm text-white">{linked}</p>
                  <p className="mt-1 text-sm text-slate-400">This system is directly affected when {meta.shortLabel.toLowerCase()} improves or fails.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">
                  linked
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function InterventionCard({
  intervention,
  value,
  onToggle,
  onChange,
}: {
  intervention: Intervention;
  value: number;
  onToggle: () => void;
  onChange: (value: number) => void;
}) {
  const tone = signalStyles[
    intervention.signalType === "critical" ? "critical" : intervention.signalType === "pressure" ? "pressure" : "opportunity"
  ];

  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em]" style={{ color: tone.color }}>
            {tone.label}
          </p>
          <h3 className="mt-2 text-2xl text-white">{intervention.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{intervention.tagline}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white transition"
          style={{ background: value > 0 ? tone.bg : "rgba(255,255,255,0.03)" }}
        >
          {value > 0 ? "Active" : "Enable"}
        </button>
      </div>

      <p className="mt-4 text-sm text-slate-300">{intervention.description}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatChip label="Effort" value={readableEffort[intervention.effort]} />
        <StatChip label="Timeframe" value={intervention.timeframe.replace(/â€“/g, "-")} />
        <StatChip label="Impact" value={`${intervention.impactScore}`} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-300">Intervention strength</p>
          <p className="text-sm font-semibold text-white">{value}%</p>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="aurora-range w-full"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {intervention.systemsHelped.map((system) => (
          <span key={system} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-slate-300">
            {system}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function InterventionsLayer({
  city,
  selected,
  onToggle,
  onIntensityChange,
  onNavigate,
}: {
  city: CityData;
  selected: Record<string, number>;
  onToggle: (id: string) => void;
  onIntensityChange: (id: string, value: number) => void;
  onNavigate: (layer: DashboardLayer) => void;
}) {
  const interventions = cityInterventions[city.slug];
  const activeCount = interventions.filter((item) => selected[item.id] > 0).length;

  return (
    <div className="grid gap-4">
      <Panel className="p-6">
        <SectionTitle
          title="Choose a city move, not just a metric."
          subtitle="Each intervention is a design decision. Turn one on, tune its strength, then test the tradeoffs."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone="opportunity" label={`${activeCount} active interventions`} />
          <StatusPill tone="pressure" label="Hover cards to understand tradeoffs" />
          <StatusPill tone="stability" label="Next step: run the simulator" />
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {interventions.map((intervention) => (
          <InterventionCard
            key={intervention.id}
            intervention={intervention}
            value={selected[intervention.id] ?? 0}
            onToggle={() => onToggle(intervention.id)}
            onChange={(value) => onIntensityChange(intervention.id, value)}
          />
        ))}
      </div>

      <Panel className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <SectionEyebrow>Ready To Test</SectionEyebrow>
            <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.3vw,2rem)] text-white">See whether your package actually helps the city.</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("impact_simulator")}
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/[0.1]"
          >
            Open impact simulator
          </button>
        </div>
      </Panel>
    </div>
  );
}

function BeforeAfterRow({
  label,
  current,
  next,
  positive,
}: {
  label: string;
  current: number;
  next: number;
  positive: boolean;
}) {
  const gotBetter = positive ? next >= current : next <= current;
  const color = gotBetter ? "#51d88a" : "#ff6b6b";

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-white">{label}</p>
        <span className="text-sm font-semibold" style={{ color }}>
          {formatDelta(next - current)}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <MetricBar label="Now" value={current} color="rgba(148,163,184,0.7)" />
        <span className="text-center text-sm text-slate-500">to</span>
        <MetricBar label="After" value={next} color={color} />
      </div>
    </div>
  );
}

function ImpactSimulatorLayer({
  city,
  selected,
}: {
  city: CityData;
  selected: Record<string, number>;
}) {
  const interventions = cityInterventions[city.slug];
  const activeInterventions = interventions.filter((item) => (selected[item.id] ?? 0) > 0);
  const baseMetrics = city.dashboardMetrics.reduce<Record<DashboardMetric["id"], number>>((acc, metric) => {
    acc[metric.id] = metric.value;
    return acc;
  }, {} as Record<DashboardMetric["id"], number>);

  const simulatedMetrics = activeInterventions.reduce<Record<DashboardMetric["id"], number>>((acc, intervention) => {
    const intensity = (selected[intervention.id] ?? 0) / 100;
    const strength = intensity * (intervention.impactScore / 100);

    intervention.systemsHelped.forEach((system) => {
      const vector = impactVectors[system];
      if (!vector) {
        return;
      }

      Object.entries(vector).forEach(([metricId, delta]) => {
        acc[metricId as DashboardMetric["id"]] = clamp(acc[metricId as DashboardMetric["id"]] + delta * strength);
      });
    });

    return acc;
  }, { ...baseMetrics });

  const baseBalance = citySignals[city.slug].resilience_score;
  const pressureShift =
    (baseMetrics.climate_stress - simulatedMetrics.climate_stress) * 0.18 +
    (baseMetrics.water_pressure - simulatedMetrics.water_pressure) * 0.28 +
    (simulatedMetrics.energy_potential - baseMetrics.energy_potential) * 0.24 +
    (baseMetrics.ecosystem_sensitivity - simulatedMetrics.ecosystem_sensitivity) * 0.18 +
    (baseMetrics.mobility_complexity - simulatedMetrics.mobility_complexity) * 0.12;
  const simulatedBalance = clamp(baseBalance + pressureShift);
  const successRate = activeInterventions.length === 0 ? 0 : clamp((simulatedBalance - baseBalance) * 4.5 + 50);

  const changes = city.dashboardMetrics.map((metric) => ({
    ...metric,
    next: simulatedMetrics[metric.id],
  }));

  const consequenceLines =
    activeInterventions.length === 0
      ? ["No intervention is active yet, so the city stays on its current path."]
      : [
          `${activeInterventions[0]?.name} is the main driver of change right now.`,
          simulatedMetrics.water_pressure < baseMetrics.water_pressure
            ? "Water pressure drops, which makes the city easier to stabilize."
            : "Water pressure is still high, so survival remains difficult during shocks.",
          simulatedMetrics.energy_potential > baseMetrics.energy_potential
            ? "Energy becomes more useful as a leverage system instead of only a demand problem."
            : "Energy is not improving enough to unlock wider system gains yet.",
        ];

  return (
    <div className="grid gap-4">
      <Panel className="p-6">
        <SectionTitle
          title="See the city react before you commit."
          subtitle="This simulator turns your intervention package into a predicted shift in pressure, opportunity, and city balance."
        />
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <SectionEyebrow>Scenario Result</SectionEyebrow>
            <div className="mt-4 flex flex-wrap items-center gap-6">
              <ScoreDial value={simulatedBalance} label="Projected balance" tone={simulatedBalance >= baseBalance ? "stability" : "critical"} />
              <div className="grid gap-3">
                <StatChip label="Current score" value={`${baseBalance}`} />
                <StatChip label="Projected shift" value={formatDelta(simulatedBalance - baseBalance)} />
                <StatChip label="Success rate" value={`${successRate}%`} />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <SectionEyebrow>Consequence Readout</SectionEyebrow>
            <div className="mt-4 grid gap-3">
              {consequenceLines.map((line) => (
                <div key={line} className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="p-6">
        <SectionEyebrow>Before Vs After</SectionEyebrow>
        <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.3vw,2rem)] text-white">What shifts when your plan goes live</h3>
        <div className="mt-5 grid gap-4">
          {changes.map((item) => (
            <BeforeAfterRow
              key={item.id}
              label={item.label}
              current={item.value}
              next={item.next}
              positive={item.id === "energy_potential"}
            />
          ))}
        </div>
      </Panel>

      <Panel className="p-6">
        <SectionEyebrow>Active Package</SectionEyebrow>
        <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.3vw,2rem)] text-white">The interventions shaping this scenario</h3>
        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {activeInterventions.length > 0 ? (
            activeInterventions.map((intervention) => (
              <div key={intervention.id} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-lg text-white">{intervention.name}</p>
                <p className="mt-2 text-sm text-slate-300">{intervention.description}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-slate-500">Strength {selected[intervention.id]}%</p>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-300 xl:col-span-3">
              Activate at least one intervention to generate a meaningful scenario.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

function StatusStripCard({
  tone,
  title,
  text,
  detail,
}: {
  tone: SignalTone;
  title: string;
  text: string;
  detail: string;
}) {
  const style = signalStyles[tone];

  return (
    <Panel className="p-4" style={{ background: `linear-gradient(180deg, ${style.bg}, rgba(2,6,23,0.22))` }}>
      <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: style.color }}>
        {title}
      </p>
      <h3 className="mt-3 text-xl text-white">{text}</h3>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </Panel>
  );
}

function SidebarContent({
  activeLayer,
  focusedSystem,
  onSelectLayer,
  onClose,
}: {
  activeLayer: DashboardLayer;
  focusedSystem: SystemLayer;
  onSelectLayer: (layer: DashboardLayer) => void;
  onClose?: () => void;
}) {
  return (
    <Panel className="h-full overflow-auto p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <SectionEyebrow>Thinking Flow</SectionEyebrow>
          <h2 className="mt-2 font-headline text-[clamp(1.4rem,2vw,1.8rem)] text-white">Navigate by decisions</h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white"
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="grid gap-2">
        {sidebarEntries.map((entry) =>
          entry.id === "explore_systems" ? (
            <div key={entry.id} className="rounded-[24px] border border-white/10 bg-white/[0.02] p-3">
              <div className="mb-3 flex items-center gap-3 px-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  {iconFor(entry.icon, false)}
                </div>
                <div>
                  <p className="text-sm text-white">{entry.label}</p>
                  <p className="text-xs text-slate-500">{entry.hint}</p>
                </div>
              </div>
              <div className="grid gap-2">
                {systemLayers.map((system) => (
                  <MiniSystemButton
                    key={system.id}
                    system={system}
                    active={activeLayer === system.id || focusedSystem === system.id}
                    onClick={() => onSelectLayer(system.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <SidebarSection
              key={entry.id}
              entry={entry}
              active={activeLayer === entry.id}
              onClick={() => onSelectLayer(entry.id as DashboardLayer)}
            />
          ),
        )}
      </div>
    </Panel>
  );
}

export function CityDashboard({ city, cities, onBack, onSelectCity }: CityDashboardProps) {
  const theme = cityThemes[city.slug];
  const signals = citySignals[city.slug];
  const [activeLayer, setActiveLayer] = useState<DashboardLayer>("mission_brief");
  const [focusedSystem, setFocusedSystem] = useState<SystemLayer>(signals.critical.system as SystemLayer);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInterventions, setSelectedInterventions] = useState<Record<string, number>>(
    Object.fromEntries(cityInterventions[city.slug].map((intervention, index) => [intervention.id, index === 0 ? 70 : 0])),
  );

  const balanceScore = signals.resilience_score;
  const cityTone: SignalTone = balanceScore >= 65 ? "stability" : balanceScore >= 45 ? "pressure" : "critical";

  const handleLayerChange = (layer: DashboardLayer) => {
    if (systemLayers.some((entry) => entry.id === layer)) {
      setFocusedSystem(layer as SystemLayer);
    }
    setActiveLayer(layer);
    setSidebarOpen(false);
  };

  const toggleIntervention = (id: string) => {
    setSelectedInterventions((current) => ({ ...current, [id]: current[id] > 0 ? 0 : 70 }));
  };

  const updateIntervention = (id: string, value: number) => {
    setSelectedInterventions((current) => ({ ...current, [id]: value }));
  };

  const currentLayerLabel = useMemo(() => {
    if (systemLayers.some((entry) => entry.id === activeLayer)) {
      return `Explore Systems / ${systemLayers.find((entry) => entry.id === activeLayer)?.label}`;
    }
    return sidebarEntries.find((entry) => entry.id === activeLayer)?.label ?? "Mission Brief";
  }, [activeLayer]);

  const renderActiveLayer = () => {
    switch (activeLayer) {
      case "mission_brief":
        return <MissionBriefLayer city={city} cities={cities} balanceScore={balanceScore} onNavigate={handleLayerChange} />;
      case "key_signals":
        return <KeySignalsLayer city={city} cities={cities} balanceScore={balanceScore} onNavigate={handleLayerChange} />;
      case "system_map":
        return (
          <div className="grid gap-4">
            <Panel className="p-6">
              <SectionTitle
                title="The city behaves like a web, not a stack of separate cards."
                subtitle="Hover or click a node to see how one pressure spreads across the rest of urban life."
              />
              <SystemDependencyMap city={city} activeNodeId={focusedSystem} onNodeChange={(nodeId) => setFocusedSystem(nodeId as SystemLayer)} />
            </Panel>
            <Panel className="p-6">
              <SectionEyebrow>Next Step</SectionEyebrow>
              <h3 className="mt-2 font-headline text-[clamp(1.5rem,2.3vw,2rem)] text-white">Open the most fragile system, then test an intervention.</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {systemLayers.map((system) => (
                  <button
                    key={system.id}
                    type="button"
                    onClick={() => handleLayerChange(system.id)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/[0.08]"
                  >
                    {system.label}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        );
      case "interventions":
        return (
          <InterventionsLayer
            city={city}
            selected={selectedInterventions}
            onToggle={toggleIntervention}
            onIntensityChange={updateIntervention}
            onNavigate={handleLayerChange}
          />
        );
      case "impact_simulator":
        return <ImpactSimulatorLayer city={city} selected={selectedInterventions} />;
      default:
        return <SystemNarrativeLayer city={city} layer={activeLayer as SystemLayer} onNavigate={handleLayerChange} />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden p-3">
      <div className="dashboard-shell aurora-grid mx-auto max-w-[1780px] rounded-[32px] border border-white/10 p-3 shadow-aurora lg:grid lg:min-h-[calc(100vh-1.5rem)] lg:grid-rows-[auto_1fr]">
        <header className="rounded-[28px] border border-white/10 bg-slate-950/40 px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-start gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white lg:hidden"
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div className="flex min-w-0 flex-1 items-start gap-4">
              <img src={cityLogos[city.slug]} alt={city.city} className="mt-1 h-12 w-12 shrink-0 object-contain" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] uppercase tracking-[0.34em] text-slate-500">Aurora Project</p>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-slate-400">
                    {city.biome}
                  </span>
                </div>
                <h1 className="mt-2 font-headline text-[clamp(2.2rem,4vw,4rem)] leading-none text-white">{city.city}</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-300">{city.tagline}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">{currentLayerLabel}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/[0.08]"
              >
                Back to cities
              </button>
              {cities.map((entry) => (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => onSelectCity(entry.slug)}
                  className="rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition"
                  style={{
                    borderColor: entry.slug === city.slug ? theme.secondary : "rgba(255,255,255,0.1)",
                    background: entry.slug === city.slug ? `${theme.primary}24` : "rgba(255,255,255,0.03)",
                    color: "#fff",
                  }}
                >
                  {entry.city}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_1.2fr_1.2fr_0.9fr]">
            <StatusStripCard tone="critical" title="Critical issue" text={signals.critical.headline} detail={signals.critical.detail} />
            <StatusStripCard tone="pressure" title="Main pressure" text={signals.pressure.headline} detail={signals.pressure.detail} />
            <StatusStripCard tone="opportunity" title="Best opportunity" text={signals.opportunity.headline} detail={signals.opportunity.detail} />
            <Panel className="flex items-center justify-center p-4">
              <ScoreDial value={balanceScore} label="City Balance Score" tone={cityTone} />
            </Panel>
          </div>
        </header>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden">
            <div className="h-full w-[min(88vw,360px)] border-r border-white/10 bg-slate-950/95 p-4">
              <SidebarContent activeLayer={activeLayer} focusedSystem={focusedSystem} onClose={() => setSidebarOpen(false)} onSelectLayer={handleLayerChange} />
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 pt-4 lg:min-h-0 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="hidden min-h-0 lg:block">
            <SidebarContent activeLayer={activeLayer} focusedSystem={focusedSystem} onSelectLayer={handleLayerChange} />
          </aside>
          <main className="scrollbar-thin pr-1 lg:min-h-0 lg:overflow-auto">{renderActiveLayer()}</main>
        </div>
      </div>
    </div>
  );
}
