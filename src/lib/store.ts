import { type Readable, type Writable, writable } from 'svelte/store';
import type { UserData } from './types';

export const currentUser: Writable<UserData> = writable({
	email: '',
	username: '',
	uid: '',
	photo_url: ''
});

export const allUsers: Writable<any> = writable([]);


// Better writable with `.get()` method just copied it here - https://github.com/sveltejs/svelte/issues/2060
export type Store<T> = Writable<T> & { get(): T };

export function store<T>(value: T): Store<T> {
	let originalWritable = writable<T>(value);
	function set(newValue: any) {
		return originalWritable.set(value = newValue);
	}
	function update(fn: (originalValue: T) => T) {
		originalWritable.update((oldValue: T) => (value = fn(oldValue)));
	}
	function get() {
		return value;
	}
	return { set, update, subscribe: originalWritable.subscribe, get }
}