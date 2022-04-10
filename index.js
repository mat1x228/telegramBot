const { Telegraf, Markup } = require('telegraf')
require('dotenv').config();
const text = require('./const')
const axios = require ('axios');
const apiKey = "5000514e4f2bddea5301feed574872c7";
//let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&units=metric&appid=${apiKey}`;


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Hi,${ctx.message.from.first_name ? ctx.message.from.first_name : 'uknown user'}! Send /nav to navigation`))

bot.command('nav', async (ctx)=>{
   await ctx.replyWithHTML('<b>Chose some action</b>', Markup.inlineKeyboard(
    [
      [Markup.button.callback('Weather🌦', 'btn_1')],
      [Markup.button.callback('Converter💰', 'btn_1')]
    ]
  ))
    
 

})
bot.action('btn_1', async (ctx)=>{

     ctx.reply('To get the weather forecast type: \n /weather city_name')
  
})

bot.command('weather', async(ctx)=>{
   const text = ctx.message.text;
    const cityName  = text.split(' ');
    cityName.shift();
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=ru&units=metric&appid=${apiKey}`).then(res => {
     // if(res.response.status<400){
        const name = res.data.name;
  const temp = res.data.main.temp;
  const humindity = res.data.main.humidity;
  const speed = res.data.wind.speed;
  
  
  
  return  ctx.reply("Погода в городе "+ name+": "+temp+'\nВлажность: '+humindity + '\nСкорость ветра: '+speed+'км/ч');
      // }else {
      //   return ctx.reply("Такого города не сущесвует");
      // }
  
  }).catch((error) => console.error('NOT FOUND', error));
 
 
})
bot.help((ctx) => ctx.reply(text.commands))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))