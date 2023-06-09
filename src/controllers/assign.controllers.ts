import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_assigne.routes";
import { Inject } from "typedi";
import AssigneeServices from "../services/assignee.services";

export default class AssignController extends Controller {
    protected routes: APIRoute[];
    private readonly assigneeServices: AssigneeServices;

    constructor(
        path: string,
        @Inject() assigneeServices: AssigneeServices
    ) {
        super(path);
        this.routes = routes(this);
        this.assigneeServices = assigneeServices;
    }



    async assignTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { assign, member } = await this.assigneeServices.assign(req.body)

            res.locals.assign = assign;
            res.locals.member = member;

            super.setResponseSuccess({
                res,
                status: 201,
                data: { assign }
            })

        } catch (error) {
            next(error)
        }
    };

    async unassignTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            const assign = await this.assigneeServices.unAssign(+id)

            res.locals.assign = assign
            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    }
}
