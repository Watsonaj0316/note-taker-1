const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db/db.json');

// Allows all notes to have a unique ID
const { v4: uuidv4 } = require('uuid');

app.use(function(req, res, next) {
    // Disable caching for all routes
    res.set('Cache-Control', 'no-store');
    next();
  });
  
  // Or, disable caching for specific routes
  app.use('/assets/js', function(req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
  });

// Allows public folder to be unblocked
app.use(express.static('public'));
app.use(express.json());

// API Routes
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        const dbData = JSON.parse(data);
        res.json(dbData);
    });
});

// POST /api/notes receives a new note to save on the request body and add it to db.json, then returns new note to the client.
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    db.push(newNote);
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(db));
    res.json(newNote); // Respond with the newly created note
});

// DELETE /api/notes/:id removes the note from db.json, saving and showing the updated database on the front end.
app.delete('/api/notes/:id', (req, res) => {
    const newDb = db.filter((note) => note.id !== req.params.id);
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(newDb));
    res.json(newDb); // Respond with the modified notes array
});

// HTML Routes
// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Wildcard Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// App listens with front end on this port
app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});
