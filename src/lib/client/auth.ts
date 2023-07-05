import { invalidateAll } from '$app/navigation';
import { auth, db } from '$lib/client/firebase';
import { allUsers, currentUser } from '$lib/store';
import type { UserData } from '$lib/types';
import type { ActionResult } from '@sveltejs/kit';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, type UserCredential } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, type DocumentData } from 'firebase/firestore';

// User reference, check if user exists within the database/firestore, if not simply create a document
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
// async function getAllUsers() {
// 	const allUsersCollectionRef = collection(db, 'users');
// 	const docs = await getDocs(allUsersCollectionRef);
// 	allUsers.set(docs)
// }

function isPasswordStrong(password: string) {
	let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
	return strongPassword.test(password);
}

export async function register(email: string, password: string, confirmPassword: string) {
	if (!email || !password) {
		return { type: 'failure', status: 400, data: { message: 'Email or password are missing!' } }
	}

	if (!isPasswordStrong(password)) {
		return { type: 'failure', status: 400, data: { message: 'Password requirements not met!' } }
	}

	if (password !== confirmPassword) {
		return { type: 'failure', status: 400, data: { message: 'Password does not match!' } }
	}

	try {
		const credential = await createUserWithEmailAndPassword(auth, email, password);
		return {
			type: 'success',
			status: 200,
			data: { credential }
		}
	} catch (error: any) {
		if (error.message == "Firebase: Error (auth/email-already-in-use).") {
			return {
				type: 'failure',
				status: 403,
				data: { message: "Account already registered!" }
			}
		}
		return {
			type: 'failure',
			status: 403,
			data: { message: error.message }
		}
	}

}

export async function login(email: string, password: string) {
	if (!email || !password) {
		return { type: 'failure', status: 400, data: { message: 'Email or password are missing!' } }
	}

	try {
		const credential = await signInWithEmailAndPassword(auth, email, password);
		return {
			type: 'success',
			status: 200,
			data: { credential },
		}
	} catch (error: any) {
		if (error.message == "Firebase: Error (auth/user-not-found).") {
			return {
				type: 'failure',
				status: 403,
				data: { message: "Account not found!" }
			}
		}
		return {
			type: 'failure',
			status: 403,
			data: { message: error.message }
		}
	}
}


// It will login via a popup window, might not be good for mobile
export async function googleLoginPopup() {

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
		console.log(errorCode, errorMessage)
	}
}
