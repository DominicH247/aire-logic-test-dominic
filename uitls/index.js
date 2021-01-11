/**
 * Parses the array of artists and returns an object containg artist_id and artist_name
 * @param {Array} artists
 */
exports.getArtistIdFromArray = (artists) => artists.length ? {
    artist_id: artists[0]?.id,
    artist_name: artists[0]?.name,
} : {}

/**
 * Extract titles from artist's work array
 * @param {Array} works 
 */
exports.getWorkTitles = (artist_name, works) => works.length ? works.map(work => work?.title 
    && { artist_name, title: work.title }) : [];

/**
 * Filters out any songs which do not contain lyrics and do not have success status or lyric count only 1 (instrumental song)
 * @param {Array} lyrics 
 */
exports.getRetrievedLyrics = (lyrics) => lyrics.filter(item => item.status === 'fulfilled' 
    && item.value.lyrics && item.value.lyrics.split(' ').length > 1);

/**
 * Parses the lyrics and removes \n \r \t
 * @param {String} lyrics 
 */
const parseLyrics = (lyrics) => {
    const stringified = JSON.stringify(lyrics);
    const parsed = stringified.replace(/\\n|\\r|\\t/g, ' ');
    return parsed;
};
 
exports.getAverageForAllSongs = allLyrics => {
    if (!allLyrics.length){
        return {
            average: 0.00,
            counts: []
        };
    };

    const lyricsCounts =  allLyrics.map(item => {
        const { value: { lyrics } } = item;
        const parsed = parseLyrics(lyrics);
        const lyricsArray = parsed.split(' ').filter(element => element !== '');
        return lyricsArray.length;
    });
 
    // sum all counts
    const sum = lyricsCounts.reduce((acc, curr) => {
        return acc + curr
    }, 0);

    // get average
    return {
        average: parseFloat((sum / lyricsCounts.length).toFixed(2)),
        counts: lyricsCounts
    };
};

/**
 * Calculate the variance
 * @param {Array} lyricsCounts 
 * @param {Float} average 
 */
exports.calculateVariance = (lyricsCounts, average) => {
    const sqrdDiff = lyricsCounts.map(item => Math.pow(item - average, 2));
    const sumSqrdDiff = sqrdDiff.reduce((curr, acc) => {
        return curr + acc;
    }, 0);

    return parseFloat((sumSqrdDiff / lyricsCounts.length).toFixed(2));
};

/**
 * Calculates the standard deviation
 * @param {Float} variance 
 */
exports.calculateStandardDeviation = (variance) => parseFloat(Math.sqrt(variance).toFixed(2));

/**
 * Returns object showing min and max counts and song title
 * @param {Array} allLyrics 
 */
exports.calculateMinMax = (allLyrics ) => {
    const lyricsCounts =  allLyrics.map(item => {
        const { value: { lyrics, title } } = item;
        const parsed = parseLyrics(lyrics);
        const lyricsArray = parsed.split(' ').filter(element => element !== '');
        return {
            count: lyricsArray.length,
            title
        };
    });

    const sorted = lyricsCounts.sort((a, b) => a.count - b.count);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return {
        min: {
            title: min.title,
            count: min.count
        },
        max: {
            title: max.title,
            count: max.count
        }
    };
};
