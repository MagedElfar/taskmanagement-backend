import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { spaceSchema } from '../utils/_space-validation-schema';
import spacePermission from "../middleware/space-permissions.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getSpacesHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.GET,
            handler: controller.getSpaceHandler,
            localMiddleware: [validation(paramSchema, "param"), spacePermission.getSpacePermission],
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
            localMiddleware: [validation(paramSchema, "param"), spacePermission.updateAndDeletePermission, validation(spaceSchema)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteSpaceHandler,
            localMiddleware: [validation(paramSchema, "param"), spacePermission.updateAndDeletePermission],
            auth: true
        },

    ]
    return r;
}


export default routes