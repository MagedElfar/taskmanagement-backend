import Controller, { APIRoute, Methods } from '../app/controller';
import { profileSchema } from '../utils/_user-validation-schema';
import validation from "../middleware/validation.middleware"

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.POST,
            handler: controller.createProfileHandler,
            localMiddleware: [validation(profileSchema)],
            auth: true
        }
    ]
    return r;
}


export default routes