import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import connectDB from './config/db.js';

import noteRoutes from './routes/noteRoutes.js';
import logginRoutes from './routes/logginRoutes.js';

dotenv.config();
connectDB(); // mit MongoDB verbinden

const app = express();
// app.use(cors());  

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
        // Erlaubt Anfragen, wenn der Ursprung in der Liste ist oder wenn es keine Origin-Angabe gibt (z.B. bei Tools wie Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Verweigert den Zugriff für alle anderen Domains
            callback(new Error('Not allowed by CORS'));
        }
    },
    // Wichtig, falls Sie Cookies, Authentifizierungs-Header oder Sitzungen verwenden
    credentials: true 
};

app.use(cors(corsOptions));


app.use(express.json());


app.use('/api/login', logginRoutes); 
app.use('/api/notes', noteRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
