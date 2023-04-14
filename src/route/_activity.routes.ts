import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { getActivitIEsSchema } from '../utils/_activity-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';
import { commentSchema, editCommentSchema } from '../utils/_comment-validation-schema';
import { paramSchema } from '../utils/_commen-validation-schema';

const Permission = PermissionsFactory.getPermissions("tasks");

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getActivitiesHandler,
            localMiddleware: [
                validation(getActivitIEsSchema, "query"),
                Permission.memberPermissions
            ],
            auth: true
        },
        {
            path: "/",
            method: Methods.POST,
            handler: controller.addCommentHandler,
            localMiddleware: [
                validation(commentSchema),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PUT,
            handler: controller.editCommentHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(editCommentSchema),
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteCommentHandler,
            localMiddleware: [validation(paramSchema, "param")],
            auth: true
        }
    ]
    return r;
}


export default routes
