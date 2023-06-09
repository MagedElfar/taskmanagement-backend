import { APIRoute, Methods } from '../app/controller';
import { profileSchema } from '../utils/_user-validation-schema';
import validation from "../middleware/validation.middleware"
import { IProfileController } from '../controllers/profile.controllers';

const routes: (controller: IProfileController) => APIRoute[] = (controller: IProfileController) => {

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