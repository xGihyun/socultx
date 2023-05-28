import { db } from '$lib/firebase/firebase';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { uid } from 'uid';



/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	const userStuff = locals.userStuff;
	const userUID = userStuff.uid;
	const receiverId = params.chatId;
	// console.log(userStuff)
	// console.log('-------');
	// console.log(userUID);
	// console.log('--------');
	// console.log(receiverId);

	// Just return the id of the receiver to the clientside
	return {
		receiverId: receiverId
	}

}



/** @type {import('./$types').PageServerLoad} */
// export async function load({ locals, params }) {
// 	const userStuff = locals.userStuff;
// 	const userUID = userStuff.uid;
// 	const receiverId = params.chatId;

// 	const user2 = (await getDoc(doc(db, `users/${receiverId}`))).data();

// 	// Current user (sender)
// 	const userMessages = await getDocs(
// 		collection(db, `users/${userUID}/conversations/${receiverId}/messages`)
// 	);

// 	/**
// 	 * @type {import("@firebase/firestore").DocumentData[]}
// 	 */
// 	let docUserMessages = [];

// 	userMessages.forEach((message) => {
// 		docUserMessages.push(JSON.parse(JSON.stringify(message.data())));
// 	});

// 	// Receiver
// 	const receiverMessages = await getDocs(
// 		collection(db, `users/${receiverId}/conversations/${userUID}/messages`)
// 	);

// 	/**
// 	 * @type {import("@firebase/firestore").DocumentData[]}
// 	 */
// 	let docReceiverMessages = [];

// 	receiverMessages.forEach((message) => {
// 		docReceiverMessages.push(JSON.parse(JSON.stringify(message.data())));
// 	});

// 	const messages = docUserMessages;

// 	docReceiverMessages.forEach((message) => {
// 		messages.push(message);
// 	});

// 	messages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

// 	// we should probably do this client side

// 	return {
// 		receiverUID: receiverId,
// 		userUID: userUID,
// 		messages: messages
// 	};
// }

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const inputText = formData.get('content');
		const userUID = locals.userUID;
		const username = locals.userStuff.username;
		const email = locals.userStuff.email;
		const photoURL = locals.userStuff.photoURL;
		const receiverId = params.chatId;

		if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log('Sending...');

		const date = new Date();

		const messageData = {
			content: inputText,
			sender_id: userUID,
			sender_username: username,
			photo_url: photoURL,
			sender_email: email,
			timestamp: date
		};

		const user2 = await getDoc(doc(db, `users/${receiverId}`));

		/**
		 * @type {string}
		 */
		const receiver = user2.data()?.username;

		/**
		 * @type {string}
		 */
		const receiverPhotoUrl = user2.data()?.photoURL;

		const conversationData = {
			type: 'dm',
			photo_url: receiverPhotoUrl,
			name: receiver,
			members: [userUID, receiverId]
		};

		// Only allow to push posts if there is an input
		if (!inputText) {
			console.log('Must input text!');
			return;
		}

		const members = [userUID, receiverId];
		const testUid = uid(32);

		const testDocRef = doc(db, 'chats', testUid)

		const testDocSnap = await getDoc(testDocRef);

		if (!testDocSnap.exists()) {
			await addDoc(collection(db, 'chats'), members)
		}

		// const docRef = doc(db, `chats/${userUID}/conversations/${receiverId}`);
		// const docSnap = await getDoc(docRef);

		// console.log(docSnap);

		// await setDoc(docRef, conversationData, { merge: true });
		// await setDoc(testDocRef, { members }, { merge: true });

		// await setDoc(testDocRef, { members }, { merge: true });


		// Add message data to database
		// await addDoc(collection(db, `chats/${testDocRef.id}/messages`), messageData);

		// starting point, everyone has `inbox` property 
		// person1: `users/[userid]/inbox/[abcd]`
		// person2: `users/[userid]/inbox[bcalksjd]`

		// when chatting for first time, add both RANDOMLY GENERATED CHAT ID to inbox of sender and receiver
		// siguro some kind of object na ippush dun sa `inbox` ng sender at receiver...
		/*
			let randomlygenchatuid = uid(64)
			// The sender "Mister" (person1) will send first message to "John" (per)
			await addDoc(collection(db, `users/${person1uid}/inbox), {
				id: randomlygenchatuid,
				chatname: 
			})
		 */
		// person1 (a.k.a Mister): `users/[userid]/inbox[{}, { dmrandomgen: zzzzzz, chatname: "John", isGroupchat: false}]`
		// person2 (a.k.a John): `users/[userid]/inbox[{}, { dmrandomgen: zzzzzz, chatname: "Mister", isGroupchat: false}, {dmname: john, isGroupchat: true}]`
		// person3: `users/[userid]/inbox[{}, { dmrandomgen: sfdsf, chatname: "John", isGroupchat: true}]`

		// `chats/dm/zzzzzz/mga messages`
		// `chats/gc/somrandomid/mga messages`

		// -----
		// person1 chats person2 again by clicking on profile from sidebar

		// - kunin userid ng receiver nasa `params` yan
		// - check kuununng may common
		// - tsaka na kukuha ng data sa `chats/zzzzzz/laman ng chat mga messages`

		console.log('Sent!');
	}
};
