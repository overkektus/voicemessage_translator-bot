import { Bot } from "grammy";
import "dotenv/config";
import { DeepgramService } from "./services/deepgram.service.js"

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

const bot = new Bot(token);
const deepgram = new DeepgramService(deepgramToken);

bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Пришли мне сообщение, и я повторю его обратно!");
});

bot.on("message:text", async (ctx) => {
  const { text } = ctx.message;
  await ctx.reply(`Ты написал: ${text}`);
});

bot.on("message:voice", async (ctx) => {
  try {
    const file = await ctx.getFile();
    const audioUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const response = await fetch(audioUrl);
    const audioBuffer = Buffer.from(await response.arrayBuffer());

    const transcript = await deepgram.transcribeAudio(audioBuffer);
    await ctx.reply(`Транскрипция:\n${transcript}`);
  } catch (error) {
    console.error("Voice processing error:", error);
    await ctx.reply("Ошибка при обработке голосового сообщения.");
  }
});

bot.catch((err) => {
  console.error("Bot error", err);
});

await bot.start();

console.log("Bot is running...");
