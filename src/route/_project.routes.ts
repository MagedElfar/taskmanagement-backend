import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import { getProjectsSchema, projectSchema, updateProjectSchema } from '../utils/_project-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';

const Permission = PermissionsFactory.getPermissions("tasks");
const ProjectPermission = PermissionsFactory.getPermissions("projects");

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/",
            method: Methods.GET,
            handler: controller.getProjectsHandler,
            localMiddleware: [
                validation(getProjectsSchema, "query"),
                ProjectPermission.memberPermissions
            ],
            auth: true
        },
        {
            path: "/",
            method: Methods.POST,
            handler: controller.createProjectHandler,
            localMiddleware: [
                validation(projectSchema),
                ProjectPermission.adminPermissions
            ],
            auth: true
        },
        {
            path: "/:id",
            method: Methods.PATCH,
            handler: controller.updateProjectHandler,
            localMiddleware: [
                validation(paramSchema, "param"), validation(updateProjectSchema),
                ProjectPermission.adminPermissions
            ],
            auth: true
        },
        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.deleteProjectHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                ProjectPermission.adminPermissions
            ],
            auth: true
        },
    ]
    return r;
}


export default routes
