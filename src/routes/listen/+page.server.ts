import type { SongDetailed, AlbumDetailed } from 'ytmusic-api'
import type { PageServerLoad } from './$types';
import YTMusic from 'ytmusic-api';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q')
    const type = url.searchParams.get('type');
    if (!query) {
        return {
            didUserSearch: false,
            query: null,
            results: []
        }
    }

    // Use yt-music api
    const ytmusic = await new YTMusic().initialize();

    let results: SongDetailed[] | AlbumDetailed[] = []


    if (type == "song") {
        results = await ytmusic.searchSongs(query);
    } else if (type == "album") {
        results = await ytmusic.searchAlbums(query)
    }

    return {
        didUserSearch: true,
        query: query,
        type: type,
        results: results
    }
};