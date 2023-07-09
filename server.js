const express = require('express');
const app = express();
const server = require('http').createServer(app);
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require('body-parser');
const {initSocket} = require('./lib/socket');
const {connectToMongoDB, Tweet, User, Credential, Follow} = require('./lib/schema');
const {configureTweet} = require('./lib/api/tweet');
const {configureUser} = require('./lib/api/user');
const {configureRelation} = require("./lib/api/relation");
const axios = require('axios');
const {configureNews} = require("./lib/news.js");


app.use(cors());
app.use(bodyParser.json());
dotenv.config(); // Load environment variables from .env file

connectToMongoDB()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

initSocket(server);
configureTweet(app, Tweet);
configureUser(app, Credential, User);
configureRelation(app, Follow);

const apikey = process.env.NEWS_API_KEY;
configureNews(app, axios, apikey, Tweet);

app.get('/hello', (req, res) => {
    console.log('hello');
    res.send('Hello, world!');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
