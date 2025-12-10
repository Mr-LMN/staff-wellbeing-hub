import { redirect } from '@sveltejs/kit';

export const load = () => {
  // TODO: Clear Firebase auth session when wiring up authentication.
  throw redirect(303, '/login');
};
