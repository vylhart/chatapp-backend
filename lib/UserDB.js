const bcrypt = require('bcrypt');
const { getToken } = require('./middleware');

function configureUserDB(app, User) {

    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            // Find the user in the database based on the provided username
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(401).json({ error: 'No such username' });
            }
            console.log('Logging in:', username, password)
            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Generate a JWT token
            const token = getToken(user._id);

            res.status(200).json({ token: token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });


    app.post('/signup', async (req, res) => {
        const {username, password} = req.body;

        try {
            const existingUser = await User.findOne({username});
            if (existingUser) {
                return res.json({success: false, error: 'Username already exists'});
            }
            console.log('Signing up:', username, password)

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({username, password: hashedPassword,});
            await newUser.save();
            res.json({success: true});

        } catch (error) {
            console.error('Error signing up:', error);
            res.status(500).json({success: false, error: 'Server error'});
        }
    });
}

module.exports = {
    configureUserDB,
}