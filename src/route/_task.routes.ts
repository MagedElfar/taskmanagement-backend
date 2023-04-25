import Controller, { APIRoute, Methods } from '../app/controller';
import Multer from '../middleware/multer.middleware';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';
import {
    assignTaskSchema,
    getTaskSSchema,
    taskAttachmentSchema,
    taskSchema,
    updateTaskOrder,
    updateTaskSchema,
    updateTaskStatus
} from '../utils/_task-validation-schema';
import activityMiddleware from '../middleware/activity.middleware';

const Permission = PermissionsFactory.getPermissions("tasks");
const AssignPermission = PermissionsFactory.getPermissions("assignees");
const AttachPermission = PermissionsFactory.getPermissions("attachments")

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getTasksHandler,
            localMiddleware: [
                validation(getTaskSSchema, "query"),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/",
            method: Methods.POST,
            handler: controller.createHandler,
            localMiddleware: [
                validation(taskSchema),
                Permission.memberPermissions,
                activityMiddleware.createTask
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.GET,
            handler: controller.getTaskHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PUT,
            handler: controller.updateTaskHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(updateTaskSchema),
                Permission.memberPermissions,
                activityMiddleware.updateTask
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PATCH,
            handler: controller.updateTaskStatusHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(updateTaskStatus),
                Permission.memberPermissions,
                activityMiddleware.updateStatus
            ],
            auth: true
        },

        {
            path: "/order/:id",
            method: Methods.PATCH,
            handler: controller.updateTaskOrderHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(updateTaskOrder),
                Permission.memberPermissions,
                activityMiddleware.changeOrder
            ],
            auth: true
        },


        {
            path: "/complete/:id",
            method: Methods.PATCH,
            handler: controller.markTaskCompleteHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.memberPermissions,
                activityMiddleware.markComplete
            ],
            auth: true
        },
        {
            path: "/archive/:id",
            method: Methods.PATCH,
            handler: controller.archiveTaskCompleteHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.adminPermissions,
                activityMiddleware.archiveTask
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteTaskHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/assign",
            method: Methods.POST,
            handler: controller.assignTaskHandler,
            localMiddleware: [
                validation(assignTaskSchema),
                Permission.memberPermissions,
                activityMiddleware.assignTask
            ],
            auth: true
        },

        {
            path: "/assign/:id",
            method: Methods.DELETE,
            handler: controller.unassignTaskHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                AssignPermission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/attachment",
            method: Methods.POST,
            handler: controller.uploadAttachmentHandler,
            localMiddleware: [
                Multer.localUpload().array("file"),
                validation(taskAttachmentSchema),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/attachment/:id",
            method: Methods.DELETE,
            handler: controller.deleteAttachmentHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                AttachPermission.memberPermissions
            ],
            auth: true
        },


    ]
    return r;
}


export default routes