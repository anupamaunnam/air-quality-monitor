import React, { useState } from "react";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatAuthError } from "../utils/authErrors";
import { AuthErrorFeedback, AuthTab } from "../types/auth";

interface ForgotPasswordFormProps {
  onSwitchTab: (tab: AuthTab) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchTab }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<AuthErrorFeedback | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorFeedback({
        code: "client/missing-email",
        message: "Please enter your account email address.",
      });
      return;
    }

    setLoading(true);
    setErrorFeedback(null);

    try {
      await resetPassword(email.trim());
      setSentSuccess(true);
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setErrorFeedback(formatted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => onSwitchTab("login")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to sign in</span>
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Reset your password</h2>
        <p className="text-slate-400 text-sm mt-1">
          Enter your registered email and we&apos;ll dispatch a password reset link.
        </p>
      </div>

      {sentSuccess ? (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">Check your email</h3>
          <p className="text-xs sm:text-sm text-emerald-300/80 leading-relaxed">
            We have sent a secure password reset link to <strong className="text-emerald-100 font-mono">{email}</strong>.
            Click the link in the message to select a new password.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onSwitchTab("login")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              Return to Login
            </button>
            <button
              onClick={() => {
                setSentSuccess(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Send to another email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Feedback */}
          {errorFeedback && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex flex-col gap-1.5 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="font-medium text-rose-100">{errorFeedback.message}</span>
              </div>
              {errorFeedback.actionHint && (
                <p className="text-rose-300/80 text-xs pl-6 bg-rose-900/20 py-1.5 px-2 rounded">
                  💡 {errorFeedback.actionHint}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-950/40 active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
          </button>
        </form>
      )}
    </div>
  );
};
