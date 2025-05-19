import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import docRouter from './routes/docRouter.js';
import cors from 'cors'


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded())


app.use('/doc', docRouter)

app.use('/', (async (req, res) => {
    console.log("hello")
}))

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
