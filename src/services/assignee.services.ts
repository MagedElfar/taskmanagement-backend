import { AssigneeRepository, IAssignee } from './../model/assignee.model';
import { Inject, Service } from "typedi";

@Service()
export default class AssigneeServices {
    private readonly assigneeRepository: AssigneeRepository;


    constructor(
        @Inject() assigneeRepository: AssigneeRepository,


    ) {
        this.assigneeRepository = assigneeRepository;


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

}


