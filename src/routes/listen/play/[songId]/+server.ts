import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Innertube } from 'youtubei.js'

export const GET: RequestHandler = async ({ params }) => {
    const { songId } = params;

    const ytm = await Innertube.create();

    console.log(`Will now play the song - https://youtube.com/watch?v=${songId}`)
    // Get song url
    const info = await ytm.getBasicInfo(songId, 'TV_EMBEDDED');
    const bestAudioFormat = info.chooseFormat({ type: 'audio', quality: 'best' })
    const url = bestAudioFormat.decipher(ytm.session.player);

    // Get song lyrics if possible
    const lyrics = await ytm.music.getLyrics(songId).catch(() => console.error(`No lyrics found for - ${songId}`));

    return json({
        url: url,
        lyrics: lyrics?.description.text ?? "No lyrics found T_T"
    })
};