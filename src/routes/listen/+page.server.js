import YTMusic from 'ytmusic-api'
/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
    const query = url.searchParams.get('q')
    if (!query) {
        return {
            didUserSearch: false,
            query: null,
            results: []
        }
    }

    // Use yt-music api
    const ytmusic = await new YTMusic().initialize()
    const results = await ytmusic.searchSongs(query)
    return {
        didUserSearch: true,
        query: query,
        results: results
    }
    // ytmusic.search()
    // ytmusic.search("Lilac").then(results => {
    //     console.log(results)
    // })


}