import { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import PermissionsFactory from "../middleware/permissions.middleware"
import { addMemberSchema, inviteMemberSchema } from '../utils/_team-validation-schema';
import InvitationController from '../controllers/invitation.controllers';

const Permission = PermissionsFactory.getPermissions("teams")


const routes: (controller: InvitationController) => APIRoute[] = (controller: InvitationController) => {

    const r: APIRoute[] = [

        {
            path: "/",
            method: Methods.POST,
            handler: controller.sendInvitationHandler,
            localMiddleware: [
                validation(inviteMemberSchema),
                Permission.adminPermissions
            ],
            auth: true
        },

        {
            path: "/",
            method: Methods.GET,
            handler: controller.acceptInvitationHandler,
            localMiddleware: [validation(addMemberSchema, "query")],
            auth: true
        }
    ]
    return r;
}


export default routes