import React, { Component } from 'react';

export default class Landing extends Component {
  render() {
    return (
      <div>
        <div className='dark-overlay landing-inner text-light'>
          <div className='view'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12 text-center'>
                  <h1 className='display-3 mb-4'>Student Link</h1>
                  <p className='lead'>
                    {' '}
                    A social media site for students to connect!
                  </p>
                  <hr />
                  <a href='#register' className='btn btn-lg btn-danger mr-2'>
                    Sign Up
                  </a>
                  <a href='#login' className='btn btn-lg btn-light'>
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
