import { Router } from "express"
import { getTransactions, newTransaction } from "../controllers/transactionsController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { transactionSchema } from "../schemas/transactions.schemas.js"
import { authValidate } from "../middlewares/authorization.middleware.js"

const transactionsRouter = Router()

transactionsRouter.use(authValidate)
transactionsRouter.post("/transaction",validateSchema(transactionSchema), newTransaction)

transactionsRouter.get("/transaction", getTransactions)

export default transactionsRouter