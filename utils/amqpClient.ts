import amqp from "amqplib";

const connectionString: string = process.env.QUEUE_CONNECTION_STRING as string;

if (!connectionString) {
  throw new Error("QUEUE_CONNECTION_STRING environment variable is not set");
}

const QUEUE_NAME = process.env.QUEUE_NAME || "processing-dev";

const MAX_RETRIES: number = 3;
const RETRY_DELAY_MS: number = 1000;

let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let channel: Awaited<
  ReturnType<Awaited<ReturnType<typeof amqp.connect>>["createChannel"]>
> | null = null;

async function getChannel() {
  if (channel) return channel;

  if (!connection) {
    connection = await amqp.connect(connectionString, {
      heartbeat: 30,
      timeout: 10000,
    });
    connection.on("error", () => {
      connection = null;
      channel = null;
    });
    connection.on("close", () => {
      connection = null;
      channel = null;
    });
  }

  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.on("error", () => {
    channel = null;
  });
  channel.on("close", () => {
    channel = null;
  });

  return channel;
}

export async function sendToQueue(message: number): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ch = await getChannel();
      ch.sendToQueue(QUEUE_NAME, Buffer.from(message.toString()), {
        persistent: true,
      });
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      channel = null;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
      }
    }
  }

  throw lastError;
}

// Graceful shutdown
if (typeof process !== "undefined") {
  const cleanup = async () => {
    try {
      if (channel) await channel.close();
      if (connection) await connection.close();
    } catch {
      // Best-effort cleanup during shutdown
    }
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}
