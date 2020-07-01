import React from 'react';
import NavigationBar from './components/layout/NavigationBar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import { BrowserRouter as Router, Route } from 'react-router-dom/BrowserRouter';

function App() {
  return (
    <Router>
      <div className='App'>
        <NavigationBar />
        <Route exact path='/' component={Landing} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
