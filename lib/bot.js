const fs = require('fs');
if (fs.existsSync('bot.env')) require('dotenv').config({ path: './bot.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
BOT_URL: process.env.BOT_URL || "https://dew-md-data.pages.dev/DATA-BASE/Data-File.json",
AUTO_SITE: process.env.AUTO_SITE || "https://dew-md.up.railway.app",
BAND_URL: process.env.BAND_URL || "https://dew-md-data.pages.dev/DATA-BASE/BandUser.json",
REPO_LINK: process.env.REPO_LINK || "https://github.com/KING-HANSA/DEW-MD-BETA-TEST",
REPO_NAME: process.env.REPO_NAME || "DEW-MD",
BOT_NAME: process.env.BOT_NAME || "QUEEN SP-BOT",
DESCRIPTION: process.env.DESCRIPTION || "SRI LANKAN AI BOT",
OWNER_NUMBER: process.env.OWNER_NUMBER || "94776290170",
OWNER_NAME: process.env.OWNER_NAME || "PuBudu_x",
ST_SAVE: process.env.ST_SAVE || "SP-BOT-STATUS-SERVER",
BIO_TEXT: process.env.BIO_TEXT || "QUEEN SP-BOT-BY-ACTIVE-PUBUDU",
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*`ඒහ් ලමයෝ ඔයගේ STATUS එක මම තමයි මුලින්ම බැලුවේ හරිද💗👻`* _*POWERD BY*_ *QUEEN-SP Whtsapp Bot*",
FOOTER: process.env.FOOTER || "DEW-MD",
COPYRIGHT: process.env.COPYRIGHT || "㋛ SP-MD BY KE4N",
VERSION: process.env.VERSION || "2.0.0",
NEWSLETTER: process.env.NEWSLETTER || "120363401479142227@g.us",
WA_CHANNEL: process.env.WA_CHANNEL || "https://whatsapp.com/channel/0029Vb2bFCq0LKZGEl4xEe2G",
INSTA: process.env.INSTA || "https://Instagram.com/hansa_dewmina_lk",
ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
OWNER_IMG: process.env.OWNER_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
CONVERT_IMG: process.env.CONVERT_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
AI_IMG: process.env.AI_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
SEARCH_IMG: process.env.SEARCH_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
DOWNLOAD_IMG: process.env.DOWNLOAD_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
MAIN_IMG: process.env.MAIN_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
GROUP_IMG: process.env.GROUP_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
FUN_IMG: process.env.FUN_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
TOOLS_IMG: process.env.TOOLS_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
OTHER_IMG: process.env.OTHER_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
MOVIE_IMG: process.env.MOVIE_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
NEWS_IMG: process.env.NEWS_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png",
PP_IMG: process.env.PP_IMG || "https://i.ibb.co/Jwry6gGh/DEW-MD.png"
};
