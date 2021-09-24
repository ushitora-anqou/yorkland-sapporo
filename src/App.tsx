import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Tutorial from './components/page/Tutorial';
import Home from './components/page/Home';

function App(): JSX.Element {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tutorial">Tutorial</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/tutorial">
            <Tutorial />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
