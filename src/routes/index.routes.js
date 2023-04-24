import { Router } from "express";
import transactionsRouter from "./transactionsRoutes.js";
import userRouter from "./usersRoutes.js";

const router = Router()

router.use(userRouter)
router.use(transactionsRouter)


export default router