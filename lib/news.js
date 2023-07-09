
async function getLatestNews(nodeFetch, apiKey) {
    try {
        console.log(apiKey)
        const response = await nodeFetch(
            `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`
        );
        //console.log(response)
        return response.data.articles;
    } catch (error) {
        console.log('An error occurred:', error);
    }
}

async function saveNewsAsTweets(news, Tweet) {

        for (const article of news) {
            try {
            const tweetContent = article.description;
            console.log(tweetContent);
            const tweet = new Tweet({
                messageID: article.publishedAt,
                handle: "news-bot",
                content: tweetContent,
                createdAt: new Date(article.publishedAt),
            });
            await tweet.save();
            } catch (error) {
                console.log('An error occurred:', error);
            }
        }
}



async function configureNews(app, nodeFetch, apiKey, Tweet) {

    async function tweetNewsPeriodically() {
        try {
            const news = await getLatestNews(nodeFetch, apiKey);
            await saveNewsAsTweets(news, Tweet);
        } catch (error) {
            console.log('An error occurred:', error);
        }
    }

    setInterval(tweetNewsPeriodically, 36000000);

    app.get('/news', async (req, res) => {
        try {
            const news = await getLatestNews(nodeFetch, apiKey);
            await saveNewsAsTweets(news, Tweet);
            res.status(200).json(news);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    });
}


module.exports = { configureNews };
