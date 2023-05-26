import Controller, { APIRoute, Methods } from '../app/controller';
import { updateUserSchema } from '../utils/_user-validation-schema';
import validation from "../middleware/validation.middleware"

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getUserHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/list",
            method: Methods.GET,
            handler: controller.getUsersHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/",
            method: Methods.PUT,
            handler: controller.updateUserHandler,
            localMiddleware: [validation(updateUserSchema)],
            auth: true
        }
    ]
    return r;
}


export default routes