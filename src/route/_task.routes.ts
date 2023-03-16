import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import { assignTaskSchema, taskSchema } from '../utils/_task-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
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
        }
    ]
    return r;
}


export default routes