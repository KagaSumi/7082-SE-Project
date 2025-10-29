const express = require('express');
const { testConnection } = require('./services/database');

const userRouter = require('./routes/user-router');
const questionRouter = require('./routes/question-router');
const answerRouter = require('./routes/answer-router');
const tagRouter = require('./routes/tag-router');
const commentRouter = require('./routes/comment-router');
const courseRouter = require('./routes/course-router');
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
app.use('/api/tags', tagRouter);
app.use('/api/comments', commentRouter);
app.use('/api/course', courseRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);
app.use('/api/answers', answerRouter);
app.use('/api/tag', tagRouter);
app.use('/api/comments', commentRouter);
app.use('/api/course', courseRouter);

module.exports = app;
