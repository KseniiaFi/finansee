// Sovelluksen pääreititys (React Router)
// Määrittelee kaikki sivut ja reitit
// Suojatut sivut (budjetit ja tapahtumat) vaativat kirjautumisen (PrivateRoute)
// Основная маршрутизация приложения (React Router)
// Определяет все страницы и маршруты
// Защищённые страницы (бюджеты и транзакции) требуют авторизации (PrivateRoute)


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BudgetsPage from './pages/BudgetsPage';
import PrivateRoute from './components/PrivateRoute';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Uudelleenohjaus kirjautumissivulle, jos käyttäjä menee juureen */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Julkiset sivut: kirjautuminen ja rekisteröinti */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Suojattu sivu: budjettilistaus */}
        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <BudgetsPage />
            </PrivateRoute>
          }
        />

        {/* Suojattu sivu: tietyn budjetin tapahtumat */}
        <Route
          path="/budgets/:id"
          element={
            <PrivateRoute>
              <TransactionsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
