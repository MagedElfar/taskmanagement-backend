import { TakRepository } from './../model/task.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import TeamServices from './team.service';
import { Role } from "../model/team.model";

@Service()
export default class TaskServices {
    private readonly taskRepo: TakRepository;
    private readonly tramServices: TeamServices


    constructor(
        @Inject() tramServices: TeamServices,
        @Inject() taskRepo: TakRepository
    ) {
        this.taskRepo = taskRepo;
        this.tramServices = tramServices
    }


    // async create(owner: number, data: Partial<ISpace>) {
    //     try {

    //         const space = await this.spaceRepo.create({
    //             ...data,
    //             owner
    //         });

    //         await this.tramServices.create(owner, {
    //             space: space.id,
    //             role: Role.OWNER
    //         })

    //         return space
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}
