import { FindProjectDto, CreateProjectDto, UpdateProjectDto } from './../dto/project.dto';
import { autoInjectable, container } from 'tsyringe';
import { ProjectRepository, IProject } from './../model/project.model';

export interface IProjectServices {
    find(findProjectDto: FindProjectDto): Promise<{ projects: IProject[], count: number }>;
    _find(spaceId: number): Promise<IProject>;
    findOne(id: number | Partial<IProject>): Promise<IProject>;
    delete(id: number): Promise<void>;
    create(createProjectDto: CreateProjectDto): Promise<IProject>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<IProject>
}

@autoInjectable()
export class ProjectServices implements IProjectServices {
    private readonly projectRepo: ProjectRepository;


    constructor(
        projectRepo: ProjectRepository,
    ) {
        this.projectRepo = projectRepo;
    }

    QueryServices() {
        return this.projectRepo.qb()
    }

    async _find(spaceId: number) {
        try {
            return await this.projectRepo.find({ spaceId }, {})
        } catch (error) {
            throw error
        }
    }

    async find(findProjectDto: FindProjectDto) {
        try {
            const { spaceId, ...querySearch } = findProjectDto;
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


    async create(createProjectDto: CreateProjectDto) {
        try {

            return await this.projectRepo.create(createProjectDto)

        } catch (error) {
            throw error;
        }
    }

    async update(id: number, updateProjectDto: UpdateProjectDto) {
        try {
            return await this.projectRepo.update(id, updateProjectDto)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            await this.projectRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}


container.register("IProjectServices", { useClass: ProjectServices })