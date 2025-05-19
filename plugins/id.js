const handler = async (m, { text, conn }) => {
  try {
    if (!text) return m.reply("Masukkan link grup atau saluran WhatsApp!")

    const hiasan = "✨═━═━═━═━═━═━═━═━═━═✨\n";
    const garis = "➖️➖️➖️➖️➖️➖️➖️➖️➖️➖️\n";

    if (text.includes("https://chat.whatsapp.com/")) {
      let inviteCode = text.split("https://chat.whatsapp.com/")[1];
      let res = await conn.groupGetInviteInfo(inviteCode);
      let teks = `${hiasan}ℹ️ *Group Information* ℹ️\n${garis}🆔 ID: ${res.id}\n📝 Nama: ${res.subject}\n🍏 Admin: ${res.participants.filter(p => p.admin).length}\n🌷 Total Member: ${res.participants.length}\n🔒 Privasi: ${res.announce ? "Tertutup" : "Terbuka"}\n${garis}© Ubed Bot`;

      let interactiveMessage = {
        interactiveMessage: {
          body: { text: teks },
          footer: { text: "© Ubed Bot" },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin ID",
                  copy_code: res.id
                })
              }
            ]
          }
        }
      };

      await conn.relayMessage(
        m.chat,
        { viewOnceMessage: { message: interactiveMessage } },
        {}
      );

    } else if (text.includes("https://whatsapp.com/channel/")) {
      let channelId = text.split("https://whatsapp.com/channel/")[1];
      let res = await conn.newsletterMetadata("invite", channelId);
      let teks = `${hiasan}ℹ️ *Channel information* ℹ️\n${garis} 🆔: ${res.id}\n📝 Nama: ${res.name}\n👥 Pengikut: ${res.subscribers}\n📌 Status: ${res.state}\n✔️ Verifikasi: ${res.verification === "VERIFIED" ? "Terverifikasi" : "Tidak"}\n${garis}© Ubed Bot`;

      let interactiveMessage = {
        interactiveMessage: {
          body: { text: teks },
          footer: { text: "© Ubed Bot" },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin ID",
                  copy_code: res.id
                })
              }
            ]
          }
        }
      };

      await conn.relayMessage(
        m.chat,
        { viewOnceMessage: { message: interactiveMessage } },
        {}
      );

    } else {
      return m.reply("Format link tidak valid! Masukkan link grup atau saluran WhatsApp.");
    }

  } catch (err) {
    console.error(err);
    return m.reply("Terjadi kesalahan saat mengambil data!");
  }
};

handler.help = ["cekid"];
handler.tags = ["tool"];
handler.command = /^(cekid|id)$/i;
handler.register = true;

export default handler;