import Controller, { APIRoute, Methods } from '../app/controller';
import Multer from '../middleware/multer.middleware';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import { assignTaskSchema, getTaskSSchema, taskAttachmentSchema, taskSchema, updateTaskStatus } from '../utils/_task-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getTasksHandler,
            localMiddleware: [validation(getTaskSSchema, "query")],
            auth: true
        },

        {
            path: "/",
            method: Methods.POST,
            handler: controller.createHandler,
            localMiddleware: [validation(taskSchema)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.GET,
            handler: controller.getTaskHandler,
            localMiddleware: [validation(paramSchema, "param")],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PUT,
            handler: controller.updateTaskHandler,
            localMiddleware: [validation(paramSchema, "param"), validation(taskSchema)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PATCH,
            handler: controller.updateTaskStatusHandler,
            localMiddleware: [validation(paramSchema, "param"), validation(updateTaskStatus)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteTaskHandler,
            localMiddleware: [validation(paramSchema, "param")],
            auth: true
        },

        {
            path: "/assign",
            method: Methods.POST,
            handler: controller.assignTaskHandler,
            localMiddleware: [validation(assignTaskSchema)],
            auth: true
        },

        {
            path: "/assign/:id",
            method: Methods.DELETE,
            handler: controller.unassignTaskHandler,
            localMiddleware: [validation(paramSchema, "param")],
            auth: true
        },

        {
            path: "/attachment",
            method: Methods.POST,
            handler: controller.uploadAttachmentHandler,
            localMiddleware: [Multer.localUpload().array("file"), validation(taskAttachmentSchema)],
            auth: true
        },

        {
            path: "/attachment/:id",
            method: Methods.DELETE,
            handler: controller.deleteAttachmentHandler,
            localMiddleware: [validation(paramSchema, "param")],
            auth: true
        }
    ]
    return r;
}


export default routes