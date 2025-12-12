import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom"; // Nicht mehr benötigt
import Notizenausgeben from "./notizenausgeben";
import NotizenAdd from "./notizenAdd";
import Ausloggen from "./ausloggen";

import '../../assets/formular.css';
import '../../assets/notizen.css';

// VITE Version der env-Variable
const API = import.meta.env.VITE_API_URL;

export default function Notizen() {
    // States für Daten und Benutzer
    const [notice, setNotice] = useState([]);
    
    // 🚨 KORREKTUR: Standard-Benutzername "Stefan" oder "Gast" (falls der Cookie-Abruf fehlschlägt)
    const [username, setUsername] = useState('Stefan'); 

    // Helper-Funktion für die Fetch-Optionen (Cookies mitsenden)
    const fetchOptions = { credentials: 'include' };

    const loadNotizen = async () => {
        try {
            // AUTORISIERUNG: Cookies mitsenden
            const response = await fetch(`${API}/api/notes`, fetchOptions);
            
            // Fehlerbehandlung: Wenn 401 kommt, wird der statische Name beibehalten
            if (response.status === 401) {
                console.warn("401 erhalten. Keine Cookie-Autorisierung gefunden.");
                setNotice([]); 
                // Der username bleibt hier "Stefan"
                return;
            }

            const result = await response.json(); 
            
            // 1. Benutzernamen speichern (Wird nur ausgeführt, wenn das Cookie vom Server erkannt wurde)
            if (result.username) {
                setUsername(result.username);
            }
            
            // 2. Notizen speichern
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

    // 🚨 KORRIGIERTER EFFECT: Sofortiger, einmaliger Aufruf beim Laden
    useEffect(() => {
        loadNotizen(); 
        
    }, []); // Lädt nur einmal beim Starten der Komponente

    // **Hinzufügen einer Notiz (POST)**
    const handleDatafromChild = async (data) => {
        const response = await fetch(`${API}/api/notes/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            ...fetchOptions // Cookies mitsenden
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
            
            {/* 🚨 KORREKTUR: Zeigt den gesetzten Namen "Stefan" an */}
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