import { db } from '$lib/supabase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uid } from 'uid';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const inputText = formData.get('content');
		const userUID = locals.userUID;

		if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log('Posting...');

		const userRef = doc(db, 'users', userUID);
		const docSnap = await getDoc(userRef);
		const userData = docSnap.data();
		const postID = uid(32);
		const username = locals.userStuff.username;

		let dataToStore = JSON.parse(JSON.stringify(userData));

		// Only allow to push posts if there is an input
		if (!inputText) {
			console.log('Must input text!');
			return;
		}

		// This might seem too repetitive, I'm too lazy
		dataToStore.posts.push({
			content: inputText,
			userUID: userUID,
			user: username || '',
			id: postID
		});

		// Store data to database
		await setDoc(userRef, dataToStore, { merge: true });

		console.log('Posted!');
	}
};


