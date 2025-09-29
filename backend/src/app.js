const express = require('express');
const userRouter = require('./routes/user-router');
const questionRouter = require('./routes/question-router')

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

// Route setup
app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);

module.exports = app;