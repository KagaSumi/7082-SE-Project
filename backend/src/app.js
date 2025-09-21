const express = require('express');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

app.get("/", (req, res) => {
    res.send("Hey, request received.");
});

module.exports = app;