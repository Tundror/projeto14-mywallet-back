import Joi from "joi";

export const transactionSchema = Joi.object({
    value: Joi.number().precision(2).strict().positive().required(),
    description: Joi.string().required(),
    type: Joi.string().valid("in", "out").required()
})