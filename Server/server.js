import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser'; // ⬅️ Wird importiert, aber nicht mehr genutzt (optional)

import connectDB from './config/db.js';

import noteRoutes from './routes/noteRoutes.js';
// import logginRoutes from './routes/logginRoutes.js'; // 🚨 AUSKOMMENTIERT: Login-Routen deaktiviert

// **NEU:** Wir definieren die Hauptfunktion als async, um 'await' nutzen zu können
const startServer = async () => {
    
    // 1. Umgebungsvariablen laden
    dotenv.config();

    // 2. Datenbankverbindung
    await connectDB(); 

    const app = express();

    // --- Konfiguration für Cross-Origin Resource Sharing (CORS) ---
    // (Bleibt unverändert, da es für die Kommunikation zwischen Render-Subdomains wichtig ist)
    const allowedOrigins = [
        'https://notizen.onrender.com', 
        'http://localhost:5173', 
    ];

    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true 
    };

    app.use(cors(corsOptions));

    // --- Middleware und Routen ---

    app.use(express.json());
    // app.use(cookieParser()); // 🚨 OPTIONAL: Kann auskommentiert werden, da wir Cookies ignorieren

    // 🚨 KORRIGIERT: Login-Routen deaktiviert
    // app.use('/api/login', logginRoutes); 
    
    // Notizen-Routen MÜSSEN aktiv bleiben
    app.use('/api/notes', noteRoutes); 

    // 3. Server starten
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
};

// Startet die asynchrone Hauptfunktion und fängt Startfehler ab
startServer().catch(err => {
    console.error('FEHLER BEIM START DER ANWENDUNG:', err);
    process.exit(1);
});