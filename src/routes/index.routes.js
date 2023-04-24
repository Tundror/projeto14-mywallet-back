import { Router } from "express";
import transactionsRouter from "./transactionsRoutes.js";
import userRouter from "./usersRoutes.js";

const router = Router()

router.use(transactionsRouter)
router.use(userRouter)

export default router