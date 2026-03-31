import { useEffect, useState } from "react";

function hasDigits(value: string) {
  return /\d/.test(value);
}

function scrambleDigits(value: string, settleRatio: number) {
  return value
    .split("")
    .map((character) => {
      if (!/\d/.test(character)) return character;
      return Math.random() <= settleRatio ? character : String(Math.floor(Math.random() * 10));
    })
    .join("");
}

export function LiveValue({ value, label }: { value: string; label: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);

    if (!hasDigits(value)) return;

    let tick = 0;
    const totalTicks = 10;
    const interval = window.setInterval(() => {
      tick += 1;

      if (tick >= totalTicks) {
        setDisplayValue(value);
        window.clearInterval(interval);
        return;
      }

      setDisplayValue(scrambleDigits(value, tick / totalTicks));
    }, 45);

    return () => window.clearInterval(interval);
  }, [value]);

  return <span aria-label={`${label}: ${value}`}>{displayValue}</span>;
}
