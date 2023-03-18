import { ProjectRepository, IProject } from './../model/project.model';
import { Inject, Service } from "typedi";
import TeamServices from './team.service';
import { Role } from "../model/team.model";
import TaskPermission from '../middleware/task-permissions.middleware';
import { setError } from '../utils/error-format';

@Service()
export default class ProjectServices {
    private readonly projectRepo: ProjectRepository;
    private readonly taskPermission: TaskPermission


    constructor(
        @Inject() projectRepo: ProjectRepository,
        @Inject() taskPermission: TaskPermission
    ) {
        this.projectRepo = projectRepo;
        this.taskPermission = taskPermission
    }

    async _find(spaceId: number) {
        try {
            return await this.projectRepo.find({ spaceId }, {
                limit: 3,
                page: 1
            })
        } catch (error) {
            throw error
        }
    }

    async find(userId: number, spaceId: number, querySearch: { limit: number, page: number, term: string }) {
        try {
            const hasPermission = await this.taskPermission.userPermission(spaceId!, userId)

            if (!hasPermission) throw setError(403, "Forbidden")

            return await this.projectRepo.find({ spaceId }, querySearch)
        } catch (error) {
            throw error
        }
    }




    async findOne(id: number | Partial<IProject>) {
        try {

            return await this.projectRepo.findOne(id)

        } catch (error) {
            throw error;
        }
    }


    async create(userId: number, data: Partial<IProject>) {
        try {

            const hasPermission = await this.taskPermission.userPermission(data.spaceId!, userId)

            if (!hasPermission) throw setError(403, "Forbidden")

            return await this.projectRepo.create({
                ...data,
                userId
            })

        } catch (error) {
            throw error;
        }
    }

    async update(userId: number, id: number, data: Partial<IProject>) {
        try {
            const project = await this.projectRepo.findOne({ id })

            if (!project) throw setError(404, "not found")

            const hasPermission = await this.taskPermission.userPermission(project.spaceId!, userId)

            if (!hasPermission) throw setError(403, "Forbidden")

            return await this.projectRepo.update(id, data)
        } catch (error) {
            throw error
        }
    }

    async delete(userId: number, id: number) {
        try {
            const project = await this.projectRepo.findOne({ id })

            if (!project) throw setError(404, "not found")

            const hasPermission = await this.taskPermission.adminPermission(project.spaceId!, userId)

            if (!hasPermission) throw setError(403, "Forbidden")

            return await this.projectRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}
