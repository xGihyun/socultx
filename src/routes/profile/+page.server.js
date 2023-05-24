/** @type {import('./$types').PageServerLoad} */

export async function load({ locals }) {
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	if (!userUID) {
		return;
	}

	return {
		user: userStuff,
		uid: userUID,
	};
}
