import Joi from "joi";

const commentSchema = Joi.object({
    taskId: Joi.number()
        .required(),
    comment: Joi.string()
        .required()
})

const getCommentsSchema = Joi.object({
    taskId: Joi.number()
        .required(),
    limit: Joi.number().optional(),
    page: Joi.number().optional()
})


export {
    commentSchema,
    getCommentsSchema
}