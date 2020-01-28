const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dbname';

const apiPrefix = '/api/v1/';
const authRouter = require('./api/Auth/AuthRouter');
const userRouter = require('./api/User/UserRouter');
const commentRouter = require('./api/Comment/CommentRouter');

const app = express();

// ----------------------------------------Middleware----------------------------------------------- //

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// ----------------------------------------Routes----------------------------------------------- //

app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/user`, userRouter);
app.use(`${apiPrefix}/comment`, commentRouter);

// ----------------------------------------Start server----------------------------------------------- //

//database connection
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected successfully...!');
        app.listen(PORT, () => console.log(`server started at port:${PORT}`));
    })
    .catch(err => console.log(err));

module.exports = app;
