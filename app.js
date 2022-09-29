const config = require('config');
const port = config.get('app.port');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/monthlyReward', (req, res) => {
    res.status(201).json({
        status: "Received transactions"
    })
})

app.listen(port, ()=>{
    console.log(`Server is up and running on port ${port}`);
})