import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

/**
 * A sidebar component
 * @param {Object[]} items - The sidebar items.
 */
function Sidebar(props) {
  return (
    <List>
      {props.items.map(({ label, name }) => (
        <ListItem key={name} button>
          <ListItemText>{label}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export default Sidebar;
