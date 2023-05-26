import Controller, { APIRoute, Methods } from '../app/controller';
import { changePasswordRestSchema } from '../utils/_user-validation-schema';
import validation from "../middleware/validation.middleware"
import { forgetPasswordRestSchema, sendForgetPasswordLinkSchema } from '../utils/_aut-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.PATCH,
            handler: controller.changePasswordHandler,
            localMiddleware: [validation(changePasswordRestSchema)],
            auth: true
        },

        {
            path: "/forget-password",
            method: Methods.POST,
            handler: controller.sendForgetPasswordMailHandler,
            localMiddleware: [validation(sendForgetPasswordLinkSchema)],
            auth: false
        },

        {
            path: "/forget-password",
            method: Methods.PATCH,
            handler: controller.forgetPasswordHandler,
            localMiddleware: [validation(forgetPasswordRestSchema)],
            auth: false
        },

    ]
    return r;
}


export default routes