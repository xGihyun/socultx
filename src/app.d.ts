// See https://kit.svelte.dev/docs/types#app

import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// userUID: string | undefined;
			user: null | DecodedIdToken
			// userStuff: {
			// 	username: string | null;
			// 	email: string | null;
			// 	photo_url: string | null;
			// 	is_logged_in: boolean;
			// 	uid: string | null;
			// };
			users: Array<any>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
