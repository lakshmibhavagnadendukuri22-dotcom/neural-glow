const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const palettes = [
 {
  id:1,
  name:"Aurora Bloom",
  lip:"#ff0077",
  blush:"#ff66aa",
  highlight:"#ffd1f0"
 },
 {
  id:2,
  name:"Golden Hour",
  lip:"#d94f70",
  blush:"#ff9aa2",
  highlight:"#ffe3a3"
 }
]

// TEST ROUTE
app.get("/",(req,res)=>{
 res.send("Neural Glow Backend Running")
})

// PALETTE ROUTE
app.get("/palettes",(req,res)=>{
 res.json(palettes)
})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log("Server running on port " + PORT)
})