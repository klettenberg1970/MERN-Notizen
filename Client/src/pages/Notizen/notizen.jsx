import { useEffect, useState } from "react";
import Notizenausgeben from "./notizenausgeben";
import NotizenAdd from "./notizenAdd";
import Ausloggen from "./ausloggen";

import '../../assets/formular.css';
import '../../assets/notizen.css';

// VITE Version der env-Variable
const API = import.meta.env.VITE_API_URL;

export default function Notizen() {
    // States für Daten
    const [notice, setNotice] = useState([]);
    
    // Hardcodierter Name für die Überschrift
    const username = 'Stefan'; 

    // Helper-Funktion für die Fetch-Optionen (Cookies mitsenden)
    const fetchOptions = { credentials: 'include' }; 

    // **Laden der Notizen (GET)**
    const loadNotizen = async () => {
        try {
            const response = await fetch(`${API}/api/notes`, fetchOptions);
            
            if (response.status === 401) {
                console.warn("401 erhalten. Keine Cookie-Autorisierung gefunden.");
                setNotice([]); 
                return;
            }
            
            const result = await response.json(); 
            
            if (result.notizen) {
                setNotice(result.notizen);
            } else {
                 console.error("Fehler: 'notizen'-Feld fehlt in der Serverantwort.");
                 setNotice([]);
            }

        } catch (error) {
            console.error("Netzwerk- oder Verarbeitungsfehler beim Abrufen der Notizen:", error);
        }
    };

    // 🚨 EINMALIGER AUFRUF BEIM START
    useEffect(() => {
        loadNotizen(); 
    }, []); 

    // **Hinzufügen einer Notiz (POST)**
    const handleDatafromChild = async (data) => {
        const response = await fetch(`${API}/api/notes/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            ...fetchOptions // Cookies mitsenden (wenn der Server sie nicht prüft, ist es egal)
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
            ...fetchOptions // Cookies mitsenden
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
            ...fetchOptions // Cookies mitsenden
        });

        if (response.ok) {
            console.log("Notiz erfolgreich gelöscht");
            loadNotizen();
        }
    };

    return (
        <div className="maincontainer">
            
            <h1 className="begruessung"> Notizen von {username}</h1>
            
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