import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_space.routes";
import { Inject } from "typedi";
import SpaceServices from "../services/space.services";
import ProjectServices from "../services/project.services";


export default class SpaceController extends Controller {
    protected routes: APIRoute[];
    private readonly spaceServices: SpaceServices
    private readonly projectServices: ProjectServices


    constructor(
        path: string,
        @Inject() spaceServices: SpaceServices,
        @Inject() projectServices: ProjectServices
    ) {
        super(path);
        this.routes = routes(this);
        this.spaceServices = spaceServices;
        this.projectServices = projectServices
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

            const { projects } = await this.projectServices._find(+id)

            super.setResponseSuccess({
                res,
                status: 200,
                data: {
                    space,
                    projects
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async createSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id!;

            const { team, ...space } = await this.spaceServices.create(id, req.body)
            super.setResponseSuccess({
                res,
                status: 201,
                message: "Space are created",
                data: { space }
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
