import React, {Component} from 'react';
import { connect } from 'react-redux'
import { fetchInfluencer } from './store/store.js'
// import logo from './logo.svg';
import './App.css';

class App extends Component {

  render(){
    const { influencer, tweet, getInfluencer } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <div className='Title'>Twitter Influence Finder</div>
          <form onSubmit={getInfluencer}
            id="influencerForm"
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
            >
              <input type="text" name="searchTerm" placeholder="Enter Search Term" />
              <span>
                <button type="submit">Submit</button>
              </span>
          </form>
            {
              influencer &&
              <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                textAlign: 'center',
              }}
              >
                {/* <div style={{color: 'red'}}>{influencer.screen_name}</div>
                <div style={{color: 'red'}}>{influencer.description}</div>
                <div style={{color: 'red'}}>{influencer.followers_count}</div>
                <div style={{color: 'red'}}>{influencer.friends_count}</div>
                <div style={{color: 'red'}}>{tweet}</div> */}
                <div style={{color: 'red'}}>Screen Name: 
                  <div style={{color: 'white'}}>{influencer.screen_name}</div> 
                </div>
                <div style={{color: 'red'}}> Description: 
                  <div style={{color: 'white'}}>{influencer.description}</div>
                </div>
                <div style={{color: 'red'}}>Follower Count: 
                  <div style={{color: 'white'}}>{influencer.followers_count}</div>
                </div>
                <div style={{color: 'red'}}> Following Count: 
                  <div style={{color: 'white'}}>{influencer.friends_count}</div>
                </div>
                <div style={{color: 'red'}}> Tweet: 
                  <div style={{color: 'white'}}>{tweet}</div>
                </div>


              </div>
              // :
              // // <div className={}> </div>
              // ''
            }
        </header>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { influencer, tweet } = state
  return {
    influencer,
    tweet
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getInfluencer: (ev) => {
      ev.preventDefault();
      dispatch(fetchInfluencer(ev.target.searchTerm.value))
    } 
  }
}

const connectComponent = connect(mapStateToProps, mapDispatchToProps)
const connectedApp = connectComponent(App);
export default connectedApp;
