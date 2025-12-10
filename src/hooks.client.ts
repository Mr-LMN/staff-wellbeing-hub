import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '$lib/firebase';
import { setUser } from '$lib/stores/user';

declare global {
  interface Window {
    __USER?: unknown;
  }
}

onAuthStateChanged(auth, (firebaseUser) => {
  setUser(firebaseUser);
  if (typeof window !== 'undefined') {
    window.__USER = firebaseUser;
  }
});
