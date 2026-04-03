import { useState } from "react";
import { login as authLogin } from "../services/authService";
import type { AuthUser, Role } from "../services/authService";

interface LoginProps {
  onBack: () => void;
  onSuccess: (user: AuthUser, token: string | undefined, role: Role | undefined) => void;
}

export default function Login({ onBack, onSuccess }: LoginProps) {
  const [form, setForm] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotView, setForgotView] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetSent, setResetSent] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) { setError("All fields are required."); return; }
    setLoading(true);
    const result = await authLogin({ email: form.email.trim(), password: form.password });
    setLoading(false);
    if (!result.success) { setError(result.error ?? "Login failed."); return; }
    onSuccess(result.user!, result.token, result.role);
  };

  const handleResetSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!resetEmail.trim()) { setError("Please enter your email address."); return; }
    setResetSent(true);
    setError("");
  };

  const handleBackToLogin = (): void => {
    setForgotView(false);
    setResetSent(false);
    setResetEmail("");
    setError("");
  };

  /* Mobile: original theme styles → Desktop: clean bordered card style */
  const inputCls = "w-full bg-surface-container-lowest md:bg-white border border-outline-variant md:border-slate-300 rounded-xl md:rounded-lg py-3.5 md:py-3 px-4 text-sm focus:outline-none focus:border-primary-container md:focus:border-[#003366] focus:ring-2 focus:ring-primary-container/20 md:focus:ring-[#003366]/15 transition-all";
  const labelCls = "text-xs font-bold text-on-surface-variant uppercase tracking-wider";
  const btnCls   = "w-full bg-primary-container md:bg-[#003366] md:hover:bg-[#002244] text-white font-headline font-bold py-4 md:py-3.5 rounded-xl md:rounded-lg shadow-lg md:shadow-md active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col min-h-dvh bg-background md:bg-[#edf0f5] md:items-center md:justify-center">

      {/* ── Mobile-only top bar ── */}
      <div className="md:hidden flex items-center px-6 py-4 bg-slate-100/80 backdrop-blur-md shadow-sm sticky top-0 z-40 relative">
        <button
          onClick={forgotView ? handleBackToLogin : onBack}
          className="p-2 hover:bg-slate-200/50 rounded-full transition-all active:scale-95 text-[#003366] absolute left-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center w-full">
          <h1 className="text-[#003366] font-headline font-bold text-2xl leading-none">
            {forgotView ? "Reset Password" : "Login"}
          </h1>
          <p className="text-[13px] text-[#003366] font-black uppercase tracking-wider opacity-70">AGAS</p>
        </div>
      </div>

      {/* ── Card (desktop) / plain (mobile) ── */}
      <main className="flex-1 md:flex-none px-6 pt-8 pb-12 md:p-0 w-full md:max-w-md mx-auto">
        <div className="md:bg-white md:rounded-2xl md:shadow-xl md:px-10 md:py-9">

          {!forgotView ? (
            <>
              {/* Desktop logo header */}
              <div className="hidden md:flex flex-col items-center mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#003366] icon-fill text-[32px]">local_gas_station</span>
                  <span className="font-headline font-black text-[#003366] text-3xl tracking-widest">A.G.A.S.</span>
                </div>
                <h2 className="font-headline font-bold text-[#003366] text-xl">Secure Portal Access</h2>
              </div>

              {/* Mobile heading */}
              <div className="md:hidden flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center mb-4 shadow-lg">
                  <span className="material-symbols-outlined text-white icon-filled text-[40px]">manage_accounts</span>
                </div>
                <h2 className="font-headline font-extrabold text-primary text-2xl">Welcome Back</h2>
                <p className="text-on-surface-variant text-sm text-center mt-1">Enter your officer details to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Username */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. juan@gmail.com"
                    className={inputCls}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className={labelCls}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`${inputCls} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setForgotView(true); setError(""); }}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className={`${btnCls} mt-2`}>
                  {loading ? "Signing in…" : "Login to Dashboard"}
                </button>
              </form>

              {/* Desktop footer link */}
              <p className="hidden md:block text-center text-sm text-slate-500 mt-5">
                Problem signing in?{" "}
                <span className="text-slate-400">|</span>{" "}
                <button onClick={onBack} className="text-[#c9a020] font-semibold hover:underline">
                  Register for an account
                </button>
              </p>
            </>
          ) : (
            <>
              {/* Desktop forgot password header */}
              <div className="hidden md:flex flex-col items-center mb-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#003366] icon-fill text-[32px]">local_gas_station</span>
                  <span className="font-headline font-black text-[#003366] text-3xl tracking-widest">A.G.A.S.</span>
                </div>
                <h2 className="font-headline font-bold text-[#003366] text-xl">Reset Password</h2>
              </div>

              {/* Mobile heading */}
              <div className="md:hidden flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center mb-4 shadow-lg">
                  <span className="material-symbols-outlined text-white icon-filled text-[40px]">lock_reset</span>
                </div>
                <h2 className="font-headline font-extrabold text-primary text-2xl">Forgot Password</h2>
                <p className="text-on-surface-variant text-sm text-center mt-1">Enter your email and we'll send you a reset link.</p>
              </div>

              {resetSent ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3 bg-surface-container px-6 py-8 rounded-2xl text-center">
                    <span className="material-symbols-outlined text-primary icon-filled text-[48px]">mark_email_read</span>
                    <p className="font-semibold text-on-surface">Check your inbox</p>
                    <p className="text-sm text-on-surface-variant">
                      A password reset link was sent to{" "}
                      <span className="font-semibold text-on-surface">{resetEmail}</span>.
                    </p>
                  </div>
                  <button type="button" onClick={handleBackToLogin} className={btnCls}>
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => { setResetEmail(e.target.value); setError(""); }}
                      placeholder="e.g. juan@gmail.com"
                      className={inputCls}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                      <span className="material-symbols-outlined text-base">error</span>
                      {error}
                    </div>
                  )}

                  <button type="submit" className={btnCls}>
                    Send Reset Link
                  </button>
                  <button type="button" onClick={handleBackToLogin} className="w-full text-sm font-semibold text-on-surface-variant py-2 active:opacity-70 transition-all">
                    Back to Login
                  </button>
                </form>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
