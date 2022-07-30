// 28.07.2022  11:48
// Tabashi
// File: alina.js
// Version: 0.1
const express = require('express');
const app = express();
const port = 3000;
const { VK } = require('vk-io');
const { HearManager } = require('@vk-io/hear');

app.get('/', function(request, response) { response.send(`Монитор активен. Локальный адрес: http://localhost:${port}`); });
app.listen(port, () => console.log());

const vk = new VK({
  token: 'vk1.a.gzBvalC8C1ZC_nR6HZGPn7c8RZNQvN0EgcdxZuOVQV-kJw31_ThIsvmZiQuJlDLTcQYcQbGEmAP8TrIAVpA2FDRx-Rvpzij3mgG5HNqpueo9VE9B_uby1ptbELREipZ9yTlpJ0H8c29MC9hwZbo0japtYtOVqLMlba8-MdSfJPkbiSAyUu3q5ZsV7crOQX7D'
})
const bot = new HearManager();

vk.updates.on('message_new', bot.middleware);
// ${msg.senderId}
bot.hear(/привет/i, msg => {
  msg.send('Здравствуйте, я пока мало что умею, только вывести это сообшение, надеюсь мой хозяин будет меня обновлять...');
  msg.send('Я смотрела аниме "Сонни Бой", советую и вам посмотреть ^_^');
});

vk.updates.on('message_new', async (context) => {
  await context.send('Извините, но я пока понимаю только команду "Привет"');
  if (context.senderId !== 593658628) {
    console.log(`Мне опять написал этот бака id${context.senderId}: ${context.text}`);
  }
});

console.log('Бот запущен!');
vk.updates.start().catch(console.error);