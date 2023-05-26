import Controller, { APIRoute, Methods } from '../app/controller';
import Multer from '../middleware/multer.middleware';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [

        {
            path: "/profile-picture",
            method: Methods.POST,
            handler: controller.uploadUserImageHandler,
            localMiddleware: [Multer.localUpload().single("image")],
            auth: true
        },

        {
            path: "/profile-picture",
            method: Methods.DELETE,
            handler: controller.deleteUserImageHandler,
            localMiddleware: [],
            auth: true
        },

    ]
    return r;
}


export default routes