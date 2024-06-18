const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios');
const https = require('https'); // Importing https module for httpsAgent
const token = "7476929951:AAHaFChZ4CuGhN7NpkNmZJz6w0rhce3dDbQ";


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
   
  async function fetchData(email) {
    try {
      const axiosConfig = {
        method: 'get',
        url: `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
        headers: {
          'Host': 'haveibeenpwned.com',
          'Accept': '*/*',
          'Hibp-Api-Key': '6f697023d0ab4a57a561ad0ebfdc8caa',
          'User-Agent': 'Wifi-Status',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        params: {
          truncateResponse: 0
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      };
      let breaches =  []
      const response = await axios(axiosConfig);
   breaches.push(response.data)
  
      // console.log(breaches);

      function breachesToText(breaches) {
        
        breaches.forEach((breach, index) => {
        let text = '';

          text += `Breach ${index + 1}:\n`;
          text += `Name: ${breach.Name}\n`;
          text += `Domain: ${breach.Domain}\n`;
          text += `Breach Date: ${breach.BreachDate}\n`;
          text += `Data: ${breach.DataClasses.join(', ')}\n\n`;
          text += `Breach Data Count : ${breach.PwnCount}\n`;
          text += `Maintained by @dotsenpai \n`;

          bot.sendMessage(chatId, text);

        });
        
      
      }
      
      const breachesText = breachesToText(response.data);
  

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Response Status:', error.response.status);
        console.log('Response Data:', error.response.data);
        
        if (error.response.status === 404) {
          bot.sendMessage(chatId, "Your Email is Safe from all the data Breaches !");

          // Handle 404 specific logic here
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    }
  }
  
  
  
  fetchData(message);







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
