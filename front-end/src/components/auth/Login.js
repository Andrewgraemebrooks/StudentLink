import React, { Component } from 'react';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    console.log(user);
  }

  render() {
    return (
      <div>
        <div className='container'>
          <div className='login'>
            <div className='row'>
              <div className='col-md-8 m-auto'>
                <h1 className='display-4 text-center'>
                  Login into StudentLink
                </h1>
                <form onSubmit={this.onSubmit}>
                  <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md12'>
                      <div className='form-group'>
                        <input
                          type='email'
                          name='email'
                          id='email'
                          className='form-control input-sm'
                          placeholder='Email Address'
                          value={this.state.email}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-12'>
                      <div className='form-group'>
                        <input
                          type='password'
                          name='password'
                          id='password'
                          className='form-control input-sm'
                          placeholder='Password'
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type='submit'
                    value='Login'
                    className='btn btn-info btn-block btn-danger'
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
