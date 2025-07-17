module.exports = {
  name: "ping",
  command: ["ping"],
  handler: async (conn, m, args, number) => {
    const start = Date.now();

    // Send a typing indicator (optional)
    await conn.sendPresenceUpdate('composing', m.key.remoteJid);

    // Send message and measure response time
    const msg = await conn.sendMessage(m.key.remoteJid, {
      text: "🏓 Pinging..."
    });

    const latency = Date.now() - start;

    // Edit message to show speed
    await conn.sendMessage(m.key.remoteJid, {
      text: `🏓 Pong! Speed: ${latency}ms`,
      edit: msg.key
    });
  }
};
