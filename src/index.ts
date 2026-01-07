import "dotenv/config";
import { createBot } from "./bot.js";

const token = process.env.BOT_TOKEN;
const deepgramToken = process.env.DEEPGRAM_TOKEN;

if (!token) {
  console.error("BOT_TOKEN env variable is required to run the bot.");
  process.exit(1);
}

if (!deepgramToken) {
  console.error("DEEPGRAM_TOKEN env variable is required.");
  process.exit(1);
}

const { bot, logger } = createBot(token, deepgramToken);

await bot.start({
  onStart: () => logger.info("Bot is running..."),
});