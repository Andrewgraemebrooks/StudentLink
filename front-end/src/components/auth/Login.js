import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="login">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">
                  Login into StudentLink
                </h1>
                <form>
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md12">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control input-sm"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12">
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
                  </div>
                  <input
                    type="submit"
                    value="Login"
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
export default Login;
