import fs from 'fs/promises';


const pfad = "C:/Users/User/Documents/Projekte/docs/json/links.json";

const getLinks = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/links');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
  }
};

async function jsonSpeichern(daten) {
  try {
    const jsonString = JSON.stringify(daten, null, 2);
    await fs.writeFile(pfad, jsonString);
    console.log('Daten erfolgreich gespeichert.');
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

// Funktion zur Transformation der Daten
function transformiereDaten(originalDaten) {
  const transformierteDaten = {};
  
  // Durchlaufe jede Kategorie
  for (const [kategorie, linksArray] of Object.entries(originalDaten)) {
    transformierteDaten[kategorie] = {};
    
    // Durchlaufe jedes Link-Objekt im Array
    for (const linkObj of linksArray) {
      transformierteDaten[kategorie][linkObj.name] = linkObj.url;
    }
  }
  
  return transformierteDaten;
}

async function main() {
  const links = await getLinks();
  
  if (links) {
    // Transformiere die Daten in das gewünschte Format
    const transformierteLinks = transformiereDaten(links);
    
    // Speichere die transformierten Daten
    await jsonSpeichern(transformierteLinks);
    
    console.log('Transformierte Daten:');
    console.log(transformierteLinks);
  }
}

main();