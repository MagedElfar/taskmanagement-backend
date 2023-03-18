import Joi from "joi";


const getActivitIEsSchema = Joi.object({
    taskId: Joi.number()
        .required(),
    limit: Joi.number().optional(),
    page: Joi.number().optional()
})


export {
    getActivitIEsSchema
}