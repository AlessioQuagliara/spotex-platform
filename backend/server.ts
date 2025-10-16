import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(' Backend funzionante');
})

app.listen(PORT, () => {
    console.log('Server avviato su porta  ' + PORT);
})

