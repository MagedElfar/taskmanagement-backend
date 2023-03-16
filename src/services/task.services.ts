import { AssigneeRepository, IAssignee } from './../model/assignee.model';
import { TakRepository, ITask } from './../model/task.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import TeamServices from './team.service';
import { Role } from "../model/team.model";
import TakPermission from '../middleware/task-permissions.middleware';
import AssigneeServices from './assignee.services';

@Service()
export default class TaskServices {
    private readonly taskRepo: TakRepository;
    private readonly takPermission: TakPermission;
    private readonly assigneeServices: AssigneeServices;
    private readonly teamService: TeamServices


    constructor(
        @Inject() taskRepo: TakRepository,
        @Inject() takPermission: TakPermission,
        @Inject() assigneeServices: AssigneeServices,
        @Inject() teamService: TeamServices
    ) {
        this.taskRepo = taskRepo;
        this.takPermission = takPermission;
        this.assigneeServices = assigneeServices;
        this.teamService = teamService
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


    async create(userId: number, data: Partial<ITask>) {
        try {

            const hasPermission = await this.takPermission.userPermission(data.spaceId!, userId);

            if (!hasPermission) throw setError(403, "Forbidden")

            return this.taskRepo.create({
                ...data,
                userId
            })
        } catch (error) {
            throw error;
        }
    }

    async createSubTask(userId: number, data: Partial<ITask>) {
        try {

            await this.checkTask({ id: data.projectId, spaceId: data.spaceId });

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
            const task = await this.checkTask(taskId)

            const hasPermission = await this.takPermission.adminPermission(task.spaceId, userId);

            if (!hasPermission && task.userId !== userId) throw setError(403, "Forbidden")

            return await this.taskRepo.update(taskId, data);

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

            const assign = await this.assigneeServices.findOne({
                taskId: data.taskId,
            });

            if (assign) throw setError(400, `task is already assign to ${assign.username}`);

            const member = await this.teamService.findOne(data.memberId!);

            const task = await this.taskRepo.findOne(data.taskId!);

            if (!member || !task || member.space !== task?.spaceId) throw setError(400, "can't assign the task for this user");

            await this.takPermission.adminPermission(task.spaceId, userId)

            return await this.assigneeServices.crate(data)

        } catch (error) {
            throw error;
        }
    }

    async unAssign(userId: number, assignmentId: number) {
        try {

            const assign = await this.assigneeServices.findOne(assignmentId);

            if (!assign) throw setError(400, `this user not assign for this task`);


            await this.takPermission.adminPermission(assign.spaceId, userId)

            return await this.assigneeServices.delete(assignmentId)

        } catch (error) {
            throw error;
        }
    }
}
