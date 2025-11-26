import fs from 'fs/promises';

const pfad = "C:/Users/User/Documents/Projekte/docs/json/links.json";

async function linksLaden() {
    try {
        const data = await fs.readFile(pfad, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Fehler beim Laden der JSON-Datei:", error);
        return {};
    }
}

const addLink = async (kategorie, name, url) => {
    try {
        const response = await fetch('http://localhost:5000/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: kategorie,
                name: name,
                url: url
            })
        });
        const data = await response.json();
        console.log("Antwort vom Server:", data);
    } catch (error) {
        console.error("Fehler beim Senden der Daten an den Server:", error);
    }
};

async function Links() {
    const links = await linksLaden();
    // Gehe jede Kategorie durch
    for (const [kategorie, inhalte] of Object.entries(links)) {
        console.log(`Kategorie: ${kategorie}`);
        // Gehe jeden Eintrag in der Kategorie durch
        for (const [name, url] of Object.entries(inhalte)) {
            console.log(`  Name: ${name}`);
            console.log(`  URL: ${url}`);
            await addLink(kategorie, name, url); // Wichtig: 'await' verwenden
        }
    }
}

Links();
