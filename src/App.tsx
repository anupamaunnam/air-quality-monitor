import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AuthLanding } from "./components/AuthLanding";
import { Dashboard } from "./components/Dashboard";
import { ActionCodeModal } from "./components/ActionCodeModal";
import { FirebaseInfoModal } from "./components/FirebaseInfoModal";

function MainContent() {
  const { currentUser, loading } = useAuth();
  const [firebaseInfoOpen, setFirebaseInfoOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <p className="text-slate-400 text-sm mt-4 font-medium animate-pulse">
          Connecting to Firebase Authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation bar */}
      <Navbar onOpenFirebaseInfo={() => setFirebaseInfoOpen(true)} />

      {/* Main app body */}
      <main className="flex-1">
        {currentUser ? (
          <Dashboard />
        ) : (
          <AuthLanding onOpenFirebaseInfo={() => setFirebaseInfoOpen(true)} />
        )}
      </main>

      {/* Modals */}
      <ActionCodeModal />
      <FirebaseInfoModal
        isOpen={firebaseInfoOpen}
        onClose={() => setFirebaseInfoOpen(false)}
      />

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Firebase Authentication &bull; Secure User Identity &bull; Email Verification
          </span>
          <button
            onClick={() => setFirebaseInfoOpen(true)}
            className="hover:text-indigo-400 underline underline-offset-4 transition"
          >
            Firebase Config &amp; Setup Docs
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
