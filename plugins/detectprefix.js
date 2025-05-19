import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper'; // Untuk mengekstrak file ZIP
import tar from 'tar'; // Untuk mengekstrak file .tar.gz
import { exec } from 'child_process'; // Untuk menjalankan perintah shell (jika diperlukan)

const handler = async (m, { conn }) => {
  let detectedPrefix = null;
  let detectedFile = null;
  const rootDir = __dirname; // Asumsi plugin dijalankan di direktori root

  const dirsToCheck = [
    'assets', 'database', 'json', 'lib', 'media', 'node_modules',
    'plugins', 'public', 'scraper', 'sessions', 'src', 'tmp'
  ];

  const filesToCheck = [
    'archive-2025-04-24T122930Z.tar.gz', 'assets.zip', 'autoCreateTmp.js',
    'clan.json', 'config.js', 'database.json', 'dataowner.json', 'family-photo.png',
    'gcbot', 'handler.js', 'index.js', 'kills.json', 'lb.js', 'main.js',
    'package-lock.json', 'package.json', 'server.js', 'takjil_played.json', 'test.js'
  ];

  // Fungsi untuk membaca file ZIP
  const readZip = async (zipPath) => {
    const zipDir = path.join(rootDir, 'tempExtract'); // Direktori sementara untuk ekstrak
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: zipDir }))
      .promise();
    return zipDir;
  };

  // Fungsi untuk membaca file .tar.gz
  const readTarGz = async (tarPath) => {
    const tarDir = path.join(rootDir, 'tempExtract'); // Direktori sementara untuk ekstrak
    await tar.x({ file: tarPath, C: tarDir });
    return tarDir;
  };

  // Fungsi untuk mencari prefix dalam file
  const searchPrefixInFile = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    if (fileContent.includes('global.prefix')) {
      return fileContent.match(/global\.prefix\s*=\s*[^;]+/)[0];
    }
    return null;
  };

  // Mengecek semua direktori dan file
  for (const dir of dirsToCheck) {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      const filesInDir = fs.readdirSync(dirPath);
      for (const file of filesInDir) {
        const filePath = path.join(dirPath, file);
        const prefixFound = searchPrefixInFile(filePath);
        if (prefixFound) {
          detectedPrefix = prefixFound;
          detectedFile = filePath;
          break;
        }
      }
    }
    if (detectedPrefix) break;
  }

  // Mengecek file-file individual (termasuk arsip)
  for (const file of filesToCheck) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      if (file.endsWith('.zip')) {
        // Jika ZIP, ekstrak dulu
        const zipDir = await readZip(filePath);
        const filesInZip = fs.readdirSync(zipDir);
        for (const extractedFile of filesInZip) {
          const extractedFilePath = path.join(zipDir, extractedFile);
          const prefixFound = searchPrefixInFile(extractedFilePath);
          if (prefixFound) {
            detectedPrefix = prefixFound;
            detectedFile = extractedFilePath;
            break;
          }
        }
      } else if (file.endsWith('.tar.gz')) {
        // Jika TAR.GZ, ekstrak dulu
        const tarDir = await readTarGz(filePath);
        const filesInTar = fs.readdirSync(tarDir);
        for (const extractedFile of filesInTar) {
          const extractedFilePath = path.join(tarDir, extractedFile);
          const prefixFound = searchPrefixInFile(extractedFilePath);
          if (prefixFound) {
            detectedPrefix = prefixFound;
            detectedFile = extractedFilePath;
            break;
          }
        }
      } else {
        const prefixFound = searchPrefixInFile(filePath);
        if (prefixFound) {
          detectedPrefix = prefixFound;
          detectedFile = filePath;
          break;
        }
      }
    }
    if (detectedPrefix) break;
  }

  if (detectedPrefix && detectedFile) {
    conn.sendMessage(m.chat, {
      text: `🚨 *Prefix Terdeteksi!*\n\nPrefix ditemukan di file: *${detectedFile}*\n\nPengaturan Prefix: \n${detectedPrefix}`,
    }, { quoted: m });
  } else {
    conn.sendMessage(m.chat, {
      text: `🔍 *Tidak ada prefix yang ditemukan* dalam file yang diperiksa.`,
    }, { quoted: m });
  }
};

handler.help = ['detectprefix'];
handler.tags = ['owner'];
handler.command = /^detectprefix$/i;
handler.owner = true;

export default handler;