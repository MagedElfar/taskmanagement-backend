import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_space.routes";
import { Inject } from "typedi";
import SpaceServices from "../services/space.services";


export default class SpaceController extends Controller {
    protected routes: APIRoute[];
    private readonly spaceServices: SpaceServices


    constructor(
        path: string,
        @Inject() spaceServices: SpaceServices
    ) {
        super(path);
        this.routes = routes(this);
        this.spaceServices = spaceServices
    }

    async getSpacesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;
            const { limit = 10, page = 1, term = "" } = req.query

            const space = await this.spaceServices.find({
                userId,
                limit: +limit,
                page: +page,
                term: term.toString()
            });

            console.log(space)
            super.setResponseSuccess({
                res,
                status: 200,
                data: { space }
            })

        } catch (error) {
            next(error)
        }
    };


    async getSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.params.id;

            const space = await this.spaceServices.findOne(+id);

            super.setResponseSuccess({
                res,
                status: 200,
                data: { space }
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
