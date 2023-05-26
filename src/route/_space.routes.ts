import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { getSpacesSchema, reportSchema, spaceSchema } from '../utils/_space-validation-schema';
import PermissionsFactory from "../middleware/permissions.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';

const Permission = PermissionsFactory.getPermissions("spaces")


const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getSpacesHandler,
            localMiddleware: [validation(getSpacesSchema, "query")],
            auth: true
        },

        {
            path: "/init",
            method: Methods.GET,
            handler: controller.getInitSpaceHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.GET,
            handler: controller.getSpaceHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/",
            method: Methods.POST,
            handler: controller.createSpaceHandler,
            localMiddleware: [validation(spaceSchema)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PUT,
            handler: controller.updateSpaceHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(spaceSchema),
                Permission.ownerPermissions
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteSpaceHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.ownerPermissions
            ],
            auth: true
        }

    ]
    return r;
}


export default routes