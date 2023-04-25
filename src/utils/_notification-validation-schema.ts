import Joi from "joi";

const getNotificationSchema = Joi.object({
    space_id: Joi.number()
        .required(),
    limit: Joi.number().required(),
    page: Joi.number().required(),

})


export {
    getNotificationSchema
}