import React from 'react';
import Home from './components/Home';
import Test from './components/Test';
import Login from './components/Login';
import Signup from './components/Signup'
import SignupCoach from './components/SignupCoach';
import SignupFan from './components/SignupFan';
import Team from './components/Team';
import AddPlayer from './components/AddPlayer';
import EditPlayer from './components/EditPlayer';
import Players from './components/Players';
import PlayerDetails from './components/PlayerDetails';
import Settings from './components/Settings';
import EditTeam from './components/EditTeam';
import Schedule from './components/Schedule';
import GameDetails from './components/GameDetails';

// CARMEN's CODE BELOW THIS
import ManageOpponents from './components/ManageOpponents';
import EditOpponent from './components/EditOpponent';
import AddOpponent from './components/AddOpponent';
import EditGame from './components/EditGame';


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
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <Route exact path='/signupcoach' component={SignupCoach}/>
          <Route exact path='/signupfan' component={SignupFan}/>
          <Route exact path='/team' component={Team} />
          <Route exact path='/players' component={Players} />
          <Route exact path='/playerdetails' component={PlayerDetails} />
          <Route exact path='/settings' component={Settings}/>
          <Route exact path='/addplayer' component={AddPlayer} />
          <Route exact path='/editplayer' component={EditPlayer} />
          <Route exact path='/schedule' component={Schedule} />
          <Route exact path='/gamedetails' component={GameDetails} />
          {/* HI IM GONNA ADD MY CODE BELOW THIS COMMENT -CARMEN */}
          <Route exact path='/editteam' component={EditTeam} />
          <Route exact path='/manageopponents' component={ManageOpponents} />
          <Route exact path='/editopponent' component={EditOpponent} />
          <Route exact path="/addopponent" component={AddOpponent}/>
          <Route exact path="/editgame" component={EditGame}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
