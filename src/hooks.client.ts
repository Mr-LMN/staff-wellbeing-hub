import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '$lib/firebase';
import { setUser } from '$lib/stores/user';
import { db } from '$lib/firestore';
import { doc, setDoc } from 'firebase/firestore';

import type { StaffProfile } from '$lib/types';

declare global {
  interface Window {
    __USER?: unknown;
  }
}

onAuthStateChanged(auth, async (firebaseUser) => {
  setUser(firebaseUser);
  if (typeof window !== 'undefined') {
    window.__USER = firebaseUser;
  }

  if (firebaseUser) {
    const ref = doc(db, 'staff', firebaseUser.uid);
    const now = new Date().toISOString();

    const profile: Partial<StaffProfile> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? null,
      updatedAt: now,
      createdAt: now
    };

    await setDoc(ref, profile, { merge: true });
  }
});
