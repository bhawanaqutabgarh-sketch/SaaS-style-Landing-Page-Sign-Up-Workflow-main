const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static frontend
app.use(express.static(path.join(__dirname, 'public')));

// connect mongo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas_landing';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Mongo connected')).catch(err => console.error('Mongo error', err));

// routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// default catch-all to index (useful for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
