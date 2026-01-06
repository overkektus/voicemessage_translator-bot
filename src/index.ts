import { Bot } from "grammy";
import "dotenv/config";

const token = process.env.BOT_TOKEN;

console.log(process.env.BOT_TOKEN);

if (!token) {
  console.error("BOT_TOKEN env variable is required to run the bot.");
  process.exit(1);
}

const bot = new Bot(token);

bot.command("start", async (ctx) => {
  await ctx.reply("Привет! Пришли мне сообщение, и я повторю его обратно!");
});

bot.on("message:text", async (ctx) => {
  const { text } = ctx.message;
  await ctx.reply(`Ты написал: ${text}`);
});

bot.catch((err) => {
  console.error("Bot error", err);
});

await bot.start();

console.log("Bot is running...");
