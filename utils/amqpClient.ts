import amqp from "amqplib";

const connectionString =
  process.env.QUEUE_CONNECTION_STRING || "amqp://localhost";

export const sendToQueue = async (message: number): Promise<void> => {
  const queueName = process.env.QUEUE_NAME || "processing-dev";
  const connection = await amqp.connect(connectionString);
  try {
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message.toString()), {
      persistent: true,
    });
    await channel.close();
  } finally {
    await connection.close();
  }
};
