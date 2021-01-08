import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';

// Like Twitter's Home/Newsfeed

const sidebarItems = [
  { name: 'home', label: 'Home' },
  { name: 'profile', label: 'Profile' },
  { name: 'notifications', label: 'Notifications' },
  { name: 'messages', label: 'Messages' },
  { name: 'settings', label: 'Settings' },
];

function Home(props) {
  return (
    <div id="home-container" className="container content-container">
      <Sidebar items={sidebarItems} />
      <div id="page-content-wrapper">
        <Header />
      </div>
    </div>
  );
}

export default Home;
