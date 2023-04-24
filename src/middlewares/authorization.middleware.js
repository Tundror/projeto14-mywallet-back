import { db } from "../database/database.connections.js"

export async function authValidate(req, res, next){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)
    try{
        const session = await db.collection("sessions").findOne({ token })
        res.locals.session = session
        if (!session) return res.sendStatus(401)
        next()
    }
    catch(err){
        res.status(500).send(err.message)
    }
}