import React from 'react';

export const AppContext = React.createContext();

export const AppProvider = (props) => {
  const [user, setUser] = React.useState({
    username: 'JohnDoe',
    token: ''
  });

  return (
    <AppContext.Provider value={{ user: user, setUser: setUser }}>
      {props.children}
    </AppContext.Provider>
  );
};
