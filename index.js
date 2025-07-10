import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', router)
const SERVER_PORT = process.env.PORT


app.listen(SERVER_PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${SERVER_PORT}`);
});