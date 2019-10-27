import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import  Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Feed from './components/Feed/Feed';
import Search from './components/Search/Search';
import Filter from './components/Filter/Filter';
import LinkFeed from './components/LinkFeed/LinkFeed';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/filter" component={Filter} />
            <Route exact path="/links" component={LinkFeed} />
            <Redirect to="/"/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
