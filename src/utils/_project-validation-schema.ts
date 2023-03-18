import Joi from "joi";


const projectSchema = Joi.object({
    name: Joi.string()
        .required(),
    spaceId: Joi.number().required(),
});

const updateProjectSchema = Joi.object({
    name: Joi.string()
        .required(),
})

const getProjectsSchema = Joi.object({
    spaceId: Joi.number()
        .required(),
    limit: Joi.number().optional(),
    page: Joi.number().optional(),
    term: Joi.string().optional()
})



export {
    projectSchema,
    updateProjectSchema,
    getProjectsSchema
}