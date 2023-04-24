import Joi from "joi"


export const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
})
export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
})

