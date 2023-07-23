import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals: { getSession, supabase }, request }) => {
    // Get user id from locals
    const userID = (await getSession())?.user.id
    if (!userID) throw error(404, { message: "User ID Not found, try refreshing your session" })

    const requestFormData = await request.formData();
    const photoName = requestFormData.get('file_name') as string;
    const blob = requestFormData.get('blob') as File;
    const fileName = `${userID}_${photoName}`;

    // Upload avatar to bucket
    const uploadedAvatar = await supabase.storage
        .from('avatars')
        .upload(fileName, blob)

    if (uploadedAvatar.error) {
        throw error(404, { message: uploadedAvatar.error });
    }

    // Get avatar url, note that `uploadedAvatar.data.path` is the filename of the avatar like `userid_filename.jpg`
    const publicAvatarURL = (await supabase.storage
        .from('avatars')
        .getPublicUrl(uploadedAvatar.data.path)).data.publicUrl


    // Update the user's profile picture
    // # UPDATE FOR OTHER USERS TO SEE IN THEIR SIDEBAR `profiles` table
    const updateAvatarForOthers = await supabase
        .from('profiles')
        .update({
            photo_url: publicAvatarURL
        })
        .eq('id', userID)

    if (updateAvatarForOthers.error) {
        throw error(404, { message: updateAvatarForOthers.error })
    }

    return json({
        success: true,
        url: publicAvatarURL
    })
};
