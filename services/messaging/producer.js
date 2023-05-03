const { Kafka } = require("kafkajs");
const logger = require("../../logs/logger");

const topic = "email";

const kafka = new Kafka({
  clientId: "lms",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const produce = async (message) => {
  const serializedMessage = JSON.stringify(message);
  try {
    await producer.connect();
  } catch (connectionError) {
    logger.error("Error connecting to kafka :", connectionError);
  }

  try {
    await producer.send({
      topic,
      messages: [{ value: serializedMessage }],
    });
  } catch (producerError) {
    console.error("Error producing message :", producerError);
  }
};

module.exports = { produce };
