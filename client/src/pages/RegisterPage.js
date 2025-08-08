// Rekisteröintisivu: käyttäjä syöttää sähköpostin ja kaksi salasanaa
// Jos tiedot ovat oikein, luodaan uusi käyttäjä ja siirrytään kirjautumissivulle
// Käytetään Reactin hookeja (useState), Axiosia ja React Routerin navigointia


import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // показать/скрыть пароль. Näytä/piilota salasana

  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !password2) {
      setError("Täytä kaikki kentät.");
      return;
    }
    if (password !== password2) {
      setError("Salasanat eivät täsmää.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });
      setSuccess("Käyttäjä luotu onnistuneesti! Kirjaudu sisään.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Rekisteröinnissä tapahtui virhe.");
      }
    }
  };

  // Чёрно-белый SVG-глаз (открытый). Mustavalkoinen SVG-silmä (avoin)
  const EyeOpen = (
    <svg width="22" height="22" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="9" ry="7" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  // Чёрно-белый SVG-глаз (закрытый, перечёркнутый). Mustavalkoinen SVG-silmä (suljettu, yliviivattu)
  const EyeClosed = (
    <svg width="22" height="22" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="9" ry="7" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="21" x2="21" y2="3" />
    </svg>
  );

  // Стиль для кнопки-глазика. Tyyli silmäpainikkeelle
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

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 24, boxShadow: "0 0 16px #eee", borderRadius: 8 }}>
      <h2>Rekisteröidy</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8, boxSizing: "border-box" }}
        />
        <div style={{ position: "relative", marginBottom: 12 }}>
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
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Toista salasana"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            style={{ width: "100%", padding: 8, paddingRight: 36, boxSizing: "border-box" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            style={eyeButtonStyle}
            tabIndex={-1}
            aria-label={showPassword2 ? "Piilota salasana" : "Näytä salasana"}
          >
            {showPassword2 ? EyeOpen : EyeClosed}
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
          Rekisteröidy
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 12 }}>{success}</div>}
      </form>
      <div style={{ marginTop: 18 }}>
        Onko sinulla jo tili? <Link to="/login">Kirjaudu sisään</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
