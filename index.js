const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files
app.use(express.static('public'));

// Route for serving the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling API requests to read notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route for handling API requests to create a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        const notes = JSON.parse(data);
        newNote.id = notes.length + 1;
        notes.push(newNote);
        fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
            res.json(newNote);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
