const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const shortID = shortid();

    await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
      createdBy: req.user ? req.user._id : null,  // Handle unauthenticated users
    });

    return res.render("home", { id: shortID, baseURL: process.env.BASE_URL });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const { shortId } = req.params;
    
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { 
    handleGenerateNewShortURL,
    handleGetAnalytics
};
