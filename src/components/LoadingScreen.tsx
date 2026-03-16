import { auroraLogo } from "../data/logos";

interface LoadingScreenProps {
  progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass flex w-full max-w-xl flex-col items-center gap-8 rounded-[28px] border border-white/10 p-10 shadow-aurora">
        <img src={auroraLogo} alt="Aurora Project logo" className="h-80 w-80 object-contain" />
        <div className="w-full">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
