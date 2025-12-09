import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import Notizenausgeben from "./notizenausgeben";
import NotizenAdd from "./notizenAdd";
import Ausloggen from "./ausloggen";

import '../../assets/formular.css';
import '../../assets/notizen.css';

// VITE Version der env-Variable
const API = import.meta.env.VITE_API_URL;

export default function Notizen() {
    // Hooks zum Abrufen des Navigations-States
    const location = useLocation(); 
    
    // Initialer Benutzername aus dem Navigations-State holen (von LoggingFormular gesendet)
    const initialUsername = location.state?.loggedInUser || ''; 

    // States für Daten und Benutzer
    const [notice, setNotice] = useState([]);
    const [username, setUsername] = useState(initialUsername); 

    // **Helper-Funktion für die Fetch-Optionen**
    const fetchOptions = { credentials: 'include' };

    const loadNotizen = async () => {
        try {
            // AUTORISIERUNG: Cookies mitsenden
            const response = await fetch(`${API}/api/notes`, fetchOptions);
            
            if (response.status === 401) {
                // Wenn der Server 401 zurückgibt (z.B. Session abgelaufen)
                setUsername('Gast (Bitte neu einloggen)'); 
                setNotice([]); 
                return;
            }

            const result = await response.json(); 
            
            // 1. Benutzernamen speichern (wird auch verwendet, wenn das Cookie funktioniert)
            if (result.username) {
                setUsername(result.username);
            }
            
            // 2. Notizen speichern (wir erwarten das Feld 'notizen')
            if (result.notizen) {
                setNotice(result.notizen);
            } else {
                 console.error("Fehler: Unerwartete Datenstruktur vom Server.");
                 setNotice([]);
            }

        } catch (error) {
            console.error("Fehler beim Abrufen der Notizen:", error);
        }
    };

    // 🚨 KORRIGIERTER EFFECT FÜR MOBILE TIMING:
    useEffect(() => {
        
        // Timeout-ID zur späteren Bereinigung speichern
        let timeoutId;

        // Wir prüfen, ob wir gerade vom Login kommen ODER ob der Benutzername bereits bekannt ist.
        // Die Verzögerung ist nur beim initialen Laden nach dem Login notwendig.
        if (initialUsername || username) {
            
            // ✅ Die Verzögerung von 500ms gibt mobilen Browsern Zeit, 
            // das SameSite: 'None' Cookie sicher zu verarbeiten.
            timeoutId = setTimeout(() => {
                loadNotizen(); 
            }, 500); 

        } else {
            // Wenn der Benutzer bereits auf der Seite ist und kein State übergeben wurde (z.B. direktes Aufrufen der URL)
            loadNotizen(); 
        }

        // Cleanup-Funktion: Stoppt den Timer, falls die Komponente unmounted wird
        return () => clearTimeout(timeoutId);

    }, [initialUsername]); // Abhängigkeit von initialUsername, damit der Timer nur beim ersten Login triggert

    // **Hinzufügen einer Notiz (POST)**
    const handleDatafromChild = async (data) => {
        const response = await fetch(`${API}/api/notes/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            ...fetchOptions // AUTORISIERUNG: Cookies mitsenden
        });

        if (response.ok) {
            console.log("Notiz erfolgreich gespeichert");
            loadNotizen();
        }
    };

    // **Bearbeiten einer Notiz (PUT)**
    const handleBearbeiten = async (neueBeschreibung, notizId) => {
        const response = await fetch(`${API}/api/notes/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ neueBeschreibung, notizId }),
            ...fetchOptions // AUTORISIERUNG: Cookies mitsenden
        });

        if (response.ok) {
            console.log("Notiz erfolgreich verändert");
            loadNotizen();
        }
    };

    // **Löschen einer Notiz (DELETE)**
    const handleDeleteFromChild = async (notiz) => {
        const response = await fetch(`${API}/api/notes/delete/${notiz.id}`, {
            method: 'DELETE',
            ...fetchOptions // AUTORISIERUNG: Cookies mitsenden
        });

        if (response.ok) {
            console.log("Notiz erfolgreich gelöscht");
            loadNotizen();
        }
    };

    return (
        <div className="maincontainer">
            
            <h1 className="begruessung"> Notizen von {username || 'Gast'}</h1>
            
            <Notizenausgeben
                notice={notice}
                onDelete={handleDeleteFromChild}
                onEdit={handleBearbeiten}
            />

            <NotizenAdd
                notice={notice}
                onAdd={handleDatafromChild}
            />

            <Ausloggen/>
        </div>
    );
}