import { paramSchema } from './../utils/_commen-validation-schema';
import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import PermissionsFactory from "../middleware/permissions.middleware"
import {
    getTeamSchema,
    updateRoleSchema
} from '../utils/_team-validation-schema';
import { ITeamController } from '../controllers/team.controller';

const Permission = PermissionsFactory.getPermissions("teams")


const routes: (controller: ITeamController) => APIRoute[] = (controller: ITeamController) => {

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