import { useState } from "react"



import { Farbarray } from "../../data/farben";

export default function Notizenausgeben({ notice, onDelete, onEdit }) {
    const [katausklappen, setKatAusklappen] = useState(null);
    const [titleausklappen, setTitleAusklappen] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const farben = Farbarray();
   

    const handleDelete = (notiz) => {
        onDelete(notiz); // ✅ Wichtig: An Parent weitergeben!
    };

    function handleedit() {

        setIsEditing(true);
        console.log(isEditing)
    }

    const handleSubmit = (e, notizId) => {  // ✅ Notiz-ID als Parameter
        e.preventDefault();
        const formData = new FormData(e.target);
        const neueBeschreibung = Object.fromEntries(formData);
        console.log(neueBeschreibung);
        onEdit(neueBeschreibung, notizId);  // ✅ ID mit übergeben
        setIsEditing(false);  // ✅ Korrekte State-Setter Funktion
    }

    const togglekatbearbeiten = (kategorie) => {
        setKatAusklappen(prev =>
            prev === kategorie ? null : kategorie
        );
    };

    const toggletitlebearbeiten = (notizId) => {
        setTitleAusklappen(prev =>
            prev === notizId ? null : notizId
        );
    };

    return (
        <div className="card">
            {Object.keys(notice).map((kategorie, index) => (
                <div key={kategorie}>
                    <button
                        onClick={() => togglekatbearbeiten(kategorie)}
                        style={{
                            backgroundColor: farben[index] ,
                            color: "black"
                        }}
                    >
                        {kategorie}

                    </button>

                    <div style={{
                        display: katausklappen === kategorie ? 'block' : 'none',
                        border: "1px solid black"
                    }}>
                        {notice[kategorie].map(notiz => (
                            <div key={notiz.id}>

                                <button
                                    onClick={() => toggletitlebearbeiten(notiz.id)}
                                >{notiz.title}</button>
                                <div style={{
                                    display: titleausklappen === notiz.id ? 'block' : 'none',
                                    border: "1px solid black"
                                }}>
                                    <h6>{notiz.date}</h6>
                                    <hr />

                                    {isEditing ? (
                                        <form onSubmit={(e) => handleSubmit(e, notiz.id)}>  {/* ✅ ID übergeben */}
                                            <textarea name="description" defaultValue={notiz.description}></textarea>
                                            <button type="submit">Speichern</button>
                                        </form>
                                    ) : (
                                        <div className="description">
                                             <p>{notiz.description}</p>
                                        </div>
                                       
                                    )}
                                    <div className="notizbuttons">
                                        <button onClick={() => handleDelete(notiz)}>Löschen</button>
                                        <button onClick={handleedit}>Bearbeiten</button>

                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}