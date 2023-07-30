import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals: { getSession, supabase }, request }) => {
    // Get user id and old avatar path (in bucket) from locals
    const userID: string | undefined = (await getSession())?.user.id
    const oldAvatarPath: string | undefined = (await getSession())?.user.user_metadata.photo_url_path
    if (!userID) throw error(404, { message: "User ID Not found, try refreshing your session" })

    if (!oldAvatarPath) console.log(`No old avatar path found for - ${userID}`)

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
            photo_url: publicAvatarURL,
        })
        .eq('id', userID)

    if (updateAvatarForOthers.error) {
        throw error(404, { message: updateAvatarForOthers.error })
    }

    // Remove the old avatar file of the current user from the bucket, only do this if it exists
    if (oldAvatarPath) {
        const { error } = await supabase.storage.from('avatars').remove([oldAvatarPath])
        console.log(`Deleting old user pfp of ${userID} from bucket, ERRORS: `, error)
    }

    return json({
        success: true,
        url: publicAvatarURL,
        path: uploadedAvatar.data.path
    })
};
