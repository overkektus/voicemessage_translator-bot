import { Bot } from "grammy";
import { DeepgramService, LoggerService } from "./services/index.js";
import { createVoiceFeature, startFeature } from "./features/index.js";

export function createBot(token: string, deepgramToken: string) {
  const bot = new Bot(token);
  const logger = new LoggerService();
  const deepgram = new DeepgramService(deepgramToken);

  bot.use(startFeature);
  bot.use(createVoiceFeature({ deepgram, logger, botToken: token }));

  bot.catch((err) => {
    logger.error("Bot error", err);
  });

  return { bot, logger };
}