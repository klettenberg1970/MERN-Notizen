import { useState } from 'react';

export default function NotizenAdd({ notice, onAdd }) {
  // State für das Ausklappen des Formulars
  const [ausklappen, setAusklappen] = useState(false)

  // Handle Formular-Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Formulardaten sammeln
    const formData = new FormData(e.target);
    const neueNotiz = Object.fromEntries(formData);
    // Daten an Parent-Komponente weitergeben
    onAdd(neueNotiz);
    // Formular zurücksetzen
    e.target.reset();
    // Formular nach Absenden schließen
    setAusklappen(false);
  }

  // Toggle-Funktion für Ausklappen/Einklappen
  const toggleadd = () => {
    setAusklappen(prev => !prev);
  };

  return (
    <div className="formular-container" >
      {/* Button zum Öffnen/Schließen des Formulars */}
      <button onClick={toggleadd}>
        {ausklappen ? 'Abbrechen' : 'Hinzufügen'}
      </button>

      {/* Formular - wird nur angezeigt wenn ausklappen=true */}
      <form
        className="formular"
        onSubmit={handleSubmit}
        style={{
          display: ausklappen ? 'flex' : 'none',
          border: "1px solid black",
          marginTop: "10px"
        }}
      >
        {/* Container für bestehende Kategorien als Radio-Buttons */}
        <div className="radiobuttons" >
          {Object.keys(notice).map(kategorie => (
            <div key={kategorie} className="kategorien">
              <label htmlFor={kategorie}>{kategorie}</label>
              <input
                type="radio"
                name="category"
                id={kategorie}
                value={kategorie}
              />
            </div>
          ))}
        </div>
        
        {/* Section für neue Kategorie erstellen */}
        <div>
          <hr style={{
            borderTop: "1px solid grey"
          }} />
          <label htmlFor="neuRadio"> Neu:</label>
          {/* Radio-Button für neue Kategorie */}
          <input type="radio" name="category" value="new" id="neuRadio" />
          {/* Textfeld für Namen der neuen Kategorie */}
          <input type="text" name="newCategory" id="neuInput" placeholder="Bitte neue Kategorie eingeben" />
          <hr />
        </div>
      
        {/* Titel-Eingabe */}
        <label htmlFor="title">Titel:</label>
        <input type="text" name="title" id="title" placeholder="Bitte neuen Titel eingeben" />

        <hr />

        {/* Beschreibung-Eingabe */}
        <label htmlFor="beschreibung">Beschreibung:</label>
        <textarea name="description" id="beschreibung" rows="7" placeholder="Bitte Beschreibung eingeben" ></textarea>

        {/* Submit-Button */}
        <button type="submit">Hinzufügen</button>
      </form>
    </div>
  )
}