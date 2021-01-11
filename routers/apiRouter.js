const express = require('express');
const apiRouter = express.Router();
const artistRouter = require('./artistRouter');

// routes
apiRouter.use('/artist', artistRouter);

// mock route
apiRouter.use('/mock-endpoint/:artist_name', (req, res) => {
    const { artist_name } = req.params;
    res.status(200).send({
        data: {
            artist_name: artist_name,
            average_lyrics: 123.00,
            songs_counted: 99,
            variance: 99.00,
            standard_deviation: 99.00,
            min: { 
                title: 'some title',
                count: 111
            },
            max: {
                title: 'another title',
                count: 999
            }
        }
    })
});

module.exports = apiRouter;
