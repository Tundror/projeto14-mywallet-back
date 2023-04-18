import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import dayjs from "dayjs"
import Joi from "joi"

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))


const port = 5000
app.listen(5000, () => console.log(`servidor rodando na porta ${port}`))