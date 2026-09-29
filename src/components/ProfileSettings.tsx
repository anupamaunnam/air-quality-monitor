import React, { useState } from "react";
import { User, Mail, ShieldCheck, AlertTriangle, Copy, Check, Save, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatAuthError } from "../utils/authErrors";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
];

export const ProfileSettings: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);

  if (!currentUser) return null;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(currentUser.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      await updateUserProfile(displayName, photoURL);
      setFeedback({ type: "success", message: "Profile updated successfully!" });
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setFeedback({ type: "error", message: formatted.message });
    } finally {
      setLoading(false);
    }
  };

  const formattedCreated = currentUser.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  const formattedLastLogin = currentUser.metadata.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white">Profile &amp; Personal Info</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your public display details and account identifiers.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`mt-5 p-3 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
              : "bg-rose-950/40 border-rose-500/30 text-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
        {/* Avatar Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Profile Photo
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-indigo-500/30 flex items-center justify-center shrink-0 shadow-md">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoURL("")}
                />
              ) : (
                <span className="text-xl font-bold text-indigo-300">
                  {displayName ? displayName.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <span className="text-[11px] text-slate-400 block font-medium">
                Choose a preset avatar or paste an image link:
              </span>
              <div className="flex items-center gap-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoURL(preset)}
                    className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition hover:scale-105 ${
                      photoURL === preset ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-700"
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Display Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
            />
          </div>
        </div>

        {/* Readonly Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Email */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
              Email Address
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs sm:text-sm font-medium text-slate-200 truncate mr-2">
                {currentUser.email}
              </span>
              {currentUser.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                  Unverified
                </span>
              )}
            </div>
          </div>

          {/* UID */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="overflow-hidden mr-2">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                Firebase User UID
              </span>
              <span className="text-xs font-mono text-indigo-300/90 truncate block mt-1">
                {currentUser.uid}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyUid}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title="Copy UID"
            >
              {copiedUid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Creation Date */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
              Account Created
            </span>
            <span className="text-xs text-slate-300 block mt-1">
              {formattedCreated}
            </span>
          </div>

          {/* Last Login Date */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
              Last Signed In
            </span>
            <span className="text-xs text-slate-300 block mt-1">
              {formattedLastLogin}
            </span>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-950/50 disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
