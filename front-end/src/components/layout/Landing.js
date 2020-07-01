import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Landing extends Component {
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
                  <Link to='/register' className='btn btn-lg btn-danger mr-2'>
                    Sign Up
                  </Link>
                  <Link to='/login' className='btn btn-lg btn-light'>
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
