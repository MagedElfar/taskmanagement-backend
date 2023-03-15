import { TaskStatus, TaskPRIORITY } from './../model/task.model';
import Joi from "joi";

const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().optional().valid(...Object.values(TaskStatus)),
    priority: Joi.string().optional().valid(...Object.values(TaskPRIORITY)),
})

export {
    taskSchema
}