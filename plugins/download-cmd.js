const { fetchJson } = require('../lib/functions')
const { cmd } = require('../lib/command')
const { igdl } = require('ruhend-scraper')
const cheerio = require('cheerio')
const axios = require("axios")
const yts = require("yt-search");
const xnxx = require("xnxx-dl");
const path = require("path");
const api = require('../lib/SP-MD/api')
const bot = require('../lib/bot')

// FETCH API URL
let baseUrl;
(async () => {
    let baseUrlGet = await fetchJson(`https://www.dark-yasiya-api.site`)
    baseUrl = baseUrlGet.api
})();


const yourName = "*© QUEEN SP-BOT BY DEV KEAN*";

//twitter dl (x)
cmd({
    pattern: "twitter",
    alias: ["twdl"],
    desc: "download tw videos",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q && !q.startsWith("https://")) return reply("give me twitter url")
        //fetch data from api  
        let data = await fetchJson(`${baseUrl}/api/twitterdl?url=${q}`)
        reply("*Downloading...*")
        //send video (hd,sd)
        await conn.sendMessage(from, { video: { url: data.data.data.HD }, mimetype: "video/mp4", caption: `- HD\n\n ${yourName}` }, { quoted: mek })
        await conn.sendMessage(from, { video: { url: data.data.data.SD }, mimetype: "video/mp4", caption: `- SD \n\n ${yourName}` }, { quoted: mek })  
        //send audio    
        await conn.sendMessage(from, { audio: { url: data.data.data.audio }, mimetype: "audio/mpeg" }, { quoted: mek })  
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

//gdrive(google drive) dl
cmd({
    pattern: "gdrive",
    alias: ["googledrive"],
    desc: "download gdrive files",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q && !q.startsWith("https://")) return reply("give me gdrive url")
        //fetch data from api  
        let data = await fetchJson(`${baseUrl}/api/gdrivedl?url=${q}`)
        reply("*Downloading...*")
        await conn.sendMessage(from, { document: { url: data.data.download }, fileName: data.data.fileName, mimetype: data.data.mimeType, caption: `${data.data.fileName}\n\n${yourName}` }, { quoted: mek })                                                                                                                 
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

//mediafire dl
cmd({
    pattern: "mediafire",
    alias: ["mfire"],
    desc: "download mfire files",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q && !q.startsWith("https://")) return reply("give me mediafire url")
        //fetch data from api  
        const res = await fetch(`${api.MEDIAFIRE_API}${q}`);
        const data = await res.json();
        let downloadUrl = data.downloadLink;
        let desc = `「 𝐌𝐄𝐃𝐈𝐀𝐅𝐈𝐑𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 」

╭──📦 *File Details* 📦──◦•◦❥•
╎ *Name :* *${data.fileName}*
╎ *Type :* *${data.mimeType}*
╎ *Size :* *${data.size}*
╰───────────────◦•◦❥•
⦁⦂⦁━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

🔢 *Reply below number*

*[1] Download File* 📥
   1 │❯❯◦ Fast File 📂
   2 │❯❯◦ Slow File 📂

*${bot.COPYRIGHT}*`;         
// Send the download link to the user
const vv = await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG }, caption: desc }, { quoted: mek });  
conn.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message || !msg.message.extendedTextMessage) return;

    const selectedOption = msg.message.extendedTextMessage.text.trim();

    if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
        switch (selectedOption) {
            case '1':;
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "application/octet-stream", fileName: data.fileName }, { quoted: mek })  
            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            break;
            case '2':;
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "application/octet-stream", fileName: data.fileName }, { quoted: mek })  
            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            break;
            default:
                reply("Invalid option. Please select a valid option🔴");
        }

    }
});
} catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
    reply('An error occurred while processing your request.');
    }
    });
//================================================APK=================================================
cmd({
    pattern: "apk",
    alias: ["app"],
    react: "📲",
    desc: "Download Apk",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please Provide A Name To Apk");

        const res = await fetch(`${api.APK_API}${encodeURIComponent(q)}`);
        const data = await res.json();
        
        if (!data.success) return reply("Faild To Download Apk");

        let desc = `「 𝗔𝗣𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 」
╭──📦 *APK Details* 📦──◦•◦❥•
╎ 🏷 Nᴀᴍᴇ : ${data.apk_name}
╰───────────────◦•◦❥•
⦁⦂⦁━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

🔢 *Reply below number*

*[1] Download File* 📥
   1 │❯❯◦ Apk File 📂
   2 │❯❯◦ XApk File 📂

*${bot.COPYRIGHT}*`;

const vv = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });  

conn.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message || !msg.message.extendedTextMessage) return;

    const selectedOption = msg.message.extendedTextMessage.text.trim();

    if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
        switch (selectedOption) {
            case '1':;
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                await conn.sendMessage(from, { document: { url: data.download_link }, mimetype: "application/vnd.android.package-archive", fileName: `『 ${data.apk_name} 』.apk`, caption: `*${bot.COPYRIGHT}*` }, { quoted: mek });
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                await m.react('✅');
                break;
            case '2':;
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                await conn.sendMessage(from, { document: { url: data.download_link }, mimetype: "application/vnd.android.package-archive", fileName: `『 ${data.apk_name} 』.apk`, caption: `*${bot.COPYRIGHT}*` }, { quoted: mek });
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                await m.react('✅');
                break;
            default:
                reply("Invalid option. Please select a valid option🔴");
        }

    }
});

} catch (e) {
console.error(e);
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
reply('An error occurred while processing your request.');
}
});
//===================================================FB===================================================
cmd({
    pattern: "fb",
    desc: "To download facebook videos.",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!args[0]) {
    return reply('*`Please give a waild Facebook link`*');
  }

  await m.react('🕒');
  let res;
  try {
    res = await igdl(args[0]);
  } catch (error) {
    return reply('*`Error obtaining data.`*');
  }
let desc = `
◈ 𝐅𝐁 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

◈=======================◈

> 🔢 Reply below number
 
1 │❯❯◦ Download FB Video In HD
2 │❯❯◦ Download FB Video In SD
  
  *${bot.COPYRIGHT}*`;
  const vv = await conn.sendMessage(from, { image: { url: bot.ALIVE_IMG}, caption: desc }, { quoted: mek });

  let result = res.data;
  if (!result || result.length === 0) {
    return reply('*`No resalt found.`*');
  }
  

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (error) {
    return reply('*`Error data loss.`*');
  }

  if (!data) {
    return reply('*`No data found.`*');
  }

  //await m.react('✅');
  let video = data.url;
  let dev = `*${bot.COPYRIGHT}*`
  
  try {
    //await conn.sendMessage(m.chat, { video: { url: video }, caption: dev, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });
  } catch (error) {
    return reply('*`Error download video.`*');
  await m.react('❌');
  }
  conn.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message || !msg.message.extendedTextMessage) return;

    const selectedOption = msg.message.extendedTextMessage.text.trim();

    if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
        switch (selectedOption) {
            case '1':
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                await conn.sendMessage(m.chat, { video: { url: video }, caption: dev, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                await m.react('✅');
                break;
            case '2':
                await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });               
                await conn.sendMessage(m.chat, { video: { url: video }, caption: dev, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                await m.react('✅');
                break;
            default:
                reply("Invalid option. Please select a valid option🔴");
        }

    }
});

}catch(e){
console.log(e)
  reply(`${e}`)
}
});
//===================================================IMG==============================================
cmd({
    pattern: "img",
    react: '👾',
    desc: 'to down images',
    category: "download",
    use: '.img dark',
    filename: __filename
},
async(conn, mek, m,{from, l, prefix, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) throw `Example: ${prefix + command} Bike`
const desc =`
◈=======================◈
𝐈𝐌𝐀𝐆𝐄 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑
◈=======================◈

*TEXT* ~: *${q}*

> 🔢 *Reply below number*

 1 │❯❯◦ *Image (normal)*
 2 │❯❯◦ *Document(.jpeg)*

⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁`
const vv = await conn.sendMessage(from,{image:{url:bot.ALIVE_IMG},caption:desc},{quoted:mek})
conn.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message || !msg.message.extendedTextMessage) return;

    const selectedOption = msg.message.extendedTextMessage.text.trim();

    if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
        switch (selectedOption) {
            case '1':;
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            let gis = require('g-i-s')
            gis(q, async (error, result) => {
                if (error) {
                    console.error('Error fetching images:', error);
                
                    return reply('Error fetching images. Please try again later.')
                }
        
                const topImages = result.slice(0, 5); // Extract top 5 images
        
                for (let i = 0; i < topImages.length; i++) {
                    const imageUrl = topImages[i].url
                  let Message = {
                      image: { url: imageUrl },caption: `*${bot.COPYRIGHT}*`,
                   }    
                   conn.sendMessage(from, Message, { quoted: mek })
                }
            })
            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
            await m.react('✅');
                break;
            case '2':;
            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
            let gis2 = require('g-i-s')
            gis2(q, async (error, result) => {
                if (error) {
                    console.error('Error fetching images:', error);
                
                    return reply('Error fetching images. Please try again later.')
                }
        
                const topImages = result.slice(0, 5); // Extract top 5 images
        
                for (let i = 0; i < topImages.length; i++) {
                    const imageUrl = topImages[i].url
                  let Message = {
                      image: { url: imageUrl },caption: `*${bot.COPYRIGHT}*`,
                   }    
            conn.sendMessage(from, { document: {url: imageUrl },fileName: 'image' + '.jpg', mimetype: 'image/jpeg' ,caption: `*${bot.COPYRIGHT}*`,}, { quoted: mek })  
        }})
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });  
        await m.react('✅');
                break;
            default:
                reply("Invalid option. Please select a valid option🔴");
        }

    }
});
console.log(`♻ Image Command Used : ${from}`);
} catch (error) {
console.error("❌ Image Downloader Error:", error);
reply('❌ *An error occurred while processing your request. Please try again later.*');
}
});
//=============================================Song=====================================================
cmd(
{
    pattern: "song",
    alias: ["ytmp3","ytsong"],
    react: '🎵',
    desc: "Download Song",
    category: "download",
    use: '.song <Song name Or link>',
    filename: __filename
},

async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
try {
if (!q) return reply("Please Give Me Text Or Link❓");

// Search for the video  
  const search = await yts(q);  
  if (!search.videos.length) return reply("❌ Video not found!");  

  const deta = search.videos[0];  
  const url = deta.url;  

  // Song metadata description  
  let desc = `
◈ 𝐀𝐔𝐃𝐈𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

◈=======================◈
╭──────────────╮
┃ 🎵 𝙏𝙞𝙩𝙡𝙚 : ${deta.title}
┃
┃ ⏱ 𝘿𝙪𝙧𝙖𝙩𝙞𝙤𝙣 : ${deta.timestamp}
┃
┃ 📅 𝙍𝙚𝙡𝙚𝙖𝙨𝙚 : ${deta.ago}
┃
┃ 📊 𝙑𝙞𝙚𝙬𝙨 : ${deta.views}
┃
┃ 🔗 𝙇𝙞𝙣𝙠 : ${deta.url}
┃
╰──────────────╯
⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

> 🔢 Reply below number

1 │❯❯◦ Audio File 🎶
2 │❯❯◦ Document File 📂
3 │❯❯◦ Voice Note 🎤

*${bot.COPYRIGHT}*
`;
const vv = await conn.sendMessage(from, { image: { url: deta.thumbnail }, caption: desc }, { quoted: mek });
const apiUrl = `${api.YTMP3_API}${url}`;
    const data = await axios.get(apiUrl);
    if (!data.data || !data.data.success || !data.data.result.download_url) {
    return reply("Failed to fetch the audio. Try again later.");}

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':;
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                         await conn.sendMessage(  
                         from,  
                         {  
                         audio: {url:data.data.result.download_url},  
                         mimetype: "audio/mpeg",  
                         },  
                         { quoted: mek }  
                         );
                         await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });  
                         await m.react('✅');  
                        break;
                    case '2':;
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                         await conn.sendMessage(  
                         from,  
                         {  
                         document: {url:data.data.result.download_url},  
                         mimetype: "audio/mpeg",  
                         fileName: `${deta.title}.mp3`,  
                         caption: `*${bot.COPYRIGHT}*`,  
                         },  
                         { quoted: mek }  
                         );
                         await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                         await m.react('✅');
                         break;  
                    case '3':;
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        await conn.sendMessage(
                        from,
                        {
                        audio: {url:data.data.result.download_url},
                        mimetype: "audio/mpeg",
                        ptt: true, // This makes it a voice note (PTT)
                        },
                       { quoted: mek }
                        );
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        await m.react('✅');
                        break;
                        default:
                        reply("Invalid option. Please select a valid option🔴");
                }
            }
        });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});
//=================================================TT=====================================================
cmd({
    pattern: "tt",
    alias: ["tiktok"],
    react: "🎬",
    desc: "Download TikTok video using the provided URL",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        // Check if URL is provided
        if (!args[0]) {
            return await reply("*Give Me A Tik Tok Link.*");
        }

        const tiktokUrl = args[0];
        const apiUrl = `${api.TIKTOK_API}${encodeURIComponent(tiktokUrl)}&apikey=Manul-Official`;

        // Send request to the API
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.data.status) {
            const data = response.data.data.data;

            // Prepare the message with video details and options
            const message = `
◈ 𝐓𝐈𝐊 𝐓𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 

◈=======================◈
╭──────────────╮
┃ 🎵 𝙏𝙞𝙩𝙡𝙚 : ${data.title}
┃
┃ 👤 𝙊𝙪𝙩𝙝𝙤𝙧 : ${data.author}
┃
╰──────────────╯
⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

> 🔢 Reply below number

1 │❯❯◦ No Watermark Video 🎶
2 │❯❯◦ Watermark Video 📂
3 │❯❯◦ MP3 (Audio)
4 │❯❯◦ Thumbnail

*${bot.COPYRIGHT}*`;

            // Send the message and save the message ID
            const sentMsg = await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: message }, { quoted: mek });
            const messageID = sentMsg.key.id; // Save the message ID for later reference

            // Listen for the user's response
            conn.ev.on("messages.upsert", async (messageUpdate) => {
                const mek = messageUpdate.messages[0];
                if (!mek.message) return;
                const messageType =
                    mek.message.conversation ||
                    mek.message.extendedTextMessage?.text;
                const from = mek.key.remoteJid;

                // Check if the message is a reply to the previously sent message
                const isReplyToSentMsg =
                    mek.message.extendedTextMessage &&
                    mek.message.extendedTextMessage.contextInfo.stanzaId ===
                        messageID;

                if (isReplyToSentMsg) {
                    // React to the user's reply
                    await conn.sendMessage(from, {
                        react: { text: "🌟", key: mek.key },
                    });

                    switch (messageType) {
                        case '1':
                            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                            // Handle option 1 (No Watermark Video)
                            await conn.sendMessage(
                                from,
                                { video: { url: data.nowm }, caption: `${bot.COPYRIGHT}` },
                                { quoted: mek }
                            );
                            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                            break;
                        case '2':
                            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                            // Handle option 2 (Watermark Video)
                            await conn.sendMessage(
                                from,
                                { video: { url: data.watermark }, caption: `${bot.COPYRIGHT}` },
                                { quoted: mek }
                            );
                            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                            break;
                        case '3':
                            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                            // Handle option 3 (Audio)
                            await conn.sendMessage(
                                from,
                                { audio: { url: data.audio }, mimetype: 'audio/mp4', caption: `${bot.COPYRIGHT}` },
                                { quoted: mek }
                            );
                            await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                            break;
                        case '4':
                            // Handle option 4 (Thumbnail)
                            await conn.sendMessage(
                                from,
                                { image: { url: data.thumbnail }, caption: `${bot.COPYRIGHT}` },
                                { quoted: mek }
                            );
                            await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                            break;
                        default:
                            // Handle invalid input (not 1, 2, 3, or 4)
                            await conn.sendMessage(from, {
                                react: { text: "❓", key: mek.key },
                            });
                            await reply("Reply A 1-4 Numbers To Get...");
                            break;
                    }

                    // React to the successful completion of the task
                    await conn.sendMessage(from, {
                        react: { text: "✅", key: mek.key },
                    });

                    // Clear the stored TikTok data
                    delete conn.tiktokData;
                }
            });
        } else {
            await reply("*Invalid Url*");
        }
    } catch (error) {
        console.error("Error fetching TikTok video:", error);

    }
});
// -------- Video Download --------
cmd({
    pattern: 'video',
    desc: 'download videos',
    react: "📽️",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply('*Please enter a query or a url !*');

        const search = await yts(q);
        const deta = search.videos[0];
        const url = deta.url;

        let desc = `◈ 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

◈=======================◈
╭──────────────╮
┃ 🎵 𝙏𝙞𝙩𝙡𝙚 : ${deta.title}
┃
┃ ⏱ 𝘿𝙪𝙧𝙖𝙩𝙞𝙤𝙣 : ${deta.timestamp}
┃
┃ 📅 𝙍𝙚𝙡𝙚𝙖𝙨𝙚 : ${deta.ago}
┃
┃ 📊 𝙑𝙞𝙚𝙬𝙨 : ${deta.views}
┃
┃ 🔗 𝙇𝙞𝙣𝙠 : ${deta.url}
┃
╰──────────────╯

⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

🔢 Reply below number

*[1] Video File* 🎶
   1.1 │❯❯◦ 360 File 🎶
   1.2 │❯❯◦ 480 File 🎶
   1.3 │❯❯◦ 720 File 🎶
   1.4 │❯❯◦ 1080 File 🎶

*[2] Document File* 📂
   2.1 │❯❯◦ 360 File 📂
   2.2 │❯❯◦ 480 File 📂
   2.3 │❯❯◦ 720 File 📂
   2.4 │❯❯◦ 1080 File 📂


*${bot.COPYRIGHT}*`;

        const vv = await conn.sendMessage(from, { image: { url: deta.thumbnail }, caption: desc }, { quoted: mek });
        const res = await fetch(`${api.YTMP4_API}${url}`);
        const data = await res.json();
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1.1':;
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrl = data.result.download_url;
                        await conn.sendMessage(from,{video:{url:downloadUrl},mimetype:"video/mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    case '1.2':;
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrll = data.result.download_url;
                        await conn.sendMessage(from,{video:{url:downloadUrll},mimetype:"video/mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    case '1.3':;
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrlll = data.result.download_url;
                        await conn.sendMessage(from,{video:{url:downloadUrlll},mimetype:"video/mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    case '1.4':;
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrllll = data.result.download_url;
                        await conn.sendMessage(from,{video:{url:downloadUrllll},mimetype:"video/mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;    
                    case '2.1':
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrrl = data.result.download_url;
                        await conn.sendMessage(from,{document:{url:downloadUrrl},mimetype:"video/mp4",fileName:deta.title + ".mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    case '2.2':
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrrll = data.result.download_url;
                        await conn.sendMessage(from,{document:{url:downloadUrrll},mimetype:"video/mp4",fileName:deta.title + ".mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    case '2.3':
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrrrlll = data.result.download_url;
                        await conn.sendMessage(from,{document:{url:downloadUrrrlll},mimetype:"video/mp4",fileName:deta.title + ".mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    case '2.4':
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        if (!data.success) return reply("*Download Failed* Please Try Again");
                        let downloadUrrrrlllll = data.result.download_url;
                        await conn.sendMessage(from,{document:{url:downloadUrrrrlllll},mimetype:"video/mp4",fileName:deta.title + ".mp4",caption :`${bot.COPYRIGHT}`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        break;
                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }
                await conn.sendMessage(from, {
                    react: { text: "✅", key: mek.key },
                });
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});
// XNXX video download command
cmd({
    pattern: "xnxx",
    desc: "Downloads a video from XNXX",
    use: ".xnxx <search_term>",
    react: "🤤",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, q, reply }) => {
    const searchTerm = q.trim();
    if (!searchTerm) return reply(`*Enter Name Or Link To Download*`);

    reply(`*Serching Video..*`);
    try {
        // Search for the video and download
        const videoInfo = await xnxx.download(searchTerm);
        if (!videoInfo || !videoInfo.link_dl) {
            return await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        }
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
        reply(`*Downloading Your Video...*`);
        const videoUrl = videoInfo.link_dl;
        await conn.sendMessage(
            from,
            { video: { url: videoUrl }, caption: `*${bot.COPYRIGHT}*`, mimetype: 'video/mp4' }, 
            { quoted: mek }
        )
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`Error: ${e.message}`);
    }
});
//==========================================X-Video===========================================
const apiurl = `${api.XVID_API}`;

cmd({
    pattern: "xvideo",
    alias: ["xvdl", "xvdown"],
    react: "🔞",
    desc: "Download xvideo.com porn video",
    category: "download",
    use: '.xvideo <text>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, q }) => {
    try {
        if (!q) return await reply("❌ *Please enter a search query!*");
      
        // Fetch search results
        const xv_list = await fetchJson(`${apiurl}/search/xvideo?text=${encodeURIComponent(q)}`).catch(() => null);
        if (!xv_list || !xv_list.result || xv_list.result.length === 0) {
            await m.react('❌');
            return await reply("❌ *No results found!*");
            
        }

        // Fetch video details from the first search result
        const xv_info = await fetchJson(`${apiurl}/download/xvideo?url=${encodeURIComponent(xv_list.result[0].url)}`).catch(() => null);
        if (!xv_info || !xv_info.result || !xv_info.result.dl_link) {
            await m.react('❌');
            return await reply("❌ *Failed to fetch video details!*");
        }
        // Prepare the message
        const msg = `◈ 𝐗 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

◈=======================◈
╭──────────────╮
┃ 🎞 *Title* - ${xv_info.result.title || "N/A"}
┃
┃ 👱‍♂️ *Views* - ${xv_info.result.views || "N/A"}
┃
┃ 👍 *Likes* - ${xv_info.result.like || "N/A"}
┃
┃ 👎 *Dislikes* - ${xv_info.result.deslike || "N/A"}
┃
┃ 📂 *Size* - ${xv_info.result.size || "N/A"}
┃
╰──────────────╯
⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

> 🔢 Reply below number

1 │❯❯◦ Video File 🎶
2 │❯❯◦ Document File 📂

*${bot.COPYRIGHT}*`;

        // Sending details message
        const vv = await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "DEW-MD X Video Downloader",
                    body: "Click to view more videos",
                    thumbnailUrl: xv_info.result.image || "",
                    sourceUrl: xv_info.result.url || "",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':;
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        await conn.sendMessage(from, {video: { url: xv_info.result.dl_link },caption: `🎬 *${xv_info.result.title || "Untitled Video"}*\n\n*${bot.COPYRIGHT}*`}, { quoted: mek });
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        await m.react('✅');
                        break;
                    case '2':;
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        await conn.sendMessage(from,{document:{ url: xv_info.result.dl_link },mimetype:"video/mp4",fileName:xv_info.result.title + ".mp4",caption :`*${bot.COPYRIGHT}*`},{quoted:mek})
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        await m.react('✅');
                        break;
                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });
        console.log(`♻ Xvideos Command Used : ${from}`);
    } catch (error) {
        console.error("❌ Xvideo Downloader Error:", error);
        reply('❌ *An error occurred while processing your request. Please try again later.*');
    }
});
