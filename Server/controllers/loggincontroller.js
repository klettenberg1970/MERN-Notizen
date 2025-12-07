export async function checkPassword(req, res) {
    try {
        console.log('Login-Request empfangen:', req.body);

        const { username, password } = req.body;

        // Hier die Überprüfung (später mit Datenbank)
        if (username === 'Stefan' && password === '123') {
            
            // NEU: Cookie setzen
            // Wir verwenden 'res.cookie(name, wert, optionen)'
            res.cookie('user', username, {
                httpOnly: true,        // Cookie ist nur über HTTP/S zugänglich (wichtig für Sicherheit)
                maxAge: 1000 * 60 * 60 * 24, // Ablauf nach 24 Stunden (optional)
                secure: process.env.NODE_ENV === 'production', // Cookie nur über HTTPS senden (auf Render aktiv)
                sameSite: 'Lax',       // Schutz vor CSRF-Angriffen
            });

            res.json({
                message: 'Login erfolgreich',
                // Optional: Senden Sie den Benutzernamen auch in der JSON-Antwort
                username: username 
            });
        } else {
            res.status(401).json({
                message: 'Falscher Benutzername oder Passwort'
            });
        }
    } catch (error) {
        console.error('Fehler im Controller:', error);
        res.status(500).json({
            message: 'Serverfehler'
        });
    }
}