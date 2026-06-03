import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser, setToken, setUser, removeToken, removeUser, authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (getToken()) {
      authAPI.me()
        .then((data) => { setUser(data.user); setUserState(data.user); })
        .catch(() => { removeToken(); removeUser(); setUserState(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
    return data;
  };

  const register = async (name, email, password, company) => {
    const data = await authAPI.register(name, email, password, company);
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
    return data;
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
