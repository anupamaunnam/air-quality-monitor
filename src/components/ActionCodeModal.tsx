import React, { useEffect, useState } from "react";
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { CheckCircle2, AlertCircle, Lock, ShieldCheck, ArrowRight, X } from "lucide-react";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { PasswordStrengthMeter, calculateStrength } from "./PasswordStrengthMeter";

export const ActionCodeModal: React.FC = () => {
  const { reloadUser } = useAuth();
  const [mode, setMode] = useState<string | null>(null);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for Firebase auth actions
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    const code = params.get("oobCode");

    if (m && code) {
      setMode(m);
      setOobCode(code);
      setIsOpen(true);

      if (m === "verifyEmail") {
        handleEmailVerification(code);
      } else if (m === "resetPassword") {
        handlePreparePasswordReset(code);
      }
    }
  }, []);

  const handleEmailVerification = async (code: string) => {
    setStatus("verifying");
    setLoading(true);
    try {
      await applyActionCode(auth, code);
      setStatus("success");
      setMessage("Your email address has been successfully verified! You now have full access.");
      await reloadUser();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to verify email. The link may have expired or already been used.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreparePasswordReset = async (code: string) => {
    setStatus("verifying");
    setLoading(true);
    try {
      const email = await verifyPasswordResetCode(auth, code);
      setResetEmail(email);
      setStatus("idle");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Invalid or expired password reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (newPassword !== confirmPass) {
      setMessage("Passwords do not match.");
      return;
    }

    const strength = calculateStrength(newPassword);
    if (strength.score < 2) {
      setMessage("Please choose a stronger password.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      setMessage("Your password has been changed successfully. You can now log in with your new credentials.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Remove query params from URL without reload
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === "verifyEmail" && (
          <div className="space-y-4 text-center">
            {status === "verifying" && (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Verifying your email...</h3>
                <p className="text-xs text-slate-400">Communicating with Firebase Authentication...</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email Verified!</h3>
                  <p className="text-sm text-slate-300 mt-1">{message}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
                >
                  Continue to Application
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="py-4 space-y-4">
                <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-500/10">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Verification Failed</h3>
                  <p className="text-sm text-rose-300 mt-1">{message}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}

        {mode === "resetPassword" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              {resetEmail && (
                <p className="text-xs text-slate-400 mt-1">
                  for <span className="text-indigo-400 font-mono">{resetEmail}</span>
                </p>
              )}
            </div>

            {status === "success" ? (
              <div className="text-center py-4 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-sm text-emerald-300">{message}</p>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
                >
                  Go to Login
                </button>
              </div>
            ) : status === "error" ? (
              <div className="text-center py-4 space-y-4">
                <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <p className="text-sm text-rose-300">{message}</p>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4 pt-2">
                {message && (
                  <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
                    {message}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                  <PasswordStrengthMeter password={newPassword} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
                >
                  {loading ? "Updating..." : "Save New Password"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
