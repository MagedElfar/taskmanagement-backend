import { TaskStatus, TaskPRIORITY } from './../model/task.model';
import BaseJoi from "joi";
import JoiDate from "@joi/date";

const Joi = BaseJoi.extend(JoiDate)

const date = new Date();

date.setDate(date.getDate() - 1);

const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("").required(),
    priority: Joi.string().optional().valid(...Object.values(TaskPRIORITY)),
    due_date: Joi.date().format('YYYY-MM-DD').optional().greater(date),
    spaceId: Joi.number().required(),
    parentId: Joi.number().allow(null).optional(),
    projectId: Joi.number().allow(null).optional(),
    memberId: Joi.number().allow(null).optional(),

})

const updateTaskSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    priority: Joi.string().optional().valid(...Object.values(TaskPRIORITY)),
    due_date: Joi.date().format('YYYY-MM-DD').allow(null).optional().greater(date),
    spaceId: Joi.number().required(),
    parentId: Joi.number().allow(null).optional(),
    projectId: Joi.number().allow(null).optional(),
    memberId: Joi.number().allow(null).optional(),

})

const updateTaskStatus = Joi.object({
    status: Joi.string().optional().valid(...Object.values(TaskStatus)),
})

const updateTaskOrder = Joi.object({
    status: Joi.string().optional().valid(...Object.values(TaskStatus)),
    position: Joi.number().optional(),

})
const assignTaskSchema = Joi.object({
    taskId: Joi.number().required(),
    memberId: Joi.number().required()
})

const taskAttachmentSchema = Joi.object({
    taskId: Joi.number().required(),
})

const getTaskSSchema = Joi.object({
    spaceId: Joi.number().optional(),
    project: Joi.number(),
    term: Joi.string().allow("").optional(),
    page: Joi.number()
        .when('limit', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional() }),
    limit: Joi.number().optional(),
    user: Joi.boolean().optional().valid(true),
    orderBy: Joi.string().optional().valid("created_at", "due_date", "position"),
    order: Joi.string().optional().valid("desc", "asc"),
    status: Joi.string().optional().valid(...Object.values(TaskStatus)),
    is_archived: Joi.number().optional(),
    fromDate: Joi.date().optional().format('YYYY-MM-DD'),
    toDate: Joi.date().format('YYYY-MM-DD').when('fromDate', {
        is: Joi.exist(),
        then: Joi.date().min(Joi.ref('fromDate')),
        otherwise: Joi.optional()
    })
}).or('spaceId', 'user');

export {
    taskSchema,
    assignTaskSchema,
    getTaskSSchema,
    taskAttachmentSchema,
    updateTaskStatus,
    updateTaskOrder,
    updateTaskSchema
}