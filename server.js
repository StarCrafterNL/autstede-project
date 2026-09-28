const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Map 'test pdf' aanmaken indien deze nog niet bestaat
const uploadDir = path.join(__dirname, 'test pdf');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Opslag configureren zonder timestamp/nummers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Alleen de bestandsnaam zoals meegestuurd vanuit het formulier
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, cleanName);
  }
});

const upload = multer({ storage });

// Publieke bestanden (index.html) serveren
app.use(express.static(path.join(__dirname, 'public')));

// Upload endpoint
app.post('/api/upload-pdf', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Geen bestand ontvangen' });
  }
  console.log(`PDF succesvol opgeslagen in "test pdf": ${req.file.filename}`);
  res.json({ success: true, message: 'PDF opgeslagen' });
});

app.listen(PORT, () => {
  console.log(`Demo draait op: http://localhost:${PORT}`);
});