import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

// ── حسابات مسموح لها دائماً ───────────────────────────────────────────────────
const OWNER_EMAIL  = 'b2addr@gmail.com';
const DEMO_EMAIL   = 'demo@erp.com';

function isOwnerEmail(email: string | null) {
  return email === OWNER_EMAIL;
}

function isDemoEmail(email: string | null, isAnonymous: boolean) {
  return email === DEMO_EMAIL || isAnonymous;
}

// ── بناء profile ابتدائي ───────────────────────────────────────────────────────
function buildNewProfile(user: User, isPrivileged: boolean): UserProfile {
  return {
    uid:         user.uid,
    email:       user.email ?? 'guest@demo.com',
    displayName: isDemoEmail(user.email, user.isAnonymous)
      ? 'المستخدم التجريبي'
      : (user.displayName ?? user.email?.split('@')[0] ?? 'مستخدم'),
    role:        isPrivileged ? 'ADMIN' : 'STAFF',
    department:  'GENERAL',
    isApproved:  true,          // ✅ auto-approve لتجنب الحجب
    createdAt:   new Date().toISOString(),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const isPrivileged =
        isOwnerEmail(firebaseUser.email) ||
        isDemoEmail(firebaseUser.email, firebaseUser.isAnonymous);

      const userRef = doc(db, 'users', firebaseUser.uid);

      try {
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          let current = snap.data() as UserProfile;

          // ✅ FIX: تأكد إن الـ owner/demo دائماً ADMIN + approved
          if (isPrivileged && (!current.isApproved || current.role !== 'ADMIN')) {
            const patch = { isApproved: true, role: 'ADMIN' as const };
            await updateDoc(userRef, patch).catch(() => null);
            current = { ...current, ...patch };
          }

          setProfile(current);
        } else {
          // ✅ FIX: إنشاء profile جديد — الـ Firestore rules تسمح بـ create
          const newProfile = buildNewProfile(firebaseUser, isPrivileged);
          await setDoc(userRef, newProfile).catch((e) => {
            console.error('Error creating user profile:', e);
          });
          setProfile(newProfile);
        }
      } catch (error: any) {
        console.error('AuthContext profile error:', error?.message ?? error);

        // ✅ FIX: Fallback محلي لو Firestore فشل
        setProfile(buildNewProfile(firebaseUser, isPrivileged));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
