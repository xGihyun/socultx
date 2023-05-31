import { writable } from 'svelte/store';

/**
 * @type {import("svelte/store").Writable<import('$lib/types').UserData>}
 */
export const currentUser = writable({
	email: '',
	username: '',
	uid: '',
	is_logged_in: false,
	photo_url: ''
});

/**
 * @type {import("svelte/store").Writable<import('$lib/types').UserData[]>}
 */
export const allUsers = writable([]);
