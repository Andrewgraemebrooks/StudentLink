import React from 'react';
import NavigationBar from './components/layout/NavigationBar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <NavigationBar />
        <Route exact path='/' component={Landing} />
        <div className='container'>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
