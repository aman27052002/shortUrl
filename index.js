require('dotenv').config();
const cors = require('cors')
const express = require('express');
const URL = require('./models/url');
const {restrictToLoggedInUserOnly,checkAuth} = require('./middlewares/auth')
const path = require('path')
const app = express();
const PORT = process.env.PORT || 8001;
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require('./connect');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

app.use(cors())
app.set('view engine','ejs')
app.set('views',path.resolve("./views"))

// Connect to MongoDB
connectToMongoDB(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log("MongoDB not connected: " + err));
    
    // Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // ✅ Fixed this line

// Routes
app.use('/url',restrictToLoggedInUserOnly, urlRoute)
app.use('/user',userRoute)
app.use('/',checkAuth,staticRoute)



app.get('/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;
        console.log("Received shortId:", shortId);  // Debugging log

        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            console.log("Short URL not found in database");  // Debugging log
            return res.status(404).json({ error: "Short URL not found" });
        }

        console.log("Redirecting to:", entry.redirectURL);
        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Error retrieving URL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// Start the server
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
