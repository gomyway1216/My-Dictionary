import React, { createContext,useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { auth, signInWithEmail, signOutUser } 
  from '../Firebase/firebaseConnect';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signIn = (email, password) => {
    return signInWithEmail(email, password);
  };

  const signOut = () => {
    signOutUser();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any
};