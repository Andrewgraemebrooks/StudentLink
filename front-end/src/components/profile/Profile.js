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
    const { user } = this.props.user;
    const { profile, loading } = this.props.profile;

    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner animation="border" variant="danger" />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        profileContent = (
          <div className="text-center">
            <div className="bio">
              <h1 class="display-4">Handle</h1>
              <p className="lead">{profile.handle}</p>
              <h1 class="display-4">Bio</h1>
              <p className="lead">{profile.bio}</p>
              <h1 class="display-4">University</h1>
              <p className="lead">{profile.university}</p>
            </div>
          </div>
        );
      } else {
        // User is logged in but has no profile
        profileContent = (
          <div>
            <p className="lead text-muted text-center">Welcome {user.name} </p>
            <p>You have not yet set up a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-danger">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="profile text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-2">Profile</h1>
              {profileContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const addStateToProps = (state) => ({
  profile: state.profile,
  user: state.user,
});

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default connect(addStateToProps, { getCurrentProfile })(Profile);
