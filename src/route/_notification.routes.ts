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
                Permission.memberPermissions
            ],
            auth: true
        }
    ]
    return r;
}


export default routes