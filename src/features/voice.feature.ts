import { Composer } from "grammy";
import { DeepgramService } from "../services/deepgram.service.js";
import { LoggerService } from "../services/logger.service.js";

interface VoiceFeatureDeps {
  deepgram: DeepgramService;
  logger: LoggerService;
  botToken: string;
}

export function createVoiceFeature({ deepgram, logger, botToken }: VoiceFeatureDeps) {
  const composer = new Composer();

  composer.on("message:voice", async (ctx) => {
    try {
      logger.info("Processing voice message", { chatId: ctx.chat?.id });

      const file = await ctx.getFile();
      const audioUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
      const response = await fetch(audioUrl);
      const audioBuffer = Buffer.from(await response.arrayBuffer());

      const transcript = await deepgram.transcribeAudio(audioBuffer);

      if (transcript.length === 0) {
        await ctx.reply("Не удалось распознать речь. Попробуй ещё раз.");
        return;
      }

      await ctx.reply(`Транскрипция:\n${transcript}`);
      logger.info("Voice message processed", { chatId: ctx.chat?.id });
    } catch (error) {
      logger.error("Voice processing error", error);
      await ctx.reply("Ошибка при обработке голосового сообщения.");
    }
  });

  return composer;
}