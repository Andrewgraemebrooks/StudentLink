import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profileActions';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner animation="border" variant="danger" />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        profileContent = <h2>Display Profile</h2>;
      } else {
        // User is logged in but has no profile
        profileContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name} </p>
            <p>You have not yet set up a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-danger">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="Profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Profile</h1>
              {profileContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getCurrentProfile })(Profile);
