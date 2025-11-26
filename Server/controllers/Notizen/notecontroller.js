import Note from "../../models/notizen.js"; 
import { NoteObject } from "./noteobject.js";

export const getNotizen = async (req, res) => {
  try {
    const notes = await Note.find(); 
    const notizen = await NoteObject(notes);
    res.json(notizen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNotizen = async (req, res) => {
  let { category, title, description, newCategory } = req.body;
  
  if (category === "new") {
    category = newCategory;
  }
  
  try {
    const note = await Note.create({ category, title, description });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteNotizen = async(req, res) => {
    const { id } = req.params;
    console.log("Lösche Notiz mit ID:", id);
    
    const note = await Note.findByIdAndDelete(id);
    res.status(200).json(note);
}

export const editNotizen = async (req, res) => {
  const { neueBeschreibung, notizId } = req.body;
  
  // Nur updaten ohne Rückgabe
  await Note.findByIdAndUpdate(notizId, {
    description: neueBeschreibung.description 
  });
  
  // Direkt gruppierte Daten zurückgeben
  const allNotes = await Note.find();
  const groupedNotes = await NoteObject(allNotes);
  
  res.status(200).json(groupedNotes);
}