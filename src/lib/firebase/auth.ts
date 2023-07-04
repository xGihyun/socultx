import { invalidateAll } from '$app/navigation';
import { setCookie } from '$lib/cookie';
import { auth, db } from '$lib/firebase/firebase';
import { allUsers, currentUser } from '$lib/store';
import type { UserData } from '$lib/types';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, type DocumentData } from 'firebase/firestore';

// User reference, check if user exists within the database, if not simply create a document
export async function ensureUserExists(user: UserData) {
	const usersRef = doc(db, `users/${user.uid}`)
	const docSnap = await getDoc(usersRef);

	// Check if a document exists
	if (!docSnap.exists()) {
		// Store new user data to database
		await setDoc(usersRef, user, { merge: true });
	}
}

// Get the collection for all the users, responsible for making the sidebar show all users reactively
async function getAllUsers() {
	const allUsersCollectionRef = collection(db, 'users');
	const docs = await getDocs(allUsersCollectionRef);
	allUsers.set(docs)
}

// It will login via a popup window, might not be good for mobile
export async function googleAuthPopup() {

	try {
		const provider: GoogleAuthProvider = new GoogleAuthProvider();
		// Add prompt for user to select an account before log in/register
		provider.setCustomParameters({
			prompt: 'select_account'
		});

		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		// Database stuff
		let dataToStore: UserData = {
			username: user.displayName,
			uid: user.uid,
			email: user.email,
			photo_url: user.photoURL,
			is_logged_in: true
		};

		await ensureUserExists(dataToStore);
		// await getAllUsers();

		let userToken = await user.getIdToken()

		// Calculate the expiration date for 7 days in the future
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);
		// Set cookie
		document.cookie = `sessionCookie=${userToken};expires=${expirationDate.toUTCString()};path=/;secure=true;`;

		await invalidateAll()

		// Set the currentUser store
		console.log('Setting stores...');
		currentUser.set(dataToStore);
		// setContext('user', dataToStore)
		console.log('Stores set!');

	} catch (error: any) {
		// Handle Errors here.
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error(errorMessage)
	}



	// setPersistence(auth, browserLocalPersistence).then(() => {
	// 	const provider: GoogleAuthProvider = new GoogleAuthProvider();
	// 	// Add prompt for user to select an account before log in/register
	// 	provider.setCustomParameters({
	// 		prompt: 'select_account'
	// 	});

	// 	signInWithPopup(auth, provider).then((result) => {

	// 	});

	// }).catch((error) => {

	// })

	/*
	const provider: GoogleAuthProvider = new GoogleAuthProvider();
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
		let dataToStore: UserData = {
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

		let docData: DocumentData[] = [];

		docs.forEach((doc) => {
			docData.push(doc.data());
		});

		allUsers.update((val) => val = (docData));

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
	*/
}
