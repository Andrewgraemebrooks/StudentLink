import React, { Component } from 'react';

class Register extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="register">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Signup to StudentLink</h1>
                <form>
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md12">
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control input-sm"
                          placeholder="Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control input-sm"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="form-control input-sm"
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <div className="form-group">
                        <input
                          type="password"
                          name="password_confirmation"
                          id="password_confirmation"
                          className="form-control input-sm"
                          placeholder="Confirm Password"
                        />
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
