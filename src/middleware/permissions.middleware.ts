import { ITask } from './../model/task.model';
import { Role } from '../model/team.model';
import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { ITeam } from "../model/team.model";
import TeamServices from "../services/team.service";
import { setError } from "../utils/error-format";
import TaskServices from '../services/task.services';

abstract class Permissions {

    protected readonly teamService: TeamServices;

    constructor() {
        this.teamService = Container.get(TeamServices)
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

class TeamPermission extends Permissions {

    private getSpaceId = async (req: Request) => {
        try {
            if (req.params?.id) {
                const memberId = req.params?.id
                const member: ITeam = await this
                    .teamService.teamQueryServices()
                    .where("id", "=", memberId)
                    .andWhereNot("role", "=", Role.OWNER)
                    .first();

                if (!member) throw setError(403, "Forbidden");
                return member.space
            } else {

                return req.body.space
            }
        } catch (error) {
            throw error;
        }
    }

    ownerPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {


            const userId = req.user?.id;
            const space = await this.getSpaceId(req)


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

            const space = await this.getSpaceId(req);

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

            const space = await this.getSpaceId(req)

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

class TaskPermission extends Permissions {

    protected readonly taskServices: TaskServices;

    constructor() {
        super()
        this.taskServices = Container.get(TaskServices)
    }

    private getSpaceId = async (req: Request) => {
        try {

            if (req.params?.id || req.body?.taskId) {

                const taskId = req.body?.taskId || req.params?.id;

                console.log(taskId)
                const task: ITask = await this
                    .taskServices.QueryServices()
                    .where("id", "=", taskId)
                    .first();

                if (!task) throw setError(403, "Forbidden");
                return task.spaceId
            } else {
                return req.body.spaceId
            }
        } catch (error) {
            throw error;
        }
    }

    ownerPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {


            const userId = req.user?.id;
            const space = await this.getSpaceId(req)


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

            const space = await this.getSpaceId(req);

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
            if (Object.keys(req.query).length && !req.query?.space) return next()

            const userId = req.user?.id;

            const space = req.query.space || await this.getSpaceId(req)

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

class PermissionsFactory {
    getPermissions(term: string): Permissions {
        switch (term) {
            case "teams":
                return new TeamPermission();

            case "tasks":
                return new TaskPermission();

            case "spaces":
            default:
                return new SpacePermission();
        }
    }
}

export default new PermissionsFactory()