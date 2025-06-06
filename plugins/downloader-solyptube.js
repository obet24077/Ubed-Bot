import { exec } from "child_process"

let handler = async (m, { conn, args }) => {
  try {
    const text = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null
    if (!text) return m.reply(`Linknya mana?`)
    await m.reply("Tunggu sebentar...")

    const [ytUrl, qualityLabel] = text.split(" ")
    const isYouTubeUrl = /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/)(([\w-]{11}))[\?&#]?\S*$/
    
    if (!isYouTubeUrl.test(ytUrl)) return await m.reply("Link tidak valid")

    const videoId = ytUrl.match(isYouTubeUrl)?.[2]
    if (!videoId) return await m.reply("Gagal mendapatkan ID video")

    const Solyptube = async (id, format = "360p") => {
      const curlCommand = `curl 'https://solyptube.com/api/v1.1/findvideo' \
      -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
      -H 'Accept: application/json, text/javascript, */*; q=0.01' \
      -H 'X-Requested-With: XMLHttpRequest' \
      -H 'User-Agent: Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36' \
      -H 'Referer: https://solyptube.com/?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D${id}#searchrResult' \
      --data-raw 'url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3D${id}' \
      --compressed`
      
      return new Promise((resolve, reject) => {
        exec(curlCommand, (error, stdout) => {
          if (error) return reject(error)

          try {
            const selected = JSON.parse(stdout)
            const formatData = selected?.data?.formats?.find(v => v?.format_note === format) || selected?.data?.formats?.[0] || {}
            resolve({
              title: selected?.data?.title ?? "Unknown Title",
              ...formatData
            })
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    const results = await Solyptube(videoId, qualityLabel || "360p")
    if (!results) return m.reply("Gagal mendapatkan informasi video")

    const isMP3 = results.vcodec === "none"
    const additionalInfo = `
*Title*: ${results.title || "Unknown"}
*Filesize*: ${(results.filesize / 1024 / 1024).toFixed(2)} MB
*Resolution*: ${results.resolution || "Unknown"}
*Format Note*: ${results.format_note || "Unknown"}
*FPS*: ${results.fps || "Unknown"} FPS
*Aspect Ratio*: ${results.aspect_ratio || "Unknown"}
*Vcodec*: ${results.vcodec || "Unknown"}
*Acodec*: ${results.acodec || "Unknown"}
*Container*: ${results.container || "Unknown"}
    `.trim()

    await conn.sendMessage(m.chat, {
      [isMP3 ? "audio" : "video"]: { url: results.url },
      mimetype: isMP3 ? "audio/mpeg" : "video/mp4",
      caption: additionalInfo
    }, { quoted: m })

  } catch (e) {
    throw e
  }
}

handler.help = ["solyptube"].map(v => `${v} <url> [kualitas]`)
handler.tags = ["downloader"]
handler.command = /^(solyptube)$/i
handler.exp = 0

export default handler