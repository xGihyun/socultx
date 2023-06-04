import YTMusic from 'ytmusic-api'
/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
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
    const ytmusic = await new YTMusic().initialize()

    /**
     * @type {{ name: string; type: "SONG"; videoId: string; artists: { name: string; artistId: string; }[]; album: { name: string; albumId: string; }; duration: number; thumbnails: { url: string; width: number; height: number; }[]; }[] | { year: number | null; name: string; type: "ALBUM"; albumId: string; artists: { name: string; artistId: string; }[]; thumbnails: { url: string; width: number; height: number; }[]; playlistId: string; }[]}
     */
    let results = [];
    if (type == "1") {
        results = await ytmusic.searchSongs(query);
    } else if (type == "2") {
        results = await ytmusic.searchAlbums(query)
    }

    return {
        didUserSearch: true,
        query: query,
        results: results
    }
}