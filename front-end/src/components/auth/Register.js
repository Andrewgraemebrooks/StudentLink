import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    axios
      .post('/api/users/register', newUser)
      .then((res) => console.log(res))
      .catch((err) => this.setState({ errors: err.response.data }));
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="container">
          <div className="register">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Signup to StudentLink</h1>
                <form noValidate onSubmit={this.onSubmit}>
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md12">
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className={classnames('form-control input-sm', {
                            // is-valid will only exist if errors.name exists
                            'is-invalid': errors.name,
                          })}
                          placeholder="Name"
                          value={this.state.name}
                          onChange={this.onChange}
                        />
                        {/* If there is an error, returns the error underneath the input field */}
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name} </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className={classnames('form-control input-sm', {
                        // is-valid will only exist if errors.name exists
                        'is-invalid': errors.email,
                      })}
                      placeholder="Email Address"
                      value={this.state.email}
                      onChange={this.onChange}
                    />
                    {/* If there is an error, returns the error underneath the input field */}
                    {errors.email && (
                          <div className="invalid-feedback">{errors.email} </div>
                        )}
                  </div>
                  <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className={classnames('form-control input-sm', {
                            // is-valid will only exist if errors.name exists
                            'is-invalid': errors.password,
                          })}
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                        {/* If there is an error, returns the error underneath the input field */}
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password} </div>
                        )}
                      </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <div className="form-group">
                        <input
                          type="password"
                          name="password2"
                          id="password2"
                          className={classnames('form-control input-sm', {
                            // is-valid will only exist if errors.name exists
                            'is-invalid': errors.password2,
                          })}
                          placeholder="Confirm Password"
                          value={this.state.password2}
                          onChange={this.onChange}
                        />
                        {/* If there is an error, returns the error underneath the input field */}
                        {errors.password2 && (
                          <div className="invalid-feedback">{errors.password2} </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <input
                    type="submit"
                    value="Register"
                    className="btn btn-info btn-block btn-danger"
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
export default Register;
