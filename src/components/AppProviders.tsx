'use client';

import { useEffect } from 'react';
import { useVoteSphereStore } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const { setUser, highContrast, largeText, theme } = useVoteSphereStore();

  useEffect(() => {
    // Guard: only subscribe to auth state on the client
    if (typeof window === 'undefined') return;
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Citizen',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          isAdmin: firebaseUser.email === 'admin@votesphere.gov.in',
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.toggle('large-text', largeText);
  }, [largeText]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  return <>{children}</>;
}
