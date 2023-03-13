import Joi from "joi";

const spaceSchema = Joi.object({
    name: Joi.string()
        .required(),
})


export {
    spaceSchema
}