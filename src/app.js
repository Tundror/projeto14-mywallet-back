import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import Joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import dayjs from "dayjs"

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => {
        db = mongoClient.db()
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err)
    })

const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
})
const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
})
const transactionSchema = Joi.object({
    value: Joi.number().precision(2).positive().required(),
    description: Joi.string().required(),
    type: Joi.string().valid("in", "out").required()
})

app.post("/sign-up", async (req, res) => {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password, 10)
    const validation = signUpSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros)
    }
    try {
        const user = await db.collection("users").findOne({ email })
        console.log(user)
        if (user) return res.status(409).send("Usuario ja existe")
        await db.collection("users").insertOne({ name, email, password: hash })
        res.sendStatus(201)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    const validation = signInSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros)
    }
    try {
        const user = await db.collection("users").findOne({ email })
        if (!user) return res.status(404).send("E-mail nao encontrado")
        const correctPassword = bcrypt.compareSync(password, user.password)
        if (!correctPassword) return res.status(401).send("Senha incorreta")
        const token = uuid()
        await db.collection("sessions").insertOne({ token, userId: user._id })
        res.status(200).send(token)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/transaction", async (req, res) => {
    const { value, description, type } = req.body
    const validation = transactionSchema.validate(req.body)
    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros)
    }
    try {
        await db.collection("transactions").insertOne({ value, description, type, date: dayjs().format('DD/MM') })
        res.sendStatus(201)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/transaction", async (req, res) => {
    const transactions = await db.collection("transactions").find().toArray()
    res.status(200).send(transactions)
})


const port = 5000
app.listen(5000, () => console.log(`servidor rodando na porta ${port}`))