import axios from 'axios';
import https from 'https';

class IsouChat {
    constructor() {
        this.url = 'https://isou.chat/api/search';
        this.headers = {
            'Accept': 'text/event-stream',
            'Accept-Language': 'en-GB,en;q=0.9,id-MM;q=0.8,ms-MM;q=0.7,ms;q=0.6,id;q=0.5,es-GB;q=0.4,es;q=0.3,fil-PH;q=0.2,fil;q=0.1',
            'Content-Type': 'application/json',
            'Origin': 'https://isou.chat',
            'User-Agent': 'Postify/1.0.0',
            'x-forwarded-for': Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.'),
        };

        this.answerParts = []; 
    }

    async request(query, model = "gpt-4o-mini", mode = "simple", categories = ["general"], engine = "SEARXNG", locally = false, reload = false) {
        if (!["simple", "deep"].includes(mode)) {
            console.log("Modenya gak ada. cuman ada 'simple' ama 'deep' doang");
            return;
        }

        if (!["general", "science"].includes(categories[0])) {
             console.log("Kategorinya gak ada. cuman ada 'general' ama 'science' doang");
            return;
        }

        const vm = [
            "gpt-4o-mini", 
            "gpt-4o", 
            "gpt-3.5-turbo", 
            "yi-34b-chat-0205", 
            "deepseek-chat", 
            "deepseek-coder"
        ];
        if (!vm.includes(model)) {
          console.log("Modelnya gak ada. Pilih salah satu dari list ini: " + vm.join(", "));
            return;
        }

        const data = {
            stream: true,
            model: model,
            mode: mode,
            language: "all",
            categories: categories,
            engine: engine,
            locally: locally,
            reload: reload
        };

        const referer = `https://isou.chat/search?q=${encodeURIComponent(query)}`;
        this.headers.Referer = referer;

        const agent = new https.Agent({  
            rejectUnauthorized: false 
        });

        try {
            const api = `${this.url}?q=${encodeURIComponent(query)}`;
            const response = await axios.post(api, data, { headers: this.headers, httpsAgent: agent });
            
            const summary = this.pr(response.data);
            return summary;
        } catch (error) {
            console.log(error.message || error);
            throw error; 
        }
    }

    pr(rs) {
        const responses = rs.split('\n').filter(line => line.startsWith('data:'));
        
        const summary = [];
        responses.forEach(item => {
            const jx = item.replace('data:', '').trim();
            if (jx) {
                try {
                    const pe = JSON.parse(jx);
                    if (pe.data) {
                        const ide = JSON.parse(pe.data);
                        if (ide.answer !== undefined) {
                            if (ide.answer !== null) {
                                this.answerParts.push(ide.answer);
                            } else {
                                if (this.answerParts.length > 0) {
                                    const fans = this.answerParts.join('');
                                    summary.push({
                                        type: 'answer',
                                        answer: fans,
                                    });
                                    this.answerParts = [];
                                }
                            }
                        }

                        if (ide.image) {
                            summary.push({
                                type: 'image',
                                id: ide.image.id,
                                name: ide.image.name,
                                link: ide.image.url,
                                source: ide.image.source,
                                img: ide.image.img,
                                thumbnail: ide.image.thumbnail,
                                snippet: ide.image.snippet || null,
                                engine: ide.image.engine || null
                            });
                        }

                        if (ide.context) {
                            summary.push({
                                type: 'context',
                                id: ide.context.id,
                                name: ide.context.name,
                                link: ide.context.url,
                                snippet: ide.context.snippet,
                                engine: ide.context.engine
                            });
                        }
                    }

                } catch (e) {
                    console.log(e.message || e);
                }
            }
        });

        return summary; 
    }
}

export { IsouChat };