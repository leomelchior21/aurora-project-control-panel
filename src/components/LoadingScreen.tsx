import { auroraLogo } from "../data/logos";

interface LoadingScreenProps {
  progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <img src={auroraLogo} alt="Aurora Project logo" className="h-72 w-72 object-contain" />
        <div className="w-full max-w-sm">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
