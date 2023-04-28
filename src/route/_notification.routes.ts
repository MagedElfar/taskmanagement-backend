import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';
import { getNotificationSchema } from '../utils/_notification-validation-schema';

const Permission = PermissionsFactory.getPermissions("tasks");

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getNotificationsHandler,
            localMiddleware: [
                validation(getNotificationSchema, "query"),
            ],
            auth: true
        },

        {
            path: "/",
            method: Methods.PATCH,
            handler: controller.markAllReadHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PATCH,
            handler: controller.markReadHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
            ],
            auth: true
        },

        {
            path: "/",
            method: Methods.DELETE,
            handler: controller.deleteAllHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteNotificationHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
            ],
            auth: true
        }
    ]
    return r;
}


export default routes