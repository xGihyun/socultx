import { db } from '$lib/firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// TODO: Make allUsers reactive, when someone logs in, the green circle appears; when a new user appears, they will appear on the sidebar, etc.
/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	// const q = query(
	// 	collection(db, 'chats'),
	// 	where('members_uid', 'array-contains', locals.userStuff.uid)
	// );

	// /**
	//  * @type {any[]}
	//  */
	// let allInboxes = [];

	// /**
	//  * @type {any[]}
	//  */
	// let receivers = [];

	// const querySnapshot = await getDocs(q);

	// // Maybe it could be better?
	// querySnapshot.forEach((e) => {
	// 	// Would be useful for getting messages later
	// 	// const inboxRef = collection(db, `chats/${e.id}/messages`);
	// 	// const messages = await getDocs(inboxRef);
	// 	// messages.forEach((message) =>
	// 	// 	test.push(/** @type {import('$lib/types').Message} */ (message.data()))
	// 	// );
	// 	allInboxes.push({
	// 		id: e.id,
	// 		data: e.data()
	// 	});
	// });

	// allInboxes.forEach((inbox) => {
	// 	inbox.data.members.forEach((/** @type {{ uid: string | null; }} */ user) => {
	// 		// We only need the other user (receiver)
	// 		if (user.uid !== locals.userStuff.uid) {
	// 			receivers.push({
	// 				id: inbox.id,
	// 				data: user
	// 			});
	// 		}

	// 		// Unless you want to talk to yourself as well...
	// 		// receivers.push({
	// 		// 	id: inbox.id,
	// 		// 	data: user
	// 		// });
	// 	});
	// });

	return {
		inboxes: []
	};
}
