import {  createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios'

const FIND_INFLUENCER = 'FIND_INFLUENCER'

const findInfluencer = (influencer) => ({ type: FIND_INFLUENCER, influencer})

const influencerState = {
  influencer: {},
  tweet: ''
}

const influencerReducer = (state = influencerState, action) => {
  switch (action.type) {
    case FIND_INFLUENCER:
      return {...state, influencer: action.influencer.user, tweet: action.influencer.popularTweet}
    default:
      return state
  }
}

export const fetchInfluencer = (searchTerm) => dispatch => {
  console.log('SEARCH TERM FROM FRON END', searchTerm)
  axios.get(`http://localhost:3001/get/${searchTerm}`)
    .then(({data}) => {
      dispatch(findInfluencer(data))
    })
    .catch(e => {
      console.log('##### ERROR IN INFLU THUNK ####', e)
    })
}
const store = createStore(influencerReducer, applyMiddleware(thunkMiddleware))

export default store;