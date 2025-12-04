import { useEffect, useState } from "react"
import Notizenausgeben from "./notizenausgeben"
import NotizenAdd from "./notizenAdd";

import '../../assets/formular.css'
import '../../assets/notizen.css'


export default function Notizen() {
    const [notice, setNotice] = useState([]);
    useEffect(() => {

        const getNotizen = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/notes');
                const data = await response.json();
               
                setNotice(data);
            } catch (error) {
                console.error("Fehler beim Abrufen:", error);
            }
        };
        getNotizen();

    }, [])

const handleDatafromChild = async (data) => {
    const response = await fetch('http://localhost:5000/api/notes/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        console.log("Notiz erfolgreich gespeichert");
        const updatedResponse = await fetch('http://localhost:5000/api/notes');
        const updatedData = await updatedResponse.json();
        setNotice(updatedData);
    }
}

const handleBearbeiten = async (neueBeschreibung, notizId) => {
  console.log(neueBeschreibung, notizId);
 const response = await fetch('http://localhost:5000/api/notes/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({neueBeschreibung, notizId})
    });

      if (response.ok) {
        console.log("Notiz erfolgreich verändert");
        const updatedResponse = await fetch('http://localhost:5000/api/notes');
        const updatedData = await updatedResponse.json();
        setNotice(updatedData);
    }

}

    const handleDeleteFromChild = async (notiz) => {
        console.log("Komplette Notiz vom Child:", notiz);
        console.log("ID:", notiz.id);
        console.log("Titel:", notiz.title);
        console.log("Kategorie:", notiz.category);
        console.log("Beschreibung:", notiz.description);
        const response = await fetch(`http://localhost:5000/api/notes/delete/${notiz.id}`, {
            method: 'DELETE'
        } );

   if (response.ok) {
            console.log("Notiz erfolgreich gelöscht");
            const updatedResponse = await fetch('http://localhost:5000/api/notes');
            const updatedData = await updatedResponse.json();
            setNotice(updatedData);
        }
    }

    return (
        <div className="maincontainer">

            <Notizenausgeben
                notice={notice} onDelete={handleDeleteFromChild} onEdit={handleBearbeiten}/>

            <NotizenAdd notice={notice} onAdd={handleDatafromChild} />





        </div>
    )
}