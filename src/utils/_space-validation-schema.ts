// import Joi from "joi";
import BaseJoi from "joi";
import JoiDate from "@joi/date";

const Joi = BaseJoi.extend(JoiDate)

const date = new Date();

date.setDate(date.getDate() - 1);

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

const reportSchema = Joi.object({
    fromDate: Joi.date().format('YYYY-MM-DD HH:mm:ss'),
    toDate: Joi.date().format('YYYY-MM-DD HH:mm:ss').min(Joi.ref('fromDate')),
})
    .when(Joi.object({ fromDate: Joi.exist() }), { then: Joi.object({ toDate: Joi.required() }) })
    .when(Joi.object({ toDate: Joi.exist() }), { then: Joi.object({ fromDate: Joi.required() }) })
    .and('fromDate', 'toDate');


export {
    spaceSchema,
    getSpacesSchema,
    reportSchema
}