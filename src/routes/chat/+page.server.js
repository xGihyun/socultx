import { db } from '$lib/firebase/firebase';
// import { redirect } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */

export async function load({ locals }) {
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	if (!userUID) {
		return;
	}

	// Document of the current user only
	const userRef = doc(db, 'users', userUID);
	const docSnap = await getDoc(userRef);
	const userData = docSnap.data();

	// Get all of the documents
	const docCollection = collection(db, 'chats');
	const docs = await getDocs(docCollection);

	// I guess this works???
	/**
	 * @type {import("@firebase/firestore").DocumentData[]}
	 */
	let docData = [];

	docs.forEach((doc) => {
		// There is no map() in docs apparently
		docData.push(doc.data())
	})	

	console.log('Run') 
	// console.log(docData);

	/**
	 * The user data to store
	 * @type {import('$lib/types').UserData}
	 */

	let dataToStore = JSON.parse(JSON.stringify(userData));

	// console.log('User UID Cookie: ' + userUID);
	// console.logA'\nUser logged in (page.server.js): ' + locals.isLoggedIn); // console.log('User posts: ' + dataToStore.posts);

	return {
		users: docData,
		user: userStuff,
		uid: userUID,
		posts: dataToStore.posts,
	};
}