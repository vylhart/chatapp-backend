const mongoose = require('mongoose');
const uri = 'mongodb+srv://shashank:qwerty123@tweets.ak6sfx4.mongodb.net/';

function connectToMongoDB() {
    return mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
}

// Create a Tweet schema and model
const tweetSchema = new mongoose.Schema({
    messageID: String,
    handle: String,
    content: String,
    createdAt: {type: Date, default: Date.now},
});

const Tweet = mongoose.model('Tweet', tweetSchema);

// Credential schema and model
const userSchema = new mongoose.Schema({
    _id: String,
    handle: String,
    imageUrl: { type: String, default: null },
    name: String,
    joined: Date,
    data: { type: String, default: null },
});


const credSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const Credential = mongoose.model('Credential', credSchema);
const User = mongoose.model('USer', userSchema);

module.exports = {
    connectToMongoDB,
    Tweet,
    Credential,
    User,
};
