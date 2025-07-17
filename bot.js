
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const path = require("path");
const P = require("pino");
const { File } = require("megajs");
const bots = require("./bots.json");
const bot = require('./lib/bot')
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require("axios"); // Required for sendFileUrl
const { sendTranslations } = require('./lib/status');
const ownerNumber = ["94776290170"]; // ✅ Dummy owner numbers

const getBuffer = async (url) => (await axios.get(url, { responseType: "arraybuffer" })).data;
const getGroupAdmins = (participants) => participants.filter(p => p.admin).map(p => p.id);

// Load plugins from global folder
const pluginFolder = path.join(__dirname, "plugins");
const plugins = [];
global.plugins = plugins;

fs.readdirSync(pluginFolder).forEach(file => {
  if (file.endsWith(".js")) {
    const plugin = require(path.join(pluginFolder, file));
    plugins.push(plugin);
  }
});

async function downloadCredsFromMega(fileIdWithKey, savePath) {
  const fullUrl = `https://mega.nz/file/${fileIdWithKey}`;
  return new Promise((resolve, reject) => {
    const file = File.fromURL(fullUrl);
    file.loadAttributes((err) => {
      if (err) return reject(err);
      file.download()
        .pipe(fs.createWriteStream(savePath))
        .on("finish", resolve)
        .on("error", reject);
    });
  });
}

async function startAllBots() {
  for (const set of bots) {
    const number = set.number;
    const megaId = set.session;
    const folderPath = path.join(__dirname, "bots", number);
    const credsPath = path.join(folderPath, "creds.json");
 
    const setting = set;

    console.log(`🛠 Loaded settings for ${number}`);
    const prefix = setting.prefix;

    try {
      await fs.ensureDir(folderPath);

      // 1. Download creds.json if missing (wait for it)
      if (!fs.existsSync(credsPath)) {
        if (!megaId || !megaId.includes("#")) {
          console.log(`❌ Invalid MEGA format for ${number}`);
          continue;
        }

        console.log(`⬇️ Downloading creds for ${number}...`);
        await downloadCredsFromMega(megaId, credsPath);

        // ✅ Wait until file is fully written and exists
        let waitCount = 0;
        while (!fs.existsSync(credsPath) && waitCount < 10) {
          await new Promise(res => setTimeout(res, 500));
          waitCount++;
        }

        if (!fs.existsSync(credsPath)) {
          console.log(`❌ Failed to verify creds.json for ${number}`);
          continue;
        }

        console.log(`✅ Session downloaded for ${number}`);
      }

      
//================Multi Sesion=======================================
const { state, saveCreds } = await useMultiFileAuthState(folderPath);      
const conn = makeWASocket({
  auth: state,      
  logger: P({ level: "silent" }),
  printQRInTerminal: false
});
//=================Save Creads=======================================
conn.ev.on('creds.update', saveCreds);
conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
//========================Auto Status Read===============================================
if (mek.key && mek.key.remoteJid === 'status@broadcast' && setting.statusView === true) {
  await conn.readMessages([mek.key]);
}
//=========================Auto Status React=====================
if (setting.statusReact === true) {
  if (!mek.message) return;
  mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
  if (mek.key && mek.key.remoteJid === 'status@broadcast') {
    let emoji = [`${setting.statusReactEmoji}`];
    let sigma = emoji[Math.floor(Math.random() * emoji.length)];
    await conn.readMessages([mek.key]);
    conn.sendMessage( 'status@broadcast', { react: { text: sigma, key: mek.key } }, { statusJidList: [mek.key.participant] } );
  }
}
mek.type = mek.message.imageMessage ? "imageMessage" : mek.message.videoMessage ? "videoMessage" : mek.message.audioMessage ? "audioMessage" : Object.keys(mek.message)[0];
mek.text = mek.type == "conversation" ? mek.message.conversation : "";
if (mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo) {
  const quotedMessage = mek.message.extendedTextMessage.contextInfo;
  const replyText = mek.message.extendedTextMessage.text?.trim().toLowerCase(); // Get the reply text
//============================Status Send===========================================================
if (sendTranslations.includes(replyText) && quotedMessage.participant && quotedMessage.participant.endsWith('@s.whatsapp.net')) {
  const senderJid = mek.key.remoteJid; // The user who replied
  const originalStatusJid = quotedMessage.participant; // The original status sender
  const originalMessageId = quotedMessage.stanzaId; // The original status message ID
  try {
    await conn.sendMessage(senderJid, {text: `${bot.ST_SAVE}`,}, { quoted: mek });// Then forward the quoted message back to the sender
    await conn.sendMessage(senderJid, {forward: {key: {remoteJid: "status@broadcast", fromMe: false, id: originalMessageId}, message: quotedMessage.quotedMessage}}, { quoted: mek });
    console.log(`♻ status Save from ${originalStatusJid} to ${senderJid}`);
  } catch (error) {
    console.error("Error forwarding quoted message:", error);
  }
}
}
//========================Auto Status Reply===============================================
if (mek.key && mek.key.remoteJid === 'status@broadcast' && setting.statusReply === true){
  const user = mek.key.participant
  const text = `${bot.AUTO_STATUS_MSG}`
  await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek })
}
//========================
const m = sms(conn, mek);
const type = getContentType(mek.message);
const content = JSON.stringify(mek.message);
const from = mek.key.remoteJid;
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const q = args.join(' ');
const isGroup = from.endsWith('@g.us');
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
const senderNumber = sender.split('@')[0];
const botNumber = conn.user.id.split(':')[0];
const pushname = mek.pushName || 'Unckon Number';
const isMe = botNumber.includes(senderNumber);
const isOwner = ownerNumber.includes(senderNumber) || isMe;
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
const groupName = isGroup ? groupMetadata.subject : '';
const participants = isGroup ? await groupMetadata.participants : '';
const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
const isReact = m.message.reactionMessage ? true : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek });
}
const isCreator = (senderNumber) => {
  const creatorNumber = '94701515609';
  return senderNumber === creatorNumber || isMe(senderNumber);
}
    
conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
  let mime = '';
  let res = await axios.head(url);
  mime = res.headers['content-type'];
  if (mime.split("/")[1] === "gif") {
    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
  }
  let type = mime.split("/")[0] + "Message";
  if (mime === "application/pdf") {
    return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
  }
  if (mime.split("/")[0] === "image") {
    return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
  }
  if (mime.split("/")[0] === "video") {
    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
  }
  if (mime.split("/")[0] === "audio") {
    return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
  }
}
//==============AutoReact==================== 
if (!isReact && senderNumber !== botNumber) {
  if (setting.autoReact === true) {
        const reactions = [`${setting.AutoReactEmoji}`]
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
  } 
}
//==============================//
if (isCmd && setting.readCmd === true) {
  await conn.readMessages([mek.key])  // Mark command as read
}
//================================WORK TYPE============================
if(!isOwner && isCreator && setting.mode === 'private') return 
if(!isOwner && isCreator && isGroup && setting.mode === 'inbox') return 
if(!isOwner && isCreator && !isGroup && setting.mode === 'groups') return 
//=====================================
if(senderNumber.includes("94776290170")){
  if(isReact) return
    m.react("👨‍💻")
}   
//========================Import Command================================
const events = require('./lib/command');
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
  const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
  if (cmd) {
    if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
    try {
      cmd.function(conn, mek, m, { from, setting, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
    } catch (e) {
      console.error("[PLUGIN ERROR] " + e);
    }
  }
}
events.commands.map(async(command) => {
  if (body && command.on === "body") {
    command.function(conn, mek, m, { from, setting, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
  } else if (mek.q && command.on === "text") {
    command.function(conn, mek, m, { from, setting, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
  } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
    command.function(conn, mek, m, { from, setting, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
  } else if (command.on === "sticker" && mek.type === "stickerMessage") {
    command.function(conn, mek, m, { from, setting, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
  }
});
});
//=================Plugins=====================
fs.readdirSync(pluginFolder).forEach(file => {
  if (file.endsWith(".js")) {
    try {
      const plugin = require(path.join(pluginFolder, file));
      plugins.push(plugin);
    } catch (err) {
      console.error(`❌ Failed to load plugin ${file}:`, err);
    }
  }
});
} catch (err) {
  console.error(`❌ Failed to start bot ${bot.number}:`, err);
}
}
}

startAllBots();
