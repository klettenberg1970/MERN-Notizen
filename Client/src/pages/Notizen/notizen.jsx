import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ NEU: useLocation importiert
import Notizenausgeben from "./notizenausgeben";
import NotizenAdd from "./notizenAdd";

import '../../assets/formular.css';
import '../../assets/notizen.css';

// VITE Version der env-Variable
const API = import.meta.env.VITE_API_URL;

export default function Notizen() {
    // Hooks zum Abrufen des Navigations-States
    const location = useLocation(); // ✅ NEU: Hook verwenden

    // Initialer Benutzername wird aus dem Navigations-State gelesen
    // (wird gesetzt, wenn man von LoggingFormular kommt)
    const initialUsername = location.state?.loggedInUser || ''; 

    // States für Daten und Benutzer
    const [notice, setNotice] = useState([]);
    // ✅ NEU: username State mit dem initialen Wert aus dem Navigations-State setzen
    const [username, setUsername] = useState(initialUsername); 

    // **Helper-Funktion für die Fetch-Optionen**
    // Wird für alle Anfragen benötigt, die Autorisierung erfordern (Cookie-Übertragung)
    const fetchOptions = { credentials: 'include' };

    const loadNotizen = async () => {
        try {
            // AUTORISIERUNG: Cookies mitsenden
            const response = await fetch(`${API}/api/notes`, fetchOptions);
            
            // ... (Rest der Fehlerbehandlung bleibt gleich)
            if (response.status === 401) {
                // Wenn der Server 401 (Unauthorized) zurückgibt (z.B. Cookie abgelaufen)
                // Wir verwenden hier 'Gast', da der Navigations-State nur einmal gesetzt wird
                setUsername(location.state?.loggedInUser ? location.state.loggedInUser + ' (Session abgelaufen)' : 'Gast (Bitte neu einloggen)'); 
                setNotice([]); // Leere Notizen, da nicht autorisiert
                return;
            }

            const result = await response.json(); 
            
            // 1. Benutzernamen speichern (Falls das Cookie doch funktioniert, wird dieser Wert übernommen)
            if (result.username) {
                setUsername(result.username);
            }
            
            // 2. Notizen speichern (wir erwarten das Feld 'notizen')
            if (result.notizen) {
                setNotice(result.notizen);
            } else {
                 // Fängt den Fall ab, dass die Antwortstruktur nicht wie erwartet ist
                 console.error("Fehler: Unerwartete Datenstruktur vom Server.");
                 setNotice([]);
            }

        } catch (error) {
            console.error("Fehler beim Abrufen der Notizen:", error);
        }
    };

    // Zusätzlicher useEffect-Hook, um den Benutzernamen sofort zu setzen, wenn er über den State kommt
    useEffect(() => {
        if (location.state?.loggedInUser && username !== location.state.loggedInUser) {
            setUsername(location.state.loggedInUser);
        }
        loadNotizen();
    }, [location.state?.loggedInUser]); // Lädt Notizen beim ersten Rendern und wenn der Benutzer sich einloggt

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
            
            <h1 className="begruessung"> Notizen von {username || 'Gast'}</h1> {/* Anzeige des Benutzernamens */}
            
            <Notizenausgeben
                notice={notice}
                onDelete={handleDeleteFromChild}
                onEdit={handleBearbeiten}
            />

            <NotizenAdd
                notice={notice}
                onAdd={handleDatafromChild}
            />
        </div>
    );
}