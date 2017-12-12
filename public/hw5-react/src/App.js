import React from 'react';
import Home from './components/Home';
import Test from './components/Test';
import Login from './components/Login';
import Team from './components/Team';
import AddPlayer from './components/AddPlayer';
import Players from './components/Players';
import PlayerDetails from './components/PlayerDetails';

var ReactRouter = require('react-router-dom');
var BrowserRouter = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;


class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <div className='app-container'>
          <Route exact path='/' component={Home} />
          <Route exact path='/test' component={Test} />
          <Route exact path='/team' component={Team} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/players' component={Players} />
          <Route exact path='/playerdetails' component={PlayerDetails} />
          <Route exact path='/addplayer' component={AddPlayer} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
