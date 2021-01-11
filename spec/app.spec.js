const app = require('../app');
const request = require('supertest');
const redisClient = require('../redis/redisClient');

// redis client to quit after running all tests 
afterAll(() => { 
    redisClient.quit();
});

describe('/api', () => {
    describe('/artist', () => {
        describe('/:artist_name', () => {
            describe('GET', () => {
                it('status 200, with payload containing artist name and average lyrics', () => {
                    // Lyrics.ovh api sometimes returns no lyrics, using mock endpoint instead for testing
                    return request(app)
                         .get('/api/mock-endpoint/Plan B')
                         .expect(200)
                         .then(({ body }) => {
                             expect(body).toEqual({
                                 data: {
                                     artist_name: 'Plan B',
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
                         })
                })
                it('status 404, artist not found', () => {
                    return request(app)
                        .get('/api/artist/zze5456465e35')
                        .expect(404)
                        .then(({ body: { message }}) => {
                            expect(message).toEqual('Artist not found')
                        })
                })
                it('status 405, method not allowed', () => {
                    return request(app)
                        .post('/api/artist/U2')
                        .send({})
                        .expect(405)
                        .then(({ body: { message }}) => {
                            expect(message).toEqual('Method not allowed')
                        })
                })
            })
        })
    })
});
