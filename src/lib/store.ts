import { writable, type Writable } from 'svelte/store';
import type { Song, UserData } from './types';
import { browser } from '$app/environment';

export const currentUser: Writable<UserData> = writable({
	email: '',
	username: '',
	uid: '',
	is_logged_in: false,
	photo_url: ''
});

export const allUsers: Writable<any> = writable([]);

export const musicQueue: Writable<Song[]> = writable([]);