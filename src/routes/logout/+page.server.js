import { auth, db } from '$lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { redirect } from '@sveltejs/kit';
import { doc, setDoc } from 'firebase/firestore';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, locals }) => {
		console.log('Logging out, deleting cookies now, and redirecting to homepage');
		cookies.delete('userStuff');
		cookies.delete('userUID');

		const userRef = doc(db, 'users', locals.userStuff.uid);

		// Set login to false in the database
		await setDoc(userRef, { isLoggedIn: false }, { merge: true });

		// Reset locals
		locals.userUID = undefined;
		locals.userStuff = {
			username: '',
			uid: '',
			photoURL: '',
			email: '',
			isLoggedIn: false
		};

		// Log out user from Google
		await signOut(auth);
		console.log("The user has been logged out, now redirecting to '/'");

		throw redirect(302, '/');
	}
};
