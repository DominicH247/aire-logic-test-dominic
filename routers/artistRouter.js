const express = require('express');
artistRouter = express.Router();
const { handleInvalidMethod405 } = require('../errors/index');

//controllers
const { getArtistLyricsAverage } = require('../controllers/artistController');

artistRouter
    .route('/:artist_name')
    .get(getArtistLyricsAverage)
    .all(handleInvalidMethod405)

module.exports = artistRouter;
