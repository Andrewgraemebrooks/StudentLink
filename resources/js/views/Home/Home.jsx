import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Post from '../../components/Post/Post';

// Like Twitter's Home/Newsfeed

const sidebarItems = [
  { name: 'home', label: 'Home' },
  { name: 'profile', label: 'Profile' },
  { name: 'notifications', label: 'Notifications' },
  { name: 'messages', label: 'Messages' },
  { name: 'settings', label: 'Settings' },
];

const examplePosts = [
  {
    postId: 1,
    username: 'JohnDoe123',
    text: 'StudentLink post',
    likes: 4,
    commentsNumber: 3,
  },
  {
    postId: 2,
    username: 'JaneDoe123',
    text: 'Not Twitter Post',
    likes: 7,
    commentsNumber: 5,
  },
];

function Home(props) {
  return (
    <div id="home-container" className="container content-container">
      <Sidebar items={sidebarItems} />
      <div id="page-content-wrapper">
        <Header />
        <Post posts={examplePosts} />
      </div>
    </div>
  );
}

export default Home;
