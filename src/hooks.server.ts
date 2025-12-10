import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const protectedRoutes = new Set(['/', '/check-in', '/workouts', '/nutrition', '/stories']);

export const handle: Handle = async ({ event, resolve }) => {
  const isProtected = protectedRoutes.has(event.url.pathname);

  // TODO: Replace placeholder authentication with Firebase ID token verification.
  const hasSession = Boolean(event.cookies.get('session'));

  if (isProtected && !hasSession) {
    throw redirect(303, '/login');
  }

  return resolve(event);
};
