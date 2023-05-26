import { Inject, Service } from "typedi";
import { SpaceRepository } from '../model/space.model';


@Service()
export default class ReportServices {
    private readonly spaceRepo: SpaceRepository;


    constructor(
        @Inject() spaceRepo: SpaceRepository,
    ) {
        this.spaceRepo = spaceRepo;
    }

    async spaceReport(spaceId: number, option: { toDate?: string, fromDate?: string }) {
        try {

            return await this.spaceRepo.spaceReport(spaceId, option)

        } catch (error) {
            throw error
        }
    }

    async teamReport(spaceId: number, option: { toDate?: string, fromDate?: string }) {
        try {

            return await this.spaceRepo.spaceTeamReport(spaceId, option);

        } catch (error) {
            throw error
        }
    }
}
