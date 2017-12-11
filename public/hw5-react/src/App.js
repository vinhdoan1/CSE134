import React from 'react';
import Home from './components/Home';
import Test from './components/Test';
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
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
