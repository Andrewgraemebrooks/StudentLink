import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { AppContext } from '../../AppContext';
import { Link } from 'react-router-dom';

function Header(props) {
  const user = React.useContext(AppContext).user;
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav>
          <Link className="nav-link" to="/">
            {user.username}
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
