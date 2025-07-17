const axios = require('axios');
const { cmd } = require('../lib/command');
const { fetchJson } = require('../lib/functions');
const api = require('../lib/SP-MD/api');
const bot = require('../lib/bot')
//=======================News Menu=======================================
cmd({
    pattern: "news",
    alias: ["newslist"],
    desc: "Displays the news menu",
    react: "📜",
    category: "news"
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        let desc = `*𝐐𝐔𝐄𝐄𝐍 𝐒𝐏-𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐂𝐄𝐍𝐓𝐄𝐑*

 💃🏻 *Hellow ${pushname}*

*╭─「 ɴᴇᴡꜱ ᴅᴇᴀᴛᴀɪʟꜱ 」*
> Reply the Number you want to select
*╰──────────●●►*

*1│❯❯◦ DERANA NEWS*
*2│❯❯◦ HIRU NEWS*
*3│❯❯◦ BBC NEWS*
*4│❯❯◦ LANKADEEP NEWS*
*5│❯❯◦ ITN NEWS*
*6│❯❯◦ SIYATHA NEWS*
*7│❯❯◦ NETH NEWS*
*8│❯❯◦ LANKA NEWS*
*9│❯❯◦ GOSSIPLANKA NEWS*
*10│❯❯◦ TECH NEWS*
*11│❯❯◦ WORLD NEWS*

*${bot.COPYRIGHT}*`;

const menuMessage = await conn.sendMessage(from, { 
    image: { url: bot.ALIVE_IMG }, 
    caption: desc 
}, { quoted: mek });

// Listen for the reply
conn.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message || !msg.message.extendedTextMessage) return;
    
    const selectedOption = msg.message.extendedTextMessage.text.trim();

    // Check if the reply is in response to the menu message
    if (msg.message.extendedTextMessage.contextInfo?.stanzaId === menuMessage.key.id) {

        switch (selectedOption) {
            case '1':
                reply('.derana');
                break;
            case '2':
                reply('.hiru');
                break;
            case '3':
                reply('.bbc');
                break;
            case '4':
                reply('.lankadeepa');
                break;
            case '5':
                reply('.itn');
                break;
            case '6':
                reply('.siyatha');
                break;
            case '7':
                reply('.neth');
                break;
            case '8':
                reply('.lankanews');
                break;
            case '9':
                reply('.gosiplanka');
                break;
            case '10':
                reply('.technews');
                break; 
            case '11':
                reply('.worldnews');
                break;             
                default:
        }
    }
});

} catch (e) {
console.error(e);
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
reply('⚠️ *An error occurred while processing your request.*');
}
});
//==================================Derana==============================
cmd({
  pattern: 'derana',
  alias: ["derananews","adaderana"],
  desc: 'Get the latest derana news.',
  react: '📰',
  use: '.derana',
  category: 'news',
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
let data = await fetchJson(`${api.DERANA_API}`)
    
  
let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐌𝐃 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈

♻ *Title*: ${data.result.title}

♻ *Description*: ${data.result.desc}

♻ *Url*: ${data.result.url}

♻ *Date*: ${data.result.date}

◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`

            if (data.result.image) {
                await conn.sendMessage(m.chat, {
                    image: { url: data.result.image },
                    caption: newsInfo,
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
            }

  } catch (error) {

console.error(`Error fetching news:`, error.message);
    reply(`❌ An error occurred while fetching the latest news.`);
  }
});
//==================================Hiru News===========================
cmd({
    pattern: "hirucheck",
    alias: ["hirunews","hiru","hirulk"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the Hiru API.",
    use: "",
    filename: __filename,
},
    async (conn, mek, m, {
        from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber,
        botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName,
        participants, groupAdmins, isBotAdmins, isAdmins, reply
    }) => {
        try {
            const apiUrl = `${api.HIRU_API}`
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || !data.newsURL || !data.title || !data.image || !data.text) {
                return reply('*No News Available At This Moment* ❗')
            }

            const { newsURL, title, image, text, Power } = data;

            let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐌𝐃 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈

♻ *Title*: ${title}

♻ *Description*: ${text}

♻ *Url*: www.hirunews.lk

◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`;

            if (image) {
                await conn.sendMessage(m.chat, {
                    image: { url: image },
                    caption: newsInfo,
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
            }

        } catch (error) {
            console.error(error);
            reply('*An Error Occurred While Fetching News At This Moment* ❗');
        }
    }
);
//==========================BBC News============================================
cmd({
    pattern: 'bbc',
    desc: 'Get the latest BBC news.',
    react: '📰',
    use: '.bbcnews',
    category: 'news',
    filename: __filename
  }, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.BBC_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.url}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//=======================LankaDeepa News=====================================
cmd({
    pattern: "lankadeepa",
    alias: ["lankadeepanews","lankadepa"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the LankaDeepa API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.LANKADEEPA_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.url}

♻ *Date*: ${data.result.date}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//======================================ITN News=================================
cmd({
    pattern: "itn",
    alias: ["itnnews","itnlk"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the ITN API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.ITN_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐑 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.link}

♻ *Date*: ${data.result.date}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//========================Siyatha News===================================
cmd({
    pattern: "siyatha",
    alias: ["siyathanews","siyathalk"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the ITN API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.SIYATHA_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.link}

♻ *Date*: ${data.result.date}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//==========================Neth News======================================
cmd({
    pattern: "neth",
    alias: ["nethnews","nethlk"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the NETH API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.NETH_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.link}

♻ *Date*: ${data.result.date}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//==========================Lnw News=================================
cmd({
    pattern: "lnw",
    alias: ["lanwnews","lankanews"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the NETH API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.LANKANEWS_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.link}

♻ *Date*: ${data.result.date}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//=============Gosip Lanka News==========================================
cmd({
    pattern: "gossiplankanews",
    alias: ["gossiplanka","gosiplanka"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the NETH API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.GOSSIPLANKA_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.desc}
  
♻ *Url*: ${data.result.link}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//==========================Tech News=========================================
cmd({
    pattern: "technews",
    alias: ["tecknews","newstech"],
    react: "⭐",
    category: "news",
    desc: "Fetch the latest news from the TECH NEWS API.",
    use: "",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
  let data = await fetchJson(`${api.TECH_API}`)
      
    
  let newsInfo = `◈=======================◈
𝐐𝐔𝐄𝐄𝐍 𝐒𝐏 𝐁𝐎𝐓 𝐍𝐄𝐖𝐒 𝐔𝐏𝐀𝐃𝐀𝐓𝐄
◈=======================◈
  
♻ *Title*: ${data.result.title}
  
♻ *Description*: ${data.result.description}
  
♻ *Url*: ${data.result.link}
  
◈=======================◈
*${bot.COPYRIGHT}*
◈=======================◈`
  
              if (data.result.image) {
                  await conn.sendMessage(m.chat, {
                      image: { url: data.result.image },
                      caption: newsInfo,
                  }, { quoted: m });
              } else {
                  await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
              }
  
    } catch (error) {
  
  console.error(`Error fetching news:`, error.message);
      reply(`❌ An error occurred while fetching the latest news.`);
    }
  });
//==========================World News=======================================
cmd({
    pattern: "worldnews",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const apiKey="0f2c43ab11324578a7b1709651736382";
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles;

        if (!articles.length) return reply("No news articles found.");

        // Send each article as a separate message with image and title
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            let message = `
📰 *${article.title}*
⚠️ _${article.description}_
🔗 _${article.url}_

*${bot.COPYRIGHT}*`;

console.log(`♻ News Command Used : ${from}`);
            
            if (article.urlToImage) {
                // Send image with caption
                await conn.sendMessage(from, { image: { url: article.urlToImage }, caption: message });
            } else {
                // Send text message if no image is available
                await conn.sendMessage(from, { text: message });
            }
        };
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.");
    }
});
