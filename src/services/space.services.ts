import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { ISpace, SpaceRepository } from '../model/space.model';
import TeamServices from './team.service';
import { Role } from "../model/team.model";

@Service()
export default class SpaceServices {
    private readonly spaceRepo: SpaceRepository;
    private readonly tramServices: TeamServices


    constructor(
        @Inject() spaceRepo: SpaceRepository,
        @Inject() tramServices: TeamServices
    ) {
        this.spaceRepo = spaceRepo;
        this.tramServices = tramServices
    }

    async find(querySearch: { limit: number, term: string, page: number, userId: number }) {
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


    async create(owner: number, data: Partial<ISpace>) {
        try {

            const space = await this.spaceRepo.create({
                ...data,
                owner
            });

            await this.tramServices.create(owner, {
                space: space.id,
                role: Role.OWNER
            })

            return space
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<ISpace>) {
        try {
            const isExist = await this.spaceRepo.isExist({ id })

            if (!isExist) throw setError(404, "space not found")

            return await this.spaceRepo.update(id, data)
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            const isExist = await this.spaceRepo.isExist({ id })

            if (!isExist) throw setError(404, "space not found")

            return await this.spaceRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}
