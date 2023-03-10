import Controller, { APIRoute, Methods } from '../app/controller';
import Multer from '../middleware/multer.middleware';
import validation from "./../middleware/validation.middleware"

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
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