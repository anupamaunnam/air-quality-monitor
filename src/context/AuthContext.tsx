import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser
} from "firebase/auth";
import { auth } from "../firebase/config";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authReady: boolean;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<User | null>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  verificationSentCooldown: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [verificationSentCooldown, setVerificationSentCooldown] = useState(0);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (verificationSentCooldown <= 0) return;
    const interval = setInterval(() => {
      setVerificationSentCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [verificationSentCooldown]);

  // Register with email, password, and display name
  const register = async (email: string, password: string, displayName: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    if (displayName.trim()) {
      await updateProfile(user, {
        displayName: displayName.trim(),
      });
    }

    // Automatically send email verification
    try {
      await sendEmailVerification(user, {
        url: window.location.origin,
        handleCodeInApp: true,
      });
      setVerificationSentCooldown(60);
    } catch (err) {
      console.warn("Could not auto-send verification email:", err);
    }

    // Force reload to capture updated displayName
    await user.reload();
    setCurrentUser(auth.currentUser);

    return user;
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Login with Google OAuth popup
  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  };

  // Sign out
  const logout = async (): Promise<void> => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Send password reset email
  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin,
      handleCodeInApp: true,
    });
  };

  // Manually send or resend email verification
  const sendVerificationEmail = async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error("No user is currently logged in.");
    }

    await sendEmailVerification(auth.currentUser, {
      url: window.location.origin,
      handleCodeInApp: true,
    });
    setVerificationSentCooldown(60);
  };

  // Reload current user state (e.g., after clicking verification link)
  const reloadUser = async (): Promise<User | null> => {
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    // Create new reference to trigger React re-renders
    const refreshedUser = auth.currentUser;
    setCurrentUser(refreshedUser ? Object.assign(Object.create(Object.getPrototypeOf(refreshedUser)), refreshedUser) : null);
    return refreshedUser;
  };

  // Update profile details
  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user is currently logged in.");

    await updateProfile(auth.currentUser, {
      displayName: displayName.trim(),
      photoURL: photoURL || auth.currentUser.photoURL,
    });

    await auth.currentUser.reload();
    setCurrentUser(auth.currentUser);
  };

  // Update password
  const changePassword = async (newPassword: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user is currently logged in.");
    await updatePassword(auth.currentUser, newPassword);
  };

  // Delete account
  const deleteAccount = async (): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user is currently logged in.");
    await deleteUser(auth.currentUser);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    authReady,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    sendVerificationEmail,
    reloadUser,
    updateUserProfile,
    changePassword,
    deleteAccount,
    verificationSentCooldown,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
