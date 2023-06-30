import { writable, type Writable } from "svelte/store";
import type { Song } from "./types";
import { PUBLIC_INVIDIOUS_HOSTNAME } from '$env/static/public'
export const musicQueue: Writable<Song[]> = writable([]);
export const currentSongInfo: Writable<Song> = writable();
export const isMusicLoading: Writable<boolean> = writable(false);

// Input (261) -> Output (4:20)
export function getMinAndSec(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes + ':' + remainingSeconds.toString().padStart(2, '0');
}

export async function fetchSongAudioUrl(songId: string) {

    console.log(songId)
    const response = await fetch(`/listen/play/${songId}`)
    const songInfo = await response.json()
    console.log(songInfo)
    return songInfo;

    /*
    const response = await fetch(`https://${PUBLIC_INVIDIOUS_HOSTNAME}/api/v1/videos/${songId}`);
    const songInfo = await response.json();
    // Get best format for audio
    let bestAudioFormat = songInfo.adaptiveFormats.filter(
        (item: { type: string; audioQuality: string; audioSampleRate: number }) => {
            return (
                item.type == 'audio/webm; codecs="opus"' &&
                item.audioQuality == 'AUDIO_QUALITY_MEDIUM' &&
                item.audioSampleRate == 48000
            );
        }
    );
    // console.log(bestAudioFormat[0].url)
    // return bestAudioFormat[0].url
    const audioURL = new URL(bestAudioFormat[0].url);
    // // Replace hostname to get actual media link
    audioURL.hostname = PUBLIC_INVIDIOUS_HOSTNAME;
    return audioURL.toString()
    */
}

export async function fetchAlbumDetails(playlistId: string) {
    // Just use Invidious api for playlists - "https://docs.invidious.io/api/#language"

    // Get the Track ID for every track by scraping from an unlisted Youtube playlist
    let properUrl = `https://${PUBLIC_INVIDIOUS_HOSTNAME}/api/v1/playlists/${playlistId}`;
    let response = await fetch(properUrl);
    let albumInfo = await response.json();
    return albumInfo.videos;
}

export function setSongInfoToStore(
    songId: string,
    songName: string,
    albumInfo: { name: string, albumId: string },
    artistName: string,
    thumbnailUrl: string,
    duration: string | number
) {
    currentSongInfo.set({
        id: songId,
        song: songName,
        artist: artistName,
        album: albumInfo,
        url: '',
        cover_art_url: thumbnailUrl,
        duration: duration as string || getMinAndSec(duration as number)
    })
}
