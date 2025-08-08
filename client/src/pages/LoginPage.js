// Tämä on kirjautumissivu Finansee-sovelluksessa.
// Käyttäjä syöttää sähköpostin ja salasanan.
// Jos kirjautuminen onnistuu, token ja käyttäjän tiedot tallennetaan selaimen localStorageen.
// Sitten siirrytään budjettisivulle.


import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /// SVG-kuvakkeet silmäpainikkeelle
  // SVG-иконки глазика
  const EyeOpen = (
    <svg width="22" height="22" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="9" ry="7" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  const EyeClosed = (
    <svg width="22" height="22" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="9" ry="7" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="21" x2="21" y2="3" />
    </svg>
  );
  const eyeButtonStyle = {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    margin: 0,
    lineHeight: 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Täytä kaikki kentät.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Tallennetaan token ja käyttäjän tiedot localStorageen
      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Siirrytään budjetit-sivulle
      // Переходим к бюджетам
      navigate("/budgets");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Kirjautuminen epäonnistui.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 24, boxShadow: "0 0 16px #eee", borderRadius: 8 }}>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8, boxSizing: "border-box" }}
        />
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Salasana"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, paddingRight: 36, boxSizing: "border-box" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={eyeButtonStyle}
            tabIndex={-1}
            aria-label={showPassword ? "Piilota salasana" : "Näytä salasana"}
          >
            {showPassword ? EyeOpen : EyeClosed}
          </button>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#00875A",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            boxSizing: "border-box",
          }}
        >
          Kirjaudu sisään
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 18 }}>
        Ei vielä tiliä? <Link to="/register">Rekisteröidy</Link>
      </div>
    </div>
  );
}

export default LoginPage;
