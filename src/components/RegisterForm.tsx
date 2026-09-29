import React, { useState } from "react";
import { User as UserIcon, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatAuthError } from "../utils/authErrors";
import { AuthErrorFeedback, AuthTab } from "../types/auth";
import { PasswordStrengthMeter, calculateStrength } from "./PasswordStrengthMeter";

interface RegisterFormProps {
  onSwitchTab: (tab: AuthTab) => void;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchTab, onSuccess }) => {
  const { register, loginWithGoogle } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<AuthErrorFeedback | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);

    if (!displayName.trim()) {
      setErrorFeedback({
        code: "client/missing-name",
        message: "Please enter your name or preferred username.",
      });
      return;
    }

    if (!email.trim() || !password) {
      setErrorFeedback({
        code: "client/missing-fields",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrorFeedback({
        code: "client/password-mismatch",
        message: "Passwords do not match.",
        actionHint: "Make sure both password fields contain the exact same characters.",
      });
      return;
    }

    const strength = calculateStrength(password);
    if (strength.score < 2) {
      setErrorFeedback({
        code: "client/weak-password",
        message: "Please choose a stronger password.",
        actionHint: "Add numbers, uppercase letters, or special characters.",
      });
      return;
    }

    if (!agreeTerms) {
      setErrorFeedback({
        code: "client/terms-required",
        message: "Please agree to the Terms of Service to continue.",
      });
      return;
    }

    setLoading(true);

    try {
      await register(email.trim(), password, displayName.trim());
      onSuccess?.();
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setErrorFeedback(formatted);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorFeedback(null);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setErrorFeedback(formatted);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Create an account</h2>
        <p className="text-slate-400 text-sm mt-1">
          Sign up to manage your profile and verify your email.
        </p>
      </div>

      {/* Error Feedback */}
      {errorFeedback && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex flex-col gap-1.5 animate-fadeIn">
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

      {/* Social Login Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full mb-5 flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition font-medium text-sm shadow-sm active:scale-[0.99] disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.6 7c-.8 1.6-1.3 3.4-1.3 5.3s.5 3.7 1.3 5.3l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 19.9 7.4 23 12 23z"
          />
        </svg>
        <span>{googleLoading ? "Connecting with Google..." : "Sign up with Google"}</span>
      </button>

      <div className="relative flex items-center justify-center mb-5">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold absolute">
          or with email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Taylor"
              required
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
              required
              autoComplete="new-password"
              className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Dynamic strength indicator */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
              className={`w-full bg-slate-900/90 border ${
                confirmPassword && password !== confirmPassword
                  ? "border-rose-500 focus:ring-rose-500"
                  : "border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500"
              } focus:ring-1 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none`}
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-rose-400 mt-1">Passwords do not match.</p>
          )}
        </div>

        {/* Email verification notice */}
        <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            A verification link will be automatically sent to this email upon registration.
          </span>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500/30"
          />
          <label htmlFor="terms" className="text-xs text-slate-400 select-none cursor-pointer">
            I agree to the{" "}
            <span className="text-indigo-400 underline decoration-indigo-400/40">Terms of Service</span> and{" "}
            <span className="text-indigo-400 underline decoration-indigo-400/40">Privacy Policy</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-950/40 active:scale-[0.99] transition disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          <span>{loading ? "Registering account..." : "Complete Registration"}</span>
        </button>
      </form>

      {/* Switch Tab Footer */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitchTab("login")}
          className="font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-0.5 ml-1 transition"
        >
          <span>Sign in</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
