// 28.07.2022  11:48
// Tabashi
// File: alina.js
// Version: 0.8
const express = require('express');
const app = express();
const port = 3000;
const { VK, Context } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const wiki = require('wikipedia');
const { content } = require('wikipedia');


app.get('/', function(request, response) { response.send(`Монитор активен. Локальный адрес: http://localhost:${port}`); });
app.listen(port, () => console.log());

const vk = new VK({
  token: process.env['VK_TOKEN']
})
const bot = new HearManager();

// Случайное число от 1 до 100, для игры в Угадай число
let numberRandom = Math.round(Math.random() * 99) + 1;
// Попытки пользователя
let attemptsUser = 0;

// Список игр
let gamesList = [
  'Final fight 3', 'Jurassic park', 'Pocky rocky', 'Poky Rocky 2', 'Run Saber',
  'Sunset riders', 'Joe & mac', 'Doom troopers', 'Knights of the round',
  'Legend of the mystical ninja', 'Final fight 2', 'Double Dragon 3',
  'Skeleton Krew', 'Blades of Vengeance', 'Arcus Odyssey', 'Samurai Shodown'
]

let gameRandom;


// Функция
const main = (async () => {
  try {
    vk.updates.on('message_new', async (context) => {
      // Википедия
      if (context.text.substr(0, 5) === '-wiki') {
        const changedLang = await wiki.setLang('ru');
        const page = await wiki.page(`${context.text.substr(6)}`);
        const summary = await page.summary();
        await context.send(summary.extract);
        await context.send(`Вот ссылка: ${summary.content_urls.desktop.page}`);
        if (context.senderId !== 593658628) {
          console.log(`Мне опять написал этот бака id${context.senderId}: ${context.text}`);
        }
      }

      // Игра угадай число
      if (context.text.substr(0, 3) === '-gn') {
        if (parseInt(context.text.substr(4)) > numberRandom) {
          await context.send('Меньше...');
          attemptsUser++;
        }
        else if (parseInt(context.text.substr(4)) < numberRandom) {
          await context.send('Больше...');
          attemptsUser++;
        }
        else if (parseInt(context.text.substr(4)) === numberRandom) {
          attemptsUser++;
          await context.send(`Вы угадали с ${attemptsUser} попытки. Это число ${numberRandom}.`);
          // Новное случайное число, чтоб не перезапускать бота каздый раз для нового числа
          numberRandom = Math.round(Math.random() * 99) + 1;
          // Сбросить счетчик
          attemptsUser = 0;
        }
      }

      // Рандомный выбор игры
      if (context.text.substr(0, 7) === '-games') {
        gameRandom = Math.round(Math.random() * (gamesList.length - 1));

        await context.send(`В моём списке ${gamesList.length} игр.\nИграйте в ${gamesList[gameRandom]}.`);
      }

      // Помощь
      if (context.text.substr(0, 6) === '-help') {
        await context.send('Мои команды: (-wiki, -gn, -games, привет)\n\
                           -wiki (введите одно слово и я найду это в википедии)\n\
                           -gn (игра угадай число, введите -gn и ваше число (-gn 35))\n\
                           -games (выберу вам игру)');
      }
    });
  } catch (error) {
    console.log(error);
    //=> Typeof wikiError
  }
})

vk.updates.on('message_new', bot.middleware);

bot.hear(/привет/i, msg => {
  msg.send('Здравствуйте, я пока мало что умею, только вывести это сообшение и работать с википедией, надеюсь мой хозяин будет меня обновлять...');
  msg.send('Я смотрела аниме "Сонни Бой", советую и вам посмотреть ^_^');
});

main();

console.log('Бот запущен!');
vk.updates.start().catch(console.error);