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

    async getTasksHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const { limit = 10, page = 1, term = "", user, space, orderBy = "created_at", order = "asc" } = req.query;

            const userId = req.user?.id!;

            const tasks = await this.taskServices.find({
                userId,
                limit: +limit,
                page: +page,
                term: term.toString(),
                orderBy: orderBy?.toString(),
                order: order.toString(),
                space: space ? +space : undefined,
                user
            });

            super.setResponseSuccess({
                res,
                status: 200,
                data: { tasks }
            })

        } catch (error) {
            next(error)
        }
    };

    async createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            let task;

            if (req.body?.parentId) {
                console.log("dun")
                task = await this.taskServices.createSubTask(userId, req.body)
            } else {
                task = await this.taskServices.create(userId, req.body)
            }



            super.setResponseSuccess({
                res,
                status: 201,
                data: { task }
            })

        } catch (error) {
            next(error)
        }
    };

    async getTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.findOne(userId, +id!)

            super.setResponseSuccess({
                res,
                status: 200,
                data: { task }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.update(userId, +id!, req.body)

            super.setResponseSuccess({
                res,
                status: 200,
                data: { task }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.delete(userId, +id!)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };

    async assignTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const assign = await this.taskServices.assign(userId, req.body)

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

            await this.taskServices.unAssign(userId, +id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };
}
