import { useEffect, useState } from "react";
import Notizenausgeben from "./notizenausgeben";
import NotizenAdd from "./notizenAdd";

import '../../assets/formular.css';
import '../../assets/notizen.css';

// VITE Version der env-Variable
const API = import.meta.env.VITE_API_URL;

export default function Notizen() {
    const [notice, setNotice] = useState([]);

    const loadNotizen = async () => {
        try {
            const response = await fetch(`${API}/api/notes`);
            const data = await response.json();
            setNotice(data);
        } catch (error) {
            console.error("Fehler beim Abrufen:", error);
        }
    };

    useEffect(() => {
        loadNotizen();
    }, []);

    const handleDatafromChild = async (data) => {
        const response = await fetch(`${API}/api/notes/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log("Notiz erfolgreich gespeichert");
            loadNotizen();
        }
    };

    const handleBearbeiten = async (neueBeschreibung, notizId) => {
        const response = await fetch(`${API}/api/notes/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ neueBeschreibung, notizId })
        });

        if (response.ok) {
            console.log("Notiz erfolgreich verändert");
            loadNotizen();
        }
    };

    const handleDeleteFromChild = async (notiz) => {
        const response = await fetch(`${API}/api/notes/delete/${notiz.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log("Notiz erfolgreich gelöscht");
            loadNotizen();
        }
    };

    return (
        <div className="maincontainer">
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