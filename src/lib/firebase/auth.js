import { setCookie } from '$lib/cookie';
import { auth, db } from '$lib/firebase/firebase';
import { allUsers } from '$lib/store';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

// It will login via a popup window, might not be good for mobile
export async function googleAuthPopup() {
	const provider = new GoogleAuthProvider();
	// Add prompt for user to select an account before log in/register
	provider.setCustomParameters({
		prompt: 'select_account'
	});

	try {
		const result = await signInWithPopup(auth, provider);
		// const credential = GoogleAuthProvider.credentialFromResult(result);
		// const token = credential?.accessToken;
		const user = result.user;

		// Database stuff
		/**
		 * The (initial) user data to store
		 * @type {import('$lib/types').UserData}
		 */
		let dataToStore = {
			username: user.displayName,
			uid: user.uid,
			email: user.email,
			photo_url: user.photoURL,
			is_logged_in: true
		};

		const userRef = doc(db, 'users', user.uid);
		const docSnap = await getDoc(userRef);

		// Check if a document exists
		if (!docSnap.exists()) {
			// Get reference to the user path where the users will be stored
			const newUserRef = doc(db, 'users', user.uid);

			// Store data to database
			await setDoc(newUserRef, dataToStore, { merge: true });
		} else {
			await setDoc(userRef, { is_logged_in: true }, { merge: true });
		}

		// Get the collection for all the users
		// Responsible for making the sidebar show all users reactively
		const docCollection = collection(db, 'users');
		const docs = await getDocs(docCollection);

		/**
		 * @type {import("@firebase/firestore").DocumentData[]}
		 */
		let docData = [];

		docs.forEach((doc) => {
			docData.push(doc.data());
		});

		allUsers.update((val) => (val = /** @type {import('$lib/types').UserData[]} */ (docData)));

		// This will set a session cookie
		setCookie(
			'userStuff',
			JSON.stringify({
				uid: user.uid,
				username: user.displayName,
				email: user.email,
				is_logged_in: true,
				photo_url: user.photoURL
			}),
			7
		);

		return {
			uid: user.uid,
			username: user.displayName,
			email: user.email,
			is_logged_in: true,
			photo_url: user.photoURL
		};
	} catch (error) {
		// Handle Errors here.
		console.error(error);
	}
}
