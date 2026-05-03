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
        const isOwner = user.email === 'b2addr@gmail.com';
        
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            let currentProfile = userDoc.data() as UserProfile;
            // Force owner to be approved and admin if they aren't already
            if (isOwner && (!currentProfile.isApproved || currentProfile.role !== 'ADMIN')) {
              const updates = { isApproved: true, role: 'ADMIN' as const };
              await updateDoc(userRef, updates).catch(e => console.warn("Failed to force admin role in DB:", e));
              currentProfile = { ...currentProfile, ...updates };
            }
            setProfile(currentProfile);
          } else {
            // Auto-approve users for demo/test phase to avoid blocks
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Unknown User',
              role: isOwner ? 'ADMIN' : 'STAFF',
              department: 'GENERAL',
              isApproved: true, // AUTO-APPROVE FOR DEMO
              createdAt: new Date().toISOString(),
            };
            console.log("Creating new profile:", newProfile);
            await setDoc(userRef, newProfile).catch(e => {
              console.error("Critical error creating user profile:", e);
            });
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("AuthContext error fetching profile:", error);
          // Fallback if rules are blocking get before set
          if (isOwner) {
            setProfile({
              uid: user.uid, email: user.email!, displayName: 'Owner (Fallback)',
              role: 'ADMIN', department: 'GENERAL', isApproved: true, createdAt: ''
            });
          }
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
