import { useEffect, useMemo, useState } from "react";

function jitterFor(label: string) {
  const seed = label.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (seed % 3) + 1;
}

function varyValue(value: string, amount: number) {
  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match) return value;

  const raw = match[0];
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return value;

  const next = raw.includes(".") ? `${(parsed + amount / 10).toFixed(1)}` : `${Math.round(parsed + amount)}`;
  return value.replace(raw, next);
}

export function LiveValue({ value, label }: { value: string; label: string }) {
  const [tick, setTick] = useState(0);
  const delta = useMemo(() => jitterFor(label), [label]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((current) => (current + 1) % 3);
    }, 2400);

    return () => window.clearInterval(interval);
  }, []);

  if (!/\d/.test(value)) return <>{value}</>;

  const amount = tick === 0 ? 0 : tick === 1 ? delta : -delta;
  return <>{varyValue(value, amount)}</>;
}
