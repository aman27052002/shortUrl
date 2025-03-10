const express = require("express")

const router = express.Router()
const {handleGenerateShortId,handleRedirectURL} = require('../controllers/url')
router.post('/',handleGenerateShortId)
router.get('/:shortId',handleRedirectURL)
module.exports = router