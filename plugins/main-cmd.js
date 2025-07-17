const {cmd , commands} = require('../lib/command')
const os = require("os")
const { runtime } = require('../lib/functions')
const hrs = new Date().getHours({ timeZone: 'Asia/Colombo' })
const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const axios = require('axios');
const bot = require('../lib/bot')
//========================================About==================================================
cmd({
    pattern: "about",
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let madeMenu = `❁ ════ ❃•⇆•❃ ════ ❁

*👋 HELLO ${pushname}*

*I AM ${bot.BOT_NAME} WHATSAPP BOT*

*CREATED BY KE4N DEV*

*THANK YOU FOR USING MY BOT.👻💗*

❁ ════ ❃•⇆•❃ ════ ❁
*${bot.COPYRIGHT}*
╰━❁ ═══ ❃•⇆•❃ ═══ ❁━╯
`

await conn.sendMessage(from,{image:{url:bot.ALIVE_IMG},caption:madeMenu},{quoted:mek})
console.log(`♻ About Command Used : ${from}`);
}catch(e){
console.log(e)
reply(`${e}`)
}
})
//==================================================ALive============================================
cmd(
    {
      pattern: "alive",
      alias: ["status"],
      desc: "Check if the bot is alive",
      category: "main",
      react: "👨‍💻",
      filename: __filename,
    },
    async (conn,mek,m, { from, pushname, reply , setting } ) => {
      try {
    
      var time = new Date().toLocaleString('HI', { timeZone: 'Asia/Colombo' }).split(' ')[1]
      var date = new Date().toLocaleDateString(get_localized_date)
      var am_pm = ''
        if (hrs < 12) am_pm = 'ᴀᴍ'
        if (hrs >= 12 && hrs <= 24) am_pm = 'ᴘᴍ'
        let currentHour = new Date().getHours();
        
let aliveText =`👋 *HI*, *${pushname}* *I Am Alive Now*
  
╭─「 ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 」
│📅 *\`Date\`*: ${date}
│⏰ *\`Time\`*: ${time} ${am_pm}
╰──────────●●►*
  
╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」
│👤 *\`User\`*: ${pushname}
│✒ *\`Prefix\`*: ${setting.prefix}
│🧬 *\`Version\`*: ${bot.VERSION}
│📟 *\`Uptime\`*: ${runtime(process.uptime())}
│📂 *\`Memory\`*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
╰──────────●●►
╭──────────●●►
│ *Hello , I am alive now!!*
╰──────────●●►
  
🔢 *Reply below number*
  
1 │❯❯◦ COMMANDS MENU
2 │❯❯◦ SP-BOT SPEED
  
*${bot.COPYRIGHT}*`;

const vv = await conn.sendMessage(from,{image:{url:bot.ALIVE_IMG},caption:aliveText},{quoted:mek})
conn.ev.on('messages.upsert', async (msgUpdate) => {
          const msg = msgUpdate.messages[0];
          if (!msg.message || !msg.message.extendedTextMessage) return;
  
          const selectedOption = msg.message.extendedTextMessage.text.trim();
  
          if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
              switch (selectedOption) {
                  case '1':
                      reply('.menu');
                      break;
                  case '2':
                      reply('.ping');
                      break;
                      default:
                          reply("Invalid option. Please select a valid option🔴");
                  }
  
              }
          });
  
        console.log(`♻ Alive command used in: ${from}`);
      } catch (e) {
        console.error("Alive Command Error:", e);
        reply(`❌ Error: ${e.message}`);
      }
    }
  );
//=============================================Auto Bio===============================================
// AutoBIO feature variables
let autoBioInterval;

// 1. Set AutoBIO
cmd({
    on: "body"
  },  
 async (conn, mek, m, { from, isOwner, reply , setting }) => {
        startAutoBio(conn);
});
// 2. Start AutoBIO
function startAutoBio(conn) {
    // Clear any existing interval to avoid duplicates
    if (autoBioInterval) clearInterval(autoBioInterval);

    // Set a new interval to update the bio every minute (or any preferred time)
    autoBioInterval = setInterval(async () => {
        const bioText = `*${bot.BIO_TEXT}* 💛`;  // Set the bio text with time
        await conn.updateProfileStatus(bioText);  // Update the bot's bio
    }, 60 * 1000);  // 1 minute interval
}
//============================ Env=======================================================
function isEnabled(value) {
return value && value.toString().toLowerCase() === "true";
}
cmd({
    pattern: "env",
    alias: ["setting2", "allvar"],
    desc: "Settings of bot",
    category: "main",
    react: "⤵️",
    filename: __filename
}, 
async (conn, mek, m, { from, setting, reply }) => {
    try {
        // Define the settings message with the correct boolean checks
        let envSettings = `╭━━━〔 *Q SP-BOT-ENV* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *𝔼ℕ𝕍 𝕊𝔼𝕋𝕋𝕀ℕ𝔾𝕊 📡*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━〔 *Enabled Disabled* 〕━━┈⊷
┇๏ *Status View:* ${isEnabled(setting.statusView) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Status Reply:* ${isEnabled(setting.statusReply) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Reply:* ${isEnabled(setting.autoReply) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Voice:* ${isEnabled(setting.autoVoice) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto React:* ${isEnabled(setting.autoReact) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti-Link:* ${isEnabled(setting.antiLink) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Anti-Bad Words:* ${isEnabled(setting.antiBad) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Typing:* ${isEnabled(setting.autoType) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Auto Recording:* ${isEnabled(setting.autoRec) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Always Online:* ${isEnabled(setting.online) ? "Enabled ✅" : "Disabled ❌"}
┇๏ *Read Message:* ${isEnabled(setting.readCmd) ? "Enabled ✅" : "Disabled ❌"}
╰━━━━━━━━━━━━──┈⊷
> ${bot.DESCRIPTION}`;

        // Send message with an image
        await conn.sendMessage(
            from,
            {
                image: { url: `${bot.ALIVE_IMG}` }, // Image URL
                caption: envSettings,
            },
            { quoted: mek }
        );

        // Send an audio file
        console.log(`♻ ENV Command Used : ${from}`);
    } catch (error) {
        console.log(error);
        reply(`Error: ${error.message}`);
    }
});
//============================List===========================================
cmd({
    pattern: "list",
    react: "🛸",
    alias: ["panel","list","commands"],
    desc: "Get bot\'s command list.",
    category: "main",
    use: '.list',
    filename: __filename
},
async(conn, mek, m,{from, pushname, reply , setting}) => {
try{
let menu = {
main: '',
download: '',
group: '',
owner: '',
convert: '',
search: ''
};

for (let i = 0; i < commands.length; i++) {
if (commands[i].pattern && !commands[i].dontAddCommandList) {
menu[commands[i].category] += `*│*❯❯◦ ${commands[i].pattern}\n`;
 }
}
let madeMenu = `🤩 *HELLOW* *${pushname}*
>  💃🏻 WELLCOME TO QUEEN SP-BOT  💃🏻

╭──────────────────━┈⊷
│◦ ✗🤖*\`Bot Name\`* : *${bot.BOT_NAME}*
│◦ ✗👤*\`Owner Name\`* : *${bot.OWNER_NAME}*
│◦ ✗☎ *\`Owner Number\`* : ${bot.OWNER_NUMBER}
│◦ ✗⏰*\`Uptime\`* : ${runtime(process.uptime())}
│◦ ✗💾*\`Ram\`* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◦ ✗💫*\`Prefix\`* :  ${setting.prefix}
╰──────────────────━┈⊷

> OWNER COMMANDS
*╭──────────●●►*
${menu.owner}*╰───────────●●►*
> CONVERT COMMANDS
*╭──────────●●►*
${menu.convert}*╰───────────●●►*
> AI COMMANDS
*╭──────────●●►*
${menu.ai}*╰───────────●●►*
> SEARCH COMMANDS
*╭──────────●●►*
${menu.search}*╰───────────●●►*
> DOWNLOAD COMMANDS
*╭──────────●●►*
${menu.download}*╰───────────●●►*
> MAIN COMMANDS
*╭──────────●●►*
${menu.main}*╰───────────●●►*
> GROUP COMMANDS
*╭──────────●●►*
${menu.group}*╰───────────●●►*
> FUN COMMANDS
*╭──────────●●►*
${menu.fun}*╰───────────●●►*
> TOOLS COMMANDS
*╭──────────●●►*
${menu.tools}*╰───────────●●►*
> OTHER COMMANDS
*╭──────────●●►*
${menu.other}*╰───────────●●►*
> MOVIE COMMANDS
*╭──────────●●►*
${menu.movie}*╰───────────●●►*
> NEWS COMMANDS
*╭──────────●●►*
${menu.news}*╰───────────●●►*
> PAST PAPER COMMANDS
*╭──────────●●►*
${menu.pp}*╰───────────●●►*

*${bot.COPYRIGHT}*`
console.log(`♻ List Command Used : ${from}`);
await conn.sendMessage(from,{image:{url:bot.ALIVE_IMG},caption:madeMenu},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
//=================================menu=====================================================================
cmd({
    pattern: "menu",
    alias: ["list"],
    desc: "Displays the bot menu",
    react: "📜",
    category: "main"
},
async (conn, mek, m, { from, pushname, reply , setting }) => {
    try {
      let desc = `
🤩 *HELLOW* *${pushname}*
>  💃🏻 WELLCOME TO QUEEN SP-BOT  💃🏻

╭──────────────────━┈⊷
│◦ ✗🤖*\`Bot Name\`* : *${bot.BOT_NAME}*
│◦ ✗👤*\`Owner Name\`* : *${bot.OWNER_NAME}*
│◦ ✗☎ *\`Owner Number\`* : ${bot.OWNER_NUMBER}
│◦ ✗⏰*\`Uptime\`* : ${runtime(process.uptime())}
│◦ ✗💾*\`Ram\`* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◦ ✗💫*\`Prefix\`* :  ${setting.prefix}
╰──────────────────━┈⊷

> 🔢 ʀᴇᴘʟʏ ᴛʜᴇ ɴᴜᴍʙᴇʀ ʙᴇʟᴏᴡ🗿

1 │❯❯◦ OWNER MENU
2 │❯❯◦ CONVERT MENU
3 │❯❯◦ AI MENU
4 │❯❯◦ SEARCH MENU
5 │❯❯◦ DOWNLOAD MENU
6 │❯❯◦ MAIN MENU
7 │❯❯◦ GROUP MENU
8 │❯❯◦ FUN MENU
9 │❯❯◦ TOOLS MENU
10 │❯❯◦ OTHER MENU
11 │❯❯◦ MOVIE MENU
12 │❯❯◦ NEWS MENU
13 │❯❯◦ PAST PAPER MENU 

*${bot.COPYRIGHT}*`;

        // Send the menu with an image
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
                        let response = `*◈ OWNER COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *getpp*
│ • *shutdown*
│ • *restart*
│ • *reboot*
│ • *broadcast*
│ • *setpp*
│ • *block*
│ • *unblock*
│ • *clearchats*
│ • *jid*
│ • *gjid*
│ • *join*
│ • *leavegc*
│ • *setbio*
│ • *updateenv*
╰────────────────────●●►
➠ *Total Commands: 15*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.OWNER_IMG }, 
                            caption: response 
                        }, { quoted: mek });
                        break;
                    case '2':
                        let response2 = `*◈ CONVERT COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *fancy*
│ • *font*
│ • *style*
│ • *tourl*
│ • *imgurl*
│ • *img2url*
│ • *sticker*
│ • *stic*
╰────────────────────●●►
➠ *Total Commands: 8*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.CONVERT_IMG }, 
                            caption: response2 
                        }, { quoted: mek });
                        break;
                    case '3':
                        let response3 = `*◈ AI COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *ai*
│ • *blackbox*
│ • *gemini*
│ • *gpt*
│ • *gpt-4*
│ • *deepseek*
│ • *lima*
│ • *fluxai*
│ • *flux*
│ • *imagine2*
│ • *imagine3*
│ • *dale*
╰────────────────────●●►
➠ *Total Commands: 12*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.AI_IMG }, 
                            caption: response3 
                        }, { quoted: mek });
                        break;
                    case '4':
                        let response4 = `*◈ SEARCH COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *ip*
│ • *yts*
│ • *ytsearch*
│ • *ytquery*
│ • *google*
│ • *gsearch*
│ • *srepo*
╰────────────────────●●►
➠ *Total Commands: 7*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.SEARCH_IMG }, 
                            caption: response4 
                        }, { quoted: mek });
                        break;
                    case '5':
                        
                        response5 = `*◈ DOWNLOAD COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *twitter*
│ • *twdl*
│ • *gdrive*
│ • *googledrive*
│ • *mediafire*
│ • *mfire*
│ • *apk*
│ • *app*
│ • *fb*
│ • *ig*
│ • *igstory*
│ • *insta*
│ • *img*
│ • *logo*
│ • *ringtone*
│ • *ring*
│ • *song*
│ • *ytmp3*
│ • *tt*
│ • *tiktok*
│ • *video*
│ • *xnxx*
│ • *xvideo*
│ • *xvdl*
│ • *xvdown*
╰────────────────────●●►
➠ *Total Commands: 25*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.DOWNLOAD_IMG }, 
                            caption: response5 
                        }, { quoted: mek });
                        break;
                    case '6':
                        
                        response6 = `*◈ MAIN COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *menu*
│ • *list*
│ • *about*
│ • *alive*
│ • *status*
│ • *panel*
│ • *setting*
│ • *commands*
│ • *version*
│ • *cupdatecmd*
│ • *env*
│ • *alvar*
│ • *live*
│ • *time*
│ • *owner*
│ • *user*
│ • *speed*
│ • *ping*
│ • *repo*
│ • *script*
│ • *info*
│ • *system*
│ • *uptime*
│ • *runtime*
│ • *update*
│ • *sync*
╰────────────────────●●►
➠ *Total Commands: 26*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.MAIN_IMG }, 
                            caption: response6 
                        }, { quoted: mek });
                        break;
                    case '7':
                        
                        response7 = `*◈ GROUP COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *user*
│ • *profile*
│ • *user info*
│ • *add*
│ • *invite*
│ • *admins*
│ • *groupdesc*
│ • *groupinfo*
│ • *grouplink*
│ • *gname*
│ • *setsubject*
│ • *requests*
│ • *accept*
│ • *reject*
│ • *hidetag*
│ • *kick*
│ • *unlock*
│ • *lock*
│ • *approve*
│ • *poll*
│ • *getpic*
│ • *kickall*
│ • *opentime*
│ • *closetime*
│ • *tagadmin*
│ • *rank*
│ • *tagall*
│ • *everyone*
│ • *mute*
│ • *unmute*
│ • *promote*
│ • *demote*
│ • *del*
│ • *setgoodbye*
│ • *setwelcome*
╰────────────────────●●►
➠ *Total Commands: 35*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.GROUP_IMG }, 
                            caption: response7 
                        }, { quoted: mek });
                        break;
                    case '8':
                        
                        response8 = `*◈ FUN COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *animegirl*
│ • *boom*
│ • *dog*
│ • *fact*
│ • *joke*
│ • *hack*
│ • *loli*
│ • *lolii*
│ • *ship*
│ • *cup*
│ • *love*
│ • *truth*
│ • *truthquestion*
│ • *dare*
│ • *darequestion*
│ • *couplepp*
│ • *cpp*
│ • *couple*
╰────────────────────●●►
➠ *Total Commands: 18*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.FUN_IMG }, 
                            caption: response8 
                        }, { quoted: mek });
                        break;
                    case '9':
                        
                        response9 = `*◈ TOOLS COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *tempnumber*
│ • *fakenum*
│ • *templist*
│ • *otpbox*
│ • *getotp*
│ • *pair*
│ • *getpair*
│ • *ss*
│ • *ssweb*
│ • *tempmail*
│ • *checkmail*
│ • *trt*
│ • *tts*
│ • *tts2*
│ • *npm*
│ • *npmstalk*
│ • *qr*
│ • *qrcode*
│ • *pdf*
│ • *topdf*
│ • *get*
│ • *js*
╰────────────────────●●►
➠ *Total Commands: 22*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.TOOLS_IMG }, 
                            caption: response9 
                        }, { quoted: mek });
                        break;
                    case '10':
                        
                        response10 = `*◈ OTHER COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *githubstalk*
│ • *gpass*
│ • *weather*
│ • *define*
│ • *diary*
│ • *setdiary*
│ • *resetdiary*
│ • *resetpassword*
╰────────────────────●●►
➠ *Total Commands: 8*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.OTHER_IMG }, 
                            caption: response10 
                        }, { quoted: mek });
                        break;
                        case '11':
                        
                        response11 = `*◈ MOVIE COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *film*
│ • *movie*
│ • *moviedl*
╰────────────────────●●►
➠ *Total Commands: 3*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.MOVIE_IMG }, 
                            caption: response11 
                        }, { quoted: mek });
                        break;
                        case '12':
                        
                        response12 = `*◈ NEWS COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *news*
│ • *newslist*
│ • *derana*
│ • *hiru*
│ • *bbc*
│ • *lankadeepa*
│ • *itn*
│ • *siyatha*
│ • *neth*
│ • *lankanews*
│ • *gosiplanka*
│ • *technews*
│ • *worldnews*
╰────────────────────●●►
➠ *Total Commands: 13*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.NEWS_IMG }, 
                            caption: response12 
                        }, { quoted: mek });
                        break;
                        case '13':
                        response13 = `*◈ NEWS COMMAND LIST ◈*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${runtime(process.uptime())}
╰──────────●●►
╭────────●●►
│ • *pp*
│ • *pastpaper*
│ • *bhddhism*
│ • *Sinhala*
│ • *English*
│ • *maths*
│ • *science*
│ • *history*
│ • *bas1*
│ • *bas2*
│ • *bas3*
╰────────────────────●●►
➠ *Total Commands: 11*
*${bot.COPYRIGHT}*`;
                        await conn.sendMessage(from, { 
                            image: { url: bot.PP_IMG }, 
                            caption: response13 
                        }, { quoted: mek });
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
//=================================================Owner===============================================
cmd({
    pattern: "owner",
    react: "👑", // Reaction emoji when the command is triggered
    alias: ["user", "ow"],
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        // Owner's contact info
        const ownerNumber = '+94776290170'; // Replace this with the actual owner number
        const ownerName = 'KE4N Dev'; // Replace this with the owner's name
        const organization = 'QUEEN SP CEO & DEV'; // Optional: replace with the owner's organization

        // Create a vCard (contact card) for the owner
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  // Full Name
                      `ORG:${organization};\n` +  // Organization (Optional)
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +  // WhatsApp ID and number
                      'END:VCARD';

        // Send the vCard first
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send a reply message that references the vCard
        await conn.sendMessage(from, {
            text: `This is the owner's contact ${ownerName}`,
            contextInfo: {
                mentionedJid: [ownerNumber.replace('+94776290170', '') + '+94776290170@s.whatsapp.net'], // Mention the owner
                quotedMessageId: sentVCard.key.id // Reference the vCard message
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: 'Sorry, there was an error fetching the owner contact.' }, { quoted: mek });
    }
});
//============================================Ping==================================================
cmd({
    pattern: "speed",
    react: "🤖",
    alias: ["speed"],
    desc: "Check bot\'s ping",
    category: "main",
    use: '.ping2',
    filename: __filename
},
async(conn, mek, m,{from, l, reply}) => {
try{
    var inital = new Date().getTime();
    let ping = await conn.sendMessage(from , { text: '*_Queen-Sp..._*'  }, { quoted: mek } )
    var final = new Date().getTime();
    await conn.sendMessage(from, { delete: ping.key })
        return await conn.sendMessage(from , { text: '*🔥Pong*\n *' + (final - inital) + ' ms* '  }, { quoted: mek } )
    } catch (e) {
    reply('*Error !!*')
    l(e)
    }
})

cmd({
    pattern: "ping",
    react: "♻️",
    alias: ["speed"],
    desc: "Check bot\'s ping",
    category: "main",
    use: '.ping',
    filename: __filename
},
async(conn, mek, m,{from, reply}) => {
try{
const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*_🪄Pinging..._*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `*♻️ Speed... : ${ping}ms*`}, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
//======================================Precisence====================================================
//auto recording
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner ,setting }) => {       
 if (!setting.autoRec) return; {
                await conn.sendPresenceUpdate('recording', from);
            }
         } 
   );

//auto_voice
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner ,setting }) => {

  let voc = await axios.get(`${bot.BOT_URL}`);
  const url = voc.data.voice;
    let { data } = await axios.get(url)
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (!setting.autoVoice) return; {
                if (isOwner) return;        
                await conn.sendPresenceUpdate('recording', from);
                await conn.sendMessage(from, { audio: { url: data[text] }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
            }
        }
    }                
});

cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner,setting }) => {
  let rep = await axios.get(`${bot.BOT_URL}`);
  const url = rep.data.reply;
    let { data } = await axios.get(url)
    for (const text in data) {
        if (body.toLowerCase() === text.toLowerCase()) {
            if (!setting.autoReply) return; {
                if (isOwner) return;        
                await m.reply(data[text])
            
            }
        }
    }                
});
// Composing (Auto Typing)
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, setting }) => {
    if (!setting.autoType) return; {
        await conn.sendPresenceUpdate('composing', from); // send typing 
    }
});
// Always Online
cmd(
  { on: "body" },
  async (conn, mek, m, { from, isOwner, setting }) => {
    try {
      if (setting.online) {
        // ✅ Always Online Mode enabled: show as online (double tick)
        await conn.sendPresenceUpdate("available", from);
      } else {
        // ❌ Always Online Mode off: dynamic owner-based presence
        if (isOwner) {
          await conn.sendPresenceUpdate("available", from); // Owner triggers available
        } else {
          await conn.sendPresenceUpdate("unavailable", from); // Others see as offline
        }
      }
    } catch (e) {
      console.log("❌ Presence update failed:", e);
    }
  }
);
// Public Mod
cmd({
  on: "body"
}, async (conn, mek, m, { from, isOwner,setting }) => {
  try {
    if (!setting.online) {
      // Public Mode + Always Online: Always show as online
      await conn.sendPresenceUpdate("available", from);
    } else if (!setting.readCmd) {
      // Public Mode + Dynamic: Respect owner's presence
      if (isOwner) {
        // If owner is online, show available
        await conn.sendPresenceUpdate("available", from);
      } else {
        // If owner is offline, show unavailable
        await conn.sendPresenceUpdate("unavailable", from);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
//==========================================Repo=================================================
cmd({
    pattern: "repo",
    desc: "repo the bot",
    react: "📡",
    category: "main",
    filename: __filename
},

async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let dec = `> QUEEN SP-BOT REPO INFO  💃🏻

╭⦁⦂⦁*━┉━┉━┉━┉━┉━┉━⦁⦂⦁
┃ 𝙾𝚆𝙽𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁: ${bot.OWNER_NUMBER}
┃ 
┃ SP-MD REPO: ${bot.REPO_LINK} 
┃
┃ BOT UPDATES: ${bot.WA_CHANNEL}
╰⦁⦂⦁*━┉━┉━┉━┉━┉━┉━⦁⦂⦁

*${bot.COPYRIGHT}*
`
await conn.sendMessage(from,{image:{url: bot.ALIVE_IMG},caption:dec},{quoted:mek});
console.log(`♻ Repo Command Used : ${from}`);

}catch(e){
    console.log(e)
    reply(`${e}`)
    }
})
//===========================================Setting===============================================
/*cmd({
    pattern: "settings",
    alias: ["setting","s"],
    desc: "Check bot online or not.",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return;


        let work;
        switch (config.MODE) {
            case 'public':
                work = '𝙿𝚄𝙱𝙻𝙸𝙲🌎';
                break;
            case 'private':
                work = '𝙿𝚁𝙸𝚅𝙰𝚃𝙴👤';
                break;
            case 'groups':
                work = '𝙶𝚁𝙾𝚄𝙿 𝙾𝙽𝙻𝚈👥';
                break;
            case 'inbox':
                work = '𝙸𝙽𝙱𝙾𝚇 𝙾𝙽𝙻𝚈🫂';
                break;
            default:
                work = '𝚄𝙽𝙺𝙾𝚆𝙽🛑';
        }

        let autoStatus = config.AUTO_READ_STATUS === 'true' ? '♻️ 𝙾𝙽' : '🚫 𝙾𝙵𝙵';
        let autoreact = config.AUTO_REACT === 'true' ? '♻️ 𝙾𝙽' : '🚫 𝙾𝙵𝙵';

        const vv = await conn.sendMessage(from, {
            image: { url:bot.ALIVE_IMG},
            caption: `> Sp-MD Settings\n
┏━━━━━━━━━━━━━━━━━━┓
┃╭┈────────━━━━───╮
┣┣Work Mode : *${work}*
┣┣Auto Status : *${autoStatus}*
┣┣Auto React : *${autoreact}*
┃┗━━━━━━━━━━━━━━━┛
┗━━━━━━━━━━━━━━━━━━┛
> 🔗𝘾𝙐𝙎𝙏𝙊𝙈𝙄𝙕𝙀  𝙎𝙀𝙏𝙏𝙄𝙉𝙂𝗦🔗⤵️

┏━━━━━━━━━━━━━━━━━━┓
┃╭┈────────━━━━───╮

*_WORK TYPE_⤵️*
┣┣1.1 PUBLIC WORK
┣┣1.2 PRIVATE WORK
┣┣1.3 GROUP ONLY
┣┣1.4 INBOX ONLY

*_AUTO STATUS SEEN_⤵️*
┣┣3.1 AUTO READ STATUS ON
┣┣3.2 AUTO READ STATUS OFF

*_AUTO REACT_⤵️*
┣┣4.1 AUTO REACT ON
┣┣4.2 AUTO REACT OFF

*_AUTO_TYPING_⤵️*
┣┣6.1 AUTO_TYPING ON
┣┣5.2 AUTO_TYPING OFF

*_AUTO BIO_⤵️*
┣┣6 AUTO BIO ON/OFF

*_24/7 News Service_⤵️*
┣┣7 Activate News Service
┃┗━━━━━━━━━━━━━━━┛
┗━━━━━━━━━━━━━━━━━━┛`
        }, { quoted: mek });
        console.log(`♻ Setting Command Used : ${from}`);
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1.1':
                        if (!isOwner) return;
                        reply('.update MODE:public');
                        reply('.restart');
                        break;
                    case '1.2':
                        if (!isOwner) return;
                        reply('.update MODE:private');
                        reply('.restart');
                        break;
                    case '1.3':
                        if (!isOwner) return;
                        reply('.update MODE:groups');
                        reply('.restart');
                        break;
                    case '1.4':
                        if (!isOwner) return;
                        reply('.update MODE:inbox');
                        reply('.restart');
                        break;
                    case '2.1':
                        if (!isOwner) return;
                        reply('.update AUTO_VOICE:true');
                        break;
                    case '2.2':
                        if (!isOwner) return;
                        reply('.update AUTO_VOICE:false');
                        break;
                    case '3.1':
                        if (!isOwner) return;
                        reply('.update AUTO_READ_STATUS:true');
                        break;
                    case '3.2':
                        if (!isOwner) return;
                        reply('.update AUTO_READ_STATUS:false');
                        break;
                    case '4.1':
                        if (!isOwner) return;
                        reply('.update AUTO_REACT:true');
                        reply('.restart');
                        break;
                    case '4.2':
                        if (!isOwner) return;
                        reply('.update AUTO_REACT:false');
                        reply('.restart');
                        break;
                    case '5.1':
                        if (!isOwner) return;
                        reply('.update AUTO_TYPING:true');
                        break;
                    case '5.2':
                        if (!isOwner) return;
                        reply('.update AUTO_TYPING:false');
                        break;
                    case '6':
                        if (!isOwner) return;
                        reply('.setautobio');
                        break;    
                    case '7':
                        if (!isOwner) return;
                        reply('.sprikynews');
                        break;    
                        sprikynes
                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });
    
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});*/
//=================================================System===============================================
cmd({
    pattern: "system",
    react: "♠️",
    alias: ["uptime","status","runtime"],
    desc: "cheack uptime",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let status = `
◈ *𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍*


*⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁
┃
┃ ⏰  *Runtime :-* ${runtime(process.uptime())}
┃
┃ 📟 *Ram usage :-* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃
┃⚙ *Platform :-* ${os.hostname()}
┃
┃ 👨‍💻  *Owners :-* KE4N_X
┃
┃ 🧬 *Version :-* ${bot.VERSION}
┃
*⦁⦂⦁*━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

*${bot.COPYRIGHT}*`
await conn.sendMessage(from,{image:{url:bot.ALIVE_IMG},caption:`${status}`},{quoted:mek})
console.log(`♻ System Command Used : ${from}`);
}catch(e){
console.log(e)
reply(`${e}`)
}
})
