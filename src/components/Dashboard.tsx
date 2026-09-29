import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  User,
  KeyRound,
  Send,
  RefreshCw,
  Code,
  ExternalLink,
  Lock,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  HelpCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EmailVerificationBanner } from "./EmailVerificationBanner";
import { ProfileSettings } from "./ProfileSettings";
import { SecuritySettings } from "./SecuritySettings";
import { firebaseConfig } from "../firebase/config";

type DashboardTab = "profile" | "security" | "verification" | "raw-json";

export const Dashboard: React.FC = () => {
  const { currentUser, sendVerificationEmail, reloadUser, verificationSentCooldown } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [refreshing, setRefreshing] = useState(false);
  const [manualResendFeedback, setManualResendFeedback] = useState<string | null>(null);

  if (!currentUser) return null;

  const isVerified = currentUser.emailVerified;

  const handleManualResend = async () => {
    try {
      await sendVerificationEmail();
      setManualResendFeedback(`A fresh verification email has been dispatched to ${currentUser.email}.`);
      setTimeout(() => setManualResendFeedback(null), 5000);
    } catch (err: any) {
      setManualResendFeedback(`Failed to send email: ${err.message}`);
    }
  };

  const handleCheckStatus = async () => {
    setRefreshing(true);
    try {
      await reloadUser();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {currentUser.displayName || currentUser.email?.split("@")[0]}
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Logged into Firebase project{" "}
            <span className="font-mono text-indigo-400 font-semibold">{firebaseConfig.projectId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckStatus}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition active:scale-95 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Sync Status"}</span>
          </button>
        </div>
      </div>

      {/* Prominent Verification Banner */}
      <EmailVerificationBanner />

      {/* Status Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verification Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Email Status
            </span>
            {isVerified ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              {isVerified ? "Verified" : "Pending Check"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isVerified
                ? "Account secured & validated"
                : "Needs verification via inbox link"}
            </p>
          </div>
        </div>

        {/* Auth Provider */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Identity Provider
            </span>
            <Lock className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-white capitalize">
              {currentUser.providerData[0]?.providerId === "google.com"
                ? "Google OAuth"
                : "Email & Password"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentUser.providerData[0]?.providerId || "password"}
            </p>
          </div>
        </div>

        {/* Security Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Security Score
            </span>
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>{isVerified ? "100%" : "60%"}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${isVerified ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                {isVerified ? "Optimal" : "Action Needed"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isVerified ? "All requirements satisfied" : "Verify email for 100% score"}
            </p>
          </div>
        </div>

        {/* User Session UID */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              User UID
            </span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-4">
            <div className="text-xs font-mono text-indigo-300 truncate font-semibold" title={currentUser.uid}>
              {currentUser.uid.slice(0, 14)}...
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Firebase session
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "profile"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Info</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "security"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Password &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab("verification")}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "verification"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Verification Center</span>
        </button>

        <button
          onClick={() => setActiveTab("raw-json")}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === "raw-json"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Firebase Auth Inspector</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "profile" && <ProfileSettings />}

      {activeTab === "security" && <SecuritySettings />}

      {activeTab === "verification" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span>Email Verification Workflow</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How Firebase ensures email authenticity and protects against unauthorized registrations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isVerified ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified User
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Unverified Email
                  </span>
                )}
              </div>
            </div>

            {manualResendFeedback && (
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs">
                {manualResendFeedback}
              </div>
            )}

            {/* Step by step flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h4 className="text-sm font-semibold text-white">Trigger Verification Link</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Firebase sends an automated secure token link via SMTP to{" "}
                  <strong className="text-slate-300">{currentUser.email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h4 className="text-sm font-semibold text-white">Click Email Link</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The recipient clicks the link in their mail client (Gmail, Outlook, etc.). Firebase applies the action code.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h4 className="text-sm font-semibold text-white">Instant State Sync</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click &quot;Sync Status&quot; or reload. <code>emailVerified</code> becomes <code>true</code>, unlocking full app capabilities.
                </p>
              </div>
            </div>

            {/* Direct Trigger controls */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">
                  Need to send a new verification email?
                </span>
                <span className="text-[11px] text-slate-400">
                  Target: {currentUser.email}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCheckStatus}
                  disabled={refreshing}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  {refreshing ? "Checking..." : "Check Status"}
                </button>

                <button
                  onClick={handleManualResend}
                  disabled={verificationSentCooldown > 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {verificationSentCooldown > 0
                      ? `Wait ${verificationSentCooldown}s`
                      : "Send Verification Email"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "raw-json" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Firebase Auth User Inspection</h3>
              <p className="text-xs text-slate-400">
                Live inspection of <code>auth.currentUser</code> sanitized attributes
              </p>
            </div>
            <span className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-indigo-300">
              auth.currentUser
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto max-h-96">
            <pre>
              {JSON.stringify(
                {
                  uid: currentUser.uid,
                  email: currentUser.email,
                  emailVerified: currentUser.emailVerified,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                  phoneNumber: currentUser.phoneNumber,
                  isAnonymous: currentUser.isAnonymous,
                  tenantId: currentUser.tenantId,
                  metadata: {
                    creationTime: currentUser.metadata.creationTime,
                    lastSignInTime: currentUser.metadata.lastSignInTime,
                  },
                  providerData: currentUser.providerData.map((p) => ({
                    providerId: p.providerId,
                    uid: p.uid,
                    displayName: p.displayName,
                    email: p.email,
                  })),
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
