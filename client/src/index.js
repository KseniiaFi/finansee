// Sovelluksen käynnistyspiste (index.js)
// Luo React-juurielementin ja käynnistää sovelluksen
// Koko sovellus kääritään AuthProvideriin, jotta kirjautumistiedot ovat käytettävissä kaikkialla
// StrictMode auttaa kehitysvaiheessa havaitsemaan virheitä
// Точка входа в приложение (index.js)
// Создаёт корневой React-элемент и запускает приложение
// Всё приложение оборачивается в AuthProvider, чтобы авторизация была доступна везде
// StrictMode помогает находить ошибки во время разработки


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
