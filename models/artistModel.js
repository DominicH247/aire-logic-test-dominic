const axios = require('axios');
const redisClient = require('../redis/redisClient');
const { MUSIC_BRAINZ_API, LYRICS_API, HEADERS } = require('../constants');
const { LYRICS_NOT_FOUND, LYRICS_API_ISSUE, ARTIST_NOT_FOUND } = require('../constants/customErrors');
const { 
    getArtistIdFromArray, 
    getWorkTitles,
    getRetrievedLyrics, 
    getAverageForAllSongs, 
    calculateVariance,
    calculateStandardDeviation,
    calculateMinMax } = require('../uitls/index');

exports.fetchArtistId = (artist_name) => {
    return axios
    .get(`${MUSIC_BRAINZ_API}artist?query=${artist_name}&limit=1&method=indexed`, HEADERS)
    .then(({ data: { artists } }) => {
        if(!artists.length){
            throw { status: 404, message: ARTIST_NOT_FOUND }
        }
        const artistDetails = getArtistIdFromArray(artists)
        return artistDetails;
    });
};

const fetchArtistWork = (artist_name, artist_id) => {
    const encodedURI = encodeURI(`${MUSIC_BRAINZ_API}work?artist=${artist_id}&limit=25`);
    return axios
        .get(encodedURI, HEADERS)
        .then(({ data } ) => {
            const { works } = data;
            const allTitles = getWorkTitles(artist_name, works);
            // remove any duplicates
            const duplicatesRemoved = [...new Set(allTitles)];
            return duplicatesRemoved;
        });
};

/**
 *  known issue with lyrics API sometimes returns empty lyrics if making same request within 2 mins
 *  https://github.com/NTag/lyrics.ovh/issues/10
 */
const fetchLyrics = ({ artist_name, title }) => {
    const encodedURI = encodeURI(`${LYRICS_API}${artist_name}/${title}`)
    return axios
        .get(encodedURI)
        .then(({ data: { lyrics } }) => ({
            artist_name,
            title,
            lyrics
        }))
};

exports.fetchArtistLyricsAverage = (artist_name, artist_id) => {

    return fetchArtistWork(artist_name, artist_id)
        .then((allTitles) => {
            const lyricsPromises = allTitles.map(work => fetchLyrics(work, allTitles))

            return Promise.allSettled(lyricsPromises);
        })
        .then((lyrics) => {
            const lyricsRetrieved = getRetrievedLyrics(lyrics);

            if(!lyricsRetrieved.length){
                throw {
                    status: 404,
                    message: `${LYRICS_NOT_FOUND}. ${LYRICS_API_ISSUE}.`
                };
            } else {
                const {average, counts} =  getAverageForAllSongs(lyricsRetrieved);
                const variance = calculateVariance(counts, average);
                const stdDev = calculateStandardDeviation(variance);
                const minMax = calculateMinMax(lyricsRetrieved);

                const responseObj = {
                    artist_name,
                    songs_counted: counts.length, 
                    average_lyrics: average,
                    variance,
                    standard_deviation: stdDev,
                    ...minMax
                }
                // store result in redis cache with expiry of 1 hour
                redisClient.setex(artist_name, 3600, JSON.stringify(responseObj));

                return responseObj;
            }
        });
};
