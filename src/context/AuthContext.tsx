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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const isOwner = user.email === 'b2addr@gmail.com';

        if (userDoc.exists()) {
          let currentProfile = userDoc.data() as UserProfile;
          // Force owner to be approved and admin if they aren't already
          if (isOwner && (!currentProfile.isApproved || currentProfile.role !== 'ADMIN')) {
            const updates = { isApproved: true, role: 'ADMIN' as const };
            await updateDoc(userRef, updates);
            currentProfile = { ...currentProfile, ...updates };
          }
          setProfile(currentProfile);
        } else {
          // Auto-approve the owner (you) and grant ADMIN role, others start as pending STAFF
          const isOwner = user.email === 'b2addr@gmail.com';
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'New User',
            role: isOwner ? 'ADMIN' : 'STAFF',
            department: isOwner ? 'GENERAL' : 'GENERAL',
            isApproved: isOwner,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
