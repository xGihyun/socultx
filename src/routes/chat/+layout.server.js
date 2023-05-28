import { db } from '$lib/firebase/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params, locals }) {
	const userStuff = locals.userStuff;
	const userUID = userStuff.uid;
	const receiverId = params.chatId;

	// Query to get all conversations the current user is a part of
	const q = query(
		collection(db, `users/${userUID}/conversations`),
		where('members', 'array-contains', userUID)
	);

	const querySnapshot = await getDocs(q);

	/**
	 * @type {{ docID: string; docData: import("@firebase/firestore").DocumentData; }[]}
	 */
	let test = [];

	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		// console.log(doc.id, ' => ', doc.data());
		test.push({
			docID: doc.id,
			docData: doc.data()
		});
	});


	return {
		test: 'test chat layout'
	};
}
