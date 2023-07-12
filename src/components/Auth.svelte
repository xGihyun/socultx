<script lang="ts">
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	// import { google } from '../assets/images';
	import type { SupabaseClient } from '@supabase/supabase-js';
	let errorMessage: string | null = null;
	let isUserOnRegister = false;
	let isPasswordVisible = false;
	let email = '';
	let password = '';
	let username = '';
	$: type = isPasswordVisible ? 'text' : 'password';
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

		toastStore.trigger(registerToastMessage);
		// Reset form everything
		email = '';
		password = '';
		username = '';
		isPasswordVisible = false;
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
				<div class="relative">
					<input
						bind:value={password}
						class="input rounded-md"
						name="password"
						{...{ type }}
						placeholder="Password"
					/>
					{#if isUserOnRegister}
						<button
							type="button"
							class="absolute inset-y-0 right-3 flex items-center fill-secondary-700"
							on:click={() => (isPasswordVisible = !isPasswordVisible)}
						>
							{#if isPasswordVisible}
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"
									><path
										d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
									/></svg
								>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"
									><path
										d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
									/></svg
								>
							{/if}
						</button>
					{/if}
				</div>
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
						isPasswordVisible = false;
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
