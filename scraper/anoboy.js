// ../scraper/anoboy.js
import axios from 'axios';
import cheerio from 'cheerio';

// Function to search for anime on Anoboy
export async function searchAnime(query) {
  let { data } = await axios.get(`https://anoboy.li/?s=${query}`);
  let $ = cheerio.load(data);
  let results = [];

  $(".bs").each((i, a) => {
    results.push({
      title: $(a).find(".tt").text().trim().split("\t")[0],
      status: $(a).find(".epx").text(),
      image: $(a).find('img').attr("src"),
      url: $(a).find("a").attr("href")
    });
  });
  return results;
}

// Function to get detailed information of a specific anime
export async function getAnimeDetail(url) {
  let { data } = await axios.get(url);
  let $ = cheerio.load(data);
  let result = {};

  $('.postbody').each((e, i) => {
    result.title = $(i).find('img').attr('title');
    result.thumb = $(i).find('img').attr('src');
    result.rate = $(i).find('strong').text().replace('Rating ', '');
    result.trailer = $(i).find('a').attr('href');
    result.alter_title = $(i).find('.alter').text();
    result.info = {
      status: $('.spe').find('span:contains("Status")').text().replace('Status:', '').trim(),
      studio: $('.spe').find('span:contains("Studio")').find('a').text().trim(),
      duration: $('.spe').find('span:contains("Duration")').text().replace('Duration:', '').trim(),
      season: $('.spe').find('span:contains("Season")').find('a').text().trim(),
      type: $('.spe').find('span:contains("Type")').text().replace('Type:', '').trim(),
      episode: $('.spe').find('span:contains("Episodes")').text().replace('Episodes:', '').trim(),
      censor: $('.spe').find('span:contains("Censor")').text().replace('Censor:', '').trim(),
      director: $('.spe').find('span:contains("Director")').find('a').text().trim(),
      producers: $('.spe').find('span:contains("Producers")').find('a').map((i, el) => $(el).text().trim()).get(),
      release: $('.spe').find('span:contains("Released on")').find('time').text().trim(),
      update: $('.spe').find('span:contains("Updated on")').find('time').text().trim(),
      synopsis: $('.entry-content').text().trim()
    };
    result.episode = [];
    $('.eplister').each((c, v) => {
      $(v).find("li").each((b, n) => {
        result.episode.push({
          title: $(n).find('.epl-title').text(),
          release: $(n).find('.epl-date').text(),
          url: $(n).find('a').attr("href")
        });
      });
    });
  });

  return result;
}