import { ITask } from './../model/task.model';
import { Role } from '../model/team.model';
import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { ITeam } from "../model/team.model";
import TeamServices, { ITeamServices } from "../services/team.service";
import { setError } from "../utils/error-format";
import TaskServices from '../services/task.services';
import AssigneeServices from '../services/assignee.services';
import TaskAttachmentServices from '../services/task_attachments.services';
import fs from "fs";
// import ProjectServices from '../services/project.services';
import { IProject } from '../model/project.model';
import teamServices from '../services/team.service';

abstract class Permissions {

    protected readonly teamService: ITeamServices;

    constructor() {
        this.teamService = teamServices
    }

    abstract ownerPermissions(req: Request, res: Response, next: NextFunction): any;

    abstract adminPermissions(req: Request, res: Response, next: NextFunction): any;

    abstract memberPermissions(req: Request, res: Response, next: NextFunction): any;
}

class SpacePermission extends Permissions {

    ownerPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            const space = req.params?.id || req.body.id;

            const member: ITeam = await this
                .teamService.teamQueryServices()
                .where({ space, userId })
                .andWhere("role", "=", Role.OWNER)
                .first();

            if (!member) throw setError(403, "Forbidden");

            next()

        } catch (error) {
            next(error)
        }
    }

    adminPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            const space = req.params?.id || req.body?.spaceId;

            const member: ITeam = await this
                .teamService.teamQueryServices()
                .where({ space, userId })
                .andWhere((q) => {
                    q.where("role", "=", Role.OWNER)
                        .orWhere("role", "=", Role.ADMIN)
                })
                .first();

            if (!member) throw setError(403, "Forbidden");

            next()

        } catch (error) {
            next(error)
        }
    }

    memberPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            const space = req.params?.id || req.body.spaceId;

            const member: ITeam = await this
                .teamService.teamQueryServices()
                .where({ space, userId })
                .first()

            if (!member) throw setError(403, "Forbidden");

            next()

        } catch (error) {
            next(error)
        }
    }
}

// class TeamPermission extends Permissions {

//     private getSpaceId = async (req: Request) => {
//         try {
//             if (req.params?.id) {
//                 const memberId = req.params?.id
//                 const member: ITeam = await this
//                     .teamService.teamQueryServices()
//                     .where("id", "=", memberId)
//                     .andWhereNot("role", "=", Role.OWNER)
//                     .first();

//                 if (!member) throw setError(403, "Forbidden");
//                 return member.space
//             } else {

//                 return req.body.space
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     ownerPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {


//             const userId = req.user?.id;
//             const space = await this.getSpaceId(req)


//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .andWhere("role", "=", Role.OWNER)
//                 .first();

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }

//     adminPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const userId = req.user?.id;

//             const space = await this.getSpaceId(req);

//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .andWhere((q) => {
//                     q.where("role", "=", Role.OWNER)
//                         .orWhere("role", "=", Role.ADMIN)
//                 })
//                 .first();

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }

//     memberPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const userId = req.user?.id;

//             const space = req.query?.space || await this.getSpaceId(req)

//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .first()

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }
// }

// class TaskPermission extends Permissions {

//     protected readonly taskServices: TaskServices;

//     constructor() {
//         super()
//         this.taskServices = Container.get(TaskServices)
//     }

//     protected getSpaceId = async (req: Request) => {
//         try {

//             console.log("taskId")


//             if (req.params?.id || req.body?.taskId || req.query?.taskId) {

//                 const taskId = req.body?.taskId || req.params?.id || req.query?.taskId;

//                 console.log(taskId)

//                 const task: ITask = await this
//                     .taskServices.QueryServices()
//                     .where("id", "=", taskId)
//                     .first();

//                 if (!task) throw setError(403, "Forbidden");
//                 return task.spaceId
//             } else {
//                 return req.body.spaceId
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     ownerPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {


//             const userId = req.user?.id;
//             const space = await this.getSpaceId(req)


//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .andWhere("role", "=", Role.OWNER)
//                 .first();

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }

//     adminPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const userId = req.user?.id;

//             const space = await this.getSpaceId(req);

//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .andWhere((q) => {
//                     q.where("role", "=", Role.OWNER)
//                         .orWhere("role", "=", Role.ADMIN)
//                 })
//                 .first();

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }

//     memberPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             console.log
//             if (Object.keys(req.query).length && !req.query?.space && !req.query?.taskId) return next()

//             const userId = req.user?.id;

//             const space = req.query.space || await this.getSpaceId(req)

//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .first()

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             if (req.files?.length && Array.isArray(req.files)) {
//                 req.files.map((file: Express.Multer.File) => {
//                     console.log(file)
//                     fs.unlink(file.path, function (err) {
//                         if (err) console.log(err)
//                     })
//                 })
//             }
//             next(error)
//         }
//     }
// }

// class AssignTaskPermission extends TaskPermission {
//     private readonly assigneeServices: AssigneeServices;

//     constructor() {
//         super()
//         this.assigneeServices = Container.get(AssigneeServices)
//     }

//     protected getSpaceId = async (req: Request) => {
//         try {
//             const id = req.params?.id;


//             const data = await this
//                 .assigneeServices.QueryServices()
//                 .leftJoin("tasks", "tasks.id", "=", "assignees.taskId")
//                 .select("assignees.*", "tasks.spaceId")
//                 .where("assignees.id", "=", id)
//                 .first();

//             if (!data) throw setError(403, "Forbidden");

//             return data.spaceId
//         } catch (error) {
//             throw error;
//         }
//     }
// }

// class TaskAttachmentPermission extends TaskPermission {
//     private readonly taskAttachmentServices: TaskAttachmentServices;

//     constructor() {
//         super()
//         this.taskAttachmentServices = Container.get(TaskAttachmentServices)
//     }

//     protected getSpaceId = async (req: Request) => {
//         try {
//             const id = req.params?.id;


//             const data = await this
//                 .taskAttachmentServices.QueryServices()
//                 .leftJoin("tasks", "tasks.id", "=", "task_attachments.taskId")
//                 .select("task_attachments.*", "tasks.spaceId")
//                 .where("task_attachments.id", "=", id)
//                 .first();

//             if (!data) throw setError(403, "Forbidden");

//             return data.spaceId
//         } catch (error) {
//             throw error;
//         }
//     }
// }

// class ProjectPermission extends Permissions {

//     protected readonly projectServices: ProjectServices;

//     constructor() {
//         super()
//         this.projectServices = Container.get(ProjectServices)
//     }

//     protected getSpaceId = async (req: Request) => {
//         try {

//             console.log("taskId")


//             if (req.params?.id) {

//                 const proJectId = req.params?.id;

//                 const project: IProject = await this
//                     .projectServices.QueryServices()
//                     .where("id", "=", proJectId)
//                     .first();

//                 if (!project) throw setError(403, "Forbidden");
//                 return project.spaceId
//             } else {
//                 return req.body.spaceId
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     ownerPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {


//             const userId = req.user?.id;
//             const space = req.query?.spaceId || await this.getSpaceId(req)


//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .andWhere("role", "=", Role.OWNER)
//                 .first();

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }

//     adminPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const userId = req.user?.id;

//             const space = req.query?.spaceId || await this.getSpaceId(req);

//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .andWhere((q) => {
//                     q.where("role", "=", Role.OWNER)
//                         .orWhere("role", "=", Role.ADMIN)
//                 })
//                 .first();

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             next(error)
//         }
//     }

//     memberPermissions = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             // if (Object.keys(req.query).length && !req.query?.space  ) return next()

//             const userId = req.user?.id;

//             const space = req.query.spaceId || await this.getSpaceId(req)

//             const member: ITeam = await this
//                 .teamService.teamQueryServices()
//                 .where({ space, userId })
//                 .first()

//             if (!member) throw setError(403, "Forbidden");

//             next()

//         } catch (error) {
//             if (req.files?.length && Array.isArray(req.files)) {
//                 req.files.map((file: Express.Multer.File) => {
//                     console.log(file)
//                     fs.unlink(file.path, function (err) {
//                         if (err) console.log(err)
//                     })
//                 })
//             }
//             next(error)
//         }
//     }
// }

class PermissionsFactory {
    getPermissions(term: string): Permissions {
        switch (term) {
            // case "teams":
            //     return new TeamPermission();

            // case "tasks":
            //     return new TaskPermission();

            // case "assignees":
            //     return new AssignTaskPermission();

            // case "attachments":
            //     return new TaskAttachmentPermission()

            // case "projects":
            //     return new ProjectPermission()

            case "spaces":
            default:
                return new SpacePermission();
        }
    }
}

export default new PermissionsFactory()