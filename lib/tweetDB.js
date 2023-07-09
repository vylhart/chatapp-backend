const {authenticateToken} = require("./middleware");

function configureTweetDB(app, Tweet) {
    app.get('/tweets', authenticateToken, async (req, res) => {

        const { page, limit } = req.query;
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 10;

        try {
            const tweets = await Tweet.find()
                .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage)
                .exec();

            const totalTweets = await Tweet.countDocuments();
            const totalPages = Math.ceil(totalTweets / itemsPerPage);
            if (currentPage > totalPages) {
                return res.status(404).json({ error: 'No more tweets available' });
            }

            res.status(200).json(tweets);
        } catch (error) {
            console.error('Error fetching tweets:', error);
            res.status(500).json({ error: 'Failed to fetch tweets' });
        }
    });

    app.post('/tweets', authenticateToken, async (req, res) => {
        // request
        console.log('Request body:', req.body)
        const {messageID, handle, content} = req.body;
        console.log(req.body)
        console.log('Message ID:', messageID, 'Handle:', handle, 'Content:', content)
        const tweet = new Tweet({messageID, handle, content});

        try {
            const savedTweet = await tweet.save();
            console.log('Saved tweet:', savedTweet);
            res.json(savedTweet);
        } catch (error) {
            console.error('Error saving tweet:', error);
            res.status(500).json({error: 'Failed to save tweet'});
        }
    });

    app.get('/tweets/:handle', authenticateToken, async (req, res) => {
        const {handle} = req.params;
        console.log('Fetching tweets for handle:', handle);
        try {
            const tweets = await Tweet.find({ handle: handle }).exec();
            console.log('Tweets:', tweets);
            if (tweets) {
                res.json(tweets);
            } else {
                res.json([]);
            }
        } catch (error) {
            console.error('Error fetching tweets:', error);
            res.status(500).json({ error: 'Failed to fetch tweets' });
        }
    });
}

module.exports = {
    configureTweetDB,
};
