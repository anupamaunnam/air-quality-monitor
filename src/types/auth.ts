import { User } from "firebase/auth";

export interface UserProfileData {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  uid: string;
  phoneNumber: string | null;
  createdAt?: string;
  lastLoginAt?: string;
  providerId?: string;
}

export type AuthTab = "login" | "register" | "forgot-password";

export interface PasswordRequirement {
  id: string;
  label: string;
  valid: boolean;
}

export interface AuthErrorFeedback {
  code: string;
  message: string;
  actionHint?: string;
}
