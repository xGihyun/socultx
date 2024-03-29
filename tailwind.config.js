/** @type {import('tailwindcss').Config} */
module.exports = {
	// 1. Apply the dark mode class setting:
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 2. Append the path for the Skeleton NPM package and files:
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				'gt-walsheim-pro-medium': ['gt-walsheim-pro-medium', 'sans-serif'],
				'gt-walsheim-pro-light': ['gt-walsheim-pro-light', 'sans-serif'],
				'gt-walsheim-pro-thin': ['gt-walsheim-pro-thin', 'sans-serif'],
			},

			animation: {
				text: 'text 5s ease infinite',
			},
			keyframes: {
				text: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center',
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center',
					},
				},
			},
			padding: {
				'resp': '5%',
			}


		}
	},
	plugins: [
		// 3. Append the Skeleton plugin to the end of this list
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')(),
		require('@tailwindcss/forms')
	]
};
