import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import connectDB from './config/db.js';

import noteRoutes from './routes/noteRoutes.js';
import logginRoutes from './routes/logginRoutes.js';

dotenv.config();
connectDB(); // mit MongoDB verbinden

const app = express();
app.use(cors());  
app.use(express.json());


app.use('/api/login', logginRoutes); 
app.use('/api/notes', noteRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
