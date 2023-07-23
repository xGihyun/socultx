import { type Writable, writable } from 'svelte/store';
import type { RealtimeChannel, Session, SupabaseClient } from "@supabase/supabase-js";
// import type { UserData } from './types';

// export const currentUser: Writable<UserData> = writable({
// 	email: '',
// 	username: '',
// 	uid: '',
// 	photo_url: ''
// });

// Global context is an object that contains the `session` and `supabase` 
export const globalContext: Writable<{ session: Session | null, supabase: SupabaseClient } | {}> = writable()
export const receivedFriendRequests: Writable<any[]> = writable([])
export const sentFriendRequests: Writable<any[]> = writable([])

export function resetAllUserStores() {
	globalContext.set({});
	receivedFriendRequests.set([]);
	sentFriendRequests.set([]);
}
// export const allUsers: Writable<any> = writable([]);

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


export const watcher: Store<RealtimeChannel | null> = store(null);