import React from 'react'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Newroom from './Pages/Newroom'
import Joinroom from './Pages/Joinroom'
import Room from './Pages/Room'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/joinroom" component={Joinroom}/>
        <Route path="/newroom" component={Newroom}/>
        <Route path="/room/:roomid" component={Room}/>
      </Switch>
    </Router>
    </>
  );
}

export default App;
