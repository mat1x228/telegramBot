const { Telegraf, Markup } = require('telegraf')
require('dotenv').config();
const text = require('./const')
const axios = require ('axios');
const apiKey = "5000514e4f2bddea5301feed574872c7";


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет,${ctx.message.from.first_name ? ctx.message.from.first_name : 'unknown user'}! Отправь /nav для навигации по боту`))

bot.command('nav', async (ctx)=>{
   await ctx.replyWithHTML('<b>Выберите действие:</b>', Markup.inlineKeyboard(
    [
      [Markup.button.callback('Weather🌦', 'btn_1')],
      [Markup.button.callback('Converter💰', 'btn_2')]
    ]
  ))
})



bot.action('btn_1', async (ctx)=>{
  ctx.reply('Для получения прогноза погоды введите: \n /weather название_города')
})

bot.action('btn_2', async (ctx)=>{
  ctx.reply('Для конвертации валюты введите: \n /currency сумму из_какой валюты в_какую')
})


bot.command('weather', async(ctx)=>{
  const text = ctx.message.text;
    const cityName = text.split(' ');
    cityName.shift();
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName.join(' ')}&lang=ru&units=metric&appid=${apiKey}`).then(res => {
        const name = res.data.name;
        const temp = res.data.main.temp;
        const humindity = res.data.main.humidity;
        const speed = res.data.wind.speed;
        return ctx.reply("Погода в городе "+ name+": "+temp+'\nВлажность: '+humindity + '\nСкорость ветра: '+speed+'км/ч');
    }).catch(() => ctx.reply("Такого города не сущесвует"));
  })


 // currency 10 USD RUB
bot.command('currency', async(ctx)=>{
  const params = ctx.message.text.split(' ');
  const amount = params[1];
  const currencyFrom = params[2];
  const currencyTo = params[3];
  axios.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${currencyFrom}_${currencyTo}&compact=ultra&apiKey=9922653ce3c095cc4f29`).then(res => {
      let newAmount = Object.values(res.data)[0] * amount;
      newAmount = newAmount.toFixed(3).toString();
      return ctx.reply(newAmount + " " +currencyTo.toUpperCase());
  }).catch(() => ctx.reply("Неправильно указаны параметры"));
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))