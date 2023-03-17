import Joi from "joi";

const commentSchema = Joi.object({
    taskId: Joi.number()
        .required(),
    comment: Joi.string()
        .required()
})

const getCommentsSchema = Joi.object({
    taskId: Joi.number()
        .required()
})


export {
    commentSchema,
    getCommentsSchema
}