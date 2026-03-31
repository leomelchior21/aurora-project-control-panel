import { auroraLogo } from "../data/shared/assets";

interface LoadingScreenProps {
  progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <img src={auroraLogo} alt="Aurora Project logo" className="h-72 w-72 object-contain" />
        <div className="w-full max-w-md space-y-4">
          <div className="rounded-[24px] border border-white/10 bg-black/30 px-5 py-4 text-center backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300">Leitura crítica em andamento</p>
            <p className="mt-2 text-sm text-slate-300">Carregando falhas sistêmicas, contrastes territoriais e sinais de pressão.</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#FF3131] via-[#FF6D00] to-[#FFBF00] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-center text-[11px] uppercase tracking-[0.24em] text-slate-500">Scanner de dados: {progress}%</p>
        </div>
      </div>
    </div>
  );
}
