/** @type {import('./$types').LayoutServerLoad} */

export async function load({ locals }) {
	
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	// if (userUID) {
	// 	console.log('User logged in (layout.server.js): ' + locals.userStuff.isLoggedIn);
	// 	console.log('User Stuff Cookie: ' + userStuff);
	// }

	return {
		user: userStuff,
		uid: userUID,
	};
}
