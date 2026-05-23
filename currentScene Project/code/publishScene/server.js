const express = require('express');
const app = express();
const PORT = 3000;

let currentSceneIndex = 0;
let playbackState = 0;

// The Sender just hits this URL with the index at the end (e.g., /scene/4)
app.get('/scene/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    
    if (!isNaN(index)) {
        currentSceneIndex = index;
        console.log(`[Relay] Scene updated to: ${currentSceneIndex}`);
        // Send a plain text response so Max doesn't look for a JSON dict
        return res.set('Content-Type', 'text/plain').send('OK');
    }
    res.status(400).send('Invalid Index');
});

// The Sender hits this URL with the playback state at the end (e.g., /playback/1)
app.get('/playback/:state', (req, res) => {
    const state = parseInt(req.params.state, 10);

    if (!isNaN(state)) {
        playbackState = state;
        console.log(`[Relay] Playback updated to: ${playbackState}`);
        return res.set('Content-Type', 'text/plain').send('OK');
    }
    res.status(400).send('Invalid State');
});

// The Receiver gets the raw number as plain text
app.get('/current-scene', (req, res) => {
    res.set('Content-Type', 'text/plain').send(currentSceneIndex.toString());
});

app.get('/current-playback', (req, res) => {
    res.set('Content-Type', 'text/plain').send(playbackState.toString());
});

app.listen(PORT, () => {
    console.log(`🚀 Ultra-lean Max Relay running on http://localhost:${PORT}`);
});