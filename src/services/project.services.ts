import { ProjectRepository, IProject } from './../model/project.model';
import { Inject, Service } from "typedi";

@Service()
export default class ProjectServices {
    private readonly projectRepo: ProjectRepository;


    constructor(
        @Inject() projectRepo: ProjectRepository,
    ) {
        this.projectRepo = projectRepo;
    }

    QueryServices() {
        return this.projectRepo.qb()
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
            return await this.projectRepo.update(id, data)
        } catch (error) {
            throw error
        }
    }

    async delete(userId: number, id: number) {
        try {
            return await this.projectRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}
