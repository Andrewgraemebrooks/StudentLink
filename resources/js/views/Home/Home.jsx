import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      email: '',
      password: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onSignupSubmit = this.onSignupSubmit.bind(this);
  }

  /**
   * Updates the state when the value of an element has been changed.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Logs the user in.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  onLoginSubmit(event) {
    event.preventDefault();
  }

  /**
   * Sends the user to the register page.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  onSignupSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div id="home-container" className="container">
        <div className="row">
          <div className="col text-col">
            <h1>StudentLink</h1>
            <h6>Connect with other students!</h6>
          </div>
          <div className="col">
            <form>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  onChange={this.onChange}
                  placeholder="Enter email"
                />
              </div>
              <input
                type="password"
                className="form-control"
                id="password"
                onChange={this.onChange}
                placeholder="Enter password"
              />
              <button className="btn btn-primary" onClick={this.onLoginSubmit}>
                Log In
              </button>
              <hr />
              <button className="btn btn-success" onClick={this.onSignupSubmit}>
                Create A New Account
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
