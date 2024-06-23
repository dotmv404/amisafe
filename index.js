const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { wrapper } = require("axios-cookiejar-support");
const tough = require("tough-cookie");
const cheerio = require("cheerio");
const https = require("https");
const token = "7476929951:AAEPRiN54f2EiDxL66nGLmCICzBcwU5d8WQ";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  let message = msg["text"];
  console.log(msg.chat.username)

  let text = message.split(" ");
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //email sender
  if (message.startsWith("email")) {
    // console.log(text[1]);
    if (isValidEmail(text[1])) {
      bot.sendMessage(chatId, "Started Looking for Any Data Breaches !! DM @dotsenpai to remove ***** from sensetive info");

      (async () => {
        const username = msg.chat.username;
        try {
          const userExists = await checkUserExists(username);
          console.log(userExists)
          if (userExists) {
            let email = await fetchemail(text[1]);
            let messageToSend = "";
            email.forEach((entry) => {
              messageToSend += `# ${entry.category}\n`;
              Object.keys(entry.details).forEach((key) => {
                messageToSend += `- ${key}: ${entry.details[key]}\n`;
              });
              messageToSend += "\n"; // Empty line for separation
            });
            bot.sendMessage(chatId, messageToSend);
            if(messageToSend === "") return bot.sendMessage(chatId, " 0 - results man :(")
  
          } else {
           

            let hack = await fetchemail(text[1]);
            let anonymizedData = anodata(hack);
            let messageToSend = "";
            anonymizedData.forEach((entry) => {
              messageToSend += `# ${entry.category}\n`;
              Object.keys(entry.details).forEach((key) => {
                messageToSend += `- ${key}: ${entry.details[key]}\n`;
              });
              messageToSend += "\n"; // Empty line for separation
            });
            bot.sendMessage(chatId, messageToSend);
            if(messageToSend === "") return bot.sendMessage(chatId, " 0 - results man :(")
          }
         

        } catch (error) {

        }
      })();
    } else {
      bot.sendMessage(chatId, "Invalid Email Bro !");
    }
  }

  async function fetchemail(email) {
    const urls = [
      `https://leakpeek.com/inc/iap16?id=107035&query=${encodeURIComponent(
        email
      )}&t=1718995494&input=${encodeURIComponent(email)}`,
      `https://leakpeek.com/inc/iap15?id=107035&page=1&t=1718995494&input=${encodeURIComponent(
        email
      )}`,
      `https://leakpeek.com/inc/iap6?id=107035&t=1718995494&input=${encodeURIComponent(
        email
      )}`,
    ];

    const cookieJar = new tough.CookieJar();

    // Manually add cookies to the jar
   cookieJar.setCookieSync('PHPSESSID=plg6joum82dq8fnhcafqa7su21', 'https://leakpeek.com');
  cookieJar.setCookieSync('TawkConnectionTime=0', 'https://leakpeek.com');
  cookieJar.setCookieSync('twk_uuid_5e0a72c07e39ea1242a266c8=%7B%22uuid%22%3A%221.SwtWabLbJssfjDzW2FMtalvwNzZReGCP883yO0SegJ1dcHabAO1h1J2Q2nU1WkpHIpwLJLCfFBAyXADghxfn81Rmimod6i4FA3q20qGhB2by3elVBabs6%22%2C%22version%22%3A3%2C%22domain%22%3A%22leakpeek.com%22%2C%22ts%22%3A1719008972333%7D', 'https://leakpeek.com');


    const client = wrapper(
      axios.create({
        jar: cookieJar,
        withCredentials: true,
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          Referer: "https://leakpeek.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      })
    );

    try {
      const responses = await Promise.all(urls.map((url) => client.get(url)));
      const combinedResults = [];
      responses.forEach((response) => {
        // console.log(response.data)
        if (response.data && typeof response.data.output === "string") {
          const $ = cheerio.load(response.data.output);

          $(".results").each((i, elem) => {
            const result = {};
            result.category = $(elem)
              .find("span.font-weight-bold > span")
              .text();

            const details = {};
            $(elem)
              .find(".resultcontainer")
              .each((i, detailElem) => {
                const key = $(detailElem)
                  .find("span:first-child")
                  .text()
                  .trim();
                const value = $(detailElem)
                  .find("span:last-child")
                  .text()
                  .trim();
                details[key] = value;
              });

            result.details = details;
            combinedResults.push(result);
          });
        } else {
          // console.warn(
          //   "Response data or output is missing or not a string:",
          //   response
          // );
        }
      });

      return combinedResults;
    } catch (error) {
      // console.error("Error fetching data:", error);
      throw error;
    }
  }

  function anodata(data) {
    return data.map((entry) => {
      if (entry.details) {
        let anonymizedDetails = { ...entry.details };
  
        // Anonymize password field
        if (anonymizedDetails.password) {
          anonymizedDetails.password =
            anonymizedDetails.password.substring(0, 3) +
            "*".repeat(anonymizedDetails.password.length - 3);
        }
  
        // Anonymize hash field
        if (anonymizedDetails.hash) {
          anonymizedDetails.hash =
            anonymizedDetails.hash.substring(0, 3) +
            "*".repeat(anonymizedDetails.hash.length - 3);
        }
  
        // Anonymize salt field
        if (anonymizedDetails.salt) {
          anonymizedDetails.salt =
            anonymizedDetails.salt.substring(0, 3) +
            "*".repeat(anonymizedDetails.salt.length - 3);
        }
  
        // Anonymize IP address field
        if (anonymizedDetails["ip address"]) {
          anonymizedDetails["ip address"] = anonymizedDetails["ip address"].replace(/\.\d+$/, ".*");
        }
  
        // Anonymize name field
        if (anonymizedDetails.name) {
          anonymizedDetails.name = "*******";
        }
  
        // Anonymize birthdate field (assuming it's a string)
        if (anonymizedDetails.birthdate) {
          anonymizedDetails.birthdate = "01/01/****"; // Example anonymization
        }
  
        // Anonymize regip field
        if (anonymizedDetails.regip) {
          anonymizedDetails.regip = anonymizedDetails.regip.replace(/\.\d+$/, ".*");
        }
  
        // Anonymize username field
        if (anonymizedDetails.username) {
          anonymizedDetails.username = "*****"; // Example anonymization
          "*".repeat(anonymizedDetails.username.length - 3);
        }
  
        return { ...entry, details: anonymizedDetails };
      }
      return entry; // Return unchanged if no details object found
    });
  }
  
});
function checkIfNumber(value) {
  if (typeof value === "number") {
    return true;
  } else {
    return false;
  }
}





function sendmessage(message) {
 
}


async function checkUserExists(usernameToCheck) {
  try {
    const response = await axios.get('https://api.npoint.io/2d9da93c1e1861e3546e', {
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    const userData = response.data;
    console.log('Fetched user data:', userData); // Log fetched data for debugging
    // Check if usernameToCheck exists in the data
    const userExists = userData.data.includes(usernameToCheck);
    console.log(`User '${usernameToCheck}' exists:`, userExists); // Log result for debugging
    
    return userExists;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return false; // Return false in case of error
  }
}









const express = require("express");
const app = express();
const port = 3000; // Choose any port you prefer

// Define a route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

