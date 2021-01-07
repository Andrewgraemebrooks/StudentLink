import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fullName: '',
      error: '',
      isOpen: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onRegisterSubmit = this.onRegisterSubmit.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
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
   * Registers the user.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  onRegisterSubmit(event) {
    event.preventDefault();
  }

  /**
   * Opens up the register modal
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  onOpenModal(event) {
    event.preventDefault();
    this.setState({ isOpen: true });
  }

  /**
   * Closes the register modal
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  onCloseModal(event) {
    event.preventDefault();
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <div id="landing-container" className="container content-container">
        <div className="row">
          <div className="col text-col">
            <h1>StudentLink</h1>
            <h6>Connect with other students!</h6>
          </div>
          <div className="col form-col">
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
              {/* <button className="btn btn-primary" onClick={this.onLoginSubmit}>
                Log In
              </button> */}
              {/* Temporary while working on the front-end */}
              <Link to="/home" className="btn btn-primary">
                Log In
              </Link>
              <hr />
              <button className="btn btn-success" onClick={this.onOpenModal}>
                Create A New Account
              </button>
            </form>
          </div>
        </div>
        <Modal title="Title" animation={false} show={this.state.isOpen} centered={true}>
          <Modal.Header>
            <Modal.Title>Sign Up</Modal.Title>
            <button type="button" className="close" onClick={this.onCloseModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <input
                type="text"
                name="fullName"
                id="fullName"
                className="form-control"
                placeholder="Full Name"
                onChange={this.onChange}
              />
            </div>
            <div className="row">
              <input
                type="text"
                name="email"
                id="email"
                className="form-control"
                placeholder="Email address"
                onChange={this.onChange}
              />
            </div>
            <div className="row">
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="New password"
                onChange={this.onChange}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button className="btn btn-success" onClick={this.onRegisterSubmit}>
              Sign Up
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Landing;
