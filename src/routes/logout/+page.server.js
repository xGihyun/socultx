import { auth, db } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { redirect } from '@sveltejs/kit';
import { doc, setDoc } from 'firebase/firestore';
import { currentUser } from '$lib/store';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, locals }) => {
		console.log('Resetting writable...');
		currentUser.set({
			username: '',
			uid: '',
			photo_url: '',
			email: '',
			is_logged_in: false
		});

		console.log('Logging out, deleting cookies now, and redirecting to homepage...');
		cookies.delete('userStuff');

		const userRef = doc(db, 'users', locals.userStuff.uid || '');

		// Set login to false in the database
		await setDoc(userRef, { is_logged_in: false }, { merge: true });

		// Reset locals
		locals.userUID = undefined;
		locals.userStuff = {
			username: '',
			uid: '',
			photo_url: '',
			email: '',
			is_logged_in: false
		};

		// Log out user from Google
		await signOut(auth);
		console.log("The user has been logged out, now redirecting to '/'");

		throw redirect(302, '/');
	}
};
