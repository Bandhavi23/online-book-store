const fs = require('fs');
const path = require('path');
const https = require('https');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const imagesToDownload = {
  'fiction.jpg': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop&q=80',
  'nonfiction.jpg': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=450&fit=crop&q=80',
  'science.jpg': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=450&fit=crop&q=80',
  'romance.jpg': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=450&fit=crop&q=80',
  'mystery.jpg': 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=450&fit=crop&q=80',
  'thriller.jpg': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop&q=80',
  'biography.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=450&fit=crop&q=80',
  'children.jpg': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop&q=80',
  'fantasy.jpg': 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=300&h=450&fit=crop&q=80',
  'history.jpg': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&h=450&fit=crop&q=80',
  'selfhelp.jpg': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=450&fit=crop&q=80',
  'technology.jpg': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=450&fit=crop&q=80'
};

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const run = async () => {
  console.log('🔄 Starting cover images download into backend/uploads/...');
  for (const [filename, url] of Object.entries(imagesToDownload)) {
    const dest = path.join(UPLOADS_DIR, filename);
    try {
      console.log(`⏳ Downloading ${filename}...`);
      await downloadFile(url, dest);
      console.log(`✅ Saved ${filename}`);
    } catch (err) {
      console.error(`❌ Failed to save ${filename}:`, err.message);
    }
  }
  console.log('🎉 Done downloading all cover templates!');
};

run();
