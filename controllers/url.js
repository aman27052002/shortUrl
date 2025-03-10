const shortId = require('shortid')
const URL = require('../models/urlSchema')
async function handleGenerateShortId(req,res){
 try {
     const url = req.body.url
     const shortID = shortId()
     if(!url)return res.status(400).json({error:'url not found'})
     
     await URL.create({
       shortId:shortID,
       redirectUrl:url,
       visitHistory:[],
     })
     return res.status(201).json({message:'url created successfully',shortID})
 } catch (error) {
    return res.status(500).json({error:'error occured while generating short id'})
 }
}

async function handleRedirectURL(req,res){
  try {
    const shortId = req.params.shortId
    if(!shortId)return res.status(400).json({error:"shortId not found"})
    const entry = await URL.findOneAndUpdate(
    {shortId},
    {$push:{visitHistory:{Timestamp:Date.now()}}},
    {new:true},
    )
    if(!entry)return res.status(400).json({error:"shortId not found "})
      return res.redirect(entry.redirectUrl)
  } catch (error) {
    return res.status(500).json({error:'error occured while generating short id'})
  }
}
async function handleGetAnalytics(req,res){
try {
    const shortId = req.params.shortId
    if(!shortId) return res.status(400).json({error:"shortId not found"})
    const analytics = await URL.findOne({shortId})
    if(!analytics) return res.staus(400).json({error:"shortId not found"})
    return res.status(200).json({analytics})
} catch (error) {
   return res.status(500).json({error:"error occured while getting analytics",error})
}
}
module.exports = {handleGenerateShortId,handleRedirectURL,handleGetAnalytics}