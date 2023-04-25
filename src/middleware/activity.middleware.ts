import { NextFunction, Request, Response } from "express";
import ActivityServices from "../services/activity.services";
import NotificationServices from "../services/notification.services";
import Container from "typedi";
import { ITask } from "../model/task.model";

class ActivityMiddleware {
    private readonly activityServices: ActivityServices;
    private test: string
    private readonly notificationServices: NotificationServices;

    constructor() {
        this.activityServices = Container.get(ActivityServices);
        this.notificationServices = Container.get(NotificationServices);
        this.test
    }

    changeOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    console.log("mmmm")
                    if (res.locals.task) {
                        const task: ITask = res.locals.task;
                        await this.activityServices.addActivity({
                            taskId: task.id,
                            activity: `update task status to ${req.body.status}`,
                            user1_Id: req.user?.id,
                        })
                    }
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }

    };


    createTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    if (res.locals.task) {
                        const task: ITask = res.locals.task;
                        await this.activityServices.addActivity({
                            taskId: task.id,
                            activity: "created the task",
                            user1_Id: req.user?.id
                        })

                        // if (task?.assignId) {
                        //     await this.notificationServices.addNotification({
                        //         sender: userId,
                        //         receiver: task.assignToId,
                        //         text: `assign <strong>${task.title}</strong> to you`,
                        //         task_id: task.id,
                        //         space_id: task.spaceId
                        //     })
                        // }

                    }
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    };

    updateTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    if (res.locals.task) {

                        const task: ITask = res.locals.task;

                        const data = req.body;

                        const { spaceId, projectId, ...others } = data;

                        await Promise.all(Object.keys(others).map(async (key: string) => {
                            if (key === "due_date" && data[key] === null) {
                                return await this.activityServices.addActivity({
                                    taskId: task.id,
                                    activity: `change task ${key} to no due date`,
                                    user1_Id: req.user?.id
                                })
                            }
                            await this.activityServices.addActivity({
                                taskId: task.id,
                                activity: `change task ${key} to ${data[key]}`,
                                user1_Id: req.user?.id
                            })

                        }))

                        // if (task?.assignId) {
                        //     await this.notificationServices.addNotification({
                        //         sender: userId,
                        //         receiver: task.assignToId,
                        //         text: `update <strong>${task.title}</strong>`,
                        //         task_id: task.id,
                        //         space_id: task.spaceId
                        //     })
                        // }
                    }
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    await this.activityServices.addActivity({
                        taskId: +req.params.id,
                        activity: `update task status to ${req.body.status}`,
                        user1_Id: req.user?.id
                    })
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    };

    markComplete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    if (res.locals.task) {
                        const task: ITask = res.locals.task;
                        await this.activityServices.addActivity({
                            taskId: task.id,
                            activity: `mark this task ${task.is_complete ? "as complete" : "as incomplete"}`,
                            user1_Id: req.user?.id
                        })

                        // if (task?.assignId) {
                        //     await this.notificationServices.addNotification({
                        //         sender: userId,
                        //         receiver: task.assignToId,
                        //         text: `mark <strong>${task.title}</strong> is ${task.is_complete ? "as complete" : "as incomplete"}`,
                        //         task_id: task.id,
                        //         space_id: task.spaceId
                        //     })
                        // }
                    }
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    };

    archiveTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    if (res.locals.task) {
                        const task: ITask = res.locals.task;
                        await this.activityServices.addActivity({
                            taskId: task.id,
                            activity: `${task.is_archived ? "add this task to archive" : "remove this task from archive"}`,
                            user1_Id: req.user?.id
                        })
                    }
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    };

    assignTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    await this.activityServices.addActivity({
                        taskId: req.body.taskId,
                        activity: "assign the task to",
                        user1_Id: req.user?.id,
                        user2_Id: res.locals.member.userId
                    })

                    // await this.notificationServices.addNotification({
                    //     sender: userId,
                    //     receiver: assign.userId,
                    //     text: `assign <strong>${assign.title}</strong> to you`,
                    //     task_id: assign.taskId,
                    //     space_id: assign.spaceId
                    // })
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    }

    unAssignTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await new Promise<void>((resolve) => {
                res.on('finish', async () => {
                    await this.activityServices.addActivity({
                        taskId: res.locals.assign.taskId,
                        activity: "unassign",
                        user1_Id: req.user?.id,
                        user2_Id: res.locals.assign.userId
                    })

                    // await this.notificationServices.addNotification({
                    //     sender: userId,
                    //     receiver: assign.userId,
                    //     text: `unassign <strong>${assign.title}</strong> from you`,
                    //     task_id: assign.taskId,
                    //     space_id: assign.spaceId
                    // })
                    resolve()
                });

                next();
            });

        } catch (error) {
            console.error('Error creating activity and notification:', error);
        }
    }
}

export default new ActivityMiddleware()