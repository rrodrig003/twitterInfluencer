require('dotenv').config()
const Twitter = require('twitter');
const jsnx = require('jsnetworkx');

// THIS CODE IS AN INITIAL SOLUTION I ATTEMPTED TO IDENTIFY "INFLUENCERS" - WAS NOT IMPLEMENTED IN PROJECT DUE TO UNDERLYING DATASET

const twitterKeys = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }

const client = new Twitter(twitterKeys)

const getTweetersOfSearchTerm = async (searchTerm, numberOfTweets) => {
  let tweeters = [];

  try {
    const statuses = await client.get('search/tweets', {q: searchTerm, result_type: 'recent', count: numberOfTweets}).then(tweets => tweets.statuses)

    for(let i=0; i < statuses.length; i++) {
      if ((!tweeters.includes(statuses[i].user.id)) && (!statuses[i].user.protected)) tweeters.push(statuses[i].user.id)
    }
    console.log('SEARCH TWEET REQUEST COMPLETE', tweeters.length)
    return tweeters;
  } catch (error) {
    console.log('@@@@@@ ERROR IN SEARCH TWEET', error)
  }
}

const getFollowersOfTweeter = async (tweeter, numOfFollowers=100) => {
  try {
    const ids = await client.get('friends/ids', {user_id: tweeter, count: numOfFollowers}).then(tweets => tweets.ids)
    // const { ids } = tweets
    console.log('GET FOLLOWERS REQUEST COMPLETE', ids.length)
    return ids
  } catch (error) {
    console.log('@@@@@@ ERROR IN GET FOLLOWERS', tweeter, error)
  }
}

const buildDataSet = async (func, func2) => {
  const tweeters = await func('air jordans', 15)
  let dataSet = []
  let followers;
  for (let i=0; i < tweeters.length; i++) {
    try {
      followers = await func2(tweeters[i], 5000)

    } catch (error) {
      console.log('##### ERROR IN ORGS/FOLLOWERS LOOP', error)
    }
    if (!followers) {
      continue
    } else {
      for (let j=0; j < followers.length; j++) {
        dataSet.push([followers[j], tweeters[i]])
      }
    }
  }
  console.log('BUILT DATASET LENGTH', dataSet.length)
  return dataSet;
}

const getInfluencer = async () => {
  const dataSet = await buildDataSet(getTweetersOfSearchTerm, getFollowersOfTweeter)

  const G = new jsnx.DiGraph(dataSet);
  console.log('NUMBER OF NODES: ', G.numberOfNodes(), 'NUMBER OF EDGES: ', G.numberOfEdges())
  const scoredNodes = jsnx.eigenvectorCentrality(G);

  let scoresObj = Array.from(scoredNodes).reduce((obj, [key, value]) => (
    Object.assign(obj, { [key]: value })
  ), {});

  const userIds = Object.keys(scoresObj)
  let scoresArray = Object.values(scoresObj)

  console.log('FIRST USER AFTER EIGEN', userIds[0])
  console.log('FIRST VALUE AFTER EIGEN', scoresArray[0])
  console.log('DATA TYPE OF SCORE: ', typeof scoresArray[0])

  // convert scores from string to numbers
  scoresArray = scoresArray.map(elem => Number(elem))

  // sort in descending order
  scoresArray.sort((a, b) => b > a);

  // view and assess results
  console.log('MAX SCORE: ', Math.max(...scoresArray));
  console.log('SAMPLE OF SCORES: ', scoresArray[18], scoresArray[100], scoresArray[59], scoresArray[70]);

  console.log(scoresObj[Object.keys(scoresObj).find(key => scoresObj[key] === scoresArray[0])],": ", scoresArray[0], scoresObj[Object.keys(scoresObj).find(key => scoresObj[key] === scoresArray[1])], ": ", scoresArray[1], scoresObj[Object.keys(scoresObj).find(key => scoresObj[key] === scoresArray[2])], ": ", scoresArray[2],)
  console.log('HIGHEST SCORED:', scoresObj[Object.keys(scoresObj).find(key => scoresObj[key] === scoresArray[0])])
}