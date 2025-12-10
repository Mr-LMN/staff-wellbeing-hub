import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type UserCredential
} from 'firebase/auth';
import { auth } from '$lib/firebase';

const ALLOWED_DOMAIN = '@phschool.co.uk';

function ensureAllowedEmail(email: string) {
  if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
    throw new Error(`Only ${ALLOWED_DOMAIN} addresses are allowed.`);
  }
}

export async function registerWithEmail(email: string, password: string): Promise<UserCredential> {
  ensureAllowedEmail(email);
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  ensureAllowedEmail(email);
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function sendReset(email: string): Promise<void> {
  ensureAllowedEmail(email);
  await sendPasswordResetEmail(auth, email);
}
