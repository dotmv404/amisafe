const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios');
const https = require('https'); // Importing https module for httpsAgent
const token = "7476929951:AAEh29SvuoqQZuQn4c4PPpChxepOLta64j0";
const cheerio = require('cheerio');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
let message = msg['text']
// if (message[0].length < 5) return
function isValidEmail(email) {
  // Regular expression for basic validation of email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

if (isValidEmail(message)) {
bot.sendMessage(chatId, "Started Looking for Any Data Breaches !!");
function resultsToText(results) {
  results.forEach((result, index) => {
    let text = '';

    text += `Result ${index + 1}:\n`;
    text += `Breach: ${result.title}\n`;
    text += `Maintained by @dotsenpai \n`;
    for (const key in result) {
      if (key !== 'title') {
        text += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${result[key]}\n`;
      }
    }

    text += '\n'; // Add a blank line between each result for readability
    bot.sendMessage(chatId, text);

    // Replace this with your method of sending or displaying the message

  });
}


async function fetchLeakPeekData(email) {
  const config = {
    method: 'get',
    url: `https://leakpeek.com/inc/iap6?id=107035&t=1718960734&input=${email}`,
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'priority': 'u=1, i',
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-requested-with': 'XMLHttpRequest',
      'cookie': 'PHPSESSID=plg6joum82dq8fnhcafqa7su21; TawkConnectionTime=0; twk_uuid_5e0a72c07e39ea1242a266c8=%7B%22uuid%22%3A%221.SwtVRrmF45xXj6jXoyMRadWMom06eQOOokPUzfLKK4RL05sosbUkZEG8PPnF7rdQi3ZMfae4VOgAbnQ0mfL22EtTi2MFoEsUntGXy1ImC8CYmBrCRPd4E%22%2C%22version%22%3A3%2C%22domain%22%3A%22leakpeek.com%22%2C%22ts%22%3A1718960728498%7D',
      'Referer': 'https://leakpeek.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  };

  try {
    const response = await axios(config);
    const output = response.data.output;
    const $ = cheerio.load(output);
    
    const results = [];

    $('.results').each((i, elem) => {
      const result = {};
      result.title = $(elem).find('span.font-weight-bold > span').text().trim();
      
      $(elem).find('.resultcontainer').each((j, item) => {
        const key = $(item).find('span').first().text().trim();
        const value = $(item).find('span').last().text().trim();
        result[key] = value;
      });
      results.push(result);
    });

    let abc = JSON.stringify(results, null, 2); // Stringify the results array
    let parsedResults = JSON.parse(abc); // Parse the JSON string back into an array of objects

    resultsToText(parsedResults); // Pass the parsed array to resultsToText

  } catch (error) {
    console.error(error);
  }
}


fetchLeakPeekData(message);
  
  
  







} else {
  bot.sendMessage(chatId, "Invalid Email Bro !");

}






























});
function checkIfNumber(value) {
    if (typeof value === 'number') {
        return true;
    } else {
        return false;
    }
}







const express = require('express');
const app = express();
const port = 3000; // Choose any port you prefer

// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
