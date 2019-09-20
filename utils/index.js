require('dotenv').config()
const Twitter = require('twitter');

const twitterKeys = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }

class TwitterInfluenceFinder {
  constructor(credentials, numberOfTweets=450) {
    this.numberOfTweets = numberOfTweets;
    this.tweeters = [];
    this.followsCountArr = [];
    this.rawTweets = [];
    this.filteredTweeters = [];
    this.arrOfRatios = [];
    this.credentials = credentials;
    this.client = ''
  }

  twitterAuth () {
   this.client = new Twitter(this.credentials);
  }

  async getTweets (searchTerm) {
    this.rawTweets = await this.client.get('search/tweets', {q: searchTerm, result_type: 'recent', count: this.numberOfTweets}).then(tweets => tweets.statuses)
  }

  buildTweetDataSet () {
    for (let i=0; i < this.rawTweets.length; i++) {
      if (!this.tweeters.includes(this.rawTweets[i].user)) {
        this.tweeters.push(this.rawTweets[i].user)
        this.followsCountArr.push(Number(this.rawTweets[i].user.followers_count))
      }
    }
  }

  filterByAvgFollowerCount () {
    let total = 0;
    for(let i = 0; i < this.followsCountArr.length; i++) {
        total += this.followsCountArr[i];
    }
    let avg = total / this.followsCountArr.length;
    console.log('AVG FOLLOW COUNT', avg)
    this.filteredTweeters = this.tweeters.filter(elem => Number(elem.followers_count) >= avg)
  }

  calculateFollowRatio () {
    for (let i=0; i < this.filteredTweeters.length; i++) {
      let ratio = Number(this.filteredTweeters[i].followers_count)/Number(this.filteredTweeters[i].friends_count)
      if (ratio === -Infinity) {
        ratio = 0
      } else if (ratio === Infinity) {
        ratio = 200000000
      }
      this.filteredTweeters[i]['follow_friend_ratio'] = ratio
    }
    this.arrOfRatios = this.filteredTweeters.reduce((arr, userObj) => [...arr, userObj.follow_friend_ratio], []);
  }

  getHighestRatio () {
    return Math.max(...this.arrOfRatios)
  }

  async getInfluencerAndTweet (searchTerm) {
    try {
      this.twitterAuth()
      await this.getTweets(searchTerm);
      this.buildTweetDataSet();
      this.filterByAvgFollowerCount();
      this.calculateFollowRatio();
      const [ influencerByRatio ] = this.filteredTweeters.filter(elem => elem.follow_friend_ratio === this.getHighestRatio())
      const tweetByInfluencer = this.rawTweets.find(elem => elem.user.id === influencerByRatio.id)
      return {
        user: influencerByRatio,
        popularTweet: tweetByInfluencer.text,
      }
    } catch (error) {
      console.log('!!!!!! ERROR IN TWEET SEARCH ', error)
    }
  };
}

const twitterInfluencer = new TwitterInfluenceFinder(twitterKeys);

module.exports = twitterInfluencer;
