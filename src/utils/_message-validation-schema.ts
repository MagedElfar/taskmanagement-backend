
import Joi from "joi";

const createMessageSchema = Joi.object({
    conversation_id: Joi.number().required(),
    content: Joi.string().required(),
})


export {
    createMessageSchema
}