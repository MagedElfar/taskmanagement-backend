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
    first_name: Joi.string().allow("").optional(),
    last_name: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    gender: Joi.string().optional().valid(...Object.values(Gender))
})

const changePasswordRestSchema = Joi.object({
    new_password: Joi.string()
        .required()
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .messages({
            "string.pattern.base": "Invalid Password Format Provided ( Must be at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character )"
        }),

    new_password_confirmation: Joi.any()
        .equal(Joi.ref('new_password'))
        .required()
        .messages({ 'any.only': 'Passwords does not match' }),

    password: Joi.string()
        .required()
})


export {
    profileSchema,
    updateUserSchema,
    changePasswordRestSchema
}