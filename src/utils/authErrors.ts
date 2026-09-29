import { AuthErrorFeedback } from "../types/auth";

export function formatAuthError(error: any): AuthErrorFeedback {
  if (!error) {
    return { code: "unknown", message: "An unexpected error occurred." };
  }

  const errorCode = error.code || "";
  const rawMessage = error.message || "";

  switch (errorCode) {
    case "auth/email-already-in-use":
      return {
        code: errorCode,
        message: "An account with this email address already exists.",
        actionHint: "Try signing in instead, or use the 'Forgot Password' link if you lost your password."
      };
    case "auth/invalid-email":
      return {
        code: errorCode,
        message: "The email address is invalid.",
        actionHint: "Please check your email spelling (e.g. name@example.com)."
      };
    case "auth/operation-not-allowed":
      return {
        code: errorCode,
        message: "Email/Password sign-in is not enabled in your Firebase project.",
        actionHint: "Go to Firebase Console → Authentication → Sign-in method tab, click 'Email/Password', and toggle it to Enabled."
      };
    case "auth/weak-password":
      return {
        code: errorCode,
        message: "The password is too weak.",
        actionHint: "Password must be at least 6 characters. We recommend 8+ characters with mixed case and numbers."
      };
    case "auth/user-disabled":
      return {
        code: errorCode,
        message: "This user account has been disabled by an administrator.",
        actionHint: "Please contact support if you believe this is a mistake."
      };
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return {
        code: errorCode,
        message: "Invalid email or password.",
        actionHint: "Double-check your credentials or use 'Forgot Password' to reset."
      };
    case "auth/too-many-requests":
      return {
        code: errorCode,
        message: "Access to this account has been temporarily disabled due to many failed login attempts.",
        actionHint: "You can immediately restore it by resetting your password or waiting a few minutes."
      };
    case "auth/requires-recent-login":
      return {
        code: errorCode,
        message: "This sensitive action requires recent authentication.",
        actionHint: "Please log out, sign in again, and retry."
      };
    case "auth/popup-closed-by-user":
      return {
        code: errorCode,
        message: "The Google sign-in window was closed before completing.",
        actionHint: "Click 'Sign in with Google' again and select your Google account in the popup window."
      };
    case "auth/popup-blocked":
      return {
        code: errorCode,
        message: "The browser blocked the sign-in popup.",
        actionHint: "Please allow popups for this site in your browser address bar."
      };
    case "auth/network-request-failed":
      return {
        code: errorCode,
        message: "Network request failed.",
        actionHint: "Please check your internet connection and verify that Firebase domains are reachable."
      };
    case "auth/expired-action-code":
      return {
        code: errorCode,
        message: "The verification link or action code has expired.",
        actionHint: "Please request a new verification email or password reset link."
      };
    case "auth/invalid-action-code":
      return {
        code: errorCode,
        message: "The verification link or action code is invalid.",
        actionHint: "It may have already been used. Please request a new link."
      };
    default:
      return {
        code: errorCode || "unknown",
        message: rawMessage.replace(/^Firebase:\s*/, "") || "An error occurred during authentication.",
      };
  }
}
