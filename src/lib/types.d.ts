import type { Timestamp } from "firebase/firestore";

export type UserData = {
	username: string | null;
	email: string | null;
	photo_url: string | null;
	is_logged_in: boolean;
	uid: string | null;
};

export type UserDataInbox = {
	id: string;
	user: UserData;
};

export type Post = {
	id: string;
	content: string;
	userUID: string;
	user: string;
};

export type Inbox = {
	chat_id: string;
	chat_name: string;
	chat_photo_url: string;
};

export type Message = {
	content: string;
	sender_uid: string;
	sender_username: string;
	sender_photo_url: string;
	sender_email: string;
	receiver_uid: string;
	receiver_username: string;
	receiver_photo_url: string;
	receiver_email: string;
	timestamp: Timestamp;
};

export type Song = {
	song: string,
	artist: string,
	url: string,
	cover_art_url: thumbnailUrl,
	duration: string,
}