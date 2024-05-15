import React, { createContext, useState, useContext, useEffect } from 'react';

// UserContext to store the user's role
const UserContext = createContext<{ 
  user: { username: string, role: string } | null, 
  setUser: React.Dispatch<React.SetStateAction<{ username: string, role: string } | null>> | null,
  loading: boolean | null
}>({ user: null, setUser: null, loading: null });
// UserProvider component to provide the user's role to its children
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (username && role) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

//useUser hook to access the user's role
export function useUser() {
  return useContext(UserContext);
}