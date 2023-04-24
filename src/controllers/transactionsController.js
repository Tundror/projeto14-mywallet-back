import dayjs from "dayjs"
import { db } from "../database/database.connections.js"

export async function newTransaction(req, res) {
    const { value, description, type } = req.body
    const session = res.locals.session
    try {
        await db.collection("transactions").insertOne({ value, description, type, date: dayjs().format('DD/MM'), userId: session.userId })
        res.sendStatus(201)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getTransactions(req, res) {
    const session = res.locals.session
    try {
        const transactions = await db.collection("transactions").find({ userId: session.userId }).toArray()
        res.status(200).send(transactions)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}