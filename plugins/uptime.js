import { Client } from 'ssh2';

const checkVpsUptime = (username, ip, password) => {
  return new Promise((resolve, reject) => {
    const client = new Client();
    
    client.on('ready', () => {
      console.log('SSH Connection established.');
      client.exec('uptime -p', (err, stream) => {
        if (err) {
          reject(`Error executing uptime: ${err}`);
          return;
        }

        let uptimeData = '';
        stream.on('data', (data) => {
          uptimeData += data.toString();
        });

        stream.on('close', (code, signal) => {
          if (code === 0) {
            resolve(`VPS Uptime: ${uptimeData}`);
          } else {
            reject(`Error: Process closed with code ${code}`);
          }
          client.end();
        });
      });
    }).connect({
      host: ip,
      port: 22,
      username: username,
      password: password
    });
  });
};

// Function to handle uptime check
export const handleUptimeCheck = async (username, ip, password) => {
  try {
    const uptime = await checkVpsUptime(username, ip, password);
    return uptime;
  } catch (error) {
    return `Error: ${error}`;
  }
};

// Handler configuration
handler.help = ['uptime'];
handler.tags = ['info', 'vps'];
handler.command = ["uptime"];  // Perintah yang memicu bot ini
handler.owner = true;  // Hanya bisa digunakan oleh owner bot

handler.process = async (m, { text, conn }) => {
  const [username, ip, password] = text.split(" ");

  if (!username || !ip || !password) {
    return conn.reply(m.chat, 'Penggunaan yang benar: .uptime <username> <IP> <password>', m);
  }

  const result = await handleUptimeCheck(username, ip, password);
  conn.reply(m.chat, result, m);
};

export default handler;