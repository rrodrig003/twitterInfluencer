require('dotenv').config({path: '../.env'})
const Twitter = require('twitter');
const jsnx = require('jsnetworkx');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// get 450 tweets
// grab unique users
// get average follow
// filter elem > average follow
// reduce filtered array to object with follow/friend ratio as key
// turn keys to Array
// sort array desc order
// return first elem/top

// const getInfluencerByRatio = async (searchTerm, numberOfTweets=450) => {
//   let tweeters = [];
//   let followsCountArr = []
//   try {
//     const statuses = await client.get('search/tweets', {q: searchTerm, result_type: 'recent', count: numberOfTweets}).then(tweets => tweets.statuses)

//     for(let i=0; i < statuses.length; i++) {
//       if (!tweeters.includes(statuses[i].user)) {
//         tweeters.push(statuses[i].user)
//         followsCountArr.push(Number(statuses[i].user.followers_count))
//       }
//     }

//     let total = 0;
//     for(let i = 0; i < followsCountArr.length; i++) {
//         total += followsCountArr[i];
//     }
//     let avg = total / followsCountArr.length;

//     console.log('AVG FOLLOW COUNT', avg)

//     const filteredTweeters = tweeters.filter(elem => Number(elem.followers_count) >= avg)
//     // console.log('FILTER TWEETERS', filteredTweeters[0])
//     // const tweeterArrWithRatio = filteredTweeters.map(elem => elem['follow_friend_ratio'] = Number(elem.followers_count)/Number(elem.friends_count))

//     for (let i=0; i < filteredTweeters.length; i++) {
//       let ratio = Number(filteredTweeters[i].followers_count)/Number(filteredTweeters[i].friends_count)
//       if (ratio === -Infinity) {
//         ratio = 0
//       } else if (ratio === Infinity) {
//         ratio = 200000000
//       }
//       filteredTweeters[i]['follow_friend_ratio'] = ratio
//     }

//     const arrOfRatios = filteredTweeters.reduce((arr, userObj) => [...arr, userObj.follow_friend_ratio], []);

//     const maxFollowRatio = Math.max(...arrOfRatios)
//     const maxFollowers = Math.max(...followsCountArr)
    
//     console.log('MAX FOLLOW RATIO', maxFollowRatio)
//     console.log('MAX FOLLOWERS', maxFollowers)

// const [ influencerByRatio ] = filteredTweeters.filter(elem => elem.follow_friend_ratio === maxFollowRatio)
// const [ influencerByFollows ] = filteredTweeters.filter(elem => Number(elem.followers_count) === maxFollowers)

// console.log('BY RATIO: ', influencerByRatio)
// console.log('BY FOLLOW: ', influencerByFollows)

// const tweetByInfluencer = statuses.find(elem => elem.user.id === influencerByRatio.id)
// // console.log(tweetByInfluencer.text)

//   } catch (error) {
//     console.log('@@@@@@ ERROR IN SEARCH TWEET', error)
//   }
// }

const getInfluencerByRatio = async (searchTerm, numberOfTweets=450) => {
  let tweeters = [];
  let followsCountArr = []
  try {
    const statuses = await client.get('search/tweets', {q: searchTerm, result_type: 'recent', count: numberOfTweets}).then(tweets => tweets.statuses)

    for(let i=0; i < statuses.length; i++) {
      if (!tweeters.includes(statuses[i].user)) {
        tweeters.push(statuses[i].user)
        followsCountArr.push(Number(statuses[i].user.followers_count))
      }
    }

    let total = 0;
    for(let i = 0; i < followsCountArr.length; i++) {
        total += followsCountArr[i];
    }
    let avg = total / followsCountArr.length;

    console.log('AVG FOLLOW COUNT', avg)

    const filteredTweeters = tweeters.filter(elem => Number(elem.followers_count) >= avg)

    for (let i=0; i < filteredTweeters.length; i++) {
      let ratio = Number(filteredTweeters[i].followers_count)/Number(filteredTweeters[i].friends_count)
      if (ratio === -Infinity) {
        ratio = 0
      } else if (ratio === Infinity) {
        ratio = 200000000
      }
      filteredTweeters[i]['follow_friend_ratio'] = ratio
    }

    const arrOfRatios = filteredTweeters.reduce((arr, userObj) => [...arr, userObj.follow_friend_ratio], []);

    const maxFollowRatio = Math.max(...arrOfRatios)
    const maxFollowers = Math.max(...followsCountArr)
    
    console.log('MAX FOLLOW RATIO', maxFollowRatio)
    console.log('MAX FOLLOWERS', maxFollowers)

    const [ influencerByRatio ] = filteredTweeters.filter(elem => elem.follow_friend_ratio === maxFollowRatio)
    const [ influencerByFollows ] = filteredTweeters.filter(elem => Number(elem.followers_count) === maxFollowers)

    console.log('BY RATIO: ', influencerByRatio)
    console.log('BY FOLLOW: ', influencerByFollows)

    const tweetByInfluencer = statuses.find(elem => elem.user.id === influencerByRatio.id)
    // console.log(tweetByInfluencer.text)
    return {
      user: influencerByRatio,
      popularTweet: tweetByInfluencer.text,
    }

  } catch (error) {
    console.log('@@@@@@ ERROR IN SEARCH TWEET', error)
  }
}

export default getInfluencerByRatio;
