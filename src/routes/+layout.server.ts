import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// if (!locals.userStuff) {
	// 	return;
	// }

	// // Get all of the documents
	// const usersCollection = collection(db, 'users');
	// const usersDocs = await getDocs(usersCollection);

	// /** @type {import('$lib/types').UserData[]} */
	// let docData: DocumentData[] = [];

	// usersDocs.forEach((doc) => {
	// 	docData.push(/** @type {import('$lib/types').UserData} */(doc.data()));
	// });



	// /**
	//  * @type {{ id: string; user: { uid: string | null; }; }[]}
	//  */
	// let userInbox = [];

	// const userInboxCollection = collection(db, `users/${locals.userStuff.uid}/inbox`);
	// const userInboxDocs = await getDocs(userInboxCollection);

	// TODO: The inbox / list of users you've talked too

	// return {
	// 	users: docData,
	// 	user: locals.userStuff
	// };

	const user = locals.user;
	return { user }
};