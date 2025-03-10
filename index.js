require('dotenv').config()
const express =require("express")
const cors = require("cors")
const  urlRoute = require('./routes/url')
const app = express()
const {ConnectToDB} = require('./connect')
const PORT = process.env.PORT || 3000
app.use(cors({
    origin: "*" ,
    credentials: true
}));

const {handleGetAnalytics} = require('./controllers/url')
ConnectToDB()
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/url',urlRoute)
app.get('/:shortId',handleGetAnalytics)
app.get('/',(req,res)=>{
    return res.send("hello from server")
})

app.listen(PORT,()=>console.log(`server listening to the port : ${PORT}`))
