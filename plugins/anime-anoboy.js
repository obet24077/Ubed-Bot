// Bot handler file
import { searchAnime, getAnimeDetail } from '../scraper/anoboy.js';

const handler = async (m, { text, conn }) => {
  const query = text.trim();
  if (!query) {
    return m.reply('Masukkan nama anime yang ingin dicari.');
  }

  await conn.sendMessage(m.chat, { react: { text: '🫑', key: m.key } });

  // Search for anime
  const searchResults = await searchAnime(query);
  if (searchResults.length === 0) {
    return m.reply('Tidak ditemukan anime dengan nama tersebut.');
  }

  // Create a message with the search results
  let message = 'Hasil pencarian:\n';
  searchResults.forEach((anime, index) => {
    message += `${index + 1}. ${anime.title}\nStatus: ${anime.status}\nLink: ${anime.url}\n\n`;
  });

  await m.reply(message);

  // Get and display detailed information of the first anime in the results
  const firstAnime = searchResults[0];
  const animeDetail = await getAnimeDetail(firstAnime.url);
  let detailMessage = `**${animeDetail.title}**\nRating: ${animeDetail.rate}\n\nSynopsis: ${animeDetail.info.synopsis}\n\nTrailer: ${animeDetail.trailer}\n\nEpisodes:\n`;

  animeDetail.episode.forEach(ep => {
    detailMessage += `- ${ep.title} (Released: ${ep.release})\nLink: ${ep.url}\n`;
  });

  await m.reply(detailMessage);
};

// Register command details for the bot
handler.command = ['anoboy'];
handler.help = ['anoboy'];
handler.tags = ['anime'];
handler.limit = 1;
handler.register = true;

export default handler;