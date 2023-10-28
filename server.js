// Required dependancies for the application
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// Redirecting to files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});


// Functions to Read, Write and Append
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

  const readAndDelete = (id, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        const index = parsedData.indexOf(id);
        parsedData.splice(index, 1);
        writeToFile(file, parsedData);
      }
    });
  };


// Requests
app.get('/api/notes', (req, res) => {
    console.log(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'success',
            body: newNote
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(`${req.method} request received to remove a note`);

    const id = req.params.id;

    if (id) {
        readAndDelete(id, './db/db.json');

        const response = {
            status: 'success',
            body: id
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note');
    }
});


// Listener
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});