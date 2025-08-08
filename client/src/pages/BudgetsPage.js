// Budjetointisivu: käyttäjä voi lisätä ja poistaa budjettijaksoja (kuukausi/vuosi)
// Tämä komponentti käyttää Reactin hookeja (useState, useEffect) ja Axiosia API-pyyntöihin
// Kirjautumistiedot haetaan AuthContextista
// Страница бюджетов: добавление, удаление и просмотр списков по месяцу и году
// Используем React-хуки и axios для связи с сервером
// Доступ только для авторизованных (через AuthContext)

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";


function BudgetsPage() {
  const { token, logout, user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Haetaan kaikki budjetit, kun sivu latautuu
  // Получаем все бюджеты при загрузке
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setBudgets(res.data))
      .catch(() => setBudgets([]));
  }, [token]);

  // Lisää uusi budjetti
  // Добавить новый бюджет
  const handleAddBudget = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!month || !year) {
      setError("Valitse kuukausi ja vuosi.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/budgets", {
        month: Number(month),
        year: Number(year),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Budjetti lisätty!");
      setBudgets([res.data, ...budgets]);
      setMonth(""); setYear("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message)
        setError(err.response.data.message);
      else setError("Virhe budjetin lisäyksessä.");
    }
  };

  // Poista budjetti
  // Удалить бюджет 
  const handleDeleteBudget = async (id) => {
    setError(""); setSuccess("");
    if (!window.confirm("Haluatko varmasti poistaa tämän budjetin?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(budgets.filter(b => b.id !== id));
      setSuccess("Budjetti poistettu!");
    } catch (err) {
      setError("Virhe poistettaessa budjettia.");
    }
  };

  // Kirjaudu ulos
  // Выход
  const handleLogout = () => {
    logout();
  };

  // Kuukausien lista
  // Список месяцев
  const months = [
    "tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu",
    "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"
  ];

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", padding: 24, boxShadow: "0 0 16px #eee", borderRadius: 10 }}>
      <h2>Tervetuloa, {user?.email}!</h2>
      <button onClick={handleLogout} style={{ float: "right", marginTop: -40, background: "#eee", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>
        Kirjaudu ulos
      </button>

      <h3>Lisää uusi budjetti</h3>
      <form onSubmit={handleAddBudget} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: 8, borderRadius: 4 }}>
          <option value="">Kuukausi</option>
          {months.map((name, idx) => (
            <option key={idx} value={idx + 1}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Vuosi"
          value={year}
          onChange={e => setYear(e.target.value)}
          min="2020"
          max="2100"
          style={{ width: 90, padding: 8, borderRadius: 4 }}
        />
        <button type="submit" style={{ padding: "8px 18px", background: "#00875A", color: "#fff", border: "none", borderRadius: 4 }}>
          Lisää
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 12 }}>{success}</div>}

      <h3>Budjetit</h3>
      {budgets.length === 0 ? (
        <div>Ei budjetteja vielä.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9f9f9" }}>
              <th style={{ textAlign: "left", padding: 8 }}>Kuukausi</th>
              <th style={{ textAlign: "left", padding: 8 }}>Vuosi</th>
              <th style={{ padding: 8 }}>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(b => (
              <tr key={b.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{months[b.month - 1]}</td>
                <td style={{ padding: 8 }}>{b.year}</td>
                <td style={{ padding: 8, textAlign: "center" }}>
                  {/* Painike budjetin yksityiskohtiin siirtymistä varten */}
                   <button
                     style={{ background: "#eee", border: "none", borderRadius: 5, padding: "4px 10px", marginRight: 5 }}
                     onClick={() => navigate(`/budgets/${b.id}`)}
                     >
                       Avaa
                     </button>

                  {/* Roskakorikuvake poistamista varten */}
                  <button
                    onClick={() => handleDeleteBudget(b.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 2,
                      verticalAlign: "middle"
                    }}
                    title="Poista budjetti"
                  >
                    <svg width="18" height="18" fill="none" stroke="#B00" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="6" y="9" width="12" height="10" rx="2" />
                      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
                      <line x1="10" y1="13" x2="10" y2="17" />
                      <line x1="14" y1="13" x2="14" y2="17" />
                      <line x1="4" y1="9" x2="20" y2="9" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BudgetsPage;
