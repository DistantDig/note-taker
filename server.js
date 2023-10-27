// Required dependancies for the application
const express = require('express');
const path = require('path');

const PORT = 3000;
const app = express();

// Redirect to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Redirect to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});