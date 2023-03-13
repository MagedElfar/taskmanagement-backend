import { Gender } from '../model/profile.model';
import Joi from "joi";

const updateUserSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(10)
        .required()
        .messages({
            "string.min": "username must be at least 3 characters",
            "any.required": "username is required"
        }),

    email: Joi.string()
        .email()
        .messages({
            "string.email": "invalid email format"
        }),

    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    phone: Joi.string().optional(),
    gender: Joi.string().optional().valid(...Object.values(Gender))
})


const profileSchema = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    phone: Joi.string().optional(),
    gender: Joi.string().optional().valid(...Object.values(Gender))
})

export {
    profileSchema,
    updateUserSchema
}