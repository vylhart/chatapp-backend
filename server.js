const express = require('express');
const app = express();
const server = require('http').createServer(app);
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require('body-parser');
const {initSocket} = require('./lib/socket');
const {connectToMongoDB, Tweet, User, Credential, Profile} = require('./lib/db');
const {configureTweetDB} = require('./lib/tweetDB');
const {configureUserDB} = require('./lib/UserDB');
const {configureProfileDB} = require("./lib/profileAPI");

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
configureTweetDB(app, Tweet);
configureUserDB(app, Credential, User);
configureProfileDB(app, Profile);

app.get('/hello', (req, res) => {
    console.log('hello');
    res.send('Hello, world!');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
