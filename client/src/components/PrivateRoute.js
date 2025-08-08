// Suojattu reitti: näyttää sisällön vain kirjautuneille käyttäjille (React Router + AuthContext)

import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

// Только для авторизованных пользователей. Проверяем, есть ли токен (вход выполнен). Если нет — редирект на логин
export default function PrivateRoute({ children }) {
  const { token } = useAuth(); // Tarkistetaan onko käyttäjä kirjautunut
  return token ? children : <Navigate to="/login" />; // Jos ei, ohjataan kirjautumissivulle
}
