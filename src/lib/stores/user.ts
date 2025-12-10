import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const user = writable<User | null>(null);

export function setUser(value: User | null) {
  user.set(value);
}
