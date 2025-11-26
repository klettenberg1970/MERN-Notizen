

const getmongo = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/notes');
    const data = await response.json();
    console.log("Alle Links:", data);
  } catch (error) {
    console.error("Fehler beim Abrufen:", error);
  }
};

getmongo();
