import { watcher } from '$lib/store';
// import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession, supabase } }) => {
	if (watcher.get() == null) {
		// Starting watcher
		console.log('Starting User Presence Watcher!');
		// Assign a value to the 'store' wherein the RealtimeChannel is 'users'
		watcher.set(supabase.channel('users'));

		// Set listener if the user leaves or joins the channel
		watcher
			.get()
			// ?.on('presence', { event: 'sync' }, () => {
			// 	const newState = (watcher.get())?.presenceState()
			// 	console.log('Syncing -> ', newState)
			// })
			?.on('presence', { event: 'leave' }, async ({ leftPresences }) => {
				// Set the user's presence to 'false' in the database
				if (leftPresences[0].uid) {
					const { error } = await supabase
						.from('profiles')
						.update({
							is_logged_in: false,
							activity: null
						})
						.eq('id', leftPresences[0].uid)
					console.log(`Action: LEAVE, User Id: ${leftPresences[0].uid}, Error: ${error}`)
				}
			})
			.on('presence', { event: 'join' }, async ({ newPresences }) => {
				if (newPresences[0].uid) {
					const { error } = await supabase
						.from('profiles')
						.update({ is_logged_in: true })
						.eq('id', newPresences[0].uid);
					console.log(`Action: JOIN, User Id: ${newPresences[0].uid}, Error: ${error}`);
				}
			})
			.subscribe();
	} else {
		console.log('User Presence Watcher is already running, skipping...');
	}

	return {
		session: await getSession()
	};
};
