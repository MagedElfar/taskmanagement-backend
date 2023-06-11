import { CreateSpaceDto, FindSpaceDto, UpdateSpaceDto } from './../dto/space.dto';
import { setError } from '../utils/error-format';
import { ISpace, SpaceRepository } from '../model/space.model';
import { ITeamServices } from './team.service';
import { Role } from "../model/team.model";
import { autoInjectable, container, inject } from "tsyringe";

export interface ISpaceServices {
    find(findSpaceDto: FindSpaceDto): Promise<{ spaces: ISpace[], count: number }>;
    findOne(id: number): Promise<ISpace>;
    create(createSpaceDto: CreateSpaceDto): Promise<ISpace>
    update(id: number, updateSpaceDto: UpdateSpaceDto): Promise<ISpace>
    delete(id: number): Promise<void>
}

@autoInjectable()
export class SpaceServices implements ISpaceServices {

    private readonly spaceRepo: SpaceRepository;
    private readonly tramServices: ITeamServices

    constructor(
        spaceRepo: SpaceRepository,
        @inject("ITeamServices") tramServices: ITeamServices
    ) {
        this.spaceRepo = spaceRepo;
        this.tramServices = tramServices
    }

    async find(querySearch: { limit: number, term?: string, page: number, userId: number }) {
        try {
            return await this.spaceRepo.find({}, querySearch)
        } catch (error) {
            throw error
        }
    }


    async findOne(id: number) {
        try {
            const isExist = await this.spaceRepo.isExist({ id })

            if (!isExist) throw setError(404, "space not found");

            return await this.spaceRepo.findOne(id)

        } catch (error) {
            throw error;
        }
    }


    async create(createSpaceDto: CreateSpaceDto) {
        try {

            const space = await this.spaceRepo.create(createSpaceDto);

            await this.tramServices.create({
                userId: createSpaceDto.owner,
                space: space.id,
                role: Role.OWNER
            })

            return space
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, updateSpaceDto: UpdateSpaceDto) {
        try {
            const isExist = await this.spaceRepo.isExist({ id })

            if (!isExist) throw setError(404, "space not found")

            return await this.spaceRepo.update(id, updateSpaceDto)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            const isExist = await this.spaceRepo.isExist({ id })

            if (!isExist) throw setError(404, "space not found")

            await this.spaceRepo.delete(id)

            return
        } catch (error) {
            throw error
        }
    }
}

container.register("ISpaceServices", { useClass: SpaceServices });

const spaceService = container.resolve(SpaceServices);

export default spaceService