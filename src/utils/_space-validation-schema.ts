import Joi from "joi";

const spaceSchema = Joi.object({
    name: Joi.string()
        .required(),
})

const getSpacesSchema = Joi.object({
    term: Joi.string().allow("").optional(),
    page: Joi.number()
        .when('limit', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional() }),
    limit: Joi.number().optional(),
});



export {
    spaceSchema,
    getSpacesSchema
}