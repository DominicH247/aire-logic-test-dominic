const redis = require('redis');

const { REDIS_URL } = process.env
const reddisClient = redis.createClient(REDIS_URL);

module.exports = reddisClient;
