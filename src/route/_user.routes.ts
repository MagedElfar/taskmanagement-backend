import Controller, { APIRoute, Methods } from '../app/controller';
import Multer from '../middleware/multer.middleware';
import { profileSchema, updateUserSchema } from '../utils/_user-validation-schema';
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
            path: "/",
            method: Methods.PUT,
            handler: controller.updateUserHandler,
            localMiddleware: [validation(updateUserSchema)],
            auth: true
        },

        {
            path: "/profile",
            method: Methods.POST,
            handler: controller.createUserProfileHandler,
            localMiddleware: [validation(profileSchema)],
            auth: true
        },

        {
            path: "/image",
            method: Methods.POST,
            handler: controller.userImageHandler,
            localMiddleware: [Multer.localUpload().single("image")],
            auth: true
        },

        {
            path: "/image",
            method: Methods.DELETE,
            handler: controller.deleteUserImageHandler,
            localMiddleware: [],
            auth: true
        },

    ]
    return r;
}


export default routes