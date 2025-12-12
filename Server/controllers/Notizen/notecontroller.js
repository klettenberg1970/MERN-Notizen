import Note from "../../models/notizen.js"; 
import { NoteObject } from "./noteobject.js";

// **1. NOTIZEN ABRUFEN (GET /api/notes)**
export const getNotizen = async (req, res) => {
    try {
        // Keine Authentifizierungsprüfung mehr
        
        console.log(`Notizen werden für ALLE Benutzer abgerufen (Unautorisiert).`);

        // Holt ALLE Notizen aus der Datenbank
        const notes = await Note.find(); 
        
        // Verarbeitet die Notizen in das gewünschte Format (z.B. Gruppierung nach Kategorie)
        const notizen = await NoteObject(notes);
        
        // Gibt die Notizen zurück
        res.json({
            notizen: notizen,
        });

    } catch (err) {
        // Bei Datenbank- oder Serverfehlern
        res.status(500).json({ message: err.message });
    }
};

// **2. NOTIZEN ERSTELLEN (POST /api/notes/add)**
export const createNotizen = async (req, res) => {
    let { category, title, description, newCategory } = req.body;
    
    // Logik zur Behandlung neuer Kategorien
    if (category === "new") {
        category = newCategory;
    }
    
    try {
        // Speichert die neue Notiz in der Datenbank
        const note = await Note.create({ category, title, description });
        res.status(201).json(note); // 201 Created
    } catch (err) {
        res.status(400).json({ message: err.message }); // 400 Bad Request bei Validierungsfehlern
    }
};

// **3. NOTIZEN LÖSCHEN (DELETE /api/notes/delete/:id)**
export const deleteNotizen = async(req, res) => {
    const { id } = req.params;
    console.log("Lösche Notiz mit ID:", id);
    
    try {
        const note = await Note.findByIdAndDelete(id);
        
        if (!note) {
            return res.status(404).json({ message: "Notiz nicht gefunden." });
        }
        
        res.status(200).json(note); // 200 OK
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// **4. NOTIZEN BEARBEITEN (PUT /api/notes/edit)**
export const editNotizen = async (req, res) => {
    const { neueBeschreibung, notizId } = req.body;
    
    try {
        // Aktualisiert die Beschreibung
        await Note.findByIdAndUpdate(notizId, {
            description: neueBeschreibung.description 
        });
        
        // Holt die vollständige, aktualisierte Liste zur sofortigen Anzeige im Frontend
        const allNotes = await Note.find();
        const groupedNotes = await NoteObject(allNotes);
        
        res.status(200).json(groupedNotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}