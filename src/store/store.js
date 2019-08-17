import {  createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import getInfluencerByRatio from '../../utils'

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

export const fetchInfluencer = (searchTerm) => async dispatch => {
  try {
    const influencerObj = await getInfluencerByRatio(searchTerm, 50)
    dispatch(findInfluencer(influencerObj))
  } catch (error) {
    console.log('##### ERROR IN INFLU THUNK ####', error)
  }
}
const store = createStore(influencerReducer, applyMiddleware(thunkMiddleware))

export default store;