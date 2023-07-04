<script lang="ts">
	// import { googleAuthPopup } from '$lib/firebase/auth';
	// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
	import { google } from '../assets/images';
	// import { auth } from '$lib/firebase/firebase';
	import { enhance } from '$app/forms';
	import { googleAuthPopup } from '$lib/firebase/auth';
	// import { redirect } from '@sveltejs/kit';
	// import { goto } from '$app/navigation';
	export let message: string | undefined;
	let isUserOnRegister = false;
	let email = '';
	let password = '';
	let confirmPassword = '';

	// async function handleSubmit() {
	// 	console.log('I believe theres a cookie now?');
	// 	// This if condition will validite the values of all variables included
	// 	if (!email || !password || (isUserOnRegister && !confirmPassword)) {
	// 		return;
	// 	}

	// 	// This means the user is trying to register
	// 	if (isUserOnRegister && password === confirmPassword) {
	// 		try {
	// 			await createUserWithEmailAndPassword(auth, email, password);
	// 			console.log('Successfully created new user -> ', email);
	// 		} catch (err: any) {
	// 			alert(err.message);
	// 			console.error(err);
	// 			goto('/', { invalidateAll: true });
	// 		}
	// 	} else {
	// 		// Else the user is trying to log in
	// 		try {
	// 			await signInWithEmailAndPassword(auth, email, password);
	// 			console.log('Successfully logged in -> ', email);
	// 		} catch (err: any) {
	// 			alert(err.message);
	// 			console.error(err);
	// 			goto('/', { invalidateAll: true });
	// 		}
	// 	}
	// }
</script>

<!-- Email + Password sign in/log in -->
<div class="card flex flex-col gap-4 rounded-md p-4">
	<form
		class="contents"
		method="post"
		action={isUserOnRegister ? '?/register' : '?/login'}
		use:enhance
	>
		<h1
			class={isUserOnRegister
				? 'select-none font-gt-walsheim-pro-medium text-4xl text-warning-100'
				: 'select-none font-gt-walsheim-pro-medium text-4xl text-primary-100'}
		>
			{isUserOnRegister ? 'Sign Up' : 'Log In'}
		</h1>
		<hr />
		{#if message}
			<p class="font-gt-walsheim-pro-medium text-error-300">{message}</p>
		{/if}
		<div>
			<label class="label mb-4">
				<input
					bind:value={email}
					class="input rounded-md"
					type="email"
					name="email"
					placeholder="Email"
				/>
			</label>

			<label class="label">
				<input
					bind:value={password}
					class="input rounded-md"
					type="password"
					name="password"
					placeholder="Password"
				/>
			</label>
			{#if isUserOnRegister}
				<label class="label mt-4">
					<input
						bind:value={confirmPassword}
						class="input rounded-md"
						type="password"
						name="confirmPassword"
						placeholder="Confirm password"
					/>
				</label>
			{/if}
		</div>
		<!-- Register/Create account button -->
		<button class="variant-glass-secondary btn mt-2 flex w-full rounded-md" type="submit">
			<span class="text-xl">{isUserOnRegister ? 'Sign Up' : 'Log In'}</span>
		</button>

		<div class="font-gt-walsheim-pro-light">
			<span
				>{isUserOnRegister ? 'Already have an account? ' : "Don't have an account? "}<button
					type="button"
					class={isUserOnRegister
						? 'btn m-0 p-0 font-gt-walsheim-pro-medium text-primary-200 outline-none'
						: 'btn m-0 p-0 font-gt-walsheim-pro-medium text-warning-200 outline-none'}
					on:click={() => (isUserOnRegister = !isUserOnRegister)}
					>{isUserOnRegister ? 'Log In' : 'Sign Up'}</button
				></span
			>
		</div>
	</form>
	<!-- Continue with google -->
	<hr />
	<button
		class="flex select-none items-center gap-4 rounded-lg border-[1px] border-white p-2"
		on:click={googleAuthPopup}
	>
		<img src={google} alt="google" class="aspect-square w-8" />
		<span class="text-xl">Continue with Google</span>
	</button>
</div>
