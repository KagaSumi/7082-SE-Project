const express = require('express');
const { testConnection } = require('./services/database');

const userRouter = require('./routes/user-router');
const questionRouter = require('./routes/question-router');
const answerRouter = require('./routes/answer-router');
const cors = require("cors");


const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Route setup
app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);
app.use('/api/answers', answerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);
app.use('/api/answers', answerRouter);

module.exports = app;