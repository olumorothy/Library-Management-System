const { Kafka } = require("kafkajs");
const logger = require("../../logs/logger");

let topic;

const kafka = new Kafka({
  clientId: "lms",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const produce = async (message, newTopic) => {
  const serializedMessage = JSON.stringify(message);
  if (newTopic === "email") {
    topic = "email";
  }
  if (newTopic === "otp") {
    topic = "otp";
  }
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
    logger.error("Error producing message :", producerError);
  }
};

module.exports = { produce };
