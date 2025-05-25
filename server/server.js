const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const { auth } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer configuration for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // Limit file size to 100MB
    fileFilter: function (req, file, cb) {
        // Allow only MP4 videos
        if (file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth routes
app.use('/auth', authRoutes);

// Upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
    if (req.file) {
        // Return the URL to the uploaded video
        const videoUrl = `/uploads/${req.file.filename}`;
        res.json({ url: videoUrl });
    } else {
        res.status(400).json({ message: 'No video file uploaded or wrong file type.' });
    }
});

// Endpoint to list uploaded videos
app.get('/videos', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to scan files!', error: err });
        }

        const videoFiles = files.filter(file => path.extname(file).toLowerCase() === '.mp4');
        const videoUrls = videoFiles.map(file => `/uploads/${file}`);

        res.json(videoUrls);
    });
});

// Protected route example
app.get('/api/protected', auth, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
}); 