import Joi from "joi";

const signupSchema = Joi.object({

    username: Joi.string()
        .min(3)
        .max(10)
        .required()
        .messages({
            "string.min": "username must be at least 3 characters",
            "any.required": "username is required"
        }),

    password: Joi.string()
        .required()
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .messages({
            "string.pattern.base": "Invalid Password Format Provided ( Must be at least 8 characters, 1 number and at least one uppercase character )"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "invalid email format"
        })
})


const inviteSignupSchema = Joi.object({

    username: Joi.string()
        .min(3)
        .max(10)
        .required()
        .messages({
            "string.min": "username must be at least 3 characters",
            "any.required": "username is required"
        }),

    password: Joi.string()
        .required()
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .messages({
            "string.pattern.base": "Invalid Password Format Provided ( Must be at least 8 characters, 1 number and at least one uppercase character )"
        }),
})

const loginSchema = Joi.object({
    password: Joi.string()
        .required()
        .messages({
            "any.required": "Password is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "any.required": "Email is required"
        })
})

const sendForgetPasswordLinkSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "any.required": "Email is required"
        }),
})


const forgetPasswordRestSchema = Joi.object({
    password: Joi.string()
        .required()
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .messages({
            "string.pattern.base": "Invalid Password Format Provided ( Must be at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character )"
        }),

    password_confirmation: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Passwords does not match' }),

    token: Joi.string()
        .required()
        .messages({
            "any.required": "token is required"
        }),
})

export {
    signupSchema,
    loginSchema,
    sendForgetPasswordLinkSchema,
    forgetPasswordRestSchema,
    inviteSignupSchema
}