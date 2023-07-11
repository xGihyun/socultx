// src/routes/api/protected-route/+server.ts
import { json, error } from '@sveltejs/kit'

export const POST = async ({ locals: { supabase, getSession }, request }) => {
    const body = await request.json();
    const session = await getSession()

    if (!session) {
        // the user is not signed in
        throw error(401, { message: 'Unauthorized' })
    }

    if (!body.uid) {
        throw error(400, { message: "Missing uid" })
    }

    let validStates = ["online", "offline", "invisible"];
    if (!validStates.includes(body.state)) {
        throw error(400, { message: 'Invalid value for state! possible values are "online", "offline", "invisible"' })
    }

    let status = null;
    if (body.state === "online") status = true;
    else if (body.state === "offline") status = false;
    else if (body.state === "invisible") status = null;

    // Set the user's presence to 'true' in the database
    const results = await supabase
        .from('profiles')
        .update({ is_logged_in: status })
        .eq('id', body.uid)
        .select();

    console.log(results)


    return json(results.data)
}