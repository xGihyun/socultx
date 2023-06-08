import { db } from '$lib/firebase/firebase';
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	limitToLast,
	orderBy,
	query
} from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	const chatId = params.chatId;

	const userMessageCollection = collection(
		db,
		`users/${locals.userStuff.uid}/inbox/${chatId}/messages`
	);

	// TODO: Limit the number of messages fetched with limitToLast()
	// I don't even know if this works
	const q = query(userMessageCollection, orderBy('timestamp'), limitToLast(10));

	const userMessageDocs = await getDocs(q);

	/** @type {import('$lib/types').Message[]} */
	let chatHistory = [];

	if (!userMessageDocs.empty) {
		userMessageDocs.forEach((message) => {
			chatHistory.push(
				/** @type {import('$lib/types').Message} */ (JSON.parse(JSON.stringify(message.data())))
			);
		});
	}

	console.log('Chat history:');
	console.log(chatHistory);

	return {
		chatId: chatId,
		chatHistory: chatHistory
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	send: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const inputText = formData.get('content');

		const userUID = locals.userStuff.uid;
		const username = locals.userStuff.username;
		const email = locals.userStuff.email;
		const photoURL = locals.userStuff.photo_url;

		if (!userUID) {
			console.log('No user!');
			return;
		}

		if (!inputText) {
			console.log('Must input text!');
			return;
		}

		const receiverRef = doc(db, 'users', params.chatId);
		const receiverDoc = await getDoc(receiverRef);
		const receiver = /** @type {import('$lib/types').UserData} */ (receiverDoc.data());

		const currentDate = new Date();

		/** @type {import('$lib/types').Message} */
		const messageData = {
			content: inputText.toString(),
			sender_uid: userUID,
			sender_username: username || '',
			sender_photo_url: photoURL || '',
			sender_email: email || '',
			receiver_email: receiver.email || '',
			receiver_photo_url: receiver.photo_url || '',
			receiver_uid: receiver.uid || '',
			receiver_username: receiver.username || '',
			timestamp: Timestamp.fromDate(currentDate)
		};

		const receiverMessageCollection = collection(
			db,
			`users/${params.chatId}/inbox/${locals.userStuff.uid}/messages`
		);
		const senderMessageCollection = collection(
			db,
			`users/${locals.userStuff.uid}/inbox/${params.chatId}/messages`
		);

		// Check if user is talking to themselves to not duplicate the sent message
		if (userUID === receiver.uid) {
			await addDoc(senderMessageCollection, messageData);
		} else {
			await addDoc(senderMessageCollection, messageData);
			await addDoc(receiverMessageCollection, messageData);
		}
	}
};
