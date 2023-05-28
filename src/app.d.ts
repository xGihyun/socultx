// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userUID: string | undefined,
			userStuff: {
				username: string,
				uid: string,
				photoURL: string,
				email: string,
				isLoggedIn: boolean,
			}
			users: array
			// isLoggedIn: boolean,
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
