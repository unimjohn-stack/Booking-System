import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import serviceRoutes from './routes/serviceRoute.js';
import bookingRoutes from './routes/bookingRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import availabilityRoutes from './routes/availabiilityRoutes.js';
import slotRoutes  from './routes/slotRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/customer/', customerRoutes);
app.use('/api/available/', availabilityRoutes);
app.use('/api/slots/', slotRoutes);

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