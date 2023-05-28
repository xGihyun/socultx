import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

/** @type {import('./$types').LayoutServerLoad} */

export async function load({ locals }) {
	const userStuff = locals.userStuff;

	if (!userStuff) {
		return;
	}

	// Get all of the documents
	const docCollection = collection(db, 'users');
	const docs = await getDocs(docCollection);

	// I guess this works???
	/**
	 * @type {import("@firebase/firestore").DocumentData[]}
	 */
	let docData = [];

	docs.forEach((doc) => {
		// There is no map() in docs apparently
		docData.push(doc.data());
	});
	// TODO: REFACTOR THIS USE QUERY INSTEAD TO GET THE LATEST DATA!

	return {
		user: userStuff,
		users: docData
	};
}
