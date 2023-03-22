import Joi from "joi";

const inviteMemberSchema = Joi.object({

    space: Joi.number()
        .required()
        .messages({
            "any.required": "space is required"
        }),


    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "invalid email format"
        })
})

const addMemberSchema = Joi.object({
    token: Joi.string()
        .required()
})

const updateRoleSchema = Joi.object({
    role: Joi.string().optional().valid("admin", "member")
})


const getTeamSchema = Joi.object({
    space: Joi.number()
        .required(),
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
})

export {
    inviteMemberSchema,
    addMemberSchema,
    updateRoleSchema,
    getTeamSchema
}