import { GetTasksDto } from './../dto/task.dto';
import { ITaskAttachment } from './../model/task_attachments.model';
import { IAssignee } from './../model/assignee.model';
import { TakRepository, ITask, TaskStatus } from './../model/task.model';
import Container, { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import TeamServices from './team.service';
import AssigneeServices from './assignee.services';
import ActivityServices from './activity.services';
import ProjectServices from './project.services';
import TaskAttachmentServices from './task_attachments.services';
import StorageService from './storage.services';

@Service()
export default class TaskServices {
    private readonly taskRepo: TakRepository;
    private readonly assigneeServices: AssigneeServices;
    private readonly teamService: TeamServices;
    private readonly activityServices: ActivityServices;
    private readonly projectServices: ProjectServices;
    private readonly taskAttachmentServices: TaskAttachmentServices = Container.get(TaskAttachmentServices);
    private readonly storageService: StorageService = Container.get(StorageService)



    constructor(
        @Inject() taskRepo: TakRepository,
        @Inject() assigneeServices: AssigneeServices,
        @Inject() teamService: TeamServices,
        @Inject(type => ActivityServices) activityServices: ActivityServices,
        @Inject() projectServices: ProjectServices

    ) {
        this.taskRepo = taskRepo;
        this.assigneeServices = assigneeServices;
        this.teamService = teamService;
        this.activityServices = activityServices;
        this.projectServices = projectServices
    }

    QueryServices() {
        return this.taskRepo.qb()
    }

    private async checkTask(taskId: number | Partial<ITask>) {
        try {
            const task = await this.taskRepo.findOne(taskId)

            if (!task) throw setError(404, "not found");

            return task
        } catch (error) {
            throw error
        }
    }

    async find(getTasksDto: GetTasksDto) {
        try {
            return await this.taskRepo.find(getTasksDto)
        } catch (error) {
            throw error
        }
    }

    async create(userId: number, data: Partial<ITask>) {
        try {

            const { memberId = null, ...taskData } = data

            if (data.projectId) {
                const project = await this.projectServices.findOne({
                    id: data.projectId,
                    spaceId: data.spaceId
                });

                if (!project) throw setError(404, "project not found")
            }

            const task = await this.taskRepo.create({
                ...taskData,
                userId
            })

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: "created the task",
                user1_Id: userId
            })

            if (data?.memberId) {
                const assign = await this.assign(userId, {
                    taskId: task.id,
                    memberId: data.memberId
                })

                task.assignId = assign.id;
                task.assignToUserName = assign.username;
                task.assignToImage_url = assign.url
            }

            return task;
        } catch (error) {
            throw error;
        }
    }

    async createSubTask(userId: number, data: Partial<ITask>) {
        try {

            await this.checkTask({ id: data.parentId, spaceId: data.spaceId });

            return this.create(userId, data)

        } catch (error) {
            throw error;
        }
    }

    async findOne(userId: number, taskId: number) {
        try {
            const task = await this.taskRepo.findOne(taskId);
            return task;
        } catch (error) {
            throw error;
        }
    }

    async update(userId: number, taskId: number, data: Partial<ITask>) {
        try {


            if (data.projectId) {
                const project = await this.projectServices.findOne({
                    id: data.projectId,
                    spaceId: data.spaceId
                });


                if (!project) throw setError(404, "project not found")
            }


            const task = await this.taskRepo.update(taskId, data);

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

            return task
        } catch (error) {
            throw error;
        }
    }


    async updateStatus(userId: number, taskId: number, status: TaskStatus) {
        try {

            const task = await this.taskRepo.update(taskId, {
                status
            });

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: `update task status to ${status}`,
                user1_Id: userId
            })

        } catch (error) {
            throw error;
        }
    }

    async updateTaskStatusWithOrder(userId: number, taskId: number, status: TaskStatus, position: number) {
        try {
            const task = await this.QueryServices().where({ id: taskId }).first();

            if (!task) throw setError(404, "task not found");

            const currentStatus = task.status;

            if (currentStatus !== status) await this.updateStatus(userId, taskId, status)

            const currentPosition = task["position"];

            if (currentPosition === position) return

            const direction = position > currentPosition ? "down" : "up";

            await this.QueryServices()
                .where("tasks.id", "=", taskId)
                .andWhere("tasks.position", "=", position)
                .update({ position: 0 })

            if (direction === "up") {
                await this.taskRepo.ordersUpdate(`UPDATE tasks SET position = ( position + 1 )  WHERE  position >= ${position} AND position < ${currentPosition}`)
            } else {
                await this.taskRepo.ordersUpdate(`UPDATE tasks SET position = ( position - 1 )  WHERE  position > ${currentPosition} AND position <= ${position} `)
            }

            await this.QueryServices()
                .where("tasks.id", "=", taskId)
                // .andWhere("tasks.position", "=", 0)
                .update({ position })

        } catch (error) {
            throw error;
        }
    }

    async markTaskCompleat(userId: number, taskId: number) {
        try {

            let task = await this.QueryServices().where("id", "=", taskId).first();

            await this.taskRepo.update(taskId, {
                is_complete: !task.is_complete
            });

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: `mark this task ${!task.is_complete ? "as complete" : "as incomplete"}`,
                user1_Id: userId
            })

        } catch (error) {
            throw error;
        }
    }

    async delete(taskId: number) {
        try {

            const att: ITaskAttachment[] = await this.taskAttachmentServices.QueryServices()
                .where({ taskId }).select("*");

            if (att.length > 0) {
                await Promise.all(att.map(async (item: ITaskAttachment) => {
                    await this.storageService.delete(item.storage_key)
                }))
            }

            await this.taskRepo.delete(taskId);

            return;
        } catch (error) {
            throw error;
        }
    }

    async assign(userId: number, data: Partial<IAssignee>) {
        try {

            let assign = await this.assigneeServices.findOne({
                taskId: data.taskId,
            });

            if (assign) throw setError(400, `task is already assign to ${assign.username}`);

            const member = await this.teamService.findOne(data.memberId!);

            const task = await this.taskRepo.qb().where("id", "=", data.taskId!).first();

            if (!member || member.space !== task?.spaceId) throw setError(400, "can't assign the task for this user");

            assign = await this.assigneeServices.crate(data);

            await this.activityServices.addActivity({
                taskId: data.taskId,
                activity: "assign the task to",
                user1_Id: userId,
                user2_Id: member.userId
            })

            return assign;

        } catch (error) {
            throw error;
        }
    }

    async unAssign(userId: number, assignmentId: number) {
        try {

            const assign = await this.assigneeServices.findOne(assignmentId);

            await this.assigneeServices.delete(assignmentId)

            await this.activityServices.addActivity({
                taskId: assign.taskId,
                activity: "unassign",
                user1_Id: userId,
                user2_Id: assign.userId
            })

            return;

        } catch (error) {
            throw error;
        }
    }
}
