/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();
        const query = form.get('q');
        console.log(`User searched for : ${query}`);
        return {
            success: "true",
            query: query
        }
    }
};

// /** @type {import('./$types').PageServerLoad} */
// export async function load({ request }) {
//     const form = await request.formData();
//     // if (!form) {
//     //     return;
//     // }
//     // const query = form.get('q');
//     // console.log(`User searched for : ${query}`);
//     // return {
//     //     success: "true",
//     //     query: query
//     // }
// }