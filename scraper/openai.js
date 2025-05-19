import axios from 'axios';

const headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Linux; Android 12; Infinix HOT 40 Pro Build/SKQ1.210929.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36",
  "Accept": "application/json",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
  "Connection": "keep-alive",
  "Host": "bagoodex.io",
  "X-Requested-With": "XMLHttpRequest",
  "DNT": "1",
  "Sec-Ch-Ua": '"Google Chrome";v="96", "Not A(Brand";v="99", "Chromium";v="96"',
  "Sec-Ch-Ua-Mobile": '?1',
  "Sec-Ch-Ua-Platform": '"Android"',
  "Referer": "https://bagoodex.io/",
  "Origin": "https://bagoodex.io",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache"
};

export const getChatResponse = async (session, userMessage) => {
  try {
    const response = await axios.post('https://bagoodex.io/front-api/chat', {
      prompt: session.messages[0].content,
      messages: [{ role: "user", content: userMessage }],
      input: userMessage
    }, { headers });

    return response.data;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw new Error('Failed to fetch data from the API');
  }
};