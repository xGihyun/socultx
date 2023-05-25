import { auth } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies, locals }) => {
	console.log("Logging out, deleting cookies now, and redirecting to homepage")
	cookies.delete('userStuff');
	cookies.delete('userUID');

	// Reset locals
	locals.userUID = undefined
	locals.userStuff = {
		username: '',
		email: '',
		isLoggedIn: false,
	}

	// Log out user from Google	
	await signOut(auth);
	console.log("The user has been logged out, now redirecting to '/'");

	throw redirect(302, '/')
  }
};