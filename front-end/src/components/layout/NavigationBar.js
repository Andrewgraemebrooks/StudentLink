import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

class NavigationBar extends Component {
  render() {
    return (
      <div>
        <Navbar bg='dark' variant='dark'>
          <Navbar.Brand href='#home'>StudentLink</Navbar.Brand>
          <Nav className='mr-auto'>
            <Nav.Link href='#loginregister'>Login / Register</Nav.Link>
            <Nav.Link href='#groups'>Groups</Nav.Link>
            <Nav.Link href='#profile'>Profile</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type='text' placeholder='Search Profiles' className='mr-sm-2' />
            <Button variant='outline-light'>Search</Button>
          </Form>
        </Navbar>
      </div>
    );
  }
}

export default NavigationBar;
