import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: '',
      university: '',
      bio: '',
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newProfile = {
      handle: this.state.handle,
      university: this.state.university,
      bio: this.state.bio,
    };

    this.props.createProfile(newProfile, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create your profile</h1>

              <form noValidate onSubmit={this.onSubmit}>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md12">
                    <div className="form-group">
                      <input
                        type="text"
                        name="handle"
                        id="handle"
                        className={classnames('form-control input-sm', {
                          // is-valid will only exist if errors.handle exists
                          'is-invalid': errors.handle,
                        })}
                        placeholder="Handle"
                        value={this.state.handle}
                        onChange={this.onChange}
                      />
                      {/* If there is an error, returns the error underneath the input field */}
                      {errors.handle && (
                        <div className="invalid-feedback">{errors.handle} </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="university"
                    id="university"
                    className={classnames('form-control input-sm', {
                      // is-valid will only exist if errors.university exists
                      'is-invalid': errors.university,
                    })}
                    placeholder="University"
                    value={this.state.university}
                    onChange={this.onChange}
                  />
                  {/* If there is an error, returns the error underneath the input field */}
                  {errors.university && (
                    <div className="invalid-feedback">{errors.university} </div>
                  )}
                </div>
                <div className="form-group">
                  <textarea
                    name="bio"
                    id="bio"
                    className={classnames('form-control input-sm', {
                      'is-invalid': errors.bio,
                    })}
                    rows="5"
                    placeholder="Biography"
                    value={this.state.bio}
                    onChange={this.onChange}
                  />
                  {/* If there is an error, returns the error underneath the input field */}
                  {errors.bio && (
                    <div className="invalid-feedback">{errors.bio} </div>
                  )}
                </div>
                <input
                  type="submit"
                  value="Create Profile"
                  className="btn btn-info btn-block btn-danger"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const addStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(addStateToProps, { createProfile })(
  withRouter(CreateProfile)
);
