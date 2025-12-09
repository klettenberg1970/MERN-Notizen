import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function Ausloggen() {
    // Hook initialisieren
    const navigate = useNavigate(); 

    const logout = async () => {
        console.log("Logout-Button wurde geklickt");
        
        try {
            const response = await fetch(`${API}/api/login/out`, {
                method: 'POST',
                credentials: 'include' 
            });
            
            if (response.ok) {
                console.log("Erfolgreich ausgeloggt");
                
                // Weiterleitung zur Login-Seite
                navigate('/'); 
                
            } else {
                console.error("Logout fehlgeschlagen");
            }
        } catch (error) {
            console.error("Fehler beim Logout:", error);
        }
    }

    return (
        <div>
            <button
                // 🚨 IHR ORIGINALER STYLE WIEDERHERGESTELLT
                style={{
                    display: "block",
                    marginTop: "50vh",  
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: "20px",  
                    color: "#334466"
                }}
                onClick={logout}
            >
                Ausloggen
            </button>
        </div>
    )
}