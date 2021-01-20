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
    text:
      'Ut incididunt reprehenderit tempor labore tempor culpa elit officia incididunt eiusmod tempor pariatur. Consequat nulla in irure ea reprehenderit laborum pariatur ex et incididunt eiusmod nisi. Esse reprehenderit incididunt sint officia. Ea dolor officia labore duis eiusmod mollit nostrud. Et Lorem mollit mollit cupidatat deserunt aliqua ipsum do ex commodo esse id in dolore. Exercitation minim ullamco enim tempor cillum sint.',
    likes: 4,
    commentsNumber: 3,
  },
  {
    postId: 2,
    username: 'JaneDoe123',
    text:
      'Est non sunt cillum amet aute fugiat irure sit ut. In occaecat dolor culpa ex fugiat. Ex officia dolore magna velit qui deserunt.',
    likes: 7,
    commentsNumber: 5,
  },
  {
    postId: 3,
    username: 'AlexT12',
    text:
      'Ut nostrud proident duis consectetur exercitation. Excepteur incididunt sunt commodo ullamco reprehenderit consequat do irure ex dolore aliquip. Occaecat ullamco proident ad exercitation laboris amet anim est laborum consectetur. Ex eu deserunt incididunt labore sint. Anim reprehenderit et in nostrud.',
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
