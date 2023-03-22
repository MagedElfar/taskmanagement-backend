import { paramSchema } from './../utils/_commen-validation-schema';
import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import PermissionsFactory from "../middleware/permissions.middleware"
import {
    addMemberSchema,
    getTeamSchema,
    inviteMemberSchema,
    updateRoleSchema
} from '../utils/_team-validation-schema';

const Permission = PermissionsFactory.getPermissions("teams")


const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getTeamHandler,
            localMiddleware: [
                validation(getTeamSchema, "query"),
                Permission.memberPermissions
            ],
            auth: true
        },
        {
            path: "/invite",
            method: Methods.POST,
            handler: controller.sendInvitationHandler,
            localMiddleware: [
                validation(inviteMemberSchema),
                Permission.adminPermissions
            ],
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
            localMiddleware: [
                validation(paramSchema, "param"),
                validation(updateRoleSchema),
                Permission.ownerPermissions
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.removeMemberHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                Permission.ownerPermissions
            ],
            auth: true
        },

        {
            path: "/leave/:id",
            method: Methods.DELETE,
            handler: controller.leaveTeamHandler,
            localMiddleware: [
                validation(paramSchema, "param")
            ],
            auth: true
        },
    ]
    return r;
}


export default routes