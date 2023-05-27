import { setCookie } from '$lib/cookie';
import { auth, db } from '$lib/firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
			photoURL: user.photoURL,
			isLoggedIn: true,
			posts: []
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
			await setDoc(userRef, { isLoggedIn: true }, { merge: true });
		}

		// This will set a session cookie
		setCookie('userUID', user.uid, 7);
		setCookie(
			'userStuff',
			JSON.stringify({
				uid: user.uid,
				username: user.displayName,
				email: user.email,
				isLoggedIn: true,
				photoURL: user.photoURL
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
// export async function logout() {
// 	console.log('Logging out...');
// 	console.log(auth.currentUser?.displayName)
// 	await signOut(auth);
// 	console.log('User has logged out.');
// 	console.log(auth.currentUser?.displayName)
// }
