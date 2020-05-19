const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/dbname';


const apiPrefix = '/api/v1';

const authRouter = require('./api/Auth/AuthRouter');
const userRouter = require('./api/User/UserRouter');
const commentRouter = require('./api/Comment/CommentRouter');
const postRouter = require('./api/Post/PostRouter');
const uploadRouter = require('./api/Upload/UploadRouter');

const app = express();

// ----------------------------------------Middleware----------------------------------------------- //

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// ----------------------------------------Routes----------------------------------------------- //

app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/users`, userRouter);
app.use(`${apiPrefix}/comments`, commentRouter);
app.use(`${apiPrefix}/posts`, postRouter);
app.use(`${apiPrefix}/upload`, uploadRouter);


// Client Files
app.use(express.static('./client/build'));

app.get('*', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));

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
