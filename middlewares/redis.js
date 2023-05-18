const { createClient } = require("redis");
const logger = require("../logs/logger");

const redisClient = createClient();

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

module.exports = redisClient;
