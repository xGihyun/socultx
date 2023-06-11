// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userUID: string | undefined;
			userStuff: {
				username: string | null;
				email: string | null;
				photo_url: string | null;
				is_logged_in: boolean;
				uid: string | null;
			};
			users: Array<any>;
			// isLoggedIn: boolean,
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
