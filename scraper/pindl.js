import axios from "axios";
import * as cheerio from "cheerio";

const pindl = {
   video: async (url) => {
      try {
         let { data: a } = await axios.get(url);
         let $ = cheerio.load(a);

         const mediaDataScript = $('script[data-test-id="video-snippet"]');

         if (mediaDataScript.length) {
            const mediaData = JSON.parse(mediaDataScript.html());

            if (mediaData["@type"] === "VideoObject" && mediaData.contentUrl && mediaData.contentUrl.endsWith(".mp4")) {
               const videoInfo = {
                  type: "video",
                  name: mediaData.name,
                  description: mediaData.description,
                  contentUrl: mediaData.contentUrl,
                  thumbnailUrl: mediaData.thumbnailUrl,
                  uploadDate: mediaData.uploadDate,
                  duration: mediaData.duration,
                  commentCount: mediaData.commentCount,
                  likeCount: mediaData.interactionStatistic?.find(stat => stat.InteractionType["@type"] === "https://schema.org/LikeAction")?.InteractionCount,
                  watchCount: mediaData.interactionStatistic?.find(stat => stat.InteractionType["@type"] === "https://schema.org/WatchAction")?.InteractionCount,
                  creator: mediaData.creator?.name,
                  creatorUrl: mediaData.creator?.url,
                  keywords: mediaData.keywords
               };

               return videoInfo;
            }
         }

         return null;
      } catch (error) {
         return { error: "Error fetching video data" };
      }
   },

   image: async (url) => {
      try {
         let { data: a } = await axios.get(url);
         let $ = cheerio.load(a);

         const mediaDataScript = $('script[data-test-id="leaf-snippet"]');

         if (mediaDataScript.length) {
            const mediaData = JSON.parse(mediaDataScript.html());

            if (mediaData["@type"] === "SocialMediaPosting" && mediaData.image && 
               (mediaData.image.endsWith(".png") || mediaData.image.endsWith(".jpg") || mediaData.image.endsWith(".jpeg") || mediaData.image.endsWith(".webp")) && 
               !mediaData.image.endsWith(".gif")) {
               
               const imageInfo = {
                  type: "image",
                  author: mediaData.author?.name,
                  authorUrl: mediaData.author?.url,
                  headline: mediaData.headline,
                  articleBody: mediaData.articleBody,
                  image: mediaData.image,
                  datePublished: mediaData.datePublished,
                  sharedContentUrl: mediaData.sharedContent?.url,
                  isRelatedTo: mediaData.isRelatedTo,
                  mainEntityOfPage: mediaData.mainEntityOfPage?.["@id"]
               };

               return imageInfo;
            }
         }

         return null;
      } catch (error) {
         return { error: "Error fetching image data" };
      }
   },

   gif: async (url) => {
      try {
         let { data: a } = await axios.get(url);
         let $ = cheerio.load(a);

         const mediaDataScript = $('script[data-test-id="leaf-snippet"]');

         if (mediaDataScript.length) {
            const mediaData = JSON.parse(mediaDataScript.html());

            if (mediaData["@type"] === "SocialMediaPosting" && mediaData.image && mediaData.image.endsWith(".gif")) {
               const gifInfo = {
                  type: "gif",
                  author: mediaData.author?.name,
                  authorUrl: mediaData.author?.url,
                  headline: mediaData.headline,
                  articleBody: mediaData.articleBody,
                  gif: mediaData.image,
                  datePublished: mediaData.datePublished,
                  sharedContentUrl: mediaData.sharedContent?.url,
                  isRelatedTo: mediaData.isRelatedTo,
                  mainEntityOfPage: mediaData.mainEntityOfPage?.["@id"]
               };

               return gifInfo;
            }
         }

         return null;
      } catch (error) {
         return { error: "Error fetching gif data" };
      }
   },

   donlod: async (urlPin) => {
      let result = await pindl.video(urlPin);
      if (result) return result;

      result = await pindl.image(urlPin);
      if (result) return result;

      result = await pindl.gif(urlPin);
      return result || { error: "No media found" };
   }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default pindl;