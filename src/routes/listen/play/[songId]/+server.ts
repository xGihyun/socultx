import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ytm } from '$lib/music';

export const GET: RequestHandler = async ({ params }) => {
    const { songId } = params;

    console.log(`Will now play the song - https://youtube.com/watch?v=${songId}`)
    // Get song url, use TV_EMBEDDED to bypass age restricted songs
    const info = await (ytm.get())?.getBasicInfo(songId, 'TV_EMBEDDED');
    const bestAudioFormat = info?.chooseFormat({ type: 'audio', quality: 'best' })
    const url = bestAudioFormat?.decipher((ytm.get())?.session.player);

    // Get song lyrics if possible
    const lyrics = await (ytm.get())?.music.getLyrics(songId).catch(() => console.error(`No lyrics found for - ${songId}`));

    return json({
        url: url,
        lyrics: lyrics?.description.text ?? "No lyrics found T_T"
    })
};