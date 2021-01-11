import React from 'react';

export const AppContext = React.createContext();

export const AppProvider = (props) => {
  const [user, setUser] = React.useState({
    username: 'JohnDoe123',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  });

  return (
    <AppContext.Provider value={{ user: user, setUser: setUser }}>
      {props.children}
    </AppContext.Provider>
  );
};
