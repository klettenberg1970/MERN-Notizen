import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoggingFormular() {
    
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fehler, setFehler] = useState('');

  // handleLogin DIREKT in der Komponente, NICHT in useEffect!
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(username, password);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      
      const data = await response.json();
      console.log("Antwort vom Server:", data);
      
      // WICHTIG: Jetzt prüfst du die SERVER-Antwort, nicht mehr React!
      if (response.ok) {
        // Server sagt: Login OK
        navigate('/notizen');
      } else {
        // Server sagt: Login falsch
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
      {fehler && <p style={{color: 'red'}}>{fehler}</p>}
    </div>
  )
}