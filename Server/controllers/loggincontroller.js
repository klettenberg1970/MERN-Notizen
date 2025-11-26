export async function checkPassword(req, res) {
    try {
        console.log('Login-Request empfangen:', req.body);

        const { username, password } = req.body;

        // Hier die Überprüfung (später mit Datenbank)
        if (username === 'test' && password === '123') {
            res.json({

                message: 'Login erfolgreich'
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