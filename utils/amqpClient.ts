import amqp from "amqplib/callback_api";

// Only use server-side environment variable (never NEXT_PUBLIC_)
const connectionString =
  process.env.QUEUE_CONNECTION_STRING || "amqp://localhost";

export const sendToQueue = (message: number): Promise<void> => {
  const queueName = process.env.QUEUE_NAME || "processing-dev";
  return new Promise((resolve, reject) => {
    amqp.connect(connectionString, (err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.createChannel((err, channel) => {
        if (err) {
          reject(err);
          return;
        }

        channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(message.toString()), {
          persistent: true,
        });
        setTimeout(() => {
          connection.close();
          resolve();
        }, 500);
      });
    });
  });
};
