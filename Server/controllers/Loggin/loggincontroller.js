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


export async function loggout(req, res) {
    console.log("Es wird ausgeloggt (Backend)");
    
    try {
        // 1. **Cookie löschen**
        // res.clearCookie(Name des Cookies, Optionen)
        // WICHTIG: Die Optionen (secure, sameSite) MÜSSEN mit denen übereinstimmen, 
        // die beim Setzen des Cookies verwendet wurden!
        res.clearCookie('user', {
            httpOnly: true,        
            secure: true, 
            sameSite: 'None', 
        });

        // 2. **Erfolgsbestätigung senden**
        // Wir senden eine 200er-Antwort zurück an das Frontend
        res.status(200).json({
            message: 'Erfolgreich abgemeldet. Cookie gelöscht.'
        });

    } catch (error) {
        console.error('Fehler beim Logout-Controller:', error);
        res.status(500).json({
            message: 'Serverfehler beim Logout'
        });
    }
}