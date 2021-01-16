import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
/**
 * A sidebar component
 * @param {Object[]} items - The sidebar items.
 */
function Sidebar(props) {
  return (
    <div className="sidebar bg-light">
      <Link className="sidebar-heading navbar-brand text-dark" to="/">
        StudentLink
      </Link>
      <ListGroup className="list-group-flush">
        {props.items.map(({ label, name }) => (
          <ListGroup.Item
            className="bg-light"
            key={name}
            action
            onClick={alert}
          >
            {label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Sidebar;
