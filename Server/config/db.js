import mongoose from 'mongoose';

// 🚨 WICHTIGE ÄNDERUNG: dotenv wird HIER NICHT mehr importiert oder aufgerufen,
// da die server.js bereits alle Umgebungsvariablen geladen hat.

const connectDB = async () => {
    try {
        // Verbindet sich mit der URI aus process.env (geladen von server.js)
        const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI); 

        console.log(`✅ MongoDB erfolgreich verbunden: ${conn.connection.host}`);
    } catch (err) {
        // 🚨 KONTROLLIERTE FEHLERBEHANDLUNG:
        // Fängt den Verbindungsfehler ab und gibt eine klare Meldung aus.
        console.error(`❌ FATALER FEHLER BEIM START: MongoDB-Verbindung fehlgeschlagen: ${err.message}`);
        
        // Beendet den Node-Prozess kontrolliert mit Fehlerstatus 1.
        // Dies verhindert den unkontrollierten Absturz.
        process.exit(1); 
    }
};

export default connectDB;