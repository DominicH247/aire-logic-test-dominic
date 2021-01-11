// models
const { fetchArtistLyricsAverage, fetchArtistId } = require('../models/artistModel');

const redisClient = require('../redis/redisClient');

const getCachedData = artist_name => new Promise((resolve, reject) => {
    redisClient.get(artist_name, (err, data) => {
        if (err) {
            reject(err)
        }
        // if chache hit resolve with stored data else resolve with a false flag
        if(data !== null){
            resolve(data)
        } else {
            resolve(false)
        }
    })
});

exports.getArtistLyricsAverage = (req, res, next) => {
    const { artist_name } = req.params;
    let artistId;
    let artistName; 

    return fetchArtistId(artist_name)
        .then(({ artist_name, artist_id }) => {
            artistId = artist_id;
            artistName = artist_name;

           return getCachedData(artist_name);
        })
        .then((data) => {
            if(data){
                res.status(200).send({ data: JSON.parse(data) })
            } else {
                return fetchArtistLyricsAverage(artistName, artistId)
            }
        })
        .then((data) => {
            if(data){
                res.status(200).send({ data });
            } else {
                return
            }
        })
        .catch(err => next(err))
};
