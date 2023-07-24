<script lang="ts">
	// import type { UserData } from '$lib/types';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { crop } from '$lib/pkg/rust_utils';
	import { getContext } from 'svelte';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import type { Writable } from 'svelte/store';

	// Now using getContext
	let globalContext: Writable<{ session: Session; supabase: SupabaseClient }> =
		getContext('globalContext');

	const AVATAR = {
		width: 160,
		height: 160
	};

	const popupChangeAvatar: PopupSettings = {
		event: 'click',
		target: 'avatar',
		placement: 'bottom'
	};

	let selectedAvatar: File | null = null;
	let uploadAvatarEl: HTMLInputElement;

	async function handleFileUpload() {
		if (!selectedAvatar) return;

		const formData = new FormData();

		const bannerArrayBuffer = await selectedAvatar.arrayBuffer();
		const bannerBytes = new Uint8Array(bannerArrayBuffer);

		// Crops the image to exactly whatever width and height you set it to (in this case, 160x160) while preserving its aspect ratio
		// Returns an array of u8, like the bytes of the image
		// On firebase you can upload image with just the bytes, idk about Supabase
		// Maybe convert from bytes -> image before uploading to Supabase if it doesn't support uploading with bytes
		// NOTE: it will return the image in Jpeg format, when I tried to convert it to WebP, I get clang errors for some reason T^T
		const croppedBannerBytes = crop(bannerBytes, AVATAR.width, AVATAR.height);

		// Idk how to upload files to Supabase yet
		formData.append('blob', new Blob([croppedBannerBytes], { type: 'image/jpeg' }));
		formData.append('file_name', selectedAvatar.name);

		// NOTE: Use form actions instead?
		const response: { success: boolean; url: string } = await (
			await fetch('/api/photo/upload', {
				method: 'POST',
				body: formData
			})
		).json();

		console.log(response);

		if (response.success) {
			// NEEDS TO BE CLIENT SIDE???
			const updateAvatarForMyself = await $globalContext.supabase.auth.updateUser({
				data: {
					photo_url: response.url
				}
			});

			if (updateAvatarForMyself.error) {
				console.log(
					'Error updating user profile for the current user, just reload page: ',
					updateAvatarForMyself.error
				);
			}

			// TODO: Make realtime change user profile for the current user to see
			console.log(
				"SINCE THE USER CHANGED PFP's this is now the new SESSION OBJECT ==> ",
				updateAvatarForMyself.data
			);
		}

		// supabase;
		// if (response.ok) {
		// 	console.log('Successfully changed profile picture.');
		// 	// # UPDATE FOR THE CURRENT USER TO SEE IN THEIR NAVBAR AND PROFILE `auth` table
		// 	const updateAvatarForMyself = await supabase.auth.updateUser({
		// 		data: {
		// 			photo_url: publicAvatarURL
		// 		}
		// 	})

		// 	if (updateAvatarForMyself.error) {
		// 		throw error(404, { message: updateAvatarForMyself.error })
		// 	}

		// } else {
		// 	console.error('Error changing profile picture.');
		// }
	}

	async function removeAvatar() {
		// if (!user.photo_url) return;
		// NOTE: Use form actions instead?
		// const response = await fetch('./api/photo/remove', {
		// 	method: 'POST'
		// });
		// if (response.ok) {
		// 	console.log('Successfully removed profile picture.');
		// } else {
		// 	console.error('Error removing profile picture.');
		// }
	}

	function handleSelectedAvatar(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!target.files) return;

		selectedAvatar = target.files[0];

		handleFileUpload();
	}
</script>

<div
	class="mb-20 flex h-28 w-full items-center gap-4 px-resp bg-surface-50-900-token lg:mb-28 lg:h-32"
>
	<button
		class="shadow-profile flex h-16 w-16 rounded-full lg:mb-10 lg:h-40 lg:w-40 lg:flex-none lg:self-end"
		title="Change your avatar!"
		use:popup={popupChangeAvatar}
	>
		<Avatar src={$globalContext.session.user.user_metadata.photo_url} width="w-20 lg:w-40" />
	</button>

	<div
		class="z-20 w-40 py-2 shadow-xl transition-none duration-0 bg-surface-200-700-token"
		data-popup="avatar"
	>
		<button
			class="w-full px-2 py-1 hover:bg-surface-400-500-token"
			on:click={() => uploadAvatarEl.click()}
		>
			<span class="text-base">Change avatar</span>
		</button>
		<button class="w-full px-2 py-1 hover:bg-surface-400-500-token" on:click={removeAvatar}>
			<span class="text-base">Remove avatar</span>
		</button>
		<div class="arrow bg-surface-200-700-token" />
	</div>

	<input
		type="file"
		accept="image/*"
		name="photo"
		hidden
		on:change={handleSelectedAvatar}
		bind:this={uploadAvatarEl}
	/>

	<div class="flex h-full flex-col justify-center">
		<span class="text-base lg:text-2xl">
			{$globalContext.session.user.user_metadata.username}
		</span>
	</div>
</div>
