
import Joi from "joi";

const createMessageSchema = Joi.object({
    conversation_id: Joi.number().required(),
    content: Joi.string().required(),
})


const getMassagesSchema = Joi.object({
    page: Joi.number().optional().default(1),
    conversation_id: Joi.number().required()
});


export {
    createMessageSchema,
    getMassagesSchema
}