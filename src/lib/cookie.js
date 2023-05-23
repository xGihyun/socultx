/**
 * Set cookies here since Firebase's Google auth won't work on SvelteKit's form actions
 * @param {string} name
 * @param {string | number | boolean} value
 * @param {number} expirationDays
 */
export function setCookie(name, value, expirationDays) {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + expirationDays);

	const cookieValue = value + '; expires=' + expirationDate.toUTCString() + '; path=/';
	document.cookie = name + '=' + cookieValue + ';secure=true';
}
