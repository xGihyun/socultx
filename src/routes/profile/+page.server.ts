import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	if (!userUID) {
		return;
	}

	return {
		user: userStuff,
		uid: userUID,
	};
};
