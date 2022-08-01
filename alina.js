// 28.07.2022  11:48
// Tabashi
// File: alina.js
// Version: 0.1
const express = require('express');
const app = express();
const port = 3000;
const { VK, Context } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const wiki = require('wikipedia');
const { content } = require('wikipedia');
//var pageviews = require('pageviews');


app.get('/', function(request, response) { response.send(`Монитор активен. Локальный адрес: http://localhost:${port}`); });
app.listen(port, () => console.log());

const vk = new VK({
  token: process.env['VK_TOKEN']
})
const bot = new HearManager();

// Функция с работой вики
const f = (async () => {
  try {
    vk.updates.on('message_new', async (context) => {
      const changedLang = await wiki.setLang('ru');
      const page = await wiki.page(`${context.text}`);
      const summary = await page.summary();
      //console.log(summary.extract);
      //console.log(summary.content_urls.desktop.page);
      await context.send(summary.extract);
      await context.send(`Вот ссылка: ${summary.content_urls.desktop.page}`);
      if (context.senderId !== 593658628) {
        console.log(`Мне опять написал этот бака id${context.senderId}: ${context.text}`);
    }
  });
} catch (error) {
  console.log(error);
  //=> Typeof wikiError
}
})

vk.updates.on('message_new', bot.middleware);
// ${msg.senderId}
bot.hear(/привет/i, msg => {
  msg.send('Здравствуйте, я пока мало что умею, только вывести это сообшение и работать с википедией, надеюсь мой хозяин будет меня обновлять...');
  msg.send('Я смотрела аниме "Сонни Бой", советую и вам посмотреть ^_^');
});

let numRandom = 0;

/*
bot.hear(/угадай число/i, msg => {
  numRandom = Math.floor(Math.random * 99) + 1;
  msg.send('Я загадаю число от 1 до 100 включительно, а вы попробуете отгадать ^_^');
  msg.send('Введите число.');

  if (numRandom > parseInt(context)) {
    msg.send("Больше...");
  }
  else if (numRandom < parseInt(context)) {
    msg.send("Меньше...");
  }
  })
*/

f();

console.log('Бот запущен!');
vk.updates.start().catch(console.error);