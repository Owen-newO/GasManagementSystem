interface AuthLandingProps {
  onLogin: () => void;
  onResidentRegister: () => void;
}

export default function AuthLanding({ onLogin, onResidentRegister }: AuthLandingProps) {
  return (
    <div className="flex flex-col md:flex-row h-dvh md:min-h-dvh">

      {/* ── Left — Branded panel ── */}
      <div className="relative flex-1 md:flex-none md:w-1/2 bg-primary-container banig-pattern-white flex flex-col items-center justify-center px-10 py-10 md:py-16 overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/5 pointer-events-none" />

        {/* Icon */}
        <div className="relative z-10 w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-5 md:mb-6 shadow-2xl">
          <span className="material-symbols-outlined text-yellow-400 icon-fill text-[48px] md:text-[52px]">
            local_gas_station
          </span>
        </div>

        {/* Brand name */}
        <p className="relative z-10 text-on-primary-container text-[11px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">
          Official Portal
        </p>
        <h1 className="relative z-10 font-headline font-black text-white text-4xl md:text-5xl tracking-[0.15em] uppercase mb-2 md:mb-3">
          A.G.A.S.
        </h1>
        <p className="relative z-10 text-white/60 text-sm text-center max-w-[280px] leading-relaxed mb-1">
          Access to Goods and Assistance System
        </p>
        <p className="relative z-10 text-white/40 text-xs tracking-widest uppercase">
          Cebu City
        </p>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/0 via-yellow-400/60 to-yellow-400/0" />
      </div>

      {/* ── Right — Login panel ── */}
      <div className="md:w-1/2 bg-background flex flex-col items-center justify-center px-8 py-10 md:py-12">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-headline font-extrabold text-primary text-3xl leading-tight">
              Get Started
            </h2>
            <p className="text-on-surface-variant text-sm mt-1.5">
              Sign in to access your portal.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={onLogin}
              className="w-full bg-primary-container text-white font-headline font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Sign In
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs text-on-surface-variant">New here?</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <button
              onClick={onResidentRegister}
              className="w-full bg-tertiary text-on-tertiary font-headline font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Register
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-outline mt-10">
            © 2026 Mata Technologies Inc. · A.G.A.S
          </p>
        </div>
      </div>

    </div>
  );
}
