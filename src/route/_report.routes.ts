import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { reportSchema } from '../utils/_space-validation-schema';
import PermissionsFactory from "../middleware/permissions.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';

const Permission = PermissionsFactory.getPermissions("spaces")


const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [

        {
            path: "/space/:id",
            method: Methods.GET,
            handler: controller.generalSpaceReportHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(reportSchema, "query"),
                Permission.memberPermissions
            ],
            auth: true
        }

    ]
    return r;
}


export default routes