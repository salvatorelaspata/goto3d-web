import amqp from "amqplib/callback_api";

const connectionString =
  process.env.QUEUE_CONNECTION_STRING ||
  process.env.NEXT_PUBLIC_QUEUE_CONNECTION_STRING ||
  "amqp://localhost";

export const sendToQueue = (message: number): Promise<void> => {
  const queueName = "processing-dev";
  return new Promise((resolve, reject) => {
    amqp.connect(connectionString, (err, connection) => {
      console.log("connected");
      if (err) {
        reject(err);
        return;
      }

      connection.createChannel((err, channel) => {
        console.log("channel");
        if (err) {
          reject(err);
          return;
        }

        channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(message.toString()), {
          persistent: true,
        });
        console.log(`Sent message '${message}' to queue '${queueName}'`);
        setTimeout(() => {
          connection.close();
          resolve();
        }, 500);
      });
    });
  });
};
