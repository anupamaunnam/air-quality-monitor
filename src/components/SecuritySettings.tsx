import React, { useState } from "react";
import { Lock, ShieldAlert, KeyRound, Check, AlertTriangle, Trash2, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatAuthError } from "../utils/authErrors";
import { PasswordStrengthMeter, calculateStrength } from "./PasswordStrengthMeter";

export const SecuritySettings: React.FC = () => {
  const { currentUser, changePassword, deleteAccount } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!currentUser) return null;

  const isPasswordProvider = currentUser.providerData.some((p) => p.providerId === "password");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }

    const strength = calculateStrength(newPassword);
    if (strength.score < 2) {
      setFeedback({ type: "error", message: "Password is too weak. Please pick a stronger password." });
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);
      setFeedback({ type: "success", message: "Your password was updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setFeedback({
        type: "error",
        message: `${formatted.message} ${formatted.actionHint ? `(${formatted.actionHint})` : ""}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setDeleteError("Please type DELETE to confirm.");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteAccount();
      // Auth listener will naturally clean state and redirect to login
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setDeleteError(`${formatted.message} ${formatted.actionHint || ""}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Password &amp; Security</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep your account safe with a strong, distinct password.
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

        {!isPasswordProvider ? (
          <div className="mt-5 p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>
              You signed in using a third-party identity provider (Google). Password management is handled by your provider.
            </span>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="mt-5 space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                />
              </div>
              <PasswordStrengthMeter password={newPassword} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition outline-none"
                />
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-rose-400 mt-1">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-950/50 disabled:opacity-50 active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Danger Zone</span>
            </h4>
            <p className="text-xs text-rose-200/70 mt-1 max-w-xl">
              Permanently delete your Firebase authentication user record. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border border-rose-700/50 font-semibold text-xs transition shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete User Account</h3>
                <p className="text-xs text-slate-400">Irreversible security action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete the user account registered under{" "}
              <strong className="text-white font-mono">{currentUser.email}</strong> from Firebase Authentication.
            </p>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Type <strong className="text-rose-400">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== "DELETE"}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
