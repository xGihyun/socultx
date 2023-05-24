import { writable } from "svelte/store";

/**
 * @type {import("svelte/store").Writable<{ email: string | null | undefined; uid: string | null | undefined; username: string | null | undefined; isLoggedIn: boolean }>}
 */
export const userInfo = writable({
  email: '',
  username: '',
  uid: '',
  isLoggedIn: false,
});