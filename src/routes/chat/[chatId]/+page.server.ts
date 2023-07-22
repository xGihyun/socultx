import { db } from '$lib/supabase';
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	limitToLast,
	orderBy,
	query,
	type DocumentData
} from 'firebase/firestore';
import type { Actions, PageServerLoad } from './$types';
import type { Message } from '$lib/types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const chatId = params.chatId;

	const userMessageCollection = collection(
		db,
		`users/${locals.userStuff.uid}/inbox/${chatId}/messages`
	);

	const q = query(userMessageCollection, orderBy('timestamp', 'asc'), limitToLast(10));

	const userMessageDocs = await getDocs(q);

	let chatHistory: Message[] = [];

	if (!userMessageDocs.empty) {
		userMessageDocs.forEach((message) => {
			chatHistory.push(
				/** @type {import('$lib/types').Message} */(JSON.parse(JSON.stringify(message.data())))
			);
		});
	}

	return {
		chatId: chatId,
		chatHistory: chatHistory
	};
};

export const actions: Actions = {
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
		const receiver: DocumentData | undefined = (receiverDoc.data());

		const currentDate = new Date();

		const messageData: Message = {
			content: inputText.toString(),
			sender_uid: userUID,
			sender_username: username || '',
			sender_photo_url: photoURL || '',
			sender_email: email || '',
			receiver_email: receiver?.email || '',
			receiver_photo_url: receiver?.photo_url || '',
			receiver_uid: receiver?.uid || '',
			receiver_username: receiver?.username || '',
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
		if (userUID !== receiver?.uid) {
			await addDoc(receiverMessageCollection, messageData);
		}
		await addDoc(senderMessageCollection, messageData);
	}
};
