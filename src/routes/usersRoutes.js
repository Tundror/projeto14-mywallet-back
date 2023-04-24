import { Router } from "express"
import { signIn, signUp } from "../controllers/usersController.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { signInSchema, signUpSchema } from "../schemas/users.schemas.js"


const userRouter = Router()

userRouter.post("/sign-up",validateSchema(signUpSchema), signUp)

userRouter.post("/sign-in",validateSchema(signInSchema), signIn)

export default userRouter