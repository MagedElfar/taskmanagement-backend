import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_task.routes";
import { Inject } from "typedi";
import TaskServices from "../services/task.services";


export default class TaskController extends Controller {
    protected routes: APIRoute[];
    private readonly taskServices: TaskServices


    constructor(
        path: string,
        @Inject() taskServices: TaskServices
    ) {
        super(path);
        this.routes = routes(this);
        this.taskServices = taskServices
    }

    async createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const user = req.user;

            super.setResponseSuccess({
                res,
                status: 201,
            })

        } catch (error) {
            next(error)
        }
    };
}
