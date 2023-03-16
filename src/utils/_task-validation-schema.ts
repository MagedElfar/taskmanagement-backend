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



export {
    taskSchema,
    assignTaskSchema
}