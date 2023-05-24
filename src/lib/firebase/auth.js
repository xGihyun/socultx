import { setCookie } from '$lib/cookie';
import { auth, db } from '$lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// It will login via a popup window, might not be good for mobile
export async function googleAuthPopup() {
	const provider = new GoogleAuthProvider();
	try {
		const result = await signInWithPopup(auth, provider);
		// const credential = GoogleAuthProvider.credentialFromResult(result);
		// const token = credential?.accessToken;
		const user = result.user;

		// Database stuff
		/**
		 * The user data to store
		 * @type {import('$lib/types').PostData}
		 */
		let dataToStore;

		const docRef = doc(db, 'users', user.uid);
		const docSnap = await getDoc(docRef);

		// Check if a document exists
		if (!docSnap.exists()) {
			// Get reference to the user path where the users will be stored
			const userRef = doc(db, 'users', user.uid);

			// The initial data to store
			dataToStore = {
				email: user.email,
				posts: []
			};

			// Store data to database
			await setDoc(userRef, dataToStore, { merge: true });
		} else {
			// If document already exists, just set dataToStore to the current document data
			const userData = docSnap.data();
			dataToStore = JSON.parse(JSON.stringify(userData));
		}

		// This will set a session cookie
		setCookie('userUID', user.uid, 7);
		setCookie(
			'userStuff',
			JSON.stringify({
				uid: user.uid,
				username: user.displayName,
				email: user.email,
				isLoggedIn: true
			}),
			7
		);

		return {
			uid: user.uid,
			username: user.displayName,
			email: user.email,
			isLoggedIn: true,
			posts: dataToStore.posts
		};
	} catch (error) {
		// Handle Errors here.
		console.error(error);
	}
}

// It works but for some reason 'auth' variable is always undefined on server side files (x.server.js)
export async function logout() {
	console.log('Logging out...');
	console.log(auth.currentUser?.displayName)
	await signOut(auth);
	console.log('User has logged out.');
	console.log(auth.currentUser?.displayName)
}
