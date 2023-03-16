import Joi from "joi";

export const paramSchema = Joi.object({
    id: Joi.number().required()
})