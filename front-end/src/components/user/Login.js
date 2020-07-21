import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/userActions';
import classnames from 'classnames';

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

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/profile');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/profile');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData);
  }

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div className="container">
          <div className="login">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">
                  Login into StudentLink
                </h1>
                <form onSubmit={this.onSubmit}>
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md12">
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
                          <div className="invalid-feedback">
                            {errors.email}{' '}
                          </div>
                        )}
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
                          <div className="invalid-feedback">
                            {errors.password}{' '}
                          </div>
                        )}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const addStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(addStateToProps, { loginUser })(Login);
