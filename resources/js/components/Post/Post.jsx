import React from 'react';

function Post(props) {
  return (
    <div className="posts bg-light">
      {props.posts.map(({ postId, username, text, likes, commentsNumber }) => (
        <li key={postId}>
          <h1>{username}</h1>
          <h6>{text}</h6>
          <p>{`Likes: ${likes} Comments: ${commentsNumber}`}</p>
        </li>
      ))}
    </div>
  );
}

export default Post;
