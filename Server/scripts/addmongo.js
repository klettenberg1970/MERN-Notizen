

const addmongo = async () => {
  const response = await fetch('http://localhost:5000/api/notes/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: "Anschaffung",
      title: "Heißluftfriteuse",
      description: "maximal 100 Euro"
    })
  });

  const data = await response.json();
  console.log("Antwort vom Server:", data);
};

addmongo();
