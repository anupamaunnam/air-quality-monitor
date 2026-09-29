import React from "react";
import { X, Database, ExternalLink, ShieldAlert, CheckCircle, Copy, Check } from "lucide-react";
import { firebaseConfig } from "../firebase/config";

interface FirebaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseInfoModal: React.FC<FirebaseInfoModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Firebase Project Info</h3>
            <p className="text-xs text-slate-400">
              Active configuration for authentication &amp; services
            </p>
          </div>
        </div>

        {/* Configuration Specs */}
        <div className="space-y-2 mb-6">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                Project ID
              </span>
              <span className="text-sm font-mono text-indigo-300 font-medium">
                {firebaseConfig.projectId}
              </span>
            </div>
            <button
              onClick={() => handleCopy(firebaseConfig.projectId, "projectId")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Copy Project ID"
            >
              {copiedKey === "projectId" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                Auth Domain
              </span>
              <span className="text-sm font-mono text-slate-300">
                {firebaseConfig.authDomain}
              </span>
            </div>
            <button
              onClick={() => handleCopy(firebaseConfig.authDomain, "authDomain")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Copy Auth Domain"
            >
              {copiedKey === "authDomain" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                Storage Bucket
              </span>
              <span className="text-sm font-mono text-slate-400">
                {firebaseConfig.storageBucket}
              </span>
            </div>
          </div>
        </div>

        {/* Setup guide */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs space-y-2 mb-6">
          <div className="flex items-center gap-2 font-semibold text-indigo-100">
            <CheckCircle className="w-4 h-4 text-indigo-400" />
            <span>Firebase Console Setup Checklist</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-indigo-300/90 leading-relaxed pl-1">
            <li>
              <strong>Email/Password Sign-In:</strong> Must be set to <em>Enabled</em> in{" "}
              <code>Firebase Console &gt; Authentication &gt; Sign-in method</code>.
            </li>
            <li>
              <strong>Email Templates:</strong> You can customize verification and password reset emails in{" "}
              <code>Firebase Console &gt; Authentication &gt; Templates</code>.
            </li>
            <li>
              <strong>Authorized Domains:</strong> Ensure your domain or preview URL is added under{" "}
              <code>Authentication &gt; Settings &gt; Authorized domains</code>.
            </li>
          </ul>
        </div>

        <a
          href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700"
        >
          <span>Open Firebase Console</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
