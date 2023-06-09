import { setError } from '../utils/error-format';
import { AssigneeRepository, IAssignee } from './../model/assignee.model';
import { Inject, Service } from "typedi";
import TeamServices from './team.service';
import { TakRepository } from '../model/task.model';

@Service()
export default class AssigneeServices {
    private readonly assigneeRepository: AssigneeRepository;
    private readonly teamService: TeamServices;
    private readonly taskRepo: TakRepository;

    constructor(
        @Inject() assigneeRepository: AssigneeRepository,
        @Inject() taskRepo: TakRepository,
        @Inject() teamService: TeamServices,
    ) {
        this.assigneeRepository = assigneeRepository;
        this.taskRepo = taskRepo;
        this.teamService = teamService;
    }

    QueryServices() {
        return this.assigneeRepository.qb()
    }

    async findOne(data: Partial<IAssignee> | number) {
        try {
            return await this.assigneeRepository.findOne(data)
        } catch (error) {
            throw error
        }
    }

    async crate(data: Partial<IAssignee>) {
        try {
            return await this.assigneeRepository.create(data)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            return await this.assigneeRepository.delete(id)
        } catch (error) {
            throw error
        }
    }

    async assign(data: Partial<IAssignee>) {
        try {

            let assign = await this.findOne({
                taskId: data.taskId,
            });

            if (assign) throw setError(400, `task is already assign to ${assign.username}`);

            const member = await this.teamService.findOne(data.memberId!);

            const task = await this.taskRepo.qb().where("id", "=", data.taskId!).first();

            if (!member || member.space !== task?.spaceId) throw setError(400, "can't assign the task for this user");

            assign = await this.crate(data);

            return { assign, member };

        } catch (error) {
            throw error;
        }
    }

    async unAssign(assignmentId: number) {
        try {

            const assign = await this.findOne(assignmentId);

            await this.delete(assignmentId)

            return assign

            return;

        } catch (error) {
            throw error;
        }
    }

}


