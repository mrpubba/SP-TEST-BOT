const { cmd } = require('../lib/command');
const bot = require('../lib/bot')
//===========================Get PP========================================
cmd({
  pattern: "getpp",
  desc: "Download the profile picture of the user you're chatting with",
  category: "tools",
  react: "🖼️",
  filename: __filename
}, async (conn, msg, m, { reply, from }) => {
  try {
    const target = msg.key.remoteJid; // <-- get the inbox owner (group/member/inbox)

    // If it's a group, do nothing or skip
    if (target.endsWith("@g.us")) {
      return reply("❌ This command only works in personal chats.");
    }

    let profilePicUrl;
    try {
      profilePicUrl = await conn.profilePictureUrl(target, "image");
    } catch (e) {
      profilePicUrl = "https://i.ibb.co/tmD1Hqr/no-profile-picture.png"; // fallback
    }

    const caption = `*Profile Picture of Chat Owner!*\n\n> ${bot.COPYRIGHT}`;

    await conn.sendMessage(from, {
      image: { url: profilePicUrl },
      caption
    }, { quoted: msg });

    await conn.sendMessage(from, {
      react: { text: "✅", key: msg.key }
    });

  } catch (e) {
    console.log(e);
    reply("❌ Couldn't fetch the profile picture.");
  }
});
// 2. Broadcast Message to All Groups
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, isCreator, reply }) => {
    if (!isOwner && !isCreator) return reply("❌ You are not the owner!");
    if (args.length === 0) return reply("📢 Please provide a message to broadcast.");
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
    }
    reply("📢 Message broadcasted to all groups.");
});
// 3. Set Profile Picture
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isCreator, quoted, reply }) => {
    if (!isOwner && !isCreator) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message) 
    return reply("❌ Please reply to an image.");
    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });
        reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});
// 4. Block User
cmd({
    pattern: "block",
    desc: "Block a user.",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isCreator, quoted, reply }) => {
    if (!isOwner && !isCreator) return reply("❌ You are not the owner!");
    if (!quoted) return reply("❌ Please reply to the user you want to block.");
    const user = quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'block');
        reply(`🚫 User ${user} blocked successfully.`);
    } catch (error) {
        reply(`❌ Error blocking user: ${error.message}`);
    }
});
// 5. Unblock User
cmd({
    pattern: "unblock",
    desc: "Unblock a user.",
    category: "owner",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, isCreator, reply }) => {
    if (!isOwner && !isCreator) return reply("❌ You are not the owner!");
    if (!quoted) return reply("❌ Please reply to the user you want to unblock.");
    const user = quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'unblock');
        reply(`✅ User ${user} unblocked successfully.`);
    } catch (error) {
        reply(`❌ Error unblocking user: ${error.message}`);
    }
});
// 6. Clear All Chats
cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isCreator, reply }) => {
    if (!isOwner && !isCreator) return reply("❌ You are not the owner!");
    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        reply("🧹 All chats cleared successfully!");
    } catch (error) {
        reply(`❌ Error clearing chats: ${error.message}`);
    }
});
//======================JID================================
cmd({
    pattern: "jid",
    desc: "get jids",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

let jid = from
        
 await conn.sendMessage(from,{text: jid },{quoted:mek})
      
}catch(e){
console.log(e)
reply(`${e}`)

}
})
// 8. Group JIDs List
cmd({
    pattern: "gjid",
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isCreator, reply }) => {
    if (!isOwner && !isCreator) return reply("❌ You are not the owner!");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Group JIDs:*\n\n${groupJids}`);
});
//===========================================Join===========================================
cmd({ 
           pattern: "join",
            desc: "joins group by link",
            category: "owner",
            use: '<group link.>',
        },
    async(conn, mek, m,{q, isMe, isOwner, isCreator, reply}) => {
    if(!isOwner && !isCreator && !isMe)return reply("❌ You are not the owner!");
    try{  if (!q) return reply(`Please give me Query`);
            if (!q.split(" ")[0] && !q.split(" ")[0].includes("whatsapp.com"))
               reply("Link Invalid, Please Send a valid whatsapp Group Link!");
            let result = q.split(" ")[0].split("https://chat.whatsapp.com/")[1];
            await conn.groupAcceptInvite(result)
                .then((res) => reply("You Are Joined Group"))
                .catch((err) => reply("Error in Joining Group"));
} catch (e) {
reply('*Error !!*')
l(e)
}
})
//-----------------------------------------------Leave Group-----------------------------------------------

cmd({
    pattern: "leavegc",
    desc: "Make the bot leave the group.",
    category: "owner",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner, isCreator }) => {
    try {
        if(!isOwner && !isCreator) return reply("❌ You are not the owner!");//check owner
        await conn.groupLeave(from);
        return await conn.sendMessage(from, { text: "Bot has left the group." }, { quoted: mek });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply(`Error: ${e.message}`);
    }
});
//-----------------------------------------------Set Bio Of Bot-----------------------------------------------

cmd({
    pattern: "setbio",
    desc: "Set bot's profile bio.",
    react: "👤",
    use: '.setbio <New Bio>',
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, args, reply , isOwner, isCreator }) => {
    try {
        if (!isOwner && !isCreator) return reply('You are not authorized to use this command.');
        if (args.length === 0) return reply('Please provide a bio text.');
        const bio = args.join(' ');
        await conn.updateProfileStatus(bio);
        return await reply('Profile bio updated successfully.');
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        return reply(`Error: ${e.message}`);
    }
});
