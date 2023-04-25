import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_task.routes";
import { Inject } from "typedi";
import TaskServices from "../services/task.services";
import TaskAttachmentServices from "../services/task_attachments.services";
import ActivityServices from "../services/activity.services";


export default class TaskController extends Controller {
    protected routes: APIRoute[];
    private readonly taskServices: TaskServices;
    private readonly taskAttachmentServices: TaskAttachmentServices;
    private readonly activityServices: ActivityServices

    constructor(
        path: string,
        @Inject() taskServices: TaskServices,
        @Inject() taskAttachmentServices: TaskAttachmentServices,
        @Inject() activityServices: ActivityServices,

    ) {
        super(path);
        this.routes = routes(this);
        this.taskServices = taskServices;
        this.taskAttachmentServices = taskAttachmentServices;
        this.activityServices = activityServices
    }

    async getTasksHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const tasks = await this.taskServices.find({
                ...req.query,
                userId
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
                task = await this.taskServices.createSubTask(userId, req.body)
            } else {
                task = await this.taskServices.create(userId, req.body)
            }



            super.setResponseSuccess({
                res,
                status: 201,
                data: { task }
            })

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: "created the task",
                user1_Id: userId
            })

        } catch (error) {
            next(error)
        }
    };

    async getTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.findOne(userId, +id!);

            const subTasks = await this.taskServices.find({ parentId: +id! });

            const attachments = await this.taskAttachmentServices.find(task.id)

            const activities = await this.activityServices._find(+id, {
                limit: 5,
                page: 1
            })


            super.setResponseSuccess({
                res,
                status: 200,
                data: {
                    task,
                    attachments,
                    subTasks,
                    activities
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.update(+id!, req.body)

            super.setResponseSuccess({
                res,
                status: 200,
                data: { task }
            })

            const data = req.body;

            const { spaceId, projectId, ...others } = data;

            await Promise.all(Object.keys(others).map(async (key: string) => {
                if (key === "due_date" && data[key] === null) {
                    return await this.activityServices.addActivity({
                        taskId: task.id,
                        activity: `change task ${key} to no due date`,
                        user1_Id: userId
                    })
                }
                await this.activityServices.addActivity({
                    taskId: task.id,
                    activity: `change task ${key} to ${data[key]}`,
                    user1_Id: userId
                })

            }))

        } catch (error) {
            next(error)
        }
    };

    async updateTaskStatusHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            await this.taskServices.updateStatus(+id!, req.body.status)

            super.setResponseSuccess({
                res,
                status: 200,
            })

            await this.activityServices.addActivity({
                taskId: +id,
                activity: `update task status to ${req.body.status}`,
                user1_Id: userId
            })

        } catch (error) {
            next(error)
        }
    };

    async updateTaskOrderHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            await this.taskServices.updateTaskStatusWithOrder(+id!, req.body.status, req.body.position)

            super.setResponseSuccess({
                res,
                status: 200,
            })

            await this.activityServices.addActivity({
                taskId: +id,
                activity: `update task status to ${req.body.status}`,
                user1_Id: userId
            })

        } catch (error) {
            next(error)
        }
    };

    async markTaskCompleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.markTaskCompleat(+id!)

            super.setResponseSuccess({
                res,
                status: 200,
            })

            await this.activityServices.addActivity({
                taskId: +id,
                activity: `mark this task ${task.is_complete ? "as complete" : "as incomplete"}`,
                user1_Id: userId
            })

        } catch (error) {
            next(error)
        }
    };

    async archiveTaskCompleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params;

            const task = await this.taskServices.archiveTask(+id!)

            super.setResponseSuccess({
                res,
                status: 200,
            })

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: `${task.is_archived ? "add this task to archive" : "remove this task from archive"}`,
                user1_Id: userId
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { id } = req.params;

            const task = await this.taskServices.delete(+id!)

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

            const { assign, member } = await this.taskServices.assign(req.body)

            super.setResponseSuccess({
                res,
                status: 201,
                data: { assign }
            })

            await this.activityServices.addActivity({
                taskId: req.body.taskId,
                activity: "assign the task to",
                user1_Id: userId,
                user2_Id: member.userId
            })


        } catch (error) {
            next(error)
        }
    };

    async unassignTaskHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            const assign = await this.taskServices.unAssign(+id)

            super.setResponseSuccess({
                res,
                status: 200,
            })

            await this.activityServices.addActivity({
                taskId: assign.taskId,
                activity: "unassign",
                user1_Id: userId,
                user2_Id: assign.userId
            })

        } catch (error) {
            next(error)
        }
    };

    async uploadAttachmentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const attachments = await this.taskAttachmentServices.addAttachment(userId, +req.body.taskId, req.files)

            super.setResponseSuccess({
                res,
                status: 201,
                data: {
                    attachments
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteAttachmentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            await this.taskAttachmentServices.deleteAtt(userId, +id)

            super.setResponseSuccess({
                res,
                status: 200
            })

        } catch (error) {
            next(error)
        }
    };


}
