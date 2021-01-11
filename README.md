# Fing Average Lyrics API - Dominic Hui

For this tech test I have built a REST API with a single GET endpoint which consumes the MusicBrainz API, to retrieve a list of tracks for the artist, and the Lyrics.ovh API to retrieve the lyrics for each of the songs. It then proceses the lyrics and returns the average lyrics and additional statistical data.

Example:
-  using Curl or an API client (insomina, postman etc.)
-  GET - `http:localhost:3000/api/artist/:artist_name`
-  example JSON resonse:
    ```
    { "data" : {
        "artist_name": "Plan B",
        "songs_counted": 16,
        "average_lyrics": 501.19,
        "variance": 50322.4,
        "standard_deviation": 224.33,
         min: { 
                title: 'some song title',
                count: 111
            },
            max: {
                title: 'another song title',
                count: 999
            }
        }
     } 
    ```
- example 404 error for no matching artist - GET `http:localhost:3000/api/artist/khsrtzzz1ea`
    ```
    {
        "message": "Artist not found"
    }
    ```
### Caveats
- The Lyrics.ovh API has an issue by which on occasion it will return empty strings for the given song with status 200, and making multiple request for an artist/song can also result in no lyrics being returned (open issue on GitHub https://github.com/NTag/lyrics.ovh/issues/10), thus to perform a lyrics search for all songs for a given artist is atleast  a 2 min wait between requests. Retrieval time is also very slow, for 25 songs can take up to 10 seconds. 
- To try to get around above issues, I have limited the number of songs for each artists to 25 (anymore risks timeout of the request, and hitting request limits for the MusicBrainz API).
- For songs where the Lyrcs.ovh API does not return the lyrics, the song is discarded.
- The `average_lyrics` result for the artist is cached with a TTL of 1 hour. The initial request will be slow but subsequent request for the same artist will be considerably faster.

## Environment
- Node v-14 - runtime
- express.js - API framework
- jest - unit testing
- supertest - HTTP assertion library
- redis - cache
- nodemon - hot reloading for development
- axios - HTTP client
- docker - containerisation

## Prequsits 
To run the project please ensure you have the following installed:
- Docker - https://docs.docker.com/get-docker/
- Docker-compose - https://docs.docker.com/compose/install/

## Running the project
- cd into the root directory of the project
- run `docker-compose up --build` to build and launch the node application container and redis container
- to run the unit tests in the node application container run `docker exec -it <container id> npm run test`
- to stop and remove the containers run `docker-compose down`
