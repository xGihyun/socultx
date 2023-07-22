import type { AlbumDetailed, SongDetailed } from '$lib/types';
import type { PageServerLoad } from './$types';
import { ytm } from '$lib/music';
import { Innertube } from 'youtubei.js';

export const load: PageServerLoad = async ({ url }) => {
    // const ytm = await Innertube.create();
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
            results: []
        }
    }

    // Use youtubei.js
    const searchResult = await (ytm.get())?.music.search(query, { type: categoryType })
    let results: SongDetailed[] | AlbumDetailed[] = [];
    if (categoryType == "song") {

        results = searchResult?.songs?.contents.map(item => {

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
        results = searchResult?.albums?.contents.map(item => {

            let artists = item.flex_columns[1].title.runs?.filter(i => "endpoint" in i).map(i =>
            ({
                name: i.text as string,
                artistId: i.endpoint.payload.browseId as string,
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