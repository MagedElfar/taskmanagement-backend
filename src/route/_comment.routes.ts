import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import { commentSchema, getCommentsSchema } from '../utils/_comment-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getCommentsHandler,
            localMiddleware: [validation(getCommentsSchema, "query")],
            auth: true
        },

        {
            path: "/",
            method: Methods.POST,
            handler: controller.addCommentHandler,
            localMiddleware: [validation(commentSchema)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteCommentHandler,
            localMiddleware: [validation(paramSchema, "param")],
            auth: true
        }
    ]
    return r;
}


export default routes