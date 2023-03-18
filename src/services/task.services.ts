import { AssigneeRepository, IAssignee } from './../model/assignee.model';
import { TakRepository, ITask, TaskStatus } from './../model/task.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import TeamServices from './team.service';
import { Role } from "../model/team.model";
import TakPermission from '../middleware/task-permissions.middleware';
import AssigneeServices from './assignee.services';
import ActivityServices from './activity.services';
import ProjectServices from './project.services';

@Service()
export default class TaskServices {
    private readonly taskRepo: TakRepository;
    private readonly takPermission: TakPermission;
    private readonly assigneeServices: AssigneeServices;
    private readonly teamService: TeamServices;
    private readonly activityServices: ActivityServices;
    private readonly projectServices: ProjectServices



    constructor(
        @Inject() taskRepo: TakRepository,
        @Inject() takPermission: TakPermission,
        @Inject() assigneeServices: AssigneeServices,
        @Inject() teamService: TeamServices,
        @Inject(type => ActivityServices) activityServices: ActivityServices,
        @Inject() projectServices: ProjectServices

    ) {
        this.taskRepo = taskRepo;
        this.takPermission = takPermission;
        this.assigneeServices = assigneeServices;
        this.teamService = teamService;
        this.activityServices = activityServices,
            this.projectServices = projectServices
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

    async getTask(userId: number, taskId: number) {
        try {
            const task = await this.taskRepo.findTask(taskId);

            if (!task) throw setError(404, "not found")

            const hasPermission = await this.takPermission.userPermission(task.spaceId, userId);

            if (!hasPermission) throw setError(403, "Forbidden")

            return task;
        } catch (error) {
            throw error;
        }
    }

    async find(querySearch: {
        limit: number,
        term: string,
        page: number,
        userId: number,
        space?: number,
        project?: number,
        user: any,
        orderBy: string,
        order: string,
        status: string
    }) {
        try {

            if (querySearch?.space) {
                const { space, userId } = querySearch
                const hasPermission = await this.takPermission.userPermission(space, userId);
                if (!hasPermission) throw setError(403, "Forbidden")
            }

            return await this.taskRepo.find({}, querySearch)
        } catch (error) {
            throw error
        }
    }

    async create(userId: number, data: Partial<ITask>) {
        try {

            const hasPermission = await this.takPermission.userPermission(data.spaceId!, userId);

            if (!hasPermission) throw setError(403, "Forbidden")


            if (data.projectId) {
                const project = await this.projectServices.findOne({
                    id: data.projectId,
                    spaceId: data.spaceId
                });

                if (!project) throw setError(404, "project not found")
            }

            const task = await this.taskRepo.create({
                ...data,
                userId
            })

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: "created the task",
                user1_Id: userId
            })

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
            const task = await this.checkTask(taskId);

            const hasPermission = await this.takPermission.userPermission(task.spaceId, userId);

            if (!hasPermission) throw setError(403, "Forbidden")

            return task;
        } catch (error) {
            throw error;
        }
    }

    async update(userId: number, taskId: number, data: Partial<ITask>) {
        try {
            let task = await this.checkTask(taskId)

            const hasPermission = await this.takPermission.adminPermission(task.spaceId, userId);

            if (!hasPermission && task.userId !== userId) throw setError(403, "Forbidden");

            if (data.projectId) {
                const project = await this.projectServices.findOne({
                    id: data.projectId,
                    spaceId: data.spaceId
                });

                console.log(project)


                if (!project) throw setError(404, "project not found")
            }


            task = await this.taskRepo.update(taskId, data);

            await this.activityServices.addActivity({
                taskId: task.id,
                activity: "update the task",
                user1_Id: userId
            })

        } catch (error) {
            throw error;
        }
    }


    async updateStatus(userId: number, taskId: number, status: TaskStatus) {
        try {
            let task = await this.checkTask(taskId)

            await this.getTask(userId, taskId);

            task = await this.taskRepo.update(taskId, {
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

    async delete(userId: number, taskId: number) {
        try {

            const task = await this.checkTask(taskId)

            const hasPermission = await this.takPermission.adminPermission(task.spaceId, userId);

            if (!hasPermission && task.userId !== userId) throw setError(403, "Forbidden")

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

            const task = await this.taskRepo.findOne(data.taskId!);

            if (!member || !task || member.space !== task?.spaceId) throw setError(400, "can't assign the task for this user");

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


            if (!assign) throw setError(400, `this user not assign for this task`);

            const hasPermission = await this.takPermission.adminPermission(assign.spaceId, userId)

            if (!hasPermission) throw setError(403, "Forbidden")

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
