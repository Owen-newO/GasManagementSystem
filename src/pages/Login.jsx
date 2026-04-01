import { useState } from "react";
import { login } from "../services/authService";

export default function Login({ onBack, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotView, setForgotView] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onSuccess(result.user, result.token, result.role);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setResetSent(true);
    setError("");
  };

  const handleBackToLogin = () => {
    setForgotView(false);
    setResetSent(false);
    setResetEmail("");
    setError("");
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-6 py-4 bg-slate-100/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <button
          onClick={forgotView ? handleBackToLogin : onBack}
          className="p-2 hover:bg-slate-200/50 rounded-full transition-all active:scale-95 text-[#003366]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-[#003366] font-headline font-bold text-lg leading-none">
            {forgotView ? "Reset Password" : "Sign In"}
          </h1>
          <p className="text-[10px] text-[#003366] font-black uppercase tracking-wider opacity-70">
            Fuel Rationing System
          </p>
        </div>
      </div>

      <main className="flex-1 px-6 pt-8 pb-12 max-w-md mx-auto w-full">
        {!forgotView ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center mb-4 shadow-lg">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "40px", fontVariationSettings: "'FILL' 1" }}
                >
                  lock_person
                </span>
              </div>
              <h2 className="font-headline font-extrabold text-primary text-2xl">
                Welcome Back
              </h2>
              <p className="text-on-surface-variant text-sm text-center mt-1">
                Sign in to access your portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3.5 px-4 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3.5 px-4 text-sm"
                />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white font-headline font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center mb-4 shadow-lg">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: "40px", fontVariationSettings: "'FILL' 1" }}
                >
                  lock_reset
                </span>
              </div>
              <h2 className="font-headline font-extrabold text-primary text-2xl">
                Forgot Password
              </h2>
              <p className="text-on-surface-variant text-sm text-center mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Station ID
            </label>
            <input
              type="text"
              name="stationId"
              value={form.stationId}
              onChange={handleChange}
              placeholder="e.g. STN-001"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3.5 px-4 text-sm uppercase"
            />
          </div>

                {error && (
                  <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary-container text-white font-headline font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-sm font-semibold text-on-surface-variant py-2 active:opacity-70 transition-all"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
}
