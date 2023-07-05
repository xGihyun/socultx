<script lang="ts">
	import { google } from '../assets/images';
	import { ensureUserExists, googleLoginPopup, login, register } from '$lib/client/auth';
	import { deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let message: string | undefined;
	let isUserOnRegister = false;
	let email = '';
	let password = '';
	let confirmPassword = '';

	async function handleSubmit(this: HTMLFormElement) {
		const formData = new FormData(this);
		if (isUserOnRegister) {
			// Register
			const result = await register(email, password, confirmPassword);
			if (result.type === 'failure') {
				message = result.data?.message;
				return;
			}

			let userToken = await result.data.credential?.user.getIdToken();
			formData.set('userToken', userToken as string);

			const response = await fetch(this.action, {
				method: 'POST',
				body: formData
			});

			const responseResult = deserialize(await response.text());

			if (responseResult.type === 'success') {
				await invalidateAll();
			}
		} else {
			// Login
			const result = await login(email, password);

			if (result.type === 'failure') {
				message = result.data?.message;
				return;
			}

			let userToken = await result.data.credential?.user.getIdToken();
			formData.set('userToken', userToken as string);

			const response = await fetch(this.action, {
				method: 'POST',
				body: formData
			});

			const responseResult = deserialize(await response.text());

			if (responseResult.type === 'success') {
				await invalidateAll();
			}
		}
	}
</script>

<!-- Email + Password sign in/log in -->
<div class="card flex w-80 flex-col gap-4 rounded-md p-4">
	<form
		class="contents"
		method="post"
		action={isUserOnRegister ? '?/register' : '?/login'}
		on:submit|preventDefault={handleSubmit}
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
			<div>
				<p class="font-gt-walsheim-pro-medium text-error-300">{message}</p>
				{#if message === 'Password requirements not met!'}
					<ul class="list-inside list-disc font-gt-walsheim-pro-light text-sm">
						<li><span>Minimum of 8 characters </span></li>
						<li>At least 1 lowercase, uppercase, and special character</li>
					</ul>
				{/if}
			</div>
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
					on:click={() => {
						email = '';
						password = '';
						confirmPassword = '';
						message = undefined;
						isUserOnRegister = !isUserOnRegister;
					}}>{isUserOnRegister ? 'Log In' : 'Sign Up'}</button
				></span
			>
		</div>
	</form>
	<!-- Continue with google -->
	<hr />
	<button
		class="flex select-none items-center gap-4 rounded-lg border-[1px] border-white p-2"
		on:click={googleLoginPopup}
	>
		<img src={google} alt="google" class="aspect-square w-8" />
		<span class="text-xl">Continue with Google</span>
	</button>
</div>
