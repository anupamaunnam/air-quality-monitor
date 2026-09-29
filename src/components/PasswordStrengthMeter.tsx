import React from "react";
import { Check, X } from "lucide-react";
import { PasswordRequirement } from "../types/auth";

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

export const getPasswordRequirements = (password: string): PasswordRequirement[] => [
  {
    id: "length",
    label: "At least 8 characters",
    valid: password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A-Z)",
    valid: /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a-z)",
    valid: /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number (0-9)",
    valid: /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "One special character (!@#$...)",
    valid: /[^A-Za-z0-9]/.test(password),
  },
];

export const calculateStrength = (password: string): { score: number; label: string; color: string; width: string } => {
  if (!password) return { score: 0, label: "None", color: "bg-slate-700", width: "0%" };

  const reqs = getPasswordRequirements(password);
  const metCount = reqs.filter((r) => r.valid).length;

  if (metCount <= 1) {
    return { score: 1, label: "Weak", color: "bg-rose-500", width: "20%" };
  } else if (metCount === 2) {
    return { score: 2, label: "Fair", color: "bg-amber-500", width: "40%" };
  } else if (metCount === 3) {
    return { score: 3, label: "Moderate", color: "bg-yellow-500", width: "60%" };
  } else if (metCount === 4) {
    return { score: 4, label: "Good", color: "bg-blue-500", width: "80%" };
  } else {
    return { score: 5, label: "Strong & Secure", color: "bg-emerald-500", width: "100%" };
  }
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showRequirements = true,
}) => {
  if (!password) return null;

  const strength = calculateStrength(password);
  const requirements = getPasswordRequirements(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Password strength</span>
        <span
          className={`font-semibold ${
            strength.score >= 4
              ? "text-emerald-400"
              : strength.score >= 3
              ? "text-blue-400"
              : strength.score >= 2
              ? "text-amber-400"
              : "text-rose-400"
          }`}
        >
          {strength.label}
        </span>
      </div>

      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>

      {showRequirements && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                req.valid ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              {req.valid ? (
                <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              ) : (
                <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                </div>
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
