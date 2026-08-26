import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.send("...Unim's API IS RUNNING");
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    })    
}

startServer();