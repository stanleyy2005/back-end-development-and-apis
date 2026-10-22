const express = require('express');
const path = require('path');
const { inputCleaner, inputValidator } = require('./middleware');

const app = express();
const PORT = 3000;

// Parse URL-encoded bodies (from HTML forms) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static HTML form from 'public' directory
app.use('/form', express.static(path.join(__dirname, 'public')));

// Redirect GET / to /form
app.get('/', (req, res) => {
  res.redirect('/form');
});

// POST /submit route with route-level middleware
app.post('/submit', inputCleaner, inputValidator, (req, res) => {
  res.json({
    username: req.body.username,
    comment: req.body.comment
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});