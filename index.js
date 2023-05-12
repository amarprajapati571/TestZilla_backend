
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import os from 'os'
import connectDB from './configs/DBConfig.js';
import AdminRoutes from './Routes/AdminRoutes.js';
// import CMSRoutes from './Routes/CMSRoutes.js';

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// CORS Policy
app.use(cors())

// Database Connection
connectDB(DATABASE_URL)

// JSON
app.use(express.json())

// Load Routes
app.use("/admin", AdminRoutes);
// app.use("/CMS", CMSRoutes);
const loadAvg = os.loadavg();

// Log the load averages
console.log('1-minute load average:', loadAvg[0]);
console.log('5-minute load average:', loadAvg[1]);
console.log('15-minute load average:', loadAvg[2]);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})