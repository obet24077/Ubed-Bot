import axios from 'axios';

const modelList = [
  "yanzgpt-revolution-25b-v3.0", // Default
  "yanzgpt-legacy-72b-v3.0"      // Pro
];

export async function generate(query, model = modelList[0]) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url: "https://yanzgpt.my.id/chat",
        data: {
          query: query,
          model: model
        },
        headers: {
          "authorization": "Bearer yzgpt-sc4tlKsMRdNMecNy",
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};