import { browser } from '$app/environment';
import { auth } from '$lib/firebase';
import { user } from '$lib/stores/user';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

if (browser) {
  const setUser = (firebaseUser: User | null) => {
    user.set(firebaseUser);
    (window as Window & { __USER?: User | null }).__USER = firebaseUser;
  };

  setUser(auth.currentUser);

  onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
  });
}

export { user };
