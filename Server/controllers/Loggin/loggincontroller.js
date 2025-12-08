export async function checkPassword(req, res) {
    try {
        console.log('Login-Request empfangen:', req.body);

        const { username, password } = req.body;

        // Hier die Überprüfung (später mit Datenbank)
        if ((username.toLowerCase() === 'stefan') && password === '123') {
            
            // NEU: Cookie setzen
            // Wir verwenden 'res.cookie(name, wert, optionen)'
            res.cookie('user', username, {
                httpOnly: true,        
                maxAge: 1000 * 60 * 60 * 24, 
                secure:  true, 
                
                sameSite: 'None',       
            });

            res.json({
                message: 'Login erfolgreich',
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