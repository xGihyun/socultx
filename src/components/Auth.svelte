<script lang="ts">
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { google } from '../assets/images';
	// import { googleLoginPopup, login, register } from '$lib/client/auth';
	// import { deserialize } from '$app/forms';
	// import { invalidateAll } from '$app/navigation';
	// import { login, register } from '$lib/client/auth';
	import type { SupabaseClient } from '@supabase/supabase-js';
	let errorMessage: string | null = null;
	let isUserOnRegister = false;
	let email = '';
	let password = '';
	let username = '';

	export let sb: SupabaseClient;

	const registerToastMessage: ToastSettings = {
		message: 'Account created! Please check your email and verify your account before logging in.',
		timeout: 30000,
		background: 'variant-filled-primary'
	};

	function isPasswordStrong(password: string) {
		let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
		return strongPassword.test(password);
	}

	/* Disabled google login for now, needs further configuration in google cloud
	async function googleLogin() {
		const { data, error } = await sb.auth.signInWithOAuth({
			provider: 'google'
		});

		if (error) {
			console.log(error);
			return;
		}
		console.log(data);
	}
	*/

	async function register() {
		if (!isPasswordStrong(password)) {
			errorMessage = 'Password requirements not met!';
			return;
		}

		const { data, error } = await sb.auth.signUp({
			email: email,
			password: password,
			options: {
				//PKCE flow is not supported on signups with autoconfirm enabled
				data: {
					username: username,
					photo_url: 'https://static.tvtropes.org/pmwiki/pub/images/spongebob_chicken.png'
				}
			}
		});

		if (error) {
			console.log(error);
			errorMessage = error.message;
			return;
		}

		// Fake obfuscated user object is returned with `data.user.identities = []` if user is already registered with the provided email
		// https://github.com/orgs/supabase/discussions/1282
		if (data.user && data.user.identities && data.user.identities.length == 0) {
			errorMessage = 'User is already registered!';
			return;
		}

		console.log(data);

		// TODO: Alert/toast? using skeletonui?
		toastStore.trigger(registerToastMessage);
		// Reset form everything
		email = '';
		password = '';
		username = '';
		errorMessage = null;
		isUserOnRegister = !isUserOnRegister;
	}

	async function login() {
		const { data, error } = await sb.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			errorMessage = error.message;
			return;
		}
		console.log(data);
	}
</script>

<!-- Email + Password sign in/log in -->
<div class="card flex w-80 flex-col gap-4 rounded-md p-4">
	<form
		class="contents"
		on:submit|preventDefault={async () => (isUserOnRegister ? await register() : await login())}
	>
		<h1
			class={isUserOnRegister
				? 'select-none font-gt-walsheim-pro-medium text-4xl text-warning-100'
				: 'select-none font-gt-walsheim-pro-medium text-4xl text-primary-100'}
		>
			{isUserOnRegister ? 'Sign Up' : 'Log In'}
		</h1>
		<hr />
		{#if errorMessage}
			<div>
				<p class="font-gt-walsheim-pro-medium text-error-300">{errorMessage}</p>
				{#if errorMessage === 'Password requirements not met!'}
					<ul class="list-inside list-disc font-gt-walsheim-pro-light text-sm">
						<li><span>Minimum of 8 characters </span></li>
						<li>At least 1 lowercase, uppercase, and special character</li>
					</ul>
				{/if}
			</div>
		{/if}
		<div>
			{#if isUserOnRegister}
				<label class="label mb-4">
					<input
						bind:value={username}
						class="input rounded-md"
						type="text"
						name="username"
						placeholder="Username"
						required
					/>
				</label>
			{/if}
			<label class="label mb-4">
				<input
					bind:value={email}
					class="input rounded-md"
					type="email"
					name="email"
					placeholder="Email"
					required
				/>
			</label>

			<label class="label">
				<input
					bind:value={password}
					class="input rounded-md"
					type="password"
					name="password"
					placeholder="Password"
					required
				/>
			</label>
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
					on:click={() => {
						email = '';
						password = '';
						username = '';
						errorMessage = null;
						isUserOnRegister = !isUserOnRegister;
					}}>{isUserOnRegister ? 'Log In' : 'Sign Up'}</button
				></span
			>
		</div>
	</form>
	<!-- Continue with google -->
	<!-- <hr />
	<button
		class="flex select-none items-center gap-4 rounded-lg border-[1px] border-white p-2"
		on:click={googleLogin}
	>
		<img src={google} alt="google" class="aspect-square w-8" />
		<span class="text-xl">Continue with Google</span>
	</button> -->
</div>
