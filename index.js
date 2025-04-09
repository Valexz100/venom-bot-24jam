const { create, Client } = require('venom-bot');
const express = require('express');
const app = express();

let lastOnline = new Date();
let isOwnerOnline = true;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});
app.listen(3000, () => console.log("Keep-alive running..."));

create().then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    const now = new Date();
    const offlineDuration = Math.floor((now - lastOnline) / (1000 * 60));

    if (message.isGroupMsg === false) {
      if (isOwnerOnline) {
        if (message.body.toLowerCase() === "menu") {
          client.sendText(message.from, "👋 Hai! Owner sedang *ONLINE*. Berikut menu:\n\n1. Buat Stiker (kirim gambar)\n2. Info\n\nKetik sesuai pilihan.");
        }
      } else {
        if (offlineDuration >= 60) {
          client.sendText(message.from, "📨 Pesan kamu sudah terkirim. Owner sedang *OFFLINE*. Akan dibalas saat online.");
        }
      }
    }

    if (message.mimetype && message.type === 'image') {
      const buffer = await client.decryptFile(message);
      await client.sendImageAsSticker(message.from, buffer, { author: "VenomBot", pack: "WA Bot" });
    }
  });

  client.onAnyMessage((msg) => {
    if (msg.body.toLowerCase() === "!online") {
      isOwnerOnline = true;
      lastOnline = new Date();
      client.sendText(msg.from, "✅ Status owner: ONLINE");
    }
    if (msg.body.toLowerCase() === "!offline") {
      isOwnerOnline = false;
      client.sendText(msg.from, "❌ Status owner: OFFLINE");
    }
  });
}
