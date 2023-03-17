import { TaskStatus, TaskPRIORITY } from './../model/task.model';
import BaseJoi from "joi";
import JoiDate from "@joi/date";

const Joi = BaseJoi.extend(JoiDate)

const date = new Date();

date.setDate(date.getDate() - 1);

const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().optional().valid(...Object.values(TaskStatus)),
    priority: Joi.string().optional().valid(...Object.values(TaskPRIORITY)),
    due_date: Joi.date().format('YYYY-MM-DD').optional().greater(date),
    spaceId: Joi.number().required(),
    parentId: Joi.number().optional()
})

const assignTaskSchema = Joi.object({
    taskId: Joi.number().required(),
    memberId: Joi.number().required()
})

const taskAttachmentSchema = Joi.object({
    taskId: Joi.number().required(),
})

const getTaskSSchema = Joi.object({
    space: Joi.number().optional(),
    term: Joi.string().optional(),
    pages: Joi.number().optional(),
    limit: Joi.number().optional(),
    user: Joi.boolean().optional(),
    orderBy: Joi.string().optional().valid("created_at", "due_date"),
    order: Joi.string().optional().valid("desc", "asc"),
}).or('space', 'user');

export {
    taskSchema,
    assignTaskSchema,
    getTaskSSchema,
    taskAttachmentSchema
}