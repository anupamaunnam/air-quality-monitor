import React from "react";
import { Flame, LogOut, ShieldCheck, AlertCircle, Database, User, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { firebaseConfig } from "../firebase/config";

interface NavbarProps {
  onOpenFirebaseInfo: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFirebaseInfo, onOpenAuthModal }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base">
                AuthGuard
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Firebase v11
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Secure User Management &amp; Email Verification
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Firebase Project indicator */}
          <button
            onClick={onOpenFirebaseInfo}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs"
            title="View Firebase configuration & setup"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">
              {firebaseConfig.projectId}
            </span>
            <Database className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* User badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold overflow-hidden">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight max-w-[120px] truncate">
                    {currentUser.displayName || currentUser.email?.split("@")[0]}
                  </div>
                  <div className="text-[10px] leading-tight flex items-center gap-1">
                    {currentUser.emailVerified ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/40 transition active:scale-95"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-sm"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
