import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import noteRoutes from './routes/noteRoutes.js';
import logginRoutes from './routes/logginRoutes.js';

// **NEU:** Wir definieren die Hauptfunktion als async, um 'await' nutzen zu können
const startServer = async () => {
    
    // 1. Umgebungsvariablen laden
    dotenv.config();

    // 2. 🚨 KORREKTUR: Auf die Datenbankverbindung WARTEN
    // (connectDB ist async, daher muss hier await verwendet werden)
    await connectDB(); 

    const app = express();

    // --- Konfiguration für Cross-Origin Resource Sharing (CORS) ---

    // Definieren Sie die erlaubten Ursprünge
    const allowedOrigins = [
        // 1. Die Live-URL Ihres Frontends auf Render
        'https://notizen.onrender.com', 
        // 2. Ihre lokale Entwicklungs-URL (für lokale Tests)
        'http://localhost:5173', 
    ];

    // Konfigurieren Sie CORS
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        // Wichtig für Cookies
        credentials: true 
    };

    // CORS Middleware anwenden
    app.use(cors(corsOptions));

    // --- Middleware und Routen ---

    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/login', logginRoutes); 
    app.use('/api/notes', noteRoutes); 

    // 3. Server starten, nachdem die DB verbunden ist
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
};

// Startet die asynchrone Hauptfunktion und fängt Startfehler ab
startServer().catch(err => {
    console.error('FEHLER BEIM START DER ANWENDUNG:', err);
    process.exit(1);
});