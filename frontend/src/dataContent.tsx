import React, { createContext, useState, useContext } from 'react';

// Create a context for the user data
const UserContext = createContext(null);

// Create a provider component for the user data
export const UserProvider = ({ children  }) => {
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');

    return (
        <UserContext.Provider value={{ role, setRole, username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};

// Create a hook to use the user data
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};