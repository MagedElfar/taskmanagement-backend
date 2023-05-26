import Controller, { APIRoute, Methods } from '../app/controller';
import authorizationMiddleware from '../middleware/authorization.middleware';
import {
    signupSchema,
    loginSchema,
    inviteSignupSchema
} from '../utils/_aut-validation-schema';
import validation, { signupValidation } from "../middleware/validation.middleware"

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/login",
            method: Methods.POST,
            handler: controller.loginHandler,
            localMiddleware: [validation(loginSchema)],
            auth: false
        },

        {
            path: "/signup",
            method: Methods.POST,
            handler: controller.signupHandler,
            localMiddleware: [signupValidation(signupSchema, inviteSignupSchema)],
            auth: false
        },

        {
            path: "/refresh-token",
            method: Methods.POST,
            handler: controller.refreshTokenHandler,
            localMiddleware: [authorizationMiddleware.refreshTokenExtract],
            auth: false
        },

        {
            path: "/logout",
            method: Methods.POST,
            handler: controller.logoutHandler,
            localMiddleware: [authorizationMiddleware.refreshTokenExtract],
            auth: true
        }
    ]
    return r;
}


export default routes