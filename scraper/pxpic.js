import fs from "fs";
import axios from "axios";
import { fromBuffer } from "file-type";
import qs from "qs";
import path from "path";

const tools = ["removebg", "enhance", "upscale", "restore", "colorize"];

const pxpic = {
  upload: async (buffer) => {
    const { ext, mime } = (await fromBuffer(buffer)) || {};
    const fileName = `${Date.now()}.${ext}`;

    const folder = "uploads";
    const response = await axios.post(
      "https://pxpic.com/getSignedUrl",
      { folder, fileName },
      { headers: { "Content-Type": "application/json" } }
    );

    const { presignedUrl } = response.data;

    await axios.put(presignedUrl, buffer, { headers: { "Content-Type": mime } });

    const cdnDomain = "https://files.fotoenhancer.com/uploads/";
    const sourceFileUrl = `${cdnDomain}${fileName}`;

    return sourceFileUrl;
  },
  create: async (buffer, tool) => {
    if (!tools.includes(tool)) {
      return { error: `Pilih salah satu dari tools ini: ${tools.join(", ")}` };
    }

    const url = await pxpic.upload(buffer);
    const data = qs.stringify({
      imageUrl: url,
      targetFormat: "png",
      needCompress: "no",
      imageQuality: "100",
      compressLevel: "6",
      fileOriginalExtension: "png",
      aiFunction: tool,
      upscalingLevel: "",
    });

    const config = {
      method: "POST",
      url: "https://pxpic.com/callAiFunction",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    };

    const apiResponse = await axios.request(config);
    return apiResponse.data;
  },
};

export default pxpic;