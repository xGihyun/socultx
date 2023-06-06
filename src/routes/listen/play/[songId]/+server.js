import ytdl from 'ytdl-core';
import Ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

export function GET({ params }) {
    if (!ffmpegPath) {
        console.log("Missing FFMPEG from system, cannot play/stream music")
        return {}
    }

    const { songId } = params;

    console.log(`Will now play the song - https://youtube.com/watch?v=${songId}`)

    const stream = ytdl(songId, {
        quality: 'highestaudio',
    });

    const proc = Ffmpeg({ source: stream }).setFfmpegPath(ffmpegPath).toFormat('mp3');
    const songStream = proc.pipe();

    // return songStream;
    return new Response(songStream, {
        headers: {
            'Content-Type': 'audio/mpeg'
        }
    });

}
