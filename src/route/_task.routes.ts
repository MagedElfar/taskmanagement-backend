import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.POST,
            handler: controller.createHandler,
            localMiddleware: [],
            auth: true
        }
    ]
    return r;
}


export default routes