const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const pgClient = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'players',
    password: '8118',
    port: 5432,
});

pgClient.connect()
    .then(() => console.log('Connected'))
    .catch(err => console.log('Err: ', err));

app.get('/api/players', async (req, res) => {
    try {
        const result = await pgClient.query('SELECT * FROM players');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send('Problemy');
    }
});

app.post("/api/players", async (req, res) => {
    const { playerName, playerServer, playerClass, playerSpec } = req.body;
    try {
        const result = await pgClient.query('INSERT INTO players (name, server, class, spec) VALUES ($1, $2, $3, $4) RETURNING *', [playerName, playerServer, playerClass, playerSpec]);
        res.json(result.rows[0]);
    } catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ error: "Database error "});
    }
});

app.listen(port, () => { 
    console.log(`Server running on ${port}`)
});