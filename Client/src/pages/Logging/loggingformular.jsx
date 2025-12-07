import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoggingFormular() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fehler, setFehler] = useState('');

  // Lese die Base URL aus der Umgebungsvariable
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(username, password);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        }),
        // 🚨 WICHTIG: Erlaubt dem Browser, Cookies an den Server zu senden und empfangene Cookies (vom Backend gesetzt) zu speichern.
        credentials: 'include'
      });

      const data = await response.json();
      console.log("Antwort vom Server:", data);

      if (response.ok) {
        // 🚨 ÄNDERUNG: Übergibt den Benutzernamen direkt über den State an die nächste Route
        navigate('/notizen', { state: { loggedInUser: username } });
      } else {
        setFehler(data.message || 'Falscher Benutzername oder Passwort!');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Fehler:', error);
      setFehler('Verbindung zum Server fehlgeschlagen');
    }
  };

  return (
    <div className="loggingcontainer">
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Einloggen</button>
      </form>
      {fehler && <p style={{ color: 'red' }}>{fehler}</p>}
    </div>
  )
}