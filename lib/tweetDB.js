const {authenticateToken} = require("./middleware");

function configureTweetDB(app, Tweet) {
    app.get('/tweets', authenticateToken, async (req, res) => {
        try {
            const tweets = await Tweet.find().exec();
            res.json(tweets);
        } catch (error) {
            console.error('Error fetching tweets:', error);
            res.status(500).json({ error: 'Failed to fetch tweets' });
        }
    });

    app.post('/tweets', authenticateToken, async (req, res) => {
        // request
        console.log('Request body:', req.body)
        const {messageID, handle, content} = req.body.body;
        console.log(req.body.body)
        console.log('Message ID:', messageID, 'Handle:', handle, 'Content:', content)
        const tweet = new Tweet({messageID, handle, content});

        try {
            const savedTweet = await tweet.save();
            console.log('Saved tweet:', savedTweet)
            res.json(savedTweet);
        } catch (error) {
            console.error('Error saving tweet:', error);
            res.status(500).json({error: 'Failed to save tweet'});
        }
    });
}

module.exports = {
    configureTweetDB,
}