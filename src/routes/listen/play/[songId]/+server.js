import ytdl from 'ytdl-core';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
    const { songId } = params;

    console.log(`Will now play the song - https://youtube.com/watch?v=${songId}`)
    const information = await ytdl.getInfo(songId);
    const audioFormats = ytdl.filterFormats(information.formats, 'audioonly')
    const format = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' })

    return json(format);
}
