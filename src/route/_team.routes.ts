import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import spacePermission from "../middleware/space-permissions.middleware"
import { addMemberSchema, inviteMemberSchema, updateRoleSchema } from '../utils/_team-validation-schema';

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/invite",
            method: Methods.POST,
            handler: controller.sendInvitationHandler,
            localMiddleware: [validation(inviteMemberSchema), spacePermission.invitePermission],
            auth: true
        },

        {
            path: "/add",
            method: Methods.POST,
            handler: controller.addToTeamHandler,
            localMiddleware: [validation(addMemberSchema, "query")],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.PATCH,
            handler: controller.updateRoleHandler,
            localMiddleware: [validation(updateRoleSchema)],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.removeMemberHandler,
            localMiddleware: [],
            auth: true
        },

        {
            path: "/leave/:id",
            method: Methods.DELETE,
            handler: controller.leaveTeamHandler,
            localMiddleware: [],
            auth: true
        },
    ]
    return r;
}


export default routes