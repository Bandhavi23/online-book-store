import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('bs_token');
    const storedUser = localStorage.getItem('bs_user');
    const storedRole = localStorage.getItem('bs_role');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData, roleVal) => {
    setToken(tokenVal);
    setUser(userData);
    setRole(roleVal);
    localStorage.setItem('bs_token', tokenVal);
    localStorage.setItem('bs_user', JSON.stringify(userData));
    localStorage.setItem('bs_role', roleVal);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('bs_token');
    localStorage.removeItem('bs_user');
    localStorage.removeItem('bs_role');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
