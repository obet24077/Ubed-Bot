import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedLikes ??= {};
  global.db.data.ubedComments ??= {};

  const statusList = global.db.data.ubedStatus;
  const akunList = global.db.data.ubedAccounts;

  if (statusList.length === 0) return m.reply('Belum ada status di Ubed Media.');

  const statuses = [...statusList].sort((a, b) => b.timestamp - a.timestamp).slice(0, 7);
  const canvasHeight = 130 + statuses.length * 190;
  const canvas = createCanvas(900, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header
  ctx.fillStyle = '#1877F2';
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('Beranda Ubed Media', 30, 65);

  const timeAgo = (ts) => {
    const ms = Date.now() - ts;
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);
    if (day > 0) return `${day} hari lalu`;
    if (hour > 0) return `${hour} jam lalu`;
    if (min > 0) return `${min} menit lalu`;
    return `${sec} detik lalu`;
  };

  let y = 130;
  for (const s of statuses) {
    const akun = akunList[s.sender] ?? {};
    const verified = akun.verified ? ' 🅥' : '';
    const nama = akun.nama || s.username || 'Pengguna';
    const waktu = timeAgo(s.timestamp);
    const like = (global.db.data.ubedLikes[s.id] || []).length;
    const komen = (global.db.data.ubedComments[s.id] || []).length;
    const isi = s.text?.slice(0, 200) || '';
    const komentarTerbaru = global.db.data.ubedComments[s.id]?.slice(-1)[0]?.text || '';

    ctx.fillStyle = '#f0f2f5';
    ctx.fillRect(20, y - 10, 860, 170);

    // Foto profil
    if (akun.foto && akun.foto.startsWith('http')) {
      try {
        const res = await fetch(akun.foto);
        const imgBuffer = await res.buffer();
        const img = await loadImage(imgBuffer);

        ctx.save();
        ctx.beginPath();
        ctx.arc(60, y + 30, 30, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 30, y, 60, 60);
        ctx.restore();
      } catch {
        drawDefaultProfile(ctx, 30, y, nama);
      }
    } else {
      drawDefaultProfile(ctx, 30, y, nama);
    }

    // Nama + waktu
    ctx.fillStyle = '#000';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`${nama}${verified}`, 110, y + 30);
    ctx.fillStyle = '#666';
    ctx.font = '14px sans-serif';
    ctx.fillText(waktu, 110, y + 50);

    // Isi status
    ctx.fillStyle = '#111';
    ctx.font = '16px sans-serif';
    wrapText(ctx, isi, 40, y + 80, 820, 20);

    // Like & Komentar
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    ctx.fillText(`♥️ ${like}   🗨️ ${komen}`, 40, y + 150);

    // Komentar terbaru (jika ada)
    if (komentarTerbaru) {
      ctx.fillStyle = '#444';
      ctx.font = 'italic 14px sans-serif';
      wrapText(ctx, `💬 ${komentarTerbaru.slice(0, 100)}`, 300, y + 150, 550, 18);
    }

    y += 190;
  }

  const buffer = canvas.toBuffer();
  conn.sendFile(m.chat, buffer, 'berandaimg.png', '', m);
};

function drawDefaultProfile(ctx, x, y, nama = 'U') {
  const initial = nama.trim()[0].toUpperCase();
  const color = hashColor(nama);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x + 30, y + 30, 30, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.clip();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(initial, x + 20, y + 40);
  ctx.restore();
}

function hashColor(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
    ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
    ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
  return color.replace(/NaN/g, '66');
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

handler.command = /^berandaimg$/i;
handler.tags = ['media'];
handler.help = ['berandaimg'];

export default handler;