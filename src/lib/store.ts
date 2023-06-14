import { writable, type Writable } from 'svelte/store';
import type { UserData } from './types';

export const currentUser: Writable<UserData> = writable({
	email: '',
	username: '',
	uid: '',
	is_logged_in: false,
	photo_url: ''
});

export const allUsers: Writable<any> = writable([]);

export const isSongPlaying: Writable<boolean | null> = writable(null);