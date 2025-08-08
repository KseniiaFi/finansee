// Käyttäjän kirjautumiskonteksti (React Context)
// Tallentaa kirjautumistiedot (token ja käyttäjä) ja tarjoaa kirjautumis- ja uloskirjautumistoiminnot

import { createContext, useContext, useState, useEffect } from "react";

// Käyttäjän kirjautumiskonteksti
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Kirjaudu ulos
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Kirjautumisen jälkeen: login-metodi voidaan kutsua LoginPage:stä
  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Kustomoitu hook kirjautumistiedon hakemiseen
export function useAuth() {
  return useContext(AuthContext);
}

// "children" tarkoittaa komponentin sisällä olevia lapsikomponentteja
// Tässä tapauksessa se tarkoittaa koko sovellusta, joka kääritään AuthProviderin sisään
