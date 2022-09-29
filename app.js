const config = require('config');
const port = config.get('app.port');
const express = require('express');
const app = express();

app.use(express.json());

app.use(require('./routes'));

// handling all other routes
app.all("*", (req, res) => {
    res.status(404).json({
        status: "Route does not exist"
    });
});

app.listen(port, ()=>{
    console.log(`Server is up and running on port ${port}`);
});