
import Joi from "joi";

const createConversationSchema = Joi.object({
    userId: Joi.number().required()

})


export {
    createConversationSchema
}