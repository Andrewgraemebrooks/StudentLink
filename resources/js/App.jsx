import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/views/Home/Home';

function App(props) {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
