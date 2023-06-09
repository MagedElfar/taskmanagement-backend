import Controller, { APIRoute, Methods } from '../app/controller';
import Multer from '../middleware/multer.middleware';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import { taskAttachmentSchema } from '../utils/_task-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';

const AttachPermission = PermissionsFactory.getPermissions("attachments")
const Permission = PermissionsFactory.getPermissions("tasks");

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


        {
            path: "/task",
            method: Methods.POST,
            handler: controller.uploadUserImageHandler,
            localMiddleware: [
                Multer.localUpload().array("file"),
                validation(taskAttachmentSchema),
                Permission.memberPermissions
            ],
            auth: true
        },

        {
            path: "/task/:id",
            method: Methods.DELETE,
            handler: controller.deleteTaskAttachmentHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                AttachPermission.memberPermissions
            ],
            auth: true
        },

    ]
    return r;
}


export default routes