import React, { useState } from "react";
import { Mail, CheckCircle2, AlertTriangle, RefreshCw, Send, ExternalLink, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatAuthError } from "../utils/authErrors";

export const EmailVerificationBanner: React.FC = () => {
  const { currentUser, sendVerificationEmail, reloadUser, verificationSentCooldown } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!currentUser) return null;

  const isVerified = currentUser.emailVerified;

  const handleRefresh = async () => {
    setRefreshing(true);
    setFeedback(null);
    try {
      const updatedUser = await reloadUser();
      if (updatedUser?.emailVerified) {
        setFeedback({
          type: "success",
          message: "Great! Your email has been successfully verified.",
        });
      } else {
        setFeedback({
          type: "error",
          message: "Email is not verified yet. Please click the link sent to your inbox first, then click refresh.",
        });
      }
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setFeedback({ type: "error", message: formatted.message });
    } finally {
      setRefreshing(false);
    }
  };

  const handleResend = async () => {
    if (verificationSentCooldown > 0) return;
    setResending(true);
    setFeedback(null);
    try {
      await sendVerificationEmail();
      setFeedback({
        type: "success",
        message: `Verification link sent to ${currentUser.email}. Please check your inbox (and spam folder).`,
      });
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setFeedback({
        type: "error",
        message: `${formatted.message} ${formatted.actionHint || ""}`,
      });
    } finally {
      setResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Email Address Verified</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Your email ({currentUser.email}) has been validated with Firebase Authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-amber-950/60 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-lg shadow-amber-950/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-amber-100 text-sm sm:text-base">
                Email Verification Required
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pending Verification
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
              We sent a verification email to <strong className="text-amber-100 font-mono">{currentUser.email}</strong>.
              Click the link in that email to secure your account.
            </p>

            {feedback && (
              <div
                className={`mt-2.5 text-xs rounded-lg px-3 py-2 border flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                    : "bg-rose-950/60 border-rose-500/40 text-rose-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm active:scale-95 disabled:opacity-50"
            title="Refresh verification status after clicking link in your email"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>{refreshing ? "Checking..." : "I've Verified"}</span>
          </button>

          <button
            onClick={handleResend}
            disabled={resending || verificationSentCooldown > 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {resending
                ? "Sending..."
                : verificationSentCooldown > 0
                ? `Resend in ${verificationSentCooldown}s`
                : "Resend Email"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
