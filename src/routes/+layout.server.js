/** @type {import('./$types').LayoutServerLoad} */

export async function load({ locals }) {
	
	let userStuff = locals.userStuff;
	let userUID = locals.userUID;

	// let userUIDCookie = cookies.get('userUID');
	// let userStuffCookie = cookies.get('userStuff');

	if (userStuff && userUID) {
		console.log('User UID Cookie: ' + userUID);
		console.log('User Stuff Cookie: ' + userStuff);
	}

	return {
		user: userStuff,
		uid: userUID
	};
}
