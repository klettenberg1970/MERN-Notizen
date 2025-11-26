// Hilfsfunktion für deutsches Datum
function formatGermanDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export async function NoteObject(notizen) {
  let noteobject = {};
  
  for (const element of notizen) {
    if (!noteobject[element.category]) {
      noteobject[element.category] = [];
    }
    
    const note = {
      id: element._id,
      title: element.title,
      description: element.description,
      date: formatGermanDate(element.updatedAt?.$date || element.updatedAt)
      
    };
    
    noteobject[element.category].push(note);
  }
  
 
  return noteobject;
}