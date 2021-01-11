const { 
    getArtistIdFromArray,
    getWorkTitles,
    getRetrievedLyrics,
    getAverageForAllSongs,
    calculateVariance,
    calculateStandardDeviation,
    calculateMinMax } = require('../uitls/index');

describe('getArtistIdFromArray()', () => {
    it('returns an object containing artist_id and artist_name property', () => {
        const mockPayload = [{
            id: '12345',
            name: 'Some Name',
            data: 'some other meta data'
        }]

        expect(getArtistIdFromArray(mockPayload)).toEqual({
            artist_id: '12345',
            artist_name: 'Some Name'
        });
    })

    it('returns an empty object if passed an empty array', () => {
        expect(getArtistIdFromArray([])).toEqual({}); 
    })
    it('Does not mutate original array', () => {
        const mockPayload = [{
            id: '12345',
            name: 'Some Name',
            data: 'some other meta data'
        }]

        getArtistIdFromArray(mockPayload);

        expect(mockPayload).toEqual([{
            id: '12345',
            name: 'Some Name',
            data: 'some other meta data'
        }])
    })
});

describe('getWorkTitles()', () => {
    it('returns array of objects containing song title and artist name', () => {
        const mockData = [
            { title: 'title 1', otherdata: 'other data' },
            { title: 'title 2', otherdata: 'other data' },
            { title: 'title 3', otherdata: 'other data' }
        ];

        expect(getWorkTitles('the stone roses', mockData)).toEqual([
            { title: 'title 1', artist_name: 'the stone roses' },
            { title: 'title 2', artist_name: 'the stone roses' },
            { title: 'title 3', artist_name: 'the stone roses' }
        ])
    });
    it('returns an empty object if no items in the array', () => {
        expect(getWorkTitles('the stone roses', [])).toEqual([]);
    })
    it('does not mutate original array', () => {
        const mockData = [
            { title: 'title 1', otherdata: 'other data' },
            { title: '', otherdata: 'other data' },
            { noTitle: 'something', otherdata: 'other data' },
            { title: 'title 3', otherdata: 'other data' }
        ];

        getWorkTitles('the stone roses', mockData)

        expect(mockData).toEqual([
            { title: 'title 1', otherdata: 'other data' },
            { title: '', otherdata: 'other data' },
            { noTitle: 'something', otherdata: 'other data' },
            { title: 'title 3', otherdata: 'other data' }            
        ]);
    })
});

describe('getRetrievedLyrics()', () => {
    it('filters out songs from the array where status is not fullfilled', () => {
        const mockData = [
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } },
            { status: 'failed', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } },
        ];

        expect(getRetrievedLyrics(mockData)).toEqual([
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } }
        ]);
    })
    it('filters out songs from the array where lyrics are blank', () => {
        const mockData = [
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: '' } },
        ];

        expect(getRetrievedLyrics(mockData)).toEqual([
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } }
        ]);
    });
    it('filters out any songs where only one lyric (instrumental version of song)', () => {
        const mockData = [
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: '(insturmental)' } },
        ];
        expect(getRetrievedLyrics(mockData)).toEqual([
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } }
        ]);
    })
    it('if array is empty it returns an empty array', () => {
        expect(getRetrievedLyrics([])).toEqual([]);
    });
    it('does not mutate original array', () => {
        const mockData = [
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: '' } },
        ];

        getRetrievedLyrics(mockData);

        expect(mockData).toEqual([
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: '' } },
        ])
    });
});

describe('getAverageForAllSongs', () => {
    it('returns object containg average lyrics for all songs in the array and the counts', () => {
        const mockData = [
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'hello this is some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'hello this is some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'hello this is some lyrics' } },
            { status: 'fulfilled', value: { artist_name: 'pink floyd', lyrics: 'hello this is some lyrics' } },
        ];

        expect(getAverageForAllSongs(mockData)).toEqual({
            average: 5.00,
            counts: [5, 5, 5, 5]
        });
    });
    it('if lyrics is [] return default object', () => {
        expect(getAverageForAllSongs([])).toEqual({
            average: 0.00,
            counts: []
        });
    })
});

describe('calculateVariance()', () => {
    it('returns the variance to 2dp when passed the counts array and the average', () => {
        const mockData1 = [1, 2, 2, 5, 6 ,7];
        const mockData2 = [111, 222, 353, 265, 234, 187];
        const mockData3 = [9, 2, 4, 10, 20 , 1, 3] 
        expect(calculateVariance(mockData1, 3.83)).toEqual(5.14);
        expect(calculateVariance(mockData2, 228.66)).toEqual(5405.56);
        expect(calculateVariance(mockData3, 7.00)).toEqual(38.29);
    });
});

describe('calculateStandardDeviation()', () => {
    it('returns a standard deviation when passed the variance', () => {
        expect(calculateStandardDeviation(5.14)).toEqual(2.27);
        expect(calculateStandardDeviation(5405.56)).toEqual(73.52);
        expect(calculateStandardDeviation(38.29)).toEqual(6.19);
    })
});

describe('calculateMinMax()', () => {
    it('returns an object displaying the min and max counts and the title of the song', () => {
        const mockData = [
            {value: {title: 'title 1', lyrics: 'this is some song'}},
            {value: {title: 'title 2', lyrics: 'this is some is an even longer song'}},
            {value:{title: 'title 3', lyrics: 'this is some is an even even even longer song'}},
            {value:{title: 'title 4', lyrics: 'this is a short'}},
            {value:{title: 'title 5', lyrics: 'very short'}},
        ]

        expect(calculateMinMax(mockData)).toEqual({
            min: {
                title: 'title 5',
                count: 2
            },
            max: {
                title: 'title 3',
                count: 10
            }
        })
    })
});
