import axios from 'axios';

const headers = {
  'authority': 'music.yt2api.com',
  'accept': 'application/json',
  'content-type': 'application/json',
  'origin': 'https://freemp3music.org',
  'referer': 'https://freemp3music.org/',
  'user-agent': 'Postify/1.0.0'
};

const yt2api = {
  async request(url, data) {
    return axios.post(url, data, { headers });
  },

  async search(query) {
    try {
      const response = await this.request('https://backlol.yt2api.com/api/search', { term: query });

      const { nextPageToken, results } = response.data;
      const toResult = results.map(({ videoId, title, thumbnail, publishedAt, duration, viewCount, shortViewCount, channelName, channelId }) => ({
        videoId, title, thumbnail, publishedAt, duration, viewCount, shortViewCount, channelName, channelId
      }));

      return { nextPageToken, results: toResult };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async extractor(format, videoUrl, quality) {
    try {
      const response = await this.request('https://music.yt2api.com/api/json', { ftype: format, url: videoUrl });

      const { extractor, videoId, title, lengthSeconds, tasks } = response.data;
      const validTask = tasks.find(task => task[quality.name] === quality.value);

      if (!quality.value || !validTask) {
        console.error(`❌ Error: ${quality.name} ${quality.value} tidak tersedia.`);
        return;
      }

      return { extractor, videoId, title, lengthSeconds, hash: validTask.hash };
    } catch (error) {
      console.error(`Pengekstrakan data format ${format} gagal diproses: `, error);
      throw error;
    }
  },

  async get_task(hash) {
    return this.request('https://music.yt2api.com/api/json', { hash }).then(response => response.data);
  },

  async progress_task(taskId) {
    return this.request('https://music.yt2api.com/api/json/task', { taskId }).then(response => response.data);
  },

  async checkProgress(hash) {
    try {
      let taskData = await this.get_task(hash);
      let taskId = taskData.taskId;

      return new Promise((resolve) => {
        const checkInterval = setInterval(async () => {
          const progressData = await this.progress_task(taskId);
          console.clear();
          console.log(`> Judul: ${progressData.title}.${progressData.ext}`);
          console.log(`> Kualitas: ${progressData.quality}`);
          console.log(`> Task ID: ${progressData.taskId} ~ ${progressData.status}`);
          console.log(`> Download Progress: ${this.createProgressBar(progressData.download_progress)} ${progressData.download_progress}%`);
          console.log(`> Convert Progress: ${this.createProgressBar(progressData.convert_progress)} ${progressData.convert_progress}%`);

          if (progressData.status === 'finished') {
            clearInterval(checkInterval);
            console.log('Final Data:', progressData);
            resolve(progressData);
          } else if (progressData.status === 'failed') {
            console.log('Status Tasking *Gagal* , memulai ulang task progress...');
            const newTaskData = await this.get_task(hash);
            taskId = newTaskData.taskId;
          }
        }, 2000);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createProgressBar(percentage) {
    const tobrut = 10;
    const filbrut = Math.round((percentage / 100) * tobrut);
    return '●'.repeat(filbrut) + '○'.repeat(tobrut - filbrut) + '⦿';
  }
};

export { yt2api };