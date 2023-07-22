import type { AlbumDetailed, SongDetailed } from '$lib/types';
import type { PageServerLoad } from './$types';
import { ytm } from '$lib/music';
import { Innertube } from 'youtubei.js';
import type { TextRun } from 'youtubei.js/dist/src/parser/misc';

export const load: PageServerLoad = async ({ url }) => {
    if (ytm.get() == null) {
        ytm.set(await Innertube.create());
        console.log("Initializing innertube api...")
    }

    const query = url.searchParams.get('q')
    const categoryType: any = url.searchParams.get('type');
    if (!query) {
        return {
            didUserSearch: false,
            query: null,
            type: null,
            results: {
                songs: [],
                albums: []
            }
        }
    }

    // Use youtubei.js
    let results: { songs: SongDetailed[], albums: AlbumDetailed[] } = {
        songs: [],
        albums: []
    }
    const searchResult = await (ytm.get())?.music.search(query, { type: categoryType })
    if (categoryType == "song") {

        results.songs = searchResult?.songs?.contents.map(item => {

            let artists = item.artists?.map(i => ({ name: i.name as string, artistId: i.channel_id as string })) ?? []

            return {
                name: item.title as string,
                type: "SONG",
                videoId: item.id as string,
                artists: artists,
                album: {
                    name: item.album?.name as string,
                    albumId: item.album?.id as string
                },
                duration: {
                    text: item.duration?.text as string,
                    seconds: item.duration?.seconds as number
                },
                thumbnails: item.thumbnails.map(i => ({
                    url: i.url,
                    height: i.height,
                    width: i.width
                }))
            }
        }) ?? []

    } else if (categoryType == "album") {
        results.albums = searchResult?.albums?.contents.map(item => {

            let artists = (item.flex_columns[1].title.runs?.filter(i => "endpoint" in i) as TextRun[]).map((i) =>
            ({
                name: i.text as string,
                artistId: i.endpoint?.payload.browseId as string,
            })) ?? []

            let playlistId = item.overlay?.content?.endpoint.payload.playlistId ?? null

            return {
                year: item.year as string,
                name: item.title as string,
                albumId: item.id as string,
                artists: artists,
                playlistId: playlistId,
                thumbnails: item.thumbnails.map(i => ({
                    url: i.url,
                    height: i.height,
                    width: i.width
                }))
            }
        }) ?? []
    }

    return {
        didUserSearch: true,
        query: query,
        type: categoryType,
        results: results
    }

};