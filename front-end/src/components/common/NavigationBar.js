import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import Proptypes from 'prop-types';

class NavigationBar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
    this.props.clearCurrentProfile();
    window.location.href = '/';
  }

  render() {
    return (
      <div>
        <Navbar bg='dark' variant='dark'>
          <Link className='navbar-brand' to='/'>StudentLink</Link>
          <Nav className='mr-auto'>
            <Link className='nav-link' to='/login'>
              Login
            </Link>
            <Link className='nav-link' to='/register'>
              Register
            </Link>
            <Link className='nav-link' to='/groups'>
              Groups
            </Link>
            <Link className='nav-link' to='/profile'>
              Profile
            </Link>
          </Nav>
          <Form inline>
            <FormControl
              type='text'
              placeholder='Search Profiles'
              className='mr-sm-2'
            />
            <Button variant='outline-light'>Search</Button>
          </Form>
        </Navbar>
      </div>
    );
  }
}

NavigationBar.propTypes = {
  logoutUser: Proptypes.func.isRequired,
  auth: Proptypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(NavigationBar);
