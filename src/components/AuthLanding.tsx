import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, Flame, CheckCircle2, KeyRound, Sparkles, Database } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { AuthTab } from "../types/auth";
import { firebaseConfig } from "../firebase/config";

interface AuthLandingProps {
  onOpenFirebaseInfo: () => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ onOpenFirebaseInfo }) => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Product Story & Security Value */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Firebase Authentication v11 Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Secure Identity &amp;{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Email Verification
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Robust user registration and login powered by Firebase. Includes instant verification emails,
            interactive password strength checks, OAuth sign-in, and full profile management.
          </p>

          {/* Feature list */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Email Verification Pipeline</h4>
                <p className="text-xs text-slate-400">
                  Automated verification email dispatch with resend cooldown and action code handling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Password Strength Evaluation</h4>
                <p className="text-xs text-slate-400">
                  Interactive real-time meter measuring entropy, case variety, numbers, and symbols.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Google OAuth &amp; Self-Service</h4>
                <p className="text-xs text-slate-400">
                  Password reset, profile customization, and security controls in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Project Banner Card */}
          <div className="pt-2">
            <button
              onClick={onOpenFirebaseInfo}
              className="w-full text-left p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Target Firebase Project
                  </span>
                  <span className="text-xs font-mono text-indigo-300 font-medium">
                    {firebaseConfig.projectId}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-indigo-400 transition font-medium">
                View Specs &rarr;
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Subtle glow effect behind card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Tab switch header if not on forgot password */}
            {activeTab !== "forgot-password" && (
              <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    activeTab === "login"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                    activeTab === "register"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Form Views */}
            {activeTab === "login" && (
              <LoginForm onSwitchTab={setActiveTab} />
            )}

            {activeTab === "register" && (
              <RegisterForm onSwitchTab={setActiveTab} />
            )}

            {activeTab === "forgot-password" && (
              <ForgotPasswordForm onSwitchTab={setActiveTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
