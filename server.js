import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
    const telegramId = req.query.id || 'Not provided';
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("*", (req, res) => {
    res.status(200).json({ message: "Invalid Route" });
});

app.use((err, req, res, next) => {
    err.status = err.status || 505;
    res.status(err.status).json({ con: false, "message": err.message });
});