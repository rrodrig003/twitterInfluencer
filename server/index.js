require('dotenv').config()
const express = require('express')
const twitterInfluencer = require('../utils')


const app = express()
app.use(require('cors')())
app.use(require('morgan')('dev'))

app.listen(3001, ()=> {
  console.log('connected')
})

app.get('/get/:searchTerm', async (req, res) => {
  console.log(req.params.searchTerm)
  try {
    const influencerObj = await twitterInfluencer.getInfluencerAndTweet(req.params.searchTerm);
    res.json(influencerObj)
  } catch (error) {
    console.log('ERROR IN TWITTER REQUEST', error)
  }
})