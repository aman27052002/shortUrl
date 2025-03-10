require('dotenv').config()
const express =require("express")
const shortId =require('shortid')
const cors = require("cors")
const URL = require("./schema")
const app = express()
const {ConnectToDB} = require('./connect')
const PORT = process.env.PORT || 3000
app.use(cors({
    origin: "*" ,
    credentials: true
}));
ConnectToDB()
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.post('/',async(req,res)=>{
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
   })
   
  app.get('/:shortId',async(req,res)=>{
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
   })
app.get('/',(req,res)=>{
    return res.send("hello from server")
})

app.listen(PORT,()=>console.log(`server listening to the port : ${PORT}`))
