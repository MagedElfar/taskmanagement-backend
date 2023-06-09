import Controller, { APIRoute, Methods } from '../app/controller';
import validation from "../middleware/validation.middleware"
import { paramSchema } from '../utils/_commen-validation-schema';
import PermissionsFactory from '../middleware/permissions.middleware';
import { assignTaskSchema } from '../utils/_task-validation-schema';
import activityMiddleware from '../middleware/activity.middleware';

const Permission = PermissionsFactory.getPermissions("tasks");
const AssignPermission = PermissionsFactory.getPermissions("assignees");

const routes: (controller: Controller) => APIRoute[] = (controller: any) => {

    const r: APIRoute[] = [
        {
            path: "/assign",
            method: Methods.POST,
            handler: controller.assignTaskHandler,
            localMiddleware: [
                validation(assignTaskSchema),
                Permission.memberPermissions,
                activityMiddleware.assignTask
            ],
            auth: true
        },

        {
            path: "/:id",
            method: Methods.DELETE,
            handler: controller.unassignTaskHandler,
            localMiddleware: [
                validation(paramSchema, "param"),
                AssignPermission.memberPermissions,
                activityMiddleware.unAssignTask
            ],
            auth: true
        }


    ]
    return r;
}


export default routes