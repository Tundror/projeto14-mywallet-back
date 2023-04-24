
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { db } from "../database/database.connections.js"


export async function signUp(req, res) {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password, 10)


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
}

export async function signIn(req, res) {
    const { email, password } = req.body


    try {
        const user = await db.collection("users").findOne({ email })
        if (!user) return res.status(404).send("E-mail nao encontrado")
        const correctPassword = bcrypt.compareSync(password, user.password)
        if (!correctPassword) return res.status(401).send("Senha incorreta")
        const token = uuid()
        await db.collection("sessions").insertOne({ token, userId: user._id })
        const object = {name: user.name, token: token}
        res.status(200).send(object)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}