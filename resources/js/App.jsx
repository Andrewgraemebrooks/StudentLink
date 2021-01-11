import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './views/Landing/Landing';
import Home from './views/Home/Home';
import { AppProvider } from './AppContext';

function App(props) {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/home" component={Home} />
          </Switch>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
