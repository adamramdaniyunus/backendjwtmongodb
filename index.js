import express from 'express'
import cors from 'cors'
import db from './config/Database.js'
import route from './routes/index.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(cookieParser());
app.use(express.json())
app.use(route);

db.on('error', (error) => console.log(error));
db.once('open', () => {
    console.log("Database Conected")
});

app.listen(process.env.APP_PORT, () => {
    console.log("Server Running");
})