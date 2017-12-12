import React from 'react';
import Home from './components/Home';
import Test from './components/Test';
import Login from './components/Login';
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
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
