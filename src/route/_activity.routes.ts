import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { getActivitIEsSchema } from '../utils/_activity-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';

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
    ]
    return r;
}


export default routes
