import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';
import { createConversationSchema } from '../utils/_conversations-validation-schema';

const Permission = PermissionsFactory.getPermissions("tasks");

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.POST,
            handler: controller.createConversationHandler,
            localMiddleware: [
                validation(createConversationSchema),
            ],
            auth: true
        },

        {
            path: "/",
            method: Methods.GET,
            handler: controller.getConversationsHandler,
            localMiddleware: [],
            auth: true
        }
    ]
    return r;
}


export default routes