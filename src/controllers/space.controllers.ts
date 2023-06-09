import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_space.routes";
import { ISpaceServices } from "../services/space.services";
import { IProjectServices } from "../services/project.services";
import { ITeamServices } from "../services/team.service";
import { autoInjectable, inject } from "tsyringe";

export interface ISpaceController {
    getSpacesHandler(req: Request, res: Response, next: NextFunction): Promise<void>,
    getSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void>,
    getInitSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void>,
    createSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void>,
    updateSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void>,
    deleteSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void>
}

@autoInjectable()
export default class SpaceController extends Controller implements ISpaceController {
    protected routes: APIRoute[];
    private readonly spaceServices: ISpaceServices
    private readonly projectServices: IProjectServices
    private readonly teamServices: ITeamServices


    constructor(
        @inject("ISpaceServices") spaceServices: ISpaceServices,
        @inject("IProjectServices") projectServices: IProjectServices,
        @inject("ITeamServices") teamServices: ITeamServices
    ) {
        super("/spaces");
        this.routes = routes(this);
        this.spaceServices = spaceServices;
        this.projectServices = projectServices;
        this.teamServices = teamServices
    }

    async getSpacesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;
            const { limit = 10, page = 1, term = "" } = req.query

            const data = await this.spaceServices.find({
                userId,
                limit: +limit,
                page: +page,
                term: term.toString()
            });

            super.setResponseSuccess({
                res,
                status: 200,
                data: { data }
            })

        } catch (error) {
            next(error)
        }
    };


    async getSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.params.id;

            const space = await this.spaceServices.findOne(+id);

            const { team } = await this.teamServices.find({ space: +id! }, {})

            const { projects } = await this.projectServices._find(+id)

            super.setResponseSuccess({
                res,
                status: 200,
                data: {
                    space,
                    team,
                    projects
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async getInitSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { spaces } = await this.spaceServices.find({
                userId,
                limit: 1,
                page: 1,
            });


            if (spaces.length === 0) {
                super.setResponseSuccess({
                    res, status: 200, data: {
                        space: null,
                        team: [],
                        projects: []
                    }
                })
            } else {
                const space = spaces[0];
                const { team } = await this.teamServices.find({ space: space.id }, {})

                const { projects } = await this.projectServices._find(space.id)

                super.setResponseSuccess({
                    res,
                    status: 200,
                    data: {
                        space,
                        team,
                        projects
                    }
                })
            }


        } catch (error) {
            next(error)
        }
    };

    async createSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id!;

            const space = await this.spaceServices.create({
                owner: id,
                ...req.body
            })

            const { team } = await this.teamServices.find({ space: space.id }, {})

            super.setResponseSuccess({
                res,
                status: 201,
                message: "Space are created",
                data: { space, team }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params

            const space = await this.spaceServices.update(+id, req.body)
            super.setResponseSuccess({
                res,
                status: 200,
                message: "Space are updated",
                data: { space }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params

            await this.spaceServices.delete(+id)
            super.setResponseSuccess({
                res,
                status: 200,
                message: "Space are deleted",
            })

        } catch (error) {
            next(error)
        }
    };
}
