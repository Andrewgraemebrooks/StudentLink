import React from 'react';

function Post(props) {
  return (
    // <div className="posts bg-light">
    // {props.posts.map(({ postId, username, text, likes, commentsNumber }) => (
    //   <li key={postId}>
    //     <h1>{username}</h1>
    //     <h6>{text}</h6>
    //     <p>{`Likes: ${likes} Comments: ${commentsNumber}`}</p>
    //   </li>
    // ))}
    // </div>
    <div className="container pt-3">
      {props.posts.map(({ postId, username, text, likes, commentsNumber }) => (
        <div key={postId} className="container post-container">
          <div className="row">
            <h3>{username}</h3>
          </div>
          <div className="row">
            <p>{text}</p>
          </div>
          <div className="row">
            <p>{`Likes: ${likes} Comments: ${commentsNumber}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Post;
